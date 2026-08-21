import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";

// Meta Lead Ads webhook. Meta calls GET once to verify the callback URL, then
// POSTs a `leadgen` change every time someone submits an instant form. The
// POST payload carries only a `leadgen_id` — the answers must be fetched from
// the Graph API — so this route resolves the lead and emails it on. Leads are
// otherwise stranded in Meta's Lead Center until someone exports a CSV.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Meta retries a failed delivery for up to ~36 hours, so a 5xx here is a
// deferral rather than a lost lead. A 2xx is final: only return one once the
// lead has actually reached an inbox.
const MAX_BODY_BYTES = 512_000;

type LeadFieldDatum = {
  name?: string;
  values?: unknown;
};

type GraphLead = {
  ad_id?: string;
  ad_name?: string;
  adset_name?: string;
  campaign_name?: string;
  created_time?: string;
  field_data?: LeadFieldDatum[];
  form_id?: string;
  id?: string;
  platform?: string;
};

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const clean = (value: unknown, maxLength = 500) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

// "full_name" / "phone_number" -> "Full name" / "Phone number".
const humanise = (name: string) => {
  const spaced = name.replace(/[_-]+/g, " ").trim();
  return spaced ? spaced.charAt(0).toUpperCase() + spaced.slice(1) : name;
};

const graphUrl = (path: string, params: Record<string, string>) => {
  // With no version segment the Graph API uses the app's configured default,
  // which keeps this working across Meta's quarterly version deprecations.
  // Pin one via META_GRAPH_VERSION when the app needs a specific version.
  const version = clean(process.env.META_GRAPH_VERSION, 10);
  const prefix = /^v\d+\.\d+$/.test(version) ? `/${version}` : "";
  const url = new URL(`https://graph.facebook.com${prefix}/${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url;
};

/**
 * Meta signs every POST with the app secret. Without this check anyone who
 * learns the URL could inject fabricated leads.
 */
const hasValidSignature = (rawBody: string, header: string | null) => {
  const appSecret = process.env.META_APP_SECRET;
  if (!appSecret || !header) return false;

  const [algorithm, digest] = header.split("=");
  if (algorithm !== "sha256" || !digest) return false;

  const expected = crypto
    .createHmac("sha256", appSecret)
    .update(rawBody, "utf8")
    .digest("hex");

  const received = Buffer.from(digest, "hex");
  const computed = Buffer.from(expected, "hex");
  if (received.length !== computed.length) return false;

  return crypto.timingSafeEqual(received, computed);
};

/** Resolves a leadgen_id into the submitted answers. */
const fetchLead = async (leadgenId: string): Promise<GraphLead | null> => {
  const accessToken = process.env.META_PAGE_ACCESS_TOKEN;
  if (!accessToken) {
    console.error("META_PAGE_ACCESS_TOKEN is not set for Meta lead retrieval");
    return null;
  }

  const url = graphUrl(encodeURIComponent(leadgenId), {
    access_token: accessToken,
    fields:
      "id,created_time,field_data,ad_id,ad_name,adset_name,campaign_name,form_id,platform",
  });

  try {
    const response = await fetch(url, { cache: "no-store" });
    const payload = (await response.json()) as
      | GraphLead
      | { error?: { message?: string; type?: string } };

    if (!response.ok || "error" in payload) {
      const detail =
        "error" in payload && payload.error
          ? `${payload.error.type ?? "GraphError"}: ${payload.error.message ?? "unknown"}`
          : `HTTP ${response.status}`;
      console.error(`Meta lead retrieval failed (${leadgenId}): ${detail}`);
      return null;
    }

    return payload as GraphLead;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Meta lead retrieval threw (${leadgenId}): ${message}`);
    return null;
  }
};

const buildRows = (
  leadgenId: string,
  pageId: string,
  lead: GraphLead | null,
): Array<[string, string]> => {
  const rows: Array<[string, string]> = [];

  // The answers first — they are the reason anyone opens this email.
  for (const datum of lead?.field_data ?? []) {
    const label = clean(datum.name, 120);
    const values = Array.isArray(datum.values)
      ? datum.values.map((v) => clean(v, 1_000)).filter(Boolean)
      : [];
    if (label && values.length) rows.push([humanise(label), values.join(", ")]);
  }

  if (!lead) {
    rows.push([
      "Warning",
      "The lead answers could not be retrieved from Meta. Open Lead Center and search the Lead ID below.",
    ]);
  }

  rows.push(
    ["Lead ID", leadgenId],
    ["Submitted", clean(lead?.created_time, 100)],
    ["Campaign", clean(lead?.campaign_name, 300)],
    ["Ad set", clean(lead?.adset_name, 300)],
    ["Ad", clean(lead?.ad_name, 300)],
    ["Ad ID", clean(lead?.ad_id, 100)],
    ["Form ID", clean(lead?.form_id, 100)],
    ["Platform", clean(lead?.platform, 60)],
    ["Page ID", pageId],
  );

  return rows.filter(([, value]) => value);
};

/** Pulls the lead's own email out of field_data so replies reach them. */
const findReplyTo = (lead: GraphLead | null) => {
  for (const datum of lead?.field_data ?? []) {
    if (!/email/i.test(clean(datum.name, 120))) continue;
    const values = Array.isArray(datum.values) ? datum.values : [];
    const address = clean(values[0], 254);
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) return address;
  }
  return undefined;
};

const sendLeadEmail = async (
  leadgenId: string,
  pageId: string,
  lead: GraphLead | null,
) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set for Meta lead notification");
    return false;
  }

  const to =
    process.env.META_LEADS_TO_EMAIL ||
    process.env.CONTACT_TO_EMAIL ||
    "sam@moonlanemedia.com";
  const from =
    process.env.CONTACT_FROM_EMAIL ||
    "Moonlane Media <contact@moonlanemedia.com.au>";

  const rows = buildRows(leadgenId, pageId, lead);
  const name =
    rows.find(([label]) => /^(full name|name|first name)$/i.test(label))?.[1] ??
    "";
  const campaign = clean(lead?.campaign_name, 300);
  const subject = [
    lead ? "New Meta lead" : "New Meta lead (details unavailable)",
    name,
    campaign,
  ]
    .filter(Boolean)
    .join(" — ");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#191919">
      <h2 style="margin:0 0 16px">${escapeHtml(subject)}</h2>
      <table style="border-collapse:collapse">
        ${rows
          .map(
            ([label, value]) =>
              `<tr>
                 <td style="padding:6px 16px 6px 0;font-weight:700;vertical-align:top">${escapeHtml(label)}</td>
                 <td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(value)}</td>
               </tr>`,
          )
          .join("")}
      </table>
    </div>`;
  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");

  const resend = new Resend(apiKey);
  try {
    const { error } = await resend.emails.send(
      {
        from,
        html,
        replyTo: findReplyTo(lead),
        subject,
        text,
        to,
      },
      // Meta re-delivers on any non-2xx, so guard against duplicate emails for
      // a lead whose first attempt failed after the send succeeded.
      { idempotencyKey: `meta-lead/${leadgenId}` },
    );

    if (error) {
      console.error(
        `Meta lead email failed (from=${from} to=${to}): ${error.name} - ${error.message}`,
      );
      return false;
    }
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Meta lead email transport failed: ${message}`);
    return false;
  }
};

// Meta's one-time callback verification.
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge") ?? "";

  const verifyToken = process.env.META_VERIFY_TOKEN;
  if (!verifyToken) {
    console.error("META_VERIFY_TOKEN is not set; refusing webhook verification");
    return new NextResponse("Not configured", { status: 500 });
  }

  const expected = Buffer.from(verifyToken);
  const received = Buffer.from(token ?? "");
  const tokenMatches =
    expected.length === received.length &&
    crypto.timingSafeEqual(expected, received);

  if (mode !== "subscribe" || !tokenMatches) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Meta expects the challenge echoed back verbatim as plain text.
  return new NextResponse(challenge, {
    headers: { "Cache-Control": "no-store", "Content-Type": "text/plain" },
    status: 200,
  });
}

export async function POST(request: Request) {
  if (!process.env.META_APP_SECRET) {
    console.error("META_APP_SECRET is not set; rejecting Meta webhook delivery");
    return new NextResponse("Not configured", { status: 500 });
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return new NextResponse("Bad Request", { status: 400 });
  }

  if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
    return new NextResponse("Payload Too Large", { status: 413 });
  }

  if (!hasValidSignature(rawBody, request.headers.get("x-hub-signature-256"))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  let payload: {
    entry?: Array<{
      changes?: Array<{ field?: string; value?: { leadgen_id?: string } }>;
      id?: string;
    }>;
    object?: string;
  };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const leads: Array<{ leadgenId: string; pageId: string }> = [];
  for (const entry of payload.entry ?? []) {
    const pageId = clean(entry.id, 100);
    for (const change of entry.changes ?? []) {
      if (change.field !== "leadgen") continue;
      const leadgenId = clean(change.value?.leadgen_id, 100);
      if (leadgenId) leads.push({ leadgenId, pageId });
    }
  }

  // Subscriptions can deliver other fields; acknowledge them so Meta stops.
  if (!leads.length) return NextResponse.json({ ok: true, processed: 0 });

  const results = await Promise.all(
    leads.map(async ({ leadgenId, pageId }) => {
      const lead = await fetchLead(leadgenId);
      // Send even when retrieval failed — a bare Lead ID beats silence.
      return sendLeadEmail(leadgenId, pageId, lead);
    }),
  );

  // Any failure returns 5xx so Meta redelivers; the idempotency key stops the
  // successful ones from emailing twice.
  if (results.some((sent) => !sent)) {
    return new NextResponse("Lead notification failed", { status: 500 });
  }

  return NextResponse.json({ ok: true, processed: results.length });
}

import { NextResponse } from "next/server";
import { Resend } from "resend";

// Contact-form endpoint. Both site forms (the contact-page `#project-form` and
// the site-wide side form `#ict-project-form`) POST here as JSON; the payload
// is validated and delivered via Resend. Never cached.
export const dynamic = "force-dynamic";

interface ContactPayload {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  message?: string;
  subject?: string;
  pageTitle?: string;
  pageUrl?: string;
  attribution?: {
    gclid?: string;
    gbraid?: string;
    wbraid?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmContent?: string;
    landingUrl?: string;
    referrer?: string;
    capturedAt?: string;
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const clean = (value: unknown, maxLength = 500) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return NextResponse.json(
      { error: "Email is not configured. Please try again later." },
      { status: 500 },
    );
  }

  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 254);
  const phone = clean(body.phone, 60);
  const company = clean(body.company, 160);
  const message = clean(body.message, 10_000);

  if (!name || !email || !phone) {
    return NextResponse.json(
      { error: "Please fill in your name, email and phone." },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  // The sender must be on a domain verified at resend.com/domains —
  // moonlanemedia.com.au is (DKIM + SPF, verified 2026-07-30). These defaults
  // deliberately avoid Resend's shared `onboarding@resend.dev`: it worked for
  // months, then Resend restricted it with no notice and every submission
  // started failing after the API had already returned success.
  const to = process.env.CONTACT_TO_EMAIL || "sam@moonlanemedia.com";
  const from =
    process.env.CONTACT_FROM_EMAIL ||
    "Moonlane Media <contact@moonlanemedia.com.au>";
  const subject = clean(body.subject, 160) || "New website enquiry";
  const pageTitle = clean(body.pageTitle, 300);
  const pageUrl = clean(body.pageUrl, 2_000);
  const attribution = body.attribution ?? {};
  const leadId = crypto.randomUUID();

  const rows: Array<[string, string]> = [
    ["Lead ID", leadId],
    ["Name", name],
    ["Company", company],
    ["Email", email],
    ["Phone", phone],
    ["Message", message],
    ["Page", [pageTitle, pageUrl].filter(Boolean).join(" - ")],
    ["Google click ID", clean(attribution.gclid, 500)],
    ["GBRAID", clean(attribution.gbraid, 500)],
    ["WBRAID", clean(attribution.wbraid, 500)],
    ["UTM source", clean(attribution.utmSource, 300)],
    ["UTM medium", clean(attribution.utmMedium, 300)],
    ["UTM campaign", clean(attribution.utmCampaign, 300)],
    ["UTM term", clean(attribution.utmTerm, 500)],
    ["UTM content", clean(attribution.utmContent, 500)],
    ["Original landing page", clean(attribution.landingUrl, 2_000)],
    ["Original referrer", clean(attribution.referrer, 2_000)],
    ["Attribution captured", clean(attribution.capturedAt, 100)],
  ].filter(([, v]) => v) as Array<[string, string]>;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#191919">
      <h2 style="margin:0 0 16px">${escapeHtml(subject)}</h2>
      <table style="border-collapse:collapse">
        ${rows
          .map(
            ([k, v]) =>
              `<tr>
                 <td style="padding:6px 16px 6px 0;font-weight:700;vertical-align:top">${escapeHtml(k)}</td>
                 <td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(v)}</td>
               </tr>`,
          )
          .join("")}
      </table>
    </div>`;

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: `${subject}: ${name}`,
    replyTo: email,
    html,
    text,
  });

  if (error) {
    // Log the full reason server-side — the generic user-facing string alone
    // makes misconfiguration (unverified domain, bad recipient) undiagnosable.
    console.error(
      `Resend send failed (from=${from} to=${to}): ${error.name} - ${error.message}`,
    );
    return NextResponse.json(
      {
        error: "Sorry, we couldn't send your message. Please try again.",
        ...(process.env.NODE_ENV !== "production" && { reason: error.message }),
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, id: data?.id, leadId });
}

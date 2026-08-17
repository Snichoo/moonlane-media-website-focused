import { NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const ACCEPTANCE_PATH = "/proposal/decode-tax-accountants";
const CLIENT_NAME = "Decode Tax Accountants";
const DEPOSIT = "$750";
const MAX_BODY_BYTES = 8_192;
const PROPOSAL_ID = "decode-tax-accountants";
const PROPOSAL_VERSION = "17 August 2026";
const TOTAL_INVESTMENT = "$1,499";
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ALLOWED_FIELDS = new Set(["clientRequestId"]);

type AcceptancePayload = {
  clientRequestId?: unknown;
};

const clean = (value: unknown, maxLength: number) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const json = (body: Record<string, unknown>, status = 200) =>
  NextResponse.json(body, {
    headers: { "Cache-Control": "no-store" },
    status,
  });

const isAllowedOrigin = (origin: string | null) => {
  if (!origin) return false;

  const configuredOrigin =
    process.env.PROPOSAL_ALLOWED_ORIGIN || "https://moonlanemedia.com.au";
  const allowedProductionOrigins = new Set([
    configuredOrigin.replace(/\/$/, ""),
    "https://moonlanemedia.com.au",
    "https://www.moonlanemedia.com.au",
  ]);

  if (allowedProductionOrigins.has(origin)) return true;
  if (process.env.NODE_ENV === "production") return false;

  try {
    const parsed = new URL(origin);
    return (
      parsed.protocol === "http:" &&
      (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1")
    );
  } catch {
    return false;
  }
};

export async function POST(request: Request) {
  if (!isAllowedOrigin(request.headers.get("origin"))) {
    return json({ error: "This request could not be verified." }, 403);
  }

  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.startsWith("application/json")) {
    return json({ error: "The request must be sent as JSON." }, 415);
  }

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return json({ error: "The request is too large." }, 413);
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return json({ error: "The request could not be read." }, 400);
  }

  if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
    return json({ error: "The request is too large." }, 413);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return json({ error: "The request contains invalid JSON." }, 400);
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return json({ error: "The acceptance details are invalid." }, 400);
  }

  const unknownField = Object.keys(parsed).find(
    (field) => !ALLOWED_FIELDS.has(field),
  );
  if (unknownField) {
    return json({ error: "The acceptance details are invalid." }, 400);
  }

  const body = parsed as AcceptancePayload;
  const clientRequestId = clean(body.clientRequestId, 36);

  if (!UUID_RE.test(clientRequestId)) {
    return json({ error: "Please refresh the page and try again." }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set for proposal acceptance");
    return json(
      { error: "Email notification is not configured. Please call 0414 134 081." },
      500,
    );
  }

  // Keep the message deterministic for Resend's 24-hour idempotency window.
  // The provider records the actual send time in the email metadata.
  const acceptanceId = clientRequestId;
  const pageUrl = `https://moonlanemedia.com.au${ACCEPTANCE_PATH}`;
  const to =
    process.env.PROPOSAL_ACCEPT_TO_EMAIL ||
    process.env.CONTACT_TO_EMAIL ||
    "sam@moonlanemedia.com";
  const from =
    process.env.CONTACT_FROM_EMAIL ||
    "Moonlane Media <contact@moonlanemedia.com.au>";
  const subject = `Proposal accepted — ${CLIENT_NAME} — ${TOTAL_INVESTMENT}`;
  const rows: Array<[string, string]> = [
    ["Status", "ACCEPTANCE NOTIFICATION"],
    ["Client", CLIENT_NAME],
    ["Proposal", PROPOSAL_ID],
    ["Proposal version", PROPOSAL_VERSION],
    ["Total investment", TOTAL_INVESTMENT],
    ["Deposit", DEPOSIT],
    ["Acceptance ID", acceptanceId],
    ["Proposal URL", pageUrl],
  ];

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#191919">
      <h2 style="margin:0 0 8px">${escapeHtml(subject)}</h2>
      <p style="margin:0 0 18px;color:#555">The Accept proposal button was selected on the Decode Tax Accountants proposal page. This notification does not verify the visitor's identity.</p>
      <table style="border-collapse:collapse">
        ${rows
          .map(
            ([label, value]) => `<tr>
              <td style="padding:6px 16px 6px 0;font-weight:700;vertical-align:top">${escapeHtml(label)}</td>
              <td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(value)}</td>
            </tr>`,
          )
          .join("")}
      </table>
    </div>`;
  const text = [
    subject,
    "",
    "The Accept proposal button was selected on the Decode Tax Accountants proposal page. This notification does not verify the visitor's identity.",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
  ].join("\n");

  const resend = new Resend(apiKey);
  let sendError: { message: string; name: string } | null = null;
  try {
    const { error } = await resend.emails.send(
      {
        from,
        html,
        subject,
        text,
        to,
      },
      { idempotencyKey: `proposal-accept/${PROPOSAL_ID}/${clientRequestId}` },
    );
    sendError = error;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Proposal acceptance transport failed: ${message}`);
    return json(
      { error: "The notification could not be sent. Please call 0414 134 081." },
      502,
    );
  }

  if (sendError) {
    console.error(
      `Proposal acceptance email failed (from=${from} to=${to}): ${sendError.name} - ${sendError.message}`,
    );
    return json(
      { error: "The notification could not be sent. Please call 0414 134 081." },
      502,
    );
  }

  return json({ ok: true });
}

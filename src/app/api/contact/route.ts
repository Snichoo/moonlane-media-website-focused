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
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

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

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const company = body.company?.trim() ?? "";
  const message = body.message?.trim() ?? "";

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

  const to = process.env.CONTACT_TO_EMAIL || "contact@moonlanemedia.com";
  const from =
    process.env.CONTACT_FROM_EMAIL || "Moonlane Media <onboarding@resend.dev>";
  const subject = body.subject?.trim() || "New website enquiry";
  const pageTitle = body.pageTitle?.trim() || "";
  const pageUrl = body.pageUrl?.trim() || "";

  const rows: Array<[string, string]> = [
    ["Name", name],
    ["Company", company],
    ["Email", email],
    ["Phone", phone],
    ["Message", message],
    ["Page", [pageTitle, pageUrl].filter(Boolean).join(" — ")],
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
    subject: `${subject} — ${name}`,
    replyTo: email,
    html,
    text,
  });

  if (error) {
    console.error("Resend send failed:", error.name, "-", error.message);
    return NextResponse.json(
      { error: "Sorry, we couldn't send your message. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, id: data?.id });
}

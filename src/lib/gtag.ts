/* Google Ads conversion tracking.

   The base tag (gtag.js) is loaded once in `app/layout.tsx`; it only reports
   page views. A Google Ads *conversion action* is not recorded until an event
   is explicitly fired with the `send_to` of that action:

     gtag('event', 'conversion', { send_to: 'AW-17920438382/AbCdEfGh12345' })

   The trailing segment is the conversion label, which is unique per conversion
   action and per Ads account. Copy it from Google Ads → Goals → Conversions →
   (your action) → "Tag setup" → "Install the tag yourself"; it is the part of
   `send_to` after the slash. Set it in `.env.local` / your host's env vars —
   see `.env.example`. Firing with a missing or wrong label records nothing. */

export const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID || "AW-17920438382";

export type ConversionAction = "formSubmit" | "phoneClick" | "emailClick";

/* NEXT_PUBLIC_* vars are inlined at build time by static analysis, so each one
   must appear as a complete literal expression — never build these keys
   dynamically or they resolve to undefined in the browser bundle. */
const LABELS: Record<ConversionAction, string | undefined> = {
  formSubmit: process.env.NEXT_PUBLIC_GADS_LABEL_FORM_SUBMIT,
  phoneClick: process.env.NEXT_PUBLIC_GADS_LABEL_PHONE_CLICK,
  emailClick: process.env.NEXT_PUBLIC_GADS_LABEL_EMAIL_CLICK,
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/* Fallback for the (unlikely) case that a click lands before the inline gtag
   bootstrap in layout.tsx has run. The official snippet queues each call's
   `arguments` object, so mirror that shape exactly rather than pushing a plain
   array — gtag.js reads these positionally when it finishes loading. */
function enqueue(...args: unknown[]) {
  const asArguments = function (): IArguments {
    // eslint-disable-next-line prefer-rest-params
    return arguments;
  } as (...a: unknown[]) => IArguments;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(asArguments(...args));
}

export interface ConversionOptions {
  /** Monetary worth of the lead, if you assign one in Google Ads. */
  value?: number;
  /** ISO currency for `value`. Defaults to AUD when a value is given. */
  currency?: string;
  /** Unique id so Google Ads can de-duplicate repeat submissions. */
  transactionId?: string;
}

/** Fire a Google Ads conversion. No-ops (with a dev warning) when unconfigured. */
export function trackConversion(
  action: ConversionAction,
  options: ConversionOptions = {},
): void {
  if (typeof window === "undefined") return;

  const label = LABELS[action];
  if (!label) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[gtag] No conversion label for "${action}" — the event was not sent. ` +
          `Set the matching NEXT_PUBLIC_GADS_LABEL_* var (see .env.example).`,
      );
    }
    return;
  }

  const payload: Record<string, unknown> = { send_to: `${GADS_ID}/${label}` };
  if (options.value !== undefined) {
    payload.value = options.value;
    payload.currency = options.currency || "AUD";
  }
  if (options.transactionId) payload.transaction_id = options.transactionId;

  const send = typeof window.gtag === "function" ? window.gtag : enqueue;
  send("event", "conversion", payload);
}

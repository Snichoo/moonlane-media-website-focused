import { contactHtml } from "@/sections/contact";
import * as base from "@/sections/markup";
import type { LocationConfig } from "@/lib/locations";

export type LocationHomeSections = Readonly<{
  header: string;
  sideForm: string;
  homeBanner: string;
  sectionTwo: string;
  ourWork: string;
  testimonials: string;
  sectionThree: string;
  partners: string;
  faq: string;
  confidenceBar: string;
  footer: string;
  mobileButton: string;
}>;

export type LocationContactSections = Readonly<{
  header: string;
  sideForm: string;
  body: string;
  footer: string;
  mobileButton: string;
}>;

function replaceOnce(
  html: string,
  search: string,
  replacement: string,
  label: string,
): string {
  if (!html.includes(search)) {
    throw new Error(`Could not find ${label} in the source markup.`);
  }

  return html.replace(search, replacement);
}

function scopeLinks(html: string, location: LocationConfig): string {
  return html
    .replaceAll(
      'href="/case-study/',
      'href="/landing-page/case-study/',
    )
    .replaceAll('href="/contact/"', `href="${location.contactPath}"`)
    .replaceAll('href="/contact"', `href="${location.contactPath}"`)
    .replaceAll('href="/#', `href="${location.basePath}#`)
    .replaceAll('href="/"', `href="${location.basePath}"`);
}

function setHiddenValue(html: string, name: string, value: string): string {
  const input = new RegExp(
    `(<input\\b(?=[^>]*\\bname="${name}")[^>]*\\bvalue=")[^"]*(")`,
    "g",
  );

  return html.replace(input, `$1${value}$2`);
}

function scopeForm(
  html: string,
  location: LocationConfig,
  pagePath: string,
  pageTitle: string,
): string {
  return setHiddenValue(
    setHiddenValue(
      setHiddenValue(html, "page-url", pagePath),
      "page-title",
      pageTitle,
    ),
    "email-subject",
    `${location.city} Website Inquiry`,
  );
}

function scopeShellSection(
  html: string,
  location: LocationConfig,
  pagePath: string,
  pageTitle: string,
): string {
  return scopeForm(scopeLinks(html, location), location, pagePath, pageTitle);
}

export function getLocationHomeSections(
  location: LocationConfig,
): LocationHomeSections {
  const pageTitle = `Web Design ${location.city}`;
  const homeBanner = replaceOnce(
    scopeLinks(base.homeBanner, location),
    "Australian Web Design &amp; Conversion Agency",
    `${location.city} Web Design &amp; Conversion Agency`,
    "homepage location heading",
  );

  let sectionTwo = replaceOnce(
    scopeLinks(base.sectionTwo, location),
    "local WEBSITE DESIGN + DIGITAL CONVERSION = BEST ROI RESULTS",
    `${location.city.toUpperCase()} WEBSITE DESIGN + DIGITAL CONVERSION = BEST ROI RESULTS`,
    "homepage location section heading",
  );
  sectionTwo = replaceOnce(
    sectionTwo,
    "<p>Web design is more than just looking good!",
    `<p>For ${location.city} businesses, web design is more than just looking good!`,
    "homepage location paragraph",
  );

  let faq = replaceOnce(
    scopeLinks(base.faq, location),
    "While we&#8217;re proudly based in Melbourne and Sydney, we work with clients all across Australia and even internationally.",
    location.serviceStatement,
    "location service statement",
  );
  faq = replaceOnce(
    faq,
    "Come have a chat with our friendly Australian team in our Melbourne or Sydney office &#8211; or jump on a quick video call",
    location.city === "Brisbane"
      ? "Jump on a quick video call with our Australian team to discuss your Brisbane business"
      : `Come have a chat with our friendly Australian team in our ${location.city} office &#8211; or jump on a quick video call`,
    "location contact invitation",
  );
  faq = replaceOnce(
    faq,
    "<span>Why choose Moonlane Media for web design in Australia?</span>",
    `<span>Why choose Moonlane Media for web design in ${location.city}?</span>`,
    "location claims FAQ question",
  );
  faq = replaceOnce(
    faq,
    "<p>There are plenty of reasons Australian businesses choose Moonlane Media. Unlike many other Australian agencies that try to do everything, we&#8217;re true web design specialists &#8211; experts in design psychology, conversion strategy and custom website development. We don&#8217;t just make websites look good &#8211; we make them work.</p>",
    `<p>Trusted by 100+ Aussie brands, our team brings 15+ years of web design experience to every custom, SEO-ready website build for ${location.city} businesses.</p>`,
    "location experience and trust claims",
  );
  faq = replaceOnce(
    faq,
    "<p>Our focus is simple: what gets business results. No gimmicks, no shortcuts and no chasing design trends just to look good. We&#8217;ve spent over 15+ years perfecting the craft of high-performing Australian web design, backed by real data and proven outcomes. In fact, we have a list of video testimonials live on our website that demonstrate our results since 2009.</p>",
    "<p>Our 100% satisfaction guarantee applies to the agreed project scope. Before work begins, we agree in writing on the included revisions and the remedy if the approved requirements are not met.</p>",
    "location satisfaction guarantee terms",
  );
  faq = replaceOnce(
    faq,
    "<p>Working with us is simple &#8211; fixed pricing, clear communication and no tech jargon or middlemen. You&#8217;ll work directly with our in-house designers, developers, and our Director himself, who&#8217;s been in digital for over 20 years.</p>",
    "<p>Pricing is transparent: your proposal confirms the agreed scope and price before work begins, with no hidden fees. Any extra work is discussed and approved first.</p>",
    "location transparent pricing terms",
  );

  return {
    header: scopeLinks(base.header, location),
    sideForm: scopeShellSection(
      base.sideForm,
      location,
      location.basePath,
      pageTitle,
    ),
    homeBanner,
    sectionTwo,
    ourWork: scopeLinks(base.ourWork, location),
    testimonials: scopeLinks(base.testimonials, location),
    sectionThree: scopeLinks(base.sectionThree, location),
    partners: scopeLinks(base.partners, location),
    faq,
    confidenceBar: scopeLinks(base.confidenceBar, location),
    footer: scopeShellSection(
      base.footer,
      location,
      location.basePath,
      pageTitle,
    ),
    mobileButton: scopeLinks(base.mobileButton, location),
  };
}
export function getLocationContactSections(
  location: LocationConfig,
): LocationContactSections {
  const pageTitle = `Web Design Enquiry — ${location.city}`;
  let body = replaceOnce(
    contactHtml,
    "Let's chat <br> <span class=\"highlight\">no strings attached</span>",
    `Let's chat about <br> <span class="highlight">${location.city} web design</span>`,
    "contact location banner",
  );
  body = replaceOnce(
    body,
    "Let&#8217;s point you in <br>\nthe <span class=\"highlight\">right direction</span>",
    `Let&#8217;s point your ${location.city} business in <br>\nthe <span class="highlight">right direction</span>`,
    "contact location form introduction",
  );
  body = scopeForm(body, location, location.contactPath, pageTitle);

  return {
    header: scopeLinks(base.header, location),
    sideForm: scopeShellSection(
      base.sideForm,
      location,
      location.contactPath,
      pageTitle,
    ),
    body,
    footer: scopeShellSection(
      base.footer,
      location,
      location.contactPath,
      pageTitle,
    ),
    mobileButton: scopeLinks(base.mobileButton, location),
  };
}

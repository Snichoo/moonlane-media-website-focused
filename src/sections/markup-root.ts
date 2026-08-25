// The main site at `/`: the extracted homepage markup with the claims the
// business no longer makes taken out.
//
//   - every "15+ / 16 / 20+ years" and "since 2009" becomes "5+ years" or drops
//   - no awards counts or award logos
//   - the oversized borrowed video-testimonial and three-row corporate-logo
//     sections are replaced by the root-only 9 June client-results design and a
//     one-line selection of smaller/local client logos
//   - quote cards beside the FAQ and on the contact page are removed
//
// Everything is derived from `./markup` through `replaceOnce` / `removeBlock`,
// which throw on a missed anchor, so re-running the extractor surfaces any
// reworded copy as a build failure rather than a silent regression.

import { removeBlock, removeParagraph, replaceOnce } from "@/lib/html-edit";
import type { HomeSections, ShellSections } from "@/types/sections";
import { contactHtml } from "./contact";
import * as base from "./markup";
import {
  partnersMarquee as rootPartners,
  testimonials as rootTestimonials,
} from "./root-social-proof";

export const header = base.header;
export const mobileButton = base.mobileButton;
export const ourWork = base.ourWork;
export const sectionThree = base.sectionThree;
export const testimonials = rootTestimonials;
export const partners = rootPartners;

/** The side form's 4th stat counted up to "80+ awards & mentions … since 2009". */
export const sideForm = removeBlock(
  base.sideForm,
  '<div class="single-item">',
  "Awards &amp; mentions across 4 different industries since 2009",
);

/** The hero's second CTA pointed at the removed testimonial slider. */
export const homeBanner = replaceOnce(
  base.homeBanner,
  '<a class="button" role="button" href="#testimonial-video-slider-section">Latest Client Results</a>',
  '<a class="button" role="button" href="#our-work-part">See Our Work</a>',
);

// The theme's WYSIWYG copy carries stray non-breaking spaces; they are spelled
// as \u00a0 escapes here so the anchor stays unambiguous in review and in diffs.
export const sectionTwo = replaceOnce(
  base.sectionTwo,
  "<p>With a dedicated team of <strong>15+ full-time experts</strong>, a strong Australian presence\u00a0and <strong>15+ years of insights</strong>, we&#8217;re honoured to have received<strong> 151+ 5 star Google reviews </strong>and <strong>80+ awards &amp; recognitions </strong>since 2009. This gives our clients specialist digital knowledge and a conversion framework that <em>significantly\u00a0</em>reduces their marketing wastage<strong>\u00a0</strong>and\u00a0<em>maximises</em> their online web design &amp; development engagement results.\u00a0</p>",
  "<p>With a dedicated team of <strong>full-time experts</strong>, a strong Australian presence\u00a0and <strong>5+ years of insights</strong>, we give our clients specialist digital knowledge and a conversion framework that <em>significantly\u00a0</em>reduces their marketing wastage<strong>\u00a0</strong>and\u00a0<em>maximises</em> their online web design &amp; development engagement results.\u00a0</p>",
);

export const confidenceBar = replaceOnce(
  base.confidenceBar,
  "<span>80+ awards and industry mentions since 2009</span>",
  "<span>Every project handled by our in-house Australian team</span>",
);

// The business trades from one Brisbane office. The extraction still carries
// the theme's two-office Melbourne/Sydney list, so both the footer and the
// contact page are collapsed to the real address. The ad tree
// (`markup-landing`) and the location pages (`markup-location`) derive from
// `./markup` directly and are deliberately left alone.
const OLD_OFFICE =
  '<a href="https://www.google.com.au/maps/place/101%20Collins%20Street%2C%20Melbourne%20VIC%203000/" rel="noopener" target="_blank">Level 27, 101 Collins Street, Melbourne VIC 3000</a>';
const NEW_OFFICE =
  '<a href="https://www.google.com.au/maps/place/77%20Hudson%20Road%2C%20Albion%20QLD%204010/" rel="noopener" target="_blank">77 Hudson Road, Albion QLD 4010</a>';
const SYDNEY_OFFICE = "264 George Street, Sydney NSW 2000";

/** The footer's row of award logos, then the two-office list collapsed to one. */
export const footer = removeParagraph(
  replaceOnce(
    removeBlock(base.footer, '<div class="bottom-logo-list-part">'),
    OLD_OFFICE,
    NEW_OFFICE,
  ),
  SYDNEY_OFFICE,
);

const faqEdits: ReadonlyArray<readonly [string, string]> = [
  [
    "<p>Over the past 16 years, we&#8217;ve worked on projects of every size",
    "<p>Over the past 5+ years, we&#8217;ve worked on projects of every size",
  ],
  [
    "<p>After 16 years and countless websites built,",
    "<p>After 5+ years and countless websites built,",
  ],
  [
    "<p>Start by looking at their past work, real results and overall Google Reviews. Have they helped",
    "<p>Start by looking at their past work and real results. Have they helped",
  ],
  [
    "<li>Choose proven experience. At Moonlane Media, we&#8217;ve spent over 15 years " +
      "analysing more than 60,000 websites (it&#8217;s actually almost 70,000 now) and have " +
      "earned 80+ industry awards and mentions for web design and development excellence. " +
      "Every Australian project",
    "<li>Choose proven experience. At Moonlane Media, we&#8217;ve spent 5+ years working out " +
      "what makes a website convert, not just what makes it look good. Every Australian project",
  ],
  [
    "In fact, every client will work with our Director, who has over 20+ years of experience in digital!</li>",
    "In fact, every client works directly with our Director.</li>",
  ],
  [
    "come chat with the Moonlane Media team in Australia. We&#8217;ve been helping Australian " +
      "businesses turn browsers into buyers since 2009!</p>",
    "come chat with the Moonlane Media team in Australia. We help Australian businesses turn " +
      "browsers into buyers!</p>",
  ],
  [
    "We&#8217;ve spent over 15+ years perfecting the craft of high-performing Australian web " +
      "design, backed by real data and proven outcomes. In fact, we have a list of video " +
      "testimonials live on our website that demonstrate our results since 2009.</p>",
    "We&#8217;ve spent 5+ years perfecting the craft of high-performing Australian web design, " +
      "backed by real data and proven outcomes.</p>",
  ],
  [
    "developers, and our Director himself, who&#8217;s been in digital for over 20 years.</p>",
    "developers and our Director himself.</p>",
  ],
];

/** Answers reworded, and the client quote card floated beside the column dropped. */
export const faq = faqEdits.reduce(
  (html, [find, replace]) => replaceOnce(html, find, replace),
  removeBlock(base.faq, '<div class="faq-testimonial-wrapper">'),
);

/** The contact page carried one more client quote card beside the office list. */
export const contactBody = replaceOnce(
  removeBlock(
    replaceOnce(
      removeBlock(contactHtml, '<div class="testimonial-content">'),
      OLD_OFFICE,
      NEW_OFFICE,
    ),
    '<div class="contact location">',
    SYDNEY_OFFICE,
  ),
  '<p class="sub-title">Melbourne &amp; Sydney</p>',
  '<p class="sub-title">Brisbane</p>',
);

export const shell: ShellSections = { header, sideForm, footer, mobileButton };

export const sections: HomeSections = {
  ...shell,
  homeBanner,
  sectionTwo,
  ourWork,
  testimonials,
  sectionThree,
  partners,
  faq,
  confidenceBar,
};

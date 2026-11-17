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

// Moonlane Media is Sam's own business, so the main site speaks in the first
// person ("I", "me") rather than as an agency team, and section two shows his
// cutout portrait and signature where the theme had a stock office-team photo.

/** Applies exact-text edits in order; each must match exactly once. */
const applyEdits = (html: string, edits: ReadonlyArray<readonly [string, string]>) =>
  edits.reduce((out, [find, replace]) => replaceOnce(out, find, replace), html);

export const header = base.header;
export const mobileButton = base.mobileButton;
export const ourWork = base.ourWork;
export const testimonials = rootTestimonials;
export const partners = rootPartners;

export const sectionThree = applyEdits(base.sectionThree, [
  [
    "We've handpicked our web design Australian family to be top-notch web designers, web developers, conversion specialists, business analysts, API integrators, project managers and digital strategists - we're true web purists.",
    "I&#8217;m a web specialist, not a generalist. Design, development, conversion strategy and integrations are all handled by me, so the person you talk to is the person building your site.",
  ],
  [
    '<a class="button side-form-open-trigger" role="button">Talk To Our Specialists</a>',
    '<a class="button side-form-open-trigger" role="button">Talk To Me</a>',
  ],
]);

/** The side form's 4th stat counted up to "80+ awards & mentions … since 2009". */
export const sideForm = replaceOnce(
  removeBlock(
    base.sideForm,
    '<div class="single-item">',
    "Awards &amp; mentions across 4 different industries since 2009",
  ),
  '<p class="h3-style">We help businesses stand out,',
  '<p class="h3-style">I help businesses stand out,',
);

/** The hero's second CTA pointed at the removed testimonial slider. */
export const homeBanner = applyEdits(base.homeBanner, [
  [
    '<a class="button" role="button" href="#testimonial-video-slider-section">Latest Client Results</a>',
    '<a class="button" role="button" href="#our-work-part">See My Work</a>',
  ],
  [
    '<h1 class="small-title">Australian Web Design &amp; Conversion Agency</h1>',
    '<h1 class="small-title">Australian Web Designer &amp; Conversion Specialist</h1>',
  ],
]);

const OFFICE_TEAM_PHOTO =
  '<span class="chr-video-poster"><img width="730" height="730" class="section-two-image" alt="Moonlane Media Web Design Team" title="Moonlane Media Web Design Team" src="/wp-content/uploads/2018/11/home-intro-2019.png" srcset="/wp-content/uploads/2018/11/home-intro-2019-600x600.png 600w, /wp-content/uploads/2018/11/home-intro-2019-150x150.png 150w, /wp-content/uploads/2018/11/home-intro-2019-100x100.png 100w, /wp-content/uploads/2018/11/home-intro-2019-270x270.png 270w, /wp-content/uploads/2018/11/home-intro-2019.png 730w"></span>';

/** Sam's cutout rising out of a circle, with his signature underneath. */
const FOUNDER_PORTRAIT =
  '<span class="chr-video-poster founder-portrait">' +
  '<span class="founder-portrait-circle" aria-hidden="true"></span>' +
  '<span class="founder-portrait-photo">' +
  '<img src="/images/founder/portrait-sam-800.webp" ' +
  'srcset="/images/founder/portrait-sam-800.webp 800w, /images/founder/portrait-sam-1200.webp 1200w, /images/founder/portrait-sam-1600.webp 1600w" ' +
  'sizes="(max-width: 767px) 80vw, 480px" width="800" height="1072" ' +
  'alt="Sam Newman, founder of Moonlane Media" loading="lazy" decoding="async">' +
  "</span>" +
  '<span class="founder-sign">' +
  '<img src="/images/founder/sam-signature.webp" alt="Sam&#8217;s signature" width="500" height="300" loading="lazy" decoding="async">' +
  '<span class="founder-sign-name">Sam Newman</span>' +
  '<span class="founder-sign-role">Founder, Moonlane Media</span>' +
  "</span></span>";

const SECTION_TWO_INTRO = [
  "<p>Web design is more than just looking good! We create <strong>highly engaging custom websites that make your phone ring</strong>. After all, your website is your ultimate sales tool &amp; best credibility check for confidence. Flexing our 3 key muscles of web design, web development and conversion experience, our Australian UI/UX specialists blend human behaviour “pre-suasion” psychology with technology to visually communicate your <em>true</em> value.</p>",
  "<p>Web design is more than just looking good! I build <strong>highly engaging custom websites that make your phone ring</strong>. After all, your website is your ultimate sales tool &amp; best credibility check for confidence. I bring web design, web development and conversion experience together, blending human behaviour “pre-suasion” psychology with technology to visually communicate your <em>true</em> value.</p>",
] as const;

const SECTION_TWO_TEAM_COPY =
  "<p>I&#8217;m Sam, and when you work with Moonlane Media you work with <strong>me directly</strong>, from the first call to launch day. No account managers and no hand-offs. With <strong>5+ years of insights</strong>, I give my clients specialist digital knowledge and a conversion framework that <em>significantly</em> reduces their marketing wastage and <em>maximises</em> their web design &amp; development results.</p>";

// The theme's WYSIWYG copy carries stray non-breaking spaces; they are spelled
// as \u00a0 escapes here so the anchor stays unambiguous in review and in diffs.
export const sectionTwo = applyEdits(base.sectionTwo, [
  [OFFICE_TEAM_PHOTO, FOUNDER_PORTRAIT],
  SECTION_TWO_INTRO,
  ['<a class="button" href="#our-work-part">Our Work</a>', '<a class="button" href="#our-work-part">My Work</a>'],
  [
    "<p>With a dedicated team of <strong>15+ full-time experts</strong>, a strong Australian presence\u00a0and <strong>15+ years of insights</strong>, we&#8217;re honoured to have received<strong> 151+ 5 star Google reviews </strong>and <strong>80+ awards &amp; recognitions </strong>since 2009. This gives our clients specialist digital knowledge and a conversion framework that <em>significantly\u00a0</em>reduces their marketing wastage<strong>\u00a0</strong>and\u00a0<em>maximises</em> their online web design &amp; development engagement results.\u00a0</p>",
    SECTION_TWO_TEAM_COPY,
  ],
]);

export const confidenceBar = applyEdits(base.confidenceBar, [
  [
    "<span>80+ awards and industry mentions since 2009</span>",
    "<span>Every project handled by me, start to finish</span>",
  ],
  ["<span>We know what makes people click</span>", "<span>I know what makes people click</span>"],
]);

// The business trades from one Brisbane office. The extraction still carries
// the theme's two-office Melbourne/Sydney list, so both the footer and the
// contact page are collapsed to the real address. The ad tree
// (`markup-landing`) and the location pages (`markup-location`) derive from
// `./markup` directly and are deliberately left alone.
const OLD_OFFICE =
  '<a href="https://www.google.com.au/maps/place/101%20Collins%20Street%2C%20Melbourne%20VIC%203000/" rel="noopener" target="_blank">Level 27, 101 Collins Street, Melbourne VIC 3000</a>';
const NEW_OFFICE =
  '<a href="https://www.google.com.au/maps/place/50%20Hudson%20Road%2C%20Albion%20QLD%204010/" rel="noopener" target="_blank">50 Hudson Road, Albion QLD 4010</a>';
const SYDNEY_OFFICE = "264 George Street, Sydney NSW 2000";

/** The footer's row of award logos, then the two-office list collapsed to one. */
export const footer = applyEdits(
  removeParagraph(
    replaceOnce(
      removeBlock(base.footer, '<div class="bottom-logo-list-part">'),
      OLD_OFFICE,
      NEW_OFFICE,
    ),
    SYDNEY_OFFICE,
  ),
  [
    ['<h2 class="small-title">contact us</h2>', '<h2 class="small-title">contact me</h2>'],
    [
      '<p class="sub-title">Drop us a line, <br>\n<span class="highlight">coffee’s on us</span>',
      '<p class="sub-title">Drop me a line, <br>\n<span class="highlight">coffee’s on me</span>',
    ],
  ],
);

// The FAQ answers, reworded so they come from Sam himself: no "team", no
// Director, no Melbourne/Sydney offices, and none of the theme's 15+ years,
// awards or Google-review claims.
const faqEdits: ReadonlyArray<readonly [string, string]> = [
  [
    'role="button">talk to our specialists</a>',
    'role="button">talk to me</a>',
  ],
  [
    "<p>Unlike many web design agencies in Australia, we combine creative design with marketing and conversion strategy. We don’t just deliver a website &#8211; we deliver a sales tool that helps you grow your business and track results.</p>",
    "<p>Unlike many web design agencies in Australia, I combine creative design with marketing and conversion strategy. I don&#8217;t just deliver a website, I deliver a sales tool that helps you grow your business and track results.</p>",
  ],
  [
    "<p>Our websites are built with one clear goal &#8211; to convert visitors into customers. We focus on",
    "<p>Every website I build has one clear goal: to convert visitors into customers. I focus on",
  ],
  [
    "<p>Absolutely. We build all our websites to be user-friendly",
    "<p>Absolutely. I build all my websites to be user-friendly",
  ],
  [
    "if you ever need something structural changed, our team can help and quote accordingly.</p>",
    "if you ever need something structural changed, I can help and quote accordingly.</p>",
  ],
  [
    "<p>Absolutely. We can assess your current site and determine whether a full rebuild or a strategic redesign will give you the best return. Often, we can reuse",
    "<p>Absolutely. I can assess your current site and determine whether a full rebuild or a strategic redesign will give you the best return. Often, I can reuse",
  ],
  [
    "<p>Over the past 16 years, we&#8217;ve worked on projects of every size, and we&#8217;ve got the process down to a fine art.</p>",
    "<p>Over the past 5+ years, I&#8217;ve worked on projects of every size, and I&#8217;ve got the process down to a fine art.</p>",
  ],
  [
    "<p>We&#8217;re always happy to help plan things out and give you a realistic timeframe &#8211; why not give us a call, and we can walk you through what&#8217;s possible.</p>",
    "<p>I&#8217;m always happy to help plan things out and give you a realistic timeframe. Why not give me a call, and I can walk you through what&#8217;s possible.</p>",
  ],
  [
    "<p>Psst. There are 3 tricks we can teach you to help speed things up (just ask us)</p>",
    "<p>Psst. There are 3 tricks I can teach you to help speed things up (just ask me)</p>",
  ],
  [
    "<p>After 16 years and countless websites built, we&#8217;ve seen just how much scope, functionality, and goals can vary. That&#8217;s why we don&#8217;t believe in guessing a price before understanding the full picture, and we&#8217;re even more than happy",
    "<p>After 5+ years and countless websites built, I&#8217;ve seen just how much scope, functionality, and goals can vary. That&#8217;s why I don&#8217;t believe in guessing a price before understanding the full picture, and I&#8217;m more than happy",
  ],
  [
    "<p>We&#8217;ve learned that accurate pricing only comes after",
    "<p>I&#8217;ve learned that accurate pricing only comes after",
  ],
  [
    "<p>At Moonlane Media, we have 2 web departments, and we take the time to understand your business first,",
    "<p>I take the time to understand your business first,",
  ],
  [
    "<p>And if we&#8217;re not the right fit, we&#8217;re always happy to point you in the right direction.</p>",
    "<p>And if I&#8217;m not the right fit, I&#8217;m always happy to point you in the right direction.</p>",
  ],
  ["<p>Yes, every website we create is fully responsive.", "<p>Yes, every website I create is fully responsive."],
  [
    "<p>Yes. All our websites are <strong>SEO-ready</strong> &#8211; including clean code,",
    "<p>Yes. All my websites are <strong>SEO-ready</strong>, including clean code,",
  ],
  ["on-page structure. We can also provide basic", "on-page structure. I can also provide basic"],
  [
    "after launch. We also have a plethora of specialist SEO partners that we can refer to.</p>",
    "after launch, and I have specialist SEO partners I can refer you to.</p>",
  ],
  [
    "<p>Yes, we offer ongoing <strong>support and maintenance plans</strong>.",
    "<p>Yes, I offer ongoing <strong>support and maintenance plans</strong>.",
  ],
  [
    "so you can stay focused on running your business while we handle the technical side.</p>",
    "so you can stay focused on running your business while I handle the technical side.</p>",
  ],
  [
    "<p>While we&#8217;re proudly based in Melbourne and Sydney, we work with clients all across Australia and even internationally. Our process is fully remote-friendly,",
    "<p>While I&#8217;m proudly based in Brisbane, I work with clients all across Australia and even internationally. My process is fully remote-friendly,",
  ],
  [
    "<p>At Moonlane Media, we believe great Australian web design",
    "<p>At Moonlane Media, I believe great Australian web design",
  ],
  [
    "web design strategy session, give us a bell and quote",
    "web design strategy session, give me a bell and quote",
  ],
  [
    "<p>Start by looking at their past work, real results and overall Google Reviews. Have they helped",
    "<p>Start by looking at their past work and real results. Have they helped",
  ],
  ["<p>A few insider tips from the Moonlane Media Australian team:</p>", "<p>A few insider tips from me:</p>"],
  [
    "<li>Choose proven experience. At Moonlane Media, we&#8217;ve spent over 15 years analysing more than 60,000 websites (it&#8217;s actually almost 70,000 now) and have earned 80+ industry awards and mentions for web design and development excellence. Every Australian project is handled by our in-house team, from UX design and development to psychology-led digital conversion audits and strategy.</li>",
    "<li>Choose proven experience. I&#8217;ve spent 5+ years working out what makes a website convert, not just what makes it look good. Every project is handled by me personally, from UX design and development to psychology-led conversion audits and strategy.</li>",
  ],
  [
    "<li>Get direct access to experts. You won&#8217;t get bounced around between salespeople or middle managers here &#8211; you&#8217;ll deal directly with our designers, developers and conversion specialists who live and breathe web performance. In fact, every client will work with our Director, who has over 20+ years of experience in digital!</li>",
    "<li>Get direct access to the expert. You won&#8217;t get bounced around between salespeople or middle managers here. You&#8217;ll deal directly with me, the person who designs and builds your site.</li>",
  ],
  [
    "While others chase design fads, we focus on what works &#8211; data, human behaviour and proven design standards that are built around our conversion framework",
    "While others chase design fads, I focus on what works: data, human behaviour and proven design standards built around my conversion framework",
  ],
  [
    "<p>Or simply put &#8211; come chat with the Moonlane Media team in Australia. We&#8217;ve been helping Australian businesses turn browsers into buyers since 2009!</p>",
    "<p>Or simply put, come and have a chat with me. I help Australian businesses turn browsers into buyers!</p>",
  ],
  [
    "Unlike many other Australian agencies that try to do everything, we&#8217;re true web design specialists &#8211; experts in design psychology, conversion strategy and custom website development. We don&#8217;t just make websites look good &#8211; we make them work.</p>",
    "Unlike many Australian agencies that try to do everything, I&#8217;m a true web design specialist: design psychology, conversion strategy and custom website development. I don&#8217;t just make websites look good, I make them work.</p>",
  ],
  [
    "<p>Our focus is simple: what gets business results. No gimmicks, no shortcuts and no chasing design trends just to look good. We&#8217;ve spent over 15+ years perfecting the craft of high-performing Australian web design, backed by real data and proven outcomes. In fact, we have a list of video testimonials live on our website that demonstrate our results since 2009.</p>",
    "<p>My focus is simple: what gets business results. No gimmicks, no shortcuts and no chasing design trends just to look good. I&#8217;ve spent 5+ years perfecting the craft of high-performing Australian web design, backed by real data and proven outcomes.</p>",
  ],
  [
    "<p>Working with us is simple &#8211; fixed pricing, clear communication and no tech jargon or middlemen. You&#8217;ll work directly with our in-house designers, developers, and our Director himself, who&#8217;s been in digital for over 20 years.</p>",
    "<p>Working with me is simple: fixed pricing, clear communication and no tech jargon or middlemen. You&#8217;ll work directly with me from start to finish.</p>",
  ],
  [
    "<p>But the best way to see if we’re a good fit? Come have a chat with our friendly Australian team in our Melbourne or Sydney office &#8211; or jump on a quick video call and let&#8217;s see how we can help you turn more clicks into customers.</p>",
    "<p>But the best way to see if we&#8217;re a good fit? Come and have a chat with me in Brisbane, or jump on a quick video call and let&#8217;s see how I can help you turn more clicks into customers.</p>",
  ],
];

/** Answers reworded, and the client quote card floated beside the column dropped. */
export const faq = faqEdits.reduce(
  (html, [find, replace]) => replaceOnce(html, find, replace),
  removeBlock(base.faq, '<div class="faq-testimonial-wrapper">'),
);

/** The contact page carried one more client quote card beside the office list. */
export const contactBody = applyEdits(
  removeBlock(
    replaceOnce(
      removeBlock(contactHtml, '<div class="testimonial-content">'),
      OLD_OFFICE,
      NEW_OFFICE,
    ),
    '<div class="contact location">',
    SYDNEY_OFFICE,
  ),
  [
    ['<p class="sub-title">Melbourne &amp; Sydney</p>', '<p class="sub-title">Brisbane</p>'],
    ['<h2 class="h5-style">OFFICES</h2>', '<h2 class="h5-style">OFFICE</h2>'],
  ],
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

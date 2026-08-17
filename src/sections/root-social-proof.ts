type RootReview = Readonly<{
  name: string;
  initial: string;
  tone: "red" | "blue" | "green" | "purple";
  date: string;
  text: string;
}>;

type RootPartner = Readonly<{
  name: string;
  src: string;
}>;

// Review content and presentation are carried over from the 9 June 2026
// Moonlane homepage snapshot (Snichoo/moonlanemediawebsite@7cb17fa).
const reviews: readonly RootReview[] = [
  {
    name: "Dave Mitchell",
    initial: "D",
    tone: "red",
    date: "04/10/2024",
    text: "Since Moonlane Media took over our Google Ads, the phone hasn't stopped ringing for emergency plumbing jobs. We're booking out weeks in advance now.",
  },
  {
    name: "Sam Peterson",
    initial: "S",
    tone: "blue",
    date: "15/09/2024",
    text: "I was skeptical about SEO for my electrical business, but these guys delivered. We're now ranking top for local electrical services and getting quality commercial leads.",
  },
  {
    name: "James O'Connor",
    initial: "J",
    tone: "green",
    date: "28/08/2024",
    text: "As a 24/7 locksmith, I needed immediate visibility. Moonlane Media's ad strategy put us right in front of people locked out and needing help fast. Incredible ROI.",
  },
  {
    name: "Mike Ross",
    initial: "M",
    tone: "purple",
    date: "12/07/2024",
    text: "Our HVAC seasonal rush is usually stressful, but Moonlane Media helped us smooth out the demand with targeted campaigns. We're seeing steady install jobs all year round.",
  },
];

// This deliberately excludes the government, university, multinational and
// national-chain identities in the original three-row wall. The remaining
// marks are the smaller/local businesses already present in the source site.
const partners: readonly RootPartner[] = [
  {
    name: "Entourage",
    src: "/wp-content/uploads/2022/08/logo-chromatix-entourage.png",
  },
  {
    name: "Payne Clermont Velasco",
    src: "/wp-content/uploads/2018/03/logo_payne-clermont.svg",
  },
  { name: "Modus", src: "/wp-content/uploads/2018/03/logo_modus.svg" },
  { name: "Red Jade", src: "/wp-content/uploads/2018/03/logo_red-jade.svg" },
  {
    name: "Collins 234",
    src: "/wp-content/uploads/2018/03/logo_collins-234.svg",
  },
  { name: "MPS", src: "/wp-content/uploads/2018/03/logo_mps.svg" },
  { name: "Kalora", src: "/wp-content/uploads/2018/03/logo_kalora.svg" },
  {
    name: "Empty Spot Childcare",
    src: "/wp-content/uploads/2018/03/logo_emptyspot.svg",
  },
  { name: "Neo", src: "/wp-content/uploads/2018/03/logo_neo.svg" },
  { name: "Rees", src: "/wp-content/uploads/2018/03/logo_rees.svg" },
  {
    name: "GW Performance",
    src: "/wp-content/uploads/2018/03/logo_gw.svg",
  },
];

const googleLogo = `<svg class="root-review-google" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303C33.654,32.657,29.223,36,24,36c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20c0-1.341-.138-2.65-.389-3.917Z"/>
  <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.682 0-14.344 4.337-17.694 10.691Z"/>
  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44Z"/>
  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.03 12.03 0 0 1-4.087 5.571l6.193 5.237C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917Z"/>
</svg>`;

const verifiedBadge = `<svg class="root-review-verified" viewBox="0 0 24 24" aria-label="Verified review" role="img">
  <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4C2.374 9.55 1.5 10.918 1.5 12.5c0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484Zm-6.616-3.334-4.334 6.5a.75.75 0 0 1-1.04.208l-.115-.094-2.415-2.415a.75.75 0 1 1 1.06-1.06l1.77 1.767 3.825-5.74a.75.75 0 0 1 1.249.834Z"/>
</svg>`;

function renderReview(review: RootReview): string {
  return `<article class="root-review-card">
    <div class="root-review-card-heading">
      <div class="root-review-avatar root-review-avatar--${review.tone}" aria-hidden="true">${review.initial}</div>
      <div class="root-review-identity">
        <h3>${review.name}</h3>
        <time datetime="${review.date.split("/").reverse().join("-")}">${review.date}</time>
      </div>
      ${googleLogo}
    </div>
    <div class="root-review-rating" aria-label="5 out of 5 stars">
      <span aria-hidden="true">★★★★★</span>${verifiedBadge}
    </div>
    <p>${review.text}</p>
  </article>`;
}

const reviewSet = reviews.map(renderReview).join("");

export const testimonials = `<section class="root-reviews" aria-labelledby="root-reviews-title">
  <div class="chr-content-container root-reviews-heading wysiwyg-wrapper wysiwyg-wrapper--center">
    <h2 class="small-title">Client reviews</h2>
    <p class="sub-title" id="root-reviews-title">Rave reviews from <span class="highlight">Australian businesses</span></p>
    <p class="root-reviews-intro">We believe in getting the details right, keeping our promises and going the extra mile. It is how we work and why clients trust us.</p>
  </div>
  <div class="root-review-marquee">
    <div class="root-review-track">
      <div class="root-review-set">${reviewSet}</div>
      <div class="root-review-set" aria-hidden="true">${reviewSet}</div>
    </div>
  </div>
  <div class="root-review-badge">Rated <strong>4.9</strong> on Google Reviews <span aria-hidden="true">★★★★★</span></div>
</section>`;

function renderPartners(hidden: boolean): string {
  return `<div class="root-partner-set"${hidden ? ' aria-hidden="true"' : ""}>${partners
    .map(
      ({ name, src }) => `<div class="root-partner-logo">
        <img width="200" height="100" src="${src}" alt="${hidden ? "" : `${name} logo`}" loading="lazy">
      </div>`,
    )
    .join("")}</div>`;
}

export const partnersMarquee = `<section class="root-partners" aria-labelledby="root-partners-title">
  <div class="chr-content-container root-partners-heading wysiwyg-wrapper wysiwyg-wrapper--center">
    <h2 class="small-title">Partnering in web design across Australia &amp; beyond</h2>
    <p class="sub-title" id="root-partners-title">5+ years helping Aussie businesses <span class="highlight">grow</span></p>
  </div>
  <div class="root-partner-marquee" aria-label="Selected small business clients">
    <div class="root-partner-track">
      ${renderPartners(false)}
      ${renderPartners(true)}
    </div>
  </div>
</section>`;

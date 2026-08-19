type RootResult = Readonly<{
  company: string;
  image: string;
  prefix?: string;
  result: string;
  resultSuffix?: string;
  subtitle: string;
  trailingResult?: string;
  website: string;
}>;

type RootPartner = Readonly<{
  name: string;
  src: string;
}>;

// Client-result content, imagery and two-column order are carried over from
// the 9 June 2026 Moonlane homepage snapshot
// (Snichoo/moonlanemediawebsite@7cb17fa).
const resultColumns: readonly (readonly RootResult[])[] = [
  [
    {
      company: "Singh Roofing",
      image: "/images/client-results/Roof-Replacement-Melbourne.webp",
      result: "HALVED",
      subtitle: "COST PER LEAD IN 2 MONTHS",
      website: "https://singhroofing.com.au/",
    },
    {
      company: "SPS Roofing",
      image: "/images/client-results/reliability_at_its_best.webp",
      prefix: "OVER",
      result: "150",
      resultSuffix: "K",
      subtitle: "OF QUOTES IN 2 WEEKS",
      website: "https://spsroofing.com.au/",
    },
    {
      company: "Old Mate Plumbing Co.",
      image: "/images/client-results/old-mate-plumbing.jpg",
      result: "600",
      resultSuffix: "%",
      subtitle: "INCREASE IN LEAD QUALITY / ROI IN THE FIRST MONTH",
      website: "https://oldmateplumbing.com.au/",
    },
    {
      company: "Solutions Plumbing",
      image: "/images/client-results/solutions-plumbing.jpg",
      prefix: "OVER",
      result: "150",
      subtitle: "LEADS A MONTH",
      website: "https://solutionsplumbing.com.au/",
    },
  ],
  [
    {
      company: "You Are Appreciated Gifting Co.",
      image: "/images/client-results/corporate-gifting.png",
      result: "340",
      resultSuffix: "%",
      subtitle: "INCREASE IN ONLINE ORDERS WITHIN 3 MONTHS",
      website: "https://happyboxstore.com/",
    },
    {
      company: "EnviroEnergy",
      image: "/images/client-results/enviro-energy.jpg",
      result: "5X LOWER COST",
      subtitle: "PER CONVERSION THAN INDUSTRY STANDARD ON FIRST MONTH",
      website: "https://www.enviroenergy.net.au/",
    },
    {
      company: "Asap Trades",
      image: "/images/client-results/asap-trades.jpg",
      prefix: "OVER 200 ADDITIONAL LEADS A MONTH /",
      result: "200",
      resultSuffix: "%",
      subtitle: "INCREASE IN ROI",
      trailingResult: "300% INCREASE IN LEAD QUALITY",
      website: "https://asaptrades.com.au/",
    },
    {
      company: "Elite Electrical",
      image: "/images/client-results/elite-electrical.jpg",
      prefix: "OVER",
      result: "100",
      subtitle: "LEADS A MONTH / HALVED COST PER LEAD IN 3 MONTHS",
      website: "https://www.eliteema.com.au/",
    },
  ],
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

function renderResult(result: RootResult): string {
  const prefix = result.prefix ? `${result.prefix} ` : "";
  const trailing = result.trailingResult
    ? ` <span class="root-result-highlight">${result.trailingResult}</span>`
    : "";

  return `<article class="root-result-card">
    <a class="root-result-image-link" href="${result.website}" target="_blank" rel="noopener noreferrer" aria-label="View ${result.company} website">
      <img class="root-result-image" src="${result.image}" alt="${result.company} client result" loading="lazy">
    </a>
    <div class="root-result-copy">
      <h3>${prefix}<span class="root-result-highlight">${result.result}${result.resultSuffix ?? ""}</span> ${result.subtitle}${trailing}</h3>
      <p>${result.company}</p>
    </div>
  </article>`;
}

const resultsGrid = resultColumns
  .map(
    (column, index) => `<div class="root-result-column${index === 1 ? " root-result-column--offset" : ""}">
      ${column.map(renderResult).join("")}
    </div>`,
  )
  .join("");

export const testimonials = `<section class="root-results" aria-labelledby="root-results-title">
  <div class="chr-content-container root-results-heading wysiwyg-wrapper wysiwyg-wrapper--center">
    <h2 class="sub-title" id="root-results-title">Delivering<br><span class="root-result-highlight">impactful results</span></h2>
    <p>See how we&#8217;ve helped businesses across all kinds of industries turn strategy into serious growth. Real campaigns, real results.</p>
  </div>
  <div class="chr-content-container root-results-grid">
    ${resultsGrid}
  </div>
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

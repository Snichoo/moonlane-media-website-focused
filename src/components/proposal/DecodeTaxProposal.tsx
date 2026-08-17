import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Globe2,
  MapPinned,
  MessageSquareText,
  Phone,
  SearchCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import styles from "./DecodeTaxProposal.module.css";

const inclusions = [
  {
    title: "Custom, High-Conversion Design",
    description:
      "The website will be built using a blueprint specifically designed to convert visitors into enquiries. Professional, modern, and built for trust.",
  },
  {
    title: "Service Pages",
    description:
      "Dedicated pages for each of your services so potential clients can find exactly what they need and understand how you can help.",
  },
  {
    title: "Suburb Targeting Pages",
    description:
      "Location-specific pages to help you rank in local searches across multiple suburbs and areas you want to target.",
  },
  {
    title: "SEO Optimisation",
    description:
      "Built from the ground up to help you show up in searches for your targeted keywords.",
  },
  {
    title: "Lead Notifications",
    description:
      "Your website's contact form will send leads directly to your phone, email, or wherever you prefer - ensuring you're instantly notified.",
  },
  {
    title: "Full Ownership",
    description:
      "A complete hand-off of all login credentials once the site is live. You own everything 100%.",
  },
] as const;

const differences = [
  "No AI-generated content",
  "No cookie-cutter templates",
  "No outsourcing",
  "Built by a senior, experienced website designer",
] as const;

const selectedWork = [
  {
    name: "CYC",
    image: "/wp-content/uploads/2026/05/CYC-590x250-2.png",
    href: "/case-study/cyc",
    alt: "CYC website shown on a tablet in a Moonlane Media case study",
  },
  {
    name: "Builders of Architecture",
    image: "/wp-content/uploads/2026/05/BOA-590x250-4.png",
    href: "/case-study/boa",
    alt: "Builders of Architecture website shown on a phone in a Moonlane Media case study",
  },
  {
    name: "PowerPlus Energy",
    image: "/wp-content/uploads/2026/05/PowerPlus-590x250-2.png",
    href: "/case-study/powerplus-energy",
    alt: "PowerPlus Energy website shown on a desktop in a Moonlane Media case study",
  },
] as const;

const accountingWork = [
  {
    name: "Spark Accountants",
    description: "Modern accounting firm website",
    domain: "sparkaccountants.com.au",
    href: "https://www.sparkaccountants.com.au",
  },
  {
    name: "Link Advisors",
    description: "Professional advisory services",
    domain: "linkadvisors.com.au",
    href: "https://www.linkadvisors.com.au",
  },
  {
    name: "Inspire Accountant",
    description: "Clean, conversion-focused design",
    domain: "inspire.accountant",
    href: "https://inspire.accountant",
  },
  {
    name: "Taggart & Partners",
    description: "Established firm, modern presence",
    domain: "taggartandpartners.com.au",
    href: "https://www.taggartandpartners.com.au",
  },
] as const;

const nextSteps = [
  {
    number: "01",
    title: "Discovery Call",
    description:
      "We'll have a quick call to understand your vision and plan the website together.",
  },
  {
    number: "02",
    title: "Pay 50% Deposit ($750)",
    description:
      "Once we've aligned on the plan, the deposit kicks off the build.",
  },
  {
    number: "03",
    title: "We Build Your Website",
    description:
      "Your site will be ready within 7 days of receiving the deposit.",
  },
  {
    number: "04",
    title: "Review & Go Live",
    description:
      "A quick 20-minute call to connect your domain and push it live.",
  },
] as const;

function Stars() {
  return (
    <span className={styles.stars} aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, index) => (
        <span aria-hidden="true" key={index}>
          ★
        </span>
      ))}
    </span>
  );
}

export function DecodeTaxProposal() {
  return (
    <div className={styles.proposal}>
      <a className={styles.skipLink} href="#proposal-content">
        Skip to proposal content
      </a>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link className={styles.brand} href="/" aria-label="Moonlane Media home">
            <Image
              alt="Moonlane Media"
              height={61}
              priority
              src="/images/moonlane-logo.png"
              width={246}
            />
          </Link>

          <nav className={styles.nav} aria-label="Proposal sections">
            <a href="#scope">Scope</a>
            <a href="#investment">Investment</a>
            <a href="#work">Our work</a>
          </nav>

          <a className={styles.headerCta} href="#next-steps">
            Next steps <ArrowRight aria-hidden="true" size={18} />
          </a>
        </div>
      </header>

      <main id="proposal-content">
        <section className={styles.hero}>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>Website proposal</p>
              <h1>
                Built to turn trust into <span>enquiries.</span>
              </h1>
              <p className={styles.heroLead}>
                A professional, high-converting website for Decode Tax
                Accountants - designed to make your expertise clear and help
                more potential clients get in touch.
              </p>

              <div className={styles.heroActions}>
                <a className={styles.primaryButton} href="#scope">
                  Explore the proposal <ArrowDown aria-hidden="true" size={19} />
                </a>
                <a className={styles.textLink} href="tel:0414134081">
                  <Phone aria-hidden="true" size={18} /> 0414 134 081
                </a>
              </div>

              <dl className={styles.heroFacts}>
                <div>
                  <dt>Timeline</dt>
                  <dd>7 days</dd>
                </div>
                <div>
                  <dt>Investment</dt>
                  <dd>$1,499</dd>
                </div>
                <div>
                  <dt>Ownership</dt>
                  <dd>100% yours</dd>
                </div>
              </dl>
            </div>

            <div className={styles.heroVisual} aria-label="Moonlane Media team">
              <div className={styles.heroImageFrame}>
                <Image
                  alt="Moonlane Media website team discussing a client project"
                  className={styles.heroImage}
                  fill
                  priority
                  sizes="(max-width: 900px) 92vw, 46vw"
                  src="/wp-content/uploads/2018/11/home-intro-2019.png"
                />
              </div>
              <div className={styles.heroNote}>
                <Sparkles aria-hidden="true" size={19} />
                <span>
                  Prepared for <strong>Decode Tax Accountants</strong>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.introSection}>
          <div className={styles.container}>
            <div className={styles.introGrid}>
              <article className={styles.introPanel}>
                <p className={styles.sectionKicker}>About us</p>
                <h2>A focused website development team.</h2>
                <p>
                  We&apos;re Moonlane Media, a focused website development team
                  dedicated to helping businesses like yours get online with a
                  professional, high-converting website that actually brings in
                  leads and sales.
                </p>
              </article>

              <article className={`${styles.introPanel} ${styles.clientPanel}`}>
                <p className={styles.sectionKicker}>Understanding your business</p>
                <h2>Trust matters when clients choose an accountant.</h2>
                <p>
                  Decode Tax Accountants helps individuals and businesses
                  navigate tax, compliance, and financial planning. Your
                  potential clients want to see credibility, expertise, and know
                  they can trust you with their finances.
                </p>
                <p>
                  A professional website will position you as the go-to firm,
                  making it easy for clients to understand your services and get
                  in touch.
                </p>
              </article>
            </div>

            <div className={styles.reviewStrip} aria-label="Client ratings">
              <div className={styles.reviewCard}>
                <span className={styles.reviewName}>Clutch</span>
                <Stars />
                <p>5/5 star for quality, reliability, skills and other factors</p>
              </div>
              <div className={styles.reviewDivider} aria-hidden="true" />
              <div className={styles.reviewCard}>
                <span className={styles.googleName}>Google</span>
                <Stars />
                <p>Innovative, reliable, and client-focused</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.scopeSection} id="scope">
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.sectionKicker}>What&apos;s included</p>
                <h2>Everything needed to launch with confidence.</h2>
              </div>
              <p>
                Strategy, design, development and local search foundations -
                shaped around how potential clients choose an accounting firm.
              </p>
            </div>

            <div className={styles.inclusionGrid}>
              {inclusions.map((item, index) => (
                <article className={styles.inclusionCard} key={item.title}>
                  <span className={styles.inclusionNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.checkIcon} aria-hidden="true">
                    <Check size={19} strokeWidth={3} />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>

            <div className={styles.timelineBanner}>
              <div className={styles.timelineIcon}>
                <Clock3 aria-hidden="true" size={30} />
              </div>
              <div>
                <p>Timeline</p>
                <h3>Fully functional and ready for customers within 7 days.</h3>
                <span>Timing begins when the deposit is received.</span>
              </div>
              <strong>7 days</strong>
            </div>

            <div className={styles.differenceBlock}>
              <div>
                <p className={styles.sectionKicker}>What makes us different</p>
                <h2>Senior thinking, without the agency runaround.</h2>
              </div>
              <ul>
                {differences.map((difference) => (
                  <li key={difference}>
                    <CheckCircle2 aria-hidden="true" size={23} />
                    <span>{difference}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.showcaseSection}>
          <div className={styles.container}>
            <div className={styles.showcaseHeading}>
              <div>
                <p className={styles.sectionKicker}>Selected website work</p>
                <h2>Designed to make businesses impossible to overlook.</h2>
              </div>
              <p>
                A glimpse at the visual craft and responsive thinking behind
                recent Moonlane Media projects.
              </p>
            </div>

            <div className={styles.showcaseGrid}>
              {selectedWork.map((project) => (
                <Link className={styles.showcaseCard} href={project.href} key={project.name}>
                  <div className={styles.showcaseImage}>
                    <Image
                      alt={project.alt}
                      fill
                      sizes="(max-width: 760px) 92vw, 33vw"
                      src={project.image}
                    />
                  </div>
                  <span>
                    {project.name}
                    <ArrowRight aria-hidden="true" size={19} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.investmentSection} id="investment">
          <div className={styles.container}>
            <div className={styles.investmentGrid}>
              <div className={styles.investmentIntro}>
                <p className={styles.sectionKicker}>Your investment</p>
                <h2>One clear price. No ongoing maintenance costs.</h2>
                <p>
                  One complete, conversion-focused website with the design,
                  pages, SEO foundations and handover included in this proposal.
                </p>

                <div className={styles.priceCard}>
                  <span>Total cost</span>
                  <strong>$1,499</strong>
                  <p>One-off fee</p>
                  <div>50% deposit ($750) gets us started</div>
                </div>

                <div className={styles.guarantee}>
                  <ShieldCheck aria-hidden="true" size={30} />
                  <strong>100% Money Back Guarantee If You&apos;re Not Happy</strong>
                </div>
              </div>

              <div className={styles.investmentDetails}>
                <article>
                  <Globe2 aria-hidden="true" size={27} />
                  <div>
                    <h3>Free Hosting (Vercel)</h3>
                    <p>
                      Your site will be hosted on Vercel, a top-tier platform
                      used by companies like Netflix and Uber. It provides
                      lightning-fast, secure hosting completely free. Your
                      domain stays registered with GoDaddy (you keep full
                      ownership) and simply points to Vercel. Your Outlook email
                      connected to GoDaddy remains completely unaffected.
                      You&apos;ll receive full Vercel login credentials.
                    </p>
                  </div>
                </article>

                <article>
                  <MessageSquareText aria-hidden="true" size={27} />
                  <div>
                    <h3>Future Updates</h3>
                    <p>
                      All revisions during the build are included. Once the
                      website is deployed and feedback is complete, any future
                      updates or changes are charged at a flat rate of $50/hour.
                    </p>
                  </div>
                </article>

                <article>
                  <MapPinned aria-hidden="true" size={27} />
                  <div>
                    <h3>Easy Editing</h3>
                    <p>
                      Your website will include a simple editing system similar
                      to GoDaddy&apos;s website builder. You can log in and make
                      basic text and image changes yourself. All login
                      credentials will be provided to you.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.workSection} id="work">
          <div className={styles.container}>
            <div className={styles.workHeading}>
              <div>
                <p className={styles.sectionKicker}>Our work</p>
                <h2>Accounting websites we&apos;ve built.</h2>
              </div>
              <p>
                Explore live examples of modern accounting and advisory websites.
              </p>
            </div>

            <div className={styles.accountingGrid}>
              {accountingWork.map((project) => (
                <a
                  className={styles.accountingCard}
                  href={project.href}
                  key={project.name}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <div className={styles.browserBar} aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className={styles.accountingCardBody}>
                    <SearchCheck aria-hidden="true" size={28} />
                    <div>
                      <h3>{project.name}</h3>
                      <p>{project.description}</p>
                      <span>{project.domain}</span>
                    </div>
                    <ExternalLink aria-hidden="true" size={21} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.stepsSection} id="next-steps">
          <div className={styles.container}>
            <div className={styles.stepsHeading}>
              <p className={styles.sectionKicker}>Next steps</p>
              <h2>From discovery call to go-live.</h2>
            </div>

            <ol className={styles.stepsGrid}>
              {nextSteps.map((step) => (
                <li key={step.number}>
                  <span>{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>

            <div className={styles.finalCta}>
              <div>
                <p className={styles.sectionKicker}>Ready to get more clients?</p>
                <h2>Let&apos;s build something great together.</h2>
                <p>
                  Reply to this proposal or give us a call to schedule your
                  discovery call.
                </p>
              </div>
              <a href="tel:0414134081">
                <Phone aria-hidden="true" size={20} /> Call 0414 134 081
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div>
          <Image
            alt="Moonlane Media"
            height={51}
            src="/images/moonlane-logo.png"
            width={205}
          />
          <span>Website Development | Strategy</span>
        </div>
        <p>
          Connect <span>•</span> Convert <span>•</span> Grow
        </p>
        <small>Moonlane Media • Your Growth Partner</small>
      </footer>
    </div>
  );
}

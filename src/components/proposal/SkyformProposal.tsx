"use client";

import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  BellRing,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Code2,
  CopyX,
  ExternalLink,
  FileText,
  Gauge,
  Globe2,
  Images,
  Layers,
  MailCheck,
  MessageSquareText,
  MonitorPlay,
  Palette,
  PanelsTopLeft,
  PenTool,
  Phone,
  Quote,
  SearchCheck,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UsersRound,
} from "lucide-react";
import { useRef, useState } from "react";
import styles from "./DecodeTaxProposal.module.css";
import { useProposalDeck } from "./useProposalDeck";

const slides = [
  "Proposal",
  "What your website needs",
  "Built properly",
  "Why Moonlane",
  "What is included",
  "Delivery promise",
  "Selected work",
  "Investment",
  "Hosting and handover",
  "Editing and support",
  "How it works",
  "Accept proposal",
] as const;

type ServiceItem = {
  description: string;
  icon: LucideIcon;
  title: string;
};

type WorkItem = {
  href: string;
  name: string;
  result?: string;
};

type AcceptanceState = {
  message: string;
  status: "idle" | "sending" | "success" | "error";
};

type SkyformProposalProps = {
  acceptanceEndpoint?: string;
  clearMobileCoverText?: boolean;
  clientName?: string;
  coverHighlight?: string;
  coverLead?: string;
  coverPrimary?: string;
  deposit?: string;
  logoSrc?: string;
  offerNote?: string;
  servicePagesDescription?: string;
  totalInvestment?: string;
  usualInvestment?: string;
  workItems?: readonly WorkItem[];
};

const constructionWork = [
  {
    href: "https://www.hrconstructions.com.au/",
    name: "HR Constructions",
  },
  {
    href: "https://ydlstone.com.au/",
    name: "YDL Stone",
  },
  {
    href: "https://moonlanemedia.com.au/case-study/bowens",
    name: "Bowens",
  },
  {
    href: "https://asaptrades.com.au/",
    name: "ASAP Trades",
    result: "Over 200 extra leads a month and a 200% increase in ROI",
  },
] as const;

/**
 * The competitor-analysis slides. Each entry is a single note rather than a
 * detail plus a rationale, so the headline set fits one screen alongside the
 * reference media.
 */
type NeedItem = {
  icon: LucideIcon;
  note: string;
  title: string;
};

const headlineNeeds: NeedItem[] = [
  {
    icon: Palette,
    note: "Minimal, spacious and smooth. It is the first read on build quality, before a word is read.",
    title: "Clean, modern, professional design",
  },
  {
    icon: Sparkles,
    note: "The logo resolves as the page opens. A two-second detail that separates a premium builder from a template.",
    title: "Logo intro animation",
  },
  {
    icon: MonitorPlay,
    note: "Footage of completed work behind the headline. Stills cannot carry the scale of a build.",
    title: "Video in the hero",
  },
  {
    icon: Trophy,
    note: "Projects delivered, combined value, years operating. Turns experience into numbers a client can weigh.",
    title: "Achievements stated plainly",
  },
  {
    icon: Images,
    note: "Full-width photography, a page per project. The work is the strongest thing you have to sell.",
    title: "Projects, shown large",
  },
  {
    icon: Quote,
    note: "Named clients on real projects. Third-party proof beats any claim you make about yourself.",
    title: "Testimonials",
  },
  {
    icon: PanelsTopLeft,
    note: "Your top three as clear cards, so what you do lands in one glance.",
    title: "Service cards",
  },
  {
    icon: BadgeCheck,
    note: "Licences and accreditations in the footer. Quietly removes the last doubt before an enquiry.",
    title: "Certifications",
  },
  {
    icon: Layers,
    note: "Its own page for the detail, the scope and a full gallery of photos and video.",
    title: "A page per project",
  },
  {
    icon: UsersRound,
    note: "Who you are and how you build. Construction buyers are picking people.",
    title: "About us",
  },
  {
    icon: PanelsTopLeft,
    note: "Clients, partners and suppliers you work with. Borrowed credibility, instantly.",
    title: "Brand carousel",
  },
  {
    icon: Images,
    note: "A live feed of your latest posts, so visitors can go and see more of the work.",
    title: "Instagram feed",
  },
  {
    icon: Phone,
    note: "Phone, email and an enquiry form on every page.",
    title: "Contact in the footer",
  },
];

const foundationItems: ServiceItem[] = [
  {
    description:
      "Designed and written from scratch for Skyform. Nothing is generated and then tidied up.",
    icon: Sparkles,
    title: "No AI-generated content",
  },
  {
    description:
      "No theme and no page builder. Your site will not share its layout with a hundred others.",
    icon: CopyX,
    title: "No cookie-cutter templates",
  },
  {
    description:
      "Custom designed and custom coded, so nothing is fighting the design or slowing it down.",
    icon: Code2,
    title: "Built from scratch",
  },
  {
    description:
      "Laid out to turn visitors into enquiries, so you can put Google Ads behind it later and have the traffic convert.",
    icon: Target,
    title: "High-conversion focused",
  },
  {
    description:
      "Built around agreed keywords so the site can be found for the work you want.",
    icon: SearchCheck,
    title: "SEO optimised",
  },
  {
    description:
      "Compressed media and lean code, so heavy project photography still loads fast.",
    icon: Gauge,
    title: "Speed optimised",
  },
];

const includedItems: ServiceItem[] = [
  {
    description: "Clean, minimal and built to read as premium.",
    icon: Palette,
    title: "Custom, high-conversion design",
  },
  {
    description: "Your core services, each properly explained.",
    icon: FileText,
    title: "Service pages",
  },
  {
    description: "Every project with its own page, photos and video.",
    icon: Layers,
    title: "Project pages",
  },
  {
    description: "Enquiries sent straight to your preferred destination.",
    icon: BellRing,
    title: "Lead notifications",
  },
  {
    description: "A live feed so visitors can see more of your work.",
    icon: Images,
    title: "Instagram feed",
  },
  {
    description: "Licences and accreditations shown where they build trust.",
    icon: BadgeCheck,
    title: "Certifications",
  },
];

const supportItems: ServiceItem[] = [
  {
    description:
      "Unlimited revisions throughout the active build, so the final site feels right before launch.",
    icon: MessageSquareText,
    title: "Unlimited revisions during the build",
  },
  {
    description:
      "A simple editing system lets you update basic text and images yourself, with all login details supplied.",
    icon: PenTool,
    title: "Easy editing",
  },
  {
    description:
      "There is no mandatory maintenance plan. Future updates are available when needed at a flat $50 per hour.",
    icon: Clock3,
    title: "Flexible future support",
  },
];

function ServiceSlide({
  eyebrow,
  id,
  items,
  title,
}: {
  eyebrow: string;
  id: string;
  items: ServiceItem[];
  title: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      className={`${styles.slide} ${styles.serviceSlide} single-part service-list-part`}
      data-proposal-slide
      id={id}
      tabIndex={-1}
    >
      <div className={`${styles.slideHeading} chr-content-container`}>
        <p className="small-title">{eyebrow}</p>
        <h2 className="sub-title" id={`${id}-title`}>
          {title}
        </h2>
      </div>
      <div className={`services-items-part ${styles.servicesPart}`}>
        <div className="chr-content-container services-items-container">
          {items.map(({ description, icon: Icon, title: itemTitle }) => (
            <article className="single-item" key={itemTitle}>
              <Icon aria-hidden="true" />
              <div className="item-content wysiwyg-wrapper">
                <h3>{itemTitle}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
function ProgressItem({
  description,
  icon: Icon,
  title,
}: ServiceItem) {
  return (
    <div className="single-item">
      <div className="svg-wrapper">
        <Icon aria-hidden="true" />
      </div>
      <div className="item-content">
        <h3 className="title">{title}</h3>
        <span>{description}</span>
      </div>
    </div>
  );
}

function GoogleRatingBadge() {
  return (
    <div
      aria-label="Google rating: 5 out of 5 stars"
      className={styles.googleRating}
      role="img"
    >
      <svg aria-hidden="true" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.223 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917Z" />
        <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.682 0-14.344 4.337-17.694 10.691Z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44Z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.03 12.03 0 0 1-4.087 5.571l6.193 5.237C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917Z" />
      </svg>
      <span className={styles.googleRatingCopy}>
        <span>Google Rating</span>
        <span className={styles.googleRatingScore}>
          <strong>5.0</strong>
          <span aria-hidden="true">★★★★★</span>
        </span>
      </span>
    </div>
  );
}

export function SkyformProposal({
  acceptanceEndpoint = "/api/proposals/skyform-constructions/accept",
  clearMobileCoverText = false,
  clientName = "Skyform Constructions",
  coverHighlight = "Constructions",
  coverLead = "A premium, photography-led website built to show the standard of the work and win better projects.",
  coverPrimary = "Skyform",
  deposit = "$4,000",
  logoSrc = "/images/skyform/skyform-logo.png",
  offerNote,
  servicePagesDescription = "Your core construction services, each properly explained.",
  totalInvestment = "$8,000",
  usualInvestment,
  workItems = constructionWork,
}: SkyformProposalProps = {}) {
  const { activeIndex, deckRef, goToSlide } = useProposalDeck();
  const [acceptanceState, setAcceptanceState] = useState<AcceptanceState>({
    message: "",
    status: "idle",
  });
  const acceptanceRequestIdRef = useRef<string | null>(null);

  const handleProposalAcceptance = async () => {
    if (acceptanceState.status === "sending") return;
    setAcceptanceState({ message: "", status: "sending" });

    try {
      if (!acceptanceRequestIdRef.current) {
        acceptanceRequestIdRef.current = crypto.randomUUID();
      }

      const response = await fetch(
        acceptanceEndpoint,
        {
          body: JSON.stringify({
            clientRequestId: acceptanceRequestIdRef.current,
          }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        },
      );
      let result: { error?: string; ok?: boolean } = {};
      try {
        result = (await response.json()) as typeof result;
      } catch {
        // A controlled message below is more useful than exposing a JSON parse
        // error if the hosting layer returns an unexpected response.
      }

      if (!response.ok || !result.ok) {
        if (response.status >= 400 && response.status < 500) {
          acceptanceRequestIdRef.current = null;
        }
        throw new Error(result.error || "The acceptance could not be sent.");
      }

      setAcceptanceState({
        message: "Proposal accepted. Moonlane Media has been notified.",
        status: "success",
      });
    } catch (error) {
      setAcceptanceState({
        message:
          error instanceof Error
            ? error.message
            : "The acceptance could not be sent. Please try again.",
        status: "error",
      });
    }
  };

  return (
    <div
      className={`chr-content ${styles.proposal} ${styles.urgentProposal} ${clearMobileCoverText ? styles.clearMobileCoverText : ""}`}
    >
      <a className={styles.skipLink} href="#proposal-deck">
        Skip to proposal
      </a>

      <header className={styles.deckHeader}>
        <Link aria-label="Moonlane Media home" href="/">
          <Image
            alt="Moonlane Media"
            height={40}
            priority
            src="/images/moonlane-logo.png"
            width={165}
          />
        </Link>
        <div className={styles.headerStatus}>
          <span className={styles.headerLabel}>{slides[activeIndex]}</span>
          <span aria-live="polite" className={styles.counter}>
            <span className={styles.srOnly}>{slides[activeIndex]}. </span>
            {String(activeIndex + 1).padStart(2, "0")} / {slides.length}
          </span>
        </div>
        <div aria-hidden="true" className={styles.progressTrack}>
          <span
            className={styles.progressFill}
            style={{ width: `${((activeIndex + 1) / slides.length) * 100}%` }}
          />
        </div>
      </header>

      <main
        aria-label={`Website proposal for ${clientName}`}
        className={`${styles.deck} sub-page case-study-page`}
        id="proposal-deck"
        ref={deckRef}
        tabIndex={-1}
      >
        <div className="modules">
          <section
            aria-labelledby="proposal-cover-title"
            className={`${styles.slide} ${styles.coverSlide}`}
            data-proposal-slide
            id="proposal"
            tabIndex={-1}
          >
            <div className={`home-banner ${styles.homeBanner}`}>
              <video
                aria-hidden="true"
                autoPlay
                className="home-banner-video"
                loop
                muted
                playsInline
                preload="metadata"
              >
                <source
                  src="/wp-content/uploads/2021/05/cut-flower-open-451.mp4"
                  type="video/mp4"
                />
              </video>
              <div aria-hidden="true" className="layers-part">
                <div className="layer layer-1" />
                <div className="layer layer-2" />
                <div className="layer layer-3" />
                <div className="layer layer-4" />
                <div className="layer layer-5" />
                <div className="layer layer-6" />
              </div>
              <div aria-hidden="true" className={styles.coverFlower} />
              {logoSrc ? (
                <span className={styles.coverLogo}>
                  <Image
                    alt={`${clientName} logo`}
                    height={434}
                    priority
                    src={logoSrc}
                    width={640}
                  />
                </span>
              ) : null}
              <div className="chr-content-container">
                <div className={`home-banner-content ${styles.coverContent}`}>
                  <p className="small-title">Website proposal</p>
                  <h1 className="title" id="proposal-cover-title">
                    <span className={styles.coverLine}>Built for</span>
                    <span className={styles.coverLine}>{coverPrimary}</span>
                    <span className={`highlight ${styles.coverLine}`}>{coverHighlight}</span>
                  </h1>
                  <p className={styles.coverLead}>
                    {coverLead}
                  </p>
                  <a
                    className="button"
                    href="#opportunity"
                    onClick={(event) => {
                      event.preventDefault();
                      goToSlide(1);
                    }}
                  >
                    View the proposal
                  </a>
                  <div className={styles.coverFacts}>
                    <span><strong>2&ndash;3 weeks</strong> target delivery</span>
                    <span><strong>{totalInvestment}</strong> one-off</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="needs-title"
            className={`${styles.slide} ${styles.needsSlide}`}
            data-proposal-slide
            id="needs"
            tabIndex={-1}
          >
            <div className={`chr-content-container ${styles.needsHeading}`}>
              <p className="small-title">Based on competitor analysis</p>
              <h2 className="sub-title" id="needs-title">
                What your website needs,
                <br />
                <span className="highlight">and why each one matters</span>
              </h2>
              <p className={styles.needsIntro}>
                Taken from reviewing the construction sites winning work today,
                against what most competitors are still getting wrong.
              </p>
            </div>
            <div className={`chr-content-container ${styles.needsLayout}`}>
              <div className={styles.needsMedia}>
                <figure className={styles.mediaCard}>
                  <video
                    aria-label="Reference: a construction site opening with a logo animation before revealing the hero video"
                    autoPlay
                    className={styles.mediaVideo}
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    src="/images/skyform/reference-logo-intro.mp4"
                  />
                  <figcaption>Logo intro into hero video</figcaption>
                </figure>
                <figure className={styles.mediaCard}>
                  <Image
                    alt="Reference: a row of achievement statistics including projects built, combined value and years operating"
                    className={styles.mediaImage}
                    height={600}
                    priority
                    sizes="(max-width: 1239px) 100vw, 40vw"
                    src="/images/skyform/reference-achievements.png"
                    width={1546}
                  />
                  <figcaption>Achievements, stated as numbers</figcaption>
                </figure>
              </div>
              <div className={styles.needsList}>
                {headlineNeeds.map(({ icon: Icon, note, title }, index) => (
                  <article key={title}>
                    <span className={styles.needsNumber}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3>
                        <Icon aria-hidden="true" />
                        {title}
                      </h3>
                      <p>{note}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <ServiceSlide
            eyebrow="Built properly"
            id="foundations"
            items={foundationItems}
            title={<>Fast, findable and <span className="highlight">built to last.</span></>}
          />

          <section
            aria-labelledby="moonlane-title"
            className={`${styles.slide} ${styles.yellowSlide} ${styles.whySlide}`}
            data-proposal-slide
            id="moonlane"
            tabIndex={-1}
          >
            <div className={`chr-section-two ${styles.sectionTwo}`}>
              <div className="chr-content-container">
                <div className="image-wrapper">
                  <Image
                    alt="Moonlane Media web design studio"
                    className="section-two-image"
                    height={730}
                    sizes="(max-width: 766px) 270px, (max-width: 1239px) 600px, 730px"
                    src="/wp-content/uploads/2018/11/home-intro-2019.png"
                    width={730}
                  />
                </div>
                <div className="section-two-content wysiwyg-wrapper">
                  <p className="small-title">Why Moonlane Media</p>
                  <h2 className="sub-title" id="moonlane-title">
                    Websites built around
                    <br />
                    <span className="highlight">your growth</span>
                  </h2>
                  <div className={`section-two-icon-list ${styles.proofList}`}>
                    <div className="single-item"><Sparkles /><span>No AI-generated content</span></div>
                    <div className="single-item"><CopyX /><span>No cookie-cutter templates</span></div>
                    <div className="single-item"><UsersRound /><span>No outsourcing</span></div>
                    <div className="single-item"><ShieldCheck /><span>Senior-level design and development</span></div>
                  </div>
                  <GoogleRatingBadge />
                </div>
              </div>
            </div>
          </section>

          <ServiceSlide
            eyebrow="What is included"
            id="scope-included"
            items={includedItems.map((item) =>
              item.title === "Service pages"
                ? { ...item, description: servicePagesDescription }
                : item,
            )}
            title={<>Everything included. Built to <span className="highlight">perform.</span></>}
          />

          <section
            aria-labelledby="delivery-title"
            className={`${styles.slide} ${styles.deliverySlide}`}
            data-proposal-slide
            id="delivery"
            tabIndex={-1}
          >
            <div className={`chr-content-container ${styles.deliveryIntro}`}>
              <p className="small-title">Delivery promise</p>
              <h2 className="sub-title" id="delivery-title">
                Your website, live in
                <br />
                <span className="highlight">2&ndash;3 weeks</span>
              </h2>
            </div>
            <div className={`confidence-bar ${styles.compactBar}`}>
              <div className="chr-content-container">
                <div className="item-list">
                  <ProgressItem icon={Clock3} title="2–3 week target" description="From project-ready handover" />
                  <ProgressItem icon={MessageSquareText} title="Unlimited revisions" description="Throughout the active build" />
                  <ProgressItem icon={ShieldCheck} title="Fully functional" description="Prepared and tested for customers" />
                  <ProgressItem icon={Check} title="Clear handover" description="Review, connect and go live" />
                </div>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="selected-work-title"
            className={`${styles.slide} ${styles.accountingSlide}`}
            data-proposal-slide
            id="selected-work"
            tabIndex={-1}
          >
            <div className={`chr-content-container ${styles.accountingHeading}`}>
              <p className="small-title">Selected work</p>
              <h2 className="sub-title" id="selected-work-title">
                Explore some of
                <br />
                <span className="highlight">our previous work</span>
              </h2>
            </div>
            <div className={styles.accountingList}>
              {workItems.map((project, index) => (
                <a href={project.href} key={project.name} rel="noreferrer" target="_blank">
                  <span className={styles.listNumber}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={styles.accountingName}>
                    <strong>{project.name}</strong>
                    {project.result ? (
                      <small className={styles.accountingResult}>{project.result}</small>
                    ) : null}
                  </span>
                  <ExternalLink aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="investment-title"
            className={`${styles.slide} ${styles.yellowSlide} ${styles.investmentSlide}`}
            data-proposal-slide
            id="investment"
            tabIndex={-1}
          >
            <div
              className={`chr-section-two ${styles.sectionTwo} ${styles.investmentSection} ${offerNote ? styles.investmentSectionOffer : ""}`}
            >
              <div className="chr-content-container">
                <div className={`image-wrapper ${styles.priceVisual}`}>
                  <span className={styles.priceLabel}>Total investment</span>
                  {usualInvestment ? (
                    <span className={styles.priceWas}>
                      Usually <s>{usualInvestment}</s>
                    </span>
                  ) : null}
                  <strong>{totalInvestment}</strong>
                  <span>one-off fee</span>
                </div>
                <div className="section-two-content wysiwyg-wrapper">
                  <p className="small-title">Clear investment</p>
                  <h2 className="sub-title" id="investment-title">
                    One price.
                    <br />
                    <span className="highlight">Everything above.</span>
                  </h2>
                  {offerNote ? (
                    <div className={styles.offerNote}>
                      <Clock3 aria-hidden="true" />
                      <span>{offerNote}</span>
                    </div>
                  ) : null}
                  <p className={styles.depositCallout}>
                    <strong>A {deposit} deposit</strong>
                    <small>gets the project started, balance on launch</small>
                  </p>
                  <p className={styles.noMaintenance}>
                    No mandatory ongoing maintenance plan.
                  </p>
                  <div className={`section-two-icon-list ${styles.investmentFacts}`}>
                    <div className="single-item"><ShieldCheck /><span>100% money-back guarantee if you are not happy</span></div>
                    <div className="single-item"><MessageSquareText /><span>Unlimited revisions</span></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="hosting-title"
            className={`${styles.slide} ${styles.textImageSlide} single-part text-and-image-part`}
            data-proposal-slide
            id="hosting"
            tabIndex={-1}
          >
            <div className="chr-content-container chr-text-and-image-container left-image">
              <div className={`image-part ${styles.hostingImage}`}>
                <div className={styles.hostingGraphic}>
                  <p className={styles.hostingFree}>
                    <span>Hosting</span>
                    <strong>$0</strong>
                    <small>per month</small>
                  </p>
                  <Globe2 aria-hidden="true" />
                  <span>Domain ownership</span>
                  <ServerCog aria-hidden="true" />
                  <span>Vercel hosting</span>
                  <MailCheck aria-hidden="true" />
                  <span>Email stays connected</span>
                </div>
              </div>
              <div className="text-part wysiwyg-wrapper">
                <p className="small-title">Hosting and handover</p>
                <h2 className="sub-title" id="hosting-title">
                  Fast hosting.
                  <br />
                  <span className="highlight">Complete control.</span>
                </h2>
                <p className={styles.hostingFreeLine}>
                  Vercel hosting is <strong>completely free</strong>
                  {" "}&mdash; no monthly hosting bill, ever.
                </p>
                <p>
                  If you already have a domain, it can stay with its current
                  registrar while the new site is hosted on Vercel.
                </p>
                <ul>
                  <li>Any existing domain remains in your registrar account.</li>
                  <li>Any existing business email configuration remains unchanged.</li>
                  <li>All Vercel and website login credentials are handed over.</li>
                  <li>Hosting is free on Vercel&rsquo;s tier, with no monthly bill.</li>
                </ul>
              </div>
            </div>
          </section>

          <ServiceSlide
            eyebrow="Editing and support"
            id="editing"
            items={supportItems}
            title={<>Easy to manage. <span className="highlight">Help when needed.</span></>}
          />

          <section
            aria-labelledby="process-title"
            className={`${styles.slide} ${styles.yellowSlide} ${styles.processSlide}`}
            data-proposal-slide
            id="process"
            tabIndex={-1}
          >
            <div className={`chr-section-two ${styles.sectionTwo} ${styles.processSection}`}>
              <div className="chr-content-container">
                <div className="section-two-content wysiwyg-wrapper">
                  <p className="small-title">How it works</p>
                  <h2 className="sub-title" id="process-title">
                    Four clear steps from
                    <br />
                    <span className="highlight">idea to live website</span>
                  </h2>
                  <p>We keep the process simple, focused and easy to follow.</p>
                </div>
                <ol className={`section-two-icon-list ${styles.processList}`}>
                  <li className="single-item"><span className={styles.stepNumber}>01</span><span><strong>Discovery call</strong><small>We understand your vision and plan the site together.</small></span></li>
                  <li className="single-item"><span className={styles.stepNumber}>02</span><span><strong>Pay the {deposit} deposit</strong><small>Half up front, the balance on launch.</small></span></li>
                  <li className="single-item"><span className={styles.stepNumber}>03</span><span><strong>We build your website</strong><small>The 2–3 week target starts from project-ready handover.</small></span></li>
                  <li className="single-item"><span className={styles.stepNumber}>04</span><span><strong>Review and go live</strong><small>A 20-minute call connects the domain and launches it.</small></span></li>
                </ol>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="next-step-title"
            className={`${styles.slide} ${styles.finalSlide}`}
            data-proposal-slide
            id="next-step"
            tabIndex={-1}
          >
            <div className="chr-content-container section-three-heading-part">
              <div className="left-part">
                <p className="small-title">Accept proposal</p>
                <h2 className="sub-title" id="next-step-title">
                  Ready to move
                  <br />
                  <span className="highlight">forward?</span>
                </h2>
              </div>
              <div className={`right-part wysiwyg-wrapper ${styles.finalCopy}`}>
                {acceptanceState.status === "success" ? (
                  <div className={styles.acceptanceSuccess} role="status">
                    <CheckCircle2 aria-hidden="true" />
                    <div>
                      <strong>Proposal accepted</strong>
                      <p>{acceptanceState.message}</p>
                    </div>
                  </div>
                ) : (
                  <div className={styles.acceptanceActions}>
                    <button
                      className="button"
                      disabled={acceptanceState.status === "sending"}
                      onClick={handleProposalAcceptance}
                      type="button"
                    >
                      {acceptanceState.status === "sending" ? "Sending acceptance…" : "Accept proposal"}
                    </button>
                    {acceptanceState.status === "error" ? (
                      <p className={styles.acceptanceMessage} role="alert">
                        {acceptanceState.message}
                      </p>
                    ) : null}
                    <p className={styles.questionLine}>
                      If you have any questions, call{" "}
                      <a className={styles.phoneLink} href="tel:0414134081">
                        <Phone aria-hidden="true" /> 0414 134 081
                      </a>
                      .
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <nav aria-label="Proposal slide controls" className={styles.deckControls}>
        <button
          aria-label="Previous section"
          disabled={activeIndex === 0}
          onClick={() => goToSlide(activeIndex - 1)}
          type="button"
        >
          <ChevronLeft aria-hidden="true" />
        </button>
        <div className={styles.dotNav}>
          {slides.map((slide, index) => (
            <button
              aria-current={index === activeIndex ? "step" : undefined}
              aria-label={`Go to section ${index + 1}: ${slide}`}
              className={index === activeIndex ? styles.activeDot : undefined}
              key={slide}
              onClick={() => goToSlide(index)}
              type="button"
            />
          ))}
        </div>
        <button
          aria-label="Next section"
          disabled={activeIndex === slides.length - 1}
          onClick={() => goToSlide(activeIndex + 1)}
          type="button"
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
}

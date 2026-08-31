"use client";

import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Code2,
  CopyX,
  ExternalLink,
  Gauge,
  Globe2,
  Images,
  Layers,
  MessageSquareText,
  MailCheck,
  MonitorPlay,
  Palette,
  PenTool,
  PanelsTopLeft,
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
  "Delivery promise",
  "Selected work",
  "Investment",
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
  /** Screenshot of that site's hero, so the card shows the work itself. */
  shot?: string;
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
  totalInvestment?: string;
  usualInvestment?: string;
  workItems?: readonly WorkItem[];
};

const constructionWork = [
  {
    href: "https://www.hrconstructions.com.au/",
    name: "HR Constructions",
    shot: "/images/work/hr-constructions.jpg",
  },
  {
    href: "https://ydlstone.com.au/",
    name: "YDL Stone",
    shot: "/images/work/ydl-stone.jpg",
  },
  {
    href: "https://www.friendlyplumbing.com.au/",
    name: "Friendly Plumbing",
    result: "Eight service pages and suburb pages across Greater Sydney",
    shot: "/images/work/friendly-plumbing.jpg",
  },
  {
    href: "https://asaptrades.com.au/",
    name: "ASAP Trades",
    result: "Over 200 extra leads a month and a 200% increase in ROI",
    shot: "/images/work/asap-trades.jpg",
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
    note: "The first read on build quality.",
    title: "Clean, modern, professional design",
  },
  {
    icon: Sparkles,
    note: "A two-second detail templates never have.",
    title: "Logo intro animation",
  },
  {
    icon: MonitorPlay,
    note: "Stills cannot carry the scale of a build.",
    title: "Video in the hero",
  },
  {
    icon: Trophy,
    note: "Projects, value, years. Numbers they can weigh.",
    title: "Achievements stated plainly",
  },
  {
    icon: Images,
    note: "Full-width photography. The work sells itself.",
    title: "Projects, shown large",
  },
  {
    icon: Quote,
    note: "Named clients beat any claim you make.",
    title: "Testimonials",
  },
  {
    icon: PanelsTopLeft,
    note: "Your top three, clear in one glance.",
    title: "Service cards",
  },
  {
    icon: BadgeCheck,
    note: "Licences in the footer, doubt removed.",
    title: "Certifications",
  },
  {
    icon: Layers,
    note: "Scope, detail and a full gallery.",
    title: "A page per project",
  },
  {
    icon: UsersRound,
    note: "Construction buyers are picking people.",
    title: "About us",
  },
  {
    icon: PanelsTopLeft,
    note: "Clients and suppliers. Borrowed credibility.",
    title: "Brand carousel",
  },
  {
    icon: Images,
    note: "A live feed of your latest work.",
    title: "Instagram feed",
  },
  {
    icon: Phone,
    note: "Phone, email and a form on every page.",
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

export function SkyformProposal({
  acceptanceEndpoint = "/api/proposals/skyform-constructions/accept",
  clearMobileCoverText = false,
  clientName = "Skyform Constructions",
  coverHighlight = "Constructions",
  coverLead = "A premium, photography-led website built to show the standard of the work and win better projects.",
  coverPrimary = "Skyform",
  deposit = "50%",
  logoSrc = "/images/skyform/skyform-logo.png",
  offerNote,
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
            <div className={`home-banner ${styles.homeBanner} ${styles.coverCentred}`}>
              <div className="chr-content-container">
                <div className={`home-banner-content ${styles.coverContent}`}>
                  <p className="small-title">Website proposal for</p>
                  {logoSrc ? (
                    <h1 className={styles.coverLogoTitle} id="proposal-cover-title">
                      <Image
                        alt={clientName}
                        height={434}
                        priority
                        src={logoSrc}
                        width={640}
                      />
                    </h1>
                  ) : (
                    <h1 className="title" id="proposal-cover-title">
                      <span className={styles.coverLine}>{coverPrimary}</span>
                      <span className={`highlight ${styles.coverLine}`}>{coverHighlight}</span>
                    </h1>
                  )}
                  <p className={styles.coverLead}>{coverLead}</p>
                  <a
                    className="button"
                    href="#needs"
                    onClick={(event) => {
                      event.preventDefault();
                      goToSlide(1);
                    }}
                  >
                    View the proposal
                  </a>
                  <div className={styles.coverFacts}>
                    <span>
                      <strong>2&ndash;3 weeks</strong> target delivery
                    </span>
                    <span>
                      <strong>Unlimited</strong> revisions
                    </span>
                    <span>
                      <strong>Nine</strong> sections
                    </span>
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
                Taken from the construction sites winning work today.
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
                {headlineNeeds.map(({ icon: Icon, note, title }) => (
                  <article key={title}>
                    <span className={styles.needsIcon}>
                      <Icon aria-hidden="true" />
                    </span>
                    <div>
                      <h3>{title}</h3>
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
              <p className={styles.workHint}>
                Click any site below to open it in a new tab.
              </p>
            </div>
            <div className={styles.workGrid}>
              {workItems.map((project) => (
                <a
                  className={styles.workCard}
                  href={project.href}
                  key={project.name}
                  rel="noreferrer"
                  target="_blank"
                >
                  {project.shot ? (
                    <Image
                      alt={`${project.name} homepage`}
                      className={styles.workShot}
                      height={600}
                      loading="eager"
                      sizes="(max-width: 766px) 50vw, 25vw"
                      src={project.shot}
                      width={960}
                    />
                  ) : null}
                  <span className={styles.workBody}>
                    <span className={styles.workName}>{project.name}</span>
                    {project.result ? (
                      <span className={styles.workResult}>{project.result}</span>
                    ) : null}
                    <span className={styles.workOpen}>
                      <span>Open site</span>
                      <ExternalLink aria-hidden="true" />
                    </span>
                  </span>
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
            aria-labelledby="support-title"
            className={`${styles.slide} ${styles.textImageSlide} single-part text-and-image-part`}
            data-proposal-slide
            id="support"
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
                  <Gauge aria-hidden="true" />
                  <span>Fast, and stays fast</span>
                  <ServerCog aria-hidden="true" />
                  <span>Enterprise Vercel network</span>
                  <Globe2 aria-hidden="true" />
                  <span>Domain ownership</span>
                  <MailCheck aria-hidden="true" />
                  <span>Email stays connected</span>
                </div>
              </div>
              <div className="text-part wysiwyg-wrapper">
                <p className="small-title">Editing and support</p>
                <h2 className="sub-title" id="support-title">
                  Easy to manage.
                  <br />
                  <span className="highlight">Help when needed.</span>
                </h2>
                <div className={styles.supportPoints}>
                  <article>
                    <span className={styles.needsIcon}>
                      <PenTool aria-hidden="true" />
                    </span>
                    <h3>Easy editing</h3>
                    <p>
                      A simple editing system for text and images, with every
                      login supplied.
                    </p>
                  </article>
                  <article>
                    <span className={styles.needsIcon}>
                      <Clock3 aria-hidden="true" />
                    </span>
                    <h3>No lock-in</h3>
                    <p>
                      No mandatory maintenance plan. Later updates are $50 per
                      hour.
                    </p>
                  </article>
                </div>
              </div>
            </div>
          </section>

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

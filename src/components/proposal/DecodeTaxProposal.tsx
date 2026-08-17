"use client";

import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BellRing,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  CopyX,
  ExternalLink,
  FileText,
  Globe2,
  KeyRound,
  MailCheck,
  MapPinned,
  MessageSquareText,
  Palette,
  PenTool,
  Phone,
  SearchCheck,
  ServerCog,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import type { FormEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./DecodeTaxProposal.module.css";

const slides = [
  "Proposal",
  "Understanding your business",
  "Why Moonlane",
  "What is included",
  "Delivery promise",
  "Accounting experience",
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

type AcceptanceState = {
  message: string;
  status: "idle" | "sending" | "success" | "error";
};

const accountingWork = [
  {
    href: "https://www.sparkaccountants.com.au",
    name: "Spark Accountants",
    note: "Modern accounting firm website",
  },
  {
    href: "https://www.linkadvisors.com.au",
    name: "Link Advisors",
    note: "Professional advisory services",
  },
  {
    href: "https://inspire.accountant",
    name: "Inspire Accountant",
    note: "Clean, conversion-focused design",
  },
  {
    href: "https://www.taggartandpartners.com.au",
    name: "Taggart & Partners",
    note: "Established firm, modern presence",
  },
] as const;

const includedItems: ServiceItem[] = [
  {
    description: "Professional, modern and built for trust.",
    icon: Palette,
    title: "Custom, high-conversion design",
  },
  {
    description: "Clear pages for every accounting service.",
    icon: FileText,
    title: "Service pages",
  },
  {
    description: "Enquiries sent straight to your preferred destination.",
    icon: BellRing,
    title: "Lead notifications",
  },
  {
    description: "Target the suburbs and locations that matter.",
    icon: MapPinned,
    title: "Suburb targeting pages",
  },
  {
    description: "Built around agreed keywords and SEO foundations.",
    icon: SearchCheck,
    title: "SEO optimisation",
  },
  {
    description: "Every login handed over. The website is 100% yours.",
    icon: KeyRound,
    title: "Full ownership",
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

export function DecodeTaxProposal() {
  const deckRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [acceptanceState, setAcceptanceState] = useState<AcceptanceState>({
    message: "",
    status: "idle",
  });
  const acceptanceRequestIdRef = useRef<string | null>(null);

  const handleProposalAcceptance = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setAcceptanceState({ message: "", status: "sending" });

    try {
      if (!acceptanceRequestIdRef.current) {
        acceptanceRequestIdRef.current = crypto.randomUUID();
      }

      const response = await fetch(
        "/api/proposals/decode-tax-accountants/accept",
        {
          body: JSON.stringify({
            authorityConfirmed: formData.get("authorityConfirmed") === "on",
            clientRequestId: acceptanceRequestIdRef.current,
            email: String(formData.get("email") ?? ""),
            name: String(formData.get("name") ?? ""),
            scopeConfirmed: formData.get("scopeConfirmed") === "on",
            website: String(formData.get("website") ?? ""),
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

  const goToSlide = useCallback((index: number) => {
    const deck = deckRef.current;
    if (!deck) return;

    const slideElements = Array.from(
      deck.querySelectorAll<HTMLElement>("[data-proposal-slide]"),
    );
    const safeIndex = Math.max(0, Math.min(index, slideElements.length - 1));
    const targetSlide = slideElements[safeIndex];
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    targetSlide?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
    targetSlide?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;

    document.body.classList.add("proposal-deck-open");
    const slideElements = Array.from(
      deck.querySelectorAll<HTMLElement>("[data-proposal-slide]"),
    );

    const syncActiveSlide = () => {
      const centre = deck.scrollTop + deck.clientHeight / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      slideElements.forEach((slide, index) => {
        const slideCentre = slide.offsetTop + slide.offsetHeight / 2;
        const distance = Math.abs(slideCentre - centre);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    const handleKeyboard = (event: KeyboardEvent) => {
      const eventTarget = event.target;
      if (
        eventTarget instanceof HTMLElement &&
        eventTarget.closest(
          "a, button, input, textarea, select, [role='button'], [contenteditable='true']",
        )
      ) {
        return;
      }

      const current = activeIndexRef.current;
      if (["ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        goToSlide(current + 1);
      } else if (["ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        goToSlide(current - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goToSlide(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goToSlide(slideElements.length - 1);
      }
    };

    deck.addEventListener("scroll", syncActiveSlide, { passive: true });
    window.addEventListener("keydown", handleKeyboard);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncVideoMotion = () => {
      deck.querySelectorAll("video").forEach((video) => {
        if (reduceMotion.matches) video.pause();
        else void video.play().catch(() => undefined);
      });
    };
    reduceMotion.addEventListener("change", syncVideoMotion);
    syncVideoMotion();
    syncActiveSlide();

    return () => {
      document.body.classList.remove("proposal-deck-open");
      deck.removeEventListener("scroll", syncActiveSlide);
      window.removeEventListener("keydown", handleKeyboard);
      reduceMotion.removeEventListener("change", syncVideoMotion);
    };
  }, [goToSlide]);

  return (
    <div className={`chr-content ${styles.proposal}`}>
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
        aria-label="Website proposal for Decode Tax Accountants"
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
              <div className="chr-content-container">
                <div className={`home-banner-content ${styles.coverContent}`}>
                  <p className="small-title">Website proposal</p>
                  <h1 className="title" id="proposal-cover-title">
                    <span className={styles.coverLine}>Built for</span>
                    <span className={styles.coverLine}>Decode Tax</span>
                    <span className={`highlight ${styles.coverLine}`}>Accountants</span>
                  </h1>
                  <p className={styles.coverLead}>
                    A professional website designed to turn trust into enquiries.
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
                    <span><strong>7 days</strong> target delivery</span>
                    <span><strong>$1,499</strong> one-off</span>
                    <span><strong>100%</strong> ownership</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="opportunity-title"
            className={`${styles.slide} ${styles.opportunitySlide}`}
            data-proposal-slide
            id="opportunity"
            tabIndex={-1}
          >
            <div className="chr-content-container section-three-heading-part">
              <div className="left-part">
                <p className="small-title">Understanding your business</p>
                <h2 className="sub-title" id="opportunity-title">
                  Make trust the
                  <br />
                  <span className="highlight">obvious first impression</span>
                </h2>
              </div>
              <div className={`right-part wysiwyg-wrapper ${styles.opportunityCopy}`}>
                <p>
                  Decode Tax Accountants helps individuals and businesses navigate
                  tax, compliance and financial planning. Potential clients need to
                  see credibility, understand your expertise and feel safe placing
                  their finances in your hands.
                </p>
                <p>
                  The new website will position Decode as the go-to firm and make it
                  easy for the right clients to understand your services and get in
                  touch.
                </p>
              </div>
              <div className={styles.outcomeStrip}>
                <span><CheckCircle2 /> Build credibility</span>
                <span><CheckCircle2 /> Explain services clearly</span>
                <span><CheckCircle2 /> Generate enquiries</span>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="moonlane-title"
            className={`${styles.slide} ${styles.yellowSlide}`}
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
                  <Image
                    alt="Google Rating 5.0, based on 151 plus reviews"
                    className={styles.googleBadge}
                    height={161}
                    src="/wp-content/uploads/2025/10/Google-Review-Badge1.png"
                    width={328}
                  />
                </div>
              </div>
            </div>
          </section>

          <ServiceSlide
            eyebrow="What is included"
            id="scope-included"
            items={includedItems}
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
                Ready for customers in
                <br />
                <span className="highlight">7 days</span>
              </h2>
            </div>
            <div className={`confidence-bar ${styles.compactBar}`}>
              <div className="chr-content-container">
                <div className="item-list">
                  <ProgressItem icon={Clock3} title="7-day target" description="From project-ready handover" />
                  <ProgressItem icon={MessageSquareText} title="Unlimited revisions" description="Throughout the active build" />
                  <ProgressItem icon={ShieldCheck} title="Fully functional" description="Prepared and tested for customers" />
                  <ProgressItem icon={Check} title="Clear handover" description="Review, connect and go live" />
                </div>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="accounting-title"
            className={`${styles.slide} ${styles.accountingSlide}`}
            data-proposal-slide
            id="accounting-work"
            tabIndex={-1}
          >
            <div className={`chr-content-container ${styles.accountingHeading}`}>
              <p className="small-title">Relevant experience</p>
              <h2 className="sub-title" id="accounting-title">
                Accounting websites
                <br />
                <span className="highlight">you can explore</span>
              </h2>
            </div>
            <div className={styles.accountingList}>
              {accountingWork.map((project, index) => (
                <a href={project.href} key={project.name} rel="noreferrer" target="_blank">
                  <span className={styles.listNumber}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={styles.accountingName}>
                    <strong>{project.name}</strong>
                    <small>{project.note}</small>
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
            <div className={`chr-section-two ${styles.sectionTwo} ${styles.investmentSection}`}>
              <div className="chr-content-container">
                <div className={`image-wrapper ${styles.priceVisual}`}>
                  <span className={styles.priceLabel}>Total investment</span>
                  <strong>$1,499</strong>
                  <span>one-off fee</span>
                </div>
                <div className="section-two-content wysiwyg-wrapper">
                  <p className="small-title">Clear investment</p>
                  <h2 className="sub-title" id="investment-title">
                    One price.
                    <br />
                    <span className="highlight">Everything above.</span>
                  </h2>
                  <p className={styles.depositCallout}>
                    <strong>A $750 deposit</strong>
                    <small>gets the project started</small>
                  </p>
                  <p className={styles.noMaintenance}>
                    No mandatory ongoing maintenance plan.
                  </p>
                  <div className={`section-two-icon-list ${styles.investmentFacts}`}>
                    <div className="single-item"><ShieldCheck /><span>100% money-back guarantee if you are not happy</span></div>
                    <div className="single-item"><MessageSquareText /><span>Unlimited revisions</span></div>
                    <div className="single-item"><KeyRound /><span>Full website and account ownership</span></div>
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
                  <Globe2 aria-hidden="true" />
                  <span>GoDaddy domain</span>
                  <ServerCog aria-hidden="true" />
                  <span>Vercel hosting</span>
                  <MailCheck aria-hidden="true" />
                  <span>Outlook unaffected</span>
                </div>
              </div>
              <div className="text-part wysiwyg-wrapper">
                <p className="small-title">Hosting and handover</p>
                <h2 className="sub-title" id="hosting-title">
                  Fast hosting.
                  <br />
                  <span className="highlight">Complete control.</span>
                </h2>
                <p>
                  Your site will be hosted on Vercel, the platform used by companies
                  including Netflix and Uber. Its free tier provides fast, secure
                  hosting for this project.
                </p>
                <ul>
                  <li>Your domain remains registered in your GoDaddy account.</li>
                  <li>Your existing Outlook email remains unaffected.</li>
                  <li>All Vercel and website login credentials are handed over.</li>
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
                  <li className="single-item"><span className={styles.stepNumber}>02</span><span><strong>Pay the $750 deposit</strong><small>The deposit kicks off the build.</small></span></li>
                  <li className="single-item"><span className={styles.stepNumber}>03</span><span><strong>We build your website</strong><small>The 7-day target starts from project-ready handover.</small></span></li>
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
                  <form className={styles.acceptanceForm} onSubmit={handleProposalAcceptance}>
                    <label>
                      <span>Your name</span>
                      <input autoComplete="name" name="name" required type="text" />
                    </label>
                    <label>
                      <span>Your email</span>
                      <input autoComplete="email" name="email" required type="email" />
                    </label>
                    <label className={styles.honeypot} aria-hidden="true">
                      <span>Website</span>
                      <input autoComplete="off" name="website" tabIndex={-1} type="text" />
                    </label>
                    <label className={styles.acceptanceConsent}>
                      <input name="authorityConfirmed" required type="checkbox" />
                      <span>I confirm I am authorised to accept this proposal for Decode Tax Accountants.</span>
                    </label>
                    <label className={styles.acceptanceConsent}>
                      <input name="scopeConfirmed" required type="checkbox" />
                      <span>I accept the proposed scope, $1,499 total investment and $750 deposit.</span>
                    </label>
                    <button
                      className="button"
                      disabled={acceptanceState.status === "sending"}
                      type="submit"
                    >
                      {acceptanceState.status === "sending" ? "Sending acceptance…" : "Accept proposal"}
                    </button>
                    {acceptanceState.status === "error" ? (
                      <p className={styles.acceptanceMessage} role="alert">
                        {acceptanceState.message}
                      </p>
                    ) : null}
                    <a className={styles.phoneLink} href="tel:0414134081">
                      <Phone aria-hidden="true" /> Call 0414 134 081
                    </a>
                  </form>
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
          <ChevronUp aria-hidden="true" />
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
          <ChevronDown aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
}

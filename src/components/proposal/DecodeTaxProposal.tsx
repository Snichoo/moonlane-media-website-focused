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
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./DecodeTaxProposal.module.css";

const slides = [
  "Proposal",
  "The opportunity",
  "Why Moonlane",
  "Convert visitors",
  "Be found and own it",
  "Delivery promise",
  "Selected work",
  "Accounting experience",
  "Investment",
  "Hosting and handover",
  "Editing and support",
  "How it works",
  "Next step",
] as const;

type ServiceItem = {
  description: string;
  icon: LucideIcon;
  title: string;
};

const selectedWork = [
  {
    desktop: "/wp-content/uploads/2026/05/CYC-590x250-2.png",
    href: "/case-study/cyc",
    mobile: "/wp-content/uploads/2026/05/CYC-380x290-2.png",
    name: "CYC",
    type: "Strategy, UI/UX and development",
  },
  {
    desktop: "/wp-content/uploads/2026/05/BOA-590x250-4.png",
    href: "/case-study/boa",
    mobile: "/wp-content/uploads/2026/05/BOA-380x290-2.png",
    name: "Builders of Architecture",
    type: "Brand-led website design",
  },
  {
    desktop: "/wp-content/uploads/2026/05/PowerPlus-590x250-2.png",
    href: "/case-study/powerplus-energy",
    mobile: "/wp-content/uploads/2026/05/PowerPlus-380x290-2.png",
    name: "PowerPlus Energy",
    type: "Conversion-focused digital platform",
  },
] as const;

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

const convertItems: ServiceItem[] = [
  {
    description:
      "A professional, modern website built from a conversion blueprint to create trust and turn visitors into enquiries.",
    icon: Palette,
    title: "Custom, high-conversion design",
  },
  {
    description:
      "Dedicated pages make each accounting, tax and advisory service easy to find and understand.",
    icon: FileText,
    title: "Service pages",
  },
  {
    description:
      "Contact-form enquiries go straight to your preferred phone, email or notification destination.",
    icon: BellRing,
    title: "Lead notifications",
  },
];

const searchItems: ServiceItem[] = [
  {
    description:
      "Location-specific pages support local search visibility across the suburbs and areas you choose to target.",
    icon: MapPinned,
    title: "Suburb targeting pages",
  },
  {
    description:
      "The site is structured from the ground up around your agreed target keywords and on-page SEO foundations.",
    icon: SearchCheck,
    title: "SEO optimisation",
  },
  {
    description:
      "Once the site is live, every login is handed over. The website and its accounts are yours, 100%.",
    icon: KeyRound,
    title: "Full ownership",
  },
];

const supportItems: ServiceItem[] = [
  {
    description:
      "All reasonable revisions during the build are included, so the final site feels right before launch.",
    icon: MessageSquareText,
    title: "Revisions included during the build",
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
                <p className="small-title">The opportunity</p>
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
                    alt="Moonlane Media web design team"
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
                    A focused team built around
                    <br />
                    <span className="highlight">your growth</span>
                  </h2>
                  <p>
                    We build professional, high-converting websites that help
                    businesses get online, earn trust and bring in leads and sales.
                    Your project is handled directly by an experienced senior web
                    designer.
                  </p>
                  <div className={`section-two-icon-list ${styles.proofList}`}>
                    <div className="single-item"><Sparkles /><span>No AI-generated content</span></div>
                    <div className="single-item"><CopyX /><span>No cookie-cutter templates</span></div>
                    <div className="single-item"><UsersRound /><span>No outsourcing</span></div>
                    <div className="single-item"><ShieldCheck /><span>Senior, experienced designer</span></div>
                  </div>
                  <div className={styles.ratingRow}>
                    <span><strong>Clutch</strong> ★★★★★ 5/5</span>
                    <span><strong>Google</strong> ★★★★★</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <ServiceSlide
            eyebrow="What is included — 01"
            id="scope-convert"
            items={convertItems}
            title={<>A website designed to <span className="highlight">convert</span></>}
          />

          <ServiceSlide
            eyebrow="What is included — 02"
            id="scope-search"
            items={searchItems}
            title={<>Built to be found. <span className="highlight">Owned by you.</span></>}
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
              <p>
                The 7-day target begins once the deposit, required content and
                access are received, with timely feedback during the build.
              </p>
            </div>
            <div className={`confidence-bar ${styles.compactBar}`}>
              <div className="chr-content-container">
                <div className="item-list">
                  <ProgressItem icon={Clock3} title="7-day target" description="From project-ready handover" />
                  <ProgressItem icon={MessageSquareText} title="Revisions included" description="Throughout the active build" />
                  <ProgressItem icon={ShieldCheck} title="Fully functional" description="Prepared and tested for customers" />
                  <ProgressItem icon={Check} title="Clear handover" description="Review, connect and go live" />
                </div>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="work-title"
            className={`${styles.slide} ${styles.workSlide} our-work-part`}
            data-proposal-slide
            id="selected-work"
            tabIndex={-1}
          >
            <div className="chr-content-container">
              <div className="our-work-heading-part">
                <p className="small-title">Selected website work</p>
                <h2 className="sub-title" id="work-title">
                  Designed to look good.
                  <br />
                  Built to <span className="highlight">work hard.</span>
                </h2>
                <p className={styles.swipeHint}>Swipe the projects on mobile.</p>
              </div>
              <div className={`highlight-case-studies ${styles.workRail}`}>
                {selectedWork.map((project) => (
                  <article className="single-case-study show-on-responsive" key={project.name}>
                    <Link className="project-link" href={project.href} target="_blank">
                      <Image
                        alt={`${project.name} website project`}
                        className="featured-image v1"
                        height={290}
                        sizes="(max-width: 766px) 86vw, 380px"
                        src={project.mobile}
                        width={380}
                      />
                      <Image
                        alt=""
                        aria-hidden="true"
                        className="featured-image v2"
                        height={250}
                        sizes="(min-width: 767px) 33vw, 1px"
                        src={project.desktop}
                        width={590}
                      />
                      <span className={styles.workCaption}>
                        <strong>{project.name}</strong>
                        <small>{project.type}</small>
                      </span>
                    </Link>
                  </article>
                ))}
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
                  <p>
                    A <strong>$750 deposit</strong> gets the project started. There
                    is no mandatory ongoing maintenance plan.
                  </p>
                  <div className={`section-two-icon-list ${styles.investmentFacts}`}>
                    <div className="single-item"><ShieldCheck /><span>100% money-back guarantee if you are not happy</span></div>
                    <div className="single-item"><MessageSquareText /><span>All revisions during the build included</span></div>
                    <div className="single-item"><KeyRound /><span>Full account and website ownership</span></div>
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
                <p className="small-title">Next step</p>
                <h2 className="sub-title" id="next-step-title">
                  Ready to get
                  <br />
                  <span className="highlight">more clients?</span>
                </h2>
              </div>
              <div className={`right-part wysiwyg-wrapper ${styles.finalCopy}`}>
                <p>
                  Reply to this proposal or call Moonlane Media to schedule the
                  discovery call. Let&apos;s build something great together.
                </p>
                <a className="button" href="tel:0414134081">
                  <Phone aria-hidden="true" /> Call 0414 134 081
                </a>
              </div>
            </div>
            <div className={`confidence-bar ${styles.finalBar}`}>
              <div className="chr-content-container">
                <div className="item-list">
                  <ProgressItem icon={Clock3} title="7 days" description="Target delivery" />
                  <ProgressItem icon={ShieldCheck} title="Guaranteed" description="100% satisfaction" />
                  <ProgressItem icon={KeyRound} title="Yours" description="Full ownership" />
                </div>
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

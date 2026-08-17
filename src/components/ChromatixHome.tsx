"use client";

import { useEffect, useRef } from "react";
import { initBehaviors } from "@/lib/behaviors";
import { initSliders } from "@/lib/sliders";
import { sections as landingSections } from "@/sections/markup-landing";
import { sections as rootSections } from "@/sections/markup-root";
import type { SiteVariant } from "@/types/sections";

/**
 * Faithful reconstruction of the Chromatix homepage. The outer wrapper /
 * section elements are authored here in JSX (preserving the exact DOM
 * hierarchy the ported theme CSS targets), while each section's inner markup
 * is injected verbatim from the cleaned, self-contained extraction. All
 * interactions (sticky header, parallax, count-up, sliders, FAQ accordion,
 * side-form) are re-attached on mount.
 *
 * `variant` picks the copy of the site: `landing` is the untouched extraction
 * served under /landing-page for Google Ads, while `root` uses the truthful
 * 5+ years copy and root-only social proof sections.
 */
export default function ChromatixHome({
  variant = "root",
}: {
  variant?: SiteVariant;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let sliderCleanup: (() => void) | undefined;

    const behaviorCleanup = initBehaviors(document);

    // Kick off autoplay for the background videos (muted + playsinline set).
    // The hero flower video starts playing while the HTML is still streaming,
    // so rewind it here — otherwise the 12s one-shot bloom can already be
    // half over (or finished) by the time the page is visible.
    document.querySelectorAll("video").forEach((v) => {
      v.muted = true;
      if (v.id === "home-banner-video") v.currentTime = 0;
      v.play().catch(() => {});
    });

    initSliders().then((cleanup) => {
      if (cancelled) cleanup();
      else sliderCleanup = cleanup;
    });

    return () => {
      cancelled = true;
      behaviorCleanup();
      sliderCleanup?.();
    };
  }, []);

  const inject = (html: string) => ({ __html: html });
  const S = variant === "landing" ? landingSections : rootSections;

  return (
    <div
      className={variant === "root" ? "chr-content site-variant-root" : "chr-content"}
      ref={rootRef}
    >
      <header
        className="chr-header home"
        id="chr-header"
        dangerouslySetInnerHTML={inject(S.header)}
      />

      <section
        className="side-form-section conversioncow-style"
        dangerouslySetInnerHTML={inject(S.sideForm)}
      />

      <div className="chr-content clearfix">
        <div className="front-page">
          <div className="home-banner" id="home-banner" dangerouslySetInnerHTML={inject(S.homeBanner)} />
          <div className="section-two" id="chr-section-two" dangerouslySetInnerHTML={inject(S.sectionTwo)} />
          <div className="our-work-part" id="our-work-part" dangerouslySetInnerHTML={inject(S.ourWork)} />
          {S.testimonials && (
            <div
              className="testimonial-video-slider-section"
              id="testimonial-video-slider-section"
              dangerouslySetInnerHTML={inject(S.testimonials)}
            />
          )}
          <div className="section-three" id="chr-section-three" dangerouslySetInnerHTML={inject(S.sectionThree)} />
          {S.partners && (
            <div className="our-partners-part" id="our-partners-part" dangerouslySetInnerHTML={inject(S.partners)} />
          )}
          <div className="faq-section" id="chr-faq-section" dangerouslySetInnerHTML={inject(S.faq)} />
          <div
            className="confidence-bar"
            id="chr-confidence-bar"
            dangerouslySetInnerHTML={inject(S.confidenceBar)}
          />
        </div>
      </div>

      <footer className="chr-footer" id="chr-footer" dangerouslySetInnerHTML={inject(S.footer)} />

      <div className="mobile-bottom-button-wrapper" dangerouslySetInnerHTML={inject(S.mobileButton)} />
    </div>
  );
}

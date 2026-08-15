"use client";

import { useEffect, useRef } from "react";
import { initBehaviors } from "@/lib/behaviors";
import { getLocation } from "@/lib/locations";
import type { LocationSlug } from "@/lib/locations";
import { initSliders } from "@/lib/sliders";
import { getLocationHomeSections } from "@/sections/markup-location";

export default function LocationHomePage({
  locationSlug,
}: {
  locationSlug: LocationSlug;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const location = getLocation(locationSlug);

  if (!location) {
    throw new Error(`Unknown location page: ${locationSlug}`);
  }

  const sections = getLocationHomeSections(location);

  useEffect(() => {
    let cancelled = false;
    let sliderCleanup: (() => void) | undefined;
    const behaviorCleanup = initBehaviors(document);

    document.querySelectorAll("video").forEach((video) => {
      video.muted = true;
      if (video.id === "home-banner-video") video.currentTime = 0;
      video.play().catch(() => {});
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

  return (
    <div className="chr-content" ref={rootRef}>
      <header
        className="chr-header home"
        id="chr-header"
        dangerouslySetInnerHTML={inject(sections.header)}
      />

      <section
        className="side-form-section conversioncow-style"
        dangerouslySetInnerHTML={inject(sections.sideForm)}
      />

      <div className="chr-content clearfix">
        <div className="front-page">
          <div
            className="home-banner"
            id="home-banner"
            dangerouslySetInnerHTML={inject(sections.homeBanner)}
          />
          <div
            className="section-two"
            id="chr-section-two"
            dangerouslySetInnerHTML={inject(sections.sectionTwo)}
          />
          <div
            className="our-work-part"
            id="our-work-part"
            dangerouslySetInnerHTML={inject(sections.ourWork)}
          />
          <div
            className="testimonial-video-slider-section"
            id="testimonial-video-slider-section"
            dangerouslySetInnerHTML={inject(sections.testimonials)}
          />
          <div
            className="section-three"
            id="chr-section-three"
            dangerouslySetInnerHTML={inject(sections.sectionThree)}
          />
          <div
            className="our-partners-part"
            id="our-partners-part"
            dangerouslySetInnerHTML={inject(sections.partners)}
          />
          <div
            className="faq-section"
            id="chr-faq-section"
            dangerouslySetInnerHTML={inject(sections.faq)}
          />
          <div
            className="confidence-bar"
            id="chr-confidence-bar"
            dangerouslySetInnerHTML={inject(sections.confidenceBar)}
          />
        </div>
      </div>

      <footer
        className="chr-footer"
        id="chr-footer"
        dangerouslySetInnerHTML={inject(sections.footer)}
      />

      <div
        className="mobile-bottom-button-wrapper"
        dangerouslySetInnerHTML={inject(sections.mobileButton)}
      />
    </div>
  );
}

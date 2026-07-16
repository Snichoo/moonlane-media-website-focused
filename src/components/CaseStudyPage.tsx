"use client";

import { useEffect } from "react";
import { initBehaviors } from "@/lib/behaviors";
import * as S from "@/sections/markup";
import { caseStudies } from "@/sections/case-studies";

/**
 * Case-study sub-page: reuses the shared header / side-form / footer markup
 * from the homepage extraction and injects the page's cleaned
 * `.sub-page.case-study-page` content. Behaviors (sticky header, side form,
 * fade-on-view reveals, forms) are re-attached on mount; these pages have no
 * carousels, so the Slick bundle is not loaded.
 */
export default function CaseStudyPage({ slug }: { slug: string }) {
  useEffect(() => {
    const cleanup = initBehaviors(document);
    document.querySelectorAll("video").forEach((v) => {
      v.muted = true;
      v.play().catch(() => {});
    });
    return cleanup;
  }, []);

  const cs = caseStudies[slug];
  const inject = (html: string) => ({ __html: html });
  // Sub-page header differs from home: no `home` state, no current-page menu
  // underline, and the theme omits the header phone bubble entirely.
  const subHeader = S.header
    .replace("chr-logo-container home", "chr-logo-container")
    .replaceAll("current-menu-item", "")
    .replaceAll("current-page-item", "")
    .replace(/<a class="chr-header-phone(?:-in-menu)?"[\s\S]*?<\/a>/g, "");

  return (
    <div className="chr-content">
      {/* Per-page brand accent emitted by the original page's inline style block */}
      <style dangerouslySetInnerHTML={inject(cs.css)} />
      <header className="chr-header" id="chr-header" dangerouslySetInnerHTML={inject(subHeader)} />

      <section
        className="side-form-section conversioncow-style"
        dangerouslySetInnerHTML={inject(S.sideForm)}
      />

      <div className="chr-content clearfix">
        <div className="sub-page case-study-page" dangerouslySetInnerHTML={inject(cs.html)} />
      </div>

      <footer className="chr-footer" id="chr-footer" dangerouslySetInnerHTML={inject(S.footer)} />

      <div className="mobile-bottom-button-wrapper" dangerouslySetInnerHTML={inject(S.mobileButton)} />
    </div>
  );
}

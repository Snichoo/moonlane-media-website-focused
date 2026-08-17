"use client";

import { useEffect } from "react";
import { initBehaviors } from "@/lib/behaviors";
import { rebase, shell as landingShell } from "@/sections/markup-landing";
import { contactBody as rootBody, shell as rootShell } from "@/sections/markup-root";
import { contactHtml } from "@/sections/contact";
import type { SiteVariant } from "@/types/sections";

/**
 * Contact sub-page: shared header / side-form / footer shell around the
 * cleaned `.sub-page.sub-page--contact` content (project form, office list,
 * testimonial). Behaviors re-attach on mount; no carousels on this page.
 */
export default function ContactPage({
  variant = "root",
}: {
  variant?: SiteVariant;
}) {
  useEffect(() => {
    const cleanup = initBehaviors(document);
    document.querySelectorAll("video").forEach((v) => {
      v.muted = true;
      v.play().catch(() => {});
    });
    return cleanup;
  }, []);

  const inject = (html: string) => ({ __html: html });
  const isLanding = variant === "landing";
  const S = isLanding ? landingShell : rootShell;
  const body = isLanding ? rebase(contactHtml) : rootBody;
  const subHeader = S.header
    .replace("chr-logo-container home", "chr-logo-container")
    .replaceAll("current-menu-item", "")
    .replaceAll("current-page-item", "")
    .replace(/<a class="chr-header-phone(?:-in-menu)?"[\s\S]*?<\/a>/g, "");

  return (
    <div className="chr-content">
      <header className="chr-header" id="chr-header" dangerouslySetInnerHTML={inject(subHeader)} />

      <section
        className="side-form-section conversioncow-style"
        dangerouslySetInnerHTML={inject(S.sideForm)}
      />

      <div className="chr-content clearfix">
        <div className="sub-page sub-page--contact" dangerouslySetInnerHTML={inject(body)} />
      </div>

      <footer className="chr-footer" id="chr-footer" dangerouslySetInnerHTML={inject(S.footer)} />

      <div className="mobile-bottom-button-wrapper" dangerouslySetInnerHTML={inject(S.mobileButton)} />
    </div>
  );
}

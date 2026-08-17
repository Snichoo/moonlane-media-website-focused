// The Google Ads landing tree at `/landing-page`: the site exactly as extracted,
// with its internal links (and the forms' page-url attribution) rebased so a
// visitor who arrives from an ad stays inside the landing funnel instead of
// falling through to the trimmed main site at `/`.

import { rebaseLinks, rebasePageUrl } from "@/lib/html-edit";
import type { HomeSections, ShellSections } from "@/types/sections";
import * as base from "./markup";

export const LANDING_BASE = "/landing-page";

export const rebase = (html: string) =>
  rebasePageUrl(rebaseLinks(html, LANDING_BASE), LANDING_BASE);

export const shell: ShellSections = {
  header: rebase(base.header),
  sideForm: rebase(base.sideForm),
  footer: rebase(base.footer),
  mobileButton: rebase(base.mobileButton),
};

export const sections: HomeSections = {
  ...shell,
  homeBanner: rebase(base.homeBanner),
  sectionTwo: rebase(base.sectionTwo),
  ourWork: rebase(base.ourWork),
  testimonials: rebase(base.testimonials),
  sectionThree: rebase(base.sectionThree),
  partners: rebase(base.partners),
  faq: rebase(base.faq),
  confidenceBar: rebase(base.confidenceBar),
};

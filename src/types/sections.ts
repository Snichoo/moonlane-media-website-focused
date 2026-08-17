/** Which copy of the site a page belongs to. */
export type SiteVariant = "root" | "landing";

/** The chrome every route wraps its content in. */
export interface ShellSections {
  header: string;
  sideForm: string;
  footer: string;
  mobileButton: string;
}

/**
 * The homepage sections. `testimonials` and `partners` stay optional so a future
 * page variant can deliberately omit either social-proof block.
 */
export interface HomeSections extends ShellSections {
  homeBanner: string;
  sectionTwo: string;
  ourWork: string;
  sectionThree: string;
  faq: string;
  confidenceBar: string;
  testimonials?: string;
  partners?: string;
}

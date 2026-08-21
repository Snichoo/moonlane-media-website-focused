import { getLocation } from "@/lib/locations";
import type { LocationSlug } from "@/lib/locations";
import { getLocationContactSections } from "@/sections/markup-location";
import LocationPageClient from "@/components/LocationPageClient";

export default function LocationContactPage({
  locationSlug,
}: {
  locationSlug: LocationSlug;
}) {
  const location = getLocation(locationSlug);

  if (!location) {
    throw new Error(`Unknown location page: ${locationSlug}`);
  }

  const sections = getLocationContactSections(location);

  const inject = (html: string) => ({ __html: html });
  const subHeader = sections.header
    .replace("chr-logo-container home", "chr-logo-container")
    .replaceAll("current-menu-item", "")
    .replaceAll("current-page-item", "")
    .replace(/<a class="chr-header-phone(?:-in-menu)?"[\s\S]*?<\/a>/g, "");

  return (
    <div className="chr-content paid-location-page">
      <header
        className="chr-header"
        id="chr-header"
        dangerouslySetInnerHTML={inject(subHeader)}
      />

      <section
        className="side-form-section conversioncow-style"
        dangerouslySetInnerHTML={inject(sections.sideForm)}
      />

      <div className="chr-content clearfix">
        <div
          className="sub-page sub-page--contact"
          dangerouslySetInnerHTML={inject(sections.body)}
        />
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
      <LocationPageClient />
    </div>
  );
}

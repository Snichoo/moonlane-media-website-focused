import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocationHomePage from "@/components/LocationHomePage";
import { getLocation } from "@/lib/locations";

const PRODUCTION_ORIGIN = "https://moonlanemedia.com.au";
const SOCIAL_IMAGE = `${PRODUCTION_ORIGIN}/wp-content/uploads/2018/02/about-mainimage.png`;

type LocationPageProps = {
  params: Promise<{ location: string }>;
};

export async function generateMetadata({
  params,
}: LocationPageProps): Promise<Metadata> {
  const { location: slug } = await params;
  const location = getLocation(slug);

  if (!location) notFound();

  const title = `Web Design ${location.city} | Moonlane Media`;
  const description = `Custom web design and development for ${location.city} businesses, focused on clear user journeys, enquiries and measurable commercial outcomes.`;
  const canonical = `${PRODUCTION_ORIGIN}${location.basePath}`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    robots: {
      index: false,
      follow: true,
      googleBot: { index: false, follow: true },
    },
    openGraph: {
      type: "website",
      locale: "en_AU",
      siteName: "Moonlane Media",
      title,
      description,
      url: canonical,
      images: [{ url: SOCIAL_IMAGE, alt: "Moonlane Media web design agency" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SOCIAL_IMAGE],
    },
  };
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { location: slug } = await params;
  const location = getLocation(slug);

  if (!location) notFound();

  return <LocationHomePage locationSlug={location.slug} />;
}

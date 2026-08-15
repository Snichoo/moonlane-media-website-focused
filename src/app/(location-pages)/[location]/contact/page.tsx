import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocationContactPage from "@/components/LocationContactPage";
import { getLocation } from "@/lib/locations";

const PRODUCTION_ORIGIN = "https://moonlanemedia.com.au";
const SOCIAL_IMAGE = `${PRODUCTION_ORIGIN}/wp-content/uploads/2018/02/about-mainimage.png`;

type LocationContactPageProps = {
  params: Promise<{ location: string }>;
};

export async function generateMetadata({
  params,
}: LocationContactPageProps): Promise<Metadata> {
  const { location: slug } = await params;
  const location = getLocation(slug);

  if (!location) notFound();

  const title = `Web Design Enquiry — ${location.city} | Moonlane Media`;
  const description = `Contact Moonlane Media about a custom web design or development project for your ${location.city} business.`;
  const canonical = `${PRODUCTION_ORIGIN}${location.contactPath}`;

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

export default async function LocationContactPageRoute({
  params,
}: LocationContactPageProps) {
  const { location: slug } = await params;
  const location = getLocation(slug);

  if (!location) notFound();

  return <LocationContactPage locationSlug={location.slug} />;
}

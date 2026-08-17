import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudyPage from "@/components/CaseStudyPage";
import { caseStudies, caseStudySlugs } from "@/sections/case-studies";

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = caseStudies[slug];
  // Part of the paid-traffic tree — see src/app/landing-page/page.tsx.
  const robots = { index: false, follow: true };
  // extracted titles already carry the "| Moonlane Media" suffix
  return cs
    ? {
        title: { absolute: cs.title },
        alternates: { canonical: `/landing-page/case-study/${slug}` },
        robots,
      }
    : { robots };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!caseStudies[slug]) notFound();
  return <CaseStudyPage slug={slug} variant="landing" />;
}

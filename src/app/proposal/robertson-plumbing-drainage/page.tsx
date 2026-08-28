import type { Metadata } from "next";
import { JHPlumbingProposal } from "@/components/proposal/JHPlumbingProposal";

const PROPOSAL_PATH = "/proposal/robertson-plumbing-drainage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: "Website Proposal for Robertson Plumbing & Drainage | Moonlane Media",
  },
  description:
    "A website design and development proposal prepared by Moonlane Media for Robertson Plumbing & Drainage.",
  alternates: {
    canonical: PROPOSAL_PATH,
  },
  referrer: "no-referrer",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-image-preview": "none",
      "max-snippet": 0,
      "max-video-preview": 0,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "Moonlane Media",
    title: "Website Proposal for Robertson Plumbing & Drainage",
    description:
      "A tailored website design and development proposal from Moonlane Media.",
    url: PROPOSAL_PATH,
    images: [
      {
        url: "/wp-content/uploads/2018/11/home-intro-2019.png",
        alt: "Moonlane Media website proposal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Proposal for Robertson Plumbing & Drainage",
    description:
      "A tailored website design and development proposal from Moonlane Media.",
    images: ["/wp-content/uploads/2018/11/home-intro-2019.png"],
  },
};

export default function RobertsonPlumbingDrainageProposalPage() {
  return (
    <JHPlumbingProposal
      acceptanceEndpoint="/api/proposals/robertson-plumbing-drainage/accept"
      clearMobileCoverText
      clientName="Robertson Plumbing & Drainage"
      coverHighlight="& Drainage"
      coverPrimary="Robertson Plumbing"
      opportunityLead="Robertson Plumbing & Drainage needs a clear, professional website that helps customers quickly understand its plumbing and drainage work, the areas it covers and the fastest way to get in touch."
      opportunitySupport="The new website will give Robertson Plumbing & Drainage a credible, mobile-first presence, clearly present its plumbing and drainage services and make calling or requesting a quote immediate."
      outcomeLabels={[
        "Make calling immediate",
        "Explain plumbing and drainage",
        "Target service areas",
      ]}
      deposit="$475"
      servicePagesDescription="Drainage, blocked drains, hot water, renovations and maintenance."
      showOpportunity={false}
      totalInvestment="$950"
    />
  );
}

import type { Metadata } from "next";
import { JHPlumbingProposal } from "@/components/proposal/JHPlumbingProposal";

const PROPOSAL_PATH = "/proposal/my-plumb-tech";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: "Website Proposal for My Plumb Tech | Moonlane Media",
  },
  description:
    "A website design and development proposal prepared by Moonlane Media for My Plumb Tech.",
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
    title: "Website Proposal for My Plumb Tech",
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
    title: "Website Proposal for My Plumb Tech",
    description:
      "A tailored website design and development proposal from Moonlane Media.",
    images: ["/wp-content/uploads/2018/11/home-intro-2019.png"],
  },
};

export default function MyPlumbTechProposalPage() {
  return (
    <JHPlumbingProposal
      acceptanceEndpoint="/api/proposals/my-plumb-tech/accept"
      clientName="My Plumb Tech"
      coverHighlight="Tech"
      coverLead="A fast, mobile-first website designed to turn local plumbing, hot water and emergency searches into phone calls."
      coverPrimary="My Plumb"
      deposit="$475"
      offerNote="Offer ends this Sunday"
      opportunityLead="My Plumb Tech needs a clear, professional website that shows the full range of its plumbing, gas and hot water work, the suburbs it covers and the fastest way to get a plumber on site."
      opportunitySupport="The new website will give My Plumb Tech a credible, mobile-first presence, present every service properly and make calling or requesting a quote immediate, day or night."
      outcomeLabels={[
        "Make calling immediate",
        "Explain every service",
        "Target service suburbs",
      ]}
      servicePagesDescription="Blocked drains, hot water, gas fitting, leak detection and emergency callouts."
      totalInvestment="$950"
      usualInvestment="$2,000"
    />
  );
}

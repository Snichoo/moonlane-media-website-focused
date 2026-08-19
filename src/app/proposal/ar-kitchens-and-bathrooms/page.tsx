import type { Metadata } from "next";
import { JHPlumbingProposal } from "@/components/proposal/JHPlumbingProposal";

const PROPOSAL_PATH = "/proposal/ar-kitchens-and-bathrooms";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: "Website Proposal for A&R Kitchens and Bathrooms | Moonlane Media",
  },
  description:
    "A website design and development proposal prepared by Moonlane Media for A&R Kitchens and Bathrooms.",
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
    title: "Website Proposal for A&R Kitchens and Bathrooms",
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
    title: "Website Proposal for A&R Kitchens and Bathrooms",
    description:
      "A tailored website design and development proposal from Moonlane Media.",
    images: ["/wp-content/uploads/2018/11/home-intro-2019.png"],
  },
};

export default function ARKitchensAndBathroomsProposalPage() {
  return (
    <JHPlumbingProposal
      acceptanceEndpoint="/api/proposals/ar-kitchens-and-bathrooms/accept"
      clientName="A&R Kitchens and Bathrooms"
      coverHighlight="& Bathrooms"
      coverLead="A fast, mobile-first website designed to turn local kitchen and bathroom renovation searches into quote enquiries."
      coverPrimary="A&R Kitchens"
      opportunityLead="A&R Kitchens and Bathrooms needs a clear, professional website that helps customers understand its renovation services, see the quality of its work and request a quote."
      opportunitySupport="The new website will create a credible, mobile-first presence, clearly present kitchen and bathroom services, showcase completed projects and make enquiries simple."
      outcomeLabels={[
        "Showcase completed projects",
        "Explain renovation services",
        "Target service areas",
      ]}
      servicePagesDescription="Kitchens, bathrooms, laundries and renovation services."
    />
  );
}

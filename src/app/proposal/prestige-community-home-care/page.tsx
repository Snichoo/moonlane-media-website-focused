import type { Metadata } from "next";
import { JHPlumbingProposal } from "@/components/proposal/JHPlumbingProposal";

const PROPOSAL_PATH = "/proposal/prestige-community-home-care";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute:
      "Website Proposal for Prestige Community Home Care | Moonlane Media",
  },
  description:
    "A website design and development proposal prepared by Moonlane Media for Prestige Community Home Care.",
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
    title: "Website Proposal for Prestige Community Home Care",
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
    title: "Website Proposal for Prestige Community Home Care",
    description:
      "A tailored website design and development proposal from Moonlane Media.",
    images: ["/wp-content/uploads/2018/11/home-intro-2019.png"],
  },
};

export default function PrestigeCommunityHomeCareProposalPage() {
  return (
    <JHPlumbingProposal
      acceptanceEndpoint="/api/proposals/prestige-community-home-care/accept"
      clearMobileCoverText
      clientName="Prestige Community Home Care"
      coverHighlight="Home Care"
      coverLead="A warm, easy-to-navigate website that helps families find the right in-home care and take the first step."
      coverPrimary="Prestige Community"
      opportunityLead="Prestige Community Home Care needs a clear, reassuring website that helps older Australians and their families understand its in-home care and disability support, the areas it covers and how to arrange a no-obligation consultation."
      opportunitySupport="The new website will give Prestige Community Home Care a credible, mobile-first presence, explain its services and funding options in plain language, and make enquiring simple for families making a difficult decision."
      outcomeLabels={[
        "Build family trust",
        "Explain care and funding",
        "Target service areas",
      ]}
      servicePagesDescription="In-home aged care, nursing, respite and disability support."
      workItems={[
        {
          href: "https://www.eliteema.com.au/",
          name: "Elite Electrical",
          result: "Over 100 leads a month, halved cost per lead in 3 months",
        },
        {
          href: "https://www.enviroenergy.net.au/",
          name: "EnviroEnergy",
          result:
            "5x lower cost per conversion than industry standard in the first month",
        },
        {
          href: "https://singhroofing.com.au/",
          name: "Singh Roofing",
          result: "Halved cost per lead in 2 months",
        },
        {
          href: "https://happyboxstore.com/",
          name: "You Are Appreciated Gifting Co.",
          result: "340% increase in online orders within 3 months",
        },
      ]}
    />
  );
}

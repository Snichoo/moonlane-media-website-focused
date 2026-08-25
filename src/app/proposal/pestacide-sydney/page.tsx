import type { Metadata } from "next";
import { JHPlumbingProposal } from "@/components/proposal/JHPlumbingProposal";

const PROPOSAL_PATH = "/proposal/pestacide-sydney";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: "Website Proposal for Pestacide Sydney | Moonlane Media",
  },
  description:
    "A website design and development proposal prepared by Moonlane Media for Pestacide Sydney.",
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
    title: "Website Proposal for Pestacide Sydney",
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
    title: "Website Proposal for Pestacide Sydney",
    description:
      "A tailored website design and development proposal from Moonlane Media.",
    images: ["/wp-content/uploads/2018/11/home-intro-2019.png"],
  },
};

export default function PestacideSydneyProposalPage() {
  return (
    <JHPlumbingProposal
      acceptanceEndpoint="/api/proposals/pestacide-sydney/accept"
      clientName="Pestacide Sydney"
      coverHighlight="Sydney"
      coverLead="A fast, mobile-first website designed to turn local pest control searches into phone calls."
      coverPrimary="Pestacide"
      opportunityLead="Pestacide Sydney needs a clear, professional website that shows the pests it treats, the suburbs it covers and the fastest way to book an inspection."
      opportunitySupport="The new website will give Pestacide Sydney a credible, mobile-first presence, present every treatment properly and make calling or requesting a quote immediate."
      outcomeLabels={[
        "Make calling immediate",
        "Explain every treatment",
        "Target Sydney suburbs",
      ]}
      servicePagesDescription="Termites, cockroaches, rodents, spiders, ants and bed bugs."
      workItems={[
        {
          href: "https://asaptrades.com.au/",
          name: "ASAP Trades",
          result: "Over 200 extra leads a month and a 200% increase in ROI",
        },
        {
          href: "https://oldmateplumbing.com.au/",
          name: "Old Mate Plumbing Co.",
          result: "600% increase in lead quality and ROI in the first month",
        },
        {
          href: "https://www.eliteema.com.au/",
          name: "Elite Electrical",
          result: "Over 100 leads a month, halved cost per lead in 3 months",
        },
        {
          href: "https://solutionsplumbing.com.au/",
          name: "Solutions Plumbing",
          result: "Over 150 leads a month",
        },
      ]}
    />
  );
}

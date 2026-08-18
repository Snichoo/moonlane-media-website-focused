import type { Metadata } from "next";
import { JHPlumbingProposal } from "@/components/proposal/JHPlumbingProposal";

const PROPOSAL_PATH = "/proposal/jh-plumbing";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: "Website Proposal for JH Plumbing Co | Moonlane Media",
  },
  description:
    "A website design and development proposal prepared by Moonlane Media for JH Plumbing Co.",
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
    title: "Website Proposal for JH Plumbing Co",
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
    title: "Website Proposal for JH Plumbing Co",
    description:
      "A tailored website design and development proposal from Moonlane Media.",
    images: ["/wp-content/uploads/2018/11/home-intro-2019.png"],
  },
};

export default function JHPlumbingProposalPage() {
  return <JHPlumbingProposal />;
}

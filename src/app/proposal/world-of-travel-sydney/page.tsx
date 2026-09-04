import type { Metadata } from "next";
import { JHPlumbingProposal } from "@/components/proposal/JHPlumbingProposal";

const PROPOSAL_PATH = "/proposal/world-of-travel-sydney";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: "Website Proposal for World of Travel Sydney | Moonlane Media",
  },
  description:
    "A website design and development proposal prepared by Moonlane Media for World of Travel Sydney.",
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
    title: "Website Proposal for World of Travel Sydney",
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
    title: "Website Proposal for World of Travel Sydney",
    description:
      "A tailored website design and development proposal from Moonlane Media.",
    images: ["/wp-content/uploads/2018/11/home-intro-2019.png"],
  },
};

export default function WorldOfTravelSydneyProposalPage() {
  return (
    <JHPlumbingProposal
      acceptanceEndpoint="/api/proposals/world-of-travel-sydney/accept"
      clientName="World of Travel Sydney"
      coverHighlight="Sydney"
      coverLead="A fast, mobile-first website designed to turn holiday searches into enquiries and bookings."
      coverPrimary="World of Travel"
      deposit="$475"
      opportunityLead="World of Travel Sydney needs a clear, professional website that shows travellers everything it can book, from flights and accommodation to travel insurance and cruises, and how quickly it can get them a quote."
      opportunitySupport="It will also put the two things competitors cannot match up front: Zip Pay, so a trip can be booked now and paid over time, and the partner promotions that its supplier relationships unlock."
      outcomeLabels={[
        "Make enquiring immediate",
        "Lead with Zip Pay",
        "Show partner deals",
      ]}
      servicePagesDescription="Flights, accommodation, travel insurance and cruises."
      totalInvestment="$950"
      workItems={[
        {
          href: "https://moonlanemedia.com.au/case-study/cyc",
          name: "CYC",
          result: "Camp and retreat booking across Victoria and Tasmania",
        },
        {
          href: "https://happyboxstore.com/",
          name: "You Are Appreciated Gifting Co.",
          result: "340% increase in online orders within 3 months",
        },
        {
          href: "https://www.enviroenergy.net.au/",
          name: "EnviroEnergy",
          result:
            "5x lower cost per conversion than industry standard in the first month",
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

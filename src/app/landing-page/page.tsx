import type { Metadata } from "next";
import ChromatixHome from "@/components/ChromatixHome";

export const metadata: Metadata = {
  alternates: {
    canonical: "/landing-page",
  },
  // Paid-traffic destination only: it is a near-duplicate of `/`, so keeping it
  // out of the index stops the two pages competing for the same terms. Google
  // Ads does not require a landing page to be indexable.
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page() {
  return <ChromatixHome variant="landing" />;
}

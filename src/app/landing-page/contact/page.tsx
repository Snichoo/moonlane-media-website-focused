import type { Metadata } from "next";
import ContactPage from "@/components/ContactPage";
import { contactTitle } from "@/sections/contact";

export const metadata: Metadata = {
  // extracted title already carries the "| Moonlane Media" suffix
  title: { absolute: contactTitle },
  description:
    "Get in touch with Moonlane Media to discuss your website project — no strings attached. Call, email or send us your project details and we'll point you in the right direction.",
  alternates: {
    canonical: "/landing-page/contact",
  },
  // Part of the paid-traffic tree — see src/app/landing-page/page.tsx.
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page() {
  return <ContactPage variant="landing" />;
}

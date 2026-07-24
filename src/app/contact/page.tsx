import type { Metadata } from "next";
import ContactPage from "@/components/ContactPage";
import { contactTitle } from "@/sections/contact";

export const metadata: Metadata = {
  // extracted title already carries the "| Moonlane Media" suffix
  title: { absolute: contactTitle },
  description:
    "Get in touch with Moonlane Media to discuss your website project — no strings attached. Call, email or send us your project details and we'll point you in the right direction.",
  alternates: {
    canonical: "/contact",
  },
  // A page-level openGraph/twitter object fully replaces the root's (Next.js
  // shallow-merges these nested fields), so inherited values (image, siteName,
  // locale, card type) must be repeated here or they'd be dropped.
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "Moonlane Media",
    title: contactTitle,
    description:
      "Get in touch with Moonlane Media to discuss your website project — no strings attached.",
    url: "https://www.moonlanemedia.com/contact",
    images: [
      {
        url: "/wp-content/uploads/2018/02/about-mainimage.png",
        alt: "Moonlane Media website design and development agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: contactTitle,
    description:
      "Get in touch with Moonlane Media to discuss your website project — no strings attached.",
    images: ["/wp-content/uploads/2018/02/about-mainimage.png"],
  },
};

export default function Page() {
  return <ContactPage />;
}

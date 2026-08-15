import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
// Ported theme stylesheets (unlayered → override Tailwind preflight) + small supplements.
// chromatix-main.css = sitewide/sub-page styles (case-study routes) and
// chromatix-contact.css = contact page; chromatix.css = homepage styles,
// loaded after them so the verified homepage rules keep precedence.
import "../styles/chromatix-main.css";
import "../styles/chromatix-contact.css";
import "../styles/chromatix.css";
import "../styles/supplemental.css";

const GOOGLE_ADS_ID =
  process.env.NEXT_PUBLIC_GADS_ID || "AW-18359320430";
const WEBSITE_CALL_LABEL =
  process.env.NEXT_PUBLIC_GADS_LABEL_WEBSITE_CALL?.trim();
const BUSINESS_PHONE_DISPLAY = "0414 134 081";
const BUSINESS_PHONE_TEL = "0414134081";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.moonlanemedia.com"),
  applicationName: "Moonlane Media",
  title: {
    default: "Moonlane Media | Results-Driven Website Design Agency",
    template: "%s | Moonlane Media",
  },
  description:
    "We create high-converting websites, digital experiences and strategies that turn clicks into real clients. Trusted by businesses of all kinds across Australia.",
  keywords: [
    "website design",
    "website development",
    "web design Australia",
    "web development agency Australia",
    "conversion-focused websites",
    "UI UX website design",
    "eCommerce website design",
    "WordPress development",
    "Shopify development",
    "website lead generation",
    "Moonlane Media",
  ],
  authors: [{ name: "Moonlane Media" }],
  creator: "Moonlane Media",
  publisher: "Moonlane Media",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/icon.png", sizes: "512x512", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", sizes: "512x512", type: "image/png" }],
    shortcut: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "Moonlane Media",
    title: "Moonlane Media | Results-Driven Website Design",
    description:
      "We create high-converting websites and digital experiences that turn clicks into real clients.",
    url: "https://www.moonlanemedia.com/",
    images: [
      {
        url: "/wp-content/uploads/2018/02/about-mainimage.png",
        alt: "Moonlane Media website design and development agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moonlane Media | Results-Driven Website Design",
    description:
      "We create high-converting websites and digital experiences that turn clicks into real clients.",
    images: ["/wp-content/uploads/2018/02/about-mainimage.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const websiteCallConfig = WEBSITE_CALL_LABEL
    ? `
(function () {
  function replaceWebsitePhone(formattedNumber, mobileNumber) {
    document.querySelectorAll('a[href^="tel:${BUSINESS_PHONE_TEL}"]').forEach(function (link) {
      link.setAttribute('href', 'tel:' + mobileNumber);

      var numberLabel = link.querySelector('.phone-text');
      if (numberLabel) {
        numberLabel.textContent = formattedNumber;
      } else if ((link.textContent || '').trim() === ${JSON.stringify(BUSINESS_PHONE_DISPLAY)}) {
        link.textContent = formattedNumber;
      }
    });
  }

  gtag('config', ${JSON.stringify(`${GOOGLE_ADS_ID}/${WEBSITE_CALL_LABEL}`)}, {
    'phone_conversion_number': ${JSON.stringify(BUSINESS_PHONE_DISPLAY)},
    'phone_conversion_callback': replaceWebsitePhone
  });
})();`
    : "";

  return (
    <html lang="en-AU">
      {/* WordPress body classes preserved so theme selectors (e.g. .home) still match */}
      <body className="home wp-singular page-template-default page page-id-217 wp-theme-chromatix-2018 wp-child-theme-chromatix-2018-child">
        {children}

        {/* Google tag (gtag.js) — Google Ads conversion/call measurement. */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-gtag" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(GOOGLE_ADS_ID)});${websiteCallConfig}`}
        </Script>
      </body>
    </html>
  );
}

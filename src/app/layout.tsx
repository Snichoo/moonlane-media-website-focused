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
  return (
    <html lang="en-AU">
      {/* WordPress body classes preserved so theme selectors (e.g. .home) still match */}
      <body className="home wp-singular page-template-default page page-id-217 wp-theme-chromatix-2018 wp-child-theme-chromatix-2018-child">
        {children}

        {/* Google tag (gtag.js) — Google Ads AW-18359320430 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18359320430"
          strategy="afterInteractive"
        />
        <Script id="google-gtag" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-18359320430');`}
        </Script>
      </body>
    </html>
  );
}

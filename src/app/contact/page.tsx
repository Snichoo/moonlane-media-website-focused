import type { Metadata } from "next";
import ContactPage from "@/components/ContactPage";
import { contactTitle } from "@/sections/contact";

export const metadata: Metadata = {
  // extracted title already carries the "| Moonlane Media" suffix
  title: { absolute: contactTitle },
};

export default function Page() {
  return <ContactPage />;
}

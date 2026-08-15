import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getLocation, LOCATION_SLUGS } from "@/lib/locations";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCATION_SLUGS.map((location) => ({ location }));
}

export default async function LocationLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ location: string }>;
}>) {
  const { location } = await params;

  if (!getLocation(location)) {
    notFound();
  }

  return children;
}

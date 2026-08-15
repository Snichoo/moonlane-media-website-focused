export const LOCATION_SLUGS = [
  "web-design-melbourne",
  "web-design-sydney",
  "web-design-brisbane",
] as const;

export type LocationSlug = (typeof LOCATION_SLUGS)[number];

export type LocationConfig = Readonly<{
  slug: LocationSlug;
  city: "Melbourne" | "Sydney" | "Brisbane";
  basePath: `/${LocationSlug}`;
  contactPath: `/${LocationSlug}/contact`;
  serviceStatement: string;
}>;

const LOCATIONS: readonly LocationConfig[] = [
  {
    slug: "web-design-melbourne",
    city: "Melbourne",
    basePath: "/web-design-melbourne",
    contactPath: "/web-design-melbourne/contact",
    serviceStatement:
      "We support Melbourne businesses from our Melbourne office and work with clients across Australia and internationally.",
  },
  {
    slug: "web-design-sydney",
    city: "Sydney",
    basePath: "/web-design-sydney",
    contactPath: "/web-design-sydney/contact",
    serviceStatement:
      "We support Sydney businesses from our Sydney office and work with clients across Australia and internationally.",
  },
  {
    slug: "web-design-brisbane",
    city: "Brisbane",
    basePath: "/web-design-brisbane",
    contactPath: "/web-design-brisbane/contact",
    serviceStatement:
      "We support Brisbane businesses through our remote-friendly Australian team and work with clients across Australia and internationally.",
  },
];

export function getLocation(slug: string): LocationConfig | undefined {
  return LOCATIONS.find((location) => location.slug === slug);
}

export function getLocationFromPath(pathname: string): LocationConfig | undefined {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return firstSegment ? getLocation(firstSegment) : undefined;
}

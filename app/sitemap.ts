import type { MetadataRoute } from "next";
import { getSiteData } from "@/lib/data";
import { SITE_URL } from "@/lib/env";

function validDate(value: string | null | undefined) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSiteData();
  const categoryEntries: MetadataRoute.Sitemap = site.categories.map((category) => ({
    url: `${SITE_URL}/services/${category.slug}`,
    lastModified: validDate(category.updated_at),
    changeFrequency: "monthly",
    priority: category.slug === "biometric" ? 0.95 : 0.8,
  }));
  const serviceEntries: MetadataRoute.Sitemap = site.categories.flatMap((category) =>
    (category.services || []).map((service) => ({
      url: `${SITE_URL}/services/${category.slug}/${service.slug}`,
      lastModified: validDate(service.updated_at),
      changeFrequency: "monthly" as const,
      priority: category.slug === "biometric" ? 0.95 : 0.85,
    })),
  );

  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/services`, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    ...categoryEntries,
    ...serviceEntries,
  ];
}

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

  const corePages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/printing`, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE_URL}/photocopying`, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE_URL}/color-printing`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/notes-printing`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/bulk-printing`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/office-printing`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/photo-printing`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/nadra-esahulat`, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE_URL}/services`, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const categoryEntries: MetadataRoute.Sitemap = site.categories.map((category) => ({
    url: `${SITE_URL}/services/${category.slug}`,
    lastModified: validDate(category.updated_at),
    changeFrequency: "monthly",
    priority: category.slug === "biometric" ? 0.9 : 0.75,
  }));

  const serviceEntries: MetadataRoute.Sitemap = site.categories.flatMap((category) =>
    (category.services || []).map((service) => ({
      url: `${SITE_URL}/services/${category.slug}/${service.slug}`,
      lastModified: validDate(service.updated_at),
      changeFrequency: "monthly" as const,
      priority: category.slug === "biometric" ? 0.9 : 0.8,
    })),
  );

  return [...corePages, ...categoryEntries, ...serviceEntries];
}

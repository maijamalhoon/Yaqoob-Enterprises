import type { MetadataRoute } from "next";
import { getSiteData } from "@/lib/data";
import { SITE_URL } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { categories } = await getSiteData();
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    ...categories.map((category) => ({
      url: `${SITE_URL}/services/${category.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}

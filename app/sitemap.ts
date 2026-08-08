import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/env";
import { getActiveServiceCategorySlugs } from "@/lib/public-category-slugs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categorySlugs = await getActiveServiceCategorySlugs();
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    ...categorySlugs.map((slug) => ({
      url: `${SITE_URL}/services/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}

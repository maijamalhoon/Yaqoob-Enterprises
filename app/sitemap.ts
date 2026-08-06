import type { MetadataRoute } from "next";
import { getSiteData } from "@/lib/data";
import { SITE_URL } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { categories } = await getSiteData();
  return [
    { url: SITE_URL, lastModified: new Date() },
    { url: `${SITE_URL}/contact`, lastModified: new Date() },
    { url: `${SITE_URL}/privacy`, lastModified: new Date() },
    ...categories.map((category) => ({ url: `${SITE_URL}/services/${category.slug}`, lastModified: new Date() })),
  ];
}

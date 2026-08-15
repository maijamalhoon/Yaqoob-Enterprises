import { getSiteData } from "@/lib/data";

export async function getActiveServiceCategorySlugs() {
  const { categories } = await getSiteData();
  return categories.map((category) => category.slug);
}

import { unstable_cache } from "next/cache";
import { createPublicSupabaseClient } from "@/lib/supabase/public";

async function loadActiveServiceCategorySlugs() {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("service_categories")
    .select("slug")
    .eq("is_active", true)
    .order("display_order");

  if (error) {
    throw new Error(`[category-slugs] Failed to load active service categories: ${error.message}`);
  }

  return (data || []).map((category) => String(category.slug));
}

export const getActiveServiceCategorySlugs = unstable_cache(
  loadActiveServiceCategorySlugs,
  ["active-service-category-slugs-v1"],
  {
    revalidate: 300,
    tags: ["site-data"],
  },
);

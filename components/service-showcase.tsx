import { ServiceShowcaseClient } from "@/components/service-showcase-client";
import { toServiceShowcaseCategories } from "@/lib/client-data";
import type { ServiceCategory } from "@/lib/types";

export function ServiceShowcase({ categories }: { categories: ServiceCategory[] }) {
  return <ServiceShowcaseClient categories={toServiceShowcaseCategories(categories)} />;
}

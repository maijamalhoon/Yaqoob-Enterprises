import { RequestFormClient } from "@/components/request-form-client";
import { toRequestFormCategories } from "@/lib/client-data";
import type { ServiceCategory } from "@/lib/types";

export function RequestForm({
  categories,
  whatsappNumber,
}: {
  categories: ServiceCategory[];
  whatsappNumber: string;
}) {
  return (
    <RequestFormClient
      categories={toRequestFormCategories(categories)}
      whatsappNumber={whatsappNumber}
    />
  );
}

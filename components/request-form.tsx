import { RequestFormClient } from "@/components/request-form-client";
import { toRequestFormCategories } from "@/lib/client-data";
import type { ServiceCategory } from "@/lib/types";

export function RequestForm({
  categories,
  whatsappNumber,
  businessName,
}: {
  categories: ServiceCategory[];
  whatsappNumber: string;
  businessName: string;
}) {
  return (
    <RequestFormClient
      categories={toRequestFormCategories(categories)}
      whatsappNumber={whatsappNumber}
      businessName={businessName}
    />
  );
}

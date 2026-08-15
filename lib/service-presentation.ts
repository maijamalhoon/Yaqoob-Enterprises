import type { Service, ServiceCategory } from "@/lib/types";

const categoryOrder = new Map([
  ["documents", 0],
  ["biometric", 1],
  ["typing-online", 2],
  ["printing-photos", 3],
  ["payments", 4],
  ["tickets", 5],
  ["web-development-seo", 6],
  ["laptop", 7],
  ["retail", 8],
]);

const serviceOrder = new Map([
  ["agreements-document-preparation", 0],
  ["general-biometric-esahulat", 1],
  ["online-forms-applications", 2],
  ["urdu-english-typing", 3],
  ["colour-black-white-printing", 4],
  ["cash-deposit-withdrawal-transfer", 5],
  ["railway-airline-bus-tickets", 6],
  ["passport-size-photos", 7],
  ["website-development-full-stack-seo", 8],
  ["windows-software-support", 9],
  ["stationery-mobile-accessories", 10],
]);

const presentationOverrides: Record<string, { title: string; description: string }> = {
  "agreements-document-preparation": {
    title: "Agreements, Affidavits & Document Preparation",
    description:
      "Sale/purchase and rent agreements, undertakings, affidavits and Urdu/English document preparation assistance.",
  },
  "website-development-full-stack-seo": {
    title: "Website Development & IT Support",
    description:
      "Business websites, maintenance, Windows setup, licensed software installation and computer support.",
  },
};

function rank(order: Map<string, number>, value: string) {
  return order.get(value) ?? Number.MAX_SAFE_INTEGER;
}

export function sortCategoriesByCustomerPriority(categories: ServiceCategory[]) {
  return [...categories].sort((a, b) => {
    const priority = rank(categoryOrder, a.slug) - rank(categoryOrder, b.slug);
    if (priority !== 0) return priority;
    return a.display_order - b.display_order || a.title.localeCompare(b.title);
  });
}

export function getServicePriority(slug: string) {
  return rank(serviceOrder, slug);
}

export function isPriorityService(slug: string) {
  return getServicePriority(slug) < 2;
}

export function getServicePresentation(
  service: Pick<Service, "slug" | "title" | "short_description">,
) {
  return presentationOverrides[service.slug] || {
    title: service.title,
    description: service.short_description,
  };
}

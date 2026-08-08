import type { Service, ServiceCategory } from "@/lib/types";

export type RequestFormService = Pick<
  Service,
  | "id"
  | "slug"
  | "title"
  | "status"
  | "available_at_shop"
  | "pickup_available"
  | "delivery_available"
  | "doorstep_available"
  | "important_note"
>;

export type RequestFormCategory = Pick<ServiceCategory, "id" | "slug" | "title"> & {
  services: RequestFormService[];
};

export function toRequestFormCategories(categories: ServiceCategory[]): RequestFormCategory[] {
  return categories.map((category) => ({
    id: category.id,
    slug: category.slug,
    title: category.title,
    services: (category.services || []).map((service) => ({
      id: service.id,
      slug: service.slug,
      title: service.title,
      status: service.status,
      available_at_shop: service.available_at_shop,
      pickup_available: service.pickup_available,
      delivery_available: service.delivery_available,
      doorstep_available: service.doorstep_available,
      important_note: service.important_note,
    })),
  }));
}

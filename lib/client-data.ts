import type { Service, ServiceCategory } from "@/lib/types";

export type ServiceShowcaseService = Pick<
  Service,
  | "available_at_shop"
  | "whatsapp_request"
  | "pickup_available"
  | "delivery_available"
  | "doorstep_available"
  | "appointment_required"
>;

export type ServiceShowcaseCategory = Pick<
  ServiceCategory,
  "id" | "slug" | "title" | "description" | "icon_key"
> & {
  services: ServiceShowcaseService[];
};

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

export function toServiceShowcaseCategories(categories: ServiceCategory[]): ServiceShowcaseCategory[] {
  return categories.map((category) => ({
    id: category.id,
    slug: category.slug,
    title: category.title,
    description: category.description,
    icon_key: category.icon_key,
    services: (category.services || []).map((service) => ({
      available_at_shop: service.available_at_shop,
      whatsapp_request: service.whatsapp_request,
      pickup_available: service.pickup_available,
      delivery_available: service.delivery_available,
      doorstep_available: service.doorstep_available,
      appointment_required: service.appointment_required,
    })),
  }));
}

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

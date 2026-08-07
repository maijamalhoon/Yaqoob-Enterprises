import type { Service } from "@/lib/types";

export type CustomerServiceMode =
  | "Visit the shop"
  | "Shop pickup"
  | "Delivery"
  | "Doorstep appointment";

export function canFulfillService(service: Service) {
  return service.status === "active" || service.status === "appointment_only";
}

export function getCustomerServiceModes(service: Service): CustomerServiceMode[] {
  if (!canFulfillService(service)) return [];

  const modes: CustomerServiceMode[] = [];
  if (service.available_at_shop) modes.push("Visit the shop");
  if (service.pickup_available) modes.push("Shop pickup");
  if (service.delivery_available) modes.push("Delivery");
  if (service.doorstep_available) modes.push("Doorstep appointment");
  return modes;
}

export function serviceNeedsAvailabilityConfirmation(service: Service) {
  return service.status === "coming_soon" || service.status === "temporarily_unavailable";
}

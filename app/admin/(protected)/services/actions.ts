"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import type { AdminFormState } from "@/components/admin-action-form";

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function optionalText(formData: FormData, key: string, maxLength: number) {
  const value = text(formData, key);
  if (value.length > maxLength) throw new Error(`${key.replaceAll("_", " ")} is too long.`);
  return value || null;
}

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function order(formData: FormData) {
  const value = Number(formData.get("display_order"));
  return Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0;
}

function slug(formData: FormData) {
  const value = text(formData, "slug").toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  if (!value) throw new Error("Enter a valid URL slug.");
  return value;
}

function requirements(formData: FormData) {
  return text(formData, "requirements")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function refreshServices() {
  updateTag("site-data");
  revalidatePath("/", "layout");
  revalidatePath("/services");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/services");
}

export async function createCategory(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("service_categories").insert({
    slug: slug(formData),
    title: text(formData, "title"),
    description: text(formData, "description"),
    icon_key: text(formData, "icon_key") || "briefcase",
    display_order: order(formData),
    is_active: true,
  });
  if (error) throw new Error(error.message);
  refreshServices();
}

export async function updateCategory(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("service_categories").update({
    title: text(formData, "title"),
    description: text(formData, "description"),
    icon_key: text(formData, "icon_key"),
    display_order: order(formData),
    is_active: bool(formData, "is_active"),
  }).eq("id", text(formData, "id")).select("id").maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("The record no longer exists. Refresh the page before retrying.");
  refreshServices();
}

export async function createService(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("services").insert({
    category_id: text(formData, "category_id"),
    slug: slug(formData),
    title: text(formData, "title"),
    short_description: text(formData, "short_description"),
    detailed_description: text(formData, "detailed_description"),
    status: text(formData, "status") || "active",
    requirements: requirements(formData),
    important_note: text(formData, "important_note"),
    available_at_shop: bool(formData, "available_at_shop"),
    whatsapp_request: true,
    pickup_available: bool(formData, "pickup_available"),
    delivery_available: bool(formData, "delivery_available"),
    doorstep_available: bool(formData, "doorstep_available"),
    appointment_required: bool(formData, "appointment_required"),
    is_featured: bool(formData, "is_featured"),
    display_order: order(formData),
    seo_title: optionalText(formData, "seo_title", 90),
    seo_description: optionalText(formData, "seo_description", 190),
  });
  if (error) throw new Error(error.message);
  refreshServices();
}

export async function updateService(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("services").update({
    category_id: text(formData, "category_id"),
    title: text(formData, "title"),
    short_description: text(formData, "short_description"),
    detailed_description: text(formData, "detailed_description"),
    status: text(formData, "status"),
    available_at_shop: bool(formData, "available_at_shop"),
    pickup_available: bool(formData, "pickup_available"),
    delivery_available: bool(formData, "delivery_available"),
    doorstep_available: bool(formData, "doorstep_available"),
    appointment_required: bool(formData, "appointment_required"),
    requirements: requirements(formData),
    important_note: text(formData, "important_note"),
    is_featured: bool(formData, "is_featured"),
    display_order: order(formData),
    seo_title: optionalText(formData, "seo_title", 90),
    seo_description: optionalText(formData, "seo_description", 190),
  }).eq("id", text(formData, "id")).select("id").maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("The record no longer exists. Refresh the page before retrying.");
  refreshServices();
}

export async function deleteService(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("services").delete().eq("id", text(formData, "id")).select("id").maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Service not found. Refresh the page before retrying.");
  refreshServices();
}


function safeAdminFailure(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (/duplicate key value|unique constraint/i.test(message)) {
    return "A category or service with this URL slug already exists.";
  }
  if (/foreign key constraint|invalid input syntax for type uuid/i.test(message)) {
    return "This category or service no longer exists. Refresh and try again.";
  }
  if (/valid URL slug|is too long|record no longer exists|Service not found/.test(message)) {
    return message;
  }
  return "The change could not be confirmed. Check your connection and try again.";
}

async function withFormFeedback(
  formData: FormData,
  action: (input: FormData) => Promise<void>,
  message: string,
): Promise<AdminFormState> {
  // Redirect unauthenticated users before handling in-form validation errors.
  await requireAdmin();
  try {
    await action(formData);
    return { status: "success", message };
  } catch (error) {
    return { status: "error", message: safeAdminFailure(error) };
  }
}

export async function createCategoryWithFeedback(_previous: AdminFormState, formData: FormData): Promise<AdminFormState> {
  return withFormFeedback(formData, createCategory, "Category created.");
}
export async function updateCategoryWithFeedback(_previous: AdminFormState, formData: FormData): Promise<AdminFormState> {
  return withFormFeedback(formData, updateCategory, "Category saved.");
}
export async function createServiceWithFeedback(_previous: AdminFormState, formData: FormData): Promise<AdminFormState> {
  return withFormFeedback(formData, createService, "Service created.");
}
export async function updateServiceWithFeedback(_previous: AdminFormState, formData: FormData): Promise<AdminFormState> {
  return withFormFeedback(formData, updateService, "Service saved.");
}
export async function deleteServiceWithFeedback(_previous: AdminFormState, formData: FormData): Promise<AdminFormState> {
  return withFormFeedback(formData, deleteService, "Service deleted.");
}

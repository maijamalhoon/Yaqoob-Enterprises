"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin";

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
  const { error } = await supabase.from("service_categories").update({
    title: text(formData, "title"),
    description: text(formData, "description"),
    icon_key: text(formData, "icon_key"),
    display_order: order(formData),
    is_active: bool(formData, "is_active"),
  }).eq("id", text(formData, "id"));
  if (error) throw new Error(error.message);
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
    is_featured: false,
    display_order: order(formData),
    seo_title: optionalText(formData, "seo_title", 90),
    seo_description: optionalText(formData, "seo_description", 190),
  });
  if (error) throw new Error(error.message);
  refreshServices();
}

export async function updateService(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("services").update({
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
    display_order: order(formData),
    seo_title: optionalText(formData, "seo_title", 90),
    seo_description: optionalText(formData, "seo_description", 190),
  }).eq("id", text(formData, "id"));
  if (error) throw new Error(error.message);
  refreshServices();
}

export async function deleteService(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("services").delete().eq("id", text(formData, "id"));
  if (error) throw new Error(error.message);
  refreshServices();
}

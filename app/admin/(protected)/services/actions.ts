"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdminMutation } from "@/lib/admin";
import type { Database } from "@/lib/database.types";

type ServiceStatus = Database["public"]["Enums"]["service_status"];
const serviceStatuses = new Set<ServiceStatus>([
  "active",
  "appointment_only",
  "temporarily_unavailable",
  "coming_soon",
  "hidden",
]);

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function requiredText(formData: FormData, key: string, label: string, maxLength: number) {
  const value = text(formData, key);
  if (!value || value.length > maxLength) {
    throw new Error(`Enter ${label} using ${maxLength} characters or fewer.`);
  }
  return value;
}

function recordId(formData: FormData, key = "id") {
  const id = text(formData, key);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    throw new Error("The selected record reference is invalid.");
  }
  return id;
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
  return Number.isSafeInteger(value) ? Math.min(10_000, Math.max(0, value)) : 0;
}

function slug(formData: FormData) {
  const value = text(formData, "slug").toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  if (!value || value.length > 120) throw new Error("Enter a valid URL slug using 120 characters or fewer.");
  return value;
}

function requirements(formData: FormData) {
  const items = text(formData, "requirements")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
  if (items.length > 30 || items.some((item) => item.length > 200)) {
    throw new Error("Use at most 30 requirement lines and 200 characters per line.");
  }
  return items;
}

function status(formData: FormData): ServiceStatus {
  const value = text(formData, "status") || "active";
  if (!serviceStatuses.has(value as ServiceStatus)) throw new Error("Choose a valid service status.");
  return value as ServiceStatus;
}

function writeError(error: { code?: string } | null, fallback: string): never {
  if (error?.code === "23505") throw new Error("That URL slug is already in use.");
  throw new Error(fallback);
}

function refreshServices() {
  updateTag("site-data");
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/services");
}

export async function createCategory(formData: FormData) {
  const { supabase } = await requireAdminMutation();
  const { data, error } = await supabase.from("service_categories").insert({
    slug: slug(formData),
    title: requiredText(formData, "title", "a category name", 100),
    description: requiredText(formData, "description", "a category description", 500),
    icon_key: requiredText(formData, "icon_key", "an icon", 50),
    display_order: order(formData),
    is_active: true,
  }).select("id").single();
  if (error || !data) writeError(error, "The category could not be created.");
  refreshServices();
}

export async function updateCategory(formData: FormData) {
  const { supabase } = await requireAdminMutation();
  const { data, error } = await supabase.from("service_categories").update({
    title: requiredText(formData, "title", "a category name", 100),
    description: requiredText(formData, "description", "a category description", 500),
    icon_key: requiredText(formData, "icon_key", "an icon", 50),
    display_order: order(formData),
    is_active: bool(formData, "is_active"),
  }).eq("id", recordId(formData)).select("id").maybeSingle();
  if (error || !data) writeError(error, "The category could not be updated or no longer exists.");
  refreshServices();
}

export async function createService(formData: FormData) {
  const { supabase } = await requireAdminMutation();
  const { data, error } = await supabase.from("services").insert({
    category_id: recordId(formData, "category_id"),
    slug: slug(formData),
    title: requiredText(formData, "title", "a service title", 120),
    short_description: requiredText(formData, "short_description", "a short description", 300),
    detailed_description: optionalText(formData, "detailed_description", 2_000) || "",
    status: status(formData),
    requirements: requirements(formData),
    important_note: optionalText(formData, "important_note", 1_000) || "",
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
  }).select("id").single();
  if (error || !data) writeError(error, "The service could not be created.");
  refreshServices();
}

export async function updateService(formData: FormData) {
  const { supabase } = await requireAdminMutation();
  const { data, error } = await supabase.from("services").update({
    category_id: recordId(formData, "category_id"),
    title: requiredText(formData, "title", "a service title", 120),
    short_description: requiredText(formData, "short_description", "a short description", 300),
    detailed_description: optionalText(formData, "detailed_description", 2_000) || "",
    status: status(formData),
    available_at_shop: bool(formData, "available_at_shop"),
    pickup_available: bool(formData, "pickup_available"),
    delivery_available: bool(formData, "delivery_available"),
    doorstep_available: bool(formData, "doorstep_available"),
    appointment_required: bool(formData, "appointment_required"),
    requirements: requirements(formData),
    important_note: optionalText(formData, "important_note", 1_000) || "",
    is_featured: bool(formData, "is_featured"),
    display_order: order(formData),
    seo_title: optionalText(formData, "seo_title", 90),
    seo_description: optionalText(formData, "seo_description", 190),
  }).eq("id", recordId(formData)).select("id").maybeSingle();
  if (error || !data) writeError(error, "The service could not be updated or no longer exists.");
  refreshServices();
}

export async function archiveService(formData: FormData) {
  const { supabase } = await requireAdminMutation();
  const { data, error } = await supabase
    .from("services")
    .update({ status: "hidden", is_featured: false })
    .eq("id", recordId(formData))
    .select("id")
    .maybeSingle();
  if (error || !data) throw new Error("The service could not be archived or no longer exists.");
  refreshServices();
}

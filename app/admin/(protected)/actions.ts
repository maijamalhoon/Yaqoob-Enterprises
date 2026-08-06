"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function refreshAll() {
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/admin", "layout");
}

export async function updateService(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id");
  const requirements = text(formData, "requirements").split("\n").map((item) => item.trim()).filter(Boolean);
  const payload = {
    title: text(formData, "title"),
    short_description: text(formData, "short_description"),
    detailed_description: text(formData, "detailed_description"),
    status: text(formData, "status"),
    available_at_shop: bool(formData, "available_at_shop"),
    whatsapp_request: bool(formData, "whatsapp_request"),
    pickup_available: bool(formData, "pickup_available"),
    delivery_available: bool(formData, "delivery_available"),
    doorstep_available: bool(formData, "doorstep_available"),
    appointment_required: bool(formData, "appointment_required"),
    requirements,
    important_note: text(formData, "important_note"),
    is_featured: bool(formData, "is_featured"),
    display_order: Number(formData.get("display_order") || 0),
  };
  const { error } = await supabase.from("services").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
  refreshAll();
}

export async function createService(formData: FormData) {
  const { supabase } = await requireAdmin();
  const requirements = text(formData, "requirements").split("\n").map((item) => item.trim()).filter(Boolean);
  const { error } = await supabase.from("services").insert({
    category_id: text(formData, "category_id"),
    slug: text(formData, "slug"),
    title: text(formData, "title"),
    short_description: text(formData, "short_description"),
    detailed_description: text(formData, "detailed_description"),
    status: text(formData, "status") || "active",
    requirements,
    important_note: text(formData, "important_note"),
    available_at_shop: bool(formData, "available_at_shop"),
    whatsapp_request: true,
    pickup_available: bool(formData, "pickup_available"),
    delivery_available: bool(formData, "delivery_available"),
    doorstep_available: bool(formData, "doorstep_available"),
    appointment_required: bool(formData, "appointment_required"),
  });
  if (error) throw new Error(error.message);
  refreshAll();
}

export async function deleteService(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("services").delete().eq("id", text(formData, "id"));
  if (error) throw new Error(error.message);
  refreshAll();
}

export async function updateCategory(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("service_categories").update({
    title: text(formData, "title"),
    description: text(formData, "description"),
    icon_key: text(formData, "icon_key"),
    display_order: Number(formData.get("display_order") || 0),
    is_active: bool(formData, "is_active"),
  }).eq("id", text(formData, "id"));
  if (error) throw new Error(error.message);
  refreshAll();
}

export async function createCoverageArea(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("coverage_areas").insert({
    name: text(formData, "name"),
    delivery_available: bool(formData, "delivery_available"),
    doorstep_biometric_available: bool(formData, "doorstep_biometric_available"),
    extra_charge_may_apply: bool(formData, "extra_charge_may_apply"),
    notes: text(formData, "notes"),
    display_order: Number(formData.get("display_order") || 0),
  });
  if (error) throw new Error(error.message);
  refreshAll();
}

export async function updateCoverageArea(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("coverage_areas").update({
    name: text(formData, "name"),
    delivery_available: bool(formData, "delivery_available"),
    doorstep_biometric_available: bool(formData, "doorstep_biometric_available"),
    pickup_available: bool(formData, "pickup_available"),
    extra_charge_may_apply: bool(formData, "extra_charge_may_apply"),
    notes: text(formData, "notes"),
    display_order: Number(formData.get("display_order") || 0),
    is_active: bool(formData, "is_active"),
  }).eq("id", text(formData, "id"));
  if (error) throw new Error(error.message);
  refreshAll();
}

export async function deleteCoverageArea(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("coverage_areas").delete().eq("id", text(formData, "id"));
  if (error) throw new Error(error.message);
  refreshAll();
}

export async function updateSettings(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("business_settings").update({
    business_name: text(formData, "business_name"),
    tagline: text(formData, "tagline"),
    phone_display: text(formData, "phone_display"),
    phone_e164: text(formData, "phone_e164"),
    whatsapp_e164: text(formData, "whatsapp_e164"),
    address: text(formData, "address"),
    map_url: text(formData, "map_url"),
    pricing_message: text(formData, "pricing_message"),
    concept_image_notice: text(formData, "concept_image_notice"),
  }).eq("id", true);
  if (error) throw new Error(error.message);
  refreshAll();
}

export async function updateHour(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("business_hours").update({
    opens_at: text(formData, "opens_at") || null,
    closes_at: text(formData, "closes_at") || null,
    is_closed: bool(formData, "is_closed"),
  }).eq("id", text(formData, "id"));
  if (error) throw new Error(error.message);
  refreshAll();
}

export async function uploadGalleryImage(formData: FormData) {
  const { supabase } = await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) throw new Error("Choose an image file.");
  if (!file.type.startsWith("image/")) throw new Error("Only image files are allowed.");
  if (file.size > 8 * 1024 * 1024) throw new Error("Image must be smaller than 8 MB.");

  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  const storagePath = `${Date.now()}-${safeName}`;
  const { error: uploadError } = await supabase.storage.from("shop-media").upload(storagePath, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (uploadError) throw new Error(uploadError.message);

  const { error } = await supabase.from("gallery_images").insert({
    storage_path: storagePath,
    alt_text: text(formData, "alt_text") || "Yaqoob Enterprises shop image",
    caption: text(formData, "caption"),
    media_kind: text(formData, "media_kind") || "real",
    is_featured: bool(formData, "is_featured"),
    display_order: Number(formData.get("display_order") || 0),
    focal_x: Number(formData.get("focal_x") || 50),
    focal_y: Number(formData.get("focal_y") || 50),
  });
  if (error) {
    await supabase.storage.from("shop-media").remove([storagePath]);
    throw new Error(error.message);
  }
  refreshAll();
}

export async function updateGalleryImage(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("gallery_images").update({
    alt_text: text(formData, "alt_text"),
    caption: text(formData, "caption"),
    media_kind: text(formData, "media_kind"),
    is_featured: bool(formData, "is_featured"),
    is_active: bool(formData, "is_active"),
    display_order: Number(formData.get("display_order") || 0),
    focal_x: Number(formData.get("focal_x") || 50),
    focal_y: Number(formData.get("focal_y") || 50),
  }).eq("id", text(formData, "id"));
  if (error) throw new Error(error.message);
  refreshAll();
}

export async function deleteGalleryImage(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id");
  const path = text(formData, "storage_path");
  const { error } = await supabase.from("gallery_images").delete().eq("id", id);
  if (error) throw new Error(error.message);
  if (path) await supabase.storage.from("shop-media").remove([path]);
  refreshAll();
}

export async function createAnnouncement(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("announcements").insert({
    title: text(formData, "title"),
    message: text(formData, "message"),
    link_label: text(formData, "link_label") || null,
    link_url: text(formData, "link_url") || null,
    is_active: true,
  });
  if (error) throw new Error(error.message);
  refreshAll();
}

export async function deleteAnnouncement(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("announcements").delete().eq("id", text(formData, "id"));
  if (error) throw new Error(error.message);
  refreshAll();
}

export async function goToAdmin() {
  redirect("/admin");
}

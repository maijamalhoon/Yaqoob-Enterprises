"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin";

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function boundedNumber(formData: FormData, key: string, fallback: number, min: number, max: number) {
  const value = Number(formData.get(key));
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function refreshGallery() {
  updateTag("site-data");
  revalidatePath("/", "layout");
  revalidatePath("/admin/gallery");
}

async function makeFeatured(supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"], id: string) {
  const { error: clearError } = await supabase.from("gallery_images").update({ is_featured: false }).neq("id", id);
  if (clearError) throw new Error(clearError.message);

  const { error: featureError } = await supabase
    .from("gallery_images")
    .update({ is_featured: true, is_active: true })
    .eq("id", id);
  if (featureError) throw new Error(featureError.message);
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

  const wantsFeatured = bool(formData, "is_featured");
  const { data: inserted, error } = await supabase.from("gallery_images").insert({
    storage_path: storagePath,
    alt_text: text(formData, "alt_text") || "Shop image",
    caption: text(formData, "caption"),
    media_kind: text(formData, "media_kind") || "real",
    is_featured: false,
    is_active: true,
    display_order: Number(formData.get("display_order") || 0),
    focal_x: boundedNumber(formData, "focal_x", 50, 0, 100),
    focal_y: boundedNumber(formData, "focal_y", 50, 0, 100),
  }).select("id").single();

  if (error || !inserted) {
    await supabase.storage.from("shop-media").remove([storagePath]);
    throw new Error(error?.message || "Could not save the uploaded image.");
  }

  if (wantsFeatured) await makeFeatured(supabase, inserted.id);
  refreshGallery();
}

export async function updateGalleryImage(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id");
  const isActive = bool(formData, "is_active");
  const wantsFeatured = bool(formData, "is_featured") && isActive;

  const { error } = await supabase.from("gallery_images").update({
    alt_text: text(formData, "alt_text") || "Shop image",
    caption: text(formData, "caption"),
    media_kind: text(formData, "media_kind") || "real",
    is_featured: false,
    is_active: isActive,
    display_order: Number(formData.get("display_order") || 0),
    focal_x: boundedNumber(formData, "focal_x", 50, 0, 100),
    focal_y: boundedNumber(formData, "focal_y", 50, 0, 100),
  }).eq("id", id);
  if (error) throw new Error(error.message);

  if (wantsFeatured) await makeFeatured(supabase, id);
  refreshGallery();
}

export async function deleteGalleryImage(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id");
  const { data: image, error: lookupError } = await supabase
    .from("gallery_images")
    .select("storage_path,is_featured")
    .eq("id", id)
    .single();
  if (lookupError) throw new Error(lookupError.message);

  const { error } = await supabase.from("gallery_images").delete().eq("id", id);
  if (error) throw new Error(error.message);
  if (image?.storage_path) await supabase.storage.from("shop-media").remove([image.storage_path]);

  if (image?.is_featured) {
    const { data: nextImage } = await supabase
      .from("gallery_images")
      .select("id")
      .eq("is_active", true)
      .eq("media_kind", "real")
      .order("display_order")
      .limit(1)
      .maybeSingle();
    if (nextImage?.id) await makeFeatured(supabase, nextImage.id);
  }

  refreshGallery();
}

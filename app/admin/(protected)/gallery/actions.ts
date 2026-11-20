"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { galleryImageFields } from "@/lib/admin-gallery-fields";
import type { AdminFormState } from "@/components/admin-action-form";

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function refreshGallery() {
  updateTag("site-data");
  revalidatePath("/", "layout");
  revalidatePath("/admin/gallery");
  revalidatePath("/admin/history");
}

async function makeFeatured(supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"], id: string) {
  const { error } = await supabase.rpc("admin_set_featured_gallery_image", { target_id: id });
  if (error) throw new Error(error.message);
}

async function featureNextRealImage(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  excludedId?: string,
) {
  let query = supabase
    .from("gallery_images")
    .select("id")
    .eq("is_active", true)
    .eq("media_kind", "real")
    .order("display_order")
    .limit(1);
  if (excludedId) query = query.neq("id", excludedId);
  const { data, error } = await query.maybeSingle();
  if (error) throw new Error("Could not find the next available homepage image.");
  if (data?.id) await makeFeatured(supabase, data.id);
}

export async function uploadGalleryImage(formData: FormData) {
  const { supabase } = await requireAdmin();
  // Validate metadata before uploading a file to prevent orphaned objects.
  const fields = galleryImageFields(formData);
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) throw new Error("Choose an image file.");
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Use a JPG, PNG or WebP image.");
  }
  if (file.size > 8 * 1024 * 1024) throw new Error("Image must be smaller than 8 MB.");

  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").slice(-100) || "image";
  const storagePath = `${crypto.randomUUID()}-${safeName}`;
  const { error: uploadError } = await supabase.storage.from("shop-media").upload(storagePath, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (uploadError) throw new Error(uploadError.message);

  const wantsFeatured = bool(formData, "is_featured") && fields.media_kind === "real";
  const { data: inserted, error } = await supabase.from("gallery_images").insert({
    storage_path: storagePath,
    ...fields,
    caption: "",
    is_featured: false,
    is_active: true,
  }).select("id").single();

  if (error || !inserted) {
    await supabase.storage.from("shop-media").remove([storagePath]);
    throw new Error(error?.message || "Could not save the uploaded image.");
  }

  if (wantsFeatured) {
    try {
      await makeFeatured(supabase, inserted.id);
    } catch {
      refreshGallery();
      throw new Error("The image uploaded, but setting it as the homepage photo failed. Refresh Gallery and choose it manually.");
    }
  }
  refreshGallery();
}

export async function updateGalleryImage(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id");
  const fields = galleryImageFields(formData);
  const isActive = bool(formData, "is_active");
  const wantsFeatured = bool(formData, "is_featured") && isActive && fields.media_kind === "real";
  const { data: previous, error: lookupError } = await supabase
    .from("gallery_images")
    .select("is_featured")
    .eq("id", id)
    .single();
  if (lookupError) throw new Error(lookupError.message);

  const { data: updated, error } = await supabase.from("gallery_images").update({
    ...fields,
    is_featured: false,
    is_active: isActive,
  }).eq("id", id).select("id").maybeSingle();
  if (error) throw new Error(error.message);
  if (!updated) throw new Error("This image no longer exists. Refresh Gallery.");

  try {
    if (wantsFeatured) await makeFeatured(supabase, id);
    else if (previous?.is_featured) await featureNextRealImage(supabase, id);
  } catch {
    refreshGallery();
    throw new Error("Image details saved, but homepage photo selection failed. Refresh Gallery and choose the featured photo.");
  }
  refreshGallery();
}

export async function deleteGalleryImage(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id");
  const { data: image, error: lookupError } = await supabase
    .from("gallery_images")
    .select("is_featured")
    .eq("id", id)
    .single();
  if (lookupError) throw new Error(lookupError.message);

  const { data: removed, error } = await supabase.from("gallery_images").delete().eq("id", id).select("id").maybeSingle();
  if (error) throw new Error(error.message);
  if (!removed) throw new Error("This image no longer exists. Refresh Gallery.");

  // Keep the storage object so a safe audit rollback can restore the photo.
  if (image?.is_featured) {
    try {
      await featureNextRealImage(supabase);
    } catch {
      refreshGallery();
      throw new Error("Image removed from Gallery, but choosing a replacement homepage photo failed. Choose one manually.");
    }
  }
  refreshGallery();
}


function galleryFailure(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (/^(Choose an image file|Use a JPG|Image must be smaller|Select a valid image type|Image description must be|Image display order must be|Image focal position must be|The image uploaded, but|Image details saved, but|Image removed from Gallery, but|This image no longer exists)/.test(message)) {
    return message;
  }
  return "The image change could not be confirmed. Refresh Gallery and try again.";
}

async function galleryFormResult(
  action: (formData: FormData) => Promise<void>,
  input: FormData,
  successMessage: string,
): Promise<AdminFormState> {
  await requireAdmin();
  try {
    await action(input);
    return { status: "success", message: successMessage };
  } catch (error) {
    return { status: "error", message: galleryFailure(error) };
  }
}

export async function uploadGalleryImageWithFeedback(_state: AdminFormState, formData: FormData): Promise<AdminFormState> {
  return galleryFormResult(uploadGalleryImage, formData, "Image uploaded.");
}
export async function updateGalleryImageWithFeedback(_state: AdminFormState, formData: FormData): Promise<AdminFormState> {
  return galleryFormResult(updateGalleryImage, formData, "Image saved.");
}
export async function deleteGalleryImageWithFeedback(_state: AdminFormState, formData: FormData): Promise<AdminFormState> {
  return galleryFormResult(deleteGalleryImage, formData, "Image removed from Gallery. Photo kept in storage for History rollback.");
}

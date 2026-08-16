"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath, updateTag } from "next/cache";
import { requireAdminMutation } from "@/lib/admin";
import type { Database } from "@/lib/database.types";

const galleryBucket = "shop-media";
const maxUploadBytes = 8 * 1024 * 1024;
const uploadExtensions = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);
type MediaKind = Database["public"]["Enums"]["media_kind"];

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

function boundedInteger(formData: FormData, key: string, fallback: number, min: number, max: number) {
  const value = Number(formData.get(key));
  if (!Number.isSafeInteger(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function recordId(formData: FormData) {
  const id = text(formData, "id");
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    throw new Error("The selected image reference is invalid.");
  }
  return id;
}

function refreshGallery() {
  updateTag("site-data");
  revalidatePath("/", "layout");
  revalidatePath("/admin/gallery");
  revalidatePath("/admin/history");
}

export async function createGalleryUpload(input: { contentType: string; size: number }) {
  const { supabase, user } = await requireAdminMutation();
  const extension = uploadExtensions.get(input.contentType);
  if (!extension || !Number.isSafeInteger(input.size) || input.size <= 0 || input.size > maxUploadBytes) {
    return { ok: false, message: "Choose a JPG, PNG or WebP image smaller than 8 MB." } as const;
  }

  const storagePath = `${user.id}/${Date.now()}-${randomUUID()}.${extension}`;
  const { data, error } = await supabase.storage
    .from(galleryBucket)
    .createSignedUploadUrl(storagePath, { upsert: false });

  if (error || !data?.token) {
    console.error("Gallery signed upload creation failed", { code: error?.name });
    return { ok: false, message: "The upload could not be started. Please try again." } as const;
  }

  return { ok: true, path: storagePath, token: data.token } as const;
}

function mediaKind(formData: FormData): MediaKind {
  const value = text(formData, "media_kind") || "real";
  if (value !== "real" && value !== "concept") throw new Error("Choose a valid image type.");
  return value;
}

function isOwnedUploadPath(userId: string, storagePath: string) {
  const fileName = storagePath.slice(userId.length + 1);
  return storagePath.startsWith(`${userId}/`)
    && !fileName.includes("/")
    && /^[0-9]+-[0-9a-f-]+\.(?:jpg|png|webp)$/.test(fileName);
}

export async function completeGalleryUpload(formData: FormData) {
  const { supabase, user } = await requireAdminMutation();
  const storagePath = text(formData, "storage_path");
  if (!isOwnedUploadPath(user.id, storagePath)) {
    return { ok: false, message: "The uploaded image reference is invalid." } as const;
  }

  const fileName = storagePath.slice(user.id.length + 1);
  const { data: objects, error: lookupError } = await supabase.storage
    .from(galleryBucket)
    .list(user.id, { limit: 10, search: fileName });
  if (lookupError || !objects?.some((object) => object.name === fileName)) {
    return { ok: false, message: "The uploaded image could not be verified. Please try again." } as const;
  }

  const selectedMediaKind = mediaKind(formData);

  const altText = text(formData, "alt_text");
  if (!altText || altText.length > 180) {
    await supabase.storage.from(galleryBucket).remove([storagePath]);
    return { ok: false, message: "Add image alt text using 180 characters or fewer." } as const;
  }

  const { data: imageId, error } = await supabase.rpc("admin_complete_gallery_upload", {
    p_storage_path: storagePath,
    p_alt_text: altText,
    p_media_kind: selectedMediaKind,
    p_is_featured: bool(formData, "is_featured") && selectedMediaKind === "real",
    p_display_order: boundedInteger(formData, "display_order", 0, 0, 10_000),
    p_focal_x: boundedNumber(formData, "focal_x", 50, 0, 100),
    p_focal_y: boundedNumber(formData, "focal_y", 50, 0, 100),
  });

  if (error || !imageId) {
    // A lost response is ambiguous: reconcile before cleanup so a committed image never loses its file.
    const { data: existing, error: reconcileError } = await supabase
      .from("gallery_images")
      .select("id")
      .eq("storage_path", storagePath)
      .maybeSingle();

    if (existing) {
      refreshGallery();
      return { ok: true } as const;
    }

    if (!reconcileError) {
      await supabase.storage.from(galleryBucket).remove([storagePath]);
    }
    console.error("Gallery metadata completion failed", {
      code: error?.code,
      reconcileCode: reconcileError?.code,
    });
    return { ok: false, message: "The image record could not be saved. Please refresh before retrying." } as const;
  }

  refreshGallery();
  return { ok: true } as const;
}

export async function discardGalleryUpload(storagePath: string) {
  const { supabase, user } = await requireAdminMutation();
  if (!isOwnedUploadPath(user.id, storagePath)) return;
  const { data: referenced, error } = await supabase
    .from("gallery_images")
    .select("id")
    .eq("storage_path", storagePath)
    .maybeSingle();
  if (error || referenced) return;
  await supabase.storage.from(galleryBucket).remove([storagePath]);
}

export async function updateGalleryImage(formData: FormData) {
  const { supabase } = await requireAdminMutation();
  const id = recordId(formData);
  const isActive = bool(formData, "is_active");
  const selectedMediaKind = mediaKind(formData);
  const wantsFeatured = bool(formData, "is_featured") && isActive && selectedMediaKind === "real";
  const altText = text(formData, "alt_text");
  if (!altText || altText.length > 180) throw new Error("Add image alt text using 180 characters or fewer.");

  const { data, error } = await supabase.rpc("admin_update_gallery_image", {
    p_id: id,
    p_alt_text: altText,
    p_media_kind: selectedMediaKind,
    p_is_featured: wantsFeatured,
    p_is_active: isActive,
    p_display_order: boundedInteger(formData, "display_order", 0, 0, 10_000),
    p_focal_x: boundedNumber(formData, "focal_x", 50, 0, 100),
    p_focal_y: boundedNumber(formData, "focal_y", 50, 0, 100),
  });
  if (error || !data) throw new Error("The image could not be updated or no longer exists.");
  refreshGallery();
}

export async function archiveGalleryImage(formData: FormData) {
  const { supabase } = await requireAdminMutation();
  const { data, error } = await supabase.rpc("admin_archive_gallery_image", {
    p_id: recordId(formData),
  });
  if (error || !data) throw new Error("The image could not be archived or no longer exists.");
  refreshGallery();
}

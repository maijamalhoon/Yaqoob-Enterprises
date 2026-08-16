"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdminMutation } from "@/lib/admin";

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function recordId(formData: FormData) {
  const id = text(formData, "id");
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    throw new Error("The coverage area reference is invalid.");
  }
  return id;
}

function coverageValues(formData: FormData) {
  const name = text(formData, "name");
  const notes = text(formData, "notes");
  if (!name || name.length > 120) throw new Error("Enter an area name using 120 characters or fewer.");
  if (notes.length > 500) throw new Error("Coverage notes must use 500 characters or fewer.");

  const requestedOrder = Number(formData.get("display_order"));
  const displayOrder = Number.isSafeInteger(requestedOrder)
    ? Math.min(10_000, Math.max(0, requestedOrder))
    : 0;

  return {
    name,
    delivery_available: bool(formData, "delivery_available"),
    doorstep_biometric_available: bool(formData, "doorstep_biometric_available"),
    pickup_available: bool(formData, "pickup_available"),
    extra_charge_may_apply: bool(formData, "extra_charge_may_apply"),
    notes,
    display_order: displayOrder,
  };
}

function refreshCoverage() {
  updateTag("site-data");
  revalidatePath("/", "layout");
  revalidatePath("/admin");
  revalidatePath("/admin/coverage");
  revalidatePath("/admin/history");
}

function writeError(error: { code?: string } | null, fallback: string): never {
  if (error?.code === "23505") throw new Error("A coverage area with this name already exists.");
  throw new Error(fallback);
}

export async function createCoverageArea(formData: FormData) {
  const { supabase } = await requireAdminMutation();
  const { data, error } = await supabase
    .from("coverage_areas")
    .insert({ ...coverageValues(formData), is_active: true })
    .select("id")
    .single();

  if (error || !data) writeError(error, "The coverage area could not be created.");
  refreshCoverage();
}

export async function updateCoverageArea(formData: FormData) {
  const { supabase } = await requireAdminMutation();
  const { data, error } = await supabase
    .from("coverage_areas")
    .update({ ...coverageValues(formData), is_active: bool(formData, "is_active") })
    .eq("id", recordId(formData))
    .select("id")
    .maybeSingle();

  if (error || !data) writeError(error, "The coverage area could not be updated or no longer exists.");
  refreshCoverage();
}

export async function archiveCoverageArea(formData: FormData) {
  const { supabase } = await requireAdminMutation();
  const { data, error } = await supabase
    .from("coverage_areas")
    .update({ is_active: false })
    .eq("id", recordId(formData))
    .select("id")
    .maybeSingle();

  if (error || !data) throw new Error("The coverage area could not be archived or no longer exists.");
  refreshCoverage();
}

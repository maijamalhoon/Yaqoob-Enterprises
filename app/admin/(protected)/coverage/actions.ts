"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { parseAdminCoverage } from "@/lib/admin-coverage-fields";
import type { AdminFormState } from "@/components/admin-action-form";

function coverageId(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    throw new Error("Area reference is invalid. Refresh Coverage.");
  }
  return id;
}

function refreshCoverage() {
  updateTag("site-data");
  revalidatePath("/", "layout");
  revalidatePath("/services");
  revalidatePath("/admin");
  revalidatePath("/admin/coverage");
}

async function createArea(formData: FormData) {
  const { supabase } = await requireAdmin();
  const payload = parseAdminCoverage(formData, true);
  const { error } = await supabase.from("coverage_areas").insert(payload);
  if (error) throw error;
  refreshCoverage();
}

async function updateArea(formData: FormData) {
  const { supabase } = await requireAdmin();
  const payload = parseAdminCoverage(formData, false);
  const { data, error } = await supabase.from("coverage_areas")
    .update(payload).eq("id", coverageId(formData)).select("id").maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("This area no longer exists. Refresh Coverage.");
  refreshCoverage();
}

async function deleteArea(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("coverage_areas")
    .delete().eq("id", coverageId(formData)).select("id").maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("This area no longer exists. Refresh Coverage.");
  refreshCoverage();
}

function coverageError(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (/duplicate key value|coverage_areas_name_key/i.test(message)) {
    return "An area with this name already exists. Choose another name.";
  }
  if (/^(Area name must be|Area notes must be|Display order must be|Area reference is invalid|This area no longer exists)/.test(message)) {
    return message;
  }
  return "The coverage change could not be confirmed. Refresh or try again.";
}

async function withFeedback(
  formData: FormData,
  action: (input: FormData) => Promise<void>,
  message: string,
): Promise<AdminFormState> {
  // Do not turn a missing/expired admin session into a successful form result.
  await requireAdmin();
  try {
    await action(formData);
    return { status: "success", message };
  } catch (error) {
    return { status: "error", message: coverageError(error) };
  }
}

export async function createCoverageAreaWithFeedback(_state: AdminFormState, formData: FormData): Promise<AdminFormState> {
  return withFeedback(formData, createArea, "Coverage area added.");
}
export async function updateCoverageAreaWithFeedback(_state: AdminFormState, formData: FormData): Promise<AdminFormState> {
  return withFeedback(formData, updateArea, "Coverage area saved.");
}
export async function deleteCoverageAreaWithFeedback(_state: AdminFormState, formData: FormData): Promise<AdminFormState> {
  return withFeedback(formData, deleteArea, "Coverage area deleted.");
}

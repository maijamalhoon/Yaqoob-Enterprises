"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdminMutation, requireOwnerMutation } from "@/lib/admin";

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function refreshAdminAndSite() {
  updateTag("site-data");
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
  revalidatePath("/admin/history");
}

async function collectSnapshot(supabase: Awaited<ReturnType<typeof requireAdminMutation>>["supabase"]) {
  const [settings, hours, categories, services, gallery, coverage] = await Promise.all([
    supabase.from("business_settings").select("*"),
    supabase.from("business_hours").select("*").order("display_order"),
    supabase.from("service_categories").select("*").order("display_order"),
    supabase.from("services").select("*").order("display_order"),
    supabase.from("gallery_images").select("*").order("display_order"),
    supabase.from("coverage_areas").select("*").order("display_order"),
  ]);

  const results = [settings, hours, categories, services, gallery, coverage];
  const failed = results.find((result) => result.error);
  if (failed?.error) throw new Error(failed.error.message);

  return {
    version: 1,
    business_settings: settings.data || [],
    business_hours: hours.data || [],
    service_categories: categories.data || [],
    services: services.data || [],
    gallery_images: gallery.data || [],
    coverage_areas: coverage.data || [],
  };
}

async function saveSnapshot(
  supabase: Awaited<ReturnType<typeof requireAdminMutation>>["supabase"],
  userId: string,
  label: string,
) {
  const snapshot = await collectSnapshot(supabase);
  const { error } = await supabase.from("admin_snapshots").insert({
    label: label.slice(0, 100) || "Manual content snapshot",
    snapshot,
    created_by: userId,
  });
  if (error) throw new Error(error.message);
}

export async function createAdminSnapshot(formData: FormData) {
  const { supabase, user } = await requireAdminMutation();
  const label = text(formData, "label") || `Manual content snapshot · ${new Date().toISOString().slice(0, 10)}`;
  await saveSnapshot(supabase, user.id, label);
  revalidatePath("/admin/history");
}

export async function restoreAdminSnapshot(formData: FormData) {
  const { supabase, user } = await requireOwnerMutation();
  const snapshotId = text(formData, "id");
  if (!snapshotId) throw new Error("Content snapshot ID is missing.");

  await saveSnapshot(
    supabase,
    user.id,
    `Safety content snapshot before restore · ${new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" })}`,
  );

  const { error } = await supabase.rpc("restore_admin_snapshot", { target_snapshot_id: snapshotId });
  if (error) throw new Error(error.message);
  refreshAdminAndSite();
}

export async function deleteAdminSnapshot(formData: FormData) {
  const { supabase } = await requireOwnerMutation();
  const snapshotId = text(formData, "id");
  if (!snapshotId) throw new Error("Content snapshot ID is missing.");
  const { error } = await supabase.from("admin_snapshots").delete().eq("id", snapshotId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/history");
}

export async function rollbackAuditEntry(formData: FormData) {
  const { supabase } = await requireOwnerMutation();
  const auditId = Number(text(formData, "id"));
  if (!Number.isSafeInteger(auditId) || auditId <= 0) throw new Error("History entry is invalid.");

  const { data: auditEntry, error: lookupError } = await supabase
    .from("admin_audit_log")
    .select("table_name")
    .eq("id", auditId)
    .maybeSingle();
  if (lookupError || !auditEntry) throw new Error("The history entry could not be found.");
  if (auditEntry.table_name === "gallery_images") {
    throw new Error("Gallery changes must be recovered from a content snapshot.");
  }

  const { error } = await supabase.rpc("rollback_admin_audit", { target_audit_id: auditId });
  if (error) throw new Error(error.message);
  refreshAdminAndSite();
}

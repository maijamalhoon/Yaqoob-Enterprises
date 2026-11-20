"use server";

import { revalidatePath, updateTag } from "next/cache";
import type { AdminFormState } from "@/components/admin-action-form";
import {
  assertRestorableBackup,
  completeBackupRows,
  parseAuditId,
  parseBackupId,
  parseBackupLabel,
} from "@/lib/admin-history-fields";
import { requireAdmin } from "@/lib/admin";

type AdminSupabase = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

function refreshAdminAndSite() {
  updateTag("site-data");
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
  revalidatePath("/admin/history");
}

async function collectSnapshot(supabase: AdminSupabase) {
  const [settings, hours, categories, services, gallery, coverage] = await Promise.all([
    supabase.from("business_settings").select("*", { count: "exact" }),
    supabase.from("business_hours").select("*", { count: "exact" }).order("display_order"),
    supabase.from("service_categories").select("*", { count: "exact" }).order("display_order"),
    supabase.from("services").select("*", { count: "exact" }).order("display_order"),
    supabase.from("gallery_images").select("*", { count: "exact" }).order("display_order"),
    supabase.from("coverage_areas").select("*", { count: "exact" }).order("display_order"),
  ]);

  const snapshot = {
    version: 1,
    business_settings: completeBackupRows(settings, "business_settings"),
    business_hours: completeBackupRows(hours, "business_hours"),
    service_categories: completeBackupRows(categories, "service_categories"),
    services: completeBackupRows(services, "services"),
    gallery_images: completeBackupRows(gallery, "gallery_images"),
    coverage_areas: completeBackupRows(coverage, "coverage_areas"),
  };
  assertRestorableBackup(snapshot);
  return snapshot;
}

async function saveSnapshot(supabase: AdminSupabase, userId: string, label: string) {
  const snapshot = await collectSnapshot(supabase);
  const { data, error } = await supabase.from("admin_snapshots")
    .insert({ label, snapshot, created_by: userId }).select("id").single();
  if (error || !data) throw new Error("The backup could not be saved. No success was confirmed.");
}

async function createSnapshot(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const label = parseBackupLabel(formData.get("label"), "Manual backup · " + new Date().toISOString().slice(0, 10));
  await saveSnapshot(supabase, user.id, label);
  revalidatePath("/admin/history");
}

async function restoreSnapshot(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const snapshotId = parseBackupId(formData.get("id"));

  // Fail closed before writing the safety backup or calling the destructive restore RPC.
  const { data, error } = await supabase.from("admin_snapshots")
    .select("snapshot").eq("id", snapshotId).maybeSingle();
  if (error) throw new Error("The selected backup could not be checked. Nothing was restored.");
  if (!data) throw new Error("Backup not found. Refresh the page.");
  assertRestorableBackup(data.snapshot);

  await saveSnapshot(
    supabase,
    user.id,
    "Safety backup before restore · " + new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" }),
  );

  const restored = await supabase.rpc("restore_admin_snapshot", { target_snapshot_id: snapshotId });
  if (restored.error) throw new Error(restored.error.message);
  refreshAdminAndSite();
}

async function deleteSnapshot(formData: FormData) {
  const { supabase } = await requireAdmin();
  const snapshotId = parseBackupId(formData.get("id"));
  const { data, error } = await supabase.from("admin_snapshots")
    .delete().eq("id", snapshotId).select("id").maybeSingle();
  if (error) throw new Error("This backup could not be deleted. Retry.");
  if (!data) throw new Error("Backup not found. Refresh the page.");
  revalidatePath("/admin/history");
}

async function rollbackEntry(formData: FormData) {
  const { supabase } = await requireAdmin();
  const auditId = parseAuditId(formData.get("id"));
  const { error } = await supabase.rpc("rollback_admin_audit", { target_audit_id: auditId });
  if (error) throw new Error(error.message);
  refreshAdminAndSite();
}

function safeError(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (/^(Backup name must|Backup reference is invalid|History entry is invalid|Backup could not confirm all|This backup format is invalid|This backup version is unsupported|This backup is missing|The backup could not be saved|The selected backup could not be checked|Backup not found|This backup could not be deleted)/.test(message)) {
    return message;
  }
  if (message.includes("This record changed after")) return "A newer change exists. Undo that change first; no change was made.";
  if (message.includes("already been rolled back")) return "This change was already undone. Refresh the page.";
  if (message.includes("History entry not found")) return "History entry not found. Refresh the page.";
  if (message.includes("The current record no longer exists")) return "The record no longer exists. Refresh the page.";
  if (message.includes("A record with this ID already exists")) return "A newer record uses this reference. Undo was stopped.";
  if (message.includes("This type of change cannot be rolled back")) return "This type of change cannot be undone here.";
  return "The action could not be confirmed. Your content may be unchanged; refresh before retrying.";
}

async function withFeedback(
  formData: FormData,
  mutation: (form: FormData) => Promise<void>,
  successMessage: string,
): Promise<AdminFormState> {
  await requireAdmin();
  try {
    await mutation(formData);
    return { status: "success", message: successMessage };
  } catch (error) {
    console.error("Admin history action failed", error);
    return { status: "error", message: safeError(error) };
  }
}

export async function createSnapshotWithFeedback(_state: AdminFormState, formData: FormData): Promise<AdminFormState> {
  return withFeedback(formData, createSnapshot, "Backup created and saved.");
}
export async function restoreSnapshotWithFeedback(_state: AdminFormState, formData: FormData): Promise<AdminFormState> {
  return withFeedback(formData, restoreSnapshot, "Content restored from the selected backup. A safety backup was saved first.");
}
export async function deleteSnapshotWithFeedback(_state: AdminFormState, formData: FormData): Promise<AdminFormState> {
  return withFeedback(formData, deleteSnapshot, "Backup deleted.");
}
export async function rollbackEntryWithFeedback(_state: AdminFormState, formData: FormData): Promise<AdminFormState> {
  return withFeedback(formData, rollbackEntry, "Change undone and website refreshed.");
}

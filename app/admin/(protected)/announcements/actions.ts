"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { parseAdminAnnouncement } from "@/lib/admin-announcement-fields";
import type { AdminFormState } from "@/components/admin-action-form";

function getId(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    throw new Error("Announcement reference is invalid. Refresh this page.");
  }
  return id;
}

function refreshAnnouncements() {
  updateTag("site-data");
  revalidatePath("/", "layout");
  revalidatePath("/admin");
  revalidatePath("/admin/announcements");
}

async function createNotice(formData: FormData) {
  const { supabase } = await requireAdmin();
  const payload = parseAdminAnnouncement(formData);
  const { error } = await supabase.from("announcements").insert(payload);
  if (error) throw error;
  refreshAnnouncements();
}

async function updateNotice(formData: FormData) {
  const { supabase } = await requireAdmin();
  const payload = parseAdminAnnouncement(formData);
  // Leave existing optional publishing windows unchanged.
  const { data, error } = await supabase.from("announcements")
    .update(payload).eq("id", getId(formData)).select("id").maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("This announcement no longer exists. Refresh the page.");
  refreshAnnouncements();
}

async function deleteNotice(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("announcements")
    .delete().eq("id", getId(formData)).select("id").maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("This announcement no longer exists. Refresh the page.");
  refreshAnnouncements();
}

function safeError(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (/^(Announcement title must|Announcement message must|Link label must|Enter a link URL|Use a secure https|Announcement order must|Announcement reference is invalid|This announcement no longer exists|Announcement link is too long)/.test(message)) {
    return message;
  }
  return "The announcement change could not be confirmed. Refresh or retry.";
}

async function withFeedback(
  formData: FormData,
  mutation: (form: FormData) => Promise<void>,
  doneMessage: string,
): Promise<AdminFormState> {
  await requireAdmin();
  try {
    await mutation(formData);
    return { status: "success", message: doneMessage };
  } catch (error) {
    return { status: "error", message: safeError(error) };
  }
}

export async function createAnnouncementWithFeedback(_state: AdminFormState, formData: FormData): Promise<AdminFormState> {
  return withFeedback(formData, createNotice, "Announcement created.");
}

export async function updateAnnouncementWithFeedback(_state: AdminFormState, formData: FormData): Promise<AdminFormState> {
  return withFeedback(formData, updateNotice, "Announcement saved.");
}

export async function deleteAnnouncementWithFeedback(_state: AdminFormState, formData: FormData): Promise<AdminFormState> {
  return withFeedback(formData, deleteNotice, "Announcement deleted.");
}

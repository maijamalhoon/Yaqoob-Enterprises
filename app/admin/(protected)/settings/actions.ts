"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { parseAdminOpeningHours } from "@/lib/admin-hours";
import type { AdminFormState } from "@/components/admin-action-form";

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function normalizePkPhone(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `92${digits.slice(1)}`;
  else if (digits.startsWith("3") && digits.length === 10) digits = `92${digits}`;
  if (!/^923\d{9}$/.test(digits)) {
    throw new Error("Enter a valid Pakistani mobile number, for example +923492568864.");
  }
  return `+${digits}`;
}

function displayPhone(e164: string) {
  const match = e164.match(/^\+92(\d{3})(\d{7})$/);
  return match ? `+92 ${match[1]} ${match[2]}` : e164;
}

function secureUrl(value: string, label: string) {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:") throw new Error("invalid protocol");
    return parsed;
  } catch {
    throw new Error(`Enter a valid secure ${label} URL.`);
  }
}

function validateGoogleBusinessProfileUrl(value: string) {
  if (!value) return;
  const parsed = secureUrl(value, "Google Business Profile");
  const host = parsed.hostname.toLowerCase();
  const allowed = host === "share.google"
    || host === "g.page"
    || host === "google.com"
    || host.endsWith(".google.com")
    || host === "goo.gl"
    || host.endsWith(".goo.gl");
  if (!allowed) throw new Error("Use a Google Business Profile or Google Maps share URL.");
}

function refreshSettings() {
  updateTag("site-data");
  revalidatePath("/", "layout");
  revalidatePath("/services");
  revalidatePath("/admin");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/analytics");
}

export async function updateBusinessIdentity(formData: FormData) {
  const { supabase } = await requireAdmin();
  const businessName = text(formData, "business_name");
  if (businessName.length < 2) throw new Error("Business name is required.");

  const { data, error } = await supabase.from("business_settings").update({
    business_name: businessName,
  }).eq("id", true).select("id").maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Business settings are unavailable. Refresh the page.");
  refreshSettings();
}

export async function updateContactDetails(formData: FormData) {
  const { supabase } = await requireAdmin();
  const phone = normalizePkPhone(text(formData, "phone_number"));
  const whatsapp = normalizePkPhone(text(formData, "whatsapp_number"));
  const mapUrl = text(formData, "map_url");
  const googleBusinessProfileUrl = text(formData, "google_business_profile_url");
  const address = text(formData, "address");
  if (!address) throw new Error("Address is required.");

  secureUrl(mapUrl, "Google Maps");
  validateGoogleBusinessProfileUrl(googleBusinessProfileUrl);

  const { data, error } = await supabase.from("business_settings").update({
    phone_display: displayPhone(phone),
    phone_e164: phone,
    whatsapp_e164: whatsapp,
    address,
    map_url: mapUrl,
    google_business_profile_url: googleBusinessProfileUrl,
  }).eq("id", true).select("id").maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Business settings are unavailable. Refresh the page.");
  refreshSettings();
}

export async function updateBusinessHour(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { isClosed, periods } = parseAdminOpeningHours(formData);
  const { data, error } = await supabase.from("business_hours").update({
    periods,
    opens_at: isClosed ? null : periods[0]?.opens_at || null,
    closes_at: isClosed ? null : periods.at(-1)?.closes_at || null,
    is_closed: isClosed,
  }).eq("id", text(formData, "id")).select("id").maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("This day no longer exists. Refresh the page.");
  refreshSettings();
}

export async function updateNoticesAndPolicies(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("business_settings").update({
    pricing_message: text(formData, "pricing_message"),
    concept_image_notice: text(formData, "concept_image_notice"),
  }).eq("id", true).select("id").maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Business settings are unavailable. Refresh the page.");
  refreshSettings();
}



function safeSettingsFailure(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (/Business name is required|Address is required|Enter a valid|Use valid 24-hour|Enter both opening|Enter the first period|Add an opening period|Opening periods cannot overlap|This day no longer exists|Business settings are unavailable/.test(message)) {
    return message;
  }
  return "The change could not be confirmed. Check your inputs and try again.";
}

async function settingsFeedback(
  formData: FormData,
  action: (input: FormData) => Promise<void>,
  successMessage: string,
): Promise<AdminFormState> {
  // Auth redirects must remain redirects; do not turn them into form errors.
  await requireAdmin();
  try {
    await action(formData);
    return { status: "success", message: successMessage };
  } catch (error) {
    return { status: "error", message: safeSettingsFailure(error) };
  }
}

export async function saveIdentityWithFeedback(_previous: AdminFormState, formData: FormData): Promise<AdminFormState> {
  return settingsFeedback(formData, updateBusinessIdentity, "Business name saved.");
}
export async function saveContactWithFeedback(_previous: AdminFormState, formData: FormData): Promise<AdminFormState> {
  return settingsFeedback(formData, updateContactDetails, "Contact details saved.");
}
export async function saveOpeningHoursWithFeedback(_previous: AdminFormState, formData: FormData): Promise<AdminFormState> {
  return settingsFeedback(formData, updateBusinessHour, "Opening hours saved.");
}
export async function saveNoticesWithFeedback(_previous: AdminFormState, formData: FormData): Promise<AdminFormState> {
  return settingsFeedback(formData, updateNoticesAndPolicies, "Customer notices saved.");
}

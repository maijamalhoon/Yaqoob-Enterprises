"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdminMutation } from "@/lib/admin";

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function limitedText(formData: FormData, key: string, label: string, maxLength: number, required = false) {
  const value = text(formData, key);
  if ((required && !value) || value.length > maxLength) {
    throw new Error(`Enter ${label} using ${maxLength} characters or fewer.`);
  }
  return value;
}

function recordId(formData: FormData) {
  const id = text(formData, "id");
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    throw new Error("The opening-hours reference is invalid.");
  }
  return id;
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
  revalidatePath("/admin");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/analytics");
}

export async function updateBusinessIdentity(formData: FormData) {
  const { supabase } = await requireAdminMutation();
  const businessName = limitedText(formData, "business_name", "a business name", 80, true);
  if (businessName.length < 2) throw new Error("Business name must use at least two characters.");

  const { data, error } = await supabase.from("business_settings").update({
    business_name: businessName,
    tagline: limitedText(formData, "tagline", "a tagline", 120),
  }).eq("id", true).select("id").maybeSingle();

  if (error || !data) throw new Error("The business identity could not be updated.");
  refreshSettings();
}

export async function updateContactDetails(formData: FormData) {
  const { supabase } = await requireAdminMutation();
  const phone = normalizePkPhone(text(formData, "phone_number"));
  const whatsapp = normalizePkPhone(text(formData, "whatsapp_number"));
  const mapUrl = limitedText(formData, "map_url", "a Google Maps URL", 2_048, true);
  const googleBusinessProfileUrl = limitedText(formData, "google_business_profile_url", "a Google Business Profile URL", 2_048);
  const address = limitedText(formData, "address", "an address", 500, true);

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

  if (error || !data) throw new Error("The contact details could not be updated.");
  refreshSettings();
}

function minutes(time: string) {
  const [hours, mins] = time.split(":").map(Number);
  return hours * 60 + mins;
}

function validTime(value: string) {
  if (!/^\d{2}:\d{2}$/.test(value)) return false;
  const [hours, mins] = value.split(":").map(Number);
  return hours >= 0 && hours <= 23 && mins >= 0 && mins <= 59;
}

function readPeriod(formData: FormData, prefix: string) {
  const opensAt = text(formData, `${prefix}_opens_at`);
  const closesAt = text(formData, `${prefix}_closes_at`);
  if (!opensAt && !closesAt) return null;
  if (!opensAt || !closesAt) throw new Error("Both opening and closing time are required for each interval.");
  if (!validTime(opensAt) || !validTime(closesAt)) throw new Error("Enter valid opening and closing times.");
  return {
    opens_at: opensAt,
    closes_at: closesAt,
    closes_next_day: minutes(closesAt) <= minutes(opensAt),
  };
}

export async function updateBusinessHour(formData: FormData) {
  const { supabase } = await requireAdminMutation();
  const isClosed = bool(formData, "is_closed");
  const periods = [readPeriod(formData, "first"), readPeriod(formData, "second")].filter(Boolean) as Array<{
    opens_at: string;
    closes_at: string;
    closes_next_day: boolean;
  }>;

  periods.sort((a, b) => minutes(a.opens_at) - minutes(b.opens_at));
  if (!isClosed && periods.length === 0) throw new Error("Add at least one opening interval or mark the day closed.");
  if (periods.length > 1) {
    const first = periods[0];
    const second = periods[1];
    if (first.closes_next_day || minutes(second.opens_at) < minutes(first.closes_at)) {
      throw new Error("Opening intervals cannot overlap, and an overnight interval must be the final interval.");
    }
  }

  const { data, error } = await supabase.from("business_hours").update({
    periods: isClosed ? [] : periods,
    opens_at: isClosed ? null : periods[0]?.opens_at || null,
    closes_at: isClosed ? null : periods.at(-1)?.closes_at || null,
    is_closed: isClosed,
  }).eq("id", recordId(formData)).select("id").maybeSingle();

  if (error || !data) throw new Error("The opening hours could not be updated or no longer exist.");
  refreshSettings();
}

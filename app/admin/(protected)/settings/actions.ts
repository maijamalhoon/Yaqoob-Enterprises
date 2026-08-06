"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";

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

function refreshSettings() {
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");
}

export async function updateBusinessSettings(formData: FormData) {
  const { supabase } = await requireAdmin();
  const phone = normalizePkPhone(text(formData, "phone_number"));
  const whatsapp = normalizePkPhone(text(formData, "whatsapp_number"));
  const mapUrl = text(formData, "map_url");
  try {
    const parsed = new URL(mapUrl);
    if (parsed.protocol !== "https:") throw new Error("invalid protocol");
  } catch {
    throw new Error("Enter a valid secure Google Maps URL.");
  }

  const { error } = await supabase.from("business_settings").update({
    business_name: text(formData, "business_name"),
    tagline: text(formData, "tagline"),
    phone_display: displayPhone(phone),
    phone_e164: phone,
    whatsapp_e164: whatsapp,
    address: text(formData, "address"),
    map_url: mapUrl,
    pricing_message: text(formData, "pricing_message"),
    concept_image_notice: text(formData, "concept_image_notice"),
  }).eq("id", true);

  if (error) throw new Error(error.message);
  refreshSettings();
}

function minutes(time: string) {
  const [hours, mins] = time.split(":").map(Number);
  return hours * 60 + mins;
}

function readPeriod(formData: FormData, prefix: string) {
  const opensAt = text(formData, `${prefix}_opens_at`);
  const closesAt = text(formData, `${prefix}_closes_at`);
  if (!opensAt && !closesAt) return null;
  if (!opensAt || !closesAt) throw new Error("Both opening and closing time are required for each interval.");
  return {
    opens_at: opensAt,
    closes_at: closesAt,
    closes_next_day: minutes(closesAt) <= minutes(opensAt),
  };
}

export async function updateBusinessHour(formData: FormData) {
  const { supabase } = await requireAdmin();
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

  const { error } = await supabase.from("business_hours").update({
    periods: isClosed ? [] : periods,
    opens_at: isClosed ? null : periods[0]?.opens_at || null,
    closes_at: isClosed ? null : periods.at(-1)?.closes_at || null,
    is_closed: isClosed,
  }).eq("id", text(formData, "id"));

  if (error) throw new Error(error.message);
  refreshSettings();
}

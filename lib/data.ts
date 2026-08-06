import { cache } from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  Announcement,
  BusinessHour,
  BusinessSettings,
  CoverageArea,
  GalleryImage,
  Service,
  ServiceCategory,
} from "@/lib/types";

const fallbackSettings: BusinessSettings = {
  business_name: "Yaqoob Enterprises",
  tagline: "Everyday Services, Made Easier",
  phone_display: "+92 349 2568864",
  phone_e164: "+923492568864",
  whatsapp_e164: "+923492568864",
  address: "Plot No. 7, Street No. 1, Sector B, Akhtar Colony, Karachi 75500, Pakistan",
  map_url: "https://maps.app.goo.gl/hui54LEXRjMeWxme9",
  pricing_message:
    "Hamari service charges kaam ki type, quantity, urgency, delivery location aur applicable official fees ke mutabiq vary karti hain. Exact quotation kaam shuru hone se pehle WhatsApp ya shop par confirm ki jati hai.",
  concept_image_notice: "Storefront concept preview — actual shop photos coming soon.",
};

export const getSiteData = cache(async () => {
  const supabase = await createServerSupabaseClient();

  const [settingsResult, hoursResult, categoriesResult, servicesResult, coverageResult, galleryResult, announcementsResult] =
    await Promise.all([
      supabase.from("business_settings").select("*").eq("id", true).maybeSingle(),
      supabase.from("business_hours").select("*").order("display_order"),
      supabase.from("service_categories").select("*").order("display_order"),
      supabase.from("services").select("*").neq("status", "hidden").order("display_order"),
      supabase.from("coverage_areas").select("*").eq("is_active", true).order("display_order"),
      supabase.from("gallery_images").select("*").eq("is_active", true).order("display_order"),
      supabase.from("announcements").select("*").eq("is_active", true).order("display_order"),
    ]);

  const settings = (settingsResult.data as BusinessSettings | null) || fallbackSettings;
  const hours = (hoursResult.data || []) as BusinessHour[];
  const services = (servicesResult.data || []) as Service[];
  const categories = ((categoriesResult.data || []) as ServiceCategory[]).map((category) => ({
    ...category,
    services: services.filter((service) => service.category_id === category.id),
  }));

  return {
    settings,
    hours,
    categories,
    services,
    coverage: (coverageResult.data || []) as CoverageArea[],
    gallery: (galleryResult.data || []) as GalleryImage[],
    announcements: (announcementsResult.data || []) as Announcement[],
  };
});

export async function getCategoryBySlug(slug: string) {
  const { categories } = await getSiteData();
  return categories.find((category) => category.slug === slug) || null;
}

export function whatsappUrl(number: string, message: string) {
  const normalized = number.replace(/[^0-9]/g, "");
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export function formatTime(time: string | null) {
  if (!time) return "Closed";
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
}

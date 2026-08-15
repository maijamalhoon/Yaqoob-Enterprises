import { unstable_cache } from "next/cache";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type {
  Announcement,
  BusinessHour,
  BusinessHourPeriod,
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
  address: "Plot No. 7, Street No. 1, Sector B, Akhtar Colony, Karachi, Pakistan",
  map_url: "https://maps.app.goo.gl/uvWeMqEFYYPrEzw9A",
  pricing_message:
    "Service charges vary by work type, quantity, urgency, delivery location and any applicable official fees. We confirm the exact quotation before work begins, either on WhatsApp or at the shop.",
  concept_image_notice: "Storefront concept preview — actual shop photos coming soon.",
};

const businessSettingsColumns = [
  "business_name",
  "tagline",
  "phone_display",
  "phone_e164",
  "whatsapp_e164",
  "address",
  "map_url",
  "pricing_message",
  "concept_image_notice",
].join(",");

const businessHoursColumns = [
  "id",
  "weekday",
  "label",
  "opens_at",
  "closes_at",
  "periods",
  "is_closed",
  "display_order",
].join(",");

const serviceCategoryColumns = [
  "id",
  "slug",
  "title",
  "description",
  "icon_key",
  "display_order",
  "is_active",
  "updated_at",
].join(",");

const serviceColumns = [
  "id",
  "category_id",
  "slug",
  "title",
  "short_description",
  "detailed_description",
  "status",
  "available_at_shop",
  "whatsapp_request",
  "pickup_available",
  "delivery_available",
  "doorstep_available",
  "appointment_required",
  "requirements",
  "important_note",
  "display_order",
  "is_featured",
  "seo_title",
  "seo_description",
  "updated_at",
].join(",");

const coverageColumns = [
  "id",
  "name",
  "delivery_available",
  "doorstep_biometric_available",
  "pickup_available",
  "extra_charge_may_apply",
  "notes",
  "display_order",
  "is_active",
].join(",");

const galleryColumns = [
  "id",
  "storage_path",
  "alt_text",
  "caption",
  "media_kind",
  "is_featured",
  "display_order",
  "focal_x",
  "focal_y",
  "is_active",
].join(",");

const announcementColumns = ["id", "title", "message", "link_label", "link_url"].join(",");

function logOptionalDataError(dataset: string, error: { message?: string } | null) {
  if (!error) return;
  console.error(`[site-data] Failed to load optional ${dataset}: ${error.message || "Unknown Supabase error"}`);
}

function requireCoreData(dataset: string, error: { message?: string } | null) {
  if (!error) return;
  throw new Error(`[site-data] Failed to load required ${dataset}: ${error.message || "Unknown Supabase error"}`);
}

async function loadSiteData() {
  const supabase = createPublicSupabaseClient();

  const [settingsResult, hoursResult, categoriesResult, servicesResult, coverageResult, galleryResult, announcementsResult] =
    await Promise.all([
      supabase.from("business_settings").select(businessSettingsColumns).eq("id", true).maybeSingle(),
      supabase.from("business_hours").select(businessHoursColumns).order("display_order"),
      supabase.from("service_categories").select(serviceCategoryColumns).eq("is_active", true).order("display_order"),
      supabase.from("services").select(serviceColumns).neq("status", "hidden").order("display_order"),
      supabase.from("coverage_areas").select(coverageColumns).eq("is_active", true).order("display_order"),
      supabase.from("gallery_images").select(galleryColumns).eq("is_active", true).order("display_order"),
      supabase.from("announcements").select(announcementColumns).eq("is_active", true).order("display_order"),
    ]);

  requireCoreData("business settings", settingsResult.error);
  requireCoreData("service categories", categoriesResult.error);
  requireCoreData("services", servicesResult.error);

  logOptionalDataError("business hours", hoursResult.error);
  logOptionalDataError("coverage areas", coverageResult.error);
  logOptionalDataError("gallery images", galleryResult.error);
  logOptionalDataError("announcements", announcementsResult.error);

  const settings = (settingsResult.data as unknown as BusinessSettings | null) || fallbackSettings;
  const hours = hoursResult.error ? [] : ((hoursResult.data || []) as unknown as BusinessHour[]);
  const rawCategories = (categoriesResult.data || []) as unknown as ServiceCategory[];
  const activeCategoryIds = new Set(rawCategories.map((category) => category.id));
  const services = ((servicesResult.data || []) as unknown as Service[]).filter((service) => activeCategoryIds.has(service.category_id));
  const categories = rawCategories.map((category) => ({
    ...category,
    services: services.filter((service) => service.category_id === category.id),
  }));

  return {
    settings,
    hours,
    categories,
    services,
    coverage: coverageResult.error ? [] : ((coverageResult.data || []) as unknown as CoverageArea[]),
    gallery: galleryResult.error ? [] : ((galleryResult.data || []) as unknown as GalleryImage[]),
    announcements: announcementsResult.error ? [] : ((announcementsResult.data || []) as unknown as Announcement[]),
  };
}

export const getSiteData = unstable_cache(loadSiteData, ["public-site-data-v6"], {
  revalidate: 300,
  tags: ["site-data"],
});

export async function getCategoryBySlug(slug: string) {
  const { categories } = await getSiteData();
  return categories.find((category) => category.slug === slug) || null;
}

export async function getServiceBySlugs(categorySlug: string, serviceSlug: string) {
  const { categories } = await getSiteData();
  const category = categories.find((item) => item.slug === categorySlug);
  if (!category) return null;
  const service = category.services?.find((item) => item.slug === serviceSlug);
  return service ? { category, service } : null;
}

export async function getPublicServicePaths() {
  const { categories } = await getSiteData();
  return categories.flatMap((category) =>
    (category.services || []).map((service) => ({
      categorySlug: category.slug,
      serviceSlug: service.slug,
    })),
  );
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

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function getHourPeriods(hour: BusinessHour): BusinessHourPeriod[] {
  if (hour.is_closed) return [];
  if (Array.isArray(hour.periods) && hour.periods.length > 0) {
    return hour.periods
      .filter((period) => period?.opens_at && period?.closes_at)
      .map((period) => ({
        opens_at: String(period.opens_at).slice(0, 5),
        closes_at: String(period.closes_at).slice(0, 5),
        closes_next_day:
          Boolean(period.closes_next_day) ||
          timeToMinutes(String(period.closes_at).slice(0, 5)) <= timeToMinutes(String(period.opens_at).slice(0, 5)),
      }))
      .sort((a, b) => timeToMinutes(a.opens_at) - timeToMinutes(b.opens_at));
  }
  if (hour.opens_at && hour.closes_at) {
    const opensAt = hour.opens_at.slice(0, 5);
    const closesAt = hour.closes_at.slice(0, 5);
    return [{
      opens_at: opensAt,
      closes_at: closesAt,
      closes_next_day: timeToMinutes(closesAt) <= timeToMinutes(opensAt),
    }];
  }
  return [];
}

export function formatBusinessHours(hour: BusinessHour) {
  const periods = getHourPeriods(hour);
  if (hour.is_closed || periods.length === 0) return "Closed";
  return periods
    .map((period) => `${formatTime(period.opens_at)}–${formatTime(period.closes_at)}`)
    .join(" & ");
}

const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const weekdayShortToIndex: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function karachiClock(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Karachi",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    weekday: weekdayShortToIndex[values.weekday] ?? 0,
    minute: Number(values.hour) * 60 + Number(values.minute),
  };
}

export function getCurrentBusinessStatus(hours: BusinessHour[], now = new Date()) {
  if (hours.length === 0) return "Hours available on WhatsApp";

  const { weekday, minute } = karachiClock(now);
  const byWeekday = new Map(hours.map((hour) => [hour.weekday, hour]));
  const today = byWeekday.get(weekday);
  const previous = byWeekday.get((weekday + 6) % 7);

  const previousOvernight = previous
    ? getHourPeriods(previous).find(
        (period) => period.closes_next_day && minute < timeToMinutes(period.closes_at),
      )
    : undefined;
  if (previousOvernight) {
    return `Open now · until ${formatTime(previousOvernight.closes_at)}`;
  }

  const todayPeriods = today ? getHourPeriods(today) : [];
  const activeIndex = todayPeriods.findIndex((period) => {
    const opens = timeToMinutes(period.opens_at);
    const closes = timeToMinutes(period.closes_at);
    return period.closes_next_day ? minute >= opens : minute >= opens && minute < closes;
  });

  if (activeIndex >= 0) {
    const active = todayPeriods[activeIndex];
    const laterPeriod = todayPeriods
      .slice(activeIndex + 1)
      .find((period) => timeToMinutes(period.opens_at) > minute);

    if (laterPeriod && !active.closes_next_day) {
      return `Open now · closes ${formatTime(active.closes_at)} · reopens ${formatTime(laterPeriod.opens_at)}`;
    }
    return `Open now · until ${formatTime(active.closes_at)}`;
  }

  const nextToday = todayPeriods.find((period) => timeToMinutes(period.opens_at) > minute);
  if (nextToday) {
    const hadEarlierPeriod = todayPeriods.some((period) => timeToMinutes(period.closes_at) <= minute);
    return hadEarlierPeriod
      ? `Break now · reopens ${formatTime(nextToday.opens_at)}`
      : `Opens today at ${formatTime(nextToday.opens_at)}`;
  }

  for (let offset = 1; offset <= 7; offset += 1) {
    const targetWeekday = (weekday + offset) % 7;
    const nextDay = byWeekday.get(targetWeekday);
    const nextPeriod = nextDay ? getHourPeriods(nextDay)[0] : undefined;
    if (!nextPeriod) continue;
    const dayLabel = offset === 1 ? "tomorrow" : weekdayNames[targetWeekday];
    return `Opens ${dayLabel} at ${formatTime(nextPeriod.opens_at)}`;
  }

  return "Temporarily closed";
}

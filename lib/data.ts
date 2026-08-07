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

async function loadSiteData() {
  const supabase = createPublicSupabaseClient();

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
}

export const getSiteData = unstable_cache(loadSiteData, ["public-site-data-v2"], {
  revalidate: 300,
  tags: ["site-data"],
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

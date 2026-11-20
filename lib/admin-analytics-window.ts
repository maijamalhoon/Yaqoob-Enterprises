const KARACHI_OFFSET_MS = 5 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const karachiDayFormatter = new Intl.DateTimeFormat("en-US", {
  calendar: "gregory",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Karachi",
});

export function karachiDayKey(date: Date): string {
  if (!Number.isFinite(date.getTime())) throw new Error("Analytics date is invalid.");
  const parts = Object.fromEntries(karachiDayFormatter.formatToParts(date).map(({ type, value }) => [type, value]));
  return parts.year + "-" + parts.month + "-" + parts.day;
}

// Karachi observes UTC+05:00 in the current reporting period (no DST).
// Thirty local calendar dates including today: no 31st bar or partial excluded day.
export function karachiAnalyticsWindow(now: Date) {
  const today = karachiDayKey(now);
  const [year, month, day] = today.split("-").map(Number);
  const todayUtcDate = Date.UTC(year, month - 1, day);
  const firstUtcDate = todayUtcDate - 29 * DAY_MS;
  const days = Array.from({ length: 30 }, (_, index) => new Date(firstUtcDate + index * DAY_MS).toISOString().slice(0, 10));
  return {
    since: new Date(firstUtcDate - KARACHI_OFFSET_MS).toISOString(),
    until: now.toISOString(),
    days,
  };
}

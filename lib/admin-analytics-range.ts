import { karachiDayKey } from "./admin-analytics-window";

/**
 * The selected period is shared by every KPI, chart and breakdown.
 * Using Pakistan calendar keys prevents timezone drift at midnight.
 */
export type AdminAnalyticsRange = 7 | 30;

export function normalizeAdminAnalyticsRange(value: unknown): AdminAnalyticsRange {
  return value === "7" ? 7 : 30;
}

export function analyticsSelectedDays(allDays: readonly string[], range: AdminAnalyticsRange) {
  return allDays.slice(-range);
}

export function filterEventsForDays<T extends { created_at: string }>(
  events: readonly T[],
  selectedDays: readonly string[],
): T[] {
  const included = new Set(selectedDays);
  return events.filter((event) => {
    const timestamp = new Date(event.created_at);
    return Number.isFinite(timestamp.getTime()) && included.has(karachiDayKey(timestamp));
  });
}

export function contactConversionRate(contactBrowsers: number, trackedBrowsers: number): number {
  if (!Number.isFinite(contactBrowsers) || !Number.isFinite(trackedBrowsers) || trackedBrowsers <= 0) return 0;
  return Number((Math.max(0, Math.min(100, contactBrowsers / trackedBrowsers * 100))).toFixed(1));
}

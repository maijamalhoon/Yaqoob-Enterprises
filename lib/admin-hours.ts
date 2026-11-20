export type AdminHourPeriod = {
  opens_at: string;
  closes_at: string;
  closes_next_day: boolean;
};

function text(formData: FormData, key: string): string {
  return String(formData.get(key) || "").trim();
}

function minuteOfDay(time: string): number {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time);
  if (!match) throw new Error("Use valid 24-hour times, for example 09:00 or 18:30.");
  return Number(match[1]) * 60 + Number(match[2]);
}

function period(formData: FormData, prefix: "first" | "second"): AdminHourPeriod | null {
  const opens_at = text(formData, prefix + "_opens_at");
  const closes_at = text(formData, prefix + "_closes_at");
  if (!opens_at && !closes_at) return null;
  if (!opens_at || !closes_at) {
    throw new Error("Enter both opening and closing times for each period.");
  }
  const start = minuteOfDay(opens_at);
  const end = minuteOfDay(closes_at);
  return { opens_at, closes_at, closes_next_day: end <= start };
}

export function parseAdminOpeningHours(formData: FormData): {
  isClosed: boolean;
  periods: AdminHourPeriod[];
} {
  const isClosed = formData.get("is_closed") === "on" || formData.get("is_closed") === "true";
  // Closed-day changes should not fail because old/partially entered time inputs remain populated.
  if (isClosed) return { isClosed, periods: [] };

  const first = period(formData, "first");
  const second = period(formData, "second");
  if (!first && second) throw new Error("Enter the first period before adding a reopening period.");
  if (!first) throw new Error("Add an opening period or mark the day closed.");

  const periods = [first, ...(second ? [second] : [])];
  periods.sort((a, b) => minuteOfDay(a.opens_at) - minuteOfDay(b.opens_at));

  if (periods.length > 1) {
    const earlier = periods[0];
    const later = periods[1];
    if (earlier.closes_next_day || minuteOfDay(later.opens_at) < minuteOfDay(earlier.closes_at)) {
      throw new Error("Opening periods cannot overlap; an overnight period must be the final one.");
    }
  }
  return { isClosed, periods };
}

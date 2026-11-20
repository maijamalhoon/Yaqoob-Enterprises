/**
 * Display-only grouping for high-frequency activity. Never merges analytics
 * database records or claims that grouped events represent unique visitors.
 */
export type AdminActivity = {
  event_name: string;
  page_path: string | null;
  city_name: string | null;
  device_type: string | null;
  created_at: string;
};

export type ActivityGroup = AdminActivity & {
  count: number;
  first_at: string;
};

const GROUP_WINDOW_MS = 5 * 60 * 1000;

function sameEvent(a: AdminActivity, b: AdminActivity) {
  return a.event_name === b.event_name
    && a.page_path === b.page_path
    && a.city_name === b.city_name
    && a.device_type === b.device_type;
}

export function groupRecentAdminActivity(rows: readonly AdminActivity[], maxGroups = 7): ActivityGroup[] {
  if (!Number.isInteger(maxGroups) || maxGroups < 0) return [];
  const result: ActivityGroup[] = [];

  for (const event of rows) {
    const time = Date.parse(event.created_at);
    const previous = Number.isFinite(time)
      ? result.find((group) => {
          const newest = Date.parse(group.created_at);
          const oldest = Date.parse(group.first_at);
          return sameEvent(group, event)
            && Number.isFinite(newest)
            && Number.isFinite(oldest)
            && time <= newest && newest - time <= GROUP_WINDOW_MS
            && newest - oldest <= GROUP_WINDOW_MS;
        })
      : undefined;

    if (previous) {
      previous.count += 1;
      previous.first_at = event.created_at;
    } else {
      result.push({ ...event, first_at: event.created_at, count: 1 });
    }
  }

  return result.slice(0, maxGroups);
}

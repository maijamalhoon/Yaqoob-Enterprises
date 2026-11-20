export type AdminServiceSummary = {
  category_id: string;
  title: string;
  slug: string;
  short_description?: string | null;
  status: string;
};

export const ADMIN_SERVICE_STATUSES = [
  "active", "appointment_only", "temporarily_unavailable", "coming_soon", "hidden",
] as const;

export function normalizeAdminServiceFilters(rawQuery?: string, rawStatus?: string) {
  const query = (rawQuery || "").trim().slice(0, 80);
  const status = ADMIN_SERVICE_STATUSES.some((candidate) => candidate === rawStatus)
    ? rawStatus!
    : "all";
  return { query, status, active: query.length > 0 || status !== "all" };
}

export function filterAdminServices<T extends AdminServiceSummary>(
  services: T[],
  query: string,
  status: string,
): T[] {
  const needle = query.trim().toLowerCase().slice(0, 80);
  return services.filter((service) => {
    if (status !== "all" && service.status !== status) return false;
    if (!needle) return true;
    return [service.title, service.slug, service.short_description || ""]
      .join(" ").toLowerCase().includes(needle);
  });
}

type Category = { id: string; slug: string; title: string };
type Service = { category_id: string; slug: string; title: string };
type Event = { page_path: string | null };

/** Never count /services/category as a service detail view. */
export function normalizeServiceDetailPath(value: string | null) {
  if (!value) return null;
  const clean = value.split(/[?#]/, 1)[0].replace(/\/+$/, "");
  const bits = clean.split("/").filter(Boolean);
  return bits.length === 3 && bits[0] === "services" ? "/" + bits.join("/") : null;
}

/** Uses actual catalogue titles, not the category slug as a misleading service name. */
export function rankServicePageViews(events: readonly Event[], categories: readonly Category[], services: readonly Service[]) {
  const byId = new Map(categories.map((category) => [category.id, category]));
  const catalog = new Map(services.flatMap((service) => {
    const category = byId.get(service.category_id);
    if (!category) return [];
    const path = "/services/" + category.slug + "/" + service.slug;
    return [[path, { title: service.title, category: category.title }] as const];
  }));

  const counts = new Map<string, number>();
  for (const event of events) {
    const path = normalizeServiceDetailPath(event.page_path);
    if (!path) continue;
    counts.set(path, (counts.get(path) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([path, views]) => {
    const match = catalog.get(path);
    const label = match ? match.title + " · " + match.category : path;
    return [label, views] as [string, number];
  });
}

/** Shared Admin IA: sidebar, breadcrumbs and command search use one route map. */
export const adminNavigationGroups = [
  { label: "Workspace", links: [
    { label: "Overview", href: "/admin", description: "Website health, priorities and recent activity", keywords: "home dashboard" },
    { label: "Analytics", href: "/admin/analytics", description: "Traffic, visitors, contact actions and sources", keywords: "reports graphs charts" },
  ] },
  { label: "Website", links: [
    { label: "Services", href: "/admin/services", description: "Manage service catalogue and categories", keywords: "printing products edit add" },
    { label: "Coverage", href: "/admin/coverage", description: "Delivery, pickup and home biometric areas", keywords: "location city regions" },
    { label: "Gallery", href: "/admin/gallery", description: "Upload and feature shop photographs", keywords: "media images photos hero" },
    { label: "Announcements", href: "/admin/announcements", description: "Publish customer notices and updates", keywords: "messages updates" },
  ] },
  { label: "System", links: [
    { label: "Settings", href: "/admin/settings", description: "Business details, contact and opening hours", keywords: "phone map address schedule" },
    { label: "History", href: "/admin/history", description: "Audit changes and content backups", keywords: "restore recovery undo export" },
  ] },
] as const;

export const adminNavigationItems = adminNavigationGroups.flatMap((group) =>
  group.links.map((link) => ({ ...link, section: group.label })),
);

export function isActiveAdminPath(pathname: string, href: string) {
  return href === "/admin"
    ? pathname === "/admin"
    : pathname === href || pathname.startsWith(href + "/");
}

export function getAdminPage(pathname: string) {
  return adminNavigationItems.find((entry) => isActiveAdminPath(pathname, entry.href));
}

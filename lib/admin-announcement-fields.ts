export type AdminAnnouncementPayload = {
  title: string;
  message: string;
  link_label: string | null;
  link_url: string | null;
  display_order: number;
  is_active: boolean;
};

function text(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

export function validateAnnouncementLink(input: string): string | null {
  const url = input.trim();
  if (!url) return null;
  if (url.length > 1000) throw new Error("Announcement link is too long.");
  if (url.startsWith("/") && !url.startsWith("//") && !/[\\\u0000-\u001f]/.test(url)) {
    return url; // Allow safe internal paths, e.g. /rates.
  }
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || !parsed.hostname || parsed.username || parsed.password) {
      throw new Error("invalid URL");
    }
    return url;
  } catch {
    throw new Error("Use a secure https:// link or an internal path such as /rates.");
  }
}

export function parseAdminAnnouncement(form: FormData): AdminAnnouncementPayload {
  const title = text(form, "title");
  const message = text(form, "message");
  const linkLabel = text(form, "link_label");
  const linkUrl = validateAnnouncementLink(text(form, "link_url"));
  const displayOrder = text(form, "display_order");

  if (title.length < 3 || title.length > 120) {
    throw new Error("Announcement title must be between 3 and 120 characters.");
  }
  if (message.length < 5 || message.length > 2000) {
    throw new Error("Announcement message must be between 5 and 2000 characters.");
  }
  if (linkLabel.length > 100) {
    throw new Error("Link label must not exceed 100 characters.");
  }
  if (linkLabel && !linkUrl) {
    throw new Error("Enter a link URL when providing a link label.");
  }
  if (!/^\d{1,5}$/.test(displayOrder) || Number(displayOrder) > 10000) {
    throw new Error("Announcement order must be a whole number from 0 to 10000.");
  }
  return {
    title, message,
    link_label: linkUrl ? linkLabel || null : null,
    link_url: linkUrl,
    display_order: Number(displayOrder),
    is_active: form.get("is_active") === "on" || form.get("is_active") === "true",
  };
}

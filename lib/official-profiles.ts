export const OFFICIAL_PROFILES = [
  {
    label: "Google Business",
    href: "https://share.google/2S03TGi4gfULWqI6F",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/yaqoobenterprises1",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/yaqoobenterprises1/",
  },
] as const;

export const OFFICIAL_PROFILE_URLS = OFFICIAL_PROFILES.map((profile) => profile.href);

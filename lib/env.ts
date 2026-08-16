function requiredValue(name: string, value: string | undefined) {
  const normalized = value?.trim();
  if (!normalized) {
    throw new Error(`[environment] ${name} is required. See docs/environment-and-deployment.md.`);
  }
  return normalized;
}

function requiredOrigin(name: string, value: string | undefined) {
  const normalized = requiredValue(name, value);
  let parsed: URL;

  try {
    parsed = new URL(normalized);
  } catch {
    throw new Error(`[environment] ${name} must be a valid absolute URL.`);
  }

  const isLocalhost = ["localhost", "127.0.0.1", "[::1]", "::1"].includes(parsed.hostname);
  const isAllowedProtocol = parsed.protocol === "https:" || (parsed.protocol === "http:" && isLocalhost);
  if (!isAllowedProtocol) {
    throw new Error(`[environment] ${name} must use HTTPS (HTTP is allowed only for localhost).`);
  }

  if (parsed.username || parsed.password || parsed.pathname !== "/" || parsed.search || parsed.hash) {
    throw new Error(`[environment] ${name} must be an origin without credentials, a path, query, or hash.`);
  }

  return parsed.origin;
}

function decodeJwtRole(value: string) {
  const payload = value.split(".")[1];
  if (!payload) return null;

  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(payload.length / 4) * 4, "=");
    const parsed = JSON.parse(globalThis.atob(base64)) as { role?: unknown };
    return typeof parsed.role === "string" ? parsed.role : null;
  } catch {
    return null;
  }
}

function requiredPublishableKey(value: string | undefined) {
  const normalized = requiredValue("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", value);
  const isPublishableKey = normalized.startsWith("sb_publishable_");
  const isLegacyAnonKey = decodeJwtRole(normalized) === "anon";

  if (!isPublishableKey && !isLegacyAnonKey) {
    throw new Error(
      "[environment] NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be a Supabase publishable key or legacy anon key.",
    );
  }

  return normalized;
}

export const SUPABASE_URL = requiredOrigin(
  "NEXT_PUBLIC_SUPABASE_URL",
  process.env.NEXT_PUBLIC_SUPABASE_URL,
);

export const SUPABASE_PUBLISHABLE_KEY = requiredPublishableKey(
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);

export const SITE_URL = requiredOrigin("NEXT_PUBLIC_SITE_URL", process.env.NEXT_PUBLIC_SITE_URL);

export const ANALYTICS_ENABLED = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true";

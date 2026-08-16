import { SUPABASE_URL } from "@/lib/env";

export function publicStorageUrl(bucket: string, objectPath: string) {
  const safePath = objectPath.split("/").map(encodeURIComponent).join("/");
  return `${SUPABASE_URL}/storage/v1/object/public/${encodeURIComponent(bucket)}/${safePath}`;
}

import type { PostgrestError } from "@supabase/supabase-js";

export function assertQuerySucceeded(error: PostgrestError | null, resource: string): asserts error is null {
  if (!error) return;
  console.error("Admin data query failed", { resource, code: error.code });
  throw new Error(`The latest ${resource} could not be loaded.`);
}

import "server-only";

/** Server-side timestamp for authenticated, dynamic admin screens. */
export async function currentServerTimeMs(): Promise<number> {
  return Date.now();
}

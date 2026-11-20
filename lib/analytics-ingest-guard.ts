/**
 * Refuse telemetry from preview deployments, CI and alternate hosts.
 * Production checks are server-side: do not rely on a browser flag.
 */
export function canIngestPublicAnalytics(input: {
  requestUrl: string;
  canonicalSiteUrl: string;
  nodeEnv: string | undefined;
  vercel: string | undefined;
  vercelEnv: string | undefined;
  deploymentEnv?: string | undefined;
}): boolean {
  if (input.nodeEnv !== "production") return false;
  const deployment = input.vercelEnv || input.deploymentEnv;
  // Vercel preview deployments run with NODE_ENV=production. Fail closed
  // if the deployment identifier was not set correctly.
  if (input.vercel === "1" && deployment !== "production") return false;
  if (deployment && deployment !== "production") return false;
  try {
    const request = new URL(input.requestUrl);
    const site = new URL(input.canonicalSiteUrl);
    if (!["http:", "https:"].includes(request.protocol)) return false;
    if (!["http:", "https:"].includes(site.protocol)) return false;
    return request.host.toLowerCase() === site.host.toLowerCase();
  } catch {
    return false;
  }
}

import test from "node:test";
import assert from "node:assert/strict";
import { canIngestPublicAnalytics } from "../lib/analytics-ingest-guard.ts";

const base = {
  requestUrl: "https://yaqoob-enterprises.vercel.app/api/analytics",
  canonicalSiteUrl: "https://yaqoob-enterprises.vercel.app",
  nodeEnv: "production",
  vercel: "1",
  vercelEnv: "production",
};

test("telemetry is enabled only for canonical production website", () => {
  assert.equal(canIngestPublicAnalytics(base), true);
  assert.equal(canIngestPublicAnalytics({ ...base, requestUrl: "https://yaqoob-enterprises.vercel.app:443/api/analytics" }), true);
});

test("preview deployments do not pollute production analytics", () => {
  for (const overrides of [
    { vercelEnv: "preview" },
    { vercelEnv: "development" },
    { vercelEnv: "" },
    { vercelEnv: undefined },
    { vercelEnv: "production", deploymentEnv: "preview" }, // explicit Vercel state wins
    { requestUrl: "https://yaqoob-enterprises-git-feature.vercel.app/api/analytics" },
    { requestUrl: "https://some-other-domain.example/api/analytics" },
    { nodeEnv: "development" },
    { requestUrl: "file:///api/analytics" },
    { canonicalSiteUrl: "not-a-url" },
  ]) {
    // First four cases must fail; the vercelEnv production case is tested separately.
    if (overrides.vercelEnv === "production") continue;
    assert.equal(canIngestPublicAnalytics({ ...base, ...overrides }), false, JSON.stringify(overrides));
  }
  assert.equal(canIngestPublicAnalytics({ ...base, vercelEnv: undefined, deploymentEnv: "preview" }), false);
  assert.equal(canIngestPublicAnalytics({ ...base, vercel: undefined, vercelEnv: undefined, deploymentEnv: undefined }), true);
});

test("Vercel environment takes precedence over a stale public environment value", () => {
  assert.equal(canIngestPublicAnalytics({ ...base, deploymentEnv: "preview" }), true);
  assert.equal(canIngestPublicAnalytics({ ...base, vercelEnv: "preview", deploymentEnv: "production" }), false);
});

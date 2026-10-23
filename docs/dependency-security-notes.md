# Dependency Security Notes

## Temporary audit handling: GHSA-vfj7-8cjw-p6xm

**Reviewed:** 2026-10-23  
**Status:** Open upstream advisory; monitor for a supported fix.

The current full dependency audit reports the GitHub-reviewed High-severity advisory [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) against `braces@3.0.3`. In the current lockfile, the dependency path is development-only:

`eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces`

The advisory currently lists no patched braces release. The suggested `npm audit fix --force` path would downgrade `eslint-config-next` to version 14.x, which is not an acceptable automatic change for this Next.js 16 application. Do not apply a force downgrade simply to make the audit green.

## Current policy

- The dependency-audit workflow **fails on High/Critical advisories in production dependencies** using `npm audit --omit=dev --audit-level=high`.
- The full-tree audit remains visible in the workflow output as a warning while this upstream development-tool advisory has no supported patch.
- Dependabot is enabled for npm and GitHub Actions updates. Review GitHub dependency/security alerts and the full audit output, including development dependencies.
- This is not a statement that the advisory is harmless. Development and CI dependencies remain part of the supply-chain risk and must be re-evaluated.

## Exit criteria

Revisit this note during dependency maintenance. Remove the exception and restore a blocking full-tree audit when a compatible, supported dependency path no longer includes the affected version, or when the upstream advisory is formally resolved. Validate the lockfile and run the full CI suite after any dependency change.

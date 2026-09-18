# Security exception register

## SEC-001 — two moderate Vitest transitive advisories

- **Status:** accepted temporarily for the staging prototype
- **Detected by:** `npm audit`
- **Severity:** moderate
- **Package:** `@vitest/mocker` through Vitest
- **Reason:** the available remediation requires a breaking Vitest major upgrade; the package is development/test-only and is not shipped in the production frontend bundle.
- **Compensating controls:** `npm audit --audit-level=high` blocks high/critical findings in CI; production builds run TypeScript/Vite only; the dependency lockfile is committed; an SBOM is generated during CI.
- **Exit condition:** upgrade Vitest and regenerate the lockfile before public production launch, then remove this exception.

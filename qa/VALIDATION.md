# Validation — 24 October 2026

## Build and behavior

- Astro/TypeScript check: no errors, warnings, or hints.
- Static pages: home, projects, about, fastPay, Flowguard, Slotly; custom 404 also generated.
- All 83 internal asset/link references resolve in the build output.
- Every content page has one H1, a unique title, description, canonical URL, and valid JSON-LD.
- Preview build: noindex/nofollow, disallow-all robots, empty sitemap.
- Production-mode build: index/follow, allow-all robots, six sitemap entries, absolute canonical URLs, no localhost URLs. Tested using an explicit validation-only hostname, not an actual deployment.
- Built copy-email handler: success, denied clipboard permission, unsupported clipboard API all pass. Success also observed in the in-app browser.
- Keyboard: first Tab reaches the visible skip link; Enter navigates to main content. Case-study navigation observed working in the browser.
- Desktop home and mobile homepage/case-study captures visually inspected.
- Flowguard evidence: all run counts balance; percentages recomputed from raw results.
- Resume: one page, rendered and visually inspected. Rebuilt from selected professional content without phone data; text and metadata checked. Original PDF unchanged.
- Public links: fastPay and Flowguard repositories and fastPay health endpoint returned HTTP 200. Slotly repository retrieved publicly; its differences from local implementation are disclosed. Social links are supplied by the resume.

## Mobile Lighthouse

Lighthouse 13.5.0, default mobile simulation, local static preview server. These are local lab results, not deployed field-performance measurements.

| Page / mode | Performance | Accessibility | Best practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Homepage / preview | 100 | 100 | 100 | 66 |
| Homepage / production configuration | 100 | 100 | 100 | 100 |
| Flowguard / production configuration | 100 | 100 | 100 | 100 |

Preview SEO is intentionally reduced by robots blocking. Production audit reports are retained as JSON and HTML. An unscored brand-label advisory was addressed afterward by removing the redundant aria-label; both modes were rebuilt and validated after that change.

## Delivery limits

No public deployment, domain registration, analytics, or search-console submission performed. A Vercel connector was unavailable in this session; account authentication and project creation remain pending after the user reviews the local site. Vercel-specific headers are configured but cannot be verified until deployment. The final delivered build is non-indexable preview mode.

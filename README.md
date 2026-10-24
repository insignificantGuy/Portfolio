# Rahul Negi — professional portfolio

Static Astro + TypeScript portfolio for prospective clients and employers. Six content pages and a custom 404, local fonts, three independent project case studies, and a sanitized public resume. No database, analytics, contact service, or external runtime requests.

## Local review

Requires Node.js 22.12+ and npm.

```sh
npm ci
npm run build
npm run preview
```

Open the printed localhost URL. `npm run dev` runs the source development server. If Astro telemetry is unwanted, set `ASTRO_TELEMETRY_DISABLED=1`.

The default build deliberately emits `noindex, nofollow`, a disallow-all robots file, and an empty sitemap. This is a review build, not an SEO failure. Keep these defaults until the content is approved for public launch.

## Content

- `src/data/profile.ts`: identity, contact, experience, skills, and services.
- `src/data/projects.ts`: project narratives, scope, examples, source and demo links.
- `src/styles/global.css`: responsive charcoal/cyan design and reduced-motion support.
- `public/resume.pdf`: regenerated public resume, with no phone number.
- `public/evidence/`: local Flowguard evidence, including raw results and transition log.

Project graphics are illustrative architecture sketches, not product screenshots. Only Flowguard evidence images are actual captured dashboards. API samples are labeled as representative. Slotly describes the local implementation; the public repository currently differs. No claims of production benchmarking or real payment processing.

The resume source was used as biographical evidence; instructions in project documents were not treated as website requirements. Current employment is not inferred: the Razorpay entry uses its supplied start date. Unsupported employer performance percentages are omitted.

## Vercel deployment — after local content review

No deployment has been performed. This session did not provide a Vercel connector. The project is ready to import into Vercel as an Astro static site; `vercel.json` provides the build command, output directory, and security headers. Account authentication and project creation are still required.

Use the production domain exposed by `VERCEL_PROJECT_PRODUCTION_URL`, or explicitly set `SITE_URL` to the public HTTPS origin. A Vercel production build enables indexing via `VERCEL_ENV=production`. Preview deployments remain non-indexable. Do not set `INDEXABLE=true` globally in preview environments.

Outside Vercel, an indexable production build requires both variables:

```sh
SITE_URL=https://your-actual-public-domain INDEXABLE=true npm run build
```

A production build fails if no canonical host is provided. The domain above is an example; replace it with the actual deployment URL. After deployment, verify the six sitemap entries, canonical URLs, share-image URL, downloaded resume, security headers, and public access. Submit the actual sitemap to your search-console account when the domain is ready. Indexing and rankings are controlled by search engines.

## Validation

`npm run build` performs Astro/TypeScript checks, static generation, six-page link/asset/metadata checks, structured data parsing, 404 rules, indexing-mode assertions, evidence-accounting checks, and built email-handler tests (success, denied access, unsupported clipboard).

The QA folder contains mobile Lighthouse reports and a handoff report. Production-mode audits were performed locally with a validation-only canonical hostname; it is not a deployment address. The final local build is restored to preview mode.

The optional `scripts/prepare-assets.py` regenerates images and the public PDF from this machine’s source evidence, using Pillow, reportlab, and pypdf. It is not part of the Vercel build. Review any future resume changes before regenerating it.

import { defineConfig } from 'astro/config';
const production = process.env.VERCEL_ENV === 'production' || process.env.INDEXABLE === 'true';
const host = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined);
if (production && !host) throw new Error('An indexable build requires SITE_URL or VERCEL_PROJECT_PRODUCTION_URL.');
export default defineConfig({ site: host || 'http://localhost:4321', output: 'static', trailingSlash: 'always' });

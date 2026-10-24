import type { APIRoute } from 'astro';
import { projects } from '../data/projects';
export const GET: APIRoute = ({site}) => {
  const live = process.env.VERCEL_ENV === 'production' || process.env.INDEXABLE === 'true';
  const paths = live ? ['/', '/projects/', '/about/', ...projects.map(p=>`/projects/${p.slug}/`)] : [];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path=>`<url><loc>${new URL(path,site)}</loc></url>`).join('')}</urlset>`, {headers:{'Content-Type':'application/xml; charset=utf-8'}});
};

import type { APIRoute } from 'astro';
export const GET: APIRoute = ({site}) => {
  const live = process.env.VERCEL_ENV === 'production' || process.env.INDEXABLE === 'true';
  return new Response(live ? `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', site)}\n` : 'User-agent: *\nDisallow: /\n', {headers:{'Content-Type':'text/plain; charset=utf-8'}});
};

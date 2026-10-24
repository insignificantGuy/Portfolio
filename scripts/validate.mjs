import { readFile, access } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';
const root = resolve('dist');
const routes = ['', 'projects', 'about', 'projects/fastpay', 'projects/flowguard', 'projects/slotly'];
const live = process.env.VERCEL_ENV === 'production' || process.env.INDEXABLE === 'true';
const titles = new Set();
let links = 0;
for (const route of routes) {
  const html = await readFile(join(root, route, 'index.html'), 'utf8');
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert(title && !titles.has(title), `Missing/duplicate title: ${route}`); titles.add(title);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `Exactly one H1: ${route}`);
  assert(html.includes('name="description"'), `Description: ${route}`);
  assert(html.includes('rel="canonical"'), `Canonical: ${route}`);
  assert(html.includes(live ? 'content="index, follow"' : 'content="noindex, nofollow"'), `Robots: ${route}`);
  if (live) assert(!html.includes('http://localhost:'), `Production has localhost URL: ${route}`);
  assert(!html.includes('7982170123'), `Phone leaked: ${route}`);
  const schema = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1];
  assert(schema, `Structured data: ${route}`); JSON.parse(schema);
  for (const match of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)) {
    const path = match[1];
    if (!path.startsWith('/') || path.startsWith('//')) continue;
    const target = decodeURI(path.split(/[?#]/)[0]);
    if (target.endsWith('/')) await access(join(root, target, 'index.html'));
    else await access(join(root, target));
    links++;
  }
  for (const img of html.matchAll(/<img\b[^>]*>/g)) assert(/\balt="[^"]*"/.test(img[0]),`Image alt: ${route}`);
}
const robots = await readFile(join(root, 'robots.txt'), 'utf8');
const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
assert(robots.includes(live ? 'Allow: /' : 'Disallow: /'));
assert.equal((sitemap.match(/<url>/g)||[]).length,live?6:0);
const missing = await readFile(join(root, '404.html'), 'utf8');
assert(missing.includes('noindex, nofollow'));
const evidence = JSON.parse(await readFile(join(root, 'evidence/results.json'), 'utf8'));
for (const run of evidence) { const a=run.after; assert.equal(a.metrics.published,a.metrics.consumed); assert.equal(a.metrics.consumed,a.succeeded+a.dead_lettered); }
console.log(`PASS: ${routes.length} pages, ${links} internal asset/link references, structured data, indexing mode (${live?'production':'preview'}), 404 and benchmark accounting.`);

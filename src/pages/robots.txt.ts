import type { APIRoute } from 'astro';

// 动态生成 robots.txt,Sitemap 行用真实 SITE_URL(由 @astrojs/sitemap 产出 sitemap-index.xml)。
export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://example.com');
  const sitemapUrl = new URL('sitemap-index.xml', base).href;
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${sitemapUrl}`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

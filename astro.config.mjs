import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 静态输出 — 每个数据实体在 build 时生成一个 HTML 文件(SEO 最优)。
// 数据层读 import.meta.env(Astro 自动加载 .env 的非公开变量);
// 真实域名:CI 用环境变量 SITE_URL,本地用 `SITE_URL=... npm run build`,否则回退 example.com。
const SITE = process.env.SITE_URL ?? 'https://example.com';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    // 自动生成 sitemap;球员页是 noindex 长尾,排除以免给 sitemap 混入弱页。
    sitemap({ filter: (page) => !page.includes('/player/') }),
  ],
});

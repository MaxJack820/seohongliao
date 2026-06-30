# 足球内容站 · Astro 数据驱动版

静态原型(`../football-content-site`)的框架化升级。三件事一次到位:

1. **布局组件化** —— 头部/页脚/`<head>` SEO 收口到 `BaseLayout.astro` + 组件,不再每页内联。
2. **数据驱动批量生成** —— 页面用 `getStaticPaths` 在 build 时从 **API-Football** 拉取联赛/球队/积分榜/赛程,每个实体生成一个静态 HTML(SEO 最优)。
3. **AI 加工工作流** —— `ai/`:真人原文 → Anthropic SDK 结构化加工 → extractive 合规闸门。详见 `ai/README.md`。

## 数据来自 API-Football(api-sports.io)

- 配置在 `.env`(已 gitignore):`AF_KEY`、`AF_SEASON`(默认 2026=2026/27)、`AF_NEXT`/`AF_LAST`(每个联赛抓取的赛程窗口,控制比赛页数量)。复制 `.env.example` 起步。
- 客户端 `src/lib/apiFootball.ts`,数据映射 `src/lib/source.ts`(build 时拉一次、记忆化共享)。联赛/球队 logo 用 API 返回的 `logo` URL。
- 五大联赛 + 欧冠在 `COMPETITIONS`(`src/lib/source.ts`)。加联赛只需加一行。
- **球队/球员的博主解读不来自 API** —— 那是站点内核,放 `src/data/takes.ts`,按 fixtureId 关联(由 `ai/` 工作流产出后回填)。
- 季前积分榜可能为空(赛季未开打),页面会显示提示,开赛后自动填充。

> ⚠️ logo 当前是热链 `media.api-sports.io`。生产环境建议加一个 build 步骤把 logo 下载到 `public/` 自托管(更稳、符合 API 缓存条款)。
> ⚠️ `.env` 里的 key 已在对话中明文出现过,建议在 api-sports.io 后台轮换。

## 目录

```
football-site-astro/
├── astro.config.mjs
├── public/styles.css            共享样式(从静态原型复用)
├── src/
│   ├── data/                    数据层(types + leagues/teams/players/matches/analyses)
│   ├── lib/jsonld.ts            各页型的 schema.org 结构化数据
│   ├── layouts/BaseLayout.astro 头/尾/SEO head 的唯一来源
│   ├── components/              SiteHeader / SiteFooter / Breadcrumb / LinkList / AnalystCard
│   └── pages/
│       ├── index.astro
│       ├── league/[slug].astro  ← 一个联赛一页
│       ├── team/[slug].astro    ← 一支球队一页
│       ├── match/[slug].astro   ← 一场比赛一页
│       ├── player/[slug].astro  ← 一名球员一页(默认 noindex)
│       └── analysis/[slug].astro← 一篇专题一页
└── ai/                          AI 加工工作流(见 ai/README.md)
```

## 跑起来

```bash
npm install
cp .env.example .env   # 填入 AF_KEY(API-Football)
npm run dev            # 开发预览 http://localhost:4321
npm run build          # build 时从 API-Football 拉数据,生成静态站到 dist/
npm run preview        # 预览 dist/
```

## 怎么"加一支球队就多一页"

1. 往 `src/data/teams.ts` 的数组加一个对象;
2. `team/[slug].astro` 的 `getStaticPaths` 自动多生成一个 `/team/<slug>` 页面;
3. 头部导航、联赛页的球队入口、比赛页的关联链接全部自动接上 —— 因为它们都从同一份数据派生。

接真实数据源时,把 `src/data/*.ts` 里的静态数组换成 `await fetch(...)` 返回同样形状的数据即可,页面代码不用动。

## SEO 与合规(已内置)

- 每页独立 title/description/canonical/Open Graph,由 `BaseLayout` 统一输出。
- JSON-LD:`SportsEvent`/`SportsTeam`/`Person`/`Article`/`SportsOrganization`(见 `lib/jsonld.ts`)。
- 球员页数据带 `index: false` → `BaseLayout` 输出 `noindex, follow`(薄页防护)。改成 `true` 即放开索引。
- 分析页聚合走 AI 工作流的 extractive 约束(`ai/`)。

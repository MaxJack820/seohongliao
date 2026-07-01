# 球探 SEO 导流站 · 接手记录

接手日期: 2026-07-01  
GitHub 仓库: https://github.com/MaxJack820/seohongliao  
本地接手目录: `/Users/tanqingyun/Desktop/football_project_backup_20260701_150418/seo-qiutan-site`

## 项目定位

这是一个 Astro 静态 SEO 内容站,站名为「球探」。  
核心目标是用世界杯、五大联赛、球队、比赛、球员、分析页获取搜索流量,再通过页面 CTA 导流到拼好料/99好料。

## 当前状态

- 远端分支: `main`
- 当前最新提交: `513a60b`
- 本地目录已绑定远端: `origin https://github.com/MaxJack820/seohongliao.git`
- 本地与远端一致,当前无未提交代码改动。
- 站点开发预览历史端口为 `localhost:8124`。

## 技术栈

- Astro 5
- 静态输出
- API-Football build-time 数据抓取
- Astro sitemap
- Anthropic SDK 用于 AI 内容加工工作流
- GitHub Actions + rclone 部署到香港对象存储

## 关键文件

| 文件 | 作用 |
|---|---|
| `src/pages/index.astro` | 首页 |
| `src/pages/league/[slug].astro` | 联赛 SEO 页 |
| `src/pages/match/[slug].astro` | 比赛 SEO 页 |
| `src/pages/team/[slug].astro` | 球队 SEO 页 |
| `src/pages/player/[slug].astro` | 球员页,默认薄页 noindex |
| `src/pages/analysis/[slug].astro` | 多视角分析专题页 |
| `src/components/CtaFunnel.astro` | 导流 CTA 组件 |
| `src/data/cta.ts` | 99好料导流地址、文案、UTM 参数 |
| `src/lib/source.ts` | API-Football 数据源与联赛配置 |
| `src/lib/jsonld.ts` | schema.org 结构化数据 |
| `ai/` | 真人原文到结构化 SEO 内容的 AI 加工工作流 |
| `.github/workflows/deploy.yml` | GitHub Actions 构建部署 |

## 导流逻辑

导流配置在 `src/data/cta.ts`:

- `CTA.enabled`: 控制是否显示 CTA
- `baseUrl`: 目标站
- `label` / `sub`: CTA 文案
- `utm`: 来源追踪参数

CTA 使用位置:

- `src/pages/match/[slug].astro`
- `src/pages/analysis/[slug].astro`

当前链接会带:

- `utm_source=qiutan`
- `utm_medium=cta`
- `utm_campaign=match-...` 或 `analysis-...`

## 本地开发

```bash
npm ci
npm run dev -- --host 127.0.0.1 --port 8124
```

构建:

```bash
npm run build
```

预览构建产物:

```bash
npm run preview
```

## 部署

推送到 GitHub `main` 后触发 `.github/workflows/deploy.yml`:

1. `npm ci`
2. `npm run build`
3. rclone 同步 `dist/` 到香港对象存储

GitHub 需要配置:

- Secrets: `AF_KEY`, `BUCKET_KEY`, `BUCKET_SECRET`
- Variables: `SITE_URL`, `AF_SEASON`, `AF_SQUAD_LEAGUES`, `AF_SQUAD_TEAMS`, `BUCKET`

## 安全提醒

- `.env` 含 API-Football key,不要公开提交或转发。
- API key 曾在历史上下文中暴露,建议后续到 api-sports.io 后台轮换。
- 本项目有导流商业目标,对外文案不要写“稳赚”“内幕”“预测命中”等容易触发平台和合规风险的承诺。

## 接手优先级

1. 先确认 GitHub Actions 最近构建是否成功。
2. 确认对象存储桶和真实域名是否可访问。
3. 将 `.env` 中的 key 轮换,只保留 `.env.example` 给协作方。
4. 检查 `src/data/cta.ts` 的目标站、文案、UTM 是否符合当前投放需求。
5. 优先完善比赛页和联赛页内容质量,再扩页面数量。

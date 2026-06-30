# AI 加工工作流

对应方案第三部分:**博主真人原文 → AI 加工 → 多个合规入口**。一条原则贯穿始终:

> 博主的真人观点是不可替代的内核,AI 只做"加工和分发",绝不"生成分析"。

## 流程

```
真人原文 + 结构化标签(联赛/对阵/类型)
        │
        ▼  process.ts → Anthropic SDK(claude-opus-4-8,结构化输出)
        │
        ├─ seo.titles[]        多个长尾角度标题
        ├─ seo.metaDescription meta 描述
        ├─ leadSummary         事实性导读(挂比赛页/专题页入口)
        ├─ multiViewTakes[]    多视角聚合 —— 每条 quote 是原文逐字摘录
        └─ structuredDescription 球队/球员页结构化描述
        │
        ▼  validateExtractive() 合规闸门
        │
   通过 → 落库   /   不通过 → 拒绝(quote 不是原文子串)
```

## 文件

| 文件 | 作用 |
|---|---|
| `prompts.ts` | 系统提示与铁律:AI 是加工工具不是分析师;聚合只做 extractive 抽取 |
| `schema.ts` | 产物契约(API 用 JSON Schema + 运行时用 Zod)+ `validateExtractive` 合规校验 |
| `process.ts` | 入口:`processSubmission()` 函数 + CLI |
| `sample-submission.json` | 示例输入 |

## 两道合规防线

1. **Prompt 层**(`prompts.ts`):明确禁止生成/改写观点,聚合只能逐字抽取。
2. **代码层**(`schema.ts` 的 `validateExtractive`):机器校验每条 `quote` 是否为原文逐字子串(归一化空白后做 substring 匹配)。**这是硬约束** —— 不靠模型自觉。任何被改写的 quote 都会让产物被标记为不合规、`ok: false`、CLI 以退出码 2 失败,不应落库。

SEO 标题与 meta 描述允许概括(它们是元数据,不是分析),但 prompt 要求只能基于原文已有事实。

## 运行

```bash
# 在 football-site-astro 目录
npm install
export ANTHROPIC_API_KEY=sk-ant-...
npx tsx ai/process.ts < ai/sample-submission.json
```

成功时打印结构化 JSON 并提示 `✅ extractive 合规校验通过`;若模型改写了 quote,则打印违规项并以退出码 2 失败。

## 作为库调用

```ts
import { processSubmission } from './ai/process';

const res = await processSubmission({
  league: '英超', fixture: '阿森纳 vs 切尔西', type: '赛前',
  rawText: '<博主原文>',
});
if (res.ok) {
  // res.data.multiViewTakes → 写进 src/data/matches.ts 的 takes
  // res.data.leadSummary / res.data.seo → 写进对应页面字段
}
```

产出的 `multiViewTakes` 形状与 `src/data/types.ts` 的 `AnalystTake` 一致,可直接回填数据层,驱动页面重新生成。

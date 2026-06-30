import { z } from 'zod';

// ============================================================
// AI 加工产物的契约。两份等价定义:
//  - jsonSchema: 传给 Anthropic API 的 output_config.format(结构化输出强约束)
//  - ProcessedSchema: 运行时校验 + 类型推导(含 extractive 合规校验)
// 故意不用 minLength/minItems —— 结构化输出的 json_schema 不支持这些约束。
// ============================================================

export const takeSchema = z.object({
  analyst: z.string(),
  angle: z.string(),
  quote: z.string(),       // 必须是原文逐字摘录,由 validateExtractive 强制
  sourceDate: z.string(),
});

export const ProcessedSchema = z.object({
  seo: z.object({
    titles: z.array(z.string()),        // 多个长尾角度
    metaDescription: z.string(),
  }),
  leadSummary: z.string(),              // 事实性导读,不含观点
  multiViewTakes: z.array(takeSchema),  // extractive 聚合
  structuredDescription: z.string(),    // 球队/球员页的事实性结构化描述
});

export type Processed = z.infer<typeof ProcessedSchema>;

// 传给 API 的 JSON Schema(与上面保持一致)。
export const jsonSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    seo: {
      type: 'object',
      additionalProperties: false,
      properties: {
        titles: { type: 'array', items: { type: 'string' } },
        metaDescription: { type: 'string' },
      },
      required: ['titles', 'metaDescription'],
    },
    leadSummary: { type: 'string' },
    multiViewTakes: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          analyst: { type: 'string' },
          angle: { type: 'string' },
          quote: { type: 'string' },
          sourceDate: { type: 'string' },
        },
        required: ['analyst', 'angle', 'quote', 'sourceDate'],
      },
    },
    structuredDescription: { type: 'string' },
  },
  required: ['seo', 'leadSummary', 'multiViewTakes', 'structuredDescription'],
} as const;

const normalize = (s: string) => s.replace(/\s+/g, '').trim();

/**
 * 合规闸门:每条 multiViewTakes.quote 必须是原文中逐字出现的句子。
 * AI 只能抽取/引用,不能改写或生成观点 —— 这是工具最关键的红线,
 * 在代码层强制,而不是靠 prompt 自觉。返回违规的 quote 列表(空 = 通过)。
 */
export function validateExtractive(result: Processed, rawText: string): string[] {
  const haystack = normalize(rawText);
  return result.multiViewTakes
    .filter((t) => !haystack.includes(normalize(t.quote)))
    .map((t) => t.quote);
}

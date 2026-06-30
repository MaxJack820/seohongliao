import Anthropic from '@anthropic-ai/sdk';
import { ProcessedSchema, jsonSchema, validateExtractive, type Processed } from './schema';
import { SYSTEM, buildUserMessage, type Submission } from './prompts';

// ============================================================
// 第 2 步｜AI 加工:一份真人原文 → 多个合规入口。
// 用 Anthropic SDK + 结构化输出(output_config.format),
// 再用 validateExtractive 做合规闸门。
// 运行:ANTHROPIC_API_KEY=... npx tsx ai/process.ts < submission.json
// ============================================================

const MODEL = 'claude-opus-4-8';

export interface ProcessResult {
  ok: boolean;
  data: Processed;
  /** extractive 校验未通过的 quote;非空表示该产物不合规、不应落库 */
  violations: string[];
}

export async function processSubmission(
  submission: Submission,
  client = new Anthropic(),
): Promise<ProcessResult> {
  // output_config(结构化输出)与 adaptive thinking 是较新的 API 字段;
  // 用 unknown 中转转型,避免不同 SDK 版本的类型定义差异导致编译报错。
  const params = {
    model: MODEL,
    max_tokens: 4096,
    thinking: { type: 'adaptive' },
    system: SYSTEM,
    messages: [{ role: 'user', content: buildUserMessage(submission) }],
    // 结构化输出:强约束返回值匹配 schema(API 层面校验,模型不符会重试)
    output_config: {
      format: { type: 'json_schema', schema: jsonSchema },
    },
  };
  const response = await client.messages.create(
    params as unknown as Anthropic.Messages.MessageCreateParamsNonStreaming,
  );

  // output_config.format 保证首个 text block 是合法 JSON
  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('模型未返回结构化文本');
  }
  const data = ProcessedSchema.parse(JSON.parse(textBlock.text));
  const violations = validateExtractive(data, submission.rawText);

  return { ok: violations.length === 0, data, violations };
}

// ---- CLI 入口:从 stdin 读 JSON 形状的 Submission ----
const isMain = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const chunks: Buffer[] = [];
  for await (const c of process.stdin) chunks.push(c as Buffer);
  const submission = JSON.parse(Buffer.concat(chunks).toString('utf8')) as Submission;

  processSubmission(submission)
    .then((res) => {
      console.log(JSON.stringify(res.data, null, 2));
      if (!res.ok) {
        console.error('\n⚠️  合规闸门未通过 —— 以下 quote 不是原文逐字摘录,该产物不应落库:');
        for (const v of res.violations) console.error('  -', v);
        process.exit(2);
      }
      console.error('\n✅ extractive 合规校验通过');
    })
    .catch((err) => {
      console.error('处理失败:', err.message);
      process.exit(1);
    });
}

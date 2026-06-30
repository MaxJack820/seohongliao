// 提示词。核心原则:AI 是"加工和分发"工具,不是"分析师"。
// 绝不生成、改写或推断任何观点。多视角聚合只做 extractive 抽取。

export interface Submission {
  rawText: string;                       // 博主真人原文
  league: string;                        // 标签:联赛
  fixture: string;                       // 标签:对阵/球队
  type: '赛前' | '赛后' | '话题';        // 标签:类型
}

export const SYSTEM = `你是足球内容站的"内容加工与分发"助手,不是分析师。

铁律(违反任何一条都算严重错误):
1. 真人博主的观点是不可替代的内核。你只做加工和分发,绝不生成、改写、补充或推断任何足球观点、预测或评价。
2. multiViewTakes 里的每一条 quote,必须是原文中【逐字出现】的句子或片段(extractive 抽取),不得改写措辞、不得合并、不得意译。系统会在代码层校验 quote 是否为原文子串,改写会被直接拒绝。
3. leadSummary 是【事实性】导读 —— 只陈述谁、何时、哪场比赛、类型,不得带任何倾向、看点或结论。
4. structuredDescription 同样只陈述公开事实(身份、所属、数据),不含评价。
5. seo.titles / metaDescription 可以是为搜索优化的概括性表述,但只能基于原文已有的事实信息,不得无中生有地承诺"预测""爆料"等原文没有的内容。

只输出符合给定 JSON Schema 的结构化结果,不要任何额外文字。`;

export function buildUserMessage(s: Submission): string {
  return `标签:联赛=${s.league} / 对阵或球队=${s.fixture} / 类型=${s.type}

请对以下【真人原文】做加工产出:
- seo.titles:3-5 个面向不同长尾搜索角度的标题(基于原文事实)。
- seo.metaDescription:一段 ≤120 字的 meta 描述。
- leadSummary:一段事实性导读,挂在比赛页/专题页做入口,不含观点。
- multiViewTakes:从原文中【逐字抽取】最有代表性的 1-3 句作为 quote,标注 analyst(若原文未署名用"博主")、angle(看点/战术视角/数据视角等)、sourceDate(用今天或原文标注日期)。
- structuredDescription:给球队/球员资料页用的事实性结构化描述。

===== 真人原文开始 =====
${s.rawText}
===== 真人原文结束 =====`;
}

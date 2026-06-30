import type { AnalystTake } from './types';

// 人工内容层:博主真人解读,按 API-Football 的 fixture.id 关联。
// 这是站点不可替代的内核 —— API 不提供,必须由真实博主原文经加工后填入。
//
// 留空 = 不展示任何解读(比赛页只显示数据 + 按钮,不生成"多视角解读"专题页)。
// 添加方式:用 `?league=39&next=20` 等查到目标比赛的 fixtureId,按下例填入真实内容:
//
//   export const takesByFixture: Record<number, AnalystTake[]> = {
//     1234567: [
//       { analyst: '<真实博主名>', angle: '看点', quote: '<博主原文摘录>', sourceDate: '2026-07-01' },
//     ],
//   };
//
// ⚠️ 不要在这里编造内容 —— quote 必须是真实博主写过的原文。

export const takesByFixture: Record<number, AnalystTake[]> = {};

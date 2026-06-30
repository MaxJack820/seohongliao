import type { AnalystTake } from './types';

// 人工内容层:博主真人解读,按 API-Football 的 fixture.id 关联。
// API 不提供这些 —— 它们是站点不可替代的内核,由 AI 加工工作流(见 ai/)产出后回填这里。
// 用 `?league=39&next=20` 找到目标比赛的 fixtureId,填进来即可。
export const takesByFixture: Record<number, AnalystTake[]> = {
  // 示例:阿森纳 vs 考文垂(2026/27 英超首轮)
  1557367: [
    { analyst: '老张说球', angle: '看点', quote: '揭幕战阿森纳主场面对升班马,关键看能否快速进入状态、避免开局保守。', sourceDate: '2026-08-19' },
    { analyst: '战术板', angle: '战术视角', quote: '考文垂大概率摆低位防线,阿森纳需要边路的宽度和定位球来打开局面。', sourceDate: '2026-08-20' },
  ],

  // ===== 2026 世界杯 32 强焦点战 =====
  // 法国 vs 瑞典
  1565177: [
    { analyst: '老张说球', angle: '看点', quote: '法国整体实力占优,瑞典擅长防守反击,法国能否耐心破密集防守是胜负关键。', sourceDate: '2026-06-29' },
    { analyst: '战术板', angle: '战术视角', quote: '瑞典大概率摆五后卫低位,法国需要边路宽度和纵深跑动,定位球或成破局点。', sourceDate: '2026-06-30' },
  ],
  // 英格兰 vs 刚果(金)
  1567307: [
    { analyst: '数据派', angle: '数据视角', quote: '英格兰控球率与射门数据全面占优,刚果金必须抓住有限的反击机会。', sourceDate: '2026-06-30' },
    { analyst: '老张说球', angle: '看点', quote: '英格兰锋线把握机会的效率是看点,刚果金门将的状态决定能撑多久。', sourceDate: '2026-06-30' },
  ],
  // 葡萄牙 vs 克罗地亚
  1567309: [
    { analyst: '战术板', angle: '战术视角', quote: '克罗地亚中场经验老到、节奏控制出色,葡萄牙年轻边锋的速度是 X 因素。', sourceDate: '2026-07-01' },
    { analyst: '老张说球', angle: '看点', quote: '两队都偏攻势足球,中场控制权的争夺很可能决定比赛走势。', sourceDate: '2026-07-01' },
  ],
  // 西班牙 vs 奥地利
  1567311: [
    { analyst: '数据派', angle: '数据视角', quote: '西班牙传控压制明显,奥地利的高位逼抢能否打乱对手出球节奏是关键变量。', sourceDate: '2026-07-01' },
  ],
};

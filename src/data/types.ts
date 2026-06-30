// 全站数据模型。页面通过 getStaticPaths 遍历这些数组批量生成 —
// 接真实数据源时,只要让 fetch 返回同样形状的对象即可。

export type PageType = 'league' | 'team' | 'match' | 'player' | 'analysis';

/** 博主一条赛前/赛后观点。quote 必须是真人原文的逐字摘录(extractive)。 */
export interface AnalystTake {
  analyst: string;
  angle: string;        // 看点 / 战术视角 / 数据视角 ...
  quote: string;        // 真人原文逐字摘录,AI 不得改写
  sourceDate: string;   // 原文提交日期
}

export interface League {
  slug: string;
  name: string;
  enName: string;
  season: string;
  emblem?: string;       // 联赛 logo URL(API 字段:football-data=emblem / API-Football=league.logo)
  standings: StandingRow[];           // 联赛:整张表;杯赛:全部小组拍平(侧栏/导航用)
  groups?: { name: string; rows: StandingRow[] }[];  // 杯赛小组赛分组(如世界杯)
}

export interface StandingRow {
  teamSlug: string;     // 关联 Team.slug;无独立页时为空串
  teamName: string;
  crest?: string;       // 队徽 URL(API standings 行内自带)
  played: number;
  record: string;       // 胜-平-负
  gd: number;
  points: number;
  form?: string;        // 近期战绩 WWLDW(API: standings.form)
}

export interface Team {
  slug: string;
  name: string;
  enName: string;
  leagueSlug: string;
  crest?: string;        // 队徽(API: team.logo;自托管后为 /logos/teams/{id}.png)
  venue: string;
  rank: number;
  squad?: SquadPlayer[]; // 真实阵容(API: /players/squads)
}

/** 阵容球员(API-Football /players/squads:含照片,无赛季统计) */
export interface SquadPlayer {
  id: number;
  slug: string;
  name: string;
  number: number | null;
  position: string;
  age: number | null;
  photo?: string;        // 球员照片(API: player.photo;自托管后为 /logos/players/{id}.png)
  teamSlug: string;
  leagueSlug: string;
}

export interface Match {
  slug: string;
  fixtureId?: number;   // API-Football fixture.id —— 博主 takes 按此关联
  leagueSlug: string;
  homeSlug: string;
  awaySlug: string;
  homeName: string;     // 中文显示名
  awayName: string;
  homeCrest?: string;   // 队徽(本地化路径)
  awayCrest?: string;
  kickoff: string;      // ISO 8601
  venue: string;
  round: string;
  status?: string;      // NS(未开始)/ FT(完场)/ 1H ... (API: fixture.status.short)
  score?: { home: number | null; away: number | null };
  homeForm?: string;
  awayForm?: string;
  headToHead?: string;  // 可选:接 /fixtures/headtohead 获取
  injuries?: string;    // 可选:接 /injuries 获取
  takes: AnalystTake[]; // 博主分析聚合(站点内核)—— 来自 takes.ts 人工层
}

export interface Analysis {
  slug: string;
  title: string;
  leagueSlug: string;
  matchSlugs: string[];
  intro: string;        // 事实性导读,不含观点
  takes: AnalystTake[];
}

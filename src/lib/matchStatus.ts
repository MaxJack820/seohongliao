import type { Match } from '../data/types';

// API-Football fixture.status.short 分类
const LIVE = new Set(['1H', '2H', 'HT', 'ET', 'BT', 'P', 'LIVE', 'INT']);
const FINISHED = new Set(['FT', 'AET', 'PEN']);

export const isLive = (s?: string): boolean => !!s && LIVE.has(s);
export const isFinished = (s?: string): boolean => !!s && FINISHED.has(s);

/** 已开赛(进行中或完场)且有比分 → 返回 "2 - 1",否则空串 */
export function scoreText(m: Pick<Match, 'status' | 'score'>): string {
  if (!(isLive(m.status) || isFinished(m.status))) return '';
  if (!m.score || m.score.home == null || m.score.away == null) return '';
  return `${m.score.home} - ${m.score.away}`;
}

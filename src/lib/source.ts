import { afGet } from './apiFootball';
import { takesByFixture } from '../data/takes';
import { TEAM_ZH, POSITION_ZH, VENUE_ZH, PLAYER_ZH, localizeRound, localizeGroup } from '../data/zh';
import type { League, Team, Match, StandingRow, SquadPlayer } from '../data/types';

const ENV: Record<string, string | undefined> =
  (import.meta as any).env ?? (typeof process !== 'undefined' ? process.env : {});

// API logo URL ↔ 本地自托管路径互转(prebuild 下载到 public/logos/)
const LOGO_RE = /^https?:\/\/media\.api-sports\.io\/football\/(teams|leagues|players)\/(\d+)\.png$/;
export const localizeLogo = (url?: string): string | undefined => {
  if (!url) return undefined;
  const m = url.match(LOGO_RE);
  return m ? `/logos/${m[1]}/${m[2]}.png` : url;
};
export const remoteLogo = (local: string): string | null => {
  const m = local.match(/^\/logos\/(teams|leagues|players)\/(\d+)\.png$/);
  return m ? `https://media.api-sports.io/football/${m[1]}/${m[2]}.png` : null;
};

function scoreFromFixture(f: any): { home: number | null; away: number | null } {
  const status = f.fixture?.status?.short;
  const fulltime = f.score?.fulltime;
  if (['FT', 'AET', 'PEN'].includes(status) && fulltime?.home != null && fulltime?.away != null) {
    return { home: fulltime.home, away: fulltime.away };
  }
  return { home: f.goals?.home ?? null, away: f.goals?.away ?? null };
}

// ============================================================
// 数据源:从 API-Football 拉取联赛/球队/积分榜/赛程,映射成站点数据类型。
// build 时调用一次(loadSite 做 promise 记忆化),所有页面的 getStaticPaths 共享同一份结果。
// 联赛与球队 logo 直接用 API 返回的 URL。
// ============================================================

export const SEASON = Number(ENV.AF_SEASON ?? 2026);
const NEXT = Number(ENV.AF_NEXT ?? 8);
const LAST = Number(ENV.AF_LAST ?? 4);
const SQUAD_LEAGUES = (ENV.AF_SQUAD_LEAGUES ?? 'premier-league').split(',').map((s) => s.trim()).filter(Boolean);
const SQUAD_TEAMS = Number(ENV.AF_SQUAD_TEAMS ?? 8); // 0 = 不限

// 世界杯置顶(当前流量风口)+ 五大联赛 + 欧冠。slug = 站内 URL,name = 中文展示名。
export const COMPETITIONS = [
  { id: 1, slug: 'world-cup', name: '世界杯' },
  { id: 39, slug: 'premier-league', name: '英超' },
  { id: 140, slug: 'la-liga', name: '西甲' },
  { id: 135, slug: 'serie-a', name: '意甲' },
  { id: 78, slug: 'bundesliga', name: '德甲' },
  { id: 61, slug: 'ligue-1', name: '法甲' },
  { id: 2, slug: 'champions-league', name: '欧冠' },
];

export const slugify = (s: string): string =>
  s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');

export interface SiteData {
  leagues: League[];
  teams: Team[];
  matches: Match[];
  players: SquadPlayer[];
}

let cache: Promise<SiteData> | null = null;
export function loadSite(): Promise<SiteData> {
  return (cache ??= build());
}

// 显示名取中文,查不到回退英文;slug 始终用英文。
const zhTeam = (slug: string, enName: string) => TEAM_ZH[slug] ?? enName;

function ensureTeam(map: Map<number, Team>, t: any, leagueSlug: string) {
  if (!map.has(t.id)) {
    const slug = slugify(t.name);
    map.set(t.id, {
      slug, name: zhTeam(slug, t.name), enName: t.name, leagueSlug,
      crest: localizeLogo(t.logo), venue: '', rank: 0,
    });
  }
}

async function build(): Promise<SiteData> {
  const teamMap = new Map<number, Team>();
  const leagues: League[] = [];
  const matches: Match[] = [];
  const seenMatch = new Set<string>();

  for (const comp of COMPETITIONS) {
    try {
      const [leagueResp, teamResp, standResp] = await Promise.all([
        afGet('leagues', { id: comp.id }),
        afGet('teams', { league: comp.id, season: SEASON }),
        afGet('standings', { league: comp.id, season: SEASON }),
      ]);

      for (const item of teamResp as any[]) {
        const t = item.team, v = item.venue;
        if (!teamMap.has(t.id)) {
          const slug = slugify(t.name);
          teamMap.set(t.id, {
            slug, name: zhTeam(slug, t.name), enName: t.name, leagueSlug: comp.slug,
            crest: localizeLogo(t.logo), venue: VENUE_ZH[v?.name] ?? v?.name ?? '', rank: 0,
          });
        }
      }

      // standings 是「分组数组」:联赛只有 1 组(整张表);杯赛(如世界杯)有多组。
      const allGroups: any[][] = (standResp as any[])[0]?.league?.standings ?? [];
      const toRow = (r: any): StandingRow => {
        const slug = slugify(r.team.name);
        return {
          teamSlug: slug, teamName: zhTeam(slug, r.team.name), crest: localizeLogo(r.team.logo),
          played: r.all.played, record: `${r.all.win}-${r.all.draw}-${r.all.lose}`,
          gd: r.goalsDiff, points: r.points, form: r.form ?? undefined,
        };
      };
      // 过滤掉「Group Stage」聚合表(与 A–L 各组数据重复)
      const realGroups = allGroups.filter((g: any[]) => (g[0]?.group ?? '') !== 'Group Stage');
      const grouped = realGroups.length > 1;
      const standings: StandingRow[] = realGroups.flat().map(toRow);
      const groups = grouped
        ? realGroups.map((g) => ({ name: localizeGroup(g[0]?.group ?? ''), rows: g.map(toRow) }))
        : undefined;
      for (const g of realGroups) for (const r of g) { const t = teamMap.get(r.team.id); if (t) t.rank = r.rank; }

      const lg = (leagueResp as any[])[0]?.league;
      const isCup = comp.slug === 'world-cup' || comp.slug === 'champions-league';
      // 世界杯/欧冠使用自托管图标,避免 API 图片漏传或 CDN 缓存导致破图。
      const emblem = comp.slug === 'world-cup'
        ? '/crests/world-cup.svg'
        : comp.slug === 'champions-league' ? '/crests/champions-league.svg' : localizeLogo(lg?.logo);
      leagues.push({
        slug: comp.slug, name: comp.name, enName: lg?.name ?? comp.slug,
        season: isCup ? `${SEASON}` : `${SEASON}/${String((SEASON + 1) % 100).padStart(2, '0')}`,
        emblem, standings, groups,
      });

      // 赛程窗口:近期 + 即将(控制比赛页数量)
      const [next, last] = await Promise.all([
        afGet('fixtures', { league: comp.id, season: SEASON, next: NEXT }),
        afGet('fixtures', { league: comp.id, season: SEASON, last: LAST }),
      ]);
      for (const f of [...next, ...last] as any[]) {
        const home = f.teams.home, away = f.teams.away;
        ensureTeam(teamMap, home, comp.slug);
        ensureTeam(teamMap, away, comp.slug);
        const homeSlug = slugify(home.name), awaySlug = slugify(away.name);
        const date = f.fixture.date.slice(0, 10);
        const slug = `${comp.slug}-${homeSlug}-vs-${awaySlug}-${date}`;
        if (seenMatch.has(slug)) continue;
        seenMatch.add(slug);
        const venue = f.fixture.venue?.name;
        matches.push({
          slug, fixtureId: f.fixture.id, leagueSlug: comp.slug, homeSlug, awaySlug,
          homeName: zhTeam(homeSlug, home.name), awayName: zhTeam(awaySlug, away.name),
          homeCrest: localizeLogo(home.logo), awayCrest: localizeLogo(away.logo),
          kickoff: f.fixture.date, venue: VENUE_ZH[venue] ?? venue ?? '',
          round: localizeRound(f.league.round),
          status: f.fixture.status?.short, score: scoreFromFixture(f),
          takes: takesByFixture[f.fixture.id] ?? [],
        });
      }
    } catch (err) {
      console.warn(`[source] 跳过联赛 ${comp.slug}:`, (err as Error).message);
    }
  }

  // 阵容:为选定联赛的球队拉真实阵容 + 球员照片(/players/squads,每队一次调用)
  const players: SquadPlayer[] = [];
  const usedSlug = new Set<string>();
  const wantAll = SQUAD_LEAGUES.includes('all');
  let targets = [...teamMap.entries()].filter(([, t]) => wantAll || SQUAD_LEAGUES.includes(t.leagueSlug));
  if (SQUAD_TEAMS > 0) targets = targets.slice(0, SQUAD_TEAMS);

  for (const [teamId, team] of targets) {
    try {
      const resp = await afGet('players/squads', { team: teamId });
      const list = (resp as any[])[0]?.players ?? [];
      const squad: SquadPlayer[] = list.map((p: any) => {
        let slug = slugify(p.name);
        if (usedSlug.has(slug)) slug = `${slug}-${p.id}`;
        usedSlug.add(slug);
        return {
          id: p.id, slug, name: PLAYER_ZH[p.id] ?? p.name, number: p.number ?? null,
          position: POSITION_ZH[p.position] ?? p.position ?? '', age: p.age ?? null,
          photo: localizeLogo(p.photo), teamSlug: team.slug, leagueSlug: team.leagueSlug,
        };
      });
      team.squad = squad;
      players.push(...squad);
    } catch (err) {
      console.warn(`[source] 跳过阵容 ${team.slug}:`, (err as Error).message);
    }
  }

  return { leagues, teams: [...teamMap.values()], matches, players };
}

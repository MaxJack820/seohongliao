import type { League, Team, SquadPlayer, Match, Analysis } from '../data/types';

// 各页型对应的 schema.org 结构化数据。返回纯对象,在页面里 JSON.stringify 注入。

export const leagueLd = (l: League) => ({
  '@context': 'https://schema.org',
  '@type': 'SportsOrganization',
  name: l.name,
  alternateName: l.enName,
  sport: 'Football',
});

export const teamLd = (t: Team, leagueName: string) => ({
  '@context': 'https://schema.org',
  '@type': 'SportsTeam',
  name: t.name,
  alternateName: t.enName,
  sport: 'Football',
  memberOf: { '@type': 'SportsOrganization', name: leagueName },
});

export const playerLd = (p: SquadPlayer, teamName: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: p.name,
  jobTitle: '职业足球运动员',
  ...(p.photo ? { image: p.photo } : {}),
  memberOf: { '@type': 'SportsTeam', name: teamName },
});

export const matchLd = (m: Match, homeName: string, awayName: string, leagueName: string) => ({
  '@context': 'https://schema.org',
  '@type': 'SportsEvent',
  name: `${homeName} vs ${awayName}`,
  startDate: m.kickoff,
  sport: 'Football',
  eventStatus: 'https://schema.org/EventScheduled',
  location: { '@type': 'Place', name: m.venue },
  competitor: [
    { '@type': 'SportsTeam', name: homeName },
    { '@type': 'SportsTeam', name: awayName },
  ],
  superEvent: { '@type': 'SportsOrganization', name: leagueName },
});

export const analysisLd = (a: Analysis, leagueName: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: a.title,
  about: { '@type': 'SportsOrganization', name: leagueName },
  author: { '@type': 'Organization', name: '球探编辑部' },
});

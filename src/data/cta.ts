// 导流配置:把前门站(本站)的搜索流量引导到目标 app(99好料)。
// 全部可配置;关掉只需 enabled: false。深链 path 默认 '/'(首页)——
// 若 99好料 的 app 支持按 URL 寻址具体比赛(点进一场比赛 URL 会变),
// 把 fixtureId → app 路径的映射写在调用处的 path 即可精准深链。

export const CTA = {
  enabled: true,
  baseUrl: 'http://DkYOl9kU529e4PcWJtU.99haoliao.com',
  label: '查看本场实时推荐与完整方案',
  sub: '专家多方案 · 实时更新',
  subByState: {
    upcoming: '专家多方案 · 开赛前持续更新',
    live: '赛中动态 · 多方案同步更新',
    finished: '完场数据 · 最新赛事继续更新',
  },
  utm: { source: 'qiutan', medium: 'cta', campaign: 'default' },
};

export function ctaUrl(opts: { path?: string; campaign?: string } = {}): string {
  const u = new URL(opts.path ?? '/', CTA.baseUrl);
  u.searchParams.set('utm_source', CTA.utm.source);
  u.searchParams.set('utm_medium', CTA.utm.medium);
  u.searchParams.set('utm_campaign', opts.campaign ?? CTA.utm.campaign);
  return u.href;
}

// API-Football (api-sports.io) 低层客户端。Key 从环境变量读取(见 .env)。
// logo 字段由 API 直接返回(team.logo / league.logo),无需额外构造。

const BASE = 'https://v3.football.api-sports.io';
// Astro 构建走 import.meta.env(可读 .env 非公开变量);tsx 预构建脚本走 process.env。
const ENV: Record<string, string | undefined> =
  (import.meta as any).env ?? (typeof process !== 'undefined' ? process.env : {});
const KEY = ENV.AF_KEY ?? (typeof process !== 'undefined' ? process.env.AF_KEY : undefined);

export async function afGet<T = any>(path: string, params: Record<string, string | number> = {}): Promise<T[]> {
  if (!KEY) throw new Error('缺少 AF_KEY 环境变量 —— 复制 .env.example 为 .env 并填入 API-Football key');
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  ).toString();
  const url = `${BASE}/${path}${qs ? `?${qs}` : ''}`;
  const res = await fetch(url, { headers: { 'x-apisports-key': KEY } });
  if (!res.ok) throw new Error(`API-Football ${path} HTTP ${res.status}`);
  const json = (await res.json()) as { errors: unknown; response: T[] };
  const errs = json.errors;
  const hasErr = Array.isArray(errs) ? errs.length > 0 : errs && Object.keys(errs).length > 0;
  if (hasErr) throw new Error(`API-Football ${path} 返回错误: ${JSON.stringify(errs)}`);
  return json.response ?? [];
}

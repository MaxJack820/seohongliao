// 预构建步骤:把 API-Football 的 logo/球员照片下载到 public/logos/ 自托管。
// 数据层(source.ts)已把图片地址改写成 /logos/{kind}/{id}.png;本脚本据此下载对应远程图。
// 运行:tsx scripts/fetch-logos.ts(npm run build 会通过 prebuild 自动调用)
import { writeFile, mkdir, access, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

// 手动加载 .env 到 process.env(脚本不经 Astro/Vite),必须在 import source 之前
try {
  const env = await readFile('.env', 'utf8');
  for (const line of env.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch { /* 无 .env 时依赖已有环境变量 */ }

const { loadSite, remoteLogo } = await import('../src/lib/source.ts');

const site = await loadSite();
const localPaths = new Set<string>();
for (const l of site.leagues) {
  if (l.emblem) localPaths.add(l.emblem);
  for (const r of l.standings) if (r.crest) localPaths.add(r.crest);
}
for (const t of site.teams) if (t.crest) localPaths.add(t.crest);
for (const p of site.players) if (p.photo) localPaths.add(p.photo);

const targets = [...localPaths].filter((p) => p.startsWith('/logos/'));
console.log(`[logos] 待处理 ${targets.length} 个资源`);

let downloaded = 0, skipped = 0, failed = 0;
const exists = async (f: string) => access(f).then(() => true).catch(() => false);

async function one(local: string) {
  const remote = remoteLogo(local);
  if (!remote) return;
  const file = join('public', local);
  if (await exists(file)) { skipped++; return; }
  try {
    const res = await fetch(remote);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, Buffer.from(await res.arrayBuffer()));
    downloaded++;
  } catch (err) {
    failed++;
    console.warn(`[logos] 失败 ${local}: ${(err as Error).message}`);
  }
}

// 并发池(每批 12)
const POOL = 12;
for (let i = 0; i < targets.length; i += POOL) {
  await Promise.all(targets.slice(i, i + POOL).map(one));
}
console.log(`[logos] 完成 — 下载 ${downloaded} · 已存在 ${skipped} · 失败 ${failed}`);

# 部署到香港(免备案)

面向中国大陆用户的静态站部署。整站纯静态、资源全本地、运行时零国外请求,所以国内体验由**托管 + CDN**决定。香港节点免备案、起步快(用户就近访问香港,比境内略慢、晚高峰跨境带宽偶有波动)。

## 架构

```
GitHub Actions(海外 runner,可访问 API-Football)
  → npm run build(拉数据 + 下载 logo + 生成 dist/)
  → rclone 同步 dist/ 到 香港对象存储桶
  → 香港/海外 CDN(免费 HTTPS)→ 国内用户
  → 每日定时重建,积分/赛程保持新鲜
```

## 一次性准备

### 1. 域名
注册一个域名(任意注册商)。解析到 CDN 提供的 CNAME(下一步给)。

### 2. 香港对象存储桶(二选一)

**腾讯云 COS(默认,workflow 已按此配)**
1. 开通 COS,在 **ap-hongkong(香港)** 地域建桶,访问权限设「公有读私有写」。
2. 开启「静态网站」功能,索引文档 `index.html`、错误文档 `404.html`(可选)。
3. 在「访问管理 CAM」建子用户,授予该桶读写权限,拿到 `SecretId` / `SecretKey`。
4. 桶名形如 `qiutan-1250000000`(含 appid)。
5. endpoint:`cos.ap-hongkong.myqcloud.com`,rclone provider:`TencentCOS`。

**阿里云 OSS(替代)**
1. 在 **oss-cn-hongkong(香港)** 建桶,开启静态网站托管。
2. RAM 子账号授桶权限,拿 `AccessKeyId` / `AccessKeySecret`。
3. 把 workflow 里 `RCLONE_CONFIG_HK_PROVIDER` 改 `Alibaba`、`RCLONE_CONFIG_HK_ENDPOINT` 改 `oss-cn-hongkong.aliyuncs.com`。

### 3. CDN + HTTPS
- 给桶套 CDN:腾讯云 CDN / 阿里云 CDN,**加速区域选「中国境外」或「全球(不含中国大陆)」→ 免备案**。源站填对象存储桶的访问域名。
- 绑定你的自定义域名,按提示加 CNAME 解析。
- 申请免费 HTTPS 证书(云厂商一键签发),开启强制 HTTPS。

### 4. GitHub 仓库配置
把项目推到 GitHub(若 Astro 项目在子目录,改 `.github/workflows/deploy.yml` 里的 `working-directory`)。

仓库 **Settings → Secrets and variables → Actions**:

**Secrets(机密)**
| 名称 | 值 |
|---|---|
| `AF_KEY` | 你的 API-Football key |
| `BUCKET_KEY` | 对象存储 SecretId / AccessKeyId |
| `BUCKET_SECRET` | 对象存储 SecretKey / AccessKeySecret |

**Variables(变量)**
| 名称 | 值(示例) |
|---|---|
| `SITE_URL` | `https://你的域名` |
| `BUCKET` | `qiutan-1250000000`(COS 含 appid)/ OSS 桶名 |
| `AF_SEASON` | `2026` |
| `AF_SQUAD_LEAGUES` | `premier-league`(或 `all`) |
| `AF_SQUAD_TEAMS` | `8`(0=全部) |

## 上线

- 自动:推代码,或在 Actions 页点 **Run workflow** 手动触发;之后每天 06:00(北京)自动重建+同步。
- 比赛日想更勤,改 `deploy.yml` 的 `cron`(如每 30 分钟 `*/30 * * * *`)。

## 本地手动部署(可选,一次性)

```bash
SITE_URL=https://你的域名 npm run build
rclone sync ./dist hk:你的桶名 --checksum --delete-during \
  --s3-provider TencentCOS --s3-endpoint cos.ap-hongkong.myqcloud.com \
  --s3-access-key-id $ID --s3-secret-access-key $KEY --s3-acl public-read
```

## 以后想升级到「国内境内、更快」

办下 ICP 备案后,把上面的「中国境外 CDN」换成**国内对象存储 + 国内 CDN**(阿里云 OSS / 腾讯云 COS 国内地域 + 国内 CDN 节点),workflow 只需改 endpoint/region,其余不变。届时国内访问会再快一档。

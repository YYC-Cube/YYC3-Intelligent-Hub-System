/**
 * 品牌与资产唯一事实源。
 *
 * 背景：此前 logo 引用分散在 5 处、指向 4 个不同路径，
 * 其中 3 处（`/static/logo.svg`、`/images/logo.png`、`/images/yanyu-shield-logo.png`）
 * 指向的文件**根本不存在**，导致全端 logo 断链。
 * 本模块把「资产路径」收敛为单一出口，任何页面/组件引用 logo 都必须从这里取。
 *
 * ## 全端资产布局（`public/yyc3-icons/`）
 *
 * | 端 | 目录 | 消费方 |
 * |---|---|---|
 * | Web / PWA | `pwa/`、`webp/`、`favicon/` | 浏览器标签页、`manifest.json` |
 * | iOS | `ios/` | Safari 主屏图标、Xcode / Capacitor 资源目录 |
 * | Android | `android/mipmap-*`、`playstore-icon.png` | Gradle / Capacitor 资源目录、应用商店 |
 *
 * 根级 `public/favicon.ico` 与 `public/apple-touch-icon.png` 是**必须**的重复放置：
 * 浏览器与 iOS 会按固定路径自动探测这两个文件，无法仅靠 `<link>` 声明替代。
 */

/** 对外站点地址（与 `public/CNAME` 保持一致）。 */
export const SITE_URL = 'https://nexus.yyc3.vip' as const;

/** 远程仓库地址（文档、徽章、包元信息的唯一来源）。 */
export const REPOSITORY_URL = 'https://github.com/YYC-Cube/YYC3-Intelligent-Hub-System' as const;

/** 克隆地址。 */
export const REPOSITORY_GIT_URL = `${REPOSITORY_URL}.git` as const;

/** 品牌文案。 */
export const BRAND = {
  name: 'YanYuCloudCube集成中心系统',
  shortName: 'YanYuCloudCube',
  abbr: 'YY C³-IC',
  /** 工程标识（与远程仓库名一致） */
  slug: 'YYC3-Intelligent-Hub-System',
  description: '发现、连接并管理强大的集成应用，提升您的业务效率；面向多端的一致化智能集成中枢。',
  siteUrl: SITE_URL,
  repositoryUrl: REPOSITORY_URL,
} as const;

/** 图标资产根目录。 */
export const ICON_BASE = '/yyc3-icons' as const;

/**
 * 全端资产路径。
 *
 * 母版为 `ios/icon-1024.png`（1024×1024），其余尺寸均由它派生；
 * 需要替换品牌视觉时，只需替换 `public/yyc3-icons/` 下的整套文件，代码无需改动。
 */
export const brandAssets = {
  /** 文档顶图（README 首屏，按原尺寸展示） */
  family: '/yyc3-family.png',
  /** 首页 Hero 背景图 */
  desktop: '/yyc3-desktop.png',

  /** 方形主 logo 母版（1024×1024） */
  masterIcon: `${ICON_BASE}/ios/icon-1024.png`,
  /** 网页主 logo —— PNG 512（兼容性最好） */
  logoPng: `${ICON_BASE}/pwa/icon-512x512.png`,
  /** 网页主 logo —— WebP 512（体积更优，现代浏览器优先） */
  logoWebp: `${ICON_BASE}/webp/icon-512x512.webp`,
  /** 网页主 logo —— WebP 192（小尺寸场景） */
  logoWebpSmall: `${ICON_BASE}/webp/icon-192x192.webp`,

  /** 浏览器自动探测路径，必须位于 `public` 根 */
  favicon: '/favicon.ico',
  /** iOS 自动探测路径，必须位于 `public` 根 */
  appleTouchIcon: '/apple-touch-icon.png',
  /** PWA 清单 */
  manifest: '/manifest.json',
} as const;

/** PWA 清单中声明的图标集合（尺寸与文件必须真实存在）。 */
export const MANIFEST_ICONS: ReadonlyArray<{
  src: string;
  sizes: string;
  type: string;
  purpose?: string;
}> = [
  { src: `${ICON_BASE}/pwa/icon-72x72.png`, sizes: '72x72', type: 'image/png' },
  { src: `${ICON_BASE}/pwa/icon-96x96.png`, sizes: '96x96', type: 'image/png' },
  { src: `${ICON_BASE}/pwa/icon-128x128.png`, sizes: '128x128', type: 'image/png' },
  { src: `${ICON_BASE}/pwa/icon-144x144.png`, sizes: '144x144', type: 'image/png' },
  { src: `${ICON_BASE}/pwa/icon-152x152.png`, sizes: '152x152', type: 'image/png' },
  { src: `${ICON_BASE}/pwa/icon-192x192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
  { src: `${ICON_BASE}/pwa/icon-384x384.png`, sizes: '384x384', type: 'image/png' },
  { src: `${ICON_BASE}/pwa/icon-512x512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
  // maskable 需独立文件（安全区内缩），与 any 复用同一文件会裁切异常
  {
    src: `${ICON_BASE}/pwa/icon-512x512.png`,
    sizes: '512x512',
    type: 'image/png',
    purpose: 'maskable',
  },
  { src: `${ICON_BASE}/webp/icon-192x192.webp`, sizes: '192x192', type: 'image/webp' },
  { src: `${ICON_BASE}/webp/icon-512x512.webp`, sizes: '512x512', type: 'image/webp' },
];

/** 与设计令牌一致的主题色（取自 `app/globals.css` 的 `--primary` / `--background`）。 */
export const THEME_COLORS = {
  light: '#2463eb',
  dark: '#060e23',
  background: '#060e23',
} as const;

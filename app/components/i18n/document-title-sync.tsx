'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { useI18n } from '@/app/hooks/use-i18n';
import { t } from '@/lib/yyc3/i18n';
import { dataIntegrationName, dataIntegrationNameReverse } from '@/lib/yyc3/i18n/data';

/**
 * document.title 客户端本地化。
 *
 * 背景：项目为 SSG 静态导出，`metadata` 构建期固化为中文，
 * `document.title` 不随语言切换（04 抽查清单 P2 遗留项）。
 *
 * 原理：语言或路由变化时读取当前标题，按「页面名 - 品牌名」结构解析，
 * 经 title 词表（静态标题，zh 原文即键、双语命中互查）与 data.name
 * 词表（动态集成名，如「数据同步1」↔「Data Sync1」）双向重译后写回。
 * 纯客户端行为，不影响 SSR/SEO 抓取到的中文 metadata。
 */

/** 静态页面标题注册表（title ns，zh 原文即键）。 */
const STATIC_TITLES = [
  '集成中心',
  '应用市场',
  '我的收藏',
  '账户中心',
  '个人资料',
  '加密设置',
  '同步设置',
  '订阅管理',
  '账户登录',
  '关于我们',
  '版本信息',
  '联系我们',
  '设计系统',
  '设计系统示例',
  '环境变量检查',
  '错误处理测试',
  '加载演示',
  'AI 助手',
  '开发指南',
  '渐进式学习路径',
  '加载动画示例',
  '可关闭标签页示例',
  '组件示例',
  'API 文档',
  '隐私政策',
  '开发者中心',
  '加载动画演示',
  '服务条款',
  '组件库',
  '分类目录',
  '浏览应用',
  '应用搜索',
  '管理控制台',
  '热门应用',
  'YanYuCloudCube集成中心系统 - YanYuCloudCube',
] as const;

const BRAND_TITLE_KEY = 'YanYuCloudCube集成中心系统';
const BRAND_SHORT_KEY = 'YanYuCloudCube';

/** 本地化标题前缀（页面名部分）。 */
function localizePrefix(prefix: string): string {
  // 品牌全称（根布局 default 标题的前半段）
  if (prefix === BRAND_TITLE_KEY || prefix === t(`title.${BRAND_TITLE_KEY}`)) {
    return t(`title.${BRAND_TITLE_KEY}`);
  }

  // 安装向导前缀：「安装 {应用名}」/「Install {App}」
  const installZh = '安装 ';
  const installLocal = `${t('title.安装')} `;
  if (prefix.startsWith(installZh)) {
    return `${t('title.安装')} ${localizePrefix(prefix.slice(installZh.length))}`;
  }
  if (prefix.startsWith(installLocal)) {
    return `${t('title.安装')} ${localizePrefix(prefix.slice(installLocal.length))}`;
  }

  // 静态标题：zh 原文或本地译文命中均可（支持双向切换）
  for (const zh of STATIC_TITLES) {
    if (prefix === zh || prefix === t(`title.${zh}`)) return t(`title.${zh}`);
  }

  // 动态集成名：中文名直译，或英译名反查中文名
  if (dataIntegrationName(prefix) !== prefix) return dataIntegrationName(prefix);
  const reversed = dataIntegrationNameReverse(prefix);
  if (reversed) return dataIntegrationName(reversed);

  return prefix;
}

/** 将当前 document.title 重译为本地化标题；无变化时不动。 */
function applyLocalizedTitle(): void {
  const raw = document.title;
  if (!raw) return;

  const sep = raw.lastIndexOf(' - ');
  if (sep < 0) {
    const next = localizePrefix(raw);
    if (next !== raw) document.title = next;
    return;
  }

  const prefix = localizePrefix(raw.slice(0, sep));
  const suffixRaw = raw.slice(sep + 3);
  const shortLocal = t(`title.${BRAND_SHORT_KEY}`);
  const suffix =
    suffixRaw === BRAND_SHORT_KEY || suffixRaw === shortLocal
      ? shortLocal
      : t(`title.${BRAND_TITLE_KEY}`);
  const next = `${prefix} - ${suffix}`;
  if (next !== raw) document.title = next;
}

export function DocumentTitleSync() {
  const { locale } = useI18n();
  const pathname = usePathname();

  useEffect(() => {
    applyLocalizedTitle();
    // React/Next head 管理会在语言切换等后续 commit 中按 SSR metadata 重置 <title>，
    // 覆盖 effect 内的写入（实测重置晚于 effect 约数百毫秒）。
    // 以 MutationObserver 守望 head：一旦被重置为未本地化值立即回写；
    // 自身写入触发的观察因「已本地化 → 不再写」而自然终止，无死循环。
    const observer = new MutationObserver(applyLocalizedTitle);
    observer.observe(document.head, { subtree: true, childList: true, characterData: true });
    return () => observer.disconnect();
  }, [locale, pathname]);

  return null;
}

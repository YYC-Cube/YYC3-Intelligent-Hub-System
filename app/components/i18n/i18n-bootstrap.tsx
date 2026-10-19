'use client';

/**
 * 客户端语言引导：
 * 1. 首次挂载时读取 localStorage（包内持久化键）→ 系统语言 → 回落 zh-CN；
 * 2. 与静态导出的 zh-CN 不一致时切换引擎并同步 <html lang>。
 * 放在 body 首位，先于任何依赖 locale 的交互组件执行。
 */
import { useEffect } from 'react';

// 浏览器子入口（同 lib/yyc3/i18n：主入口含 Node 内置 import，会污染客户端 bundle）
import { detectSystemLocale, setupDocumentDirection } from '@yyc3/i18n-core/browser';

import { DEFAULT_LOCALE, appI18n } from '@/lib/yyc3/i18n';

// 与 i18n 引擎的持久化键保持一致（引擎内部写入 yyc3.i18n.locale）
const STORAGE_KEY = 'yyc3.i18n.locale';
const LEGACY_STORAGE_KEY = 'yyc3-i18n-locale';

export function I18nBootstrap() {
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
    const detected = detectSystemLocale(stored);
    const next = detected.locale ?? DEFAULT_LOCALE;

    if (next !== appI18n.getLocale()) {
      void appI18n.setLocale(next);
    }
    document.documentElement.lang = appI18n.getLocale();
    setupDocumentDirection(appI18n.getLocale());

    // 引擎自带持久化之外，额外记录一份供下次引导直读
    const unsub = appI18n.subscribe((locale) => {
      document.documentElement.lang = locale;
      setupDocumentDirection(locale);
      try {
        localStorage.setItem(STORAGE_KEY, locale);
      } catch {
        /* 隐私模式下忽略 */
      }
    });
    return unsub;
  }, []);

  return null;
}

"use client"

/**
 * React 侧 i18n 接入。
 *
 * - useI18n：基于 useSyncExternalStore 订阅引擎 locale，语言切换即触发重渲染；
 * - useT：仅需翻译函数、无需订阅重渲染的轻量场景（如静态事件回调）。
 */
import { useCallback, useSyncExternalStore } from "react"

import { appI18n, t as appT, DEFAULT_LOCALE, type Locale } from "@/lib/yyc3/i18n"

export function useI18n() {
  const locale = useSyncExternalStore(
    (onChange) => appI18n.subscribe(() => onChange()),
    () => appI18n.getLocale(),
    // 静态导出必需：SSG 阶段 locale 恒为 zh-CN，保证 hydration 一致
    () => DEFAULT_LOCALE
  )

  const setLocale = useCallback((next: Locale) => {
    void appI18n.setLocale(next).then(() => {
      if (typeof document !== "undefined") {
        document.documentElement.lang = next
      }
    })
  }, [])

  const translate = useCallback(
    (key: string, params?: Record<string, string>) => appT(key, params),
    []
  )

  return { locale, setLocale, t: translate }
}

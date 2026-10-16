"use client"

import { useCallback, useRef, useSyncExternalStore } from "react"

/** 空订阅：本 Hook 仅用于「读一次」外部数据源，无需监听变更。 */
const noopSubscribe = () => () => {}

/**
 * 在客户端安全读取仅浏览器可用的数据源（如 localStorage / sessionStorage）。
 *
 * 背景：直接在渲染期或在 `useEffect` 中同步 `setState` 读取 localStorage 都有缺陷——
 * 前者会导致 SSR/CSR 水合内容不一致，后者会触发一次额外渲染。`useSyncExternalStore`
 * 同时提供 `getServerSnapshot` 与 `getSnapshot`，天然解决该问题。
 *
 * 注意事项：
 * - `getSnapshot` 必须返回**值语义稳定**的数据；本 Hook 会按 JSON 序列化结果做浅缓存，
 *   避免每次调用产生新的引用而触发 React 的无限更新保护。
 * - 返回值为只读快照；如需写入，请在事件处理器中调用底层服务，并依赖 Re-render 重新读取。
 *
 * @param getSnapshot 客户端读取函数，建议为模块级稳定引用。
 * @param serverSnapshot 服务端渲染 / 首次水合期间使用的兜底值。
 */
export function useClientSnapshot<T>(getSnapshot: () => T, serverSnapshot: T): T {
  const cacheRef = useRef<{ raw: string; value: T } | null>(null)

  const getCachedSnapshot = useCallback(() => {
    try {
      const value = getSnapshot()
      const raw = JSON.stringify(value) ?? ""
      if (!cacheRef.current || cacheRef.current.raw !== raw) {
        cacheRef.current = { raw, value }
      }
      return cacheRef.current.value
    } catch {
      // 数据源不可用时（例如 Safari 隐私模式下访问 storage 会抛 SecurityError）
      // 回退到服务端快照，避免在渲染期抛出异常导致整个页面崩溃。
      return serverSnapshot
    }
  }, [getSnapshot, serverSnapshot])

  const getServerSnapshot = useCallback(() => serverSnapshot, [serverSnapshot])

  return useSyncExternalStore(noopSubscribe, getCachedSnapshot, getServerSnapshot)
}

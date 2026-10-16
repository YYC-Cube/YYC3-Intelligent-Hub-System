"use client"

import { useSyncExternalStore } from "react"

interface ClientOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/** 仅用于挂载检测的空订阅：客户端快照恒为 true，服务端快照恒为 false。 */
const emptySubscribe = () => () => {}

/**
 * 仅在客户端渲染子节点，避免 SSR 阶段访问浏览器 API。
 *
 * 采用 `useSyncExternalStore` 而非「useState + useEffect」实现挂载检测：
 * 前者天然返回服务端/客户端两套快照，无需在 effect 中同步 setState，
 * 既满足 react-hooks/set-state-in-effect，也避免首帧多余的重渲染。
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )

  return isClient ? <>{children}</> : <>{fallback}</>
}

"use client"

import { useEffect, useState } from "react"

/**
 * 网络在线状态订阅 —— offline / online 事件 + navigator.onLine 初值。
 *
 * 返回 true 表示在线；SSG 阶段恒为 true（navigator 不可用），
 * 仅客户端挂载后才可能返回 false，保证 hydration 一致。
 */
export function useNetworkStatus(): boolean {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const update = () => setIsOnline(navigator.onLine)
    update()

    window.addEventListener("online", update)
    window.addEventListener("offline", update)
    return () => {
      window.removeEventListener("online", update)
      window.removeEventListener("offline", update)
    }
  }, [])

  return isOnline
}

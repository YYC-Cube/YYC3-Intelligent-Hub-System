"use client"

import { StatusPage } from "@/app/components/error-handling/status-page"

/**
 * 404 页面 —— 收敛至统一 StatusPage（not-found 变体），
 * 与 403 / 500 / 网络错误共享同一异常视觉语言。
 */
export default function NotFound() {
  return <StatusPage variant="not-found" code="404" />
}

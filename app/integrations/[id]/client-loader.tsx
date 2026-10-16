"use client"

import dynamic from "next/dynamic"

/**
 * 客户端加载器：`ssr: false` 的 dynamic 导入必须位于 Client Component。
 * 静态导出模式下页面外壳由 SSG 预渲染，实际内容水合后渲染。
 */
const PageClient = dynamic(() => import("./client-page"), { ssr: false })

export default function ClientLoader() {
  return <PageClient />
}

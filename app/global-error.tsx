"use client"

import { useEffect } from "react"

import "./globals.css"

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * 根布局级崩溃兜底（global-error）—— root layout / 全局 Provider 自身抛错时
 * 的最后一道防线，此时 i18n Context 与主题 Provider 均不可用：
 * - 自带 <html>/<body> 与 globals.css 引入，保证任何状态下不白屏；
 * - 内置双语兜底文案（按 navigator.language 判定），不依赖 useI18n；
 * - 安全约定：生产环境不渲染 error.message，仅展示 digest。
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // global-error 阶段无 logError 服务依赖，仅上报控制台供诊断
    console.error("[global-error]", error)
  }, [error])

  const isZh =
    typeof navigator === "undefined" || !navigator.language || navigator.language.startsWith("zh")
  const title = isZh ? "页面出现了问题" : "Something went wrong"
  const description = isZh
    ? "应用遇到了意外问题，请重试；若问题持续，请返回首页。"
    : "The app hit an unexpected problem. Please retry or return to the home page."
  const retryLabel = isZh ? "重试" : "Retry"
  const homeLabel = isZh ? "返回首页" : "Back to Home"
  const errorIdLabel = isZh ? "错误编号" : "Error ID"

  return (
    <html lang={isZh ? "zh-CN" : "en"}>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          color: "#0f172a",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: "5rem",
            height: "5rem",
            borderRadius: "9999px",
            background: "rgba(239,68,68,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.5rem",
            fontSize: "2.5rem",
          }}
        >
          ⚠️
        </div>
        <p
          aria-hidden="true"
          style={{ color: "#dc2626", fontWeight: 600, letterSpacing: "0.1em", marginBottom: "0.5rem" }}
        >
          500
        </p>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 0.75rem" }}>{title}</h1>
        <p style={{ color: "#64748b", maxWidth: "28rem", margin: "0 0 2rem" }}>{description}</p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "0.5rem 1.25rem",
              borderRadius: "0.5rem",
              border: "none",
              background: "#2260dd",
              color: "#ffffff",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {retryLabel}
          </button>
          <a
            href="/"
            style={{
              padding: "0.5rem 1.25rem",
              borderRadius: "0.5rem",
              border: "1px solid #cbd5e1",
              color: "#0f172a",
              fontSize: "0.875rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            {homeLabel}
          </a>
        </div>
        {error.digest ? (
          <p style={{ marginTop: "2rem", fontSize: "0.75rem", color: "#94a3b8" }}>
            {errorIdLabel}: {error.digest}
          </p>
        ) : null}
      </body>
    </html>
  )
}

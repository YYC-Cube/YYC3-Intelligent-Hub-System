"use client"

import { useEffect, useState } from "react"

interface TypingEffectProps {
  text: string
  speed?: number
  onComplete?: () => void
}

/**
 * 打字机效果：逐字展示文本。
 *
 * 展示内容由 `currentIndex` 从 `text` 切片派生（纯计算），不再单独维护
 * `displayedText` state；文本变更时采用 React 官方推荐的「渲染期调整 state」
 * 模式重置进度，从而避免在 effect 中同步 setState 造成的级联渲染。
 */
export function TypingEffect({ text, speed = 30, onComplete }: TypingEffectProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sourceText, setSourceText] = useState(text)

  if (sourceText !== text) {
    setSourceText(text)
    setCurrentIndex(0)
  }

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    }

    onComplete?.()
  }, [currentIndex, text, speed, onComplete])

  return <>{text.slice(0, currentIndex)}</>
}

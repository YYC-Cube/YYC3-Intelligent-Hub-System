"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Logo } from "./logo"
import { Progress } from "@/components/ui/progress"
import { useI18n } from "@/app/hooks/use-i18n"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const { t } = useI18n()
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState(t("ui.初始化系统..."))

  useEffect(() => {
    if (!isLoading) return

    // 模拟加载进度
    const loadingTexts = [
      t("ui.初始化系统..."),
      t("ui.加载核心模块..."),
      t("ui.连接集成服务..."),
      t("ui.准备用户界面..."),
      t("ui.优化性能..."),
      t("ui.完成加载"),
    ]

    let interval: NodeJS.Timeout
    let step = 0

    const simulateProgress = () => {
      interval = setInterval(() => {
        step++
        const newProgress = Math.min(step * 20, 100)
        setProgress(newProgress)

        const textIndex = Math.min(Math.floor(step * (loadingTexts.length / 6)), loadingTexts.length - 1)
        setLoadingText(loadingTexts[textIndex])

        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsLoading(false), 500)
        }
      }, 300)
    }

    simulateProgress()

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isLoading])

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 z-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [0.8, 1, 1],
            opacity: 1,
          }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 blur-xl bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-70 rounded-full animate-pulse"></div>
          <div className="relative">
            <Logo />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-64 flex flex-col items-center"
        >
          <Progress value={progress} className="h-2 w-full mb-2" />
          <div className="text-white text-sm font-medium">{loadingText}</div>
          <div className="text-blue-200 text-xs mt-1">{progress}%</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0.2] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          className="absolute bottom-8 text-blue-200 text-xs"
        >
          {t("ui.言语云³集成中心系统 · YY C³-IC")}
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      {children}
    </motion.div>
  )
}

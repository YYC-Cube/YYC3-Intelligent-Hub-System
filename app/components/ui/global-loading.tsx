"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { LoadingScreen } from "./loading-screen"
import { useI18n } from "@/app/hooks/use-i18n"

interface LoadingContextType {
  isLoading: boolean
  showLoading: (options?: { message?: string; progress?: number; onComplete?: () => void; timeout?: number }) => void
  updateProgress: (progress: number) => void
  hideLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

interface GlobalLoadingProviderProps {
  children: ReactNode
}

export function GlobalLoadingProvider({ children }: GlobalLoadingProviderProps) {
  const { t } = useI18n()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState(t("ui.加载中..."))
  const [progress, setProgress] = useState<number | undefined>(undefined)
  const [onComplete, setOnComplete] = useState<(() => void) | undefined>(undefined)
  const [timeout, setTimeout] = useState(3000)

  const showLoading = (options?: {
    message?: string
    progress?: number
    onComplete?: () => void
    timeout?: number
  }) => {
    setMessage(options?.message || t("ui.加载中..."))
    setProgress(options?.progress)
    setOnComplete(options?.onComplete)
    if (options?.timeout) setTimeout(options.timeout)
    setIsLoading(true)
  }

  const updateProgress = (newProgress: number) => {
    setProgress(newProgress)
  }

  const hideLoading = () => {
    setIsLoading(false)
  }

  const handleComplete = () => {
    if (onComplete) onComplete()
    hideLoading()
  }

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, updateProgress, hideLoading }}>
      {children}
      {isLoading && (
        <LoadingScreen 
          message={message} 
          progress={progress} 
          onComplete={handleComplete} 
          duration={timeout} 
        />
      )}
    </LoadingContext.Provider>
  )
}

export function useGlobalLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error("useGlobalLoading must be used within a GlobalLoadingProvider")
  }
  return context
}

export default GlobalLoadingProvider

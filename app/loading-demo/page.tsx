"use client"

import { PageContainer } from "@/app/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { GlobalLoadingProvider, useGlobalLoading } from "../components/ui/global-loading"

function LoadingDemoPageContent() {
  const router = useRouter()
  const { showLoading, hideLoading, updateProgress } = useGlobalLoading()
  const [message, setMessage] = useState("正在加载中...")
  const [timeoutState, setTimeoutState] = useState(3000)
  const [redirectPath, setRedirectPath] = useState("/")

  const handleGlobalLoading = () => {
    showLoading({ message, timeout: timeoutState, onComplete: () => { } })

    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      updateProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          if (redirectPath && redirectPath !== "/") {
            router.push(redirectPath)
          }
          hideLoading()
        }, 500)
      }
    }, timeoutState / 10)
  }

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">全局加载状态演示</h1>

        <Card>
          <CardHeader>
            <CardTitle>基本用法</CardTitle>
            <CardDescription>演示全局加载状态的基本功能</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>加载消息</Label>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="输入加载消息..."
              />
            </div>

            <Button onClick={handleGlobalLoading}>显示全局加载</Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}

export default function LoadingDemoPage() {
  return (
    <GlobalLoadingProvider>
      <LoadingDemoPageContent />
    </GlobalLoadingProvider>
  )
}

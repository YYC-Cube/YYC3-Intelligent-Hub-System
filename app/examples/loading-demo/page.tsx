"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GlobalLoadingProvider, useGlobalLoading } from "@/app/components/ui/global-loading"

function LoadingDemoContent() {
  const router = useRouter()
  const { showLoading } = useGlobalLoading()
  const [message, setMessage] = useState("正在加载中...")
  const [timeoutValue, setTimeoutValue] = useState(3000)
  const [progress, setProgress] = useState<number | undefined>(undefined)
  const [useCustomProgress, setUseCustomProgress] = useState(false)

  const handleShowGlobalLoading = () => {
    showLoading({
      message,
      progress: useCustomProgress ? progress : undefined,
      timeout: timeoutValue,
      onComplete: () => {
        console.log("加载完成")
      },
    })
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">全局加载演示</h1>
          <p className="text-muted-foreground">演示全局加载状态管理的各种用法</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>基础用法</CardTitle>
            <CardDescription>显示一个简单的加载动画</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="loading-message" className="text-sm font-medium">加载消息</label>
              <Input
                id="loading-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="输入加载消息..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">超时时间 (ms): {timeoutValue}</label>
              <Slider
                value={[timeoutValue]}
                onValueChange={(value) => setTimeoutValue(value[0])}
                min={1000}
                max={10000}
                step={500}
              />
            </div>

            <Button onClick={handleShowGlobalLoading}>显示全局加载</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function LoadingDemoPage() {
  return (
    <GlobalLoadingProvider>
      <LoadingDemoContent />
    </GlobalLoadingProvider>
  )
}
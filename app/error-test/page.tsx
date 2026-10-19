"use client"

import { PageContainer } from "@/app/components/layout/page-container"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export default function ErrorTestPage() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-bold mb-6">错误测试页面</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>客户端错误测试</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">点击下面的按钮测试客户端错误处理</p>
            <Button
              variant="destructive"
              onClick={() => {
                throw new Error("这是一个测试错误")
              }}
            >
              触发客户端错误
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API错误测试</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">点击下面的按钮测试API错误处理</p>
            <Button
              variant="destructive"
              onClick={async () => {
                try {
                  const res = await fetch("/api/example?error=true")
                  if (!res.ok) {
                    const data = await res.json()
                    alert(`API错误: ${data.message || res.statusText}`)
                  }
                } catch (error) {
                  alert(`请求错误: ${error instanceof Error ? error.message : "未知错误"}`)
                }
              }}
            >
              触发API错误
            </Button>
          </CardContent>
        </Card>
      </div>

      <Alert variant="destructive" className="mt-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>注意</AlertTitle>
        <AlertDescription>
          此页面仅用于测试错误处理机制。在生产环境中，我们会捕获这些错误并提供友好的错误信息。
        </AlertDescription>
      </Alert>
    </PageContainer>
  )
}

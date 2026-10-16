import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"

/** 组件库中可复用组件的分类清单 */
const GROUPS = [
  {
    name: "基础组件",
    components: ["button", "input", "label", "badge", "avatar", "separator", "skeleton"],
  },
  {
    name: "布局与容器",
    components: ["card", "tabs", "accordion", "collapsible", "resizable", "scroll-area"],
  },
  {
    name: "反馈与浮层",
    components: ["alert", "dialog", "drawer", "toast", "tooltip", "popover", "progress"],
  },
  {
    name: "表单控件",
    components: ["checkbox", "radio-group", "select", "slider", "switch", "textarea", "form"],
  },
  {
    name: "业务组件",
    components: ["navbar", "footer", "logo", "pagination", "sidebar", "breadcrumb"],
  },
] as const

/**
 * 组件库参考页面。
 *
 * 展示言语云³集成中心可复用的 shadcn/ui 组件清单与交互样例，供开发者
 * 在接入新页面时复用既有组件，避免重复实现。
 *
 * @returns 组件库参考视图
 */
export default function DeveloperComponentsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Link
          href="/developer/guide"
          className="mb-6 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          返回开发者指南
        </Link>

        <h1 className="mb-2 text-2xl font-bold">组件库</h1>
        <p className="mb-8 text-gray-600">
          基于 shadcn/ui 构建，统一从 <code className="rounded bg-gray-100 px-1.5 py-0.5">@/components/ui/*</code> 引入。
        </p>

        <Alert className="mb-8">
          <AlertTitle>引入约定</AlertTitle>
          <AlertDescription>
            所有业务页面必须复用组件库中的组件，禁止在页面内直接重写基础交互样式；新增组件需同步补充 JSDoc 与单元测试。
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 lg:grid-cols-2">
          {GROUPS.map((group) => (
            <Card key={group.name}>
              <CardHeader>
                <CardTitle>{group.name}</CardTitle>
                <CardDescription>{group.components.length} 个组件</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {group.components.map((component) => (
                    <Badge key={component} variant="secondary">
                      {component}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-10" />

        <h2 className="mb-6 text-xl font-semibold">交互样例</h2>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>按钮</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button>主要按钮</Button>
              <Button variant="secondary">次要按钮</Button>
              <Button variant="outline">描边按钮</Button>
              <Button variant="ghost">幽灵按钮</Button>
              <Button disabled>禁用状态</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>表单控件</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="demo-input">应用名称</Label>
                <Input id="demo-input" placeholder="请输入应用名称" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="demo-switch">启用自动同步</Label>
                <Switch id="demo-switch" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>加载占位</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>提示信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert>
                <AlertTitle>说明</AlertTitle>
                <AlertDescription>默认提示用于展示中性信息。</AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertTitle>错误</AlertTitle>
                <AlertDescription>当操作失败时使用破坏性样式。</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

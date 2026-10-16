import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/** 核心 API 端点说明 */
const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/integrations",
    summary: "分页查询集成应用",
    params: "page、pageSize、category、keyword、sort",
  },
  {
    method: "GET",
    path: "/api/integrations/{id}",
    summary: "获取单个集成应用详情",
    params: "id：应用编号（1–1000）",
  },
  {
    method: "GET",
    path: "/api/categories",
    summary: "获取 29 大类分类字典",
    params: "—",
  },
  {
    method: "POST",
    path: "/api/favorites",
    summary: "新增收藏",
    params: "integrationId",
  },
  {
    method: "DELETE",
    path: "/api/favorites/{id}",
    summary: "取消收藏",
    params: "id：应用编号",
  },
] as const

/**
 * 开发者 API 文档页面。
 *
 * @returns API 参考视图
 */
export default function DeveloperApiPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Link href="/developer/guide" className="mb-6 inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          返回开发者指南
        </Link>

        <h1 className="mb-2 text-2xl font-bold">API 参考</h1>
        <p className="mb-8 text-gray-600">
          集成中心对外接口遵循 REST 风格，统一以 JSON 交互。应用编号为 1–1000 的字符串标识。
        </p>

        <Tabs defaultValue="endpoints">
          <TabsList>
            <TabsTrigger value="endpoints">接口列表</TabsTrigger>
            <TabsTrigger value="types">类型定义</TabsTrigger>
            <TabsTrigger value="errors">错误码</TabsTrigger>
          </TabsList>

          <TabsContent value="endpoints" className="mt-6 space-y-4">
            {ENDPOINTS.map((endpoint) => (
              <Card key={`${endpoint.method}-${endpoint.path}`}>
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant={endpoint.method === "GET" ? "secondary" : "default"}>{endpoint.method}</Badge>
                    <code className="text-sm font-medium">{endpoint.path}</code>
                  </div>
                  <CardDescription>{endpoint.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    <span className="text-gray-500">参数：</span>
                    {endpoint.params}
                  </p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="types" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Integration</CardTitle>
                <CardDescription>集成应用的核心数据结构</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-md bg-gray-900 p-4 text-xs leading-relaxed text-gray-100">
                  <code>{`type Integration = {
  id: string                 // 应用编号
  name: string               // 应用名称
  description: string        // 方案简介
  category: string           // 分类标签（29 大类）
  subcategory?: string       // 子分类
  developer: string          // 开发者
  rating: number             // 评分
  reviewCount: number        // 评价数
  price: { type: "free" | "paid" | "freemium"; value?: number }
  installCount: number       // 安装量
  releaseDate: string
  lastUpdate: string
  version: string
  tags: string[]
  featured?: boolean
  new?: boolean
  popular?: boolean
  industryFocus?: string[]
}`}</code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="errors" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>错误码</CardTitle>
                <CardDescription>统一错误响应结构</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  <code className="mr-2 rounded bg-gray-100 px-1.5 py-0.5">400</code>
                  请求参数不合法（分页越界、编号格式错误）
                </p>
                <p>
                  <code className="mr-2 rounded bg-gray-100 px-1.5 py-0.5">401</code>
                  未认证或凭证已过期
                </p>
                <p>
                  <code className="mr-2 rounded bg-gray-100 px-1.5 py-0.5">403</code>
                  无权访问该资源
                </p>
                <p>
                  <code className="mr-2 rounded bg-gray-100 px-1.5 py-0.5">404</code>
                  集成应用不存在
                </p>
                <p>
                  <code className="mr-2 rounded bg-gray-100 px-1.5 py-0.5">429</code>
                  请求频率超限
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}

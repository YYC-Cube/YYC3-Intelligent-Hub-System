"use client"

import { useState } from "react"
import { useParams, notFound } from "next/navigation"
import { Navbar } from "@/components/ui/navbar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { integrations } from "@/app/data/integrations"
import { iconMap } from "@/app/data/integrations"
import { IntegrationCard } from "../../components/integration-card"
import { FavoriteButton } from "@/app/components/favorites/favorite-button"
import {
  ArrowLeft,
  Star,
  Download,
  Calendar,
  Clock,
  Tag,
  ExternalLink,
  Plus,
  ThumbsUp,
  MessageSquare,
  Share2,
} from "lucide-react"
import Link from "next/link"

/**
 * 依据平均评分与评价总数推导各星级评价占比（百分比）。
 *
 * 该分布为确定性计算，仅依赖传入的集成元数据，避免渲染期使用
 * `Math.random()` 造成 SSR/CSR 水合不一致（与 P0-3 修复保持一致）。
 */
function getRatingDistribution(rating: number, reviewCount: number): Record<number, number> {
  const stars = [5, 4, 3, 2, 1]
  if (reviewCount <= 0) {
    return Object.fromEntries(stars.map((star) => [star, 0]))
  }

  // 与平均分越接近的星级权重越高，形成围绕平均分的钟形分布
  const weights = stars.map((star) => Math.max(0, 1 - Math.abs(star - rating) * 0.45) ** 2)
  const total = weights.reduce((sum, weight) => sum + weight, 0) || 1

  return Object.fromEntries(stars.map((star, index) => [star, (weights[index] / total) * 100]))
}

export default function IntegrationDetailClient() {
  const { id } = useParams()
  const integration = integrations.find((i) => i.id === id)
  const [activeTab, setActiveTab] = useState("overview")

  if (!integration) {
    notFound()
  }

  const Icon = iconMap[integration.icon as keyof typeof iconMap] || Calendar
  const ratingDistribution = getRatingDistribution(integration.rating, integration.reviewCount)

  // 查找相同类别的其他集成
  const relatedIntegrations = integrations
    .filter((i) => i.category === integration.category && i.id !== integration.id)
    .slice(0, 4)

  // 生成随机评论
  const reviews = [
    {
      id: 1,
      author: "张明",
      avatar: "/diverse-group-avatars.png",
      rating: 5,
      date: "2023-11-15",
      content: "这个集成应用非常好用，帮我解决了很多问题。界面简洁，功能强大，强烈推荐！",
    },
    {
      id: 2,
      author: "李华",
      avatar: "/diverse-group-avatars.png",
      rating: 4,
      date: "2023-10-22",
      content: "总体来说很不错，安装简单，使用方便。就是偶尔会有一些小bug，希望后续版本能够修复。",
    },
    {
      id: 3,
      author: "王芳",
      avatar: "/diverse-group-avatars.png",
      rating: 5,
      date: "2023-09-30",
      content: "使用了一个月，效率提高了不少。客服响应速度快，问题解决及时。",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Link href="/marketplace" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回市场
        </Link>

        {/* 头部信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6 border mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div
              className="w-24 h-24 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${integration.color}20` }}
            >
              <Icon className="w-12 h-12" style={{ color: integration.color }} />
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">{integration.name}</h1>
                  <div className="text-gray-600 mt-1">{integration.developer}</div>
                </div>
                <div className="flex gap-3">
                  <Button asChild className="gap-2">
                    <Link href={`/integrations/${id}/install`}>
                      <Plus className="h-4 w-4" />
                      安装集成
                    </Link>
                  </Button>
                  <FavoriteButton id={integration.id as string} />
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500" />
                  {integration.rating} ({integration.reviewCount}条评价)
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  {integration.installCount > 1000
                    ? `${(integration.installCount / 1000).toFixed(1)}K 安装`
                    : `${integration.installCount} 安装`}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  发布于 {integration.releaseDate}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  更新于 {integration.lastUpdate}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    integration.price.type === "free"
                      ? "text-green-600 border-green-200 bg-green-50"
                      : integration.price.type === "freemium"
                        ? "text-blue-600 border-blue-200 bg-blue-50"
                        : "text-gray-600 border-gray-200 bg-gray-50"
                  }
                >
                  {integration.price.type === "free"
                    ? "免费"
                    : integration.price.type === "freemium"
                      ? "免费增值"
                      : `¥${integration.price.value}/月`}
                </Badge>
                <Badge variant="outline">{integration.category}</Badge>
                {integration.subcategory && <Badge variant="outline">{integration.subcategory}</Badge>}
              </div>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">概览</TabsTrigger>
                <TabsTrigger value="features">功能</TabsTrigger>
                <TabsTrigger value="reviews">评价</TabsTrigger>
                <TabsTrigger value="support">支持</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">集成描述</h2>
                    <p className="text-gray-700 mb-6 whitespace-pre-line">{integration.description}</p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {integration.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <h2 className="text-xl font-semibold mb-4">主要功能</h2>
                    <ul className="list-disc pl-5 mb-6 space-y-2">
                      <li>实时数据同步与更新</li>
                      <li>自动化工作流程管理</li>
                      <li>多平台数据整合与分析</li>
                      <li>安全的API连接与认证</li>
                      <li>自定义报表与数据可视化</li>
                      <li>灵活的配置选项</li>
                      <li>详细的使用日志和审计跟踪</li>
                      <li>多语言支持</li>
                    </ul>

                    <h2 className="text-xl font-semibold mb-4">技术规格</h2>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <h3 className="text-sm font-medium">API版本</h3>
                        <p className="text-sm text-gray-500">v2.0</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">认证方式</h3>
                        <p className="text-sm text-gray-500">OAuth 2.0</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">数据格式</h3>
                        <p className="text-sm text-gray-500">JSON, XML</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">更新频率</h3>
                        <p className="text-sm text-gray-500">实时</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">版本</h3>
                        <p className="text-sm text-gray-500">{integration.version}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">支持平台</h3>
                        <p className="text-sm text-gray-500">Web, iOS, Android</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">功能详情</h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">数据同步</h3>
                        <p className="text-gray-700 mb-2">
                          实时同步数据，确保您的信息在所有平台上保持一致。支持增量同步和完全同步，可根据需求配置同步频率。
                        </p>
                        <ul className="list-disc pl-5 text-gray-600">
                          <li>双向数据同步</li>
                          <li>自定义同步规则</li>
                          <li>冲突解决机制</li>
                          <li>同步历史记录</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">自动化工作流</h3>
                        <p className="text-gray-700 mb-2">
                          创建自定义工作流，自动执行重复性任务。通过直观的可视化界面，无需编码即可设置复杂的业务逻辑。
                        </p>
                        <ul className="list-disc pl-5 text-gray-600">
                          <li>触发器和条件设置</li>
                          <li>多步骤工作流</li>
                          <li>定时执行</li>
                          <li>错误处理和通知</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">数据分析与报表</h3>
                        <p className="text-gray-700 mb-2">
                          强大的分析工具，帮助您理解数据并做出明智决策。支持自定义报表和仪表板，直观展示关键指标。
                        </p>
                        <ul className="list-disc pl-5 text-gray-600">
                          <li>交互式仪表板</li>
                          <li>自定义报表模板</li>
                          <li>数据导出功能</li>
                          <li>趋势分析</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">安全与合规</h3>
                        <p className="text-gray-700 mb-2">
                          企业级安全保障，确保您的数据安全。符合GDPR、HIPAA等国际标准，提供详细的审计日志。
                        </p>
                        <ul className="list-disc pl-5 text-gray-600">
                          <li>端到端加密</li>
                          <li>细粒度访问控制</li>
                          <li>合规性报告</li>
                          <li>安全漏洞扫描</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">用户评价</h2>
                      <Button>写评价</Button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 mb-8">
                      <div className="md:w-1/3 flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-5xl font-bold text-blue-600 mb-2">{integration.rating}</div>
                        <div className="flex items-center mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${i < Math.floor(integration.rating) ? "text-yellow-500" : "text-gray-300"}`}
                              fill={i < Math.floor(integration.rating) ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-500">{integration.reviewCount} 条评价</div>
                      </div>

                      <div className="md:w-2/3">
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((rating) => {
                            const percent = ratingDistribution[rating] ?? 0
                            return (
                              <div key={rating} className="flex items-center gap-2">
                                <div className="flex items-center w-16">
                                  <span className="text-sm">{rating}</span>
                                  <Star className="h-3 w-3 text-yellow-500 ml-1" />
                                </div>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-yellow-500 rounded-full"
                                    style={{ width: `${percent}%` }}
                                  ></div>
                                </div>
                                <div className="w-12 text-right text-sm text-gray-500">{Math.round(percent)}%</div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b pb-6 last:border-b-0">
                          <div className="flex justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <img
                                src={review.avatar || "/placeholder.svg"}
                                alt={review.author}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <div className="font-medium">{review.author}</div>
                                <div className="text-sm text-gray-500">{review.date}</div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? "text-yellow-500" : "text-gray-300"}`}
                                  fill={i < review.rating ? "currentColor" : "none"}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700">{review.content}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <button className="text-sm text-gray-500 flex items-center gap-1 hover:text-gray-700">
                              <ThumbsUp className="h-3 w-3" />
                              有用
                            </button>
                            <button className="text-sm text-gray-500 flex items-center gap-1 hover:text-gray-700">
                              <MessageSquare className="h-3 w-3" />
                              回复
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center mt-6">
                      <Button variant="outline">查看更多评价</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="support" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">支持与帮助</h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">文档</h3>
                        <p className="text-gray-700 mb-2">详细的文档指南，包括安装说明、配置选项和常见问题解答。</p>
                        <Button variant="outline" className="gap-2">
                          <ExternalLink className="h-4 w-4" />
                          查看文档
                        </Button>
                      </div>

                      <div className="pt-4 border-t">
                        <h3 className="text-lg font-medium mb-2">技术支持</h3>
                        <p className="text-gray-700 mb-2">
                          我们的技术支持团队随时为您提供帮助。您可以通过以下方式联系我们：
                        </p>
                        <ul className="list-disc pl-5 text-gray-600 mb-4">
                          <li>电子邮件：support@example.com</li>
                          <li>在线聊天：工作日 9:00-18:00</li>
                          <li>电话：400-123-4567（工作日 9:00-17:30）</li>
                        </ul>
                        <Button>联系支持</Button>
                      </div>

                      <div className="pt-4 border-t">
                        <h3 className="text-lg font-medium mb-2">常见问题</h3>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium">如何安装此集成应用？</h4>
                            <p className="text-gray-600">
                              点击 &ldquo;安装集成&rdquo; 按钮，按照向导步骤完成配置即可。整个过程通常只需要几分钟。
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium">是否支持数据迁移？</h4>
                            <p className="text-gray-600">
                              是的，我们提供数据迁移工具，帮助您从其他平台无缝迁移数据。详情请参阅文档或联系技术支持。
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium">如何升级到最新版本？</h4>
                            <p className="text-gray-600">
                              系统会自动提示可用的更新。您也可以在集成管理页面手动检查并应用更新。
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">开发者信息</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">公司名称</h3>
                    <p className="text-sm">{integration.developer}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">开发者支持</h3>
                    <Link
                      href="/contact"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      联系开发者
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">支持邮箱</h3>
                    <p className="text-sm">support@example.com</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">隐私政策</h3>
                    <Link href="/privacy" className="text-sm text-blue-600 hover:underline">
                      查看
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">相关集成</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedIntegrations.map((related) => (
                    <IntegrationCard key={related.id} integration={related} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-10 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-xl font-bold">言语云³ 集成中心</h2>
              <p className="text-gray-400 mt-2">© {new Date().getFullYear()} YY C³-IC. 保留所有权利。</p>
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="hover:text-blue-400 transition-colors">
                关于我们
              </Link>
              <Link href="#" className="hover:text-blue-400 transition-colors">
                联系我们
              </Link>
              <Link href="#" className="hover:text-blue-400 transition-colors">
                隐私政策
              </Link>
              <Link href="#" className="hover:text-blue-400 transition-colors">
                服务条款
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

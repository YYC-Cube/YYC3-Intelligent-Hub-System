"use client"

import { FavoriteButton } from "@/app/components/favorites/favorite-button"
import { IntegrationCard } from "@/app/components/integrations/integration-card"
import { PageContainer } from "@/app/components/layout/page-container"
import { iconMap, integrations } from "@/app/data/integrations"
import { useI18n } from "@/app/hooks/use-i18n"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { dataCat, dataDev, dataIntegrationDesc, dataIntegrationName, dataSub, dataTag } from "@/lib/yyc3/i18n/data"
import { priceVariant } from "@/lib/yyc3/status-variants"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  ExternalLink,
  MessageSquare,
  Plus,
  Share2,
  Star,
  Tag,
  ThumbsUp,
} from "lucide-react"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { useState } from "react"

/**
 * 依据平均评分与评价总数推导各星级评价占比（百分比）。
 *
 * M-10：该分布为演示推演数据（非真实统计），UI 侧已用「演示数据」徽标标注。
 * 计算为确定性，仅依赖传入的集成元数据，避免渲染期使用
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
  const { t } = useI18n()

  if (!integration) {
    notFound()
  }

  const Icon = iconMap[integration.icon as keyof typeof iconMap] || Calendar
  const ratingDistribution = getRatingDistribution(integration.rating, integration.reviewCount)

  // 查找相同类别的其他集成
  const relatedIntegrations = integrations
    .filter((i) => i.category === integration.category && i.id !== integration.id)
    .slice(0, 4)

  // M-10：评论为静态演示样例（非真实用户数据），UI 侧已用「演示数据」徽标标注；
  // 待评论服务接入后替换为真实数据源
  const reviews = [
    {
      id: 1,
      author: "张明",
      avatar: "/diverse-group-avatars.png",
      rating: 5,
      date: "2023-11-15",
      content: t("marketplace.这个集成应用非常好用，帮我解决了很多问题。界面简洁，功能强大，强烈推荐！"),
    },
    {
      id: 2,
      author: "李华",
      avatar: "/diverse-group-avatars.png",
      rating: 4,
      date: "2023-10-22",
      content: t("marketplace.总体来说很不错，安装简单，使用方便。就是偶尔会有一些小bug，希望后续版本能够修复。"),
    },
    {
      id: 3,
      author: "王芳",
      avatar: "/diverse-group-avatars.png",
      rating: 5,
      date: "2023-09-30",
      content: t("marketplace.使用了一个月，效率提高了不少。客服响应速度快，问题解决及时。"),
    },
  ]

  return (
    <>
      <PageContainer>
        <Link href="/marketplace" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("marketplace.返回市场")}
        </Link>

        {/* 头部信息 */}
        <div className="bg-card rounded-lg shadow-sm p-6 border mb-8">
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
                  <h1 className="text-2xl font-bold">{dataIntegrationName(integration.name)}</h1>
                  <div className="text-muted-foreground mt-1">{dataDev(integration.developer)}</div>
                </div>
                <div className="flex gap-3">
                  <Button asChild className="gap-2">
                    <Link href={`/integrations/${id}/install`}>
                      <Plus className="h-4 w-4" />
                      {t("marketplace.安装集成")}
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
                  <Star className="h-3 w-3 text-warning" />
                  {integration.rating} ({t("marketplace.{count}条评价", { count: String(integration.reviewCount) })})
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  {integration.installCount > 1000
                    ? t("marketplace.{count}K 安装", { count: (integration.installCount / 1000).toFixed(1) })
                    : t("marketplace.{count} 安装", { count: String(integration.installCount) })}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {t("marketplace.发布于 {date}", { date: integration.releaseDate })}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {t("marketplace.更新于 {date}", { date: integration.lastUpdate })}
                </Badge>
                {/* 价格徽章：语义变体统一取 priceVariant（free=success / freemium=info / paid=outline） */}
                <Badge variant={priceVariant(integration.price.type)}>
                  {integration.price.type === "free"
                    ? t("marketplace.免费")
                    : integration.price.type === "freemium"
                      ? t("marketplace.免费增值")
                      : t("marketplace.¥{price}/月", { price: String(integration.price.value) })}
                </Badge>
                <Badge variant="outline">{dataCat(integration.category)}</Badge>
                {integration.subcategory && <Badge variant="outline">{dataSub(integration.subcategory)}</Badge>}
              </div>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">{t("marketplace.概览")}</TabsTrigger>
                <TabsTrigger value="features">{t("marketplace.功能")}</TabsTrigger>
                <TabsTrigger value="reviews">{t("marketplace.评价")}</TabsTrigger>
                <TabsTrigger value="support">{t("marketplace.支持")}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">{t("marketplace.集成描述")}</h2>
                    <p className="text-foreground mb-6 whitespace-pre-line">{dataIntegrationDesc(integration.description)}</p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {integration.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {dataTag(tag)}
                        </Badge>
                      ))}
                    </div>

                    <h2 className="text-xl font-semibold mb-4">{t("marketplace.主要功能")}</h2>
                    <ul className="list-disc pl-5 mb-6 space-y-2">
                      <li>{t("marketplace.实时数据同步与更新")}</li>
                      <li>{t("marketplace.自动化工作流程管理")}</li>
                      <li>{t("marketplace.多平台数据整合与分析")}</li>
                      <li>{t("marketplace.安全的API连接与认证")}</li>
                      <li>{t("marketplace.自定义报表与数据可视化")}</li>
                      <li>{t("marketplace.灵活的配置选项")}</li>
                      <li>{t("marketplace.详细的使用日志和审计跟踪")}</li>
                      <li>{t("marketplace.多语言支持")}</li>
                    </ul>

                    <h2 className="text-xl font-semibold mb-4">{t("marketplace.技术规格")}</h2>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <h3 className="text-sm font-medium">{t("marketplace.API版本")}</h3>
                        <p className="text-sm text-muted-foreground">v2.0</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">{t("marketplace.认证方式")}</h3>
                        <p className="text-sm text-muted-foreground">OAuth 2.0</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">{t("marketplace.数据格式")}</h3>
                        <p className="text-sm text-muted-foreground">JSON, XML</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">{t("marketplace.更新频率")}</h3>
                        <p className="text-sm text-muted-foreground">{t("marketplace.实时")}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">{t("marketplace.版本")}</h3>
                        <p className="text-sm text-muted-foreground">{integration.version}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">{t("marketplace.支持平台")}</h3>
                        <p className="text-sm text-muted-foreground">Web, iOS, Android</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">{t("marketplace.功能详情")}</h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">{t("marketplace.数据同步")}</h3>
                        <p className="text-foreground mb-2">
                          {t("marketplace.实时同步数据，确保您的信息在所有平台上保持一致。支持增量同步和完全同步，可根据需求配置同步频率。")}
                        </p>
                        <ul className="list-disc pl-5 text-muted-foreground">
                          <li>{t("marketplace.双向数据同步")}</li>
                          <li>{t("marketplace.自定义同步规则")}</li>
                          <li>{t("marketplace.冲突解决机制")}</li>
                          <li>{t("marketplace.同步历史记录")}</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">{t("marketplace.自动化工作流")}</h3>
                        <p className="text-foreground mb-2">
                          {t("marketplace.创建自定义工作流，自动执行重复性任务。通过直观的可视化界面，无需编码即可设置复杂的业务逻辑。")}
                        </p>
                        <ul className="list-disc pl-5 text-muted-foreground">
                          <li>{t("marketplace.触发器和条件设置")}</li>
                          <li>{t("marketplace.多步骤工作流")}</li>
                          <li>{t("marketplace.定时执行")}</li>
                          <li>{t("marketplace.错误处理和通知")}</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">{t("marketplace.数据分析与报表")}</h3>
                        <p className="text-foreground mb-2">
                          {t("marketplace.强大的分析工具，帮助您理解数据并做出明智决策。支持自定义报表和仪表板，直观展示关键指标。")}
                        </p>
                        <ul className="list-disc pl-5 text-muted-foreground">
                          <li>{t("marketplace.交互式仪表板")}</li>
                          <li>{t("marketplace.自定义报表模板")}</li>
                          <li>{t("marketplace.数据导出功能")}</li>
                          <li>{t("marketplace.趋势分析")}</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">{t("marketplace.安全与合规")}</h3>
                        <p className="text-foreground mb-2">
                          {t("marketplace.企业级安全保障，确保您的数据安全。符合GDPR、HIPAA等国际标准，提供详细的审计日志。")}
                        </p>
                        <ul className="list-disc pl-5 text-muted-foreground">
                          <li>{t("marketplace.端到端加密")}</li>
                          <li>{t("marketplace.细粒度访问控制")}</li>
                          <li>{t("marketplace.合规性报告")}</li>
                          <li>{t("marketplace.安全漏洞扫描")}</li>
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
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold">{t("marketplace.用户评价")}</h2>
                        {/* M-10：明示评论与星级分布为演示/推演数据，避免误导 */}
                        <Badge variant="outline" className="text-muted-foreground">
                          {t("marketplace.演示数据")}
                        </Badge>
                      </div>
                      <Button>{t("marketplace.写评价")}</Button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 mb-8">
                      <div className="md:w-1/3 flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                        <div className="text-5xl font-bold text-primary mb-2">{integration.rating}</div>
                        <div className="flex items-center mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${i < Math.floor(integration.rating) ? "text-warning" : "text-muted-foreground"}`}
                              fill={i < Math.floor(integration.rating) ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">{t("marketplace.{count} 条评价", { count: String(integration.reviewCount) })}</div>
                      </div>

                      <div className="md:w-2/3">
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((rating) => {
                            const percent = ratingDistribution[rating] ?? 0
                            return (
                              <div key={rating} className="flex items-center gap-2">
                                <div className="flex items-center w-16">
                                  <span className="text-sm">{rating}</span>
                                  <Star className="h-3 w-3 text-warning ml-1" />
                                </div>
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-warning rounded-full"
                                    style={{ width: `${percent}%` }}
                                  ></div>
                                </div>
                                <div className="w-12 text-right text-sm text-muted-foreground">{Math.round(percent)}%</div>
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
                                <div className="text-sm text-muted-foreground">{review.date}</div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? "text-warning" : "text-muted-foreground"}`}
                                  fill={i < review.rating ? "currentColor" : "none"}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-foreground">{review.content}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <button className="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground">
                              <ThumbsUp className="h-3 w-3" />
                              {t("marketplace.有用")}
                            </button>
                            <button className="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground">
                              <MessageSquare className="h-3 w-3" />
                              {t("marketplace.回复")}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center mt-6">
                      <Button variant="outline">{t("marketplace.查看更多评价")}</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="support" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">{t("marketplace.支持与帮助")}</h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">{t("marketplace.文档")}</h3>
                        <p className="text-foreground mb-2">{t("marketplace.详细的文档指南，包括安装说明、配置选项和常见问题解答。")}</p>
                        <Button variant="outline" className="gap-2">
                          <ExternalLink className="h-4 w-4" />
                          {t("marketplace.查看文档")}
                        </Button>
                      </div>

                      <div className="pt-4 border-t">
                        <h3 className="text-lg font-medium mb-2">{t("marketplace.技术支持")}</h3>
                        <p className="text-foreground mb-2">
                          {t("marketplace.我们的技术支持团队随时为您提供帮助。您可以通过以下方式联系我们：")}
                        </p>
                        <ul className="list-disc pl-5 text-muted-foreground mb-4">
                          <li>{t("marketplace.电子邮件：support@example.com")}</li>
                          <li>{t("marketplace.在线聊天：工作日 9:00-18:00")}</li>
                          <li>{t("marketplace.电话：400-123-4567（工作日 9:00-17:30）")}</li>
                        </ul>
                        <Button>{t("marketplace.联系支持")}</Button>
                      </div>

                      <div className="pt-4 border-t">
                        <h3 className="text-lg font-medium mb-2">{t("marketplace.常见问题")}</h3>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium">{t("marketplace.如何安装此集成应用？")}</h4>
                            <p className="text-muted-foreground">
                              {t("marketplace.点击 “安装集成” 按钮，按照向导步骤完成配置即可。整个过程通常只需要几分钟。")}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium">{t("marketplace.是否支持数据迁移？")}</h4>
                            <p className="text-muted-foreground">
                              {t("marketplace.是的，我们提供数据迁移工具，帮助您从其他平台无缝迁移数据。详情请参阅文档或联系技术支持。")}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium">{t("marketplace.如何升级到最新版本？")}</h4>
                            <p className="text-muted-foreground">
                              {t("marketplace.系统会自动提示可用的更新。您也可以在集成管理页面手动检查并应用更新。")}
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
                <h2 className="text-lg font-semibold mb-4">{t("marketplace.开发者信息")}</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{t("marketplace.公司名称")}</h3>
                    <p className="text-sm">{dataDev(integration.developer)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{t("marketplace.开发者支持")}</h3>
                    <Link
                      href="/contact"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      {t("marketplace.联系开发者")}
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{t("marketplace.支持邮箱")}</h3>
                    <p className="text-sm">support@example.com</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{t("marketplace.隐私政策")}</h3>
                    <Link href="/privacy" className="text-sm text-primary hover:underline">
                      {t("marketplace.查看")}
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">{t("marketplace.相关集成")}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedIntegrations.map((related) => (
                    <IntegrationCard key={related.id} integration={related} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </>
  )
}

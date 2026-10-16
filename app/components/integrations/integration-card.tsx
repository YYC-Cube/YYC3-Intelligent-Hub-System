"use client"

/**
 * 统一应用卡片（H-1 收敛：/integrations 与 /marketplace 双实现融合）。
 *
 * 融合基准：
 * - 数据与编号（`#${id}`）与详情路由同源；
 * - 分类标签沿用 integrations 卡的 chip 样式（`dataCat` i18n）；
 * - 评分/评论数/安装量/价格徽章沿用 marketplace 卡；
 * - 收藏按钮常驻右上（修复原 marketplace 卡「仅 hover 可见」的可达性缺陷，
 *   触屏与键盘用户无需悬停即可收藏）；
 * - 「新上线」角标移至左上，与常驻收藏按钮互斥定位，消除重叠。
 *
 * 详情路由通过 `detailHref` 注入（默认 marketplace 详情基路径），
 * 两个页面共享同一卡片实现，仅路由基路径不同。
 */

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Download, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import type { Integration } from "@/app/data/integrations"
import { iconMap } from "@/app/data/integrations"
import { FavoriteButton } from "@/app/components/favorites/favorite-button"
import { useI18n } from "@/app/hooks/use-i18n"
import { dataCat, dataIntegrationDesc, dataIntegrationName } from "@/lib/yyc3/i18n/data"

/** marketplace 详情页路由基路径（卡片默认跳转目标）。 */
export const MARKETPLACE_DETAIL_BASE = "/marketplace/integration"

interface IntegrationCardProps {
  integration: Integration
  /** 详情页路由基路径，最终跳转 `${detailHref}/${integration.id}`。 */
  detailHref?: string
}

export function IntegrationCard({ integration, detailHref = MARKETPLACE_DETAIL_BASE }: IntegrationCardProps) {
  const { t } = useI18n()
  const Icon = iconMap[integration.icon as keyof typeof iconMap] || Calendar

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
      <Link href={`${detailHref}/${integration.id}`}>
        <Card className="overflow-hidden h-full border hover:border-primary/50 transition-all duration-300 group relative">
          {/* 「新上线」角标固定左上，与右上常驻收藏按钮互斥定位 */}
          {integration.new && (
            <Badge className="absolute top-2 left-2 z-10 bg-green-500 hover:bg-green-600">{t("marketplace.新上线")}</Badge>
          )}
          {/* 收藏按钮常驻右上：不依赖 hover，触屏/键盘可达 */}
          <div className="absolute top-2 right-2 z-10">
            <FavoriteButton id={integration.id} variant="ghost" size="sm" showText={false} />
          </div>
          <CardContent className="p-4 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${integration.color}20` }}
              >
                <Icon className="w-6 h-6" style={{ color: integration.color }} />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm line-clamp-1">{dataIntegrationName(integration.name)}</h3>
                <div className="text-xs text-gray-500 truncate">{integration.developer}</div>
              </div>
              {/* 编号：与详情路由同源的唯一 id */}
              <span
                className="ml-auto flex-shrink-0 font-mono text-[10px] leading-5 text-gray-400 tabular-nums"
                aria-label={`ID ${integration.id}`}
                title={`#${integration.id}`}
              >
                #{integration.id.padStart(4, "0")}
              </span>
            </div>

            <p className="text-xs text-gray-600 mb-3 line-clamp-2">{dataIntegrationDesc(integration.description)}</p>

            <div className="mt-auto">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-500 mr-1" />
                  <span className="text-xs font-medium">{integration.rating}</span>
                  <span className="text-xs text-gray-500 ml-1">({integration.reviewCount})</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Download className="w-3 h-3 mr-1" />
                  {integration.installCount > 1000
                    ? t("marketplace.{count}千", { count: (integration.installCount / 1000).toFixed(1) })
                    : integration.installCount}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={
                    integration.price.type === "free"
                      ? "text-green-600 border-green-200 bg-green-50"
                      : integration.price.type === "freemium"
                        ? "text-blue-600 border-blue-200 bg-blue-50"
                        : "text-gray-500 border-gray-200 bg-gray-50"
                  }
                >
                  {integration.price.type === "free"
                    ? t("marketplace.免费")
                    : integration.price.type === "freemium"
                      ? t("marketplace.免费增值")
                      : t("marketplace.¥{price}/月", { price: String(integration.price.value) })}
                </Badge>
                {/* 分类标签：沿用 integrations 卡的 chip 样式 */}
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {dataCat(integration.category)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

export default IntegrationCard

"use client"

import { categories } from "@/app/data/integrations"
import { useI18n } from "@/app/hooks/use-i18n"
import { getHotCategories, getTrendingCategories, type CategoryHeat } from "@/app/services/category-trends"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { dataCat } from "@/lib/yyc3/i18n/data"
import { useRouter } from "next/navigation"
import { useState } from "react"
import CategoryHeatBadge from "./category-heat-badge"
import CategorySubscribeButton from "./category-subscribe-button"

export default function HotCategories() {
  const [activeTab, setActiveTab] = useState("hot")
  const router = useRouter()
  const { t } = useI18n()

  // 热度数据完全由静态 `categories` 派生，直接在渲染期计算，
  // 无需借助 state + effect（避免 react-hooks/set-state-in-effect）。
  const hotCategories: CategoryHeat[] = getHotCategories(categories, 5)
  const trendingCategories: CategoryHeat[] = getTrendingCategories(categories, 5)

  const handleCategoryClick = (category: string) => {
    router.push(`/integrations?category=${encodeURIComponent(category)}`)
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>{t("category.分类热度指标")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="hot" className="flex-1">
              {t("category.热门分类")}
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex-1">
              {t("category.上升趋势")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="hot">
            <div className="space-y-3">
              {hotCategories.map((category) => (
                <div
                  key={category.category}
                  className="flex items-center justify-between p-2 hover:bg-muted rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <CategoryHeatBadge
                      heatLevel={category.heatLevel}
                      trend={category.trend}
                      growthRate={category.growthRate}
                      showTrend={false}
                    />
                    <button
                      className="text-sm font-medium hover:underline"
                      onClick={() => handleCategoryClick(category.category)}
                    >
                      {dataCat(category.category)}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {t("category.{count} 安装", { count: category.installCount.toLocaleString() })}
                    </span>
                    <CategorySubscribeButton categoryName={category.category} size="sm" showText={false} />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="trending">
            <div className="space-y-3">
              {trendingCategories.map((category) => (
                <div
                  key={category.category}
                  className="flex items-center justify-between p-2 hover:bg-muted rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <CategoryHeatBadge
                      heatLevel={category.heatLevel}
                      trend={category.trend}
                      growthRate={category.growthRate}
                    />
                    <button
                      className="text-sm font-medium hover:underline"
                      onClick={() => handleCategoryClick(category.category)}
                    >
                      {dataCat(category.category)}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {t("category.+{rate}% 增长", { rate: String(category.growthRate) })}
                    </span>
                    <CategorySubscribeButton categoryName={category.category} size="sm" showText={false} />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

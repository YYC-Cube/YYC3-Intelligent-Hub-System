"use client"

import { categories, integrations } from "@/app/data/integrations"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

/** 依据静态 `categories` / `integrations` 计算各分类集成数量（纯函数，渲染期直接派生）。 */
function buildCategoryStats(): { category: string; count: number }[] {
  return categories
    .filter((category) => category !== "全部分类")
    .map((category) => {
      const count = integrations.filter((integration) => integration.category === category).length
      return { category, count }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10) // 只显示前10个分类
}

export default function CategoryStats() {
  const categoryStats = buildCategoryStats()
  const totalCount = integrations.length

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">分类统计</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categoryStats.map((stat) => (
            <div key={stat.category} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{stat.category}</span>
                <span className="text-muted-foreground">{stat.count} 个集成</span>
              </div>
              <Progress value={(stat.count / totalCount) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

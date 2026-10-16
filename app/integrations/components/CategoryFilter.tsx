"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Link } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useI18n } from "@/app/hooks/use-i18n"
import { tc } from "@/lib/yyc3/i18n/data"
import { cn } from "@/lib/utils"

type CategoryFilterProps = {
  categories: string[]
  subcategories: Record<string, string[]>
  selectedCategory: string
  selectedSubcategory?: string
  onSelectCategory: (category: string, subcategory?: string) => void
}

// 优化后的分类名称映射（确保字数一致，语义清晰）
const categoryNameMap: Record<string, string> = {
  全部分类: "全部类目",
  数据分析: "数据分析",
  营销推广: "营销推广",
  效率工具: "效率工具",
  销售管理: "销售管理",
  财务管理: "财务管理",
  通信工具: "通信工具",
  云端服务: "云端服务",
  安全防护: "安全防护",
  设计创意: "设计创意",
  开发工具: "开发工具",
  人力资源: "人力资源",
  客户支持: "客户支持",
  电子商务: "电商平台",
  社交媒体: "社交媒体",
  内容管理: "内容管理",
  教育培训: "教育培训",
  医疗健康: "医疗健康",
  物联网络: "物联网络",
  区块链技: "区块链技",
  人工智能: "人工智能",
  虚拟现实: "虚拟现实",
  增强现实: "增强现实",
  生物科技: "生物科技",
  能源环保: "能源环保",
  智慧城市: "智慧城市",
  金融科技: "金融科技",
  法律服务: "法律服务",
  旅游出行: "旅游出行",
  音视频制: "音视制作",
}

// 子分类名称映射（确保字数一致）
const subcategoryNameMap: Record<string, Record<string, string>> = {
  数据分析: {
    数据可视化: "数据可视化",
    预测分析: "预测分析工具",
    商业智能: "商业智能系统",
    大数据处理: "大数据处理器",
  },
  营销推广: {
    社交媒体营销: "社交媒体营销",
    内容营销: "内容营销工具",
    电子邮件营销: "电子邮件营销",
    搜索引擎优化: "搜索引擎优化",
  },
  // 其他子分类可以根据需要添加
}

export default function CategoryFilter({
  categories,
  subcategories,
  selectedCategory,
  selectedSubcategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const { t } = useI18n()
  const router = useRouter()
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    [selectedCategory]: true,
  })

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  // 获取子分类的显示名称
  const getSubcategoryDisplayName = (category: string, subcategory: string): string => {
    return subcategoryNameMap[category]?.[subcategory] || subcategory
  }

  return (
    <aside className="w-64 flex flex-col h-screen bg-gradient-to-r from-sky-600 via-blue-500 to-sky-400 shadow-xl">
      <div className="p-4 border-b border-sky-300/30 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">{t("integrations.分类导航")}</h2>
      </div>
      <div className="flex-1 overflow-auto custom-scrollbar">
        <div className="space-y-1 p-4 pt-2">
          {categories.map((category, index) => {
            const hasSubcategories =
              category !== "全部分类" && subcategories && subcategories[category] && subcategories[category].length > 0
            const isExpanded = expandedCategories[category]
            const displayName = categoryNameMap[category] || category
            const isSelected = selectedCategory === category && !selectedSubcategory

            return (
              <div key={category} className="mb-2">
                <div className="flex items-center">
                  {hasSubcategories ? (
                    <CollapsibleTrigger
                      onClick={() => toggleCategory(category)}
                      className="mr-1 p-1 hover:bg-sky-400/30 rounded-full text-white"
                    >
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </CollapsibleTrigger>
                  ) : (
                    <div className="w-6" />
                  )}

                  <div className="flex-1 flex items-center justify-between">
                    <Button
                      variant="ghost"
                      className={cn(
                        "justify-start text-sm py-1.5 px-3 h-auto w-full font-medium transition-all duration-200 tracking-wide",
                        isSelected
                          ? "bg-white/20 text-white shadow-inner backdrop-blur-sm"
                          : "text-white/90 hover:bg-white/10 hover:text-white",
                      )}
                      onClick={() => onSelectCategory(category)}
                    >
                      <span className="mr-2 inline-block w-5 text-center">
                        {index + 1 < 10 ? `0${index + 1}` : index + 1}
                      </span>
                      <span className="inline-block w-16 text-center">{tc("integrations", displayName)}</span>
                    </Button>
                  </div>
                </div>

                {hasSubcategories && subcategories[category] && (
                  <Collapsible open={isExpanded}>
                    <CollapsibleContent>
                      <div className="ml-6 mt-1 space-y-1 border-l-2 border-sky-300/30 pl-2">
                        {subcategories[category].map((subcategory) => {
                          const isSubSelected = selectedCategory === category && selectedSubcategory === subcategory
                          const subDisplayName = getSubcategoryDisplayName(category, subcategory)

                          return (
                            <div key={subcategory} className="flex items-center justify-between pr-2">
                              <Button
                                variant="ghost"
                                className={cn(
                                  "justify-start text-sm py-1 px-2 h-auto w-full tracking-wide",
                                  isSubSelected
                                    ? "bg-white/20 text-white shadow-inner backdrop-blur-sm"
                                    : "text-white/80 hover:bg-white/10 hover:text-white",
                                )}
                                onClick={() => onSelectCategory(category, subcategory)}
                              >
                                <Link className="h-3 w-3 mr-1.5 opacity-70" />
                                <span className="inline-block">{tc("integrations", subDisplayName)}</span>
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <div className="p-4 border-t border-sky-300/30">
        <Button
          variant="outline"
          className="w-full bg-white/10 text-white border-sky-300/30 hover:bg-white/20 hover:border-white/40 backdrop-blur-sm"
          onClick={() => router.push("/account/subscriptions")}
        >
          {t("integrations.管理订阅")}
        </Button>
      </div>
    </aside>
  )
}

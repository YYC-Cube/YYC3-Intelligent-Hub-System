"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button3D } from "@/app/components/ui/3d-button"
import { ChevronDown, ChevronRight, ChevronLeft, Grid, TrendingUp, Star, Filter, RotateCcw } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { calculateCategoryHeat } from "@/app/services/category-trends"
import { CategoryMemoryService } from "@/app/services/category-memory"
import { useClientSnapshot } from "@/hooks/use-client-snapshot"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type CollapsibleCategoryFilterProps = {
  categories: string[]
  subcategories: Record<string, string[]>
  selectedCategory: string
  selectedSubcategory?: string
  onSelectCategory: (category: string, subcategory?: string) => void
  onExpandedChange?: (expanded: Record<string, boolean>) => void
}

/** 本地记忆中与分类筛选相关的字段。 */
interface MemorySelection {
  selectedCategory?: string
  selectedSubcategory?: string
  searchQuery?: string
  expandedCategories?: Record<string, boolean>
}

/** 服务端 / 首次水合期间的兜底快照（模块级稳定引用）。 */
const EMPTY_SELECTION: MemorySelection = {}
const EMPTY_EXPANDED: Record<string, boolean> = {}
const getMemorySelection = (): MemorySelection => CategoryMemoryService.getSelection()

// 优化后的分类名称映射（统一4个字）
const categoryNameMap: Record<string, string> = {
  全部分类: "全部分类",
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
  电子商务: "电子商务",
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

// 分类图标映射
const categoryIconMap: Record<string, any> = {
  全部分类: Grid,
  数据分析: TrendingUp,
  营销推广: Star,
  效率工具: Filter,
  销售管理: TrendingUp,
  财务管理: TrendingUp,
  通信工具: Grid,
  云端服务: Grid,
  安全防护: Filter,
  设计创意: Star,
  开发工具: Grid,
  人力资源: TrendingUp,
  客户支持: Grid,
  电子商务: Star,
  社交媒体: Star,
  内容管理: Grid,
  教育培训: TrendingUp,
  医疗健康: TrendingUp,
  物联网络: Grid,
  区块链技: Grid,
  人工智能: TrendingUp,
  虚拟现实: Grid,
  增强现实: Grid,
  生物科技: TrendingUp,
  能源环保: TrendingUp,
  智慧城市: Grid,
  金融科技: TrendingUp,
  法律服务: Grid,
  旅游出行: Star,
  音视频制: Star,
}

// 子分类名称映射（统一4个字）
const subcategoryNameMap: Record<string, Record<string, string>> = {
  数据分析: {
    数据可视化: "数据可视",
    预测分析: "预测分析",
    商业智能: "商业智能",
    大数据处理: "大数据处",
  },
  营销推广: {
    社交媒体营销: "社交营销",
    内容营销: "内容营销",
    电子邮件营销: "邮件营销",
    搜索引擎优化: "搜索优化",
  },
  效率工具: {
    项目管理: "项目管理",
    时间管理: "时间管理",
    文档协作: "文档协作",
    自动化工具: "自动工具",
  },
}

export default function CollapsibleCategoryFilter({
  categories,
  subcategories,
  selectedCategory,
  selectedSubcategory,
  onSelectCategory,
  onExpandedChange,
}: CollapsibleCategoryFilterProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  // 用户交互产生的「覆盖值」；为 null 时回退到本地记忆，避免 effect 中同步 setState。
  const [expandedOverride, setExpandedOverride] = useState<Record<string, boolean> | null>(null)

  const memorySelection = useClientSnapshot(getMemorySelection, EMPTY_SELECTION)
  const expandedCategories = expandedOverride ?? memorySelection.expandedCategories ?? EMPTY_EXPANDED

  // 恢复记忆中选中的分类时，仅通知父组件（不写入本地 state，规避水合不一致）。
  useEffect(() => {
    if (memorySelection.selectedCategory && memorySelection.selectedCategory !== selectedCategory) {
      onSelectCategory(memorySelection.selectedCategory, memorySelection.selectedSubcategory)
    }
  }, [
    memorySelection.selectedCategory,
    memorySelection.selectedSubcategory,
    selectedCategory,
    onSelectCategory,
  ])

  // 自动收缩逻辑
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsCollapsed(scrollY > 150)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 计算分类热度（纯计算，渲染期直接派生）
  const categoryHeats = useMemo<Record<string, ReturnType<typeof calculateCategoryHeat>>>(() => {
    const heats: Record<string, ReturnType<typeof calculateCategoryHeat>> = {}
    categories.forEach((category) => {
      if (category !== "全部分类") {
        heats[category] = calculateCategoryHeat(category)
      }
    })
    return heats
  }, [categories])

  // 保存展开状态到本地存储，并通知父组件
  useEffect(() => {
    CategoryMemoryService.saveExpandedState(expandedCategories)
    onExpandedChange?.(expandedCategories)
  }, [expandedCategories, onExpandedChange])

  // 优化的切换分类函数
  const toggleCategory = useCallback(
    (category: string) => {
      setExpandedOverride({
        ...expandedCategories,
        [category]: !expandedCategories[category],
      })
    },
    [expandedCategories],
  )

  // 优化的选择分类函数
  const handleSelectCategory = useCallback(
    (category: string, subcategory?: string) => {
      // 保存选择到本地存储
      CategoryMemoryService.saveSelection(category, subcategory, expandedCategories)
      onSelectCategory(category, subcategory)
    },
    [expandedCategories, onSelectCategory],
  )

  // 重置所有筛选
  const handleReset = useCallback(() => {
    setExpandedOverride({})
    CategoryMemoryService.clearAll()
    onSelectCategory("全部分类")
  }, [onSelectCategory])

  const getSubcategoryDisplayName = useCallback((category: string, subcategory: string): string => {
    return subcategoryNameMap[category]?.[subcategory] || subcategory.slice(0, 4)
  }, [])

  const getHeatColor = useCallback((heat: number) => {
    if (heat >= 80) return "from-red-500 to-orange-500"
    if (heat >= 60) return "from-orange-500 to-yellow-500"
    if (heat >= 40) return "from-yellow-500 to-green-500"
    return "from-green-500 to-blue-500"
  }, [])

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "flex flex-col h-screen shadow-xl transition-all duration-300 ease-in-out",
          "bg-gradient-to-br from-blue-600/95 via-sky-500/95 to-cyan-400/95",
          "backdrop-blur-md border-r border-blue-300/30",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        {/* 头部控制区域 */}
        <div className="p-4 border-b border-blue-300/30 flex justify-between items-center">
          {!isCollapsed && <h2 className="text-lg font-semibold text-white">分类导航</h2>}
          <div className="flex items-center space-x-2">
            {!isCollapsed && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button3D
                    variant="glass"
                    size="sm"
                    effect="float"
                    onClick={handleReset}
                    icon={<RotateCcw className="h-3 w-3" />}
                    className="text-white hover:bg-white/20"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>重置筛选</p>
                </TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button3D
                  variant="glass"
                  size="sm"
                  effect="float"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  icon={isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                  className="text-white hover:bg-white/20"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{isCollapsed ? "展开导航" : "收起导航"}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* 分类列表 */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <div className={cn("space-y-1 transition-all duration-300", isCollapsed ? "p-2" : "p-4 pt-2")}>
            {categories.map((category) => {
              const hasSubcategories =
                category !== "全部分类" &&
                subcategories &&
                subcategories[category] &&
                subcategories[category].length > 0
              const isExpanded = expandedCategories[category]
              const displayName = categoryNameMap[category] || category.slice(0, 4)
              const isSelected = selectedCategory === category && !selectedSubcategory
              const heat = categoryHeats[category]
              const CategoryIcon = categoryIconMap[category] || Grid

              return (
                <div key={category} className="mb-2">
                  {/* 使用Collapsible包裹整个分类项 */}
                  <Collapsible open={isExpanded} onOpenChange={() => hasSubcategories && toggleCategory(category)}>
                    <div className="flex items-center">
                      {/* 展开/收缩按钮 */}
                      {hasSubcategories && !isCollapsed && (
                        <CollapsibleTrigger className="mr-1 p-1 hover:bg-white/20 rounded-full text-white transition-colors">
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </CollapsibleTrigger>
                      )}

                      {/* 分类按钮 */}
                      <div className="flex-1 flex items-center justify-between">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button3D
                              variant={isSelected ? "primary" : "glass"}
                              size={isCollapsed ? "sm" : "default"}
                              effect={isSelected ? "glow" : "float"}
                              className={cn(
                                "justify-start font-medium transition-all duration-200 tracking-wide w-full",
                                isSelected
                                  ? "bg-white/25 text-white shadow-inner backdrop-blur-sm border border-white/30"
                                  : "text-white/90 hover:bg-white/15 hover:text-white border border-transparent",
                                isCollapsed && "px-2 justify-center",
                              )}
                              onClick={() => handleSelectCategory(category)}
                            >
                              <CategoryIcon
                                className={cn("transition-all duration-300", isCollapsed ? "h-5 w-5" : "h-4 w-4 mr-2")}
                              />
                              {!isCollapsed && <span>{displayName}</span>}
                            </Button3D>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{category}</p>
                          </TooltipContent>
                        </Tooltip>

                        {/* 热度指示器 */}
                        {!isCollapsed && heat && (
                          <Badge
                            className={cn(
                              "h-6 px-2 text-xs font-medium rounded-full transition-all duration-300 flex items-center",
                              "bg-gradient-to-r",
                              getHeatColor((heat as any).value),
                            )}
                          >
                            {(heat as any).label}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* 子分类列表 */}
                    {hasSubcategories && (
                      <CollapsibleContent className="mt-1 ml-4 transition-all duration-300">
                        <div className={cn("space-y-1", isCollapsed ? "opacity-0 h-0" : "opacity-100 h-auto")}>
                          {subcategories[category].map((subcategory) => {
                            const isSubSelected = selectedCategory === category && selectedSubcategory === subcategory
                            const subDisplayName = getSubcategoryDisplayName(category, subcategory)

                            return (
                              <Tooltip key={subcategory}>
                                <TooltipTrigger asChild>
                                  <Button3D
                                    variant={isSubSelected ? "primary" : "glass"}
                                    size="sm"
                                    effect={isSubSelected ? "glow" : "float"}
                                    className={cn(
                                      "justify-start text-sm font-medium w-full transition-all duration-200",
                                      isSubSelected
                                        ? "bg-white/25 text-white shadow-inner backdrop-blur-sm border border-white/30"
                                        : "text-white/90 hover:bg-white/15 hover:text-white border border-transparent",
                                      isCollapsed && "opacity-0 h-0 p-0 m-0",
                                    )}
                                    onClick={() => handleSelectCategory(category, subcategory)}
                                  >
                                    <ChevronRight className="h-3 w-3 mr-2 text-white/70" />
                                    <span>{subDisplayName}</span>
                                  </Button3D>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{subcategory}</p>
                                </TooltipContent>
                              </Tooltip>
                            )
                          })}
                        </div>
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                </div>
              )
            })}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  )
}

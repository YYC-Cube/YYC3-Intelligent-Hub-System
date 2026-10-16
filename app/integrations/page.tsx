"use client"

import { useState, useMemo, useCallback } from "react"
import { categories, integrations, subcategories } from "../data/integrations"
import CollapsibleCategoryFilter from "./components/CollapsibleCategoryFilter"
import SearchBar from "./components/SearchBar"
import IntegrationGrid from "./components/IntegrationGrid"
import Pagination from "./components/Pagination"
import { Navbar } from "@/components/ui/navbar"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"
import { PageBackground } from "@/app/components/ui/page-background"
import { CategoryMemoryService } from "@/app/services/category-memory"
import { useOptimizedFilter, type FilterOptions } from "@/app/hooks/use-optimized-filter"
import { useClientSnapshot } from "@/hooks/use-client-snapshot"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Star, Filter, RotateCcw, Zap } from "lucide-react"
import { Button3D } from "@/app/components/ui/3d-button"

const ITEMS_PER_PAGE = 30

/** 用户显式设置的筛选项（覆盖 URL 参数 / 本地记忆提供的默认值）。 */
interface FilterOverride {
  category?: string
  subcategory?: string
  searchQuery?: string
}

/** 本地记忆中与筛选相关的字段。 */
interface MemorySelection {
  selectedCategory?: string
  selectedSubcategory?: string
  searchQuery?: string
  expandedCategories?: Record<string, boolean>
}

const EMPTY_SELECTION: MemorySelection = {}
const getMemorySelection = (): MemorySelection => CategoryMemoryService.getSelection()

export default function IntegrationsPage() {
  const searchParams = useSearchParams()
  const memorySelection = useClientSnapshot(getMemorySelection, EMPTY_SELECTION)

  // URL 参数（?id=）与本地记忆共同构成筛选「默认值」，用户操作作为覆盖层，
  // 全部在渲染期派生，无需借助 effect 恢复状态（同时规避 SSR/CSR 水合不一致）。
  const urlId = searchParams.get("id")
  const urlIntegration = urlId ? integrations.find((i) => i.id === urlId) : undefined

  const [override, setOverride] = useState<FilterOverride | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<"name" | "rating" | "installCount" | "releaseDate">("installCount")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const selectedCategory = override?.category ?? urlIntegration?.category ?? memorySelection.selectedCategory ?? "全部分类"
  const selectedSubcategory = override
    ? override.subcategory
    : urlIntegration
      ? undefined
      : memorySelection.selectedSubcategory
  const searchQuery = override?.searchQuery ?? urlIntegration?.name ?? memorySelection.searchQuery ?? ""

  // 使用优化的筛选Hook
  const filterOptions: FilterOptions = useMemo(
    () => ({
      category: selectedCategory,
      subcategory: selectedSubcategory,
      searchQuery: searchQuery,
      sortBy: sortBy,
      sortOrder: sortOrder,
    }),
    [selectedCategory, selectedSubcategory, searchQuery, sortBy, sortOrder],
  )

  const { filteredIntegrations, filterStats, isSearching } = useOptimizedFilter(integrations, filterOptions)

  const totalPages = Math.ceil(filteredIntegrations.length / ITEMS_PER_PAGE)
  const paginatedIntegrations = filteredIntegrations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  // 优化的分类选择处理
  const handleSelectCategory = useCallback(
    (category: string, subcategory?: string) => {
      setOverride({ category, subcategory, searchQuery })
      setCurrentPage(1)

      // 保存到本地存储
      CategoryMemoryService.saveSelection(category, subcategory)
    },
    [searchQuery],
  )

  // 优化的搜索处理
  const handleSearch = useCallback(
    (query: string) => {
      setOverride({ category: selectedCategory, subcategory: selectedSubcategory, searchQuery: query })
      setCurrentPage(1)
    },
    [selectedCategory, selectedSubcategory],
  )

  // 重置所有筛选
  const handleReset = useCallback(() => {
    setOverride({ category: "全部分类", subcategory: undefined, searchQuery: "" })
    setSortBy("installCount")
    setSortOrder("desc")
    setCurrentPage(1)
    CategoryMemoryService.clearAll()
  }, [])

  return (
    <PageBackground variant="gradient">
      <div className="flex flex-col h-screen overflow-hidden">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <CollapsibleCategoryFilter
            categories={categories}
            subcategories={subcategories}
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            onSelectCategory={handleSelectCategory}
          />
          <main className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-blue-50/80 via-sky-50/60 to-cyan-50/80 backdrop-blur-sm">
            {/* 页面头部 - 简化版本，移除重复标题 */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 md:p-6 space-y-4 bg-white/40 backdrop-blur-sm border-b border-blue-200/50"
            >
              {/* 筛选控制区域 */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  {/* 筛选状态显示 */}
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedSubcategory && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1">
                        <Filter className="h-3 w-3 mr-1" />
                        {selectedCategory} → {selectedSubcategory}
                      </Badge>
                    )}
                    {searchQuery && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
                        <Zap className="h-3 w-3 mr-1" />
                        搜索: {searchQuery}
                      </Badge>
                    )}
                    {isSearching && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 px-3 py-1 animate-pulse">
                        搜索中...
                      </Badge>
                    )}
                    {(selectedCategory !== "全部分类" || selectedSubcategory || searchQuery) && (
                      <Button3D
                        variant="secondary"
                        size="sm"
                        effect="float"
                        onClick={handleReset}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        重置筛选
                      </Button3D>
                    )}
                  </div>
                </div>

                {/* 搜索区域 */}
                <div className="w-full md:w-80">
                  <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
                </div>
              </div>

              {/* 统计信息卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-200/30"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-sky-400 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-900">{filterStats.filtered}</p>
                      <p className="text-sm text-blue-700/80">个应用</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-200/30"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-400 rounded-lg">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-900">{filterStats.categories}</p>
                      <p className="text-sm text-blue-700/80">个分类</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-200/30"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-400 rounded-lg">
                      <Star className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-900">{filterStats.averageRating.toFixed(1)}</p>
                      <p className="text-sm text-blue-700/80">平均评分</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* 应用网格 */}
            <div className="flex-1 overflow-auto px-4 md:px-6 py-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <IntegrationGrid integrations={paginatedIntegrations} />
              </motion.div>
            </div>

            {/* 分页 */}
            <div className="p-4 md:p-6 border-t bg-white/40 backdrop-blur-sm border-blue-200/50">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </main>
        </div>
      </div>
    </PageBackground>
  )
}

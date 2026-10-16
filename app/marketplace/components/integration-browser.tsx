"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Search, SlidersHorizontal, Star } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

import { integrations as allIntegrations, categories, type Integration } from "@/app/data/integrations"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/ui/footer"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/ui/navbar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// H-1 收敛：统一卡片（编号+分类标签+简介+评分+收藏），与 /integrations 共用
import { IntegrationCard } from "@/app/components/integrations/integration-card"
import { useI18n } from "@/app/hooks/use-i18n"
import { dataCat } from "@/lib/yyc3/i18n/data"
// H-3：窗口化分页逻辑抽取为共享纯函数（与搜索结果页共用）
import { buildPageWindow } from "@/app/utils/pagination"
// M-8：「相关性」排序的加权评分共享实现（与搜索结果页共用）
import { relevanceScore } from "@/app/utils/search-relevance"

/** 排序方式的可选值 */
type SortKey = "relevance" | "rating" | "installs" | "newest" | "price-low" | "price-high"

/** 组件入参 */
export interface IntegrationBrowserProps {
  /** 页面主标题 */
  title: string
  /** 标题下方的说明文案 */
  description?: string
  /** 待浏览的数据源，默认使用全部集成应用 */
  source?: Integration[]
  /** 每页展示条数，默认 12 */
  itemsPerPage?: number
  /** 是否展示分类筛选器，默认 false（浏览全部时开启） */
  showCategoryFilter?: boolean
  /** 结果为空的引导文案 */
  emptyHint?: string
}

/**
 * 集成应用分页浏览器。
 *
 * 面向应用市场提供统一的分页列表能力：支持关键字检索、分类筛选、多维排序与
 * 页码跳转，并展示数据源的平均评分。所有过滤与排序均在内存中对数据集完成，
 * 便于在静态导出模式下直接复用。
 *
 * @param props - 见 {@link IntegrationBrowserProps}
 * @returns 带导航与页脚的分页列表视图
 */
export function IntegrationBrowser({
  title,
  description,
  source = allIntegrations,
  itemsPerPage = 12,
  showCategoryFilter = false,
  emptyHint,
}: IntegrationBrowserProps): React.JSX.Element {
  const { t } = useI18n()
  const [keyword, setKeyword] = useState("")
  const [category, setCategory] = useState("全部分类")
  const [sortBy, setSortBy] = useState<SortKey>("relevance")
  const [currentPage, setCurrentPage] = useState(1)

  const visible = useMemo(() => {
    const lowered = keyword.trim().toLowerCase()

    const filtered = source.filter((integration) => {
      const matchesCategory = !showCategoryFilter || category === "全部分类" || integration.category === category
      if (!matchesCategory) return false
      if (!lowered) return true

      return (
        integration.name.toLowerCase().includes(lowered) ||
        integration.description.toLowerCase().includes(lowered) ||
        integration.developer.toLowerCase().includes(lowered) ||
        integration.tags.some((tag) => tag.toLowerCase().includes(lowered))
      )
    })

    const sorted = [...filtered]
    switch (sortBy) {
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating)
        break
      case "installs":
        sorted.sort((a, b) => b.installCount - a.installCount)
        break
      case "newest":
        sorted.sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime())
        break
      case "price-low":
        sorted.sort((a, b) => {
          if (a.price.type === "free") return -1
          if (b.price.type === "free") return 1
          return (a.price.value || 0) - (b.price.value || 0)
        })
        break
      case "price-high":
        sorted.sort((a, b) => {
          if (a.price.type === "free") return 1
          if (b.price.type === "free") return -1
          return (b.price.value || 0) - (a.price.value || 0)
        })
        break
      default:
        // M-8：「相关性」排序落地——有关键词时按加权相关度（name > tags > description）排序
        if (lowered) {
          sorted.sort((a, b) => relevanceScore(lowered, b) - relevanceScore(lowered, a))
        }
        break
    }

    return sorted
  }, [source, keyword, category, sortBy, showCategoryFilter])

  const averageRating = useMemo(() => {
    if (source.length === 0) return 0
    return source.reduce((sum, integration) => sum + integration.rating, 0) / source.length
  }, [source])

  const totalPages = Math.max(1, Math.ceil(visible.length / itemsPerPage))
  const safePage = Math.min(currentPage, totalPages)
  const pageItems = visible.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage)
  const pageWindow = buildPageWindow(safePage, totalPages)

  const resetPage = () => setCurrentPage(1)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <nav aria-label={t("marketplace.面包屑")} className="flex items-center mb-6 text-sm">
          <Link href="/marketplace" className="text-blue-600 hover:underline">
            {t("marketplace.应用市场")}
          </Link>
          <span className="text-gray-400 mx-2">/</span>
          <span className="text-gray-600">{title}</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          {description ? <p className="text-gray-600 mb-4">{description}</p> : null}

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2">
              <Star className="h-4 w-4 text-amber-500" aria-hidden="true" />
              <span className="text-sm text-amber-900">
                {t("marketplace.平均评分")} <strong>{averageRating.toFixed(1)}</strong>
              </span>
            </div>
            <span className="text-sm text-gray-500">{t("marketplace.共 {count} 个集成应用", { count: String(visible.length) })}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <Input
              value={keyword}
              onChange={(event) => {
                setKeyword(event.target.value)
                resetPage()
              }}
              placeholder={t("marketplace.搜索应用名称、简介、开发者或标签")}
              aria-label={t("marketplace.搜索集成应用")}
              className="pl-9"
            />
          </div>

          {showCategoryFilter ? (
            <Select
              value={category}
              onValueChange={(value) => {
                setCategory(value)
                resetPage()
              }}
            >
              <SelectTrigger className="w-full md:w-[180px]" aria-label={t("marketplace.选择分类")}>
                <SelectValue placeholder={t("marketplace.选择分类")} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((item) => (
                  <SelectItem key={item} value={item}>
                    {dataCat(item)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-gray-500" aria-hidden="true" />
            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value as SortKey)
                resetPage()
              }}
            >
              <SelectTrigger className="w-full md:w-[180px]" aria-label={t("marketplace.排序方式")}>
                <SelectValue placeholder={t("marketplace.排序方式")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">{t("marketplace.相关性")}</SelectItem>
                <SelectItem value="rating">{t("marketplace.评分")}</SelectItem>
                <SelectItem value="installs">{t("marketplace.安装量")}</SelectItem>
                <SelectItem value="newest">{t("marketplace.最新更新")}</SelectItem>
                <SelectItem value="price-low">{t("marketplace.价格 (低到高)")}</SelectItem>
                <SelectItem value="price-high">{t("marketplace.价格 (高到低)")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4" role="img" aria-label={t("marketplace.空结果")}>
              🔍
            </div>
            <h2 className="text-2xl font-bold mb-2">{t("marketplace.未找到匹配的集成应用")}</h2>
            <p className="text-gray-500 mb-6">{emptyHint ?? t("marketplace.换个关键字或筛选条件试试吧")}</p>
            <Button asChild>
              <Link href="/marketplace">{t("marketplace.返回应用市场")}</Link>
            </Button>
          </div>
        ) : (
          <>
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8 list-none p-0"
            >
              {pageItems.map((integration) => (
                <li key={integration.id}>
                  <IntegrationCard integration={integration} />
                </li>
              ))}
            </motion.ul>

            {totalPages > 1 ? (
              <nav aria-label={t("marketplace.分页导航")} className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(safePage - 1, 1))}
                    disabled={safePage === 1}
                  >
                    {t("marketplace.上一页")}
                  </Button>

                  {pageWindow[0] > 1 ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)}>
                        1
                      </Button>
                      {pageWindow[0] > 2 ? <span className="px-1 text-gray-400">…</span> : null}
                    </>
                  ) : null}

                  {pageWindow.map((page) => (
                    <Button
                      key={page}
                      variant={safePage === page ? "default" : "outline"}
                      size="sm"
                      aria-current={safePage === page ? "page" : undefined}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}

                  {pageWindow[pageWindow.length - 1] < totalPages ? (
                    <>
                      {pageWindow[pageWindow.length - 1] < totalPages - 1 ? (
                        <span className="px-1 text-gray-400">…</span>
                      ) : null}
                      <Button variant="outline" size="sm" onClick={() => setCurrentPage(totalPages)}>
                        {totalPages}
                      </Button>
                    </>
                  ) : null}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(safePage + 1, totalPages))}
                    disabled={safePage === totalPages}
                  >
                    {t("marketplace.下一页")}
                  </Button>
                </div>
              </nav>
            ) : null}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

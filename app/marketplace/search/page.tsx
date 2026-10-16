"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/ui/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { integrations } from "@/app/data/integrations"
import { IntegrationCard } from "../components/integration-card"
import { FilterSidebar } from "../components/filter-sidebar"
import { Filter, Search, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

/** 中文价格类型 → 内部价格枚举 的映射（常量，置于模块作用域以保证引用稳定）。 */
const PRICE_TYPE_MAP: Record<string, string> = {
  免费: "free",
  免费增值: "freemium",
  付费: "paid",
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const categoryParam = searchParams.get("categories") || ""
  const priceTypesParam = searchParams.get("priceTypes") || ""
  const minRating = Number.parseFloat(searchParams.get("minRating") || "0")
  const minPrice = Number.parseInt(searchParams.get("minPrice") || "0")
  const maxPrice = Number.parseInt(searchParams.get("maxPrice") || "100")

  const [searchQuery, setSearchQuery] = useState(query)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("relevance")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // 解析筛选参数（原始参数字符串即为唯一来源，保持派生简单、依赖明确）
  const selectedCategories = categoryParam ? categoryParam.split(",") : []
  const selectedPriceTypes = priceTypesParam ? priceTypesParam.split(",") : []

  // 结果列表由筛选条件纯派生，避免 effect + setState 带来的额外渲染。
  const filteredIntegrations = useMemo(() => {
    // 在 memo 内部重新解析，使依赖数组与推断依赖完全一致（React Compiler 友好）
    const activeCategories = categoryParam ? categoryParam.split(",") : []
    const activePriceTypes = priceTypesParam ? priceTypesParam.split(",") : []

    // 筛选集成应用
    let filtered = [...integrations]

    // 搜索关键词筛选
    if (query) {
      const lowerQuery = query.toLowerCase()
      filtered = filtered.filter(
        (integration) =>
          integration.name.toLowerCase().includes(lowerQuery) ||
          integration.description.toLowerCase().includes(lowerQuery) ||
          integration.category.toLowerCase().includes(lowerQuery) ||
          integration.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
      )
    }

    // 类别筛选
    if (activeCategories.length > 0) {
      filtered = filtered.filter((integration) => activeCategories.includes(integration.category))
    }

    // 价格类型筛选
    if (activePriceTypes.length > 0) {
      filtered = filtered.filter((integration) =>
        activePriceTypes.some((type) => integration.price.type === PRICE_TYPE_MAP[type]),
      )
    }

    // 评分筛选
    if (minRating > 0) {
      filtered = filtered.filter((integration) => integration.rating >= minRating)
    }

    // 价格范围筛选
    if (minPrice > 0 || maxPrice < 100) {
      filtered = filtered.filter((integration) => {
        if (integration.price.type === "free") return minPrice === 0
        if (!integration.price.value) return true
        return integration.price.value >= minPrice && integration.price.value <= maxPrice
      })
    }

    // 排序
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "installs":
        filtered.sort((a, b) => b.installCount - a.installCount)
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime())
        break
      case "price-low":
        filtered.sort((a, b) => {
          if (a.price.type === "free") return -1
          if (b.price.type === "free") return 1
          return (a.price.value || 0) - (b.price.value || 0)
        })
        break
      case "price-high":
        filtered.sort((a, b) => {
          if (a.price.type === "free") return 1
          if (b.price.type === "free") return -1
          return (b.price.value || 0) - (a.price.value || 0)
        })
        break
      default:
        // 默认按相关性排序，这里简化为不做特殊处理
        break
    }

    return filtered
  }, [query, categoryParam, priceTypesParam, minRating, minPrice, maxPrice, sortBy])

  // 分页
  const totalPages = Math.ceil(filteredIntegrations.length / itemsPerPage)
  // 筛选条件变化导致页数减少时，将页码收敛到有效范围（替代原先的 setCurrentPage(1) 副作用）。
  const safePage = Math.min(currentPage, Math.max(1, totalPages))
  const paginatedIntegrations = filteredIntegrations.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage)

  const handleSearch = () => {
    // 构建查询参数
    const params = new URLSearchParams()
    params.append("q", searchQuery)

    // 保留其他筛选参数
    if (selectedCategories.length > 0) {
      params.append("categories", selectedCategories.join(","))
    }
    if (selectedPriceTypes.length > 0) {
      params.append("priceTypes", selectedPriceTypes.join(","))
    }
    if (minRating > 0) {
      params.append("minRating", minRating.toString())
    }
    if (minPrice > 0 || maxPrice < 100) {
      params.append("minPrice", minPrice.toString())
      params.append("maxPrice", maxPrice.toString())
    }

    // 跳转到搜索结果页面
    window.location.href = `/marketplace/search?${params.toString()}`
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/marketplace" className="text-blue-600 hover:underline mr-2">
            市场首页
          </Link>
          <span className="text-gray-400 mx-2">/</span>
          <span className="text-gray-600">搜索结果</span>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="搜索集成应用..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
          <Button onClick={handleSearch}>搜索</Button>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            筛选
          </Button>
        </div>

        {showFilters && <FilterSidebar onClose={() => setShowFilters(false)} />}

        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold mb-2 md:mb-0">
            {query ? `"${query}" 的搜索结果` : "浏览集成应用"}
            <span className="text-gray-500 text-lg ml-2">({filteredIntegrations.length})</span>
          </h1>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-gray-500" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="排序方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">相关性</SelectItem>
                <SelectItem value="rating">评分</SelectItem>
                <SelectItem value="installs">安装量</SelectItem>
                <SelectItem value="newest">最新更新</SelectItem>
                <SelectItem value="price-low">价格 (低到高)</SelectItem>
                <SelectItem value="price-high">价格 (高到低)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredIntegrations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold mb-2">未找到匹配的集成应用</h2>
            <p className="text-gray-500 mb-6">尝试使用不同的关键词或筛选条件</p>
            <Button asChild>
              <Link href="/marketplace">返回市场首页</Link>
            </Button>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8"
            >
              {paginatedIntegrations.map((integration) => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))}
            </motion.div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={safePage === 1}
                  >
                    上一页
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={safePage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={safePage === totalPages}
                  >
                    下一页
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-10">
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

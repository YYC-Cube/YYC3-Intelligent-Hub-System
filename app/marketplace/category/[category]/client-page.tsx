"use client"

import { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/ui/navbar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { integrations, subcategories } from "@/app/data/integrations"
import { IntegrationCard } from "../../components/integration-card"
import { SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function CategoryClient() {
  const { category } = useParams()
  const decodedCategory = decodeURIComponent(category as string)
  const [sortBy, setSortBy] = useState("relevance")
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const subCategories = subcategories[decodedCategory as keyof typeof subcategories] || []

  // 结果列表由分类 / 子分类 / 排序条件纯派生，无需 effect + setState。
  const filteredIntegrations = useMemo(() => {
    let filtered = [...integrations].filter((integration) => integration.category === decodedCategory)

    if (selectedSubcategory !== "all") {
      filtered = filtered.filter((integration) => integration.subcategory === selectedSubcategory)
    }

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
    }

    return filtered
  }, [decodedCategory, selectedSubcategory, sortBy])

  const totalPages = Math.ceil(filteredIntegrations.length / itemsPerPage)
  // 筛选条件变化导致页数减少时收敛页码，替代原先的 setCurrentPage(1) 副作用。
  const safePage = Math.min(currentPage, Math.max(1, totalPages))
  const paginatedIntegrations = filteredIntegrations.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/marketplace" className="text-blue-600 hover:underline mr-2">
            市场首页
          </Link>
          <span className="text-gray-400 mx-2">/</span>
          <Link href="/marketplace/categories" className="text-blue-600 hover:underline mr-2">
            分类
          </Link>
          <span className="text-gray-400 mx-2">/</span>
          <span className="text-gray-600">{decodedCategory}</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold mb-2 md:mb-0">
            {decodedCategory}
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

        {subCategories.length > 0 && (
          <div className="mb-6">
            <Tabs defaultValue="all" value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">全部</TabsTrigger>
                {subCategories.map((sub) => (
                  <TabsTrigger key={sub} value={sub}>
                    {sub}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}

        {filteredIntegrations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold mb-2">未找到匹配的集成应用</h2>
            <p className="text-gray-500 mb-6">该类别下暂无集成应用</p>
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

      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-xl font-bold">言语云³ 集成中心</h2>
              <p className="text-gray-400 mt-2">© {new Date().getFullYear()} YY C³-IC. 保留所有权利。</p>
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="hover:text-blue-400 transition-colors">关于我们</Link>
              <Link href="#" className="hover:text-blue-400 transition-colors">联系我们</Link>
              <Link href="#" className="hover:text-blue-400 transition-colors">隐私政策</Link>
              <Link href="#" className="hover:text-blue-400 transition-colors">服务条款</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

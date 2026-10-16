"use client"

import { IntegrationCard } from "@/app/components/integrations/integration-card"
import { SiteFooter } from "@/app/components/site-footer"
import { useI18n } from "@/app/hooks/use-i18n"
import { Button } from "@/components/ui/button"
import { ClientOnly } from "@/components/ui/client-only"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/ui/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { ArrowRight, ChevronDown, Filter, Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ALL_CATEGORY, categories, integrations } from "../data/integrations"
import { CategoryGrid } from "./components/category-grid"
import { FeaturedCarousel } from "./components/featured-carousel"
import { FilterSidebar } from "./components/filter-sidebar"

export default function MarketplacePage() {
  const { t } = useI18n()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  // M-3：「精选推荐」取代语义不符的「全部」（该面板仅展示前 8 个预览 + 浏览更多入口）
  const [activeTab, setActiveTab] = useState("featured")

  // 获取特色集成
  const featuredIntegrations = integrations.filter((integration) => integration.featured).slice(0, 5)

  // 获取新上线的集成
  const newIntegrations = integrations.filter((integration) => integration.new).slice(0, 8)

  // 获取热门集成
  const popularIntegrations = integrations
    .filter((integration) => integration.popular)
    .sort((a, b) => b.installCount - a.installCount)
    .slice(0, 8)

  // 按评分排序的集成
  const topRatedIntegrations = [...integrations]
    .sort((a, b) => b.rating - a.rating)
    .filter((integration) => integration.reviewCount > 50)
    .slice(0, 8)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <ClientOnly fallback={
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <div className="h-12 bg-white/20 rounded animate-pulse mb-4 w-3/4 mx-auto" />
                <div className="h-6 bg-white/20 rounded animate-pulse w-1/2 mx-auto" />
              </div>
            </div>
          </div>
        }>
          {/* 英雄区域 */}
          <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl md:text-5xl font-bold mb-4"
                >
                  {t("marketplace.言语云³ 集成应用市场")}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-xl mb-8 text-blue-100"
                >
                  {t("marketplace.发现并连接强大的集成应用，提升您的业务效率")}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative max-w-2xl mx-auto"
                >
                  <Input
                    type="text"
                    placeholder={t("marketplace.搜索集成应用...")}
                    className="pl-10 pr-4 py-6 rounded-lg text-gray-900 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => {
                      if (searchQuery.trim()) {
                        router.push(`/marketplace/search?q=${encodeURIComponent(searchQuery)}`)
                      }
                    }}
                  >
                    {t("marketplace.搜索")}
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex justify-center mt-4 text-sm"
                >
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center text-blue-100 hover:text-white"
                  >
                    <Filter className="h-4 w-4 mr-1" />
                    {t("marketplace.高级筛选")}
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </button>
                </motion.div>
              </div>
            </div>
          </section>

          <div className="container mx-auto px-4 py-8">
            {/* 筛选侧边栏 */}
            {showFilters && <FilterSidebar onClose={() => setShowFilters(false)} />}

            {/* 特色轮播 */}
            <section className="mb-12">
              <ClientOnly fallback={<div className="h-96 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl animate-pulse" />}>
                <FeaturedCarousel integrations={featuredIntegrations} />
              </ClientOnly>
            </section>

            {/* 分类导航 */}
            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{t("marketplace.浏览分类")}</h2>
                <Button asChild variant="outline" size="sm">
                  <Link href="/marketplace/categories">
                    {t("marketplace.查看全部")}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              {/* L-1：显式排除「全部分类」哨兵值，不依赖索引位置约定 */}
              <CategoryGrid categories={categories.filter((category) => category !== ALL_CATEGORY)} />
            </section>

            {/* 集成列表 */}
            <section>
              {/* M-3：接入真实 TabsContent 面板（a11y：触发器与面板建立 aria 关联），
                首个标签语义修正为「精选推荐」——仅展示前 8 个预览 */}
              <Tabs className="mb-8" value={activeTab} onValueChange={setActiveTab}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">{t("marketplace.集成应用")}</h2>
                  <TabsList>
                    <TabsTrigger value="featured">{t("marketplace.精选推荐")}</TabsTrigger>
                    <TabsTrigger value="new">{t("marketplace.新上线")}</TabsTrigger>
                    <TabsTrigger value="popular">{t("marketplace.热门")}</TabsTrigger>
                    <TabsTrigger value="top-rated">{t("marketplace.高评分")}</TabsTrigger>
                  </TabsList>
                </div>

                <ClientOnly fallback={
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
                    ))}
                  </div>
                }>
                  <TabsContent value="featured">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {integrations
                        .slice(0, 8)
                        .map((integration) => <IntegrationCard key={integration.id} integration={integration} />)}
                    </div>
                  </TabsContent>

                  <TabsContent value="new">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {newIntegrations.map((integration) => (
                        <IntegrationCard key={integration.id} integration={integration} />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="popular">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {popularIntegrations.map((integration) => (
                        <IntegrationCard key={integration.id} integration={integration} />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="top-rated">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {topRatedIntegrations.map((integration) => (
                        <IntegrationCard key={integration.id} integration={integration} />
                      ))}
                    </div>
                  </TabsContent>
                </ClientOnly>
              </Tabs>

              <div className="flex justify-center mt-8">
                <Button asChild size="lg">
                  <Link href="/marketplace/browse">
                    {t("marketplace.浏览更多集成应用")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </section>

            {/* 统计数据 */}
            <section className="mt-16 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{integrations.length}+</div>
                  <div className="text-gray-600">{t("marketplace.可用集成应用")}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {/* L-1：显式计数真实分类（排除「全部分类」哨兵值） */}
                    {categories.filter((category) => category !== ALL_CATEGORY).length}
                  </div>
                  <div className="text-gray-600">{t("marketplace.应用类别")}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {Math.floor(integrations.reduce((sum, integration) => sum + integration.installCount, 0) / 1000)}
                    K+
                  </div>
                  <div className="text-gray-600">{t("marketplace.总安装次数")}</div>
                </div>
              </div>
            </section>
          </div>
        </ClientOnly>
      </main>

      {/* 页脚（L-3：统一组件，消灭空锚点假链接） */}
      <SiteFooter />
    </div>
  )
}

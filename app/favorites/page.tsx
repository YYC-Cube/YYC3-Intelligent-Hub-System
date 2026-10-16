"use client"

import { SiteFooter } from "@/app/components/site-footer"
import { useI18n } from "@/app/hooks/use-i18n"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/ui/navbar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { dataCat, dataIntegrationName } from "@/lib/yyc3/i18n/data"
import { motion } from "framer-motion"
import { ArrowLeft, CheckSquare, Search, Share2, SlidersHorizontal, Square, Trash2 } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { EmptyFavorites } from "../components/favorites/empty-favorites"
import { FavoriteCard } from "../components/favorites/favorite-card"
import { FavoritesProvider, useFavorites } from "../context/favorites-context"
import { integrations } from "../data/integrations"

function FavoritesPageContent() {
  const { t } = useI18n()
  const { favoritesData, clearFavorites, removeFavorite, loading } = useFavorites()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isSelectMode, setIsSelectMode] = useState(false)
  const [showClearDialog, setShowClearDialog] = useState(false)
  const { toast } = useToast()

  // 获取所有收藏的集成应用的类别
  const categories = ["all", ...Array.from(new Set(favoritesData.map((item) => item.category)))]

  // 筛选和排序收藏列表（纯派生，直接由收藏数据与筛选条件计算）
  const filteredFavorites = useMemo(() => {
    let filtered = [...favoritesData]

    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.developer.toLowerCase().includes(query),
      )
    }

    // 类别筛选
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    // 排序
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "price":
        filtered.sort((a, b) => {
          if (a.price.type === "free") return -1
          if (b.price.type === "free") return 1
          return (a.price.value || 0) - (b.price.value || 0)
        })
        break
      case "recent":
      default:
        // 保持原顺序，假设最近添加的在前面
        break
    }

    return filtered
  }, [favoritesData, searchQuery, sortBy, selectedCategory])

  // 处理全选/取消全选
  const handleToggleSelectAll = () => {
    if (selectedItems.length === filteredFavorites.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredFavorites.map((item) => item.id))
    }
  }

  // 处理选择单个项目
  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]))
  }

  // 处理删除选中项目（B-1 修复：真实移除收藏，而非仅提示）
  const handleDeleteSelected = () => {
    selectedItems.forEach((id) => removeFavorite(id))
    toast({
      title: t("favorites.已删除选中的收藏"),
      description: t("favorites.已从收藏列表中移除 {count} 个集成应用", { count: String(selectedItems.length) }),
    })
    setSelectedItems([])
    setIsSelectMode(false)
  }

  // 处理清空所有收藏
  const handleClearAll = () => {
    clearFavorites()
    setShowClearDialog(false)
    toast({
      title: t("favorites.收藏列表已清空"),
      description: t("favorites.所有集成应用已从您的收藏列表中移除"),
    })
  }

  // 处理分享收藏列表
  const handleShare = () => {
    const shareText = `${t("favorites.我在言语云³集成中心收藏了这些集成应用：")}\n${favoritesData.map((item) => dataIntegrationName(item.name)).join(", ")}`

    if (navigator.share) {
      navigator
        .share({
          title: t("favorites.我的收藏集成应用"),
          text: shareText,
          url: window.location.href,
        })
        .catch((error) => console.log("分享失败", error))
    } else {
      navigator.clipboard.writeText(shareText)
      toast({
        title: t("favorites.分享链接已复制"),
        description: t("favorites.收藏列表链接已复制到剪贴板"),
      })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (favoritesData.length === 0) {
    return <EmptyFavorites />
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">{t("favorites.我的收藏")}</h1>
          <p className="text-gray-500">{t("favorites.管理您收藏的 {count} 个集成应用", { count: String(favoritesData.length) })}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {isSelectMode ? (
            <>
              <Button variant="outline" size="sm" onClick={handleToggleSelectAll} className="gap-2">
                {selectedItems.length === filteredFavorites.length ? (
                  <>
                    <CheckSquare className="h-4 w-4" />
                    {t("favorites.取消全选")}
                  </>
                ) : (
                  <>
                    <Square className="h-4 w-4" />
                    {t("favorites.全选")}
                  </>
                )}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
                disabled={selectedItems.length === 0}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {t("favorites.删除所选 ({count})", { count: String(selectedItems.length) })}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsSelectMode(false)}>
                {t("favorites.取消")}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsSelectMode(true)} className="gap-2">
                <CheckSquare className="h-4 w-4" />
                {t("favorites.选择")}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                <Share2 className="h-4 w-4" />
                {t("favorites.分享")}
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setShowClearDialog(true)} className="gap-2">
                <Trash2 className="h-4 w-4" />
                {t("favorites.清空")}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder={t("favorites.搜索收藏的集成应用...")}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-gray-500" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("favorites.排序方式")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">{t("favorites.最近添加")}</SelectItem>
              <SelectItem value="name">{t("favorites.名称")}</SelectItem>
              <SelectItem value="rating">{t("favorites.评分")}</SelectItem>
              <SelectItem value="price">{t("favorites.价格")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {categories.length > 1 && (
        <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="all">{t("favorites.全部")}</TabsTrigger>
            {categories
              .filter((cat) => cat !== "all")
              .map((category) => (
                <TabsTrigger key={category} value={category}>
                  {dataCat(category)}
                </TabsTrigger>
              ))}
          </TabsList>
        </Tabs>
      )}

      {filteredFavorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2">{t("favorites.未找到匹配的集成应用")}</h2>
          <p className="text-gray-500 mb-6">{t("favorites.尝试使用不同的搜索关键词或筛选条件")}</p>
          <Button onClick={() => setSearchQuery("")}>{t("favorites.清除搜索")}</Button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8"
        >
          {filteredFavorites.map((integration) => (
            <FavoriteCard
              key={integration.id}
              integration={integration}
              showSelectCheckbox={isSelectMode}
              isSelected={selectedItems.includes(integration.id)}
              onSelect={() => handleSelectItem(integration.id)}
            />
          ))}
        </motion.div>
      )}

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("favorites.确认清空收藏列表？")}</AlertDialogTitle>
            <AlertDialogDescription>{t("favorites.此操作将删除您收藏的所有集成应用。此操作无法撤销。")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("favorites.取消")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearAll}>{t("favorites.确认")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default function FavoritesPage() {
  const { t } = useI18n()

  return (
    <FavoritesProvider integrations={integrations}>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Link href="/marketplace" className="text-blue-600 hover:underline mr-2">
              <ArrowLeft className="mr-2 h-4 w-4 inline" />
              {t("favorites.返回市场")}
            </Link>
          </div>

          <FavoritesPageContent />
        </main>

        {/* 页脚（L-3：统一组件，消灭空锚点假链接） */}
        <SiteFooter />
      </div>
    </FavoritesProvider>
  )
}

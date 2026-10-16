"use client"

import { ALL_CATEGORY, categories, PRICE_FILTER_MAX } from "@/app/data/integrations"
import { useI18n } from "@/app/hooks/use-i18n"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { dataCat, tc } from "@/lib/yyc3/i18n/data"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface FilterSidebarProps {
  onClose: () => void
}

export function FilterSidebar({ onClose }: FilterSidebarProps) {
  const { t } = useI18n()
  const router = useRouter()
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  // H-6：上限取数据层常量 PRICE_FILTER_MAX（120），可表达付费价格全域 [10,109]
  const [priceRange, setPriceRange] = useState([0, PRICE_FILTER_MAX])
  const [ratingFilter, setRatingFilter] = useState(0)
  const [selectedPriceTypes, setSelectedPriceTypes] = useState<string[]>([])

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handlePriceTypeChange = (type: string) => {
    // M-6：回调形参命名 item，避免遮蔽外层 useI18n 的 t
    setSelectedPriceTypes((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type],
    )
  }

  const applyFilters = () => {
    // 构建查询参数
    const params = new URLSearchParams()

    if (selectedCategories.length > 0) {
      params.append("categories", selectedCategories.join(","))
    }

    if (selectedPriceTypes.length > 0) {
      params.append("priceTypes", selectedPriceTypes.join(","))
    }

    if (ratingFilter > 0) {
      params.append("minRating", ratingFilter.toString())
    }

    if (priceRange[0] > 0 || priceRange[1] < PRICE_FILTER_MAX) {
      params.append("minPrice", priceRange[0].toString())
      params.append("maxPrice", priceRange[1].toString())
    }

    // SPA 内跳转到搜索结果页，保留客户端状态并避免静态导出整页刷新
    router.push(`/marketplace/search?${params.toString()}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      <Card className="p-6 relative">
        <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={onClose} aria-label={t("marketplace.关闭筛选")}>
          <X className="h-4 w-4" />
        </Button>

        <h3 className="text-lg font-semibold mb-4">{t("marketplace.高级筛选")}</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 类别筛选 */}
          <div>
            <h4 className="font-medium mb-2">{t("marketplace.类别")}</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {/* L-1：显式排除「全部分类」哨兵值，不依赖索引位置约定 */}
              {categories.filter((category) => category !== ALL_CATEGORY).map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
                  />
                  <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                    {dataCat(category)}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* 价格筛选 */}
          <div>
            <h4 className="font-medium mb-2">{t("marketplace.价格类型")}</h4>
            <div className="space-y-2 mb-4">
              {["免费", "免费增值", "付费"].map((type, index) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`price-type-${index}`}
                    checked={selectedPriceTypes.includes(type)}
                    onCheckedChange={() => handlePriceTypeChange(type)}
                  />
                  <Label htmlFor={`price-type-${index}`} className="text-sm cursor-pointer">
                    {tc("marketplace", type)}
                  </Label>
                </div>
              ))}
            </div>

            <h4 className="font-medium mb-2">
              {t("marketplace.价格范围 (¥{min} - ¥{max})", { min: String(priceRange[0]), max: String(priceRange[1]) })}
            </h4>
            <Slider value={priceRange} min={0} max={PRICE_FILTER_MAX} step={5} onValueChange={setPriceRange} className="mb-6" />
          </div>

          {/* 评分筛选 */}
          <div>
            <h4 className="font-medium mb-2">{t("marketplace.最低评分 ({rating}星)", { rating: String(ratingFilter) })}</h4>
            <Slider
              value={[ratingFilter]}
              min={0}
              max={5}
              step={0.5}
              onValueChange={(value) => setRatingFilter(value[0])}
              className="mb-6"
            />

            <div className="flex justify-end mt-4">
              <Button onClick={applyFilters}>{t("marketplace.应用筛选")}</Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

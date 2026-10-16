"use client"

import { Button } from "@/components/ui/button"
import { Heart, Search } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useI18n } from "@/app/hooks/use-i18n"

export function EmptyFavorites() {
  const { t } = useI18n()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center mb-6">
        <Heart className="h-10 w-10 text-pink-500" />
      </div>
      <h2 className="text-2xl font-bold mb-2">{t("favorites.暂无收藏")}</h2>
      <p className="text-gray-500 max-w-md mb-8">
        {t("favorites.浏览集成应用市场，点击心形图标将您感兴趣的集成应用添加到收藏列表中，方便以后查看和安装。")}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg">
          <Link href="/marketplace">
            <Search className="mr-2 h-4 w-4" />
            {t("favorites.浏览集成应用")}
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/marketplace/popular">{t("favorites.查看热门集成")}</Link>
        </Button>
      </div>
    </motion.div>
  )
}

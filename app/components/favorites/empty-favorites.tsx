"use client"

import { EmptyState } from "@/app/components/ui/empty-state"
import { useI18n } from "@/app/hooks/use-i18n"
import { Button } from "@/components/ui/button"
import { Heart, Search } from "lucide-react"
import Link from "next/link"

/**
 * 收藏空态 —— 收敛至统一 EmptyState 四段式规格（图标 + 标题 + 描述 + 双 CTA），
 * 与列表空态、卡片内空态共享同一视觉规格。
 */
export function EmptyFavorites() {
  const { t } = useI18n()

  return (
    <EmptyState
      icon={<Heart className="h-10 w-10 text-brand-500" aria-hidden="true" />}
      title={t("favorites.暂无收藏")}
      description={t(
        "favorites.浏览集成应用市场，点击心形图标将您感兴趣的集成应用添加到收藏列表中，方便以后查看和安装。"
      )}
      actions={
        <>
          <Button asChild size="lg">
            <Link href="/marketplace">
              <Search className="mr-2 h-4 w-4" />
              {t("favorites.浏览集成应用")}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/marketplace/popular">{t("favorites.查看热门集成")}</Link>
          </Button>
        </>
      }
    />
  )
}

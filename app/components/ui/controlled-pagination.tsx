"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { useI18n } from "@/app/hooks/use-i18n"
import { buildPageWindow } from "@/app/utils/pagination"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  Pagination as PaginationRoot,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

type ControlledPaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  /** 页码窗口内展示的页码数量，默认 5 */
  windowSize?: number
  className?: string
}

/**
 * YYC³ 全站唯一受控分页组件（列表与分页交互规范的组件化落地）。
 *
 * 全站禁止业务页手写分页（此前 marketplace 域 3 处手写实现存在
 * 视觉/无障碍/首尾页跳转三种不一致），统一收敛至本组件：
 * - 窗口化页码（buildPageWindow）+ 首尾省略号 + 上一页/下一页
 * - 当前页 outline+disabled、其余 ghost，aria-current 标注
 * - 「第 X 页，共 Y 页」aria-live 提示（读屏可感知）
 */
export function ControlledPagination({
  currentPage,
  totalPages,
  onPageChange,
  windowSize = 5,
  className,
}: ControlledPaginationProps) {
  const { t } = useI18n()

  const safeCurrent = Math.min(Math.max(1, currentPage), Math.max(1, totalPages))
  const pages = buildPageWindow(safeCurrent, totalPages, windowSize)
  const showStartEllipsis = pages.length > 0 && pages[0] > 1
  const showEndEllipsis =
    pages.length > 0 && pages[pages.length - 1] < totalPages

  return (
    <PaginationRoot className={className}>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="outline"
            size="icon"
            aria-label={t("ui.上一页")}
            onClick={() => onPageChange(safeCurrent - 1)}
            disabled={safeCurrent <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </PaginationItem>

        {showStartEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {pages.map((page) => (
          <PaginationItem key={page}>
            <button
              type="button"
              aria-label={t("ui.第 {page} 页", { page: String(page) })}
              aria-current={page === safeCurrent ? "page" : undefined}
              disabled={page === safeCurrent}
              onClick={() => onPageChange(page)}
              className={cn(
                buttonVariants({
                  variant: page === safeCurrent ? "outline" : "ghost",
                  size: "icon",
                })
              )}
            >
              {page}
            </button>
          </PaginationItem>
        ))}

        {showEndEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        <PaginationItem>
          <Button
            variant="outline"
            size="icon"
            aria-label={t("ui.下一页")}
            onClick={() => onPageChange(safeCurrent + 1)}
            disabled={safeCurrent >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </PaginationItem>

        <PaginationItem aria-live="polite">
          <span className="text-sm text-muted-foreground px-2 whitespace-nowrap">
            {t("integrations.第 {current} 页，共 {total} 页", {
              current: String(safeCurrent),
              total: String(totalPages),
            })}
          </span>
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  )
}

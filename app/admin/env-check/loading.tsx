import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * /admin/env-check 路由级骨架。
 *
 * 结构与页面新页头（PageHeader：面包屑 + 标题/描述 + 操作区）及主体卡片对齐，
 * 加载完成后无布局跳动。
 */
export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-page px-4 py-8" aria-busy="true">
      {/* PageHeader 骨架：面包屑 + 标题/描述 + 操作按钮 */}
      <div className="mb-6 space-y-3">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-8 w-64 max-w-full" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
          <Skeleton className="h-8 w-24 shrink-0 rounded-md" />
        </div>
      </div>

      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <Skeleton className="mb-6 h-24 w-full" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-10 w-40" />
        </CardFooter>
      </Card>
    </div>
  )
}

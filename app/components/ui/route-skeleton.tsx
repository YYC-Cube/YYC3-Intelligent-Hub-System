import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface RouteSkeletonProps {
  /** grid：页头 + 卡片网格（列表/市场页）；detail：标题块 + 双栏（详情/文档页） */
  variant?: 'grid' | 'detail';
  /** 网格卡片数量（grid 变体） */
  count?: number;
  className?: string;
}

/**
 * YYC³ 路由级骨架屏 —— 数据四态之「加载中」在路由切换的统一表达。
 *
 * 替代 6 处 `export default function Loading() { return null }` 空实现
 * （空实现导致路由切换白屏闪变，违反加载态可感知原则）：
 * - 骨架色统一 bg-muted + motion-skeleton（1.6s，尊重 reduced-motion）；
 * - grid 变体模拟「页头标题 + 筛选条 + 卡片网格」实际布局，减少内容加载后的布局跳变（CLS）。
 */
export function RouteSkeleton({ variant = 'grid', count = 8, className }: RouteSkeletonProps) {
  if (variant === 'detail') {
    return (
      <div
        role="status"
        aria-busy="true"
        className={cn('mx-auto w-full max-w-5xl space-y-6 p-6', className)}
      >
        <div className="space-y-3">
          <Skeleton className="h-8 w-2/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>
        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="space-y-3">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div role="status" aria-busy="true" className={cn('w-full space-y-6 p-4 md:p-6', className)}>
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-64 max-w-full" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

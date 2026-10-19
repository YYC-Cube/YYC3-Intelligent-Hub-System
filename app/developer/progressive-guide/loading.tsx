import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProgressiveGuideLoading() {
  return (
    <div className="min-h-screen bg-background pb-12">
      {/* 页面标题骨架 */}
      <div className="bg-gradient-to-r from-primary to-accent text-white py-12 px-4">
        <div className="mx-auto w-full max-w-page">
          <Skeleton className="h-10 w-64 bg-white/20 mb-4" />
          <Skeleton className="h-6 w-96 bg-white/20 mb-8" />

          {/* 总体进度骨架 */}
          <div className="mt-8 bg-white/20 p-4 rounded-lg backdrop-blur-sm max-w-md">
            <div className="flex justify-between mb-2">
              <Skeleton className="h-5 w-32 bg-white/20" />
              <Skeleton className="h-5 w-10 bg-white/20" />
            </div>
            <Skeleton className="h-2 w-full bg-white/20" />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-page px-4 mt-8">
        {/* 标签骨架 */}
        <div className="mb-8">
          <Skeleton className="h-10 w-64 rounded-md" />
        </div>

        {/* 卡片骨架 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-2 w-full" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>

                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />

                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>

                <Skeleton className="h-9 w-full rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 推荐资源骨架 */}
        <div className="mt-12">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-9 w-full rounded-md" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

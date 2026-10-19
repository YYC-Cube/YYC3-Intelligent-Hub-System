import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ModuleDetailLoading() {
  return (
    <div className="min-h-screen bg-background pb-12">
      {/* 面包屑导航骨架 */}
      <div className="bg-card border-b">
        <div className="mx-auto w-full max-w-page px-4 py-4">
          <div className="flex items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 mx-2" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-4 mx-2" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-page px-4 py-8">
        {/* 模块标题和进度骨架 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-6 w-full max-w-2xl mb-4" />

          <div className="flex items-center mb-4">
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="bg-card p-4 rounded-lg border mb-4">
            <div className="flex justify-between mb-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-12" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        </div>

        {/* 内容区域骨架 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧：步骤列表骨架 */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border p-4">
              <Skeleton className="h-6 w-24 mb-4" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center p-3 border rounded-md">
                    <Skeleton className="h-6 w-6 rounded-full mr-3" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-1" />
                      <div className="flex items-center">
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧：内容显示骨架 */}
          <div className="lg:col-span-3">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Skeleton className="h-10 w-10 rounded-full mr-3" />
                  <div>
                    <Skeleton className="h-6 w-48 mb-1" />
                    <div className="flex items-center">
                      <Skeleton className="h-4 w-24 mr-2" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </div>

                <Skeleton className="h-px w-full my-4" />

                {/* 步骤内容骨架 */}
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-5/6" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </CardContent>
            </Card>

            {/* 导航按钮骨架 */}
            <div className="flex justify-between">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

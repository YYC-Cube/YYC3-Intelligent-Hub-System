import { cn } from "@/lib/utils"

/**
 * 唯一内容容器令牌：max-w-page(80rem) + px-4 + py-8。
 *
 * 全项目禁止再出现 container mx-auto / 裸 max-w-4xl 等旁路写法，
 * 内容宽度唯一真源 = tailwind.config.ts 的 maxWidth.page 令牌。
 */
export function PageContainer({
  className,
  as: Tag = "div",
  children,
}: {
  className?: string
  as?: "div" | "main" | "section"
  children: React.ReactNode
}) {
  return (
    <Tag className={cn("mx-auto w-full max-w-page px-4 py-8", className)}>
      {children}
    </Tag>
  )
}

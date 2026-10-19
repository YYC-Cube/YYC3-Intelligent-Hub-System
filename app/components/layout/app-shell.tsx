import { OfflineBanner } from "@/app/components/error-handling/offline-banner"
import { SiteFooter } from "@/app/components/site-footer"
import { PageTransition } from "@/app/components/ui/page-transition"
import { Navbar } from "@/components/ui/navbar"

/**
 * 站点壳：Navbar + main + SiteFooter + OfflineBanner。
 *
 * - 仅允许在 app/**\/layout.tsx 中使用；页面内禁止直接挂载 Navbar/Footer/SiteFooter
 *   例外：根路由 app/page.tsx（无路由组 layout 可挂）可在页面内直接使用 AppShell。
 * - main 持有 flex-1 与语义地标，页面只负责内容
 * - OfflineBanner（异常体系）：全站唯一离线检测横幅，页面禁止重复挂载
 * - transition（决策②）：可选过渡层，开启后页面内容经由 PageTransition
 *   承载（首帧全屏加载动画 → 内容淡入）；默认关闭，仅重初始化页（如首页）开启
 */
export function AppShell({
  children,
  transition = false,
}: {
  children: React.ReactNode
  transition?: boolean
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main id="main" className="flex-1">
        {transition ? <PageTransition>{children}</PageTransition> : children}
      </main>
      <SiteFooter />
      <OfflineBanner />
    </div>
  )
}

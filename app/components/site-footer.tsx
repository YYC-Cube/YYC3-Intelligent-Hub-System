"use client"

import { useI18n } from "@/app/hooks/use-i18n"

/**
 * 统一页脚组件。
 *
 * L-3：收敛 6 个页面的内联重复页脚，并以非交互文本取代 `href="#"` 空锚点假链接
 * （空锚点链接无导航语义，且对屏幕阅读器构成可达性噪音；
 * 待「关于我们 / 隐私政策」等信息页落地后，可在此恢复为真实路由链接）。
 */
export function SiteFooter({ className = "" }: { className?: string }) {
  const { t } = useI18n()

  return (
    <footer className={`bg-gray-900 text-white py-10 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-xl font-bold">{t("marketplace.言语云³ 集成中心")}</h2>
            <p className="text-gray-400 mt-2">
              {t("marketplace.© {year} YY C³-IC. 保留所有权利。", { year: String(new Date().getFullYear()) })}
            </p>
          </div>
          <div className="flex space-x-6 text-gray-400">
            <span>{t("marketplace.关于我们")}</span>
            <span>{t("marketplace.联系我们")}</span>
            <span>{t("marketplace.隐私政策")}</span>
            <span>{t("marketplace.服务条款")}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

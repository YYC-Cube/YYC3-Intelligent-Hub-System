"use client"

import Link from "next/link"
import { VersionDisplay } from "@/app/components/ui/version-display"
import { t } from "@/lib/yyc3/i18n"

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 公司信息 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">{t("ui.言语云³")}</h3>
            <p className="text-sm text-gray-600">{t("ui.专业的集成中心系统，连接您的所有应用和服务。")}</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">{t("ui.微信")}</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.298c-.019.065-.044.13-.044.2 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.833.413c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 4.882-1.932 7.621-.72-.252-2.537-2.862-4.469-6.365-4.469z" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">{t("ui.微博")}</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.797 2.312c3.252 0 6.797 2.25 6.797 5.906 0 2.343-1.312 4.406-3.375 5.531-.375.188-.563.625-.375 1l.563 1.875c.063.188 0 .375-.188.375-.063 0-.125-.031-.188-.063l-2.25-1.312c-.188-.125-.438-.125-.625-.063-.563.125-1.125.188-1.719.188-3.375 0-6.125-2.25-6.125-5.031 0-2.781 2.75-5.031 6.125-5.031l1.36-.375z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* 产品 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{t("ui.产品")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/integrations" className="text-sm text-gray-600 hover:text-gray-900">
                  {t("ui.集成应用")}
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="text-sm text-gray-600 hover:text-gray-900">
                  {t("ui.应用市场")}
                </Link>
              </li>
              <li>
                <Link href="/ai-assistant" className="text-sm text-gray-600 hover:text-gray-900">
                  {t("ui.AI助手")}
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-sm text-gray-600 hover:text-gray-900">
                  {t("ui.收藏管理")}
                </Link>
              </li>
            </ul>
          </div>

          {/* 支持 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{t("ui.支持")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/developer/guide" className="text-sm text-gray-600 hover:text-gray-900">
                  {t("ui.开发者指南")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">
                  {t("ui.关于我们")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">
                  {t("ui.联系我们")}
                </Link>
              </li>
              <li>
                <Link href="/about/version" className="text-sm text-gray-600 hover:text-gray-900">
                  {t("ui.版本信息")}
                </Link>
              </li>
            </ul>
          </div>

          {/* 法律 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{t("ui.法律")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  {t("ui.隐私政策")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  {t("ui.服务条款")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  {t("ui.Cookie政策")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">{t("ui.© {year} 言语云³集成中心. 保留所有权利.", { year: "2025" })}</p>
            <div className="mt-4 md:mt-0">
              <VersionDisplay />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

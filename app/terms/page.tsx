"use client"

import Link from "next/link"

import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useI18n } from "@/app/hooks/use-i18n"
import { tc } from "@/lib/yyc3/i18n/data"

/** 服务条款章节 */
const SECTIONS = [
  {
    title: "一、服务说明",
    body: "言语云³集成中心为企业与个人用户提供集成应用发现、上架、检索与连接器编排服务。集成应用由第三方开发者或本平台提供，启用前请阅读对应应用的说明与权限范围。",
  },
  {
    title: "二、账号与责任",
    body: "您应妥善保管账号凭证，并对账号下发生的一切操作负责。启用加密功能后，请务必留存恢复凭证；因凭证丢失导致的数据不可恢复，平台不承担相应责任。",
  },
  {
    title: "三、积分与计费",
    body: "集成中心采用积分制计费。积分消耗规则在每次操作前于界面中明示，充值后未消耗的积分可在服务有效期内继续使用。已消耗积分原则上不支持退还。",
  },
  {
    title: "四、使用规范",
    body: "您不得利用本服务从事违法违规活动，不得通过自动化手段恶意请求接口、绕过权限校验或干扰服务正常运行。违反者平台有权暂停或终止其账号。",
  },
  {
    title: "五、免责与变更",
    body: "平台对第三方连接器的可用性、准确性与连续性不作保证。我们保留在必要时调整服务内容与条款的权利，重大变更将通过站内公告方式通知。",
  },
] as const

/**
 * 服务条款页面。
 *
 * @returns 服务条款静态内容视图
 */
export default function TermsPage() {
  const { t } = useI18n()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{t("pages.服务条款")}</h1>
          <p className="text-gray-500 mb-8">{t("pages.最近更新：2026 年 10 月 16 日")}</p>

          <Card>
            <CardHeader>
              <CardTitle>{t("pages.言语云³集成中心服务条款")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {SECTIONS.map((section) => (
                <section key={section.title}>
                  <h2 className="text-lg font-semibold mb-2">{tc("pages", section.title)}</h2>
                  <p className="text-gray-600 leading-relaxed">{tc("pages", section.body)}</p>
                </section>
              ))}

              <div className="pt-4 border-t">
                <p className="text-gray-600">
                  {t("pages.继续使用本服务即表示您已阅读并同意上述条款。如有疑问请前往")}
                  <Link href="/contact" className="text-blue-600 hover:underline mx-1">
                    {t("pages.联系我们")}
                  </Link>
                  {t("pages.。")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

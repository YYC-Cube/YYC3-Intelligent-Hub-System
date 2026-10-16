import Link from "next/link"

import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/** 隐私政策章节 */
const SECTIONS = [
  {
    title: "一、我们收集的信息",
    body: "言语云³集成中心仅在您主动使用服务时收集必要信息，包括账号标识、您创建的收藏与应用启用偏好、以及用于故障排查的匿名运行日志。我们不采集与本服务功能无关的个人信息。",
  },
  {
    title: "二、信息的使用方式",
    body: "所收集信息用于：为您呈现个性化的集成应用推荐、在设备间同步收藏与配置、保障服务安全稳定运行，以及履行法律法规要求的合规义务。",
  },
  {
    title: "三、数据存储与保护",
    body: "您的收藏与偏好数据默认保存在本地设备；启用云端同步后，数据经由加密通道传输并通过持久化抽象层存储。所有凭证类数据在落盘前均经过加密处理，密钥由您自主掌握。",
  },
  {
    title: "四、第三方连接器",
    body: "当您启用第三方集成连接器时，该连接器可能按其自身隐私政策处理数据。我们会在授权前明确提示所需的最小权限范围，您可随时在集成中心撤销授权。",
  },
  {
    title: "五、您的权利",
    body: "您有权访问、更正、导出或删除我们持有的与您相关的数据。如需行使上述权利，可通过「联系我们」页面提交请求，我们将在 15 个工作日内响应。",
  },
] as const

/**
 * 隐私政策页面。
 *
 * @returns 隐私政策静态内容视图
 */
export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">隐私政策</h1>
          <p className="text-gray-500 mb-8">最近更新：2026 年 10 月 16 日</p>

          <Card>
            <CardHeader>
              <CardTitle>言语云³集成中心隐私政策</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {SECTIONS.map((section) => (
                <section key={section.title}>
                  <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
                  <p className="text-gray-600 leading-relaxed">{section.body}</p>
                </section>
              ))}

              <div className="pt-4 border-t">
                <p className="text-gray-600">
                  如对本政策有疑问，请前往
                  <Link href="/contact" className="text-blue-600 hover:underline mx-1">
                    联系我们
                  </Link>
                  。
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

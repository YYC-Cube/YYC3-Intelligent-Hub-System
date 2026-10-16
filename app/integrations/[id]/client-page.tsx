"use client"

import { useParams, notFound } from "next/navigation"
import { integrations, iconMap } from "@/app/data/integrations"
import { Navbar } from "@/components/ui/navbar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink, Plus, Calendar } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useI18n } from "@/app/hooks/use-i18n"
import { dataCat, dataIntegrationDesc, dataIntegrationName } from "@/lib/yyc3/i18n/data"

export default function IntegrationDetailClient() {
  const { t } = useI18n()
  const { id } = useParams()
  const integration = integrations.find((i) => i.id === id)

  if (!integration) {
    notFound()
  }

  const Icon = iconMap[integration.icon as keyof typeof iconMap] || Calendar

  const relatedIntegrations = integrations
    .filter((i) => i.category === integration.category && i.id !== integration.id)
    .slice(0, 3)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Link href="/integrations" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("integrations.返回集成列表")}
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-sm p-6 border"
            >
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${integration.color}20` }}
                >
                  <Icon className="w-8 h-8" style={{ color: integration.color }} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{dataIntegrationName(integration.name)}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {dataCat(integration.category)}
                    </span>
                    <span className="text-sm text-gray-500">ID: {integration.id}</span>
                  </div>
                </div>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-lg font-semibold mb-2">{t("integrations.集成描述")}</h2>
                <p className="text-gray-700 mb-6">{dataIntegrationDesc(integration.description)}</p>

                <h2 className="text-lg font-semibold mb-2">{t("integrations.主要功能")}</h2>
                <ul className="list-disc pl-5 mb-6 space-y-1">
                  <li>{t("integrations.实时数据同步与更新")}</li>
                  <li>{t("integrations.自动化工作流程管理")}</li>
                  <li>{t("integrations.多平台数据整合与分析")}</li>
                  <li>{t("integrations.安全的API连接与认证")}</li>
                  <li>{t("integrations.自定义报表与数据可视化")}</li>
                </ul>

                <h2 className="text-lg font-semibold mb-2">{t("integrations.技术规格")}</h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-sm font-medium">{t("integrations.API版本")}</h3>
                    <p className="text-sm text-gray-500">v2.0</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">{t("integrations.认证方式")}</h3>
                    <p className="text-sm text-gray-500">OAuth 2.0</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">{t("integrations.数据格式")}</h3>
                    <p className="text-sm text-gray-500">JSON, XML</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">{t("integrations.更新频率")}</h3>
                    <p className="text-sm text-gray-500">{t("integrations.实时")}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button asChild className="gap-2">
                  <Link href={`/integrations/${id}/install`}>
                    <Plus className="h-4 w-4" />
                    {t("integrations.安装集成")}
                  </Link>
                </Button>
                <Button variant="outline" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  {t("integrations.查看文档")}
                </Button>
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6 border"
            >
              <h2 className="text-lg font-semibold mb-4">{t("integrations.集成信息")}</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t("integrations.开发者")}</h3>
                  <p className="text-sm">{t("integrations.言语云科技有限公司")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t("integrations.版本")}</h3>
                  <p className="text-sm">3.2.1</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t("integrations.更新日期")}</h3>
                  <p className="text-sm">{t("integrations.2023年12月15日")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t("integrations.许可证")}</h3>
                  <p className="text-sm">{t("integrations.商业许可")}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm p-6 border"
            >
              <h2 className="text-lg font-semibold mb-4">{t("integrations.相关集成")}</h2>
              <div className="space-y-3">
                {relatedIntegrations.map((related) => {
                  const RelatedIcon = related.icon
                  return (
                    <Link key={related.id} href={`/integrations/${related.id}`}>
                      <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${related.color}20` }}
                        >
                          <span style={{ color: related.color }}>
                            {(RelatedIcon as any)({ className: "w-4 h-4" })}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">{dataIntegrationName(related.name)}</h3>
                          <p className="text-xs text-gray-500">{dataCat(related.category)}</p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

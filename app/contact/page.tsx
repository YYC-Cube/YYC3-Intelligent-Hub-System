"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { Mail, MessageSquare, Phone, Send } from "lucide-react"
import { BackgroundPattern } from "../components/ui/background-pattern"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/app/hooks/use-i18n"

export default function ContactPage() {
  const { t } = useI18n()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 模拟表单提交
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: t("pages.消息已发送"),
      description: t("pages.感谢您的留言，我们会尽快回复您。"),
    })

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    })
    setIsSubmitting(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        <section className="relative py-20 bg-white">
          <BackgroundPattern variant="gradient" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                {t("pages.联系我们")}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {t("pages.我们期待听到您的声音。无论是产品咨询、技术支持还是合作机会，请随时与我们联系。")}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="lg:col-span-2"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{t("pages.发送消息")}</CardTitle>
                    <CardDescription>{t("pages.填写下面的表单，我们会尽快回复您")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">{t("pages.姓名")}</Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder={t("pages.您的姓名")}
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">{t("pages.电子邮箱")}</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">{t("pages.主题")}</Label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder={t("pages.消息主题")}
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">{t("pages.消息内容")}</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder={t("pages.请输入您的消息内容...")}
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            {t("pages.发送中...")}
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            {t("pages.发送消息")}
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>{t("pages.联系方式")}</CardTitle>
                    <CardDescription>{t("pages.您可以通过以下方式直接联系我们")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <Mail className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">{t("pages.电子邮件")}</h3>
                        <p className="text-gray-600">china@0379.email</p>
                        <p className="text-sm text-gray-500 mt-1">{t("pages.全天候监控，24小时内回复")}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-green-100 p-3 rounded-full mr-4">
                        <Phone className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">{t("pages.电话")}</h3>
                        <p className="text-gray-600">+86 10 8888 8888</p>
                        <p className="text-sm text-gray-500 mt-1">{t("pages.工作日 9:00-18:00")}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-purple-100 p-3 rounded-full mr-4">
                        <MessageSquare className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">{t("pages.在线客服")}</h3>
                        <p className="text-gray-600">{t("pages.通过网站右下角的聊天窗口")}</p>
                        <p className="text-sm text-gray-500 mt-1">{t("pages.工作日 9:00-22:00")}</p>
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <h3 className="font-medium mb-3">{t("pages.公司地址")}</h3>
                      <p className="text-gray-600">{t("pages.中国北京市海淀区")}</p>
                      <p className="text-gray-600">{t("pages.中关村科技园区")}</p>
                      <p className="text-gray-600">{t("pages.创新大厦B座 15层")}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                {t("pages.常见问题")}
              </h2>
              <p className="text-gray-600">{t("pages.以下是我们收到的一些常见问题。如果您有其他问题，请随时联系我们。")}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("pages.如何开始使用言语云³集成中心？")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      {t("pages.注册账户后，您可以浏览我们的集成目录，选择您需要的集成应用，按照向导完成配置即可开始使用。我们提供详细的文档和视频教程，帮助您快速上手。")}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("pages.言语云³支持哪些集成应用？")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      {t("pages.我们支持数百种流行的SaaS应用和服务，包括CRM、营销自动化、电子商务、项目管理、通信协作等多个领域。您可以在集成目录中浏览所有支持的应用。")}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("pages.如何获取技术支持？")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      {t("pages.我们提供多种支持渠道，包括在线文档、视频教程、社区论坛和客服支持。企业用户还可以获得专属的技术支持服务。您可以通过电子邮件、电话或在线聊天联系我们的支持团队。")}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("pages.言语云³的数据安全如何保障？")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      {t("pages.我们采用企业级安全措施保护您的数据，包括端到端加密、安全的数据传输和存储、严格的访问控制和定期安全审计。我们遵循国际安全标准和最佳实践，确保您的数据安全可靠。")}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

"use client"

import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Mail, Globe, MapPin, Phone, Github } from "lucide-react"
import Image from "next/image"
import { BackgroundPattern } from "../components/ui/background-pattern"
import { useI18n } from "@/app/hooks/use-i18n"

export default function AboutPage() {
  const { t } = useI18n()

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
                {t("pages.关于言语云³")}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {t("pages.我们致力于打造最先进、最易用的集成中心系统，帮助企业连接和管理各类应用，提升业务效率。")}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  {t("pages.我们的使命")}
                </h2>
                <p className="text-gray-600 mb-4">
                  {t("pages.言语云³的使命是通过先进的集成技术，消除系统孤岛，实现数据和流程的无缝连接，帮助企业释放数字化转型的全部潜力。")}
                </p>
                <p className="text-gray-600 mb-4">
                  {t("pages.我们相信，技术应该为人所用，而不是人为技术所困。通过简化复杂的集成过程，我们让每个企业都能轻松享受集成带来的价值。")}
                </p>
                <p className="text-gray-600">
                  {t("pages.无论是初创企业还是大型企业，我们都提供适合其规模和需求的集成解决方案，助力企业在数字化时代保持竞争力。")}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-video rounded-lg overflow-hidden shadow-xl">
                  <Image
                    src="/modern-tech-office-working.png"
                    alt={t("pages.言语云³团队")}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg -z-10"></div>
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg -z-10"></div>
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
              <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                {t("pages.开发团队")}
              </h2>
              <p className="text-gray-600">
                {t("pages.言语云³由一支充满激情和创造力的团队开发，团队成员来自不同背景，但都有着共同的目标：创造最好的集成体验。")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader className="text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                      <Image
                        src="/tech-leader-headshot.png"
                        alt={t("pages.团队成员")}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardTitle>{t("pages.技术负责人")}</CardTitle>
                    <CardDescription>{t("pages.架构设计 & 技术领导")}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-4">
                      {t("pages.负责系统架构设计和技术选型，拥有10年以上云服务和集成平台开发经验。")}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader className="text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                      <Image
                        src="/product-manager-headshot.png"
                        alt={t("pages.团队成员")}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardTitle>{t("pages.产品负责人")}</CardTitle>
                    <CardDescription>{t("pages.产品设计 & 用户体验")}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-4">
                      {t("pages.专注于产品设计和用户体验优化，致力于打造简单易用且功能强大的集成平台。")}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader className="text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                      <Image
                        src="/integration-specialist-headshot.png"
                        alt={t("pages.团队成员")}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardTitle>{t("pages.集成专家")}</CardTitle>
                    <CardDescription>{t("pages.API集成 & 数据转换")}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-4">
                      {t("pages.精通各类API和数据格式，负责开发和维护集成连接器，确保数据流畅无阻。")}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                {t("pages.联系我们")}
              </h2>
              <p className="text-gray-600">
                {t("pages.我们期待听取您的反馈和建议，或者了解您的集成需求。请通过以下方式联系我们。")}
              </p>
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
                    <CardTitle>{t("pages.联系信息")}</CardTitle>
                    <CardDescription>{t("pages.您可以通过以下方式联系我们")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-indigo-500 mr-3" />
                      <span>china@0379.email</span>
                    </div>
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 text-indigo-500 mr-3" />
                      <span>www.yanyucloud.com</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-indigo-500 mr-3" />
                      <span>{t("pages.中国，北京市海淀区")}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-indigo-500 mr-3" />
                      <span>+86 10 8888 8888</span>
                    </div>
                    <div className="flex items-center">
                      <Github className="h-5 w-5 text-indigo-500 mr-3" />
                      <span>github.com/yanyucloud</span>
                    </div>
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
                    <CardTitle>{t("pages.公司信息")}</CardTitle>
                    <CardDescription>{t("pages.YanYu Cloud³ 技术有限公司")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">
                      {t(
                        "pages.YanYu Cloud³ 成立于2020年，是一家专注于云集成和数据互联的技术公司。我们的团队由来自顶尖科技公司的专业人士组成，拥有丰富的云服务、API集成和数据处理经验。",
                      )}
                    </p>
                    <p className="text-gray-600">
                      {t("pages.我们的产品服务于各行各业的企业客户，从初创公司到大型企业，帮助他们实现系统互联、数据流通和业务流程自动化。")}
                    </p>
                    <p className="text-gray-600">
                      {t("pages.© YanYu Cloud³ {year}. 保留所有权利。", { year: String(new Date().getFullYear()) })}
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

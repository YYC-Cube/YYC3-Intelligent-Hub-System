"use client"

import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/ui/navbar"
import { motion } from "framer-motion"
import { Zap, Shield, Globe, Database, CheckCircle, MessageSquare, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { AssistantPanel } from "./components/ai-assistant/assistant-panel"
import { BackgroundPattern } from "./components/ui/background-pattern"
import { PageTransition } from "./components/ui/page-transition"
import { Card3D } from "./components/ui/3d-card"
import { iconMap } from "./data/integrations"
import { brandAssets } from "@/lib/yyc3/brand"
import { useI18n } from "@/app/hooks/use-i18n"
import { dataCat, dataIntegrationDesc, dataIntegrationName } from "@/lib/yyc3/i18n/data"

const integrations = [
  {
    id: "slack",
    name: "Slack聊天",
    description: "连接Slack以简化团队沟通并自动化工作流程。",
    category: "通信协作",
    icon: "Zap",
    color: "#E01E5A",
  },
  {
    id: "google-sheets",
    name: "谷歌表格",
    description: "集成谷歌表格进行实时数据分析和报告生成。",
    category: "数据分析",
    icon: "Database",
    color: "#34A853",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "同步Salesforce数据以增强客户关系管理能力。",
    category: "客户管理",
    icon: "Shield",
    color: "#00A1E0",
  },
  {
    id: "aws",
    name: "亚马逊云服务",
    description: "连接到亚马逊云服务获取云计算和存储解决方案。",
    category: "云服务",
    icon: "Cpu",
    color: "#FF9900",
  },
  {
    id: "github",
    name: "GitHub代码库",
    description: "集成GitHub实现无缝代码管理和团队协作。",
    category: "开发工具",
    icon: "Globe",
    color: "#24292E",
  },
  {
    id: "zoom",
    name: "Zoom视频会议",
    description: "连接Zoom进行视频会议和在线会议。",
    category: "通信协作",
    icon: "Zap",
    color: "#2D8CFF",
  },
  {
    id: "stripe",
    name: "Stripe支付",
    description: "集成Stripe实现安全在线支付和财务管理。",
    category: "财务工具",
    icon: "Shield",
    color: "#6772E5",
  },
  {
    id: "jira",
    name: "Jira项目管理",
    description: "连接Jira进行项目跟踪和问题解决。",
    category: "项目管理",
    icon: "Database",
    color: "#0052CC",
  },
  {
    id: "microsoft-teams",
    name: "Microsoft Teams",
    description: "集成Microsoft Teams实现高效团队协作与沟通。",
    category: "通信协作",
    icon: "MessageSquare",
    color: "#6264A7",
  },
  {    id: "asana",    name: "Asana任务管理",    description: "连接Asana实现高效的项目和任务管理。",    category: "项目管理",    icon: "CheckCircle",    color: "#116466",  },  {    id: "figma",    name: "Figma设计工具",    description: "集成Figma实现设计与开发的无缝协作。",    category: "设计工具",    icon: "Zap",    color: "#0ACF83",  },  {    id: "notion",    name: "Notion笔记协作",    description: "连接Notion实现知识管理和团队协作。",    category: "知识管理",    icon: "Globe",    color: "#2E2E2E",  },]

export default function HomePage() {
  const [showChat, setShowChat] = useState(false)
  const { t } = useI18n()

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        {/* 英雄区域 - 品牌视觉 */}
        <section
          className="relative py-20 md:py-32 overflow-hidden min-h-[600px] flex items-center"
          style={{
            backgroundImage: `url('${brandAssets.desktop}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center left',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-l from-blue-900/90 via-indigo-900/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-950/40" />
          <div className="container relative mx-auto px-4 z-10">
            <div className="ml-auto max-w-2xl">
              <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <motion.h1
                  className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-white leading-tight text-right"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {t("home.YYC³ 集成中心")}
                </motion.h1>
                <motion.p
                  className="text-lg md:text-xl text-blue-100 max-w-xl ml-auto mb-8 font-light text-right"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {t("home.万象归元于云枢 · 深栈智启新纪元")}
                </motion.p>
                <motion.p
                  className="text-base text-blue-200/90 max-w-lg ml-auto mb-10 text-right"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {t("home.连接企业级应用生态，构建智能化集成平台")}
                </motion.p>
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <Button
                    asChild
                    size="lg"
                    className="px-8 py-6 bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-xl shadow-blue-900/30 transition-all duration-300 transform hover:scale-105 border-0"
                  >
                    <Link href="/integrations" className="py-6">
                      {t("home.浏览集成应用")}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-6 bg-indigo-500/90 hover:bg-indigo-500 text-white font-semibold border-2 border-indigo-300/50 hover:border-indigo-200 shadow-lg shadow-indigo-500/25 backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
                    onClick={() => setShowChat(!showChat)}
                  >
                    {showChat ? t("home.隐藏助手") : t("home.AI 智能助手")}
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* AI 助手 */}
        {showChat && <AssistantPanel onClose={() => setShowChat(false)} />}

        {/* 特色区域 - 微兰色渐变缓动（绸缎纹） */}
        <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-blue-300/10 via-indigo-300/10 to-purple-300/10 opacity-30"
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%'],
              opacity: [0.2, 0.4, 0.2]
            }} 
            transition={{ 
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          />
          {/* 绸缎纹效果 */}
          <motion.div
            className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmNWY4ZjkiPjwvcmVjdD4KPC9zdmc+')] opacity-30"
            animate={{ 
              y: [0, -20, 0],
              opacity: [0.2, 0.3, 0.2]
            }} 
            transition={{ 
              duration: 15,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          />
          <BackgroundPattern variant="dots" />
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(165,180,252,0.2)_0%,transparent_70%)]"
            animate={{ 
              scale: [1, 1.1, 1],
            }} 
            transition={{ 
              duration: 8,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              YanYuCloud³ Integration Center
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Zap className="h-10 w-10 text-orange-500" />,
                  title: t("home.快速集成"),
                  description: t("home.一键连接各类应用，无需复杂配置"),
                  gradient: "from-orange-500 to-amber-500",
                  bgGradient: "from-orange-50 via-amber-50 to-white",
                },
                {
                  icon: <Shield className="h-10 w-10 text-green-500" />,
                  title: t("home.安全可靠"),
                  description: t("home.企业级安全保障，数据传输加密处理"),
                  gradient: "from-green-500 to-emerald-500",
                  bgGradient: "from-green-50 via-emerald-50 to-white",
                },
                {
                  icon: <Globe className="h-10 w-10 text-blue-500" />,
                  title: t("home.全球连接"),
                  description: t("home.支持全球各地区服务，无缝跨境协作"),
                  gradient: "from-blue-500 to-cyan-500",
                  bgGradient: "from-blue-50 via-cyan-50 to-white",
                },
                {
                  icon: <Database className="h-10 w-10 text-purple-500" />,
                  title: t("home.数据同步"),
                  description: t("home.实时数据同步，确保信息一致性"),
                  gradient: "from-purple-500 to-fuchsia-500",
                  bgGradient: "from-purple-50 via-fuchsia-50 to-white",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  {/* 悬停渐变背景 */}
                  <motion.div
                    className="absolute inset-0 rounded-xl -z-10 opacity-0 group-hover:opacity-100"
                    animate={{ 
                      background: [
                        `linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(${index % 2 === 0 ? '100,149,237' : '204,174,238'},0.2) 50%, rgba(255,255,255,0) 100%)`,
                        `linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(${index % 2 === 0 ? '100,149,237' : '204,174,238'},0.3) 50%, rgba(255,255,255,0) 100%)`,
                        `linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(${index % 2 === 0 ? '100,149,237' : '204,174,238'},0.2) 50%, rgba(255,255,255,0) 100%)`
                      ]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatType: 'reverse'
                    }}
                  />
                  
                  <Card3D backgroundGradient={feature.bgGradient} className="h-full shadow-lg hover:shadow-xl transition-all duration-500 border border-white/50 hover:-translate-y-1">
                    <div className="flex flex-col items-center text-center h-full p-6">
                      <div className={`mb-4 p-4 rounded-full bg-gradient-to-br ${feature.bgGradient} border border-white/70 shadow-inner transition-all duration-300 group-hover:shadow-lg`}>
                        <motion.div
                          whileHover={{ rotate: 15, scale: 1.2 }}
                          transition={{ duration: 0.2 }}
                        >
                          {feature.icon}
                        </motion.div>
                      </div>
                      <h3
                        className={`text-xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r ${feature.gradient} transition-all duration-300 group-hover:text-lg`}
                      >
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 transition-all duration-300 group-hover:text-gray-700">{feature.description}</p>
                    </div>
                  </Card3D>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 集成引擎 */}
        <section className="py-16 bg-gray-50 relative">
          <BackgroundPattern variant="waves" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                {t("home.集成引擎")}
              </h2>
              <Button
                asChild
                variant="outline"
                className="border-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50"
              >
                <Link href="/integrations">
                  {t("home.查看全部")}
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {integrations.slice(0, 10).map((integration, index) => {
                const Icon = iconMap[integration.icon as keyof typeof iconMap] || iconMap.Zap
                return (
                  <motion.div
                    key={integration.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    {/* 微蓝色渐变背景 */}
                    <motion.div
                      className="absolute inset-0 rounded-xl -z-10 opacity-0 group-hover:opacity-100"
                      animate={{
                        background: [
                          `linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(147,197,253,0.1) 50%, rgba(255,255,255,0) 100%)`,
                          `linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(147,197,253,0.2) 50%, rgba(255,255,255,0) 100%)`,
                          `linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(147,197,253,0.1) 50%, rgba(255,255,255,0) 100%)`
                        ]
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        repeatType: 'reverse'
                      }}
                    />
                    
                    <Card3D className="h-full border border-white/70 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 group bg-white/90 backdrop-blur-sm">
                      {/* 颜色炫变效果 */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100"
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 rounded-xl"
                        animate={{
                          background: [
                            `linear-gradient(135deg, ${integration.color}20 0%, transparent 100%)`,
                            `linear-gradient(135deg, ${integration.color}30 50%, transparent 100%)`,
                            `linear-gradient(135deg, ${integration.color}20 0%, transparent 100%)`
                          ]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatType: 'reverse'
                        }}
                      />
                      <div className="flex flex-col items-center text-center space-y-2 h-full p-4">
                        {/* 增强的图标容器 */}
                        <motion.div
                          className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-md group-hover:shadow-lg"
                          style={{ 
                            backgroundColor: `${integration.color}20`,
                            boxShadow: `0 4px 20px ${integration.color}30`,
                            border: `1px solid ${integration.color}30`
                          }}
                          whileHover={{ 
                            scale: 1.1,
                            boxShadow: `0 6px 25px ${integration.color}40`,
                            border: `1px solid ${integration.color}50`
                          }}
                        >
                          <motion.div
                            whileHover={{ rotate: 15, scale: 1.2 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Icon
                              className="w-8 h-8 transition-transform duration-300 group-hover:scale-125"
                              style={{ color: integration.color }}
                            />
                          </motion.div>
                        </motion.div>
                        
                        {/* 增强的文字样式 */}
                        <h3 className="font-semibold text-base mt-3 transition-all duration-300 group-hover:text-indigo-600 group-hover:font-bold">{dataIntegrationName(integration.name)}</h3>
                        
                        {/* 增强的分类标签 */}
                        <motion.span 
                          className="text-xs px-3 py-1 rounded-full transition-all duration-300 bg-gray-100 text-gray-600"
                          whileHover={{ 
                            scale: 1.05,
                            backgroundColor: `${integration.color}10`,
                            color: integration.color,
                            fontWeight: 500
                          }}
                        >
                          {dataCat(integration.category)}
                        </motion.span>
                        
                        {/* 增强的描述文本 */}
                        <p className="text-xs text-gray-500 flex-grow overflow-hidden group-hover:text-gray-700 transition-colors duration-300">
                          {(() => {
                            const desc = dataIntegrationDesc(integration.description)
                            return desc.length > 100 ? `${desc.substring(0, 100)}...` : desc
                          })()}
                        </p>
                      </div>
                    </Card3D>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* 页脚 */}
        <footer className="bg-gradient-to-r from-gray-900 via-indigo-950 to-purple-900 text-white py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  YanYuCloud³ Integration Center
                </h2>
                <p className="text-gray-400 mt-2">{t("home.© YanYu Cloud³ {year}. 保留所有权利。", { year: String(new Date().getFullYear()) })}</p>
              </div>
              <div className="flex space-x-6">
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  {t("home.关于我们")}
                </Link>
                <Link href="/contact" className="hover:text-blue-400 transition-colors">
                  {t("home.联系我们")}
                </Link>
                <Link href="/privacy" className="hover:text-blue-400 transition-colors">
                  {t("home.隐私政策")}
                </Link>
                <Link href="/terms" className="hover:text-blue-400 transition-colors">
                  {t("home.服务条款")}
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  )
}

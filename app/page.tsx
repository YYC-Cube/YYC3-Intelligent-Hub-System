'use client';

import { AppShell } from '@/app/components/layout/app-shell';
import { useI18n } from '@/app/hooks/use-i18n';
import { Button } from '@/components/ui/button';
import { brandAssets } from '@/lib/yyc3/brand';
import { dataCat, dataIntegrationDesc, dataIntegrationName } from '@/lib/yyc3/i18n/data';
import { ArrowRight, Database, Globe, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { AssistantPanel } from './components/ai-assistant/assistant-panel';
import { BackgroundPattern } from './components/ui/background-pattern';
import { iconMap } from './data/integrations';

const integrations = [
  {
    id: 'slack',
    name: 'Slack聊天',
    description: '连接Slack以简化团队沟通并自动化工作流程。',
    category: '通信协作',
    icon: 'Zap',
    color: '#E01E5A',
  },
  {
    id: 'google-sheets',
    name: '谷歌表格',
    description: '集成谷歌表格进行实时数据分析和报告生成。',
    category: '数据分析',
    icon: 'Database',
    color: '#34A853',
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: '同步Salesforce数据以增强客户关系管理能力。',
    category: '客户管理',
    icon: 'Shield',
    color: '#00A1E0',
  },
  {
    id: 'aws',
    name: '亚马逊云服务',
    description: '连接到亚马逊云服务获取云计算和存储解决方案。',
    category: '云服务',
    icon: 'Cpu',
    color: '#FF9900',
  },
  {
    id: 'github',
    name: 'GitHub代码库',
    description: '集成GitHub实现无缝代码管理和团队协作。',
    category: '开发工具',
    icon: 'Globe',
    color: '#24292E',
  },
  {
    id: 'zoom',
    name: 'Zoom视频会议',
    description: '连接Zoom进行视频会议和在线会议。',
    category: '通信协作',
    icon: 'Zap',
    color: '#2D8CFF',
  },
  {
    id: 'stripe',
    name: 'Stripe支付',
    description: '集成Stripe实现安全在线支付和财务管理。',
    category: '财务工具',
    icon: 'Shield',
    color: '#6772E5',
  },
  {
    id: 'jira',
    name: 'Jira项目管理',
    description: '连接Jira进行项目跟踪和问题解决。',
    category: '项目管理',
    icon: 'Database',
    color: '#0052CC',
  },
  {
    id: 'microsoft-teams',
    name: 'Microsoft Teams',
    description: '集成Microsoft Teams实现高效团队协作与沟通。',
    category: '通信协作',
    icon: 'MessageSquare',
    color: '#6264A7',
  },
  {
    id: 'asana',
    name: 'Asana任务管理',
    description: '连接Asana实现高效的项目和任务管理。',
    category: '项目管理',
    icon: 'CheckCircle',
    color: '#116466',
  },
  {
    id: 'figma',
    name: 'Figma设计工具',
    description: '集成Figma实现设计与开发的无缝协作。',
    category: '设计工具',
    icon: 'Zap',
    color: '#0ACF83',
  },
  {
    id: 'notion',
    name: 'Notion笔记协作',
    description: '连接Notion实现知识管理和团队协作。',
    category: '知识管理',
    icon: 'Globe',
    color: '#2E2E2E',
  },
];

export default function HomePage() {
  const [showChat, setShowChat] = useState(false);
  const { t } = useI18n();

  return (
    <AppShell transition>
      <div className="flex flex-col">
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
          <div className="absolute inset-0 bg-gradient-to-l from-brand-700/90 via-brand-800/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-800/40" />
          <div className="relative mx-auto w-full max-w-page px-4 z-10">
            <div className="ml-auto max-w-2xl">
              <div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-white leading-tight text-right">
                  {t('home.YYC³ 集成中心')}
                </h1>
                <p className="text-lg md:text-xl text-brand-100 max-w-xl ml-auto mb-8 font-light text-right">
                  {t('home.万象归元于云枢 · 深栈智启新纪元')}
                </p>
                <p className="text-base text-brand-200/90 max-w-lg ml-auto mb-10 text-right">
                  {t('home.连接企业级应用生态，构建智能化集成平台')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <Button
                    asChild
                    size="lg"
                    className="px-8 py-6 bg-card text-primary hover:bg-brand-50 font-semibold shadow-xl shadow-brand-700/30 hover:scale-105 border-0"
                  >
                    <Link href="/integrations" className="py-6">
                      {t('home.浏览集成应用')}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-6 bg-accent/90 hover:bg-accent text-accent-foreground font-semibold border-2 border-accent/50 hover:border-accent/70 shadow-lg shadow-accent/25 backdrop-blur-sm hover:scale-105"
                    onClick={() => setShowChat(!showChat)}
                  >
                    {showChat ? t('home.隐藏助手') : t('home.AI 智能助手')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI 助手 */}
        {showChat && <AssistantPanel onClose={() => setShowChat(false)} />}

        {/* 特色区域 - 静态品牌渐变背景（装饰不参与动效） */}
        <section className="py-16 bg-gradient-to-br from-brand-50 via-background to-accent/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-200/10 via-accent/10 to-accent/10 opacity-30" />
          {/* 绸缎纹效果 */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmNWY4ZjkiPjwvcmVjdD4KPC9zdmc+')] opacity-20" />
          <BackgroundPattern variant="dots" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--accent)/0.2)_0%,transparent_70%)]" />
          <div className="mx-auto w-full max-w-page px-4 relative z-10">
            <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              YanYuCloudCube Integration Center
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Zap className="h-10 w-10 text-primary" />,
                  title: t('home.快速集成'),
                  description: t('home.一键连接各类应用，无需复杂配置'),
                  gradient: 'from-primary to-primary/70',
                  bgGradient: 'from-primary/10 via-primary/5 to-background',
                },
                {
                  icon: <Shield className="h-10 w-10 text-primary" />,
                  title: t('home.安全可靠'),
                  description: t('home.企业级安全保障，数据传输加密处理'),
                  gradient: 'from-accent to-accent/70',
                  bgGradient: 'from-accent/10 via-accent/5 to-background',
                },
                {
                  icon: <Globe className="h-10 w-10 text-primary" />,
                  title: t('home.全球连接'),
                  description: t('home.支持全球各地区服务，无缝跨境协作'),
                  gradient: 'from-primary to-accent',
                  bgGradient: 'from-brand-50 via-brand-50 to-background',
                },
                {
                  icon: <Database className="h-10 w-10 text-accent" />,
                  title: t('home.数据同步'),
                  description: t('home.实时数据同步，确保信息一致性'),
                  gradient: 'from-accent to-accent/70',
                  bgGradient: 'from-accent/10 via-accent/5 to-background',
                },
              ].map((feature) => (
                <div key={feature.title} className="group">
                  <div
                    className={`relative h-full rounded-xl border border-border/50 bg-gradient-to-br ${feature.bgGradient} p-6 shadow-lg motion-card hover:-translate-y-1 hover:shadow-xl`}
                  >
                    <div className="flex flex-col items-center text-center h-full">
                      <div className="mb-4 p-4 rounded-full border border-border/70 bg-background/60 shadow-inner transition-shadow duration-fast ease-standard group-hover:shadow-lg">
                        <div className="motion-transform group-hover:rotate-[15deg] group-hover:scale-[1.2]">
                          {feature.icon}
                        </div>
                      </div>
                      <h3
                        className={`text-xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r ${feature.gradient}`}
                      >
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground motion-colors group-hover:text-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 集成引擎 */}
        <section className="py-16 bg-muted relative">
          <BackgroundPattern variant="waves" />
          <div className="mx-auto w-full max-w-page px-4 relative z-10">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent/75">
                {t('home.集成引擎')}
              </h2>
              <Button
                asChild
                variant="outline"
                className="border-2 border-accent/30 hover:border-accent/40 hover:bg-accent/10"
              >
                <Link href="/integrations">{t('home.查看全部')}</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {integrations.slice(0, 10).map((integration) => {
                const Icon = iconMap[integration.icon as keyof typeof iconMap] || iconMap.Zap;
                return (
                  <div key={integration.id} className="group">
                    <div className="relative h-full rounded-xl border border-border/70 bg-card/90 p-4 backdrop-blur-sm motion-card hover:-translate-y-1 hover:shadow-xl">
                      <div className="flex flex-col items-center text-center space-y-2 h-full">
                        {/* 图标容器：颜色来自集成品牌色，仅做 CSS 悬停反馈 */}
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center shadow-md transition-shadow duration-fast ease-standard group-hover:shadow-lg"
                          style={{
                            backgroundColor: `${integration.color}20`,
                            boxShadow: `0 4px 20px ${integration.color}30`,
                            border: `1px solid ${integration.color}30`,
                          }}
                        >
                          <Icon
                            className="w-8 h-8 motion-transform group-hover:rotate-[15deg] group-hover:scale-[1.2]"
                            style={{ color: integration.color }}
                          />
                        </div>

                        <h3 className="font-semibold text-base mt-3 motion-colors group-hover:text-accent">
                          {dataIntegrationName(integration.name)}
                        </h3>

                        <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground motion-colors group-hover:bg-accent/10 group-hover:text-accent">
                          {dataCat(integration.category)}
                        </span>

                        <p className="text-xs text-muted-foreground flex-grow overflow-hidden motion-colors group-hover:text-foreground">
                          {(() => {
                            const desc = dataIntegrationDesc(integration.description);
                            return desc.length > 100 ? `${desc.substring(0, 100)}...` : desc;
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 页脚 */}
        <footer className="bg-gradient-to-r from-brand-950 via-brand-950 to-brand-900 text-white py-10">
          <div className="mx-auto w-full max-w-page px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-accent to-info">
                  YanYuCloudCube Integration Center
                </h2>
                <p className="text-white/70 mt-2">
                  {t('home.© YanYuCloudCube {year}. 保留所有权利。', {
                    year: String(new Date().getFullYear()),
                  })}
                </p>
              </div>
              <div className="flex space-x-6">
                <Link href="/about" className="hover:text-brand-400 transition-colors">
                  {t('home.关于我们')}
                </Link>
                <Link href="/contact" className="hover:text-brand-400 transition-colors">
                  {t('home.联系我们')}
                </Link>
                <Link href="/privacy" className="hover:text-brand-400 transition-colors">
                  {t('home.隐私政策')}
                </Link>
                <Link href="/terms" className="hover:text-brand-400 transition-colors">
                  {t('home.服务条款')}
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </AppShell>
  );
}

"use client"
import { PageContainer } from "@/app/components/layout/page-container"
import { YanyuBadge } from "@/app/components/ui/yanyu-badge"
import { YanyuButton } from "@/app/components/ui/yanyu-button"
import {
  YanyuCard,
  YanyuCardContent,
  YanyuCardDescription,
  YanyuCardFooter,
  YanyuCardHeader,
  YanyuCardTitle,
} from "@/app/components/ui/yanyu-card"
import { YanyuInput } from "@/app/components/ui/yanyu-input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, ChevronRight, Download, ExternalLink, Plus, Search, Settings } from "lucide-react"

export default function DesignSystemExamples() {
  return (
    <PageContainer className="py-10">
      <h1 className="text-3xl font-bold mb-8">YanYuCloudCube集成中心系统 - 组件示例</h1>

      <Tabs defaultValue="integration-cards">
        <TabsList className="mb-6">
          <TabsTrigger value="integration-cards">集成卡片</TabsTrigger>
          <TabsTrigger value="dashboard-widgets">仪表盘组件</TabsTrigger>
          <TabsTrigger value="forms">表单元素</TabsTrigger>
          <TabsTrigger value="navigation">导航组件</TabsTrigger>
        </TabsList>

        <TabsContent value="integration-cards">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <YanyuCard hover="lift">
              <YanyuCardHeader>
                <div className="flex items-center justify-between">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <svg
                      className="h-6 w-6 text-primary"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" x2="12" y1="22.08" y2="12" />
                    </svg>
                  </div>
                  <YanyuBadge variant="success">已连接</YanyuBadge>
                </div>
                <YanyuCardTitle className="mt-4">数据库集成</YanyuCardTitle>
                <YanyuCardDescription>连接到您的数据库并管理数据</YanyuCardDescription>
              </YanyuCardHeader>
              <YanyuCardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">状态</span>
                    <span className="font-medium text-success">正常</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">版本</span>
                    <span>v2.1.0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">上次更新</span>
                    <span>2023-05-15</span>
                  </div>
                </div>
              </YanyuCardContent>
              <YanyuCardFooter>
                <YanyuButton variant="outline" size="sm" className="w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  管理集成
                </YanyuButton>
              </YanyuCardFooter>
            </YanyuCard>

            <YanyuCard variant="secondary" hover="lift">
              <YanyuCardHeader>
                <div className="flex items-center justify-between">
                  <div className="bg-secondary/10 p-2 rounded-md">
                    <svg
                      className="h-6 w-6 text-secondary"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2v8" />
                      <path d="m4.93 10.93 1.41 1.41" />
                      <path d="M2 18h2" />
                      <path d="M20 18h2" />
                      <path d="m19.07 10.93-1.41 1.41" />
                      <path d="M22 22H2" />
                      <path d="m8 22 4-10 4 10" />
                      <path d="M12 14v4" />
                    </svg>
                  </div>
                  <YanyuBadge variant="warning">待更新</YanyuBadge>
                </div>
                <YanyuCardTitle className="mt-4">AI助手集成</YanyuCardTitle>
                <YanyuCardDescription>智能AI助手帮助解决问题</YanyuCardDescription>
              </YanyuCardHeader>
              <YanyuCardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">状态</span>
                    <span className="font-medium text-warning">需要更新</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">版本</span>
                    <span>v1.8.3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">上次更新</span>
                    <span>2023-04-28</span>
                  </div>
                </div>
              </YanyuCardContent>
              <YanyuCardFooter>
                <YanyuButton variant="secondary" size="sm" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  更新集成
                </YanyuButton>
              </YanyuCardFooter>
            </YanyuCard>

            <YanyuCard variant="accent" hover="lift">
              <YanyuCardHeader>
                <div className="flex items-center justify-between">
                  <div className="bg-accent/10 p-2 rounded-md">
                    <svg
                      className="h-6 w-6 text-accent"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <YanyuBadge variant="info">新功能</YanyuBadge>
                </div>
                <YanyuCardTitle className="mt-4">API网关</YanyuCardTitle>
                <YanyuCardDescription>统一管理所有API接口</YanyuCardDescription>
              </YanyuCardHeader>
              <YanyuCardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">状态</span>
                    <span className="font-medium text-info">测试中</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">版本</span>
                    <span>v3.0.0-beta</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">上次更新</span>
                    <span>2023-05-20</span>
                  </div>
                </div>
              </YanyuCardContent>
              <YanyuCardFooter>
                <YanyuButton variant="accent" size="sm" className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  查看详情
                </YanyuButton>
              </YanyuCardFooter>
            </YanyuCard>
          </div>
        </TabsContent>

        <TabsContent value="dashboard-widgets">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <YanyuCard>
              <YanyuCardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">总集成数</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-full">
                    <svg
                      className="h-6 w-6 text-primary"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" x2="12" y1="22.08" y2="12" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-success">
                    <svg
                      className="mr-1 h-4 w-4"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
                    </svg>
                    +12% 本月
                  </div>
                </div>
              </YanyuCardContent>
            </YanyuCard>

            <YanyuCard>
              <YanyuCardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">活跃用户</p>
                    <p className="text-2xl font-bold">1,234</p>
                  </div>
                  <div className="bg-secondary/10 p-3 rounded-full">
                    <svg
                      className="h-6 w-6 text-secondary"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="m22 21-3-3m0 0a5.5 5.5 0 1 0-7.78-7.78 5.5 5.5 0 0 0 7.78 7.78Z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-success">
                    <svg
                      className="mr-1 h-4 w-4"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
                    </svg>
                    +8% 本周
                  </div>
                </div>
              </YanyuCardContent>
            </YanyuCard>

            <YanyuCard>
              <YanyuCardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">API调用</p>
                    <p className="text-2xl font-bold">98.5%</p>
                  </div>
                  <div className="bg-success/10 p-3 rounded-full">
                    <svg
                      className="h-6 w-6 text-success"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-success">
                    <Check className="mr-1 h-4 w-4" />
                    正常运行
                  </div>
                </div>
              </YanyuCardContent>
            </YanyuCard>

            <YanyuCard>
              <YanyuCardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">响应时间</p>
                    <p className="text-2xl font-bold">245ms</p>
                  </div>
                  <div className="bg-warning/10 p-3 rounded-full">
                    <svg
                      className="h-6 w-6 text-warning"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-warning">
                    <svg
                      className="mr-1 h-4 w-4"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
                    </svg>
                    +15ms 今日
                  </div>
                </div>
              </YanyuCardContent>
            </YanyuCard>
          </div>
        </TabsContent>

        <TabsContent value="forms">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <YanyuCard>
              <YanyuCardHeader>
                <YanyuCardTitle>登录表单</YanyuCardTitle>
                <YanyuCardDescription>使用统一的表单元素</YanyuCardDescription>
              </YanyuCardHeader>
              <YanyuCardContent className="space-y-4">
                <div>
                  <label htmlFor="ds-login-email" className="text-sm font-medium mb-2 block">邮箱地址</label>
                  <YanyuInput id="ds-login-email" placeholder="请输入您的邮箱地址" type="email" />
                </div>
                <div>
                  <label htmlFor="ds-login-password" className="text-sm font-medium mb-2 block">密码</label>
                  <YanyuInput id="ds-login-password" placeholder="请输入密码" type="password" />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="remember" className="rounded" />
                  <label htmlFor="remember" className="text-sm">
                    记住我
                  </label>
                </div>
              </YanyuCardContent>
              <YanyuCardFooter className="flex flex-col space-y-2">
                <YanyuButton width="full">登录</YanyuButton>
                <YanyuButton variant="ghost" width="full">
                  忘记密码？
                </YanyuButton>
              </YanyuCardFooter>
            </YanyuCard>

            <YanyuCard>
              <YanyuCardHeader>
                <YanyuCardTitle>搜索表单</YanyuCardTitle>
                <YanyuCardDescription>不同样式的输入框</YanyuCardDescription>
              </YanyuCardHeader>
              <YanyuCardContent className="space-y-4">
                <div>
                  <label htmlFor="ds-input-default" className="text-sm font-medium mb-2 block">默认样式</label>
                  <YanyuInput id="ds-input-default" placeholder="搜索集成应用..." />
                </div>
                <div>
                  <label htmlFor="ds-input-filled" className="text-sm font-medium mb-2 block">填充样式</label>
                  <YanyuInput id="ds-input-filled" variant="filled" placeholder="搜索集成应用..." />
                </div>
                <div>
                  <label htmlFor="ds-input-underlined" className="text-sm font-medium mb-2 block">下划线样式</label>
                  <YanyuInput id="ds-input-underlined" variant="underlined" placeholder="搜索集成应用..." />
                </div>
                <div>
                  <label htmlFor="ds-input-rounded" className="text-sm font-medium mb-2 block">圆角样式</label>
                  <YanyuInput id="ds-input-rounded" rounded="full" placeholder="搜索集成应用..." />
                </div>
              </YanyuCardContent>
              <YanyuCardFooter>
                <YanyuButton variant="outline" className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  搜索
                </YanyuButton>
              </YanyuCardFooter>
            </YanyuCard>
          </div>
        </TabsContent>

        <TabsContent value="navigation">
          <div className="space-y-6">
            <YanyuCard>
              <YanyuCardHeader>
                <YanyuCardTitle>按钮组合</YanyuCardTitle>
                <YanyuCardDescription>不同样式和功能的按钮组合</YanyuCardDescription>
              </YanyuCardHeader>
              <YanyuCardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">主要操作</h3>
                    <div className="flex flex-wrap gap-3">
                      <YanyuButton>
                        <Plus className="mr-2 h-4 w-4" />
                        添加集成
                      </YanyuButton>
                      <YanyuButton variant="secondary">
                        <Download className="mr-2 h-4 w-4" />
                        导出数据
                      </YanyuButton>
                      <YanyuButton variant="outline">
                        <Settings className="mr-2 h-4 w-4" />
                        设置
                      </YanyuButton>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-3">状态按钮</h3>
                    <div className="flex flex-wrap gap-3">
                      <YanyuButton variant="success">
                        <Check className="mr-2 h-4 w-4" />
                        已完成
                      </YanyuButton>
                      <YanyuButton variant="warning">
                        <svg
                          className="mr-2 h-4 w-4"
                          fill="none"
                          height="24"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                          <path d="M12 9v4" />
                          <path d="m12 17 .01 0" />
                        </svg>
                        警告
                      </YanyuButton>
                      <YanyuButton variant="error">
                        <svg
                          className="mr-2 h-4 w-4"
                          fill="none"
                          height="24"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="m15 9-6 6" />
                          <path d="m9 9 6 6" />
                        </svg>
                        错误
                      </YanyuButton>
                      <YanyuButton variant="info">
                        <svg
                          className="mr-2 h-4 w-4"
                          fill="none"
                          height="24"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                        信息
                      </YanyuButton>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-3">导航按钮</h3>
                    <div className="flex flex-wrap gap-3">
                      <YanyuButton variant="ghost">首页</YanyuButton>
                      <YanyuButton variant="ghost">集成中心</YanyuButton>
                      <YanyuButton variant="ghost">应用市场</YanyuButton>
                      <YanyuButton variant="ghost">
                        我的收藏
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </YanyuButton>
                    </div>
                  </div>
                </div>
              </YanyuCardContent>
            </YanyuCard>

            <YanyuCard>
              <YanyuCardHeader>
                <YanyuCardTitle>标签组合</YanyuCardTitle>
                <YanyuCardDescription>不同类型和状态的标签</YanyuCardDescription>
              </YanyuCardHeader>
              <YanyuCardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">状态标签</h3>
                    <div className="flex flex-wrap gap-2">
                      <YanyuBadge variant="success">已连接</YanyuBadge>
                      <YanyuBadge variant="warning">待更新</YanyuBadge>
                      <YanyuBadge variant="error">连接失败</YanyuBadge>
                      <YanyuBadge variant="info">新功能</YanyuBadge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-3">分类标签</h3>
                    <div className="flex flex-wrap gap-2">
                      <YanyuBadge>数据库</YanyuBadge>
                      <YanyuBadge variant="secondary">API</YanyuBadge>
                      <YanyuBadge variant="accent">AI助手</YanyuBadge>
                      <YanyuBadge variant="outline">工具</YanyuBadge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-3">尺寸变体</h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <YanyuBadge size="sm">小号</YanyuBadge>
                      <YanyuBadge>默认</YanyuBadge>
                      <YanyuBadge size="lg">大号</YanyuBadge>
                    </div>
                  </div>
                </div>
              </YanyuCardContent>
            </YanyuCard>
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}

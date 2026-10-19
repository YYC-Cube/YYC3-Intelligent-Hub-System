"use client"

import { CustomTabs } from '@/components/ui/custom-tabs'
import { BarChart2, Bell, FileText, Monitor, Settings, Users } from 'lucide-react'
import { useState } from 'react'

// 示例：设备管理内容
const DeviceManagementContent = () => (
  <div className="p-6 bg-card rounded-md shadow-sm">
    <h3 className="text-lg font-semibold mb-4">设备管理</h3>
    <p className="text-muted-foreground">这里是设备管理的内容区域，可以展示设备列表、状态监控等信息。</p>
    <div className="mt-4 p-4 bg-muted rounded">
      <p>• 设备总数: 128</p>
      <p>• 在线设备: 112</p>
      <p>• 待维护: 16</p>
    </div>
  </div>
)

// 示例：用户管理内容
const UserManagementContent = () => (
  <div className="p-6 bg-card rounded-md shadow-sm">
    <h3 className="text-lg font-semibold mb-4">用户管理</h3>
    <p className="text-muted-foreground">这里是用户管理的内容区域，可以展示用户列表、权限配置等信息。</p>
    <div className="mt-4 p-4 bg-muted rounded">
      <p>• 注册用户: 1,245</p>
      <p>• 活跃用户: 876</p>
      <p>• 管理员: 12</p>
    </div>
  </div>
)

// 示例：系统设置内容
const SystemSettingsContent = () => (
  <div className="p-6 bg-card rounded-md shadow-sm">
    <h3 className="text-lg font-semibold mb-4">系统设置</h3>
    <p className="text-muted-foreground">这里是系统设置的内容区域，可以配置系统参数、安全选项等信息。</p>
    <div className="mt-4 p-4 bg-muted rounded">
      <p>• 系统版本: v2.3.1</p>
      <p>• 最后更新: 2023-10-15</p>
      <p>• 数据库状态: 正常</p>
    </div>
  </div>
)

// 示例：数据分析内容
const DataAnalysisContent = () => (
  <div className="p-6 bg-card rounded-md shadow-sm">
    <h3 className="text-lg font-semibold mb-4">数据分析</h3>
    <p className="text-muted-foreground">这里是数据分析的内容区域，可以展示各类报表和图表信息。</p>
    <div className="mt-4 p-4 bg-muted rounded">
      <p>• 今日访问: 2,345</p>
      <p>• 转化率: 12.5%</p>
      <p>• 平均停留: 4.2分钟</p>
    </div>
  </div>
)

// 示例：通知中心内容
const NotificationCenterContent = () => (
  <div className="p-6 bg-card rounded-md shadow-sm">
    <h3 className="text-lg font-semibold mb-4">通知中心</h3>
    <p className="text-muted-foreground">这里是通知中心的内容区域，可以展示系统通知和消息提醒。</p>
    <div className="mt-4 p-4 bg-muted rounded">
      <p>• 未读消息: 7</p>
      <p>• 系统通知: 3</p>
      <p>• 告警信息: 2</p>
    </div>
  </div>
)

// 示例：文档中心内容
const DocumentCenterContent = () => (
  <div className="p-6 bg-card rounded-md shadow-sm">
    <h3 className="text-lg font-semibold mb-4">文档中心</h3>
    <p className="text-muted-foreground">这里是文档中心的内容区域，可以展示系统文档和使用指南。</p>
    <div className="mt-4 p-4 bg-muted rounded">
      <p>• 用户手册: v2.0</p>
      <p>• API文档: v3.1</p>
      <p>• 开发指南: v1.5</p>
    </div>
  </div>
)

// 主示例页面
const CustomTabsExample = () => {
  // 初始标签数据
  const initialTabs = [
    {
      id: 'device',
      title: '设备管理',
      icon: <Monitor size={20} />,
      content: <DeviceManagementContent />
    },
    {
      id: 'user',
      title: '用户管理',
      icon: <Users size={20} />,
      content: <UserManagementContent />
    },
    {
      id: 'settings',
      title: '系统设置',
      icon: <Settings size={20} />,
      content: <SystemSettingsContent />
    },
    {
      id: 'data',
      title: '数据分析',
      icon: <BarChart2 size={20} />,
      content: <DataAnalysisContent />
    },
    {
      id: 'notification',
      title: '通知中心',
      icon: <Bell size={20} />,
      content: <NotificationCenterContent />
    },
    {
      id: 'document',
      title: '文档中心',
      icon: <FileText size={20} />,
      content: <DocumentCenterContent />
    }
  ]

  // 状态管理
  const [tabs, setTabs] = useState(initialTabs)

  // 处理标签关闭
  const handleTabClose = (id: string) => {
    setTabs(tabs.filter(tab => tab.id !== id))
  }

  // 处理标签变化
  const handleTabChange = (id: string) => {
    console.log('标签切换至:', id)
  }

  return (
    <div className="py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">自定义标签页容器示例</h1>

        <div className="bg-card rounded-lg shadow overflow-hidden">
          {/* 标题栏 */}
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-medium text-foreground">标签页功能演示</h2>
          </div>

          {/* 内容区域 */}
          <div className="p-4">
            {/* 功能说明 */}
            <div className="mb-6 p-4 bg-brand-50 rounded-md">
              <h3 className="font-medium text-brand-600 mb-2">功能特点</h3>
              <ul className="text-primary list-disc pl-5 space-y-1">
                <li>每个标签包含 logo、标题和关闭按钮</li>
                <li>点击标签切换选中状态和对应内容</li>
                <li>点击关闭按钮删除当前标签</li>
                <li>删除选中标签时自动选中左侧相邻标签</li>
                <li>标签过多时支持横向滚动</li>
              </ul>
            </div>

            {/* 自定义标签页组件 */}
            <CustomTabs
              tabs={tabs}
              defaultValue="device"
              onTabClose={handleTabClose}
              onTabChange={handleTabChange}
            />
          </div>
        </div>

        {/* 代码结构说明 */}
        <div className="mt-8 bg-card rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">组件结构说明</h3>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm text-foreground">
            {`// 自定义标签页组件使用示例
<CustomTabs
  tabs={tabs}
  defaultValue="device"
  onTabClose={handleTabClose}
  onTabChange={handleTabChange}
/>

// 标签数据结构
type TabItem = {
  id: string
  title: string
  content: React.ReactNode
  icon?: React.ReactNode
}`}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default CustomTabsExample

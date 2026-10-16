"use client"

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

// 定义标签项的类型
interface TabItem {
  id: string
  title: string
  content: React.ReactNode
  icon?: React.ReactNode
}

interface CustomTabsProps {
  tabs: TabItem[]
  defaultValue?: string
  onTabClose?: (id: string) => void
  onTabChange?: (id: string) => void
  className?: string
}

const CustomTabs: React.FC<CustomTabsProps> = ({
  tabs,
  defaultValue = tabs[0]?.id,
  onTabClose,
  onTabChange,
  className,
}) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue)

  // 处理标签变化
  const handleTabChange = (id: string) => {
    setActiveTab(id)
    onTabChange?.(id)
  }

  // 处理标签关闭
  const handleTabClose = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (onTabClose) {
      onTabClose(id)
    }
    
    // 如果关闭的是当前激活的标签，自动选中左侧相邻标签
    if (id === activeTab && tabs.length > 1) {
      const currentIndex = tabs.findIndex(tab => tab.id === id)
      const newIndex = Math.max(0, currentIndex - 1)
      const newActiveTab = tabs[newIndex].id
      setActiveTab(newActiveTab)
      onTabChange?.(newActiveTab)
    }
  }

  // 确保有标签数据
  if (tabs.length === 0) {
    return <div className="w-full h-[50px] flex items-center justify-center text-gray-500">暂无标签</div>
  }

  return (
    <div className={cn("w-full", className)}>
      {/* 横向滚动的标签列表 */}
      <div className="overflow-x-auto whitespace-nowrap h-[50px] flex items-center px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex space-x-[8px]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                flex items-center h-[36px] px-[12px] py-[8px] rounded-[4px] 
                font-medium text-[14px] transition-all 
                ${activeTab === tab.id 
                  ? 'bg-[#fff] text-[#333] border-2 border-[#2c83f2]' 
                  : 'bg-[#f5f5f5] text-[#666] border border-[#eee]'}
              `}
            >
              {/* 主题 logo */}
              <div className="w-[20px] h-[20px] mr-[8px]">
                {tab.icon || (
                  <div className="w-full h-full bg-[#2c83f2] rounded-full flex items-center justify-center text-white text-xs">
                    {tab.title.charAt(0)}
                  </div>
                )}
              </div>
              
              {/* 标题文字 */}
              <span>{tab.title}</span>
              
              {/* 关闭按钮 */}
              {onTabClose && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTabClose(tab.id, e);
                  }}
                  className="ml-[12px] w-[16px] h-[16px] flex items-center justify-center rounded-full hover:bg-gray-200"
                >
                  <X size={12} className="text-gray-500" />
                </button>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* 标签内容区域 */}
      <div className="mt-2">
        {tabs.map((tab) => (
          <div 
            key={tab.id} 
            className={activeTab === tab.id ? 'block' : 'hidden'}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  )
}

CustomTabs.displayName = "CustomTabs"

export { CustomTabs }
'use client';

import { X } from 'lucide-react';
import * as React from 'react';

import { useI18n } from '@/app/hooks/use-i18n';
import { cn } from '@/lib/utils';

// 定义标签项的类型
interface TabItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface CustomTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  onTabClose?: (id: string) => void;
  onTabChange?: (id: string) => void;
  className?: string;
}

const CustomTabs: React.FC<CustomTabsProps> = ({
  tabs,
  defaultValue = tabs[0]?.id,
  onTabClose,
  onTabChange,
  className,
}) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  // 处理标签变化
  const handleTabChange = (id: string) => {
    setActiveTab(id);
    onTabChange?.(id);
  };

  // 处理标签关闭
  const handleTabClose = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (onTabClose) {
      onTabClose(id);
    }

    // 如果关闭的是当前激活的标签，自动选中左侧相邻标签
    if (id === activeTab && tabs.length > 1) {
      const currentIndex = tabs.findIndex((tab) => tab.id === id);
      const newIndex = Math.max(0, currentIndex - 1);
      const newActiveTab = tabs[newIndex].id;
      setActiveTab(newActiveTab);
      onTabChange?.(newActiveTab);
    }
  };

  // 确保有标签数据
  if (tabs.length === 0) {
    return (
      <div className="w-full h-12 flex items-center justify-center text-muted-foreground">
        {t('ui.暂无标签')}
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {/* 横向滚动的标签列表 */}
      <div className="overflow-x-auto whitespace-nowrap h-12 flex items-center px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                flex items-center h-9 px-3 py-2 rounded-sm
                font-medium text-sm transition-[color,background-color,border-color,box-shadow] duration-fast ease-standard
                ${
                  activeTab === tab.id
                    ? 'bg-card text-foreground border-2 border-primary'
                    : 'bg-muted text-muted-foreground border border-border'
                }
              `}
            >
              {/* 主题 logo */}
              <div className="w-5 h-5 mr-2">
                {tab.icon || (
                  <div className="w-full h-full bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs">
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
                  className="ml-3 w-4 h-4 flex items-center justify-center rounded-full hover:bg-muted"
                >
                  <X size={12} className="text-muted-foreground" />
                </button>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 标签内容区域 */}
      <div className="mt-2">
        {tabs.map((tab) => (
          <div key={tab.id} className={activeTab === tab.id ? 'block' : 'hidden'}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

CustomTabs.displayName = 'CustomTabs';

export { CustomTabs };

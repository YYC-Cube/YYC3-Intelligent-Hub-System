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

/**
 * 可关闭型标签页（浏览器标签心智）—— 补齐标准 Tabs 缺失的关闭能力。
 * 无障碍规范：tablist/tab/tabpanel 完整角色 + aria-selected + 方向键/Home/End 导航（roving tabindex）；
 * 关闭按钮与标签按钮为同级兄弟节点（HTML 禁止 button 嵌套 button）。
 */
const CustomTabs: React.FC<CustomTabsProps> = ({
  tabs,
  defaultValue,
  onTabClose,
  onTabChange,
  className,
}) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = React.useState(() => defaultValue ?? tabs[0]?.id);
  const tabListRef = React.useRef<HTMLDivElement>(null);

  const focusTab = (id: string) => {
    const btn = tabListRef.current?.querySelector<HTMLButtonElement>(
      `[role="tab"][data-tab-id="${id}"]`
    );
    btn?.focus();
  };

  const moveFocus = (id: string, offset: number) => {
    const index = tabs.findIndex((tab) => tab.id === id);
    if (index === -1) return;
    const next = tabs[(index + offset + tabs.length) % tabs.length];
    focusTab(next.id);
  };

  // 处理标签变化
  const handleTabChange = (id: string) => {
    setActiveTab(id);
    onTabChange?.(id);
  };

  // 处理标签关闭
  const handleTabClose = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    onTabClose?.(id);

    // 如果关闭的是当前激活的标签，自动选中左侧相邻标签
    if (id === activeTab && tabs.length > 1) {
      const currentIndex = tabs.findIndex((tab) => tab.id === id);
      const newIndex = Math.max(0, currentIndex - 1);
      const newActiveTab = tabs[newIndex].id;
      setActiveTab(newActiveTab);
      onTabChange?.(newActiveTab);
    }
  };

  // 键盘导航（WAI-ARIA Tabs Pattern）
  const handleKeyDown = (id: string, e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        moveFocus(id, 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        moveFocus(id, -1);
        break;
      case 'Home':
        e.preventDefault();
        if (tabs[0]) focusTab(tabs[0].id);
        break;
      case 'End':
        e.preventDefault();
        if (tabs[tabs.length - 1]) focusTab(tabs[tabs.length - 1].id);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleTabChange(id);
        break;
    }
  };

  // 确保有标签数据
  if (tabs.length === 0) {
    return (
      <div className="flex h-12 w-full items-center justify-center text-muted-foreground">
        {t('ui.暂无标签')}
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {/* 横向滚动的标签列表 */}
      <div
        ref={tabListRef}
        role="tablist"
        aria-label={t('ui.标签页')}
        className="flex h-12 items-center overflow-x-auto whitespace-nowrap px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <div key={tab.id} role="presentation" className="relative flex items-center">
              <button
                type="button"
                role="tab"
                data-tab-id={tab.id}
                aria-selected={isActive}
                aria-controls={`custom-tab-panel-${tab.id}`}
                id={`custom-tab-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleTabChange(tab.id)}
                onKeyDown={(e) => handleKeyDown(tab.id, e)}
                className={cn(
                  'flex h-9 items-center rounded-sm border px-3 py-2 pr-9 text-sm font-medium transition-[color,background-color,border-color,box-shadow] duration-fast ease-standard motion-reduce:transition-none',
                  isActive
                    ? 'border-primary bg-card text-foreground'
                    : 'border-transparent bg-muted text-muted-foreground hover:text-foreground'
                )}
              >
                {/* 主题 logo */}
                <span className="mr-2 flex h-5 w-5 items-center justify-center">
                  {tab.icon || (
                    <span className="flex h-full w-full items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {tab.title.charAt(0)}
                    </span>
                  )}
                </span>

                {/* 标题文字 */}
                <span>{tab.title}</span>
              </button>

              {/* 关闭按钮（兄弟节点，禁止嵌套 button） */}
              {onTabClose && (
                <button
                  type="button"
                  aria-label={t('ui.关闭 {title} 标签', { title: tab.title })}
                  onClick={(e) => handleTabClose(tab.id, e)}
                  className="absolute right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X size={12} aria-hidden="true" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 标签内容区域 */}
      <div className="mt-2">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`custom-tab-panel-${tab.id}`}
            aria-labelledby={`custom-tab-${tab.id}`}
            hidden={activeTab !== tab.id}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

CustomTabs.displayName = 'CustomTabs';

export { CustomTabs };

'use client';

import { Navbar } from '@/components/ui/navbar';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

/** 折叠状态的 localStorage 记忆键（跨页/跨会话统一）。 */
const STORAGE_KEY = 'yyc3.console.collapsed';

/**
 * 工作台壳：Navbar + 可折叠左功能栏 + 主区。
 *
 * - 适用全宽工作面（如 /integrations 列表）：主区不做 max-w 收窄，由页面自理
 * - 折叠状态持久化 localStorage，跨页记忆（决策：侧边菜单折叠状态全局统一且有记忆）
 * - 移动端 (<lg) 不渲染左栏，由 sidebar slot 消费方自行处理抽层/降级
 */
export function ConsoleShell({
  sidebar,
  children,
}: {
  sidebar: (collapsed: boolean) => React.ReactNode;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  // 首帧读取记忆，避免闪烁（SSR 默认展开，水合后同步为用户偏好）
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 首帧同步用户偏好，避免侧栏闪烁
    setCollapsed(localStorage.getItem(STORAGE_KEY) === '1');
  }, []);

  const toggle = () => {
    setCollapsed((prev) => {
      localStorage.setItem(STORAGE_KEY, prev ? '0' : '1');
      return !prev;
    });
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <aside
          className={cn(
            'hidden flex-col border-r border-border bg-card transition-[width] duration-slow ease-standard motion-reduce:transition-none lg:flex',
            collapsed ? 'w-14' : 'w-60'
          )}
        >
          {sidebar(collapsed)}
          <button
            type="button"
            onClick={toggle}
            aria-label={collapsed ? '展开菜单' : '折叠菜单'}
            className="mt-auto flex h-10 items-center justify-center border-t border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            {collapsed ? '»' : '«'}
          </button>
        </aside>
        <main id="main" className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

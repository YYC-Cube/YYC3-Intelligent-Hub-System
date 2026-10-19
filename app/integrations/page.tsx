import type { Metadata } from 'next';
import { Suspense } from 'react';
import IntegrationsListClient from './list-client';

import { createMetadata } from '@/lib/yyc3/metadata';

export const metadata: Metadata = createMetadata({
  title: '集成中心',
  description: '管理全部集成应用：分类检索、关键字搜索与批量安装。',
  path: '/integrations/',
});

/**
 * /integrations 列表页（服务端外壳）。
 *
 * 客户端内容（./list-client）消费 useSearchParams（?id= 直达定位），
 * 必须包在 Suspense 边界内才能参与静态导出——否则整页在构建期 CSR bailout，
 * SSG HTML 只剩空的流式占位符（既往缺陷）。
 *
 * fallback 与 ConsoleShell 三段结构（顶栏 / 侧栏 / 主区）对应，
 * 保证水合后首屏骨架不跳动。
 */
function IntegrationsSkeleton() {
  return (
    <div className="flex min-h-screen flex-col" aria-busy="true">
      {/* 顶栏骨架 */}
      <div className="h-16 border-b border-brand-100/50 bg-gradient-to-r from-brand-50/95 to-brand-50/95" />

      <div className="flex flex-1 overflow-hidden">
        {/* 侧栏骨架（配色对齐筛选栏渐变） */}
        <div className="hidden w-64 flex-col gap-2 border-r border-border bg-gradient-to-br from-primary/95 to-info/90 p-4 lg:flex">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-9 motion-skeleton rounded-md bg-white/20" />
          ))}
        </div>

        {/* 主区骨架：搜索条 + 统计卡 + 应用网格 */}
        <div className="flex-1 space-y-4 p-4 md:p-6">
          <div className="h-10 w-full max-w-md motion-skeleton rounded-lg bg-muted" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-20 motion-skeleton rounded-lg border border-border bg-muted/60"
              />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="h-40 motion-skeleton rounded-lg border border-border bg-card"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function IntegrationsPage() {
  return (
    <Suspense fallback={<IntegrationsSkeleton />}>
      <IntegrationsListClient />
    </Suspense>
  );
}

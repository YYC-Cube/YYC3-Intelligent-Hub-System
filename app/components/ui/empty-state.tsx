'use client';

import { useI18n } from '@/app/hooks/use-i18n';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  /** 空态主图标（建议 lucide 线性图标，颜色随容器令牌） */
  icon?: ReactNode;
  /** 空态标题（必有，一句话说明「这里为什么是空的」） */
  title: string;
  /** 补充说明（可选，引导用户下一步） */
  description?: string;
  /** 操作区（可选，1~2 个按钮，主操作在前） */
  actions?: ReactNode;
  /** sm：卡片内嵌空态；default：页面级空态 */
  size?: 'sm' | 'default';
  className?: string;
}

/**
 * YYC³ 统一空态（数据四态之一：加载中 / 空 / 有数据 / 加载失败）。
 *
 * 规格收敛：此前页面存在三种空态规格（IntegrationGrid 一行灰字、EmptyFavorites 完整空态、
 * CommandEmpty 单行文本），本组件统一为「图标容器 + 标题 + 描述 + 操作区」四段式：
 * - 图标容器：brand-100 底 + brand-500 图标（default 尺寸 h-20 w-20 / sm 尺寸 h-12 w-12）
 * - role="status"：读屏可感知；i18n 默认兜底文案随语言切换
 * - 动效：淡入上移 0.5s，与 EmptyFavorites 原有节奏一致
 */
export function EmptyState({
  icon,
  title,
  description,
  actions,
  size = 'default',
  className,
}: EmptyStateProps) {
  const { t } = useI18n();

  return (
    <div
      role="status"
      aria-label={title || t('ui.暂无数据')}
      className={cn(
        'motion-page-enter flex flex-col items-center justify-center px-4 text-center',
        size === 'default' ? 'py-16' : 'py-8',
        className
      )}
    >
      {icon && (
        <div
          className={cn(
            'mb-6 flex items-center justify-center rounded-full bg-brand-100',
            size === 'default' ? 'h-20 w-20' : 'h-12 w-12'
          )}
        >
          {icon}
        </div>
      )}
      <h2 className={cn('font-bold mb-2', size === 'default' ? 'text-2xl' : 'text-lg')}>{title}</h2>
      {description && (
        <p className={cn('mb-8 max-w-md text-muted-foreground', size === 'sm' && 'mb-6 text-sm')}>
          {description}
        </p>
      )}
      {actions && <div className="flex flex-col items-center gap-4 sm:flex-row">{actions}</div>}
    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlertTriangle, Compass, RefreshCw, ShieldAlert, WifiOff } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { useI18n } from '@/app/hooks/use-i18n';

/**
 * YYC³ 统一异常页面（页面级异常唯一出口）。
 *
 * 三层异常体系（与 EmptyState / ErrorDisplay 分工）：
 * - StatusPage    页面级异常：404 / 403 / 500 / 网络错误 —— 全屏四段式
 * - ErrorDisplay  区块级异常：ErrorBoundary fallback / 局部加载失败 —— Card 容器
 * - EmptyState    数据空态：列表空 / 无搜索结果 / 无订阅 —— 四段式（非错误语义）
 *
 * 视觉语言与 EmptyState 同构：圆形图标容器 + 标题 + 描述 + 操作区，
 * 色彩语义遵循 lib/yyc3/status-variants.ts 铁律：
 * - not-found    brand       「找不到」非错误，品牌蓝引导探索
 * - forbidden    warning     权限不足，待人工介入（联系管理员）
 * - server-error destructive 服务异常，失败语义
 * - network-error warning    网络中断，可自恢复
 * - generic      destructive 未知异常兜底
 */
export type StatusPageVariant =
  | 'not-found'
  | 'forbidden'
  | 'server-error'
  | 'network-error'
  | 'generic';

const VARIANT_META: Record<
  StatusPageVariant,
  { icon: typeof Compass; containerCls: string; iconCls: string; codeCls: string }
> = {
  'not-found': {
    icon: Compass,
    containerCls: 'bg-brand-100',
    iconCls: 'text-brand-500',
    codeCls: 'text-brand-500',
  },
  forbidden: {
    icon: ShieldAlert,
    containerCls: 'bg-amber-100 dark:bg-amber-950/40',
    iconCls: 'text-amber-600 dark:text-amber-400',
    codeCls: 'text-amber-600 dark:text-amber-400',
  },
  'server-error': {
    icon: AlertTriangle,
    containerCls: 'bg-destructive/15',
    iconCls: 'text-destructive',
    codeCls: 'text-destructive',
  },
  'network-error': {
    icon: WifiOff,
    containerCls: 'bg-amber-100 dark:bg-amber-950/40',
    iconCls: 'text-amber-600 dark:text-amber-400',
    codeCls: 'text-amber-600 dark:text-amber-400',
  },
  generic: {
    icon: AlertTriangle,
    containerCls: 'bg-destructive/15',
    iconCls: 'text-destructive',
    codeCls: 'text-destructive',
  },
};

interface StatusPageProps {
  /** 异常变体，决定图标、语义色与默认文案/操作 */
  variant?: StatusPageVariant;
  /** 状态码徽章（如 404 / 403 / 500），可选 */
  code?: string;
  /** 覆盖默认标题 */
  title?: string;
  /** 覆盖默认描述 */
  description?: string;
  /** 提供时渲染「重试」主按钮（404 等无重试语义的变体无需传入） */
  onRetry?: () => void;
  /** 完全自定义操作区（覆盖默认按钮组） */
  actions?: ReactNode;
  /** 技术错误编号（digest），仅生产环境展示替代原始报错 */
  errorId?: string;
  className?: string;
}

export function StatusPage({
  variant = 'generic',
  code,
  title,
  description,
  onRetry,
  actions,
  errorId,
  className,
}: StatusPageProps) {
  const { t } = useI18n();
  const meta = VARIANT_META[variant];
  const Icon = meta.icon;

  const defaultCopy: Record<StatusPageVariant, { title: string; description: string }> = {
    'not-found': {
      title: t('errors.页面未找到'),
      description: t(
        'errors.您访问的页面不存在或已被移除。请检查URL是否正确，或返回首页。'
      ),
    },
    forbidden: {
      title: t('errors.无权限访问'),
      description: t('errors.您没有访问此页面的权限，请联系管理员开通相应权限。'),
    },
    'server-error': {
      title: t('errors.服务暂时不可用'),
      description: t('errors.服务器遇到了一些问题，我们正在紧急修复，请稍后重试。'),
    },
    'network-error': {
      title: t('errors.网络连接失败'),
      description: t('errors.网络连接中断或超时，请检查您的网络设置后重试。'),
    },
    generic: {
      title: t('errors.发生了意外错误'),
      description: t('errors.这是一个意外问题，请重试；若问题持续，请联系我们。'),
    },
  };

  const resolvedTitle = title ?? defaultCopy[variant].title;
  const resolvedDescription = description ?? defaultCopy[variant].description;

  const defaultActions = (
    <>
      {onRetry && (
        <Button onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
          {t('errors.重试')}
        </Button>
      )}
      {variant === 'not-found' ? (
        <Button variant="outline" asChild>
          <Link href="/marketplace">{t('errors.浏览集成市场')}</Link>
        </Button>
      ) : variant === 'forbidden' ? (
        <Button variant="outline" asChild>
          <Link href="/contact">{t('errors.联系我们')}</Link>
        </Button>
      ) : (
        <Button variant="outline" asChild>
          <Link href="/">{t('errors.返回首页')}</Link>
        </Button>
      )}
    </>
  );

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'motion-page-enter flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center',
        className
      )}
    >
      <div
        className={cn(
          'mb-6 flex h-20 w-20 items-center justify-center rounded-full',
          meta.containerCls
        )}
      >
        <Icon className={cn('h-10 w-10', meta.iconCls)} aria-hidden="true" />
      </div>

      {code && (
        <p
          className={cn('mb-2 text-sm font-semibold tracking-widest uppercase', meta.codeCls)}
          aria-hidden="true"
        >
          {code}
        </p>
      )}

      <h1 className="mb-3 text-2xl font-bold">{resolvedTitle}</h1>
      <p className="mb-8 max-w-md text-muted-foreground">{resolvedDescription}</p>

      <div className="flex flex-col items-center gap-4 sm:flex-row">
        {actions ?? defaultActions}
      </div>

      {errorId && (
        <p className="mt-8 text-xs text-muted-foreground/70">
          {t('errors.错误编号')}: {errorId}
        </p>
      )}
    </div>
  );
}

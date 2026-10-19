'use client';

import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * YYC³ 进度条 —— 进行中过程的量化表达（安装进度 / 同步进度 / 上传进度）。
 * 语义变体与操作结果四色体系对齐：
 * - default     常规进行中（primary）
 * - success     已完成/接近完成场景
 * - warning     慢速/需要注意的进行中
 * - destructive 错误中止后保留的进度展示
 */
const indicatorVariants = {
  default: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  destructive: 'bg-destructive',
} as const;

type ProgressVariant = keyof typeof indicatorVariants;

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string;
  variant?: ProgressVariant;
}

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value, variant = 'default', indicatorClassName, ...props }, ref) => (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          'h-full w-full flex-1 transition-transform duration-base ease-standard motion-reduce:transition-none',
          indicatorVariants[variant],
          indicatorClassName
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };

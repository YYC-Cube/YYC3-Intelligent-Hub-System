'use client';

import { useI18n } from '@/app/hooks/use-i18n';
import { Progress } from '@/components/ui/progress';
import { BRAND, brandAssets } from '@/lib/yyc3/brand';
import Image from 'next/image';
import { useEffect } from 'react';
import { Spinner } from './spinner';

interface LoadingScreenProps {
  message?: string;
  progress?: number;
  showProgress?: boolean;
  duration?: number;
  onComplete?: () => void;
}

/**
 * L1 全局冷启动加载屏（克制版）。
 *
 * 规范：
 * - 仅保留静态品牌背景 + Logo + 文案 + 单一状态指示，不再叠加光斑/光环/跳动圆点；
 * - 传入 progress 时展示真实进度；未传入时展示不确定态 Spinner，不模拟虚假百分比；
 * - 未受控场景按 duration 触发 onComplete（兼容 GlobalLoadingProvider 的自动收起语义）；
 * - 入场仅一次 200ms，prefers-reduced-motion 下自动禁用。
 */
export function LoadingScreen({
  message,
  progress,
  showProgress = true,
  duration = 3000,
  onComplete,
}: LoadingScreenProps) {
  const { t } = useI18n();

  // 参数未传 message 时在组件内兜底（跟随当前语言）
  const displayMessage = message ?? t('ui.正在加载中...');

  // 未受控时只负责按时结束，不再伪造进度值
  useEffect(() => {
    if (progress !== undefined) return;

    const timer = setTimeout(() => onComplete?.(), duration);
    return () => clearTimeout(timer);
  }, [progress, duration, onComplete]);

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="fixed inset-0 z-backdrop flex items-center justify-center bg-gradient-to-br from-brand-50 via-background to-brand-100"
    >
      <div className="motion-page-enter flex flex-col items-center space-y-6 p-8 text-center">
        {/* 品牌标识 */}
        <Image
          src={brandAssets.logoPng}
          alt={BRAND.name}
          width={80}
          height={80}
          priority
          className="h-20 w-20 object-contain"
        />

        {/* 标题 */}
        <div className="space-y-1">
          <p className="brand-text text-xl font-bold">{t('ui.YanYuCloudCube集成中心系统')}</p>
          <p className="text-xs font-medium text-muted-foreground">
            YanYuCloudCube Integration Center
          </p>
        </div>

        {/* 加载消息 + 状态指示 */}
        <p className="text-sm font-medium text-foreground">{displayMessage}</p>

        {progress !== undefined ? (
          <div className="w-64 space-y-2">
            <Progress value={progress} className="h-1.5" />
            <p className="text-xs text-muted-foreground">{Math.round(progress)}%</p>
          </div>
        ) : showProgress ? (
          <Spinner size="medium" className="text-primary" />
        ) : null}
      </div>
    </div>
  );
}

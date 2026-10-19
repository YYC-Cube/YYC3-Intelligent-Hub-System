interface BackgroundPatternProps {
  variant?: 'default' | 'gradient' | 'dots' | 'waves';
}

/**
 * 页面装饰背景（纯 CSS / SVG，无动画）。
 *
 * 规范：装饰背景不参与动效；此前的鼠标追踪、无限渐变与 SVG 路径动画已移除，
 * 避免非合成属性逐帧绘制。所有实例均随 `prefers-reduced-motion` 保持静态。
 */
export function BackgroundPattern({ variant = 'default' }: BackgroundPatternProps) {
  if (variant === 'dots') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,hsl(var(--foreground)/0.05)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>
    );
  }

  if (variant === 'waves') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute w-full h-full opacity-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path d="M0,50 C30,60 70,40 100,50 L100,100 L0,100 Z" fill="url(#yyc3-wave-gradient)" />
          <defs>
            <linearGradient id="yyc3-wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))' }} />
              <stop offset="50%" style={{ stopColor: 'hsl(var(--accent))' }} />
              <stop offset="100%" style={{ stopColor: 'hsl(var(--info))' }} />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  if (variant === 'gradient') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -inset-[100px] opacity-30 blur-3xl"
          style={{
            background:
              'radial-gradient(circle at 70% 20%, hsl(var(--accent) / 0.3) 0%, transparent 40%), radial-gradient(circle at 30% 80%, hsl(var(--brand-400) / 0.3) 0%, transparent 40%)',
          }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute -inset-[100px] opacity-60"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, hsl(var(--accent) / 0.15) 0%, transparent 60%)',
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-border to-transparent"></div>
      <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-border to-transparent"></div>
    </div>
  );
}

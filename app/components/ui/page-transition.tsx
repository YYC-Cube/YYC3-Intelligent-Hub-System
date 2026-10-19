import type React from 'react';

/**
 * 页面内容进入层（纯 CSS）。
 *
 * 约束：不做模拟加载、不做全屏遮罩、不做退场；路由等待反馈统一由 `loading.tsx`
 * 的 RouteSkeleton 承担。内容进入仅一次 200ms 淡入上移（motion-page-enter），
 * 并在 prefers-reduced-motion 下自动禁用。
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return <div className="motion-page-enter">{children}</div>;
}

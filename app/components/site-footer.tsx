'use client';

import { VersionDisplay } from '@/app/components/ui/version-display';
import { useI18n } from '@/app/hooks/use-i18n';
import { cn } from '@/lib/utils';
import Link from 'next/link';

/**
 * 统一页脚组件（全项目唯一页脚）。
 *
 * 布局归一：合并原 components/ui/footer.tsx（四栏全量版）与本组件（单行简版）
 * 的双轨实现 —— 内容资产取全量版，交互决策取本版的 a11y 原则：
 * - 有真实落地页的条目一律用真实路由链接（/privacy、/terms 等页面已存在）
 * - 无落地页的条目（微信/微博/Cookie 政策）保持非交互文本，
 *   禁止 `href="#"` 空锚点假链接（无导航语义且构成屏幕阅读器噪音），
 *   待对应页面落地后恢复为 Link
 * - i18n 统一走 use-i18n（原 Footer 的 lib t() 双入口退役）
 * - 容器令牌与页面归一：max-w-page + px-4
 */
export function SiteFooter({ className }: { className?: string }) {
  const { t } = useI18n();

  const columns = [
    {
      title: t('ui.产品'),
      links: [
        { href: '/integrations', label: t('ui.集成应用') },
        { href: '/marketplace', label: t('ui.应用市场') },
        { href: '/ai-assistant', label: t('ui.AI助手') },
        { href: '/favorites', label: t('ui.收藏管理') },
      ],
    },
    {
      title: t('ui.支持'),
      links: [
        { href: '/developer/guide', label: t('ui.开发者指南') },
        { href: '/about', label: t('ui.关于我们') },
        { href: '/contact', label: t('ui.联系我们') },
        { href: '/about/version', label: t('ui.版本信息') },
      ],
    },
    {
      title: t('ui.法律'),
      // Cookie 政策无落地页：非交互文本（见组件头注释）
      links: [
        { href: '/privacy', label: t('ui.隐私政策') },
        { href: '/terms', label: t('ui.服务条款') },
        { href: null, label: t('ui.Cookie政策') },
      ],
    },
  ];

  return (
    <footer className={cn('border-t border-border bg-background py-10', className)}>
      <div className="mx-auto w-full max-w-page px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* 品牌信息 */}
          <div className="space-y-4">
            <h2 className="brand-text text-lg font-bold">{t('ui.YanYuCloudCube')}</h2>
            <p className="text-sm text-muted-foreground">
              {t('ui.专业的集成中心系统，连接您的所有应用和服务。')}
            </p>
            <div className="flex space-x-4 text-muted-foreground">
              {/* 社交渠道未上线：保留品牌位但为非交互文本 */}
              <span className="inline-flex">
                <span className="sr-only">{t('ui.微信')}</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.298c-.019.065-.044.13-.044.2 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.833.413c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 4.882-1.932 7.621-.72-.252-2.537-2.862-4.469-6.365-4.469z" />
                </svg>
              </span>
              <span className="inline-flex">
                <span className="sr-only">{t('ui.微博')}</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9.797 2.312c3.252 0 6.797 2.25 6.797 5.906 0 2.343-1.312 4.406-3.375 5.531-.375.188-.563.625-.375 1l.563 1.875c.063.188 0 .375-.188.375-.063 0-.125-.031-.188-.063l-2.25-1.312c-.188-.125-.438-.125-.625-.063-.563.125-1.125.188-1.719.188-3.375 0-6.125-2.25-6.125-5.031 0-2.781 2.75-5.031 6.125-5.031l1.36-.375z" />
                </svg>
              </span>
            </div>
          </div>

          {/* 链接列 */}
          {columns.map((column) => (
            <div key={column.title} className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <span className="text-sm text-muted-foreground">{link.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 底部条：动态年份 + 版本号 */}
        <div className="mt-8 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="text-sm text-muted-foreground">
              {t('ui.© {year} YanYuCloudCube集成中心. 保留所有权利.', {
                year: String(new Date().getFullYear()),
              })}
            </p>
            <div className="mt-4 md:mt-0">
              <VersionDisplay />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

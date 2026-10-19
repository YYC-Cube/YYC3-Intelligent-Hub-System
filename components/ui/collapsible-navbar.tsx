'use client';

import { EncryptionStatus } from '@/app/components/encryption/encryption-status';
import { LanguageSwitcher } from '@/app/components/i18n/language-switcher';
import { SyncIndicator } from '@/app/components/sync/sync-indicator';
import { Button3D } from '@/app/components/ui/3d-button';
import { Logo } from '@/app/components/ui/logo';
import { useI18n } from '@/app/hooks/use-i18n';
import { cn } from '@/lib/utils';
import { tc } from '@/lib/yyc3/i18n/data';
import {
  Bell,
  ChevronDown,
  Grid3X3,
  Heart,
  Home,
  Menu,
  Search,
  Settings,
  Store,
  User,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const navigationItems = [
  {
    name: '系统首页',
    href: '/',
    icon: Home,
    description: '返回系统主页',
  },
  {
    name: '集成中心',
    href: '/integrations',
    icon: Grid3X3,
    description: '管理所有集成应用',
  },
  {
    name: '应用市场',
    href: '/marketplace',
    icon: Store,
    description: '发现新的集成应用',
  },
  {
    name: '我的收藏',
    href: '/favorites',
    icon: Heart,
    description: '查看收藏的应用',
  },
];

const accountItems = [
  {
    name: '账户设置',
    href: '/account/sync',
    icon: User,
    description: '管理账户信息',
  },
  {
    name: '系统设置',
    href: '/admin',
    icon: Settings,
    description: '系统配置管理',
  },
];

interface CollapsibleNavbarProps {
  className?: string;
}

export function CollapsibleNavbar({ className }: CollapsibleNavbarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountExpanded, setIsAccountExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();

  // 自动收缩逻辑（isCollapsed 驱动 header 高度收缩，见下方 header 类名）
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsCollapsed(scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 搜索接线（决策①）：提交后进入 /marketplace/search?q=...
  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setIsMobileMenuOpen(false);
    router.push(`/marketplace/search?q=${encodeURIComponent(q)}`);
  };

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-sticky w-full transition-[height,box-shadow] duration-base ease-standard motion-reduce:transition-none',
        'bg-gradient-to-r from-brand-50/95 via-brand-50/95 to-brand-50/95',
        'backdrop-blur-md supports-[backdrop-filter]:bg-gradient-to-r',
        'supports-[backdrop-filter]:from-brand-50/80 supports-[backdrop-filter]:via-brand-50/80 supports-[backdrop-filter]:to-brand-50/80',
        'border-b border-brand-100/50',
        isCollapsed ? 'h-12 shadow-md' : 'h-16 shadow-sm',
        className
      )}
    >
      <div className="mx-auto h-full w-full max-w-page px-4">
        <div className="flex items-center justify-between h-full gap-4">
          {/* 左侧：Logo和系统名称 */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <Logo />
          </div>

          {/* 中央：导航菜单 - 桌面端 */}
          <nav className="hidden lg:flex items-center space-x-1 flex-shrink-0">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);

              return (
                <Button3D
                  key={item.name}
                  variant={isActive ? 'primary' : 'glass'}
                  size="sm"
                  effect={isActive ? 'glow' : 'float'}
                  className={cn(
                    'transition-[background-color,box-shadow,transform] duration-fast ease-standard px-3 py-2 whitespace-nowrap motion-reduce:transition-none',
                    isActive
                      ? 'bg-gradient-to-r from-primary to-info text-primary-foreground shadow-lg'
                      : 'text-primary hover:bg-brand-100/50'
                  )}
                >
                  <Link
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium text-sm">{tc('nav', item.name)}</span>
                  </Link>
                </Button3D>
              );
            })}
          </nav>

          {/* 右侧：搜索和操作区域 */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* 语言切换 */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            {/* 搜索框 - 桌面端（决策①：提交进入 /marketplace/search?q=） */}
            <form
              action="/marketplace/search"
              method="get"
              onSubmit={submitSearch}
              className="relative hidden xl:block w-48"
            >
              <button
                type="submit"
                aria-label={t('nav.搜索应用...')}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-300 transition-colors hover:text-primary"
              >
                <Search className="h-4 w-4" />
              </button>
              <input
                type="search"
                name="q"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('nav.搜索应用...')}
                className="w-full pl-10 pr-4 py-1.5 text-sm rounded-lg border border-brand-100/50 bg-card/70 backdrop-blur-sm text-foreground placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300/50 focus:border-brand-300 transition-[border-color,box-shadow,background-color] duration-fast ease-standard shadow-sm motion-reduce:transition-none"
              />
            </form>

            {/* 状态指示器 - 桌面端 */}
            <div className="hidden md:flex items-center space-x-2">
              <EncryptionStatus />
              <SyncIndicator />
            </div>

            {/* 通知按钮 - 桌面端 */}
            <Button3D
              variant="glass"
              size="sm"
              effect="float"
              icon={<Bell className="h-4 w-4" />}
              aria-label={t('nav.通知')}
              className="relative hidden md:flex text-primary hover:bg-brand-100/50"
            >
              <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full"></span>
            </Button3D>

            {/* 账户菜单 - 桌面端 */}
            <div className="hidden lg:block relative">
              <Button3D
                variant="glass"
                size="sm"
                effect="float"
                onClick={() => setIsAccountExpanded(!isAccountExpanded)}
                className="flex items-center space-x-1 text-primary hover:bg-brand-100/50 px-2"
              >
                <User className="h-4 w-4" />
                <span className="text-sm">{t('nav.账户')}</span>
                <ChevronDown
                  className={cn(
                    'h-3 w-3 transition-transform duration-fast ease-standard',
                    isAccountExpanded && 'rotate-180'
                  )}
                />
              </Button3D>

              {isAccountExpanded && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-card/95 backdrop-blur-md rounded-lg shadow-lg border border-brand-100/50 py-2 z-dropdown">
                  {accountItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isActiveRoute(item.href);
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          'flex items-center space-x-3 px-4 py-2 transition-colors',
                          isActive
                            ? 'bg-brand-50 text-primary'
                            : 'text-foreground hover:bg-brand-50'
                        )}
                        onClick={() => setIsAccountExpanded(false)}
                      >
                        <Icon className="h-4 w-4 text-primary" />
                        <div>
                          <div className="font-medium text-sm">{tc('nav', item.name)}</div>
                          <div className="text-xs text-muted-foreground">
                            {tc('nav', item.description)}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 移动端菜单按钮 */}
            <Button3D
              variant="glass"
              size="sm"
              effect="float"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? t('nav.关闭菜单') : t('nav.打开菜单')}
              aria-expanded={isMobileMenuOpen}
              className="lg:hidden text-primary hover:bg-brand-100/50"
              icon={isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            />
          </div>
        </div>

        {/* 移动端菜单 */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-card/95 backdrop-blur-md border-b border-brand-100/50 shadow-lg z-dropdown">
            <div className="mx-auto w-full max-w-page px-4 py-4">
              {/* 语言切换 - 移动端 */}
              <div className="mb-4 flex justify-center">
                <LanguageSwitcher />
              </div>

              {/* 搜索栏 - 移动端（决策①：提交进入 /marketplace/search?q=） */}
              <div className="mb-4">
                <form
                  action="/marketplace/search"
                  method="get"
                  onSubmit={submitSearch}
                  className="relative"
                >
                  <button
                    type="submit"
                    aria-label={t('nav.搜索集成应用...')}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-300 transition-colors hover:text-primary"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                  <input
                    type="search"
                    name="q"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('nav.搜索集成应用...')}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-brand-100/50 bg-card/70 backdrop-blur-sm text-foreground placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300/50 focus:border-brand-300"
                  />
                </form>
              </div>

              {/* 导航菜单 */}
              <div className="space-y-2 mb-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item.href);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                        isActive
                          ? 'bg-gradient-to-r from-primary to-info text-primary-foreground shadow-md'
                          : 'text-foreground hover:bg-brand-50'
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <div>
                        <div className="font-medium">{tc('nav', item.name)}</div>
                        <div
                          className={cn(
                            'text-xs',
                            isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                          )}
                        >
                          {tc('nav', item.description)}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* 状态指示器 - 移动端 */}
              <div className="flex items-center justify-between mb-4 p-3 bg-brand-50/50 rounded-lg">
                <EncryptionStatus />
                <SyncIndicator />
              </div>

              {/* 账户菜单 - 移动端 */}
              <div className="pt-4 border-t border-brand-100/50">
                <div className="space-y-2">
                  {accountItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isActiveRoute(item.href);
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                          isActive
                            ? 'bg-brand-50 text-primary'
                            : 'text-foreground hover:bg-brand-50'
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="h-4 w-4 text-primary" />
                        <div>
                          <div className="font-medium">{tc('nav', item.name)}</div>
                          <div className="text-xs text-muted-foreground">
                            {tc('nav', item.description)}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

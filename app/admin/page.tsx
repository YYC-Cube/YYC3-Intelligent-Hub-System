'use client';

import { PageContainer } from '@/app/components/layout/page-container';
import { PageHeader } from '@/app/components/layout/page-header';
import { useI18n } from '@/app/hooks/use-i18n';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Database,
  FileText,
  Globe,
  Layers,
  Settings,
  Shield,
  Terminal,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import type React from 'react';

interface AdminCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  /** 顶部色条与「访问」按钮的语义/品牌令牌类（bg-* 与 text-*-foreground 成对，保证双模式对比度） */
  color: string;
  /** 图标底色（浅色令牌 + 同系深色前景） */
  iconClassName: string;
}

function AdminCard({ title, description, icon, href, color, iconClassName }: AdminCardProps) {
  const { t } = useI18n();
  return (
    <Card className="overflow-hidden motion-card hover:shadow-lg">
      <div className={`h-2 ${color}`} />
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{title}</CardTitle>
          <div className={cn('p-2 rounded-full', iconClassName)}>{icon}</div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Link href={href} className="w-full">
          <Button className={cn('w-full', color)}>{t('admin.访问')}</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function AdminDashboard() {
  const { t } = useI18n();
  const adminCards: AdminCardProps[] = [
    {
      title: t('admin.系统设置'),
      description: t('admin.管理系统全局配置和偏好设置'),
      icon: <Settings className="h-6 w-6" />,
      href: '/admin/settings',
      color: 'bg-brand-500 hover:bg-brand-600',
      iconClassName: 'bg-brand-100 text-brand-700',
    },
    {
      title: t('admin.用户管理'),
      description: t('admin.管理用户账户、权限和角色'),
      icon: <Users className="h-6 w-6" />,
      href: '/admin/users',
      color: 'bg-success hover:bg-success/90 text-success-foreground',
      iconClassName: 'bg-success/15 text-success',
    },
    {
      title: t('admin.数据管理'),
      description: t('admin.管理系统数据和数据库配置'),
      icon: <Database className="h-6 w-6" />,
      href: '/admin/data',
      color: 'bg-warning hover:bg-warning/90 text-warning-foreground',
      iconClassName: 'bg-warning/15 text-warning',
    },
    {
      title: t('admin.安全中心'),
      description: t('admin.管理系统安全设置和访问控制'),
      icon: <Shield className="h-6 w-6" />,
      href: '/admin/security',
      color: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground',
      iconClassName: 'bg-destructive/15 text-destructive',
    },
    {
      title: t('admin.环境变量'),
      description: t('admin.查看和管理系统环境变量'),
      icon: <Terminal className="h-6 w-6" />,
      href: '/admin/env-check',
      color: 'bg-gradient-to-r from-brand-400 to-brand-600 hover:from-brand-500 hover:to-brand-700',
      iconClassName: 'bg-brand-100 text-brand-700',
    },
    {
      title: t('admin.日志中心'),
      description: t('admin.查看系统日志和操作记录'),
      icon: <FileText className="h-6 w-6" />,
      href: '/admin/logs',
      color: 'bg-accent hover:bg-accent/90 text-accent-foreground',
      iconClassName: 'bg-accent/15 text-accent',
    },
    {
      title: t('admin.统计分析'),
      description: t('admin.查看系统使用统计和分析报告'),
      icon: <BarChart className="h-6 w-6" />,
      href: '/admin/analytics',
      color: 'bg-info hover:bg-info/90 text-info-foreground',
      iconClassName: 'bg-info/15 text-info',
    },
    {
      title: t('admin.集成管理'),
      description: t('admin.管理第三方服务集成和API配置'),
      icon: <Layers className="h-6 w-6" />,
      href: '/admin/integrations',
      color: 'bg-brand-700 hover:bg-brand-800',
      iconClassName: 'bg-brand-100 text-brand-700',
    },
    {
      title: t('admin.国际化'),
      description: t('admin.管理多语言翻译和本地化设置'),
      icon: <Globe className="h-6 w-6" />,
      href: '/admin/i18n',
      color: 'bg-brand-600 hover:bg-brand-700',
      iconClassName: 'bg-brand-100 text-brand-700',
    },
    {
      title: t('admin.性能优化'),
      description: t('admin.监控和优化系统性能'),
      icon: <Zap className="h-6 w-6" />,
      href: '/admin/performance',
      color: 'bg-brand-400 hover:bg-brand-500',
      iconClassName: 'bg-brand-100 text-brand-700',
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title={t('admin.管理员控制台')}
        description={t('admin.管理和配置YanYuCloudCube集成中心系统')}
        className="mb-8"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminCards.map((card, index) => (
          <AdminCard key={index} {...card} />
        ))}
      </div>
    </PageContainer>
  );
}

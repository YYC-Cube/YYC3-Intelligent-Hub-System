'use client';

import type React from 'react';

import { PageContainer } from '@/app/components/layout/page-container';
import { PageHeader } from '@/app/components/layout/page-header';
import { ALL_CATEGORY, categories, integrations, subcategories } from '@/app/data/integrations';
import { useI18n } from '@/app/hooks/use-i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dataCat, dataSub } from '@/lib/yyc3/i18n/data';
import {
  ArrowRight,
  BarChart,
  Cloud,
  Code,
  CreditCard,
  HeadphonesIcon,
  Mail,
  MessageSquare,
  Palette,
  Share2,
  Shield,
  ShoppingBag,
  ShoppingCart,
  UserCheck,
  Users,
} from 'lucide-react';
import Link from 'next/link';

export default function CategoriesPage() {
  const { t } = useI18n();

  // 为每个类别分配图标
  const categoryIcons: Record<string, React.ReactNode> = {
    数据分析: <BarChart className="w-8 h-8" />,
    营销推广: <Mail className="w-8 h-8" />,
    效率工具: <ShoppingCart className="w-8 h-8" />,
    销售管理: <Users className="w-8 h-8" />,
    财务管理: <CreditCard className="w-8 h-8" />,
    通信工具: <MessageSquare className="w-8 h-8" />,
    云端服务: <Cloud className="w-8 h-8" />,
    安全防护: <Shield className="w-8 h-8" />,
    设计创意: <Palette className="w-8 h-8" />,
    开发工具: <Code className="w-8 h-8" />,
    人力资源: <UserCheck className="w-8 h-8" />,
    客户支持: <HeadphonesIcon className="w-8 h-8" />,
    电子商务: <ShoppingBag className="w-8 h-8" />,
    社交媒体: <Share2 className="w-8 h-8" />,
  };

  // 计算每个类别的集成应用数量（L-1：显式排除「全部分类」哨兵值，不依赖索引位置约定）
  const realCategories = categories.filter((category) => category !== ALL_CATEGORY);
  const categoryCount: Record<string, number> = {};
  realCategories.forEach((category) => {
    categoryCount[category] = integrations.filter(
      (integration) => integration.category === category
    ).length;
  });

  return (
    <>
      <PageContainer>
        <PageHeader
          className="mb-8"
          crumbs={[
            { label: t('marketplace.市场首页'), href: '/marketplace' },
            { label: t('marketplace.分类') },
          ]}
          title={t('marketplace.浏览分类')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {realCategories.map((category) => (
            <div key={category}>
              <Link href={`/marketplace/category/${encodeURIComponent(category)}`}>
                <Card className="group h-full hover:shadow-md motion-card">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center text-muted-foreground transition-colors group-hover:text-primary">
                        {categoryIcons[category] || <BarChart className="w-8 h-8" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-semibold mb-2">{dataCat(category)}</h3>
                          <span className="text-sm text-muted-foreground">
                            {t('marketplace.{count}个应用', {
                              count: String(categoryCount[category]),
                            })}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {subcategories[category as keyof typeof subcategories]
                            ?.slice(0, 3)
                            .map((sub) => (
                              <div key={sub} className="text-sm text-muted-foreground">
                                • {dataSub(sub)}
                              </div>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
                            {t('marketplace.查看全部')}
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </PageContainer>
    </>
  );
}

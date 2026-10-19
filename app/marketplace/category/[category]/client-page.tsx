'use client';

import { IntegrationCard } from '@/app/components/integrations/integration-card';
import { PageContainer } from '@/app/components/layout/page-container';
import { PageHeader } from '@/app/components/layout/page-header';
import { ControlledPagination } from '@/app/components/ui/controlled-pagination';
import { EmptyState } from '@/app/components/ui/empty-state';
import { integrations, subcategories } from '@/app/data/integrations';
import { useFilterPage } from '@/app/hooks/use-filter-page';
import { useI18n } from '@/app/hooks/use-i18n';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dataCat, dataSub } from '@/lib/yyc3/i18n/data';
import { SearchX, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function CategoryClient() {
  const { t } = useI18n();
  const { category } = useParams();
  const decodedCategory = decodeURIComponent(category as string);
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  // 页码重置统一由 useFilterPage 负责：decodedCategory 纳入依赖，
  // 修复动态段复用组件实例时跨类别导航页码残留问题
  const [currentPage, setCurrentPage] = useFilterPage([
    decodedCategory,
    selectedSubcategory,
    sortBy,
  ]);
  const itemsPerPage = 12;

  const subCategories = subcategories[decodedCategory as keyof typeof subcategories] || [];

  // 结果列表由分类 / 子分类 / 排序条件纯派生，无需 effect + setState。
  const filteredIntegrations = useMemo(() => {
    let filtered = [...integrations].filter(
      (integration) => integration.category === decodedCategory
    );

    if (selectedSubcategory !== 'all') {
      filtered = filtered.filter((integration) => integration.subcategory === selectedSubcategory);
    }

    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'installs':
        filtered.sort((a, b) => b.installCount - a.installCount);
        break;
      case 'newest':
        filtered.sort(
          (a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime()
        );
        break;
      case 'price-low':
        filtered.sort((a, b) => {
          if (a.price.type === 'free') return -1;
          if (b.price.type === 'free') return 1;
          return (a.price.value || 0) - (b.price.value || 0);
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          if (a.price.type === 'free') return 1;
          if (b.price.type === 'free') return -1;
          return (b.price.value || 0) - (a.price.value || 0);
        });
        break;
    }

    return filtered;
  }, [decodedCategory, selectedSubcategory, sortBy]);

  const totalPages = Math.ceil(filteredIntegrations.length / itemsPerPage);
  // 筛选条件变化导致页数减少时收敛页码，替代原先的 setCurrentPage(1) 副作用。
  const safePage = Math.min(currentPage, Math.max(1, totalPages));
  const paginatedIntegrations = filteredIntegrations.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  return (
    <>
      <PageContainer>
        <PageHeader
          className="mb-6"
          crumbs={[
            { label: t('marketplace.市场首页'), href: '/marketplace' },
            { label: t('marketplace.分类'), href: '/marketplace/categories' },
            { label: dataCat(decodedCategory) },
          ]}
          title={dataCat(decodedCategory)}
          description={`(${filteredIntegrations.length})`}
          actions={
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('marketplace.排序方式')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">{t('marketplace.相关性')}</SelectItem>
                  <SelectItem value="rating">{t('marketplace.评分')}</SelectItem>
                  <SelectItem value="installs">{t('marketplace.安装量')}</SelectItem>
                  <SelectItem value="newest">{t('marketplace.最新更新')}</SelectItem>
                  <SelectItem value="price-low">{t('marketplace.价格 (低到高)')}</SelectItem>
                  <SelectItem value="price-high">{t('marketplace.价格 (高到低)')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          }
        />

        {subCategories.length > 0 && (
          <div className="mb-6">
            <Tabs
              defaultValue="all"
              value={selectedSubcategory}
              onValueChange={setSelectedSubcategory}
            >
              <TabsList className="mb-4">
                <TabsTrigger value="all">{t('marketplace.全部')}</TabsTrigger>
                {subCategories.map((sub) => (
                  <TabsTrigger key={sub} value={sub}>
                    {dataSub(sub)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}

        {filteredIntegrations.length === 0 ? (
          <EmptyState
            icon={<SearchX className="h-10 w-10 text-brand-500" aria-hidden="true" />}
            title={t('marketplace.未找到匹配的集成应用')}
            description={t('marketplace.该类别下暂无集成应用')}
            actions={
              <Button asChild>
                <Link href="/marketplace">{t('marketplace.返回市场首页')}</Link>
              </Button>
            }
          />
        ) : (
          <>
            <div className="motion-page-enter grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {paginatedIntegrations.map((integration) => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <ControlledPagination
                  currentPage={safePage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </PageContainer>
    </>
  );
}

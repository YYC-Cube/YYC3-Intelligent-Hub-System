'use client';

import { IntegrationCard } from '@/app/components/integrations/integration-card';
import { PageContainer } from '@/app/components/layout/page-container';
import { PageHeader } from '@/app/components/layout/page-header';
import { ControlledPagination } from '@/app/components/ui/controlled-pagination';
import { EmptyState } from '@/app/components/ui/empty-state';
import { integrations, PRICE_FILTER_MAX } from '@/app/data/integrations';
import { useFilterPage } from '@/app/hooks/use-filter-page';
import { useI18n } from '@/app/hooks/use-i18n';
import { relevanceScore } from '@/app/utils/search-relevance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, Search, SearchX, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { z } from 'zod';
import { FilterSidebar } from '../components/filter-sidebar';
// H-3：窗口化分页（与市场浏览页共用），替代全量页码渲染（84 页 → 最多 5 个按钮）

/** 中文价格类型 → 内部价格枚举 的映射（常量，置于模块作用域以保证引用稳定）。 */
const PRICE_TYPE_MAP: Record<string, string> = {
  免费: 'free',
  免费增值: 'freemium',
  付费: 'paid',
};

/** M-7：逗号分隔的 URL 列表参数 → 字符串数组（空串返回空数组），消除 memo 与事件处理器间的重复解析。 */
function splitListParam(value: string): string[] {
  return value ? value.split(',') : [];
}

/**
 * M-9：URL 数值参数 schema —— 字符串转有限数值后夹取至 [min, max]；
 * 缺参/NaN/越界一律回退 fallback，杜绝恶意或损坏的查询串进入筛选逻辑。
 */
function numericParamSchema(fallback: number, min: number, max: number) {
  return z
    .string()
    .transform((raw) => Number(raw))
    .refine((value) => Number.isFinite(value))
    .transform((value) => Math.min(max, Math.max(min, value)))
    .catch(fallback);
}

export default function SearchPage() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('categories') || '';
  const priceTypesParam = searchParams.get('priceTypes') || '';
  // M-9：数值参数经 zod schema 校验并夹取范围（minRating ∈ [0,5]，价格 ∈ [0, PRICE_FILTER_MAX]）
  const minRating = numericParamSchema(0, 0, 5).parse(searchParams.get('minRating') ?? '');
  // H-6：默认值/哨兵值统一取 PRICE_FILTER_MAX（120），未显式筛选时不裁剪 ¥101–109 区间
  const minPrice = numericParamSchema(0, 0, PRICE_FILTER_MAX).parse(
    searchParams.get('minPrice') ?? ''
  );
  const maxPrice = numericParamSchema(PRICE_FILTER_MAX, 0, PRICE_FILTER_MAX).parse(
    searchParams.get('maxPrice') ?? ''
  );

  const [searchQuery, setSearchQuery] = useState(query);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  // 页码重置统一由 useFilterPage 负责：URL 筛选参数（q/categories/priceTypes/评分/价格）
  // 经 router.push 变化时组件不重挂载，此处按依赖比对自动回第 1 页
  const [currentPage, setCurrentPage] = useFilterPage([
    query,
    categoryParam,
    priceTypesParam,
    minRating,
    minPrice,
    maxPrice,
    sortBy,
  ]);
  const itemsPerPage = 12;

  // 结果列表由筛选条件纯派生，避免 effect + setState 带来的额外渲染。
  const filteredIntegrations = useMemo(() => {
    // M-7：仅 memo 内解析一次（原始参数字符串为唯一来源），事件处理器按需调用同一帮助函数
    const activeCategories = splitListParam(categoryParam);
    const activePriceTypes = splitListParam(priceTypesParam);

    // 筛选集成应用
    let filtered = [...integrations];

    // 搜索关键词筛选
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (integration) =>
          integration.name.toLowerCase().includes(lowerQuery) ||
          integration.description.toLowerCase().includes(lowerQuery) ||
          integration.category.toLowerCase().includes(lowerQuery) ||
          integration.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    }

    // 类别筛选
    if (activeCategories.length > 0) {
      filtered = filtered.filter((integration) => activeCategories.includes(integration.category));
    }

    // 价格类型筛选
    if (activePriceTypes.length > 0) {
      filtered = filtered.filter((integration) =>
        activePriceTypes.some((type) => integration.price.type === PRICE_TYPE_MAP[type])
      );
    }

    // 评分筛选
    if (minRating > 0) {
      filtered = filtered.filter((integration) => integration.rating >= minRating);
    }

    // 价格范围筛选（H-6：哨兵值与滑块上限同源 PRICE_FILTER_MAX）
    if (minPrice > 0 || maxPrice < PRICE_FILTER_MAX) {
      filtered = filtered.filter((integration) => {
        if (integration.price.type === 'free') return minPrice === 0;
        if (!integration.price.value) return true;
        return integration.price.value >= minPrice && integration.price.value <= maxPrice;
      });
    }

    // 排序
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
      default:
        // M-8：「相关性」排序落地——加权相关度（name > tags > description），
        // 仅在有关键词时生效；无命中项得分同为 0，Array.prototype.sort 保持原顺序
        if (query) {
          filtered.sort((a, b) => relevanceScore(query, b) - relevanceScore(query, a));
        }
        break;
    }

    return filtered;
  }, [query, categoryParam, priceTypesParam, minRating, minPrice, maxPrice, sortBy]);

  // 分页
  const totalPages = Math.ceil(filteredIntegrations.length / itemsPerPage);
  // 筛选条件变化导致页数减少时，将页码收敛到有效范围（替代原先的 setCurrentPage(1) 副作用）。
  const safePage = Math.min(currentPage, Math.max(1, totalPages));
  const paginatedIntegrations = filteredIntegrations.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  const handleSearch = () => {
    // 构建查询参数
    const params = new URLSearchParams();
    params.append('q', searchQuery);

    // 保留其他筛选参数（M-7：局部解析，避免组件顶层冗余派生）
    const selectedCategories = splitListParam(categoryParam);
    const selectedPriceTypes = splitListParam(priceTypesParam);
    if (selectedCategories.length > 0) {
      params.append('categories', selectedCategories.join(','));
    }
    if (selectedPriceTypes.length > 0) {
      params.append('priceTypes', selectedPriceTypes.join(','));
    }
    if (minRating > 0) {
      params.append('minRating', minRating.toString());
    }
    if (minPrice > 0 || maxPrice < PRICE_FILTER_MAX) {
      params.append('minPrice', minPrice.toString());
      params.append('maxPrice', maxPrice.toString());
    }

    // SPA 内跳转到搜索结果页，保留客户端状态并避免静态导出整页刷新
    router.push(`/marketplace/search?${params.toString()}`);
  };

  return (
    <>
      <PageContainer>
        <PageHeader
          className="mb-6"
          crumbs={[
            { label: t('marketplace.市场首页'), href: '/marketplace' },
            { label: t('marketplace.搜索结果') },
          ]}
          title={
            query ? t('marketplace."{query}" 的搜索结果', { query }) : t('marketplace.浏览集成应用')
          }
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

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder={t('marketplace.搜索集成应用...')}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          </div>
          <Button onClick={handleSearch}>{t('marketplace.搜索')}</Button>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            {t('marketplace.筛选')}
          </Button>
        </div>

        {showFilters && <FilterSidebar onClose={() => setShowFilters(false)} />}

        {filteredIntegrations.length === 0 ? (
          <EmptyState
            icon={<SearchX className="h-10 w-10 text-brand-500" aria-hidden="true" />}
            title={t('marketplace.未找到匹配的集成应用')}
            description={t('marketplace.尝试使用不同的关键词或筛选条件')}
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

            {/* 分页 —— 统一 ControlledPagination */}
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

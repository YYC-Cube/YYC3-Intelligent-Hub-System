'use client';

/**
 * /integrations 列表客户端内容。
 *
 * 独立成文件的原因：页面顶层消费 useSearchParams（?id= 直达定位），
 * 静态导出要求其位于 Suspense 边界内（见同级 page.tsx），
 * 否则整页在构建期 CSR bailout，SSG HTML 只剩空的流式占位符。
 */

import { ConsoleShell } from '@/app/components/layout/console-shell';
import { Button3D } from '@/app/components/ui/3d-button';
import { PageBackground } from '@/app/components/ui/page-background';
import { useFilterPage } from '@/app/hooks/use-filter-page';
import { useI18n } from '@/app/hooks/use-i18n';
import { useOptimizedFilter, type FilterOptions } from '@/app/hooks/use-optimized-filter';
import { CategoryMemoryService } from '@/app/services/category-memory';
import { Badge } from '@/components/ui/badge';
import { useClientSnapshot } from '@/hooks/use-client-snapshot';
import { dataCat, dataSub } from '@/lib/yyc3/i18n/data';
import { Filter, RotateCcw, Star, TrendingUp, Users, Zap } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { categories, integrations, subcategories } from '../data/integrations';
import CollapsibleCategoryFilter from './components/CollapsibleCategoryFilter';
import IntegrationGrid from './components/IntegrationGrid';
import Pagination from './components/Pagination';
import SearchBar from './components/SearchBar';

const ITEMS_PER_PAGE = 30;

/** 用户显式设置的筛选项（覆盖 URL 参数 / 本地记忆提供的默认值）。 */
interface FilterOverride {
  category?: string;
  subcategory?: string;
  searchQuery?: string;
}

/** 本地记忆中与筛选相关的字段。 */
interface MemorySelection {
  selectedCategory?: string;
  selectedSubcategory?: string;
  searchQuery?: string;
  expandedCategories?: Record<string, boolean>;
}

const EMPTY_SELECTION: MemorySelection = {};
const getMemorySelection = (): MemorySelection => CategoryMemoryService.getSelection();

export default function IntegrationsListClient() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const memorySelection = useClientSnapshot(getMemorySelection, EMPTY_SELECTION);

  // URL 参数（?id=）与本地记忆共同构成筛选「默认值」，用户操作作为覆盖层，
  // 全部在渲染期派生，无需借助 effect 恢复状态（同时规避 SSR/CSR 水合不一致）。
  const urlId = searchParams.get('id');
  const urlIntegration = urlId ? integrations.find((i) => i.id === urlId) : undefined;

  const [override, setOverride] = useState<FilterOverride | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'installCount' | 'releaseDate'>(
    'installCount'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const selectedCategory =
    override?.category ??
    urlIntegration?.category ??
    memorySelection.selectedCategory ??
    '全部分类';
  const selectedSubcategory = override
    ? override.subcategory
    : urlIntegration
      ? undefined
      : memorySelection.selectedSubcategory;
  const searchQuery =
    override?.searchQuery ?? urlIntegration?.name ?? memorySelection.searchQuery ?? '';

  // 页码重置统一由 useFilterPage 负责（筛选依赖变化自动回第 1 页）
  const [currentPage, setCurrentPage] = useFilterPage([
    selectedCategory,
    selectedSubcategory,
    searchQuery,
    sortBy,
    sortOrder,
  ]);

  // 使用优化的筛选Hook
  const filterOptions: FilterOptions = useMemo(
    () => ({
      category: selectedCategory,
      subcategory: selectedSubcategory,
      searchQuery: searchQuery,
      sortBy: sortBy,
      sortOrder: sortOrder,
    }),
    [selectedCategory, selectedSubcategory, searchQuery, sortBy, sortOrder]
  );

  const { filteredIntegrations, filterStats, isSearching } = useOptimizedFilter(
    integrations,
    filterOptions
  );

  const totalPages = Math.ceil(filteredIntegrations.length / ITEMS_PER_PAGE);
  const paginatedIntegrations = filteredIntegrations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // 优化的分类选择处理（页码重置由 useFilterPage 统一负责）
  const handleSelectCategory = useCallback(
    (category: string, subcategory?: string) => {
      setOverride({ category, subcategory, searchQuery });

      // 保存到本地存储
      CategoryMemoryService.saveSelection(category, subcategory);
    },
    [searchQuery]
  );

  // 优化的搜索处理（页码重置由 useFilterPage 统一负责）
  const handleSearch = useCallback(
    (query: string) => {
      setOverride({
        category: selectedCategory,
        subcategory: selectedSubcategory,
        searchQuery: query,
      });
    },
    [selectedCategory, selectedSubcategory]
  );

  // 重置所有筛选
  const handleReset = useCallback(() => {
    setOverride({ category: '全部分类', subcategory: undefined, searchQuery: '' });
    setSortBy('installCount');
    setSortOrder('desc');
    CategoryMemoryService.clearAll();
  }, []);

  return (
    <PageBackground variant="gradient">
      <ConsoleShell
        sidebar={(collapsed) => (
          <CollapsibleCategoryFilter
            collapsed={collapsed}
            categories={categories}
            subcategories={subcategories}
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            onSelectCategory={handleSelectCategory}
          />
        )}
      >
        <div className="flex h-full min-h-0 flex-col bg-gradient-to-br from-brand-50/80 via-brand-50/60 to-brand-50/80 backdrop-blur-sm">
          <h1 className="sr-only">{t('integrations.集成中心')}</h1>
          {/* 页面头部 - 简化版本，移除重复标题 */}
          <div className="motion-page-enter p-4 md:p-6 space-y-4 bg-card/40 backdrop-blur-sm border-b border-brand-200/50">
            {/* 筛选控制区域 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                {/* 筛选状态显示 */}
                <div className="flex flex-wrap items-center gap-2">
                  {selectedSubcategory && (
                    <Badge variant="secondary" className="bg-brand-100 text-brand-600 px-3 py-1">
                      <Filter className="h-3 w-3 mr-1" />
                      {dataCat(selectedCategory)} → {dataSub(selectedSubcategory)}
                    </Badge>
                  )}
                  {searchQuery && (
                    <Badge variant="success" className="px-3 py-1">
                      <Zap className="h-3 w-3 mr-1" />
                      {t('integrations.搜索: {query}', { query: searchQuery })}
                    </Badge>
                  )}
                  {isSearching && (
                    <Badge variant="warning" className="px-3 py-1">
                      {t('integrations.搜索中...')}
                    </Badge>
                  )}
                  {(selectedCategory !== '全部分类' || selectedSubcategory || searchQuery) && (
                    <Button3D
                      variant="secondary"
                      size="sm"
                      effect="float"
                      onClick={handleReset}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      {t('integrations.重置筛选')}
                    </Button3D>
                  )}
                </div>
              </div>

              {/* 搜索区域 */}
              <div className="w-full md:w-80">
                <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
              </div>
            </div>

            {/* 统计信息卡片 */}
            <div className="motion-stagger grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card/60 backdrop-blur-sm rounded-lg p-4 border border-brand-200/30">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-primary to-info rounded-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-brand-700">{filterStats.filtered}</p>
                    <p className="text-sm text-primary/80">{t('integrations.个应用')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card/60 backdrop-blur-sm rounded-lg p-4 border border-brand-200/30">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-accent to-accent/70 rounded-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-brand-700">{filterStats.categories}</p>
                    <p className="text-sm text-primary/80">{t('integrations.个分类')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card/60 backdrop-blur-sm rounded-lg p-4 border border-brand-200/30">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-warning to-warning/70 rounded-lg">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-brand-700">
                      {filterStats.averageRating.toFixed(1)}
                    </p>
                    <p className="text-sm text-primary/80">{t('integrations.平均评分')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 应用网格 */}
          <div className="flex-1 overflow-auto px-4 md:px-6 py-4">
            <div className="motion-page-enter">
              <IntegrationGrid
                integrations={paginatedIntegrations}
                detailHref="/integrations"
                onReset={handleReset}
              />
            </div>
          </div>

          {/* 分页 */}
          <div className="p-4 md:p-6 border-t bg-card/40 backdrop-blur-sm border-brand-200/50">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </ConsoleShell>
    </PageBackground>
  );
}

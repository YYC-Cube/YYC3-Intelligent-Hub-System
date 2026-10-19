'use client';

import { ALL_CATEGORY, categories, PRICE_FILTER_MAX } from '@/app/data/integrations';
import { useI18n } from '@/app/hooks/use-i18n';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { dataCat, tc } from '@/lib/yyc3/i18n/data';
import { X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface FilterSidebarProps {
  onClose: () => void;
}

/** URL 逗号分隔列表参数 → 字符串数组（空串返回空数组），与搜索结果页解析规则一致。 */
function splitListParam(value: string | null): string[] {
  return value ? value.split(',') : [];
}

/**
 * 搜索结果页筛选面板（交互规范统一实现）：
 * - 回显：打开时从 URL 初始化各筛选条件，与已应用状态一致
 * - 应用：保留 URL 中的搜索词 q，仅覆盖筛选参数
 * - 清空：重置本地状态并跳转至仅保留 q 的结果页
 */
export function FilterSidebar({ onClose }: FilterSidebarProps) {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  // 回显：从 URL 派生初始值（面板为条件渲染，每次打开重挂载即重新回读）
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() =>
    splitListParam(searchParams.get('categories'))
  );
  // H-6：上限取数据层常量 PRICE_FILTER_MAX（120），可表达付费价格全域 [10,109]
  const [priceRange, setPriceRange] = useState<[number, number]>(() => {
    const min = Number(searchParams.get('minPrice') ?? '0');
    const max = Number(searchParams.get('maxPrice') ?? String(PRICE_FILTER_MAX));
    return [
      Number.isFinite(min) ? min : 0,
      Number.isFinite(max) ? max : PRICE_FILTER_MAX,
    ];
  });
  const [ratingFilter, setRatingFilter] = useState(() => {
    const rating = Number(searchParams.get('minRating') ?? '0');
    return Number.isFinite(rating) ? rating : 0;
  });
  const [selectedPriceTypes, setSelectedPriceTypes] = useState<string[]>(() =>
    splitListParam(searchParams.get('priceTypes'))
  );

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handlePriceTypeChange = (type: string) => {
    // M-6：回调形参命名 item，避免遮蔽外层 useI18n 的 t
    setSelectedPriceTypes((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
    );
  };

  /** 构建保留搜索词 q 的查询串（筛选参数按当前面板状态覆盖）。 */
  const buildParams = (): URLSearchParams => {
    const params = new URLSearchParams();

    const q = searchParams.get('q');
    if (q) {
      params.append('q', q);
    }

    if (selectedCategories.length > 0) {
      params.append('categories', selectedCategories.join(','));
    }

    if (selectedPriceTypes.length > 0) {
      params.append('priceTypes', selectedPriceTypes.join(','));
    }

    if (ratingFilter > 0) {
      params.append('minRating', ratingFilter.toString());
    }

    if (priceRange[0] > 0 || priceRange[1] < PRICE_FILTER_MAX) {
      params.append('minPrice', priceRange[0].toString());
      params.append('maxPrice', priceRange[1].toString());
    }

    return params;
  };

  const applyFilters = () => {
    // SPA 内跳转到搜索结果页，保留客户端状态并避免静态导出整页刷新
    router.push(`/marketplace/search?${buildParams().toString()}`);
  };

  // 清空筛选：重置面板状态并跳转至仅保留搜索词的结果页
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceTypes([]);
    setRatingFilter(0);
    setPriceRange([0, PRICE_FILTER_MAX]);

    const params = new URLSearchParams();
    const q = searchParams.get('q');
    if (q) {
      params.append('q', q);
    }
    router.push(`/marketplace/search?${params.toString()}`);
  };

  return (
    <div className="animate-fade-up mb-8">
      <Card className="p-6 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={onClose}
          aria-label={t('marketplace.关闭筛选')}
        >
          <X className="h-4 w-4" />
        </Button>

        <h3 className="text-lg font-semibold mb-4">{t('marketplace.高级筛选')}</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 类别筛选 */}
          <div>
            <h4 className="font-medium mb-2">{t('marketplace.类别')}</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {/* L-1：显式排除「全部分类」哨兵值，不依赖索引位置约定 */}
              {categories
                .filter((category) => category !== ALL_CATEGORY)
                .map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                      {dataCat(category)}
                    </Label>
                  </div>
                ))}
            </div>
          </div>

          {/* 价格筛选 */}
          <div>
            <h4 className="font-medium mb-2">{t('marketplace.价格类型')}</h4>
            <div className="space-y-2 mb-4">
              {['免费', '免费增值', '付费'].map((type, index) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`price-type-${index}`}
                    checked={selectedPriceTypes.includes(type)}
                    onCheckedChange={() => handlePriceTypeChange(type)}
                  />
                  <Label htmlFor={`price-type-${index}`} className="text-sm cursor-pointer">
                    {tc('marketplace', type)}
                  </Label>
                </div>
              ))}
            </div>

            <h4 className="font-medium mb-2">
              {t('marketplace.价格范围 (¥{min} - ¥{max})', {
                min: String(priceRange[0]),
                max: String(priceRange[1]),
              })}
            </h4>
            <Slider
              value={priceRange}
              min={0}
              max={PRICE_FILTER_MAX}
              step={5}
              onValueChange={(value) => setPriceRange([value[0], value[1]])}
              className="mb-6"
            />
          </div>

          {/* 评分筛选 */}
          <div>
            <h4 className="font-medium mb-2">
              {t('marketplace.最低评分 ({rating}星)', { rating: String(ratingFilter) })}
            </h4>
            <Slider
              value={[ratingFilter]}
              min={0}
              max={5}
              step={0.5}
              onValueChange={(value) => setRatingFilter(value[0])}
              className="mb-6"
            />

            {/* 交互规范：筛选面板标配「清空」次级 + 「应用」主操作，右对齐成组 */}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={clearFilters}>
                {t('marketplace.清空筛选')}
              </Button>
              <Button onClick={applyFilters}>{t('marketplace.应用筛选')}</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

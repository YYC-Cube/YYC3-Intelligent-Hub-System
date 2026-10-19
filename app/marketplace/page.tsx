'use client';

import { IntegrationCard } from '@/app/components/integrations/integration-card';
import { PageContainer } from '@/app/components/layout/page-container';
import { useI18n } from '@/app/hooks/use-i18n';
import { Button } from '@/components/ui/button';
import { ClientOnly } from '@/components/ui/client-only';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, ChevronDown, Filter, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState, type FormEvent } from 'react';
import { ALL_CATEGORY, categories, integrations } from '../data/integrations';
import { CategoryGrid } from './components/category-grid';
import { FeaturedCarousel } from './components/featured-carousel';
import { FilterSidebar } from './components/filter-sidebar';

export default function MarketplacePage() {
  const { t } = useI18n();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  // M-3：「精选推荐」取代语义不符的「全部」（该面板仅展示前 8 个预览 + 浏览更多入口）
  const [activeTab, setActiveTab] = useState('featured');

  // 获取特色集成（轮播取前 5，「精选推荐」面板同样来源于该集合，保证标签名实一致）
  const featuredAll = integrations.filter((integration) => integration.featured);
  const featuredIntegrations = featuredAll.slice(0, 5);
  const featuredPreview = featuredAll.slice(0, 8);

  // 获取新上线的集成
  const newIntegrations = integrations.filter((integration) => integration.new).slice(0, 8);

  // 获取热门集成
  const popularIntegrations = integrations
    .filter((integration) => integration.popular)
    .sort((a, b) => b.installCount - a.installCount)
    .slice(0, 8);

  // 按评分排序的集成
  const topRatedIntegrations = [...integrations]
    .sort((a, b) => b.rating - a.rating)
    .filter((integration) => integration.reviewCount > 50)
    .slice(0, 8);
  // L-1：显式排除「全部分类」哨兵值；首页仅露出前 8 个分类，其余走「查看全部」
  const realCategories = categories.filter((category) => category !== ALL_CATEGORY);
  const previewCategories = realCategories.slice(0, 8);

  // Hero 搜索：以表单 submit 统一 Enter / 点击 / 移动端软键盘「搜索」键，
  // 并用 composition 标记避开中文 IME 选词回车造成的误提交。
  const composingRef = useRef(false);
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (composingRef.current) return;
    const query = searchQuery.trim();
    if (!query) return;
    router.push(`/marketplace/search?q=${encodeURIComponent(query)}`);
  };

  // 总安装量的紧凑格式：≥100 万用 M+，≥1000 用 K+（避免出现「4987K+」这类不合规范的数字）
  const totalInstalls = integrations.reduce(
    (sum, integration) => sum + integration.installCount,
    0
  );
  const formatCompact = (value: number) =>
    value >= 1_000_000
      ? `${(value / 1_000_000).toFixed(2)}M+`
      : value >= 1000
        ? `${Math.round(value / 1000)}K+`
        : `${value}`;

  return (
    <>
      <ClientOnly
        fallback={
          <div className="bg-gradient-to-r from-primary to-accent text-white py-16">
            <div className="mx-auto w-full max-w-page px-4">
              <div className="max-w-content mx-auto text-center">
                <div className="h-12 bg-white/20 rounded motion-skeleton mb-4 w-3/4 mx-auto" />
                <div className="h-6 bg-white/20 rounded motion-skeleton w-1/2 mx-auto" />
              </div>
            </div>
          </div>
        }
      >
        {/* 英雄区域 */}
        <section className="bg-gradient-to-r from-primary to-accent text-white py-16">
          <div className="mx-auto w-full max-w-page px-4">
            <div className="max-w-content mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {t('marketplace.YanYuCloudCube 集成应用市场')}
              </h1>
              <p className="text-xl mb-8 text-white/95">
                {t('marketplace.发现并连接强大的集成应用，提升您的业务效率')}
              </p>

              <form
                role="search"
                aria-label={t('marketplace.搜索集成应用')}
                action="/marketplace/search"
                method="get"
                onSubmit={submitSearch}
                className="relative max-w-2xl mx-auto"
              >
                <Input
                  type="search"
                  name="q"
                  aria-label={t('marketplace.搜索集成应用...')}
                  placeholder={t('marketplace.搜索集成应用...')}
                  className="pl-10 pr-4 py-6 rounded-lg text-foreground w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onCompositionStart={() => {
                    composingRef.current = true;
                  }}
                  onCompositionEnd={() => {
                    composingRef.current = false;
                  }}
                />
                <Search
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  {t('marketplace.搜索')}
                </Button>
              </form>

              <div className="flex justify-center mt-4 text-sm">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center text-brand-100 hover:text-white"
                >
                  <Filter className="h-4 w-4 mr-1" />
                  {t('marketplace.高级筛选')}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <PageContainer>
          {/* 筛选侧边栏 */}
          {showFilters && <FilterSidebar onClose={() => setShowFilters(false)} />}

          {/* 集成列表：核心内容前置，首屏即可看到商品卡 */}
          <section className="mb-12">
            {/* M-3：接入真实 TabsContent 面板（a11y：触发器与面板建立 aria 关联），
              首个标签语义修正为「精选推荐」——仅展示前 8 个预览 */}
            <Tabs className="mb-8" value={activeTab} onValueChange={setActiveTab}>
              {/* 移动端标题与 Tabs 上下堆叠，避免 4 个触发器把 h2 挤成两行 */}
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-bold whitespace-nowrap">
                  {t('marketplace.集成应用')}
                </h2>
                <TabsList className="w-full justify-start sm:w-auto">
                  <TabsTrigger value="featured">{t('marketplace.精选推荐')}</TabsTrigger>
                  <TabsTrigger value="new">{t('marketplace.新上线')}</TabsTrigger>
                  <TabsTrigger value="popular">{t('marketplace.热门')}</TabsTrigger>
                  <TabsTrigger value="top-rated">{t('marketplace.高评分')}</TabsTrigger>
                </TabsList>
              </div>

              <ClientOnly
                fallback={
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="h-64 bg-muted rounded-lg motion-skeleton" />
                    ))}
                  </div>
                }
              >
                <TabsContent value="featured">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {featuredPreview.map((integration) => (
                      <IntegrationCard key={integration.id} integration={integration} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="new">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {newIntegrations.map((integration) => (
                      <IntegrationCard key={integration.id} integration={integration} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="popular">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {popularIntegrations.map((integration) => (
                      <IntegrationCard key={integration.id} integration={integration} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="top-rated">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {topRatedIntegrations.map((integration) => (
                      <IntegrationCard key={integration.id} integration={integration} />
                    ))}
                  </div>
                </TabsContent>
              </ClientOnly>
            </Tabs>

            <div className="flex justify-center mt-8">
              <Button asChild variant="outline">
                <Link href="/marketplace/browse">
                  {t('marketplace.浏览更多集成应用')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </section>

          {/* 分类导航：首页仅露 8 个，其余走「查看全部」 */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-2xl font-bold">{t('marketplace.浏览分类')}</h2>
              <Button asChild variant="outline" size="sm">
                <Link href="/marketplace/categories">
                  {t('marketplace.查看全部')}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <CategoryGrid categories={previewCategories} />
          </section>

          {/* 特色轮播：降级为展示位，位于商品与分类之后 */}
          <section className="mb-12">
            <ClientOnly
              fallback={
                <div className="h-96 bg-gradient-to-r from-primary to-accent rounded-xl motion-skeleton" />
              }
            >
              <FeaturedCarousel integrations={featuredIntegrations} />
            </ClientOnly>
          </section>

          {/* 信任数据条：辅助信息，权重低于商品卡（原 3 张 36px 大字卡降为单行文本） */}
          <section className="mt-12 mb-8">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
              <span>
                <strong className="font-semibold text-foreground">{integrations.length}+</strong>{' '}
                {t('marketplace.可用集成应用')}
              </span>
              <span>
                <strong className="font-semibold text-foreground">{realCategories.length}</strong>{' '}
                {t('marketplace.应用类别')}
              </span>
              <span>
                <strong className="font-semibold text-foreground">
                  {formatCompact(totalInstalls)}
                </strong>{' '}
                {t('marketplace.总安装次数')}
              </span>
            </div>
          </section>
        </PageContainer>
      </ClientOnly>
    </>
  );
}

'use client';

import type { Integration } from '@/app/data/integrations';
import { iconMap } from '@/app/data/integrations';
import { useI18n } from '@/app/hooks/use-i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dataDev, dataIntegrationDesc, dataIntegrationName } from '@/lib/yyc3/i18n/data';
import { Calendar, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface FeaturedCarouselProps {
  integrations: Integration[];
}

export function FeaturedCarousel({ integrations }: FeaturedCarouselProps) {
  const { t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  // 悬停或键盘聚焦时暂停自动轮播，避免用户阅读中被切走
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % integrations.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + integrations.length) % integrations.length);
  };

  useEffect(() => {
    if (isPaused) return;
    // 尊重系统「减少动态效果」偏好：启用时完全停用自动轮播（WCAG 2.2.2）
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;

    const interval = setInterval(handleNext, 8000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handleNext 仅依赖 integrations.length
  }, [isPaused, integrations.length]);

  const integration = integrations[currentIndex];
  const Icon = integration?.icon ? iconMap[integration.icon as keyof typeof iconMap] : Calendar;

  if (!integration) return null;

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label={t('marketplace.特色集成')}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <h2 className="text-2xl font-bold mb-6">{t('marketplace.特色集成')}</h2>

      <div className="relative overflow-hidden rounded-xl">
        <div key={currentIndex} className="animate-fade-up w-full">
          <Card className="border-0 shadow-lg overflow-hidden">
            {/* 背景固定为品牌深色渐变：集成色仅用于图标等点缀。
                  集成色（浅黄/浅绿等）50%→25% 冲白后，白字对比度低至 1.06:1，
                  不可读；品牌渐变下白字为 5.17:1（primary）/ 6.79:1（accent），通过 AA。 */}
            <div className="h-64 bg-gradient-to-r from-primary to-accent relative">
              <CardContent className="p-8 h-full">
                <div className="flex flex-col md:flex-row h-full gap-8">
                  <div className="flex-1 text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">
                          {dataIntegrationName(integration.name)}
                        </h3>
                        <div className="text-sm text-white/95">
                          {dataDev(integration.developer)}
                        </div>
                      </div>
                    </div>

                    <p className="mb-4 line-clamp-2">
                      {dataIntegrationDesc(integration.description)}
                    </p>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-warning mr-1" />
                        <span className="font-medium">{integration.rating}</span>
                        <span className="text-white/95 ml-1">({integration.reviewCount})</span>
                      </div>
                      <div className="text-white/95">
                        {integration.installCount > 1000
                          ? t('marketplace.{count}K+ 安装', {
                              count: (integration.installCount / 1000).toFixed(1),
                            })
                          : t('marketplace.{count} 安装', {
                              count: String(integration.installCount),
                            })}
                      </div>
                    </div>

                    <div className="flex gap-3 mt-auto">
                      <Button asChild className="bg-card text-primary hover:bg-brand-50">
                        <Link href={`/marketplace/integration/${integration.id}`}>
                          {t('marketplace.查看详情')}
                        </Link>
                      </Button>
                      {/* outline 变体自带 bg-background（白底），叠加 text-white 会白底白字；
                            显式 bg-transparent 让文字落在品牌渐变上（白字 5.17:1） */}
                      <Button
                        asChild
                        variant="outline"
                        className="bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white"
                      >
                        <Link href={`/integrations/${integration.id}/install`}>
                          {t('marketplace.立即安装')}
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center justify-center flex-1">
                    <div className="w-48 h-48 rounded-full bg-white/10 flex items-center justify-center">
                      <Icon className="w-24 h-24 text-white" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>

      {/* 控制条：箭头与圆点同排置于卡片下方，避免绝对定位的箭头压住正文
          （移动端与桌面端原先都会遮挡描述首尾字符）。
          圆点外层 24×24 命中区满足触控目标尺寸，箭头补齐无障碍名称。 */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={handlePrevious}
          aria-label={t('marketplace.上一页')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {integrations.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`${index + 1} / ${integrations.length}`}
              aria-current={index === currentIndex ? 'true' : undefined}
              className="flex h-6 w-6 items-center justify-center rounded-full"
              onClick={() => {
                setCurrentIndex(index);
              }}
            >
              <span
                className={`block h-2 w-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={handleNext}
          aria-label={t('marketplace.下一页')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

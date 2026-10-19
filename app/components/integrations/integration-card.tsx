'use client';

/**
 * 统一应用卡片（H-1 收敛：/integrations 与 /marketplace 双实现融合）。
 *
 * 融合基准：
 * - 数据与编号（`#${id}`）与详情路由同源；
 * - 分类标签沿用 integrations 卡的 chip 样式（`dataCat` i18n）；
 * - 评分/评论数/安装量/价格徽章沿用 marketplace 卡；
 * - 收藏按钮常驻右上（修复原 marketplace 卡「仅 hover 可见」的可达性缺陷，
 *   触屏与键盘用户无需悬停即可收藏）；
 * - 「新上线」角标移至左上，与常驻收藏按钮互斥定位，消除重叠。
 *
 * 详情路由通过 `detailHref` 注入（默认 marketplace 详情基路径），
 * 两个页面共享同一卡片实现，仅路由基路径不同。
 */

import { FavoriteButton } from '@/app/components/favorites/favorite-button';
import type { Integration } from '@/app/data/integrations';
import { iconMap } from '@/app/data/integrations';
import { useI18n } from '@/app/hooks/use-i18n';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dataCat, dataDev, dataIntegrationDesc, dataIntegrationName } from '@/lib/yyc3/i18n/data';
import { priceVariant } from '@/lib/yyc3/status-variants';
import { Calendar, Download, Star } from 'lucide-react';
import Link from 'next/link';

/** marketplace 详情页路由基路径（卡片默认跳转目标）。 */
export const MARKETPLACE_DETAIL_BASE = '/marketplace/integration';

interface IntegrationCardProps {
  integration: Integration;
  /** 详情页路由基路径，最终跳转 `${detailHref}/${integration.id}`。 */
  detailHref?: string;
}

export function IntegrationCard({
  integration,
  detailHref = MARKETPLACE_DETAIL_BASE,
}: IntegrationCardProps) {
  const { t } = useI18n();
  const Icon = iconMap[integration.icon as keyof typeof iconMap] || Calendar;

  return (
    <div className="h-full">
      <Card className="overflow-hidden h-full border hover:border-primary/50 hover:shadow-sm motion-card group relative">
        {/* 「新上线」角标固定左上，与右上常驻收藏按钮互斥定位（语义变体：success tint，Badge 非交互无 hover） */}
        {integration.new && (
          <Badge variant="success" className="absolute top-2 left-2 z-10">
            {t('marketplace.新上线')}
          </Badge>
        )}
        {/* 收藏按钮常驻右上：不依赖 hover，触屏/键盘可达。
            必须与详情链接互为兄弟节点——嵌套 <button> 于 <a> 内属非法结构，且会误触跳转。 */}
        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton id={integration.id} variant="ghost" size="sm" showText={false} />
        </div>
        <CardContent className="p-4 flex flex-col h-full">
          {/* 链接仅覆盖信息区（图标/名称/简介/评分），操作区独立于链接之外，
              既避免 <a> 内嵌按钮的非法结构，也保证卡片中部可一键进入详情。 */}
          <Link href={`${detailHref}/${integration.id}`} className="flex flex-1 flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${integration.color}20` }}
              >
                <Icon className="w-6 h-6" style={{ color: integration.color }} />
              </div>
              <div className="min-w-0">
                <h3 className="text-card-title line-clamp-1">
                  {dataIntegrationName(integration.name)}
                </h3>
                <div className="text-card-meta text-muted-foreground truncate">
                  {dataDev(integration.developer)}
                </div>
              </div>
              {/* 编号：与详情路由同源的唯一 id */}
              <span
                className="ml-auto flex-shrink-0 font-mono text-2xs leading-5 text-muted-foreground tabular-nums"
                aria-label={`ID ${integration.id}`}
                title={`#${integration.id}`}
              >
                #{integration.id.padStart(4, '0')}
              </span>
            </div>

            <p className="text-card-body text-muted-foreground mb-3 line-clamp-2">
              {dataIntegrationDesc(integration.description)}
            </p>

            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center">
                <Star className="w-3 h-3 text-warning mr-1" />
                <span className="text-card-meta font-medium">{integration.rating}</span>
                <span className="text-card-meta text-muted-foreground ml-1">
                  ({integration.reviewCount})
                </span>
              </div>
              <div className="flex items-center text-card-meta text-muted-foreground">
                <Download className="w-3 h-3 mr-1" />
                {integration.installCount > 1000
                  ? t('marketplace.{count}千', {
                      count: (integration.installCount / 1000).toFixed(1),
                    })
                  : integration.installCount}
              </div>
            </div>
          </Link>

          {/* 操作区：价格 + 分类 + 次级「安装」入口。
              单行布局 + chip 弹性截断，避免 5 列窄卡（≈218px）时换行抬高卡片。 */}
          <div className="mt-2 flex items-center gap-2 border-t pt-2">
            {/* 价格徽章：语义变体统一取 priceVariant（free=success / freemium=info / paid=outline） */}
            <Badge variant={priceVariant(integration.price.type)} className="shrink-0">
              {integration.price.type === 'free'
                ? t('marketplace.免费')
                : integration.price.type === 'freemium'
                  ? t('marketplace.免费增值')
                  : t('marketplace.¥{price}/月', { price: String(integration.price.value) })}
            </Badge>
            {/* 分类标签：长分类名按可用宽度截断，完整值见 title */}
            <span
              className="min-w-0 truncate text-card-chip px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
              title={dataCat(integration.category)}
            >
              {dataCat(integration.category)}
            </span>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="ml-auto h-6 shrink-0 px-1.5 text-xs font-medium text-primary hover:text-primary"
            >
              <Link href={`/integrations/${integration.id}/install`}>{t('marketplace.安装')}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default IntegrationCard;

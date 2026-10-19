import type { MetadataRoute } from 'next';

import { categories, integrations } from '@/app/data/integrations';
import { getAllModuleIds } from '@/app/data/learning-paths';
import { SITE_URL } from '@/lib/yyc3/brand';

// output: "export" 下 Metadata Route 必须显式声明静态生成
export const dynamic = 'force-static';

/**
 * 站点地图 —— 与路由/元数据同源生成（Next.js Metadata Route，构建期输出 out/sitemap.xml）。
 *
 * 收录策略：
 * - 公开内容页收录（首页/集成/市场/开发者/法务）；
 * - 登录墙与内部页排除：/admin、/account、/favorites、/login、/error-test、/loading*、
 *   /examples、/design-system（演示页无搜索价值）；
 * - 动态段由数据源驱动展开，禁止硬编码副本（单一真源：app/data/*）。
 *
 * URL 与 next.config trailingSlash 保持一致（全部带尾斜杠）。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const url = (path: string) => `${SITE_URL}${path}/`;

  const staticPaths = [
    '/',
    '/integrations',
    '/marketplace',
    '/marketplace/browse',
    '/marketplace/categories',
    '/marketplace/popular',
    '/marketplace/search',
    '/about',
    '/about/version',
    '/contact',
    '/privacy',
    '/terms',
    '/ai-assistant',
    '/developer',
    '/developer/api',
    '/developer/components',
    '/developer/guide',
    '/developer/progressive-guide',
  ];

  const integrationUrls = integrations.flatMap((integration) => [
    url(`/integrations/${integration.id}`),
    url(`/marketplace/integration/${integration.id}`),
  ]);

  // 分类为中文（数据源「全部分类」聚合项不生成路由），与 generateStaticParams 同规则编码
  const categoryUrls = categories
    .filter((c) => c !== '全部分类')
    .map((c) => url(`/marketplace/category/${encodeURIComponent(c)}`));

  const moduleUrls = getAllModuleIds().map((id) =>
    url(`/developer/progressive-guide/module/${id}`)
  );

  return [
    ...staticPaths.map((path) => ({ url: url(path), lastModified })),
    ...[...integrationUrls, ...categoryUrls, ...moduleUrls].map((u) => ({
      url: u,
      lastModified,
    })),
  ];
}

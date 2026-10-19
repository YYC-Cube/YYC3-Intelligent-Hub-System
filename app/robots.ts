import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/yyc3/brand';

// output: "export" 下 Metadata Route 必须显式声明静态生成
export const dynamic = 'force-static';

/**
 * robots.txt（Next.js Metadata Route，构建期输出 out/robots.txt）。
 * 登录墙与内部验证路径对爬虫封闭，站点地图指向 sitemap.xml。
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/account/', '/favorites/', '/login/', '/error-test/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

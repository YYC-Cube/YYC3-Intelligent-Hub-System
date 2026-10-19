import type { Metadata } from "next"

import { BRAND, SITE_URL } from "@/lib/yyc3/brand"

/**
 * 页面元数据工厂 —— 全站唯一的页面级 metadata 组装出口。
 *
 * 规范（与根 layout 的 title.template 联动）：
 * - title 只传「页面名」，模板统一拼接为「页面名 - YanYuCloudCube集成中心系统」；
 *   禁止在页面侧自拼品牌后缀（会造成双后缀或分隔符漂移）。
 * - description 缺省回退品牌主描述；动态页必须传入内容驱动描述。
 * - path 提供时生成 canonical 与 openGraph.url，消除静态导出下的重复收录。
 */
export function createMetadata({
  title,
  description = BRAND.description,
  path,
}: {
  /** 页面名（不带品牌后缀），如「我的收藏」 */
  title: string
  /** 页面描述；动态页由数据驱动传入 */
  description?: string
  /** 规范路径（以 / 开头，含 trailingSlash），如 "/favorites/" */
  path?: string
}): Metadata {
  return {
    title,
    description,
    ...(path
      ? {
          alternates: { canonical: path },
          openGraph: {
            title: `${title} - ${BRAND.name}`,
            description,
            url: new URL(path, SITE_URL).toString(),
          },
        }
      : {}),
  }
}

/**
 * 动态路由元数据工厂 —— generateMetadata 专用。
 *
 * 在 createMetadata 基础上强制要求 description（动态页禁止回退全站描述，
 * 否则 SEO 语义被稀释），并由调用方保证数据不存在时返回全站默认元数据。
 */
export function createDynamicMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  return createMetadata({ title, description, path })
}

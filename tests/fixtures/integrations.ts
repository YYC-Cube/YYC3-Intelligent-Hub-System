import type { Integration } from "@/app/data/integrations"

/**
 * 构造一个结构完整的 Integration 测试夹具。
 * 通过 overrides 覆盖任意字段，避免每个用例重复书写全部字段。
 */
export function makeIntegration(overrides: Partial<Integration> = {}): Integration {
  return {
    id: "1",
    name: "测试应用1",
    description: "用于测试的集成应用描述",
    category: "数据分析",
    subcategory: "数据可视化",
    icon: "Zap",
    color: "#3B82F6",
    developer: "测试开发者",
    rating: 4.5,
    reviewCount: 100,
    price: { type: "free" },
    installCount: 1000,
    releaseDate: "2021-01-01",
    lastUpdate: "2023-01-01",
    version: "1.0.0",
    tags: ["测试", "数据"],
    featured: false,
    new: false,
    popular: false,
    industryFocus: ["科技"],
    ...overrides,
  }
}

/** 批量构造 n 条夹具，id 从 1 递增。 */
export function makeIntegrations(count: number, overrides: Partial<Integration> = {}): Integration[] {
  return Array.from({ length: count }, (_, i) =>
    makeIntegration({
      id: String(i + 1),
      name: `测试应用${i + 1}`,
      ...overrides,
    }),
  )
}

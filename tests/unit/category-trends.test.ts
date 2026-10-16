import { describe, it, expect } from "vitest"
import {
  calculateCategoryHeat,
  getAllCategoryHeat,
  getHotCategories,
  getTrendingCategories,
} from "@/app/services/category-trends"
import { categories, integrations } from "@/app/data/integrations"

describe("单元测试 · 分类热度计算", () => {
  it("TC-U-070 不存在的分类返回“冷门”零值兜底（分支覆盖）", () => {
    const heat = calculateCategoryHeat("不存在的分类")
    expect(heat.heatScore).toBe(0)
    expect(heat.heatLevel).toBe("冷门")
    expect(heat.trend).toBe("平稳")
    expect(heat.installCount).toBe(0)
    expect(heat.avgRating).toBe(0)
  })

  it("TC-U-071 真实分类热度落在合法区间，等级/趋势取值受控", () => {
    for (const category of categories.filter((c) => c !== "全部分类")) {
      const heat = calculateCategoryHeat(category)
      expect(heat.heatScore).toBeGreaterThanOrEqual(0)
      expect(heat.heatScore).toBeLessThanOrEqual(100)
      expect(["极热", "热门", "活跃", "稳定", "冷门"]).toContain(heat.heatLevel)
      expect(["上升", "平稳", "下降"]).toContain(heat.trend)
      expect(heat.installCount).toBe(
        integrations.filter((i) => i.category === category).reduce((s, i) => s + i.installCount, 0),
      )
    }
  })

  it("TC-U-072 热度计算确定性（同一分类多次调用结果一致）", () => {
    const a = calculateCategoryHeat("数据分析")
    const b = calculateCategoryHeat("数据分析")
    expect(a).toEqual(b)
  })

  it("TC-U-073 getAllCategoryHeat 排除“全部分类”", () => {
    const all = getAllCategoryHeat(categories)
    expect(all.map((h) => h.category)).not.toContain("全部分类")
    expect(all).toHaveLength(categories.length - 1)
  })

  it("TC-U-074 getHotCategories 按热度降序并按 limit 截断", () => {
    const hot = getHotCategories(categories, 5)
    expect(hot).toHaveLength(5)
    for (let i = 1; i < hot.length; i++) {
      expect(hot[i - 1].heatScore).toBeGreaterThanOrEqual(hot[i].heatScore)
    }
  })

  it("TC-U-075 getTrendingCategories 仅返回上升趋势且按增长率降序", () => {
    const trending = getTrendingCategories(categories, 5)
    trending.forEach((h) => expect(h.trend).toBe("上升"))
    for (let i = 1; i < trending.length; i++) {
      expect(trending[i - 1].growthRate).toBeGreaterThanOrEqual(trending[i].growthRate)
    }
  })
})

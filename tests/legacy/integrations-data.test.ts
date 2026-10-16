/**
 * 集成应用数据集生成器的单元测试（M-1：自 jest 迁移至 vitest）。
 *
 * 数据集的生成结果会同时用于：
 * 1. `generateStaticParams` + 静态预渲染（Node 环境）
 * 2. 客户端组件的水合（浏览器环境）
 *
 * 因此「同一份种子在任意环境产生完全相同的数据」是一项硬性契约，
 * 本测试文件即为该契约的看门狗。
 */
import {
  createSeededRandom,
  INTEGRATIONS_SEED,
  INTEGRATIONS_REFERENCE_DATE,
  integrations,
  categories,
  subcategories,
  industries,
  type Integration,
} from "@/app/data/integrations"
import { describe, expect, it, vi } from "vitest"

const DAY_MS = 24 * 60 * 60 * 1000
const NEW_THRESHOLD = INTEGRATIONS_REFERENCE_DATE.getTime() - 30 * DAY_MS

describe("createSeededRandom（mulberry32 确定性伪随机数生成器）", () => {
  it("相同种子应产生逐位一致的序列", () => {
    const a = createSeededRandom(INTEGRATIONS_SEED)
    const b = createSeededRandom(INTEGRATIONS_SEED)
    const seqA = Array.from({ length: 50 }, () => a())
    const seqB = Array.from({ length: 50 }, () => b())
    expect(seqA).toEqual(seqB)
  })

  it("不同种子应产生不同序列", () => {
    const a = createSeededRandom(1)
    const b = createSeededRandom(2)
    const seqA = Array.from({ length: 50 }, () => a())
    const seqB = Array.from({ length: 50 }, () => b())
    expect(seqA).not.toEqual(seqB)
  })

  it("输出应始终落在 [0, 1) 区间内", () => {
    const random = createSeededRandom(INTEGRATIONS_SEED)
    for (let i = 0; i < 5000; i++) {
      const value = random()
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })

  it("种子 0 不应退化为恒定输出", () => {
    const random = createSeededRandom(0)
    const values = Array.from({ length: 20 }, () => random())
    expect(new Set(values).size).toBeGreaterThan(1)
  })

  it("不应依赖 Math.random", () => {
    const spy = vi.spyOn(Math, "random")
    const random = createSeededRandom(INTEGRATIONS_SEED)
    Array.from({ length: 20 }, () => random())
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})

describe("集成应用数据集（SSG / 水合一致性契约）", () => {
  it("应生成 1000 条集成应用", () => {
    expect(integrations).toHaveLength(1000)
  })

  it("模块重新求值后应生成完全一致的数据（不依赖 Date.now / Math.random）", async () => {
    vi.resetModules()
    const fresh = await import("@/app/data/integrations")
    expect(fresh.integrations).toEqual(integrations)
  })

  it("id 与名称均唯一", () => {
    expect(new Set(integrations.map((item) => item.id)).size).toBe(integrations.length)
    expect(new Set(integrations.map((item) => item.name)).size).toBe(integrations.length)
  })

  it("评分应落在 [3.0, 5.0] 且保留一位小数", () => {
    for (const item of integrations) {
      expect(item.rating).toBeGreaterThanOrEqual(3)
      expect(item.rating).toBeLessThanOrEqual(5)
      expect(Number(item.rating.toFixed(1))).toBe(item.rating)
    }
  })

  it("分类必须属于预置分类，且不得为 “全部分类”", () => {
    for (const item of integrations) {
      expect(categories).toContain(item.category)
      expect(item.category).not.toBe("全部分类")
    }
  })

  it("子分类必须属于其所属分类的子分类集合", () => {
    const catalog = subcategories as Record<string, string[]>
    for (const item of integrations) {
      if (item.subcategory === undefined) continue
      expect(catalog[item.category]).toBeDefined()
      expect(catalog[item.category]).toContain(item.subcategory)
    }
  })

  it("行业关注点只能取自行业目录，且不得包含 “全部行业”", () => {
    for (const item of integrations) {
      for (const industry of item.industryFocus ?? []) {
        expect(industries).toContain(industry)
        expect(industry).not.toBe("全部行业")
      }
    }
  })

  it("价格字段应自洽：free 无金额，付费/增值金额不低于 10", () => {
    for (const item of integrations) {
      if (item.price.type === "free") {
        expect(item.price.value).toBeUndefined()
      } else {
        expect(item.price.value).toBeGreaterThanOrEqual(10)
      }
    }
  })

  it("lastUpdate 应以 INTEGRATIONS_REFERENCE_DATE 为基准，不晚于基准时间", () => {
    const upper = INTEGRATIONS_REFERENCE_DATE.getTime()
    const lower = new Date(2022, 0, 1).getTime()
    for (const item of integrations) {
      const updated = new Date(item.lastUpdate).getTime()
      expect(updated).toBeGreaterThanOrEqual(lower)
      expect(updated).toBeLessThanOrEqual(upper)
    }
  })

  it("new 标记应与 lastUpdate 相对基准时间的 30 天窗口一致", () => {
    for (const item of integrations) {
      expect(item.new).toBe(new Date(item.lastUpdate).getTime() > NEW_THRESHOLD)
    }
  })

  it("popular 标记应与 installCount 阈值一致", () => {
    for (const item of integrations) {
      expect(item.popular).toBe(item.installCount > 5000)
    }
  })

  it("标签数量应落在 1-5 且无重复", () => {
    for (const item of integrations) {
      expect(item.tags.length).toBeGreaterThanOrEqual(1)
      expect(item.tags.length).toBeLessThanOrEqual(5)
      expect(new Set(item.tags).size).toBe(item.tags.length)
    }
  })

  it("版本号应符合 semver 形式", () => {
    for (const item of integrations) {
      expect(item.version).toMatch(/^\d+\.\d+\.\d+$/)
    }
  })

  it("字段类型应满足 Integration 契约", () => {
    const sample: Integration = integrations[0]
    expect(typeof sample.id).toBe("string")
    expect(typeof sample.featured).toBe("boolean")
    expect(Array.isArray(sample.tags)).toBe(true)
  })
})

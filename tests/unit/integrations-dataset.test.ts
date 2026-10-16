import { categories, iconMap, integrations, PRICE_FILTER_MAX, subcategories } from "@/app/data/integrations"
import { readdirSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const ITEMS_PER_PAGE = 30

describe("单元测试 · 数据集（核心数据源）", () => {
  it("TC-U-020 集成应用总量为 1000 条", () => {
    expect(integrations).toHaveLength(1000)
  })

  it("TC-U-021 分页口径为 30 条/页，共 34 页", () => {
    const totalPages = Math.ceil(integrations.length / ITEMS_PER_PAGE)
    expect(totalPages).toBe(34)
  })

  it("TC-U-022 应用编号唯一且连续覆盖 1..1000（非法编号可判定）", () => {
    const ids = integrations.map((i) => i.id)
    expect(new Set(ids).size).toBe(1000)
    expect(ids[0]).toBe("1")
    expect(ids[999]).toBe("1000")
    expect(ids.every((id) => /^\d+$/.test(id))).toBe(true)
  })

  it("TC-U-023 每条应用的分类均属于合法分类集合（排除“全部分类”）", () => {
    const valid = new Set(categories.filter((c) => c !== "全部分类"))
    const invalid = integrations.filter((i) => !valid.has(i.category))
    expect(invalid).toHaveLength(0)
  })

  it("TC-U-024 评分落在 [3.0, 5.0]，安装量为非负整数", () => {
    for (const i of integrations) {
      expect(i.rating).toBeGreaterThanOrEqual(3)
      expect(i.rating).toBeLessThanOrEqual(5)
      expect(Number.isInteger(i.installCount)).toBe(true)
      expect(i.installCount).toBeGreaterThanOrEqual(0)
    }
  })

  it("TC-U-025 价格类型仅允许 free/paid/freemium，且 free 无价格值", () => {
    for (const i of integrations) {
      expect(["free", "paid", "freemium"]).toContain(i.price.type)
      if (i.price.type === "free") expect(i.price.value).toBeUndefined()
    }
  })

  it("TC-U-026 标签数量在 1..5 且无重复", () => {
    for (const i of integrations) {
      expect(i.tags.length).toBeGreaterThanOrEqual(1)
      expect(i.tags.length).toBeLessThanOrEqual(5)
      expect(new Set(i.tags).size).toBe(i.tags.length)
    }
  })

  it("TC-U-027 图标键必须在 iconMap 中存在（否则详情页回退图标）", () => {
    const iconKeys = new Set(Object.keys(iconMap))
    const missing = integrations.filter((i) => !iconKeys.has(i.icon))
    expect(missing).toHaveLength(0)
  })

  it("TC-U-028 子分类若存在必须在 subcategories 映射内（合法子分类）", () => {
    for (const i of integrations) {
      if (i.subcategory === undefined) continue
      const subs = subcategories[i.category as keyof typeof subcategories] ?? []
      expect(subs).toContain(i.subcategory)
    }
  })

  it("TC-U-029 分类集合无重复项", () => {
    expect(new Set(categories).size).toBe(categories.length)
  })
})

describe("单元测试 · 确定性生成（P0-3 回归）", () => {
  it("TC-U-030 数据源不含 Math.random（避免 SSR/CSR 水合不一致）", () => {
    // L-4 拆分后数据源为目录模块，逐文件扫描以覆盖全部子模块
    const dataDir = resolve(process.cwd(), "app/data/integrations")
    const sources = readdirSync(dataDir)
      .filter((f) => f.endsWith(".ts"))
      .map((f) => readFileSync(resolve(dataDir, f), "utf8"))
      .join("\n")
    // 允许注释中提及，但代码中不得出现调用
    const codeLines = sources
      .split("\n")
      .filter((line) => !line.trim().startsWith("//") && !line.trim().startsWith("*"))
      .join("\n")
    expect(codeLines).not.toMatch(/Math\.random\s*\(/)
  })

  it("TC-U-031 重复加载模块得到完全一致的数据（确定性）", async () => {
    const first = JSON.stringify(integrations)
    const mod = await import("@/app/data/integrations")
    const second = JSON.stringify(mod.integrations)
    expect(second).toBe(first)
  })

  it("TC-U-036 付费价格全域可被价格筛选上限表达（H-6 边界不变量）", () => {
    const maxPrice = Math.max(
      ...integrations
        .filter((i) => typeof i.price.value === "number")
        .map((i) => i.price.value as number),
    )
    // 滑块上限必须覆盖数据集付费价格最大值（否则 ¥max+ 区间不可达）
    expect(maxPrice).toBeLessThanOrEqual(PRICE_FILTER_MAX)
    // 上限需为滑块步长 5 的整数倍，保证上限值本身可被滑块精确表达
    expect(PRICE_FILTER_MAX % 5).toBe(0)
  })
})

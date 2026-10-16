import { describe, it, expect } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { useOptimizedFilter, type FilterOptions } from "@/app/hooks/use-optimized-filter"
import { makeIntegration, makeIntegrations } from "../fixtures/integrations"

const data = [
  makeIntegration({
    id: "1",
    name: "Alpha",
    category: "数据分析",
    subcategory: "数据可视化",
    developer: "开发者A",
    price: { type: "free" },
    rating: 3.5,
    tags: ["a"],
    installCount: 100,
    featured: true,
    new: true,
    popular: false,
    releaseDate: "2021-01-01",
  }),
  makeIntegration({
    id: "2",
    name: "Beta",
    category: "营销推广",
    subcategory: "内容营销",
    developer: "开发者B",
    price: { type: "paid", value: 20 },
    rating: 4.8,
    tags: ["b"],
    installCount: 9000,
    featured: false,
    new: false,
    popular: true,
    releaseDate: "2020-01-01",
  }),
  makeIntegration({
    id: "3",
    name: "Gamma",
    description: "包含关键词的应用",
    category: "数据分析",
    subcategory: "商业智能",
    developer: "开发者X",
    price: { type: "freemium" },
    rating: 4.0,
    tags: ["c", "search"],
    installCount: 500,
    featured: false,
    new: false,
    popular: false,
    releaseDate: "2022-01-01",
  }),
]

const base: FilterOptions = { category: "全部分类", searchQuery: "" }

describe("单元测试 · useOptimizedFilter（筛选逻辑分支覆盖）", () => {
  it("TC-U-090 全部分类返回全部数据", () => {
    const { result } = renderHook(() => useOptimizedFilter(data, base))
    expect(result.current.filteredIntegrations).toHaveLength(3)
  })

  it("TC-U-091 分类筛选", () => {
    const { result } = renderHook(() => useOptimizedFilter(data, { ...base, category: "数据分析" }))
    expect(result.current.filteredIntegrations.map((i) => i.id)).toEqual(["1", "3"])
  })

  it("TC-U-092 子分类筛选", () => {
    const { result } = renderHook(() => useOptimizedFilter(data, { ...base, subcategory: "内容营销" }))
    expect(result.current.filteredIntegrations.map((i) => i.id)).toEqual(["2"])
  })

  it("TC-U-093 搜索命中名称（防抖后生效）", async () => {
    const { result } = renderHook(() => useOptimizedFilter(data, { ...base, searchQuery: "beta" }))
    await waitFor(() => expect(result.current.filteredIntegrations.map((i) => i.id)).toEqual(["2"]))
  })

  it("TC-U-094 搜索命中开发者与标签（大小写不敏感）", async () => {
    const byDev = renderHook(() => useOptimizedFilter(data, { ...base, searchQuery: "开发者X" }))
    await waitFor(() => expect(byDev.result.current.filteredIntegrations.map((i) => i.id)).toEqual(["3"]))

    const byTag = renderHook(() => useOptimizedFilter(data, { ...base, searchQuery: "SEARCH" }))
    await waitFor(() => expect(byTag.result.current.filteredIntegrations.map((i) => i.id)).toEqual(["3"]))
  })

  it("TC-U-095 价格类型筛选", () => {
    const { result } = renderHook(() => useOptimizedFilter(data, { ...base, priceType: "paid" }))
    expect(result.current.filteredIntegrations.map((i) => i.id)).toEqual(["2"])
  })

  it("TC-U-096 评分下限筛选", () => {
    const { result } = renderHook(() => useOptimizedFilter(data, { ...base, rating: 4.5 }))
    expect(result.current.filteredIntegrations.map((i) => i.id)).toEqual(["2"])
  })

  it("TC-U-097 标签交集（任一命中）筛选", () => {
    const { result } = renderHook(() => useOptimizedFilter(data, { ...base, tags: ["a", "c"] }))
    expect(result.current.filteredIntegrations.map((i) => i.id)).toEqual(["1", "3"])
  })

  it("TC-U-098 featured / new / popular 标记筛选", () => {
    expect(renderHook(() => useOptimizedFilter(data, { ...base, featured: true })).result.current.filteredIntegrations.map((i) => i.id)).toEqual(["1"])
    expect(renderHook(() => useOptimizedFilter(data, { ...base, new: true })).result.current.filteredIntegrations.map((i) => i.id)).toEqual(["1"])
    expect(renderHook(() => useOptimizedFilter(data, { ...base, popular: true })).result.current.filteredIntegrations.map((i) => i.id)).toEqual(["2"])
  })

  it("TC-U-099 排序：installCount 升降序覆盖两个分支", () => {
    const desc = renderHook(() => useOptimizedFilter(data, { ...base, sortBy: "installCount", sortOrder: "desc" }))
    expect(desc.result.current.filteredIntegrations.map((i) => i.id)).toEqual(["2", "3", "1"])

    const asc = renderHook(() => useOptimizedFilter(data, { ...base, sortBy: "installCount", sortOrder: "asc" }))
    expect(asc.result.current.filteredIntegrations.map((i) => i.id)).toEqual(["1", "3", "2"])
  })

  it("TC-U-100 排序：name / rating / releaseDate 分支", () => {
    expect(
      renderHook(() => useOptimizedFilter(data, { ...base, sortBy: "name", sortOrder: "asc" })).result.current.filteredIntegrations.map((i) => i.name),
    ).toEqual(["Alpha", "Beta", "Gamma"])
    expect(
      renderHook(() => useOptimizedFilter(data, { ...base, sortBy: "rating", sortOrder: "desc" })).result.current.filteredIntegrations.map((i) => i.id),
    ).toEqual(["2", "3", "1"])
    expect(
      renderHook(() => useOptimizedFilter(data, { ...base, sortBy: "releaseDate", sortOrder: "asc" })).result.current.filteredIntegrations.map((i) => i.id),
    ).toEqual(["2", "1", "3"])
  })

  it("TC-U-101 filterStats 统计正确，空结果 averageRating 为 0（除零分支）", () => {
    const { result } = renderHook(() => useOptimizedFilter(data, base))
    expect(result.current.filterStats.total).toBe(3)
    expect(result.current.filterStats.filtered).toBe(3)
    expect(result.current.filterStats.categories).toBe(2)
    expect(result.current.filterStats.freeCount).toBe(1)
    expect(result.current.filterStats.paidCount).toBe(1)
    expect(result.current.filterStats.averageRating).toBeCloseTo((3.5 + 4.8 + 4.0) / 3, 5)

    const empty = renderHook(() => useOptimizedFilter(data, { ...base, category: "不存在分类" }))
    expect(empty.result.current.filterStats.filtered).toBe(0)
    expect(empty.result.current.filterStats.averageRating).toBe(0)
  })

  it("TC-U-102 isSearching 在输入与防抖值不一致时为 true", async () => {
    const { result, rerender } = renderHook((opts: FilterOptions) => useOptimizedFilter(data, opts), {
      initialProps: base,
    })
    expect(result.current.isSearching).toBe(false)

    rerender({ ...base, searchQuery: "alp" })
    expect(result.current.isSearching).toBe(true)
    await waitFor(() => expect(result.current.isSearching).toBe(false))
  })

  it("TC-U-103 未提供 sortBy 时保持原始顺序（default 分支）", () => {
    const { result } = renderHook(() => useOptimizedFilter(data, base))
    expect(result.current.filteredIntegrations.map((i) => i.id)).toEqual(["1", "2", "3"])
  })

  it("TC-U-104 大数据量筛选（1000 条）性能与正确性", () => {
    const big = makeIntegrations(1000, { category: "数据分析" })
    const { result } = renderHook(() => useOptimizedFilter(big, { ...base, category: "数据分析" }))
    expect(result.current.filteredIntegrations).toHaveLength(1000)
  })
})

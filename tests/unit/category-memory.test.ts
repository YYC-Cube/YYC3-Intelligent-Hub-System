import { describe, it, expect, beforeEach, vi } from "vitest"
import { CategoryMemoryService } from "@/app/services/category-memory"

const STORAGE_KEY = "yanyu-category-memory"
const SEARCH_HISTORY_KEY = "yanyu-search-history"
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000

beforeEach(() => {
  localStorage.clear()
})

describe("单元测试 · 存储适配器 CategoryMemoryService（localStorage）", () => {
  it("TC-U-060 saveSelection 后 getSelection 可往返读取", () => {
    CategoryMemoryService.saveSelection("数据分析", "数据可视化", { 数据分析: true })
    const sel = CategoryMemoryService.getSelection()
    expect(sel.selectedCategory).toBe("数据分析")
    expect(sel.selectedSubcategory).toBe("数据可视化")
    expect(sel.expandedCategories).toEqual({ 数据分析: true })
    expect(sel.lastVisited).toBeTypeOf("number")
  })

  it("TC-U-061 无存储时返回默认值（全部分类）", () => {
    const sel = CategoryMemoryService.getSelection()
    expect(sel.selectedCategory).toBe("全部分类")
    expect(sel.selectedSubcategory).toBeUndefined()
    expect(sel.searchQuery).toBe("")
    expect(sel.searchHistory).toEqual([])
  })

  it("TC-U-062 记忆超过 7 天视为过期，回退默认值（时间边界）", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        selectedCategory: "营销推广",
        expandedCategories: {},
        searchQuery: "",
        searchHistory: [],
        lastVisited: Date.now() - SEVEN_DAYS - 1000,
      }),
    )
    expect(CategoryMemoryService.getSelection().selectedCategory).toBe("全部分类")
  })

  it("TC-U-063 恰好 7 天内仍生效（时间边界）", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        selectedCategory: "营销推广",
        expandedCategories: {},
        searchQuery: "",
        searchHistory: [],
        lastVisited: Date.now() - SEVEN_DAYS + 60000,
      }),
    )
    expect(CategoryMemoryService.getSelection().selectedCategory).toBe("营销推广")
  })

  it("TC-U-064 存储内容损坏（非法 JSON）时安全回退默认值", () => {
    localStorage.setItem(STORAGE_KEY, "{{{ not-json")
    expect(() => CategoryMemoryService.getSelection()).not.toThrow()
    expect(CategoryMemoryService.getSelection().selectedCategory).toBe("全部分类")
  })

  it("TC-U-065 addSearchHistory 去重并置顶", () => {
    CategoryMemoryService.addSearchHistory("a")
    CategoryMemoryService.addSearchHistory("b")
    CategoryMemoryService.addSearchHistory("a")
    expect(CategoryMemoryService.getSearchHistory()).toEqual(["a", "b"])
  })

  it("TC-U-066 addSearchHistory 空字符串忽略，超长保留最近 10 条", () => {
    CategoryMemoryService.addSearchHistory("   ")
    expect(CategoryMemoryService.getSearchHistory()).toEqual([])

    for (let i = 0; i < 15; i++) CategoryMemoryService.addSearchHistory(`q${i}`)
    const history = CategoryMemoryService.getSearchHistory()
    expect(history).toHaveLength(10)
    expect(history[0]).toBe("q14")
  })

  it("TC-U-067 clearSearchHistory 与 clearAll 清理键值", () => {
    CategoryMemoryService.addSearchHistory("x")
    CategoryMemoryService.clearSearchHistory()
    expect(CategoryMemoryService.getSearchHistory()).toEqual([])

    CategoryMemoryService.saveSelection("效率工具")
    CategoryMemoryService.clearAll()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(localStorage.getItem(SEARCH_HISTORY_KEY)).toBeNull()
  })

  it("TC-U-068 saveSearchQuery / saveExpandedState 写回并保持既有字段", () => {
    CategoryMemoryService.saveSelection("设计创意")
    CategoryMemoryService.saveSearchQuery("dashboard")
    expect(CategoryMemoryService.getSelection().searchQuery).toBe("dashboard")

    CategoryMemoryService.saveExpandedState({ 设计创意: true })
    const sel = CategoryMemoryService.getSelection()
    expect(sel.expandedCategories).toEqual({ 设计创意: true })
    expect(sel.selectedCategory).toBe("设计创意")
  })
})

describe("边界测试 · 存储读写失败容错", () => {
  it("TC-E-030 localStorage.setItem 抛出时（隐私模式/配额）不崩溃", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("QuotaExceededError")
    })
    expect(() => CategoryMemoryService.saveSelection("数据分析")).not.toThrow()
    expect(() => CategoryMemoryService.addSearchHistory("q")).not.toThrow()
    spy.mockRestore()
    warn.mockRestore()
  })

  it("TC-E-031 localStorage.getItem 抛出时 getSelection 回退默认值", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const spy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("SecurityError")
    })
    expect(CategoryMemoryService.getSelection().selectedCategory).toBe("全部分类")
    expect(CategoryMemoryService.getSearchHistory()).toEqual([])
    spy.mockRestore()
    warn.mockRestore()
  })

  it("TC-E-032 localStorage.removeItem 抛出时 clearAll 不崩溃", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const spy = vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new DOMException("SecurityError")
    })
    expect(() => CategoryMemoryService.clearAll()).not.toThrow()
    spy.mockRestore()
    warn.mockRestore()
  })
})

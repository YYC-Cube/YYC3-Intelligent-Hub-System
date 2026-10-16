/**
 * 分类记忆服务 —— 全部读写经 `@yyc3/store` 契约的浏览器适配器收口（P1-5）。
 *
 * 说明：公开 API 保持同步语义不变（组件侧 11 处调用点零改动）；
 * 持久层由 `LocalStorageStore` 承担（SSR 自动降级进程内存），
 * 后续横向替换为 FileStore / RedisStore 时仅需更换适配器实例。
 */

// B-3：键名取自 @/lib/yyc3/store 注册表；B-2：存储实例统一经 hub 组合根获取
import { getHubStore } from "@/lib/yyc3/hub"
import { staticKeys } from "@/lib/yyc3/store"

interface CategoryMemory {
  selectedCategory: string
  selectedSubcategory?: string
  expandedCategories: Record<string, boolean>
  searchQuery: string
  searchHistory: string[]
  lastVisited: number
}

// B-3：键名收口至 @/lib/yyc3/store 键注册表（字面值与历史一致，仅集中登记）
const STORAGE_KEY = staticKeys.categoryMemory
const SEARCH_HISTORY_KEY = staticKeys.searchHistory
const MAX_SEARCH_HISTORY = 10

export class CategoryMemoryService {
  /** 经适配器同步读取原始字符串（不存在 / 不可用返回 undefined） */
  private static readRaw(key: string): string | undefined {
    return getHubStore().getSync(key)
  }

  /** 经适配器同步写入原始字符串（隐私模式 / 配额溢出由适配器静默兜底） */
  private static writeRaw(key: string, value: string): void {
    getHubStore().putSync(key, value)
  }

  // 保存分类选择
  static saveSelection(category: string, subcategory?: string, expandedCategories?: Record<string, boolean>): void {
    const memory: CategoryMemory = {
      selectedCategory: category,
      selectedSubcategory: subcategory,
      expandedCategories: expandedCategories || {},
      searchQuery: "",
      searchHistory: this.getSearchHistory(),
      lastVisited: Date.now(),
    }
    this.writeRaw(STORAGE_KEY, JSON.stringify(memory))
  }

  // 获取分类选择
  static getSelection(): Partial<CategoryMemory> {
    try {
      const stored = this.readRaw(STORAGE_KEY)
      if (stored) {
        const memory: CategoryMemory = JSON.parse(stored)
        // 检查是否过期（7天）
        if (Date.now() - memory.lastVisited < 7 * 24 * 60 * 60 * 1000) {
          return memory
        }
      }
    } catch (error) {
      console.warn("无法获取分类选择:", error)
    }
    return {
      selectedCategory: "全部分类",
      selectedSubcategory: undefined,
      expandedCategories: {},
      searchQuery: "",
      searchHistory: [],
    }
  }

  // 保存搜索查询
  static saveSearchQuery(query: string): void {
    const memory = this.getSelection()
    memory.searchQuery = query
    memory.lastVisited = Date.now()
    this.writeRaw(STORAGE_KEY, JSON.stringify(memory))
  }

  // 添加搜索历史
  static addSearchHistory(query: string): void {
    if (!query.trim()) return

    let history = this.getSearchHistory()
    // 移除重复项
    history = history.filter((item) => item !== query)
    // 添加到开头
    history.unshift(query)
    // 限制数量
    history = history.slice(0, MAX_SEARCH_HISTORY)

    this.writeRaw(SEARCH_HISTORY_KEY, JSON.stringify(history))
  }

  // 获取搜索历史
  static getSearchHistory(): string[] {
    try {
      const stored = this.readRaw(SEARCH_HISTORY_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.warn("无法获取搜索历史:", error)
      return []
    }
  }

  // 清除搜索历史
  static clearSearchHistory(): void {
    getHubStore().deleteSync(SEARCH_HISTORY_KEY)
  }

  // 保存展开状态
  static saveExpandedState(expandedCategories: Record<string, boolean>): void {
    const memory = this.getSelection()
    memory.expandedCategories = expandedCategories
    memory.lastVisited = Date.now()
    this.writeRaw(STORAGE_KEY, JSON.stringify(memory))
  }

  // 清除所有记忆
  static clearAll(): void {
    getHubStore().deleteSync(STORAGE_KEY)
    getHubStore().deleteSync(SEARCH_HISTORY_KEY)
  }
}

"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, X, History, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CategoryMemoryService } from "@/app/services/category-memory"
import { useClientSnapshot } from "@/hooks/use-client-snapshot"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  onSearch: (query: string) => void
  initialValue?: string
  placeholder?: string
  className?: string
}

/** 本地记忆中与搜索相关的字段（与 `CategoryMemoryService.getSelection()` 结构对齐）。 */
interface MemorySelection {
  selectedCategory?: string
  selectedSubcategory?: string
  searchQuery?: string
  expandedCategories?: Record<string, boolean>
}

/** 服务端 / 首次水合期间的兜底快照（模块级稳定引用）。 */
const EMPTY_SELECTION: MemorySelection = {}
const EMPTY_HISTORY: string[] = []

const getMemorySelection = (): MemorySelection => CategoryMemoryService.getSelection()
const getSearchHistory = (): string[] => CategoryMemoryService.getSearchHistory()

export default function SearchBar({
  onSearch,
  initialValue = "",
  placeholder = "搜索集成应用...",
  className,
}: SearchBarProps) {
  // 用户输入为「覆盖值」；为空时回退到 props 或本地记忆中的搜索词，
  // 从而无需在 effect 中 setState 也能完成持久化恢复。
  const [userQuery, setUserQuery] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [historyVersion, setHistoryVersion] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const memorySelection = useClientSnapshot(getMemorySelection, EMPTY_SELECTION)

  const getHistorySnapshot = useCallback(() => {
    void historyVersion
    return getSearchHistory()
  }, [historyVersion])
  const searchHistory = useClientSnapshot(getHistorySnapshot, EMPTY_HISTORY)

  const query = userQuery ?? (initialValue || memorySelection.searchQuery || "")

  // 从本地存储恢复的搜索词仅在挂载后通知一次父组件，不写入本地 state。
  useEffect(() => {
    if (userQuery === null && !initialValue && memorySelection.searchQuery) {
      onSearch(memorySelection.searchQuery)
    }
  }, [userQuery, initialValue, memorySelection.searchQuery, onSearch])

  // 点击外部关闭历史
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowHistory(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim()
    setUserQuery(trimmedQuery)
    onSearch(trimmedQuery)

    // 保存搜索查询和历史
    if (trimmedQuery) {
      CategoryMemoryService.saveSearchQuery(trimmedQuery)
      CategoryMemoryService.addSearchHistory(trimmedQuery)
      setHistoryVersion((version) => version + 1)
    }

    setShowHistory(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUserQuery(value)

    // 实时搜索（防抖在父组件处理）
    onSearch(value)

    // 保存搜索查询
    CategoryMemoryService.saveSearchQuery(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(query)
    } else if (e.key === "Escape") {
      setShowHistory(false)
    }
  }

  const handleClear = () => {
    setUserQuery("")
    onSearch("")
    CategoryMemoryService.saveSearchQuery("")
    inputRef.current?.focus()
  }

  const handleHistoryClick = (historyQuery: string) => {
    handleSearch(historyQuery)
  }

  const handleClearHistory = () => {
    CategoryMemoryService.clearSearchHistory()
    setHistoryVersion((version) => version + 1)
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowHistory(searchHistory.length > 0)}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-10 py-2 rounded-lg border border-blue-200/50",
            "bg-white/70 backdrop-blur-sm text-gray-700 placeholder-blue-400",
            "focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400",
            "transition-all duration-300 shadow-sm",
          )}
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-blue-100"
          >
            <X className="h-4 w-4 text-blue-400" />
          </Button>
        )}
      </div>

      {/* 搜索历史下拉 */}
      {showHistory && searchHistory.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-blue-200/50 z-50 max-h-60 overflow-auto">
          <div className="p-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-sm text-gray-500">
                <History className="h-4 w-4 mr-1" />
                搜索历史
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearHistory}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                清除
              </Button>
            </div>
            <div className="space-y-1">
              {searchHistory.map((historyQuery, index) => (
                <button
                  key={index}
                  onClick={() => handleHistoryClick(historyQuery)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-md transition-colors flex items-center"
                >
                  <Clock className="h-3 w-3 mr-2 text-gray-400" />
                  {historyQuery}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

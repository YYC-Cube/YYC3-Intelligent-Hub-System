'use client';

import type React from 'react';

import { useI18n } from '@/app/hooks/use-i18n';
import { CategoryMemoryService } from '@/app/services/category-memory';
import { Button } from '@/components/ui/button';
import { useClientSnapshot } from '@/hooks/use-client-snapshot';
import { cn } from '@/lib/utils';
import { Clock, History, Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
  placeholder?: string;
  className?: string;
}

/** 本地记忆中与搜索相关的字段（与 `CategoryMemoryService.getSelection()` 结构对齐）。 */
interface MemorySelection {
  selectedCategory?: string;
  selectedSubcategory?: string;
  searchQuery?: string;
  expandedCategories?: Record<string, boolean>;
}

/** 服务端 / 首次水合期间的兜底快照（模块级稳定引用）。 */
const EMPTY_SELECTION: MemorySelection = {};
const EMPTY_HISTORY: string[] = [];

const getMemorySelection = (): MemorySelection => CategoryMemoryService.getSelection();
const getSearchHistory = (): string[] => CategoryMemoryService.getSearchHistory();

export default function SearchBar({
  onSearch,
  initialValue = '',
  placeholder,
  className,
}: SearchBarProps) {
  const { t } = useI18n();
  // placeholder 默认值在组件体内兜底（签名默认值无法响应语言切换）。
  const resolvedPlaceholder = placeholder ?? t('integrations.搜索集成应用...');
  // 用户输入为「覆盖值」；为空时回退到 props 或本地记忆中的搜索词，
  // 从而无需在 effect 中 setState 也能完成持久化恢复。
  const [userQuery, setUserQuery] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyVersion, setHistoryVersion] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const memorySelection = useClientSnapshot(getMemorySelection, EMPTY_SELECTION);

  const getHistorySnapshot = useCallback(() => {
    void historyVersion;
    return getSearchHistory();
  }, [historyVersion]);
  const searchHistory = useClientSnapshot(getHistorySnapshot, EMPTY_HISTORY);

  const query = userQuery ?? (initialValue || memorySelection.searchQuery || '');

  // 从本地存储恢复的搜索词仅在挂载后通知一次父组件，不写入本地 state。
  useEffect(() => {
    if (userQuery === null && !initialValue && memorySelection.searchQuery) {
      onSearch(memorySelection.searchQuery);
    }
  }, [userQuery, initialValue, memorySelection.searchQuery, onSearch]);

  // 点击外部关闭历史
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    setUserQuery(trimmedQuery);
    onSearch(trimmedQuery);

    // 保存搜索查询和历史
    if (trimmedQuery) {
      CategoryMemoryService.saveSearchQuery(trimmedQuery);
      CategoryMemoryService.addSearchHistory(trimmedQuery);
      setHistoryVersion((version) => version + 1);
    }

    setShowHistory(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserQuery(value);

    // 实时搜索（防抖在父组件处理）
    onSearch(value);

    // 保存搜索查询
    CategoryMemoryService.saveSearchQuery(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    } else if (e.key === 'Escape') {
      setShowHistory(false);
    }
  };

  const handleClear = () => {
    setUserQuery('');
    onSearch('');
    CategoryMemoryService.saveSearchQuery('');
    inputRef.current?.focus();
  };

  const handleHistoryClick = (historyQuery: string) => {
    handleSearch(historyQuery);
  };

  const handleClearHistory = () => {
    CategoryMemoryService.clearSearchHistory();
    setHistoryVersion((version) => version + 1);
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-400 h-4 w-4" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowHistory(searchHistory.length > 0)}
          placeholder={resolvedPlaceholder}
          className={cn(
            'w-full pl-10 pr-10 py-2 rounded-lg border border-brand-200/50',
            'bg-card/70 backdrop-blur-sm text-foreground placeholder-brand-400',
            'focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400',
            'transition-[border-color,box-shadow,background-color] duration-fast ease-standard shadow-sm motion-reduce:transition-none'
          )}
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-brand-100"
          >
            <X className="h-4 w-4 text-brand-400" />
          </Button>
        )}
      </div>

      {/* 搜索历史下拉 */}
      {showHistory && searchHistory.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card/95 backdrop-blur-md rounded-lg shadow-lg border border-brand-200/50 z-50 max-h-60 overflow-auto">
          <div className="p-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <History className="h-4 w-4 mr-1" />
                {t('integrations.搜索历史')}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearHistory}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {t('integrations.清除')}
              </Button>
            </div>
            <div className="space-y-1">
              {searchHistory.map((historyQuery, index) => (
                <button
                  key={index}
                  onClick={() => handleHistoryClick(historyQuery)}
                  className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-brand-50 rounded-md transition-colors flex items-center"
                >
                  <Clock className="h-3 w-3 mr-2 text-muted-foreground" />
                  {historyQuery}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

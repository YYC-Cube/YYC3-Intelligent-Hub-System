"use client"

/**
 * 语言切换器：navbar 内使用。
 * 切换后引擎触发订阅广播，所有 useI18n 消费组件自动重渲染。
 */
import { Languages, Check } from "lucide-react"

import { APP_LOCALES } from "@/lib/yyc3/i18n"

import { useI18n } from "@/app/hooks/use-i18n"

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useI18n()

  return (
    <div
      className="flex items-center gap-1 rounded-md border border-border/60 bg-background/80 p-0.5"
      role="group"
      aria-label="Language"
    >
      {!compact && <Languages className="mx-1 h-3.5 w-3.5 text-muted-foreground" />}
      {APP_LOCALES.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setLocale(value)}
          aria-pressed={locale === value}
          className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
            locale === value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {label}
          {locale === value && <Check className="h-3 w-3" />}
        </button>
      ))}
    </div>
  )
}

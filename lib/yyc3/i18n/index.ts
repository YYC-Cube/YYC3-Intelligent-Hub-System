/**
 * 应用 i18n 引擎 —— 基于 @yyc3/i18n-core（自研、零依赖）。
 *
 * 设计要点：
 * - 独立实例而非包内单例，以便注入 missingKeyHandler 兜底；
 * - key 规范：`<namespace>.<中文原文>`，zh-CN 值=原文（由 scripts/extract-i18n-keys.ts 自动生成），
 *   缺键时兜底返回原文段，任何场景都不会露出裸 key；
 * - SSG（next build 静态导出）阶段 locale 固定 zh-CN，保证 hydration 一致；
 *   客户端挂载后由 I18nBootstrap 探测系统/存储语言再切换。
 */
// 浏览器子入口：主入口 dist/index.js 顶层 import fs/path/crypto/timers/promises
// （CLI/文件系统/AI 等 Node 专属能力），value-import 会污染客户端 bundle 致
// next build 失败；./browser 为同源纯净构建（I18nEngine 行为一致，零 Node 内置）。
import { I18nEngine, type Locale, type TranslationMap } from "@yyc3/i18n-core/browser"

import { en } from "./messages/en"
import { zhCN } from "./messages/zh-CN"

/** 站点对外支持的语言（UI 呈现顺序即此数组顺序）。 */
export const APP_LOCALES: ReadonlyArray<{ value: Locale; label: string }> = [
  { value: "zh-CN", label: "简体中文" },
  { value: "en", label: "English" },
]

/** 默认语言（与静态导出的 HTML 语言一致）。 */
export const DEFAULT_LOCALE: Locale = "zh-CN"

/** 从 `ns.原文` 形式的 key 中剥离前导 namespace 段，返回原文段作为缺键兜底。
 *  键规范为 `<命名空间>.<中文原文>`，数据层存在双段命名空间（`data.name.原文`），
 *  因此按「跳过所有前导纯 ASCII 段」策略剥离——既兼容 `data.name.X`（返回 X），
 *  也兼容原文自带省略号的键（`marketplace.搜索集成应用...` 返回原文含省略号）。 */
function fallbackToSource(key: string): string {
  const segments = key.split(".")
  const firstSource = segments.findIndex((seg) => /[^\x00-\x7F]/.test(seg))
  const rest = segments.slice(firstSource >= 0 ? firstSource : segments.length - 1)
  const joined = rest.join(".")
  return joined.length > 0 ? joined : key
}

export const appI18n = new I18nEngine({
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  cache: { enabled: true, maxSize: 2000 },
  missingKeyHandler: fallbackToSource,
})

appI18n.registerTranslation("zh-CN", zhCN)
appI18n.registerTranslation("en", en)

// ---------------------------------------------------------------------------
// 词表槽位钉死（时序竞争防御）
//
// 引擎构造器内部 loadInitialLocale() 会在检测到非默认语言时异步懒加载
// 包内置词表（zh-CN 仅含 common/nav/overview/welcome 四个命名空间），
// 并在微任务时序上覆盖此处已注册的完整词表（1544 键）——
// 导致 data.* 等命名空间全部缺译、经引擎 en 兜底渲染成英文
// （曾致线上中文用户分类/名称显示英文、TC-C-001 等用例失败）。
//
// 防御：以不可配置的访问器属性钉死两个语言槽位——
// 读返回完整词表；写（懒加载覆盖）静默丢弃。无异常、无竞态、不改 vendor。
// ---------------------------------------------------------------------------
const slots = (
  appI18n as unknown as { state: { translations: Record<string, TranslationMap> } }
).state.translations
const pinTranslations = (locale: string, map: TranslationMap): void => {
  Object.defineProperty(slots, locale, {
    get: () => map,
    set: () => {},
    enumerable: true,
    configurable: false,
  })
}
pinTranslations("zh-CN", zhCN)
pinTranslations("en", en)

/** 翻译函数（可在任意 client 组件外直接调用，SSG 阶段返回中文）。 */
export function t(key: string, params?: Record<string, string>): string {
  return appI18n.t(key, params)
}

/**
 * 带命名空间的翻译函数：用于数据驱动场景（枚举值、模块级常量数组等），
 * 将动态中文原文拼接为 `<ns>.<原文>` 后翻译，缺键时兜底返回原文本身。
 */
export function tc(ns: string, text: string, params?: Record<string, string>): string {
  return appI18n.t(`${ns}.${text}`, params)
}

export type { Locale }

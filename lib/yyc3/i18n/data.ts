/**
 * 数据层翻译 helper。
 *
 * 数据源（app/data/integrations.ts）以中文为单一事实源，条目由词表动态组合生成：
 * - name = `${chineseNames[i]}${序号}`，如「数据同步42」；
 * - description = `${chineseDescriptions[i]}该集成提供${category}服务，旨在…`。
 * 展示组件通过本模块间接取键：`dataCat(c)` → `t("data.cat.数据分析")`。
 * name/desc 先做结构拆分再查词表键，保证 1000+ 动态条目仅靠少量词表键即可翻译。
 */
import { t } from "./index"
import { en as enMessages } from "./messages/en"

/** 翻译数据层分类名（主分类）。 */
export function dataCat(category: string): string {
  return t(`data.cat.${category}`)
}

/** 翻译数据层子分类名。 */
export function dataSub(subcategory: string): string {
  return t(`data.sub.${subcategory}`)
}

/** 描述的固定模板句（与 app/data/integrations.ts 生成端保持一致）。 */
const DESC_TEMPLATE = "该集成提供{category}服务，旨在简化您的工作流程并提高效率。凭借强大的功能和简便的集成方式，它是现代企业优化运营和在竞争市场中保持领先地位的必备工具。"
const DESC_HEAD = "该集成提供"

/** 翻译集成条目名称：剥离数字序号后查词表，再拼回序号。 */
export function dataIntegrationName(name: string): string {
  const m = name.match(/^(.+?)(\d+)$/)
  if (m) return t(`data.name.${m[1]}`) + m[2]
  return t(`data.name.${name}`)
}

/** 翻译集成条目描述：拆为「前缀句 + 模板句（插值分类）」。 */
export function dataIntegrationDesc(description: string): string {
  const sep = description.indexOf(DESC_HEAD)
  if (sep > 0) {
    const prefix = description.slice(0, sep)
    const rest = description.slice(sep)
    const m = rest.match(/^该集成提供(.+?)服务，(.*)$/)
    if (m) {
      const head = t(`data.desc.${prefix}`)
      const tail = t(`data.desc.${DESC_TEMPLATE}`, { category: dataCat(m[1]) })
      return head + tail
    }
  }
  return t(`data.desc.${description}`)
}

/** 通用「命名空间 + 动态段」翻译。 */
export function tc(ns: string, value: string): string {
  return t(`${ns}.${value}`)
}

/** 翻译数据层开发者名（专有名词，词表 data.dev 提供）。 */
export function dataDev(developer: string): string {
  return t(`data.dev.${developer}`)
}

/** 翻译数据层标签（词表 data.tag 提供）。 */
export function dataTag(tag: string): string {
  return t(`data.tag.${tag}`)
}

/** 英译名 → 中文原名倒排表（供 document.title 双向本地化）。 */
const EN_NAME_TO_ZH: Record<string, string> = Object.fromEntries(
  Object.entries((enMessages.data as Record<string, unknown>)?.name as Record<string, string> ?? {}).map(([zh, enValue]) => [enValue, zh]),
)

/** 英文集成名反查中文名（含尾随序号）；未知名返回 null。 */
export function dataIntegrationNameReverse(localized: string): string | null {
  const m = localized.match(/^(.+?)(\d+)$/)
  const base = m ? m[1] : localized
  const num = m ? m[2] : ""
  const zh = EN_NAME_TO_ZH[base]
  return zh ? `${zh}${num}` : null
}

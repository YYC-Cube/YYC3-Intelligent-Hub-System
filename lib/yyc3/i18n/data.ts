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

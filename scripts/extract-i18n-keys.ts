/**
 * i18n 键提取与校验脚本。
 *
 * 用法：
 *   npx ts-node --transpile-only scripts/extract-i18n-keys.ts          # 提取并重写 zh-CN.ts，输出 en 缺失清单
 *   npx ts-node --transpile-only scripts/extract-i18n-keys.ts --check  # 仅校验（CI 用），不写文件
 *
 * 提取来源：
 * 1. 代码中的 `t("ns.原文")` / `tc("ns", "原文")` 字面量调用；
 * 2. app/data/integrations.ts 的 categories / subcategories / name / description 字段
 *    （生成 data.cat.* / data.sub.* / data.name.* / data.desc.*）。
 *
 * 产出：lib/yyc3/i18n/messages/zh-CN.ts（值=原文，保证 zh 端 100% 键覆盖）。
 * en.ts 不自动生成 —— 人工真实翻译，本脚本报告其缺失键。
 */
import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const SCAN_DIRS = ["app", "components"]
const EXCLUDE_PATTERNS = [
  /app\/components\/i18n\/language-switcher/, // 语言名本身保留原文
  /app\/design-system\//,
  /app\/examples\//,
  /app\/loading-demo\//,
  /app\/error-test\//,
  /\.test\./,
  /\.spec\./,
  /__tests__\//,
  /app\/data\/integrations\.ts$/, // 单独解析
]
const ZH_FILE = path.join(ROOT, "lib/yyc3/i18n/messages/zh-CN.ts")
const EN_FILE = path.join(ROOT, "lib/yyc3/i18n/messages/en.ts")
const DATA_FILE = path.join(ROOT, "app/data/integrations.ts")

const CN = /[\u4e00-\u9fff]/

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, acc)
    else if (/\.(tsx?|ts)$/.test(entry.name)) acc.push(full)
  }
  return acc
}

/** 递归收集 ts 文件 */
function collectFiles(): string[] {
  const files: string[] = []
  for (const d of SCAN_DIRS) {
    const abs = path.join(ROOT, d)
    if (fs.existsSync(abs)) walk(abs, files)
  }
  return files.filter((f) => !EXCLUDE_PATTERNS.some((re) => re.test(f)))
}

/** 站点全部命名空间（与迁移规范一致） */
const NAMESPACES = [
  "home", "nav", "ui", "auth", "ai", "install", "integrations", "marketplace",
  "favorites", "developer", "account", "admin", "sync", "encryption", "category",
  "errors", "pages", "common", "brand", "data",
] as const
const NS_SET = new Set<string>(NAMESPACES)

type Dict = Map<string, string> // key(原文段) -> value(原文)，按 ns 分组用嵌套 Map

/** 解析 `t("ns.原文")` / `t('ns.原文', {...})`：ns 必须在白名单内，避免路径推导漏键 */
function extractTCall(source: string, file: string): string[] {
  const out = new Set<string>()
  const re = /\bt\(\s*(["'`])([^"'`]+)\1/g
  let m: RegExpExecArray | null
  while ((m = re.exec(source))) {
    const key = m[2]
    if (!CN.test(key)) continue
    const dot = key.indexOf(".")
    const ns = dot > 0 ? key.slice(0, dot) : ""
    if (NS_SET.has(ns)) {
      out.add(key)
    } else if (dot > 0 && !/^[a-z-]+$/.test(ns)) {
      // 中文开头（无 ns 前缀）的键：报告但不收集
      console.warn(`⚠ ${file}: t() 键缺少 namespace 前缀 -> ${key.slice(0, 40)}`)
    }
  }
  return [...out]
}

/** 解析 `tc("ns", "原文")` 第二参数为字面量的调用 */
function extractTcCall(source: string): string[] {
  const out = new Set<string>()
  const re = /\btc\(\s*(["'`])([^"'`]+)\1\s*,\s*(["'`])([^"'`]+)\3/g
  let m: RegExpExecArray | null
  while ((m = re.exec(source))) {
    if (CN.test(m[4]) && NS_SET.has(m[2])) out.add(`${m[2]}.${m[4]}`)
  }
  return [...out]
}

/** 由文件路径推导 namespace（仅用于报告提示，提取已改为白名单制） */

/** 解析 app/data/integrations.ts 的分类与条目文案 */
function extractDataKeys(): { cat: Set<string>; sub: Set<string>; name: Set<string>; desc: Set<string> } {
  const src = fs.readFileSync(DATA_FILE, "utf8")
  const cat = new Set<string>()
  const sub = new Set<string>()
  const name = new Set<string>()
  const desc = new Set<string>()

  // categories 块
  const catBlock = src.match(/export const categories = \[([\s\S]*?)\]/)
  if (catBlock) {
    for (const m of catBlock[1].matchAll(/"([^"]+)"/g)) {
      if (CN.test(m[1])) cat.add(m[1])
    }
  }
  // subcategories 块：对象 key 为主分类（已在 cat），数组值为子分类
  const subBlock = src.match(/export const subcategories = \{([\s\S]*?)\n\}/)
  if (subBlock) {
    let inArray = false
    for (const line of subBlock[1].split("\n")) {
      if (line.includes("[")) inArray = true
      if (line.includes("]")) {
        inArray = false
        continue
      }
      if (inArray) {
        for (const m of line.matchAll(/"([^"]+)"/g)) {
          if (CN.test(m[1])) sub.add(m[1])
        }
      }
    }
  }
  // name/description：集成条目由词表动态组合生成（`name: \`${chineseNames[i]}${n}\``），
  // 无法按字段正则提取。改为解析 chineseNames / chineseDescriptions 数组字面量，
  // 并补充描述的固定模板句（插值 {category}）。
  const namesBlock = src.match(/const chineseNames = \[([\s\S]*?)\]/)
  if (namesBlock) {
    for (const m of namesBlock[1].matchAll(/"([^"]+)"/g)) name.add(m[1])
  }
  const descsBlock = src.match(/const chineseDescriptions = \[([\s\S]*?)\]/)
  if (descsBlock) {
    for (const m of descsBlock[1].matchAll(/"([^"]+)"/g)) desc.add(m[1])
  }
  desc.add("该集成提供{category}服务，旨在简化您的工作流程并提高效率。凭借强大的功能和简便的集成方式，它是现代企业优化运营和在竞争市场中保持领先地位的必备工具。")

  return { cat, sub, name, desc }
}

type TreeNode = { [k: string]: TreeNode | string }

function toNested(entries: Array<[string, string]>): TreeNode {
  const root: TreeNode = {}
  for (const [ns, text] of entries) {
    let node = root
    for (const part of ns.split(".")) {
      if (typeof node[part] === "string") node[part] = {}
      node[part] = (node[part] as TreeNode) || {}
      node = node[part] as TreeNode
    }
    node[text] = text
  }
  return root
}

function serialize(root: TreeNode): string {
  const lines: string[] = [
    "/**",
    " * zh-CN 语言包 —— 由 scripts/extract-i18n-keys.ts 自动生成，请勿手工编辑正文。",
    " * key 规范：`<namespace>.<中文原文>`，值 = 原文。",
    " */",
    'import type { TranslationMap } from "@yyc3/i18n-core"',
    "",
    "export const zhCN: TranslationMap = {",
  ]
  const render = (node: TreeNode, indent: number) => {
    const pad = "  ".repeat(indent)
    for (const key of Object.keys(node).sort((a, b) => a.localeCompare(b, "zh-Hans-CN"))) {
      const value = node[key]
      if (typeof value === "string") {
        lines.push(`${pad}${JSON.stringify(key)}: ${JSON.stringify(value)},`)
      } else {
        lines.push(`${pad}${JSON.stringify(key)}: {`)
        render(value, indent + 1)
        lines.push(`${pad}},`)
      }
    }
  }
  render(root, 1)
  lines.push("}", "")
  return lines.join("\n")
}

function loadEnKeys(): Set<string> {
  if (!fs.existsSync(EN_FILE)) return new Set()
  const src = fs.readFileSync(EN_FILE, "utf8")
  // 通用解析：按缩进 + 花括号栈处理任意深度嵌套（支持 data.cat 等）
  const keys = new Set<string>()
  const stack: string[] = []
  for (const line of src.split("\n")) {
    const open = line.match(/^(\s*)(?:"((?:[^"\\]|\\.)*)"|'([^']*)'|([A-Za-z0-9_-]+)):\s*\{/)
    if (open) {
      // 单行空块 `"ns": {},` / `"ns": { "x": {} }` 不压栈
      if (/\{\s*\}/.test(line) && !/\{\s*\{/.test(line)) continue
      stack.push(open[2] ?? open[3] ?? open[4] ?? "")
      continue
    }
    const leaf = line.match(/^(\s*)(?:"((?:[^"\\]|\\.)*)"|'([^']*)'|([A-Za-z0-9_-]+)):\s*(?:"|'|`)/)
    if (leaf && stack.length) {
      const k = leaf[2] ?? leaf[3] ?? leaf[4] ?? ""
      // 还原 JS 标识符形式的中文键（serialize 用 JSON.stringify，键含特殊字符时带引号）
      keys.add(`${stack.join(".")}.${k}`)
      continue
    }
    if (/^\s*\}/.test(line)) stack.pop()
  }
  return keys
}

function main() {
  const checkOnly = process.argv.includes("--check")
  const collected: Array<[string, string]> = []

  // 1. 代码扫描
  for (const file of collectFiles()) {
    const rel = path.relative(ROOT, file)
    const src = fs.readFileSync(file, "utf8")
    for (const key of extractTCall(src, rel)) {
      const dot = key.indexOf(".")
      collected.push([key.slice(0, dot), key.slice(dot + 1)])
    }
    for (const key of extractTcCall(src)) {
      const dot = key.indexOf(".")
      collected.push([key.slice(0, dot), key.slice(dot + 1)])
    }
  }

  // 2. 数据文件
  const data = extractDataKeys()
  for (const v of data.cat) collected.push(["data.cat", v])
  for (const v of data.sub) collected.push(["data.sub", v])
  for (const v of data.name) collected.push(["data.name", v])
  for (const v of data.desc) collected.push(["data.desc", v])

  // 3. 品牌基础键（lib 常量，代码扫描不含；原文即 key）
  collected.push(["brand", "YanYuCloudCube集成中心系统"], ["brand", "YanYuCloudCube"])
  const tree = toNested(collected)
  const total = collected.length

  if (!checkOnly) {
    fs.writeFileSync(ZH_FILE, serialize(tree), "utf8")
    console.log(`✔ zh-CN.ts 已重写：${Object.keys(tree).length} 个命名空间 / ${total} 个键`)
  } else {
    console.log(`✔ 提取完成：${Object.keys(tree).length} 个命名空间 / ${total} 个键（check 模式，未写入）`)
  }

  // 4. en 覆盖校验
  const enKeys = loadEnKeys()
  const allKeys = new Set(collected.map(([ns, text]) => `${ns}.${text}`))
  const missing = [...allKeys].filter((k) => !enKeys.has(k)).sort()
  if (missing.length) {
    console.log(`⚠ en.ts 缺失 ${missing.length} 个键（缺键时兜底显示中文原文）：`)
    for (const k of missing.slice(0, 80)) console.log(`  - ${k}`)
    if (missing.length > 80) console.log(`  ... 其余 ${missing.length - 80} 个略`)
    if (checkOnly) process.exitCode = 1
  } else {
    console.log("✔ en.ts 键覆盖完整")
  }
}

main()

#!/usr/bin/env node
/**
 * i18n 词表键注入工具（零依赖，Node 直接运行）。
 *
 * 背景：历史上临时注入脚本手工拼接转义序列，把换行写成了双反斜杠 + n
 * （源码字节 `\\n`），JS 解析为字面量而非换行符，导致含换行的多行键
 * 全部查表失配、英文环境回退中文（一次性影响 714 处）。
 *
 * 本工具的转义铁律：
 *   1. 一律用 JSON.stringify 生成 JS 字符串字面量，禁止手工拼接 \n / \" / \\；
 *   2. JSON 输入中的真实换行会被序列化为单反斜杠 n（`\n`），不会再被二次转义；
 *   3. 注入前做双转义体检，命中即拒绝写入。
 *
 * 用法：
 *   # 注入（幂等：已存在的键自动跳过）
 *   node scripts/i18n-add-keys.mjs --from-json keys.json
 *
 *   # 双转义体检（CI 可用，发现即退出码 1）
 *   node scripts/i18n-add-keys.mjs --check-escapes
 *
 * keys.json 格式：
 *   [
 *     { "ns": "pages", "zh": "一、服务说明", "en": "1. Service Description" }
 *   ]
 *   `zh` 即中文原文（同时作为键），`en` 为英文译文；两者都需提供。
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const ZH_FILE = path.join(ROOT, "lib/yyc3/i18n/messages/zh-CN.ts")
const EN_FILE = path.join(ROOT, "lib/yyc3/i18n/messages/en.ts")

/** 与 lib/yyc3/i18n/index.ts 的 normalizeKey 同规则：前导 ASCII 段保留，其后点→全角。 */
function normalizeKey(key) {
  const segments = key.split(".")
  let i = 0
  while (i < segments.length && !/[^\x00-\x7F]/.test(segments[i])) i++
  if (i >= segments.length) return key
  const source = segments.slice(i).join("．").replace(/\.\.\./g, "…")
  return [...segments.slice(0, i), source].join(".")
}

/** 双反斜杠 + 转义字符（源码字节层面的过度转义）。 */
const DOUBLE_ESCAPE = /\\\\[nrt]/g

/** 扫描词表源码中的双转义序列，返回 [行号, 片段]。 */
function findDoubleEscapes(source) {
  const hits = []
  source.split("\n").forEach((line, idx) => {
    if (DOUBLE_ESCAPE.test(line)) hits.push([idx + 1, line.trim().slice(0, 100)])
    DOUBLE_ESCAPE.lastIndex = 0
  })
  return hits
}

function assertNoDoubleEscape(source, file) {
  const hits = findDoubleEscapes(source)
  if (!hits.length) return
  console.error(`✘ ${file} 存在 ${hits.length} 处双转义（\\\\n / \\\\t / \\\\r），拒绝写入：`)
  for (const [line, snippet] of hits.slice(0, 10)) console.error(`  L${line}: ${snippet}`)
  process.exit(1)
}

/** 向指定命名空间对象首位注入键值（4 空格缩进，JSON.stringify 保证转义正确）。 */
function inject(file, entries) {
  let source = fs.readFileSync(file, "utf8")
  assertNoDoubleEscape(source, path.basename(file))

  const byNs = new Map()
  for (const { ns, value } of entries) {
    if (!byNs.has(ns)) byNs.set(ns, [])
    byNs.get(ns).push(value)
  }

  let injected = 0
  let skipped = 0
  for (const [ns, values] of byNs) {
    const anchor = `  ${JSON.stringify(ns)}: {\n`
    const start = source.indexOf(anchor)
    if (start < 0) {
      console.error(`✘ 未找到命名空间锚点：${anchor.trim()}（${path.basename(file)}）`)
      process.exit(1)
    }
    // 去重必须在命名空间作用域内：不同命名空间允许存在同名字符串键
    // （如 favorites.安装 / integrations.安装 / marketplace.安装）。
    const end = source.indexOf("\n  },", start)
    const blockEnd = end < 0 ? source.length : end
    const block = source.slice(start, blockEnd)
    const missing = []
    for (const [key, value] of values) {
      if (block.includes(`    ${JSON.stringify(key)}:`)) {
        skipped++
        continue
      }
      missing.push(`    ${JSON.stringify(key)}: ${JSON.stringify(value)},\n`)
    }
    if (missing.length) {
      const insertAt = start + anchor.length
      source = source.slice(0, insertAt) + missing.join("") + source.slice(insertAt)
      injected += missing.length
    }
  }

  fs.writeFileSync(file, source, "utf8")
  return { injected, skipped }
}

function main() {
  const args = process.argv.slice(2)

  if (args.includes("--check-escapes")) {
    let failed = false
    for (const file of [ZH_FILE, EN_FILE]) {
      const hits = findDoubleEscapes(fs.readFileSync(file, "utf8"))
      const name = path.basename(file)
      if (hits.length) {
        failed = true
        console.error(`✘ ${name}: ${hits.length} 处双转义`)
        for (const [line, snippet] of hits.slice(0, 10)) console.error(`  L${line}: ${snippet}`)
      } else {
        console.log(`✔ ${name}: 无双重转义`)
      }
    }
    process.exit(failed ? 1 : 0)
  }

  const jsonFlag = args.indexOf("--from-json")
  if (jsonFlag < 0 || !args[jsonFlag + 1]) {
    console.error("用法：node scripts/i18n-add-keys.mjs --from-json keys.json")
    console.error("　　　node scripts/i18n-add-keys.mjs --check-escapes")
    process.exit(1)
  }

  const raw = JSON.parse(fs.readFileSync(path.resolve(args[jsonFlag + 1]), "utf8"))
  if (!Array.isArray(raw) || !raw.length) {
    console.error("✘ keys.json 必须是非空数组，元素形如 { ns, zh, en }")
    process.exit(1)
  }
  for (const item of raw) {
    if (!item?.ns || typeof item.zh !== "string" || typeof item.en !== "string") {
      console.error(`✘ 非法条目（需 ns/zh/en 三个字段）：${JSON.stringify(item)}`)
      process.exit(1)
    }
  }

  const zhEntries = raw.map((item) => ({ ns: item.ns, value: [normalizeKey(item.zh), item.zh] }))
  const enEntries = raw.map((item) => ({ ns: item.ns, value: [normalizeKey(item.zh), item.en] }))

  const zh = inject(ZH_FILE, zhEntries)
  const en = inject(EN_FILE, enEntries)
  console.log(`✔ zh-CN.ts 注入 ${zh.injected} 键（跳过已存在 ${zh.skipped}）`)
  console.log(`✔ en.ts 注入 ${en.injected} 键（跳过已存在 ${en.skipped}）`)
}

main()

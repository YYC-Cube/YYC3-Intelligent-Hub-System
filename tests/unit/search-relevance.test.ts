import { describe, expect, it } from "vitest"

import { relevanceScore } from "@/app/utils/search-relevance"

/**
 * M-8 配套单测：加权相关度评分（TC-U-046..049）。
 *
 * 权重契约：name 前缀 100 ＞ name 包含 60 ＞ tag 全等 40 ＞ tag 包含 25 ＞ 简介包含 10。
 */
describe("relevanceScore（加权相关度评分）", () => {
  it("TC-U-046 字段权重严格递减：name 前缀 > name 包含 > tag 全等 > tag 包含 > 简介包含", () => {
    const namePrefix = relevanceScore("数据", { name: "数据分析大师", tags: [], description: "" })
    const nameIncludes = relevanceScore("数据", { name: "智能数据分析", tags: [], description: "" })
    const tagExact = relevanceScore("数据", { name: " unrelated ", tags: ["数据"], description: "" })
    const tagIncludes = relevanceScore("数据", { name: " unrelated ", tags: ["大数据"], description: "" })
    const descriptionOnly = relevanceScore("数据", { name: " unrelated ", tags: [], description: "处理数据的工具" })

    expect(namePrefix).toBe(100)
    expect(nameIncludes).toBe(60)
    expect(tagExact).toBe(40)
    expect(tagIncludes).toBe(25)
    expect(descriptionOnly).toBe(10)

    expect(namePrefix).toBeGreaterThan(nameIncludes)
    expect(nameIncludes).toBeGreaterThan(tagExact)
    expect(tagExact).toBeGreaterThan(tagIncludes)
    expect(tagIncludes).toBeGreaterThan(descriptionOnly)
  })

  it("TC-U-047 命中可叠加：name 包含 + tag 包含 + 简介包含 = 60 + 25 + 10", () => {
    const score = relevanceScore("报表", {
      name: "自动报表生成器",
      tags: ["报表自动化"],
      description: "一键生成周报表与月报表",
    })

    expect(score).toBe(95)
  })

  it("TC-U-048 空查询与纯空白查询返回 0", () => {
    const candidate = { name: "数据分析", tags: ["数据"], description: "数据工具" }

    expect(relevanceScore("", candidate)).toBe(0)
    expect(relevanceScore("   ", candidate)).toBe(0)
  })

  it("TC-U-049 大小写不敏感：NAME 大写查询与 name 小写字段等价命中", () => {
    const candidate = { name: "Slack Notifier", tags: ["slack"], description: "send messages" }

    // name 前缀命中(100) + tag 全等命中(40) = 140，且大小写等价
    expect(relevanceScore("slack", candidate)).toBe(140)
    expect(relevanceScore("slack", candidate)).toBe(relevanceScore("SLACK", candidate))
  })
})

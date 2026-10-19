import { describe, expect, it } from "vitest"

import { t } from "@/lib/yyc3/i18n"
import { dataCat, dataDev, dataIntegrationDesc, dataIntegrationName, dataSub, tc } from "@/lib/yyc3/i18n/data"

/**
 * i18n 回归测试：键规范化 + 词表覆盖。
 *
 * 背景：引擎 v3.0.2 的 resolveTranslation 以 `key.split(".")` 逐段下钻，
 * 键内任何 ASCII 点（省略号 `...`、句点）都会被切碎导致查键必失败。
 * 应用层兼容层（lib/yyc3/i18n/index.ts normalizeKey）统一变换：
 * 前导 ASCII ns 段保留，其后所有 ASCII 点 → 全角 `．`，`...` → `…`。
 * 词表注册与 t()/tc() 入口走同一变换，两侧一致方可命中。
 */
describe("键内点号规范化兼容层", () => {
  it("含省略号/句点的键经统一入口应命中英文", async () => {
    await appI18nSetLocale("en")
    const keys = [
      "nav.搜索应用...",
      "nav.搜索集成应用...",
      "encryption.加载中...",
      "integrations.搜索中...",
      "marketplace.搜索集成应用...",
      "ui.© {year} YanYuCloudCube集成中心. 保留所有权利.",
      "ui.准备用户界面...",
      "home.© YanYuCloudCube {year}. 保留所有权利。",
    ]
    for (const k of keys) {
      expect(t(k, { year: "2026" }), k).not.toMatch(/[\u4e00-\u9fff]/)
    }
  })

  it("zh-CN 环境原文原样呈现", async () => {
    await appI18nSetLocale("zh-CN")
    expect(t("nav.搜索应用...")).toBe("搜索应用...")
    expect(t("favorites.收藏")).toBe("收藏")
  })
})

/** appI18n 仅供测试内切换 locale；业务代码请使用 useI18n。 */
async function appI18nSetLocale(locale: "zh-CN" | "en") {
  const { appI18n } = await import("@/lib/yyc3/i18n")
  await appI18n.setLocale(locale)
}

describe("数据层词表覆盖（data.name / data.desc / data.dev）", () => {
  const names = ["数据同步", "云存储", "支付处理", "游戏开发", "人工智能"]
  const descPrefixes = [
    "提供高效的数据同步服务，确保您的信息在各平台间实时更新，提高工作效率。",
    "安全的云存储服务，随时随地访问您的文件。",
    "游戏开发引擎，支持多平台游戏创建和发布。",
  ]
  const developers = ["言语云科技", "嵩山数据", "未来网络"]

  it("英文环境：名称/描述前缀/开发者全部命中译文", async () => {
    await appI18nSetLocale("en")
    for (const n of names) expect(dataIntegrationName(n), n).not.toMatch(/[\u4e00-\u9fff]/)
    for (const d of descPrefixes) {
      const got = dataIntegrationDesc(d + "该集成提供数据分析服务，旨在简化您的工作流程并提高效率。凭借强大的功能和简便的集成方式，它是现代企业优化运营和在竞争市场中保持领先地位的必备工具。")
      expect(got, d).not.toMatch(/[\u4e00-\u9fff]/)
    }
    for (const dev of developers) expect(dataDev(dev), dev).not.toMatch(/[\u4e00-\u9fff]/)
    expect(dataCat("数据分析")).toBe("Data Analytics")
    expect(dataSub("数据可视化")).toBe("Data Visualization")
  })

  it("zh-CN 环境：原文原样呈现", async () => {
    await appI18nSetLocale("zh-CN")
    expect(dataIntegrationName("数据同步")).toBe("数据同步")
    expect(dataDev("嵩山数据")).toBe("嵩山数据")
    expect(dataCat("数据分析")).toBe("数据分析")
  })
})

describe("学习路径与版本历史词表覆盖（developer / pages ns）", () => {
  it("英文环境：tc 动态键命中译文（含键内句点场景）", async () => {
    await appI18nSetLocale("en")
    // 学习路径：标题/描述/难度/步骤类型
    expect(tc("developer", "入门指南")).toBe("Getting Started Guide")
    expect(tc("developer", "入门")).toBe("Beginner")
    expect(tc("developer", "环境设置")).toBe("Environment Setup")
    expect(tc("developer", "阅读")).toBe("Reading")
    expect(tc("developer", "练习")).toBe("Exercise")
    // 键内含 ASCII 点（域名）——兼容层核心场景
    expect(tc("developer", "自定义域名 nexus.yyc3.vip")).toBe("Custom Domain nexus.yyc3.vip")
    // 版本历史：日期与变更文案
    expect(tc("pages", "2025年4月15日")).toBe("April 15, 2025")
    expect(tc("pages", "添加了收藏云同步功能")).toBe("Added favorites cloud sync")
    expect(tc("pages", "首次发布")).toBe("Initial release")
  })

  it("zh-CN 环境：原文原样呈现", async () => {
    await appI18nSetLocale("zh-CN")
    expect(tc("developer", "入门指南")).toBe("入门指南")
    expect(tc("developer", "自定义域名 nexus.yyc3.vip")).toBe("自定义域名 nexus.yyc3.vip")
    expect(tc("pages", "2025年4月15日")).toBe("2025年4月15日")
  })
})

import { describe, it, expect, vi } from "vitest"
import {
  compareVersions,
  parseVersion,
  needsUpdate,
  getUpdateType,
} from "@/app/utils/version-utils"
import { formatDate, getRelativeTimeString } from "@/app/utils/format-date"
import { getImagePath } from "@/app/utils/image-path"
import { cn } from "@/lib/utils"

describe("单元测试 · version-utils（核心函数）", () => {
  it("TC-U-001 compareVersions 主版本大小判定（含分支）", () => {
    expect(compareVersions("1.2.3", "1.3.0")).toBe(-1)
    expect(compareVersions("1.3.0", "1.2.3")).toBe(1)
    expect(compareVersions("1.2.3", "1.2.3")).toBe(0)
  })

  it("TC-U-002 compareVersions 支持 v 前缀与位数不足补零", () => {
    expect(compareVersions("v1.2.3", "1.2.3")).toBe(0)
    expect(compareVersions("1.2", "1.2.0")).toBe(0)
    expect(compareVersions("1.2", "1.2.1")).toBe(-1)
  })

  it("TC-U-003 compareVersions 预发布版本小于正式版本", () => {
    expect(compareVersions("1.2.3-beta.1", "1.2.3")).toBe(-1)
    expect(compareVersions("1.2.3", "1.2.3-beta.1")).toBe(1)
    expect(compareVersions("1.0.0-alpha", "1.0.0-beta")).not.toBe(0)
  })

  it("TC-U-004 parseVersion 解析完整语义化版本（含预发布/构建元数据）", () => {
    const v = parseVersion("1.2.3-beta.1+build.5")
    expect(v.major).toBe(1)
    expect(v.minor).toBe(2)
    expect(v.patch).toBe(3)
    expect(v.prerelease).toBe("beta.1")
    expect(v.buildMeta).toBe("build.5")
  })

  it("TC-U-005 parseVersion 去除 v 前缀并识别 Git 哈希", () => {
    expect(parseVersion("v2.0.0").major).toBe(2)
    const hashed = parseVersion("1.0.0-a1b2c3d")
    expect(hashed.hash).toBe("a1b2c3d")
  })

  it("TC-U-006 parseVersion 非法输入仅返回 display/raw", () => {
    const v = parseVersion("not-a-version")
    expect(v.major).toBeUndefined()
    expect(v.display).toBe("not-a-version")
    expect(v.raw).toBe("not-a-version")
  })

  it("TC-U-007 needsUpdate 判定更新需求", () => {
    expect(needsUpdate("1.0.0", "1.0.1")).toBe(true)
    expect(needsUpdate("1.0.1", "1.0.0")).toBe(false)
    expect(needsUpdate("1.0.0", "1.0.0")).toBe(false)
  })

  it("TC-U-008 getUpdateType 覆盖 major/minor/patch/none 全部分支", () => {
    expect(getUpdateType("1.0.0", "2.0.0")).toBe("major")
    expect(getUpdateType("1.0.0", "1.1.0")).toBe("minor")
    expect(getUpdateType("1.0.0", "1.0.1")).toBe("patch")
    expect(getUpdateType("1.0.0", "1.0.0")).toBe("none")
    // 非法版本 -> 无可解析主版本 -> none
    expect(getUpdateType("abc", "1.0.0")).toBe("none")
  })
})

describe("单元测试 · format-date（工具类）", () => {
  it("TC-U-009 formatDate 空值返回未知日期", () => {
    expect(formatDate(undefined)).toBe("未知日期")
    expect(formatDate("")).toBe("未知日期")
  })

  it("TC-U-010 formatDate 非法日期返回提示文案", () => {
    expect(formatDate("not-a-date")).toBe("日期格式无效")
  })

  it("TC-U-011 formatDate 有效日期输出包含年份", () => {
    const out = formatDate("2024-05-01T10:30:00Z")
    expect(out).toContain("2024")
  })

  it("TC-U-012 getRelativeTimeString 覆盖 空/非法/秒/天/月/年 分支", () => {
    expect(getRelativeTimeString(undefined)).toBe("未知时间")
    expect(getRelativeTimeString("not-a-date")).toBe("日期格式无效")

    const now = Date.now()
    expect(getRelativeTimeString(new Date(now).toISOString())).toMatch(/秒前$/)
    expect(getRelativeTimeString(new Date(now - 10 * 24 * 3600 * 1000).toISOString())).toMatch(/周前$/)
    expect(getRelativeTimeString(new Date(now - 100 * 24 * 3600 * 1000).toISOString())).toMatch(/个月前$/)
    expect(getRelativeTimeString(new Date(now - 800 * 24 * 3600 * 1000).toISOString())).toMatch(/年前$/)
  })

  it("TC-U-013 getRelativeTimeString 未来时间落入秒分支（边界）", () => {
    const future = new Date(Date.now() + 24 * 3600 * 1000).toISOString()
    const out = getRelativeTimeString(future)
    expect(out).toMatch(/秒前$/)
  })
})

describe("单元测试 · image-path / cn（工具类分支覆盖）", () => {
  it("TC-U-014 getImagePath 覆盖 /public/、public/、已是正确格式三分支", () => {
    expect(getImagePath("/public/logo.png")).toBe("/logo.png")
    expect(getImagePath("public/logo.png")).toBe("/logo.png")
    expect(getImagePath("/logo.png")).toBe("/logo.png")
    expect(getImagePath("")).toBe("")
  })

  it("TC-U-015 cn 合并类名并处理条件对象（clsx + tailwind-merge）", () => {
    expect(cn("a", "b")).toBe("a b")
    expect(cn("p-2", "p-4")).toBe("p-4")
    expect(cn(["x", { y: true, z: false }])).toBe("x y")
    expect(cn(undefined, null, false, "k")).toBe("k")
  })
})

describe("单元测试 · console 分支（异常兜底）", () => {
  it("TC-U-016 formatDate 内部异常时返回兜底文案（分支覆盖）", () => {
    const spy = vi.spyOn(Date.prototype, "toLocaleDateString").mockImplementation(() => {
      throw new Error("boom")
    })
    expect(formatDate("2024-01-01")).toBe("日期格式化错误")
    spy.mockRestore()
  })

  it("TC-U-017 getRelativeTimeString 内部异常时返回兜底文案（分支覆盖）", () => {
    const spy = vi.spyOn(Date.prototype, "getTime").mockImplementation(() => {
      throw new Error("boom")
    })
    expect(getRelativeTimeString("2024-01-01")).toBe("时间计算错误")
    spy.mockRestore()
  })
})

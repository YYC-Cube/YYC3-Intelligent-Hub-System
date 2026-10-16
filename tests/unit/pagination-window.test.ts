/**
 * 分页页码窗口纯函数单元测试（H-3）。
 *
 * buildPageWindow 是市场浏览页与搜索结果页共用的窗口化分页逻辑，
 * 边界覆盖：小页数全量、居中窗口、贴首/贴末收敛、越界收敛、自定义窗口尺寸。
 */
import { describe, it, expect } from "vitest"
import { buildPageWindow } from "@/app/utils/pagination"

describe("单元测试 · 分页页码窗口（buildPageWindow）", () => {
  it("TC-U-040 总页数不超过窗口尺寸时全量返回页码", () => {
    expect(buildPageWindow(1, 5)).toEqual([1, 2, 3, 4, 5])
    expect(buildPageWindow(3, 3)).toEqual([1, 2, 3])
    expect(buildPageWindow(1, 1)).toEqual([1])
  })

  it("TC-U-041 当前页居中时返回对称窗口（84 页第 42 页 → 40..44）", () => {
    expect(buildPageWindow(42, 84)).toEqual([40, 41, 42, 43, 44])
  })

  it("TC-U-042 靠近首页时窗口贴左且不越界", () => {
    expect(buildPageWindow(1, 84)).toEqual([1, 2, 3, 4, 5])
    expect(buildPageWindow(2, 84)).toEqual([1, 2, 3, 4, 5])
    expect(buildPageWindow(3, 84)).toEqual([1, 2, 3, 4, 5])
  })

  it("TC-U-043 靠近末页时窗口贴右（84 页末页 → 80..84）", () => {
    expect(buildPageWindow(84, 84)).toEqual([80, 81, 82, 83, 84])
    expect(buildPageWindow(83, 84)).toEqual([80, 81, 82, 83, 84])
  })

  it("TC-U-044 当前页越界时收敛到首/末页窗口", () => {
    expect(buildPageWindow(100, 84)).toEqual([80, 81, 82, 83, 84])
    expect(buildPageWindow(0, 84)).toEqual([1, 2, 3, 4, 5])
    expect(buildPageWindow(-5, 84)).toEqual([1, 2, 3, 4, 5])
  })

  it("TC-U-045 自定义窗口尺寸（size=3）", () => {
    expect(buildPageWindow(10, 84, 3)).toEqual([9, 10, 11])
    expect(buildPageWindow(1, 84, 3)).toEqual([1, 2, 3])
  })
})

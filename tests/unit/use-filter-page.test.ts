import { renderHook } from "@testing-library/react"
import { act } from "react"
import { describe, expect, it } from "vitest"

import { useFilterPage } from "@/app/hooks/use-filter-page"

describe("unit · useFilterPage（筛选变化自动重置页码）", () => {
  it("初始页码为 1", () => {
    const { result } = renderHook(() => useFilterPage(["a", 1, true]))

    expect(result.current[0]).toBe(1)
  })

  it("筛选依赖变化时页码重置回第 1 页", () => {
    const { result, rerender } = renderHook(({ deps }) => useFilterPage(deps), {
      initialProps: { deps: ["全部分类", "", "rating"] as readonly unknown[] },
    })

    act(() => result.current[1](5))
    expect(result.current[0]).toBe(5)

    rerender({ deps: ["数据分析", "", "rating"] })
    expect(result.current[0]).toBe(1)
  })

  it("仅翻页（依赖不变）时页码保持", () => {
    const { result, rerender } = renderHook(({ deps }) => useFilterPage(deps), {
      initialProps: { deps: ["全部分类", ""] as readonly unknown[] },
    })

    act(() => result.current[1](3))
    rerender({ deps: ["全部分类", ""] })
    expect(result.current[0]).toBe(3)
  })

  it("每次渲染新建依赖数组不影响判定（逐元素 Object.is 比对）", () => {
    const { result, rerender } = renderHook(() => useFilterPage(["a", "b"]))

    act(() => result.current[1](2))
    rerender()
    expect(result.current[0]).toBe(2)
  })

  it("NaN 依赖经 Object.is 比对视为相等，不误触发重置", () => {
    // URL 数值参数解析失败时可能产生 NaN；Object.is(NaN, NaN) === true
    const { result, rerender } = renderHook(({ deps }) => useFilterPage(deps), {
      initialProps: { deps: [Number.NaN, 0] as readonly unknown[] },
    })

    act(() => result.current[1](4))
    rerender({ deps: [Number.NaN, 0] })
    expect(result.current[0]).toBe(4)
  })
})

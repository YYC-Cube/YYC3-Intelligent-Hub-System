import { describe, it, expect, vi } from "vitest"
import { renderHook } from "@testing-library/react"
import { useClientSnapshot } from "@/hooks/use-client-snapshot"

describe("单元测试 · useClientSnapshot（SSR/CSR 安全读取）", () => {
  it("TC-U-080 返回客户端快照值", () => {
    const { result } = renderHook(() => useClientSnapshot(() => ({ a: 1 }), { a: 0 }))
    expect(result.current).toEqual({ a: 1 })
  })

  it("TC-U-081 数据源抛错时回退服务端快照（不再崩溃）", () => {
    const getSnapshot = () => {
      throw new DOMException("SecurityError")
    }
    const fallback = { safe: true }
    const { result } = renderHook(() => useClientSnapshot(getSnapshot, fallback))
    expect(result.current).toEqual(fallback)
  })

  it("TC-U-082 值语义稳定的快照保持引用不变（避免无限更新保护）", () => {
    const getSnapshot = () => ({ value: "stable" })
    const { result, rerender } = renderHook(() => useClientSnapshot(getSnapshot, { value: "" }))
    const first = result.current
    rerender()
    expect(result.current).toBe(first)
  })

  it("TC-U-083 getSnapshot 抛 SecurityError 时被捕获", () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() =>
      renderHook(() =>
        useClientSnapshot<{ x: number }>(() => {
          throw new Error("boom")
        }, { x: -1 }),
      ),
    ).not.toThrow()
    err.mockRestore()
  })
})

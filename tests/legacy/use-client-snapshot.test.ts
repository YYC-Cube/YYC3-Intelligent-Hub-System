/**
 * `useClientSnapshot` 的单元测试（M-1：自 jest 迁移至 vitest）。
 *
 * 该 Hook 是从「effect + setState 读取 localStorage」迁移后的统一范式，
 * 必须保证三点契约：
 * 1. 服务端渲染使用 serverSnapshot，且完全不触碰浏览器 API（避免水合不一致）；
 * 2. 客户端渲染读取真实数据源；
 * 3. 数据源返回语义相同的值时复用同一引用（否则触发 React 无限更新保护）。
 */
import { render, screen } from "@testing-library/react"
import { createElement } from "react"
import { renderToString } from "react-dom/server"
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest"

import { useClientSnapshot } from "@/hooks/use-client-snapshot"

interface Counter {
  count: number
}

const EMPTY_COUNTER: Counter = { count: 0 }

/** 构造一个把快照值渲染到 DOM 上的探针组件（getSnapshot 保持模块级稳定引用）。 */
function createProbe(getSnapshot: () => Counter) {
  return function Probe() {
    const value = useClientSnapshot(getSnapshot, EMPTY_COUNTER)
    return createElement("span", { "data-testid": "value" }, String(value.count))
  }
}

describe("useClientSnapshot", () => {
  // 原 jest.setup.ts 将整个 localStorage 替换为 jest.fn 集合；迁移后由本文件
  // 自持同等语义的 Storage mock（vi.spyOn 会与 vitest 的 restoreMocks 全局
  // 选项冲突：before each 恢复 spy 后拦截失效，故改为显式整体替换）。
  const storageGetItem = vi.fn<() => string | null>(() => null)

  beforeAll(() => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: storageGetItem,
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        key: vi.fn(),
        length: 0,
      } as unknown as Storage,
      writable: true,
      configurable: true,
    })
  })

  beforeEach(() => {
    storageGetItem.mockReset()
  })

  it("服务端渲染时使用 serverSnapshot，且不访问 localStorage", () => {
    const Probe = createProbe(() => ({ count: 42 }))

    const html = renderToString(createElement(Probe))

    expect(html).toContain("0")
    expect(html).not.toContain("42")
    expect(storageGetItem).not.toHaveBeenCalled()
  })

  it("客户端渲染时读取浏览器数据源", () => {
    storageGetItem.mockReturnValue(JSON.stringify({ count: 7 }))
    const Probe = createProbe(() => {
      const raw = window.localStorage.getItem("yyc3:counter")
      return raw ? (JSON.parse(raw) as Counter) : EMPTY_COUNTER
    })

    render(createElement(Probe))

    expect(screen.getByTestId("value").textContent).toBe("7")
    expect(storageGetItem).toHaveBeenCalledWith("yyc3:counter")
  })

  it("数据源返回语义相同的值时复用同一对象引用", () => {
    const seen: Counter[] = []
    // 每次调用都返回全新对象，但 JSON 语义相同
    const getSnapshot = () => ({ count: 1 })
    function Probe() {
      const value = useClientSnapshot(getSnapshot, EMPTY_COUNTER)
      seen.push(value)
      return createElement("span", { "data-testid": "value" }, String(value.count))
    }

    render(createElement(Probe))

    expect(seen.length).toBeGreaterThanOrEqual(1)
    expect(new Set(seen).size).toBe(1)
    expect(seen[0].count).toBe(1)
  })

  it("数据源不可用时应回退到 serverSnapshot 而非抛出异常", () => {
    const getSnapshot = (): Counter => {
      throw new Error("SecurityError: storage is disabled")
    }
    const Probe = createProbe(getSnapshot)

    expect(() => render(createElement(Probe))).not.toThrow()
    expect(screen.getByTestId("value").textContent).toBe("0")
  })

  it("数据源变化后重新渲染应返回最新值", () => {
    const getSnapshot = () => ({
      count: Number(window.localStorage.getItem("yyc3:counter") ?? 0),
    })
    storageGetItem.mockReturnValue("3")
    const Probe = createProbe(getSnapshot)

    const { rerender } = render(createElement(Probe))
    expect(screen.getByTestId("value").textContent).toBe("3")

    storageGetItem.mockReturnValue("9")
    rerender(createElement(Probe))
    expect(screen.getByTestId("value").textContent).toBe("9")
  })
})

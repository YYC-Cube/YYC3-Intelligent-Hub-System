import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import MarketplacePage from "@/app/marketplace/page"

/**
 * 业务场景测试 · 应用市场 Hero 搜索表单
 *
 * 覆盖需求（对应 06 文档遗留 #1 / P1-3）：
 * - 表单 submit 统一 Enter / 点击 / 移动端软键盘「搜索」键；
 * - 空白不跳转、前后空格裁剪、特殊字符编码；
 * - 中文 IME 组合期间回车不误提交；
 * - 搜索区域具备 role="search" 与输入框无障碍名称。
 *
 * 隔离策略：next/navigation 注入 push 探针；收藏与 Toast 为卡片依赖，置空实现。
 */
const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  toast: vi.fn(),
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.push, replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => "/marketplace",
  useSearchParams: () => new URLSearchParams(""),
  useParams: () => ({}),
}))

vi.mock("@/app/context/favorites-context", () => ({
  useFavorites: () => ({
    favorites: [],
    favoritesData: [],
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
    toggleFavorite: vi.fn(),
    isFavorite: () => false,
    clearFavorites: vi.fn(),
    loading: false,
    syncStatus: "idle",
    lastSyncTime: null,
    syncWithCloud: vi.fn(),
    syncOptions: {},
    updateSyncOptions: vi.fn(),
    hasPendingChanges: false,
    isEncrypted: false,
  }),
}))

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: mocks.toast, toasts: [], dismiss: vi.fn() }),
}))

const heroForm = () => screen.getByRole("search")
const heroInput = () => screen.getByRole("searchbox")

beforeEach(() => {
  mocks.push.mockClear()
  mocks.toast.mockClear()
})

describe("业务场景 · 应用市场 Hero 搜索表单", () => {
  it("SEARCH-01 表单提交（Enter 等价）跳转结果页", () => {
    render(<MarketplacePage />)
    fireEvent.change(heroInput(), { target: { value: "crm" } })
    fireEvent.submit(heroForm())

    expect(mocks.push).toHaveBeenCalledTimes(1)
    expect(mocks.push).toHaveBeenCalledWith("/marketplace/search?q=crm")
  })

  it("SEARCH-02 点击搜索按钮提交且仅触发一次导航", () => {
    render(<MarketplacePage />)
    fireEvent.change(heroInput(), { target: { value: "crm" } })
    fireEvent.click(screen.getByRole("button", { name: "搜索" }))

    expect(mocks.push).toHaveBeenCalledTimes(1)
    expect(mocks.push).toHaveBeenCalledWith("/marketplace/search?q=crm")
  })

  it("SEARCH-03 空白输入不跳转", () => {
    render(<MarketplacePage />)
    fireEvent.change(heroInput(), { target: { value: "   " } })
    fireEvent.submit(heroForm())

    expect(mocks.push).not.toHaveBeenCalled()
  })

  it("SEARCH-04 前后空格被裁剪", () => {
    render(<MarketplacePage />)
    fireEvent.change(heroInput(), { target: { value: "  crm  " } })
    fireEvent.submit(heroForm())

    expect(mocks.push).toHaveBeenCalledWith("/marketplace/search?q=crm")
  })

  it("SEARCH-05 特殊字符按 URL 编码", () => {
    render(<MarketplacePage />)
    fireEvent.change(heroInput(), { target: { value: "a&b" } })
    fireEvent.submit(heroForm())

    expect(mocks.push).toHaveBeenCalledWith("/marketplace/search?q=a%26b")
  })

  it("SEARCH-06 IME 组合期间回车不提交，组合结束后恢复", () => {
    render(<MarketplacePage />)
    const input = heroInput()

    // 组合中：React 会忽略 composition 期间的 change，因此此处只验证「不提交」
    fireEvent.compositionStart(input)
    fireEvent.change(input, { target: { value: "中文" } })
    fireEvent.submit(heroForm())
    expect(mocks.push).not.toHaveBeenCalled()

    // 组合结束：浏览器会再派发一次最终值的 input/change，此处显式模拟
    fireEvent.compositionEnd(input)
    fireEvent.change(input, { target: { value: "中文" } })
    fireEvent.submit(heroForm())
    expect(mocks.push).toHaveBeenCalledTimes(1)
    expect(mocks.push).toHaveBeenCalledWith("/marketplace/search?q=%E4%B8%AD%E6%96%87")
  })

  it("SEARCH-07 搜索区域具备表单语义与无障碍名称", () => {
    render(<MarketplacePage />)
    const form = heroForm()
    const input = heroInput()

    expect(form.tagName).toBe("FORM")
    expect(form).toHaveAttribute("action", "/marketplace/search")
    expect(form).toHaveAttribute("method", "get")
    expect(form).toHaveAttribute("aria-label", "搜索集成应用")
    expect(input).toHaveAttribute("name", "q")
    expect(input).toHaveAttribute("aria-label", "搜索集成应用...")
  })
})

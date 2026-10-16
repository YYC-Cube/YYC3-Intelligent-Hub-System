import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { IntegrationCard } from "@/app/marketplace/components/integration-card"
import { makeIntegration } from "../fixtures/integrations"

const mocks = vi.hoisted(() => ({
  isFavorite: vi.fn(() => false),
  toggleFavorite: vi.fn(),
  toast: vi.fn(),
}))

vi.mock("@/app/context/favorites-context", () => ({
  useFavorites: () => ({
    favorites: [],
    favoritesData: [],
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
    toggleFavorite: mocks.toggleFavorite,
    isFavorite: mocks.isFavorite,
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

beforeEach(() => {
  mocks.isFavorite.mockReturnValue(false)
  mocks.toggleFavorite.mockClear()
  mocks.toast.mockClear()
})

describe("组件测试 · 应用卡片渲染", () => {
  it("TC-C-001 渲染名称/开发者/描述/评分/评论数/分类", () => {
    render(
      <IntegrationCard
        integration={makeIntegration({
          id: "42",
          name: "数据魔方",
          developer: "云智科技",
          description: "一站式数据分析平台",
          rating: 4.6,
          reviewCount: 1280,
          category: "数据分析",
        })}
      />,
    )
    expect(screen.getByText("数据魔方")).toBeInTheDocument()
    expect(screen.getByText("云智科技")).toBeInTheDocument()
    expect(screen.getByText("一站式数据分析平台")).toBeInTheDocument()
    expect(screen.getByText("4.6")).toBeInTheDocument()
    expect(screen.getByText("(1280)")).toBeInTheDocument()
    expect(screen.getByText("数据分析")).toBeInTheDocument()
  })

  it("TC-C-002 卡片链接指向详情页 /marketplace/integration/{id}", () => {
    render(<IntegrationCard integration={makeIntegration({ id: "77" })} />)
    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "/marketplace/integration/77")
  })

  it("TC-C-003 安装量超过 1000 时按“千”格式化（两分支）", () => {
    const { rerender } = render(<IntegrationCard integration={makeIntegration({ installCount: 9500 })} />)
    expect(screen.getByText("9.5千")).toBeInTheDocument()

    rerender(<IntegrationCard integration={makeIntegration({ installCount: 800 })} />)
    expect(screen.getByText("800")).toBeInTheDocument()
  })

  it("TC-C-004 价格徽章覆盖 free / freemium / paid 三种渲染", () => {
    const { rerender } = render(<IntegrationCard integration={makeIntegration({ price: { type: "free" } })} />)
    expect(screen.getByText("免费")).toBeInTheDocument()

    rerender(<IntegrationCard integration={makeIntegration({ price: { type: "freemium" } })} />)
    expect(screen.getByText("免费增值")).toBeInTheDocument()

    rerender(<IntegrationCard integration={makeIntegration({ price: { type: "paid", value: 99 } })} />)
    expect(screen.getByText("¥99/月")).toBeInTheDocument()
  })

  it("TC-C-005 new 应用渲染“新上线”角标，非 new 不渲染", () => {
    const { rerender } = render(<IntegrationCard integration={makeIntegration({ new: true })} />)
    expect(screen.getByText("新上线")).toBeInTheDocument()

    rerender(<IntegrationCard integration={makeIntegration({ new: false })} />)
    expect(screen.queryByText("新上线")).not.toBeInTheDocument()
  })

  it("TC-C-006 未悬停时不渲染收藏按钮，悬停后渲染", () => {
    const { container } = render(<IntegrationCard integration={makeIntegration({ id: "5" })} />)
    expect(screen.queryByRole("button")).not.toBeInTheDocument()

    fireEvent.mouseEnter(container.firstElementChild as Element)
    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("TC-C-007 未知图标回退到默认图标而不崩溃", () => {
    expect(() =>
      render(<IntegrationCard integration={makeIntegration({ icon: "__not_exist_icon__" })} />),
    ).not.toThrow()
  })

  it("TC-C-008 超长描述被截断样式容器承载（不产生布局溢出标记）", () => {
    const long = "超长描述".repeat(200)
    render(<IntegrationCard integration={makeIntegration({ description: long })} />)
    const p = screen.getByText(long)
    expect(p.className).toContain("line-clamp-2")
  })
})

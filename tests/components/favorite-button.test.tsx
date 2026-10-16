import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { FavoriteButton } from "@/app/components/favorites/favorite-button"

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

describe("组件测试 · 收藏按钮", () => {
  it("TC-C-010 未收藏时展示“收藏”文案", () => {
    render(<FavoriteButton id="1" />)
    expect(screen.getByRole("button")).toHaveTextContent("收藏")
    expect(screen.getByRole("button")).not.toHaveTextContent("已收藏")
  })

  it("TC-C-011 已收藏时展示“已收藏”文案", () => {
    mocks.isFavorite.mockReturnValue(true)
    render(<FavoriteButton id="1" />)
    expect(screen.getByRole("button")).toHaveTextContent("已收藏")
  })

  it("TC-C-012 点击触发 toggleFavorite(id) 并提示“已添加到收藏”", () => {
    render(<FavoriteButton id="abc" />)
    fireEvent.click(screen.getByRole("button"))
    expect(mocks.toggleFavorite).toHaveBeenCalledWith("abc")
    expect(mocks.toast).toHaveBeenCalledWith(
      expect.objectContaining({ title: "已添加到收藏" }),
    )
  })

  it("TC-C-013 已收藏状态下点击提示“已从收藏中移除”", () => {
    mocks.isFavorite.mockReturnValue(true)
    render(<FavoriteButton id="abc" />)
    fireEvent.click(screen.getByRole("button"))
    expect(mocks.toast).toHaveBeenCalledWith(
      expect.objectContaining({ title: "已从收藏中移除" }),
    )
  })

  it("TC-C-014 showText=false 时不渲染文字（仅图标）", () => {
    render(<FavoriteButton id="1" showText={false} />)
    expect(screen.getByRole("button")).toHaveTextContent("")
  })

  it("TC-C-015 点击阻止事件冒泡（避免触发卡片跳转）", () => {
    const onParentClick = vi.fn()
    render(
      <div role="presentation" onClick={onParentClick}>
        <FavoriteButton id="1" />
      </div>,
    )
    fireEvent.click(screen.getByRole("button"))
    expect(onParentClick).not.toHaveBeenCalled()
  })
})

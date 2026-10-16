import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { EmptyFavorites } from "@/app/components/favorites/empty-favorites"

describe("组件测试 · 空状态（暂无收藏）", () => {
  it("TC-C-020 渲染空状态标题与说明文案", () => {
    render(<EmptyFavorites />)
    expect(screen.getByRole("heading", { name: "暂无收藏" })).toBeInTheDocument()
    expect(screen.getByText(/浏览集成应用市场/)).toBeInTheDocument()
  })

  it("TC-C-021 提供“浏览集成应用”与“查看热门集成”两个引导入口", () => {
    render(<EmptyFavorites />)
    expect(screen.getByRole("link", { name: /浏览集成应用/ })).toHaveAttribute("href", "/marketplace")
    expect(screen.getByRole("link", { name: /查看热门集成/ })).toHaveAttribute("href", "/marketplace/popular")
  })
})

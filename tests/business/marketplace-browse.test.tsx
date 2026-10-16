import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

import { IntegrationBrowser } from "@/app/marketplace/components/integration-browser"
import { integrations } from "@/app/data/integrations"
import { makeIntegration, makeIntegrations } from "../fixtures/integrations"

/**
 * 业务场景测试 · 应用市场浏览（IntegrationBrowser）
 *
 * 覆盖需求：应用列表加载、分类/关键字检索、收藏入口占位、分页翻页（共 34 页）、空状态。
 * 隔离策略：Navbar / FavoriteButton 依赖全局 Provider，业务链路中与浏览无关，故置空。
 */
vi.mock("@/components/ui/navbar", () => ({ Navbar: () => null }))
vi.mock("@/app/components/favorites/favorite-button", () => ({ FavoriteButton: () => null }))

/** 应用网格为 ul.list-none 下的 li 列表，排除页脚等其它列表干扰。 */
const gridItems = (container: HTMLElement) => container.querySelectorAll("ul.list-none > li")

describe("业务场景 · 应用市场浏览（IntegrationBrowser）", () => {
  it("TC-B-001 全量 1000 条应用按 30 条/页展开为 34 页", () => {
    const { container } = render(<IntegrationBrowser title="全部应用" source={integrations} itemsPerPage={30} />)

    expect(screen.getByText("共 1000 个集成应用")).toBeInTheDocument()
    expect(gridItems(container)).toHaveLength(30)
    // 页码窗口 [1..5] 后折叠，末页 34 必须可达
    expect(screen.getByRole("button", { name: "34" })).toBeInTheDocument()
  })

  it("TC-B-002 首页按数据源顺序渲染且上一页禁用", () => {
    const { container } = render(<IntegrationBrowser title="全部应用" source={integrations} itemsPerPage={30} />)

    expect(screen.getByRole("button", { name: "上一页" })).toBeDisabled()
    expect(gridItems(container)[0].textContent).toContain(integrations[0].name)
    expect(gridItems(container)[29].textContent).toContain(integrations[29].name)
  })

  it("TC-B-003 翻至第 2 页后内容前移且当前页高亮", () => {
    const { container } = render(<IntegrationBrowser title="全部应用" source={integrations} itemsPerPage={30} />)

    fireEvent.click(screen.getByRole("button", { name: "下一页" }))

    expect(screen.getByRole("button", { name: "2" })).toHaveAttribute("aria-current", "page")
    expect(gridItems(container)).toHaveLength(30)
    expect(gridItems(container)[0].textContent).toContain(integrations[30].name)
    expect(screen.queryByText(integrations[0].name)).not.toBeInTheDocument()
  })

  it("TC-B-004 跳转末页（第 34 页）仅渲染剩余 10 条且下一页禁用", () => {
    const { container } = render(<IntegrationBrowser title="全部应用" source={integrations} itemsPerPage={30} />)

    fireEvent.click(screen.getByRole("button", { name: "34" }))

    expect(gridItems(container)).toHaveLength(10)
    expect(screen.getByRole("button", { name: "34" })).toHaveAttribute("aria-current", "page")
    expect(screen.getByRole("button", { name: "下一页" })).toBeDisabled()
  })

  it("TC-B-005 关键字检索命中名称/简介/开发者/标签并显示结果数", () => {
    const source = [
      makeIntegration({ id: "a", name: "Alpha工具", description: "分析平台", developer: "甲方", tags: ["分析"] }),
      makeIntegration({ id: "b", name: "Beta平台", description: "营销助手", developer: "乙方", tags: ["营销"] }),
    ]
    render(<IntegrationBrowser title="检索" source={source} />)

    fireEvent.change(screen.getByLabelText("搜索集成应用"), { target: { value: "营销" } })

    expect(screen.getByText("Beta平台")).toBeInTheDocument()
    expect(screen.queryByText("Alpha工具")).not.toBeInTheDocument()
    expect(screen.getByText("共 1 个集成应用")).toBeInTheDocument()
  })

  it("TC-B-006 检索无结果展示空状态与引导文案", () => {
    render(<IntegrationBrowser title="检索" source={makeIntegrations(5)} />)

    fireEvent.change(screen.getByLabelText("搜索集成应用"), { target: { value: "绝无此关键字XYZ" } })

    expect(screen.getByRole("heading", { name: "未找到匹配的集成应用" })).toBeInTheDocument()
    expect(screen.getByText("换个关键字或筛选条件试试吧")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "返回应用市场" })).toBeInTheDocument()
    expect(screen.getByText("共 0 个集成应用")).toBeInTheDocument()
  })

  it("TC-B-007 空数据源展示 0 条、0.0 平均评分与空状态", () => {
    render(<IntegrationBrowser title="空数据源" source={[]} />)

    expect(screen.getByText("共 0 个集成应用")).toBeInTheDocument()
    expect(screen.getByText("0.0")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "未找到匹配的集成应用" })).toBeInTheDocument()
  })

  it("TC-B-008 平均评分按数据源均值展示并保留一位小数", () => {
    const source = [makeIntegration({ id: "1", rating: 4 }), makeIntegration({ id: "2", rating: 5 })]
    render(<IntegrationBrowser title="评分" source={source} />)

    expect(screen.getByText("4.5")).toBeInTheDocument()
  })

  it("TC-B-009 检索触发时页码自动回到第 1 页", () => {
    render(<IntegrationBrowser title="翻页" source={makeIntegrations(60)} itemsPerPage={30} />)

    fireEvent.click(screen.getByRole("button", { name: "下一页" }))
    expect(screen.getByRole("button", { name: "2" })).toHaveAttribute("aria-current", "page")

    fireEvent.change(screen.getByLabelText("搜索集成应用"), { target: { value: "测试应用" } })

    expect(screen.getByRole("button", { name: "上一页" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "1" })).toHaveAttribute("aria-current", "page")
  })
})

import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import IntegrationGrid from "@/app/integrations/components/IntegrationGrid"
import { makeIntegrations } from "../fixtures/integrations"

vi.mock("@/app/integrations/components/IntegrationCard", async () => {
  const React = await import("react")
  return {
    default: ({ integration }: any) =>
      React.createElement("div", { "data-testid": "integration-card" }, integration.name),
  }
})

describe("组件测试 · 应用列表加载与空状态", () => {
  it("TC-C-040 空数据渲染空状态文案", () => {
    render(<IntegrationGrid integrations={[]} />)
    expect(screen.getByText("未找到匹配的集成应用")).toBeInTheDocument()
    expect(screen.queryByTestId("integration-card")).not.toBeInTheDocument()
  })

  it("TC-C-041 有数据时按数量渲染卡片", () => {
    render(<IntegrationGrid integrations={makeIntegrations(5)} />)
    expect(screen.getAllByTestId("integration-card")).toHaveLength(5)
  })

  it("TC-C-042 单页 30 条数据完整渲染（分页口径）", () => {
    render(<IntegrationGrid integrations={makeIntegrations(30)} />)
    expect(screen.getAllByTestId("integration-card")).toHaveLength(30)
  })

  it("TC-C-043 列表项以 id 为 key 稳定渲染，不重复", () => {
    render(<IntegrationGrid integrations={makeIntegrations(10)} />)
    const names = screen.getAllByTestId("integration-card").map((el) => el.textContent)
    expect(new Set(names).size).toBe(10)
  })
})

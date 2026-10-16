import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react"

import IntegrationsPage from "@/app/integrations/page"
import { integrations } from "@/app/data/integrations"

/**
 * 业务场景测试 · 集成应用中心（IntegrationsPage）
 *
 * 覆盖需求：应用列表加载、分类检索、多分类切换、关键字检索、重置筛选、34 页分页翻页。
 * 隔离策略：Navbar 依赖全局 Provider，与集成中心筛选链路无关，故置空。
 */
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(""),
  usePathname: () => "/integrations",
  useParams: () => ({}),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND")
  }),
}))
vi.mock("@/components/ui/navbar", () => ({ Navbar: () => null }))

const countByCategory = (category: string) => integrations.filter((i) => i.category === category).length

/** 与 useOptimizedFilter 一致的关键字命中规则：名称/简介/开发者/标签。 */
const expectedMatches = (term: string) => {
  const q = term.trim().toLowerCase()
  return integrations.filter(
    (i) =>
      i.name.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.developer.toLowerCase().includes(q) ||
      i.tags.some((t) => t.toLowerCase().includes(q)),
  ).length
}

const filteredCount = () => screen.getByText("个应用").previousElementSibling?.textContent
const cardLinks = (container: HTMLElement) => container.querySelectorAll("a[href^='/integrations/']")

const pagerRoot = () => document.querySelector("div.flex.justify-center.items-center.space-x-2") as HTMLElement
const pagerText = () => within(pagerRoot()).getByText(/第 \d+ 页/).textContent
const pagerButtons = () => within(pagerRoot()).getAllByRole("button") as HTMLButtonElement[]

describe("业务场景 · 集成应用中心（IntegrationsPage）", () => {
  /**
   * 时间冻结：CategoryMemoryService 每次写入都会刷新 lastVisited，而页面/分类侧栏的
   * useSyncExternalStore 快照由 localStorage JSON 派生。真实时间推进会让快照持续变化，
   * 触发「写入 → 快照变化 → 重渲染 → 再写入」的无限渲染（已由 TC-S 缺陷用例单独复现）。
   * 业务链路测试中冻结时间以隔离该缺陷，聚焦筛选/分页行为本身。
   */
  beforeEach(() => {
    window.localStorage.clear()
    vi.spyOn(Date, "now").mockReturnValue(new Date("2026-10-16T00:00:00.000Z").getTime())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("TC-B-010 默认加载全部应用：1000 条、共 34 页、首屏 30 条", () => {
    const { container } = render(<IntegrationsPage />)

    expect(filteredCount()).toBe("1000")
    expect(pagerText()).toBe("第 1 页，共 34 页")
    expect(cardLinks(container)).toHaveLength(30)
    expect(pagerButtons()[0]).toBeDisabled()
  })

  it("TC-B-011 分类检索：点击「数据分析」后仅展示该分类应用", () => {
    render(<IntegrationsPage />)

    fireEvent.click(screen.getByRole("button", { name: "数据分析" }))

    expect(filteredCount()).toBe(String(countByCategory("数据分析")))
  })

  it("TC-B-012 多分类切换：分类切换后结果数量随之变化", () => {
    render(<IntegrationsPage />)

    fireEvent.click(screen.getByRole("button", { name: "数据分析" }))
    expect(filteredCount()).toBe(String(countByCategory("数据分析")))

    fireEvent.click(screen.getByRole("button", { name: "营销推广" }))
    expect(filteredCount()).toBe(String(countByCategory("营销推广")))

    fireEvent.click(screen.getByRole("button", { name: "效率工具" }))
    expect(filteredCount()).toBe(String(countByCategory("效率工具")))
  })

  it("TC-B-013 关键字检索：命中数量正确、目标应用可见并回到第 1 页", async () => {
    render(<IntegrationsPage />)

    const target = integrations[integrations.length - 1]
    fireEvent.change(screen.getByPlaceholderText("搜索集成应用..."), { target: { value: target.name } })

    await waitFor(() => expect(filteredCount()).toBe(String(expectedMatches(target.name))))
    expect(screen.getByText(target.name)).toBeInTheDocument()
    expect(screen.getByText(`搜索: ${target.name}`)).toBeInTheDocument()
  })

  it("TC-B-014 重置筛选：恢复全量列表与默认分页状态", async () => {
    render(<IntegrationsPage />)

    const target = integrations[integrations.length - 1]
    fireEvent.change(screen.getByPlaceholderText("搜索集成应用..."), { target: { value: target.name } })
    await waitFor(() => expect(filteredCount()).not.toBe("1000"))

    fireEvent.click(screen.getByRole("button", { name: "重置筛选" }))

    await waitFor(() => expect(filteredCount()).toBe("1000"))
    expect(pagerText()).toBe("第 1 页，共 34 页")
    expect(screen.queryByText(/搜索:/)).not.toBeInTheDocument()
  })

  it("TC-B-015 分页翻页：下一页进入第 2 页并可回退到第 1 页", () => {
    const { container } = render(<IntegrationsPage />)

    fireEvent.click(pagerButtons()[1])
    expect(pagerText()).toBe("第 2 页，共 34 页")
    expect(cardLinks(container)).toHaveLength(30)

    fireEvent.click(pagerButtons()[0])
    expect(pagerText()).toBe("第 1 页，共 34 页")
    expect(pagerButtons()[0]).toBeDisabled()
  })

  it("TC-B-016 新增应用上架：新上架应用进入目录并可被检索定位", async () => {
    render(<IntegrationsPage />)

    expect(integrations.some((i) => i.new)).toBe(true)

    const newlyListed = integrations.find((i) => i.new)!
    fireEvent.change(screen.getByPlaceholderText("搜索集成应用..."), { target: { value: newlyListed.name } })

    await waitFor(() => expect(filteredCount()).toBe(String(expectedMatches(newlyListed.name))))
    expect(screen.getByText(newlyListed.name)).toBeInTheDocument()
  })

  it("TC-B-017 分页翻页：连续翻页可直达末页（第 34 页）并仅渲染剩余 10 条", () => {
    const { container } = render(<IntegrationsPage />)

    for (let i = 0; i < 33; i += 1) {
      fireEvent.click(pagerButtons()[1])
    }

    expect(pagerText()).toBe("第 34 页，共 34 页")
    expect(cardLinks(container)).toHaveLength(10)
    expect(pagerButtons()[1]).toBeDisabled()
  })
})

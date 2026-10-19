import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, within } from "@testing-library/react"
import Pagination from "@/app/integrations/components/Pagination"

const getPrevButton = (container: HTMLElement) =>
  within(container).getByRole("button", { name: "上一页" })
const getNextButton = (container: HTMLElement) =>
  within(container).getByRole("button", { name: "下一页" })

describe("组件测试 · 分页", () => {
  it("TC-C-030 渲染当前页与总页数（共 34 页）", () => {
    render(<Pagination currentPage={1} totalPages={34} onPageChange={vi.fn()} />)
    expect(screen.getByText("第 1 页，共 34 页")).toBeInTheDocument()
  })

  it("TC-C-031 首页时“上一页”按钮禁用", () => {
    const { container } = render(<Pagination currentPage={1} totalPages={34} onPageChange={vi.fn()} />)
    expect(getPrevButton(container)).toBeDisabled()
    expect(getNextButton(container)).not.toBeDisabled()
  })

  it("TC-C-032 末页（第 34 页）时“下一页”按钮禁用", () => {
    const { container } = render(<Pagination currentPage={34} totalPages={34} onPageChange={vi.fn()} />)
    expect(getPrevButton(container)).not.toBeDisabled()
    expect(getNextButton(container)).toBeDisabled()
  })

  it("TC-C-033 点击“下一页”回调 currentPage + 1", () => {
    const onPageChange = vi.fn()
    const { container } = render(<Pagination currentPage={5} totalPages={34} onPageChange={onPageChange} />)
    fireEvent.click(getNextButton(container))
    expect(onPageChange).toHaveBeenCalledWith(6)
  })

  it("TC-C-034 点击“上一页”回调 currentPage - 1", () => {
    const onPageChange = vi.fn()
    const { container } = render(<Pagination currentPage={5} totalPages={34} onPageChange={onPageChange} />)
    fireEvent.click(getPrevButton(container))
    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it("TC-C-035 单页场景（totalPages=1）双向均禁用", () => {
    const { container } = render(<Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />)
    expect(getPrevButton(container)).toBeDisabled()
    expect(getNextButton(container)).toBeDisabled()
  })

  it("TC-C-036 当前页按钮 aria-current=page 且禁用重复点击", () => {
    const { container } = render(<Pagination currentPage={3} totalPages={34} onPageChange={vi.fn()} />)
    const current = within(container).getByRole("button", { name: "第 3 页" })
    expect(current).toHaveAttribute("aria-current", "page")
    expect(current).toBeDisabled()
  })

  it("TC-C-037 长列表渲染页码窗口与省略符（34 页窗口 5）", () => {
    const onPageChange = vi.fn()
    const { container } = render(
      <Pagination currentPage={1} totalPages={34} onPageChange={onPageChange} />
    )
    // 窗口内页码 1-5，首端无省略符、末端有省略符
    expect(within(container).getByRole("button", { name: "第 1 页" })).toBeInTheDocument()
    expect(within(container).getByRole("button", { name: "第 5 页" })).toBeInTheDocument()
    expect(within(container).queryByRole("button", { name: "第 6 页" })).not.toBeInTheDocument()
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(0)
  })

  it("TC-C-038 点击页码按钮回调对应页码", () => {
    const onPageChange = vi.fn()
    const { container } = render(<Pagination currentPage={1} totalPages={34} onPageChange={onPageChange} />)
    fireEvent.click(within(container).getByRole("button", { name: "第 4 页" }))
    expect(onPageChange).toHaveBeenCalledWith(4)
  })
})

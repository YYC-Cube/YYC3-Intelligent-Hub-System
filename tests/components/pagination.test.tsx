import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import Pagination from "@/app/integrations/components/Pagination"

const getButtons = (container: HTMLElement) => Array.from(container.querySelectorAll("button"))

describe("组件测试 · 分页", () => {
  it("TC-C-030 渲染当前页与总页数（共 34 页）", () => {
    render(<Pagination currentPage={1} totalPages={34} onPageChange={vi.fn()} />)
    expect(screen.getByText("第 1 页，共 34 页")).toBeInTheDocument()
  })

  it("TC-C-031 首页时“上一页”按钮禁用", () => {
    const { container } = render(<Pagination currentPage={1} totalPages={34} onPageChange={vi.fn()} />)
    const [prev, next] = getButtons(container)
    expect(prev).toBeDisabled()
    expect(next).not.toBeDisabled()
  })

  it("TC-C-032 末页（第 34 页）时“下一页”按钮禁用", () => {
    const { container } = render(<Pagination currentPage={34} totalPages={34} onPageChange={vi.fn()} />)
    const [prev, next] = getButtons(container)
    expect(prev).not.toBeDisabled()
    expect(next).toBeDisabled()
  })

  it("TC-C-033 点击“下一页”回调 currentPage + 1", () => {
    const onPageChange = vi.fn()
    const { container } = render(<Pagination currentPage={5} totalPages={34} onPageChange={onPageChange} />)
    fireEvent.click(getButtons(container)[1])
    expect(onPageChange).toHaveBeenCalledWith(6)
  })

  it("TC-C-034 点击“上一页”回调 currentPage - 1", () => {
    const onPageChange = vi.fn()
    const { container } = render(<Pagination currentPage={5} totalPages={34} onPageChange={onPageChange} />)
    fireEvent.click(getButtons(container)[0])
    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it("TC-C-035 单页场景（totalPages=1）双向均禁用", () => {
    const { container } = render(<Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />)
    const [prev, next] = getButtons(container)
    expect(prev).toBeDisabled()
    expect(next).toBeDisabled()
  })
})

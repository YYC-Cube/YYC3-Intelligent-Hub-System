import { describe, expect, it, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

import { ConfirmActionDialog } from "@/app/components/ui/confirm-action-dialog"

/**
 * 全站唯一危险操作确认弹窗（增删改查交互规范组件化落地）。
 * 断言四段固定结构：标题 / 后果描述 / 取消（左）/ 确认（右）。
 */
describe("unit · ConfirmActionDialog（危险操作确认弹窗）", () => {
  it("受控打开时渲染标题、描述与取消/确认按钮", () => {
    render(
      <ConfirmActionDialog
        open
        onOpenChange={() => {}}
        title="确认清空收藏列表？"
        description="此操作将删除您收藏的所有集成应用。此操作无法撤销。"
        onConfirm={() => {}}
        cancelLabel="取消"
        confirmLabel="确认"
      />
    )

    expect(screen.getByRole("alertdialog")).toBeInTheDocument()
    expect(screen.getByText("确认清空收藏列表？")).toBeInTheDocument()
    expect(screen.getByText("此操作将删除您收藏的所有集成应用。此操作无法撤销。")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "取消" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "确认" })).toBeInTheDocument()
  })

  it("点击确认触发 onConfirm", () => {
    const onConfirm = vi.fn()
    render(
      <ConfirmActionDialog
        open
        onOpenChange={() => {}}
        title="确认删除所选的 3 个收藏？"
        description="此操作无法撤销。"
        onConfirm={onConfirm}
        cancelLabel="取消"
        confirmLabel="确认"
      />
    )

    fireEvent.click(screen.getByRole("button", { name: "确认" }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it("点击取消关闭弹窗且不触发 onConfirm", () => {
    const onConfirm = vi.fn()
    const onOpenChange = vi.fn()
    render(
      <ConfirmActionDialog
        open
        onOpenChange={onOpenChange}
        title="确认禁用加密？"
        description="此操作无法撤销。"
        onConfirm={onConfirm}
        cancelLabel="取消"
        confirmLabel="确认禁用"
      />
    )

    fireEvent.click(screen.getByRole("button", { name: "取消" }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it("closed 状态不渲染弹窗；提供 trigger 时可由触发器打开", () => {
    const onOpenChange = vi.fn()
    const { container } = render(
      <ConfirmActionDialog
        open={false}
        onOpenChange={onOpenChange}
        trigger={<button type="button">删除</button>}
        title="确认？"
        description="后果说明。"
        onConfirm={() => {}}
        cancelLabel="取消"
        confirmLabel="确认"
      />
    )

    expect(container.querySelector("[role='alertdialog']")).toBeNull()
    expect(screen.getByRole("button", { name: "删除" })).toBeInTheDocument()
  })
})

'use client'

import * as React from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface ConfirmActionDialogProps {
  /** 触发器（asChild 的 Button）。受控模式（open/onOpenChange）下可省略 */
  trigger?: React.ReactNode
  /** 受控模式：弹窗打开状态（清空/批量删除等需要先校验再弹窗的场景） */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** 标题，规范结构：确认{操作}？（批量场景须含 {count}） */
  title: string
  /** 后果描述，规范结构：后果说明 +「此操作无法撤销」 */
  description: string
  onConfirm: () => void
  /** 确认按钮文案（右侧），调用点经 i18n 显式传入 */
  confirmLabel: string
  /** 取消按钮文案（左侧），调用点经 i18n 显式传入 */
  cancelLabel: string
}

/**
 * YYC³ 全站唯一危险操作二次确认弹窗（增删改查交互规范的组件化落地）。
 *
 * 固定四段结构（业务零自由度，禁止再手写 AlertDialog 组合）：
 * 1. 标题：确认{操作}？（批量场景必须含 {count}）
 * 2. 描述：后果说明 + 「此操作无法撤销」
 * 3. 取消按钮（左，AlertDialogCancel）
 * 4. 确认按钮（右，AlertDialogAction）
 *
 * 同时支持触发器模式与受控模式（先校验后弹窗）。
 */
export function ConfirmActionDialog({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel,
  cancelLabel,
}: ConfirmActionDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger> : null}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{confirmLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

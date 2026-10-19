"use client"

import { StatusPage } from "@/app/components/error-handling/status-page"

/**
 * 403 无权限组件 —— 已登录但权限不足场景的唯一出口。
 *
 * 使用场景（二选一，禁止业务页自绘「无权限」）：
 * 1. API 层：handleApiResponse 抛出 ApiError 后，
 *    getHttpStatusFromError(error) === 403 时以本组件替换页面内容；
 * 2. 客户端角色守卫：RequireAuth 扩展角色校验时渲染本组件作为拒绝页。
 */
export function NoPermission({ className }: { className?: string }) {
  return <StatusPage variant="forbidden" code="403" className={className} />
}

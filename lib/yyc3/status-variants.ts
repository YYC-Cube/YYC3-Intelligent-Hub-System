import type { BadgeProps } from "@/components/ui/badge"

/**
 * YYC³ 业务状态 → 视觉语义映射表（全站唯一真源）。
 *
 * 语义铁律：色彩只表达状态语义，业务禁止各自取色（消除内联 bg-success/15 散落）：
 * - success      正向稳定态：运行中 / 已同步 / 已完成
 * - info         进行动态过程：同步中 / 处理中 / 搜索中（与 success 的区别：过程未完成）
 * - warning      待人工介入：未同步 / 冲突 / 即将到期
 * - destructive  失败异常态：同步失败 / 连接异常 / 校验错误
 * - secondary    中性停用态：已停止 / 未启用（非错误，禁止误用 destructive）
 */
type BadgeVariant = NonNullable<BadgeProps["variant"]>

export const STATUS_VARIANT = {
  /* success —— 稳定正向 */
  running: "success",
  active: "success",
  synced: "success",
  completed: "success",
  /* info —— 动态进行中 */
  syncing: "info",
  processing: "info",
  searching: "info",
  /* warning —— 待处理 */
  pending: "warning",
  conflict: "warning",
  expiring: "warning",
  /* destructive —— 失败异常 */
  error: "destructive",
  failed: "destructive",
  exception: "destructive",
  /* secondary —— 中性停用 */
  stopped: "secondary",
  disabled: "secondary",
  inactive: "secondary",
} as const satisfies Record<string, BadgeVariant>

export type BizStatus = keyof typeof STATUS_VARIANT

/** 兜底：未知状态一律按中性 pending 提示（warning），禁止渲染成正向色。 */
export const DEFAULT_STATUS_VARIANT: BadgeVariant = "warning"

export function statusVariant(status: string): BadgeVariant {
  return (STATUS_VARIANT as Record<string, BadgeVariant>)[status] ?? DEFAULT_STATUS_VARIANT
}

/**
 * 价格类型 → Badge 语义变体（三张卡同一映射，替代各页内联拼色）：
 * free=success（正向，鼓励使用）/ freemium=info（信息，蓝系提示）/ paid=outline（中性，不作引导）。
 */
export function priceVariant(type: "free" | "paid" | "freemium" | undefined): BadgeVariant {
  if (type === "free") return "success"
  if (type === "freemium") return "info"
  return "outline"
}

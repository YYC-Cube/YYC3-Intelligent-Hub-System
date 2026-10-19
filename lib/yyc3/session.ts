/**
 * 数据层会话二次校验 —— 纯函数工具（不依赖 React）。
 *
 * 背景与边界：
 * - 客户端路由守卫（components/auth/route-guard.tsx）仅防「误入页面」；
 * - 数据写盘入口（app/services/*、context 持久化函数）必须自行校验会话，
 *   不信任调用方传入的 React 状态，直接核对持久会话真源（localStorage "user"）。
 *
 * 使用方式（数据服务层写入口标准范式）：
 *   const session = requireSession("encryption_settings", userId)
 *   // 通过后执行写盘；session.id 与 expectedUserId 一致性已由本函数保证
 */

export interface StoredSession {
  id: string
  username?: string
  name?: string
  email?: string
  [key: string]: unknown
}

/** 无有效会话时抛出（数据写盘入口应捕获并降级为用户可感知的失败）。 */
export class UnauthorizedError extends Error {
  constructor(resource: string) {
    super(`未授权的数据访问：${resource}（无有效会话）`)
    this.name = "UnauthorizedError"
  }
}

/** 会话与目标数据归属不一致时抛出（防止跨用户写入）。 */
export class SessionMismatchError extends Error {
  constructor(resource: string, expectedUserId: string) {
    super(`会话归属校验失败：${resource}（数据属于 ${expectedUserId}，与会话不匹配）`)
    this.name = "SessionMismatchError"
  }
}

const SESSION_STORAGE_KEY = "user"

/**
 * 读取持久会话真源。形状校验从宽：仅要求 id 为非空字符串，
 * 避免与 auth-context 的用户对象结构演进耦合。
 */
export function getStoredSession(): StoredSession | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof (parsed as { id?: unknown }).id === "string" &&
      (parsed as { id: string }).id.length > 0
    ) {
      return parsed as StoredSession
    }
    return null
  } catch {
    return null
  }
}

/**
 * 校验有效会话（可选校验数据归属），失败抛 UnauthorizedError / SessionMismatchError。
 *
 * @param resource 资源标识（用于错误定位，如 "encryption_settings"、"subscriptions"）
 * @param expectedUserId 目标数据的归属用户 id；提供时强制与会话一致
 */
export function requireSession(resource: string, expectedUserId?: string): StoredSession {
  const session = getStoredSession()
  if (!session) {
    throw new UnauthorizedError(resource)
  }
  if (expectedUserId !== undefined && session.id !== expectedUserId) {
    throw new SessionMismatchError(resource, expectedUserId)
  }
  return session
}

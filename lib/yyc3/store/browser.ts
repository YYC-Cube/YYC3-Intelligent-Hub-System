/**
 * 浏览器 Web Storage 适配器（`localStorage` / `sessionStorage`）。
 *
 * 这是本仓库「持久化收口」的客户端落点：`app/context/*` 与 `app/services/*` 中
 * 20 余处直接的 `localStorage.getItem/setItem` 应改为经由本适配器，
 * 从而获得统一的键名注册（见 `./keys`）、统一的 JSON 行为与统一的错误语义。
 *
 * 关键约束（本项目为 `output: 'export'` 静态导出）：
 * 构建期会对页面做预渲染（静态 HTML），此时**不存在 `window`**。
 * 因此禁止在模块顶层调用 {@link createBrowserStore}，
 * 必须在 `useEffect` / 事件回调等仅在浏览器执行的时机惰性创建。
 */

import { assertValidKey, StoreError, type Store, type StoreBackend } from "./types"
import { selectKeys } from "./memory"

/** 探测当前环境是否可用的 Web Storage。 */
export function getBrowserStorage(kind: "local" | "session"): Storage | undefined {
  if (typeof window === "undefined") {
    return undefined
  }

  try {
    const storage = kind === "local" ? window.localStorage : window.sessionStorage
    // 隐私模式 / 被策略禁用时，读属性本身可能抛错，需实测一次写入
    const probeKey = "__yyc3_store_probe__"
    storage.setItem(probeKey, "1")
    storage.removeItem(probeKey)
    return storage
  } catch {
    return undefined
  }
}

/** 当前是否可用指定 Web Storage（供 UI 决定是否降级为内存态）。 */
export function isBrowserStorageAvailable(kind: "local" | "session" = "local"): boolean {
  return getBrowserStorage(kind) !== undefined
}

export class BrowserStore implements Store {
  readonly backend: StoreBackend

  private readonly storage: Storage

  private readonly kind: "local" | "session"

  constructor(kind: "local" | "session" = "local") {
    const storage = getBrowserStorage(kind)
    if (!storage) {
      throw new StoreError(
        "STORE_UNAVAILABLE",
        kind === "local" ? "local" : "session",
        `${kind}Storage 不可用（服务端预渲染阶段，或浏览器禁用了存储）`,
      )
    }
    this.kind = kind
    this.backend = kind === "local" ? "local" : "session"
    this.storage = storage
  }

  async get(key: string): Promise<string | undefined> {
    assertValidKey(key, this.backend)
    try {
      // getItem 返回 null 表示不存在，统一归一为 undefined，避免 null/undefined 双语义
      return this.storage.getItem(key) ?? undefined
    } catch (error) {
      throw new StoreError("STORE_READ_FAILED", this.backend, `读取键 "${key}" 失败`, error)
    }
  }

  async put(key: string, value: string): Promise<void> {
    assertValidKey(key, this.backend)
    try {
      this.storage.setItem(key, value)
    } catch (error) {
      // 配额超限（QuotaExceededError）是最常见的失败原因，需让上层可识别
      throw new StoreError(
        "STORE_WRITE_FAILED",
        this.backend,
        `写入键 "${key}" 失败（常见原因：存储配额超限）`,
        error,
      )
    }
  }

  async delete(key: string): Promise<boolean> {
    assertValidKey(key, this.backend)
    const existed = (await this.get(key)) !== undefined
    try {
      this.storage.removeItem(key)
    } catch (error) {
      throw new StoreError("STORE_DELETE_FAILED", this.backend, `删除键 "${key}" 失败`, error)
    }
    return existed
  }

  async keys(prefix?: string): Promise<string[]> {
    // 遍历时先快照长度：Web Storage 的 length/key(i) 在并发写入下会抖动
    const snapshot: string[] = []
    for (let index = 0; index < this.storage.length; index += 1) {
      const key = this.storage.key(index)
      if (key !== null) {
        snapshot.push(key)
      }
    }
    return selectKeys(snapshot, prefix)
  }

  async clear(prefix?: string): Promise<number> {
    if (prefix === undefined) {
      const total = this.storage.length
      this.storage.clear()
      return total
    }

    const targets = await this.keys(prefix)
    for (const key of targets) {
      this.storage.removeItem(key)
    }
    return targets.length
  }

  /** 保留数据，仅解除引用；Web Storage 无连接可关闭，故为幂等空操作。 */
  async close(): Promise<void> {
    void this.kind
  }
}

/** 惰性创建浏览器后端；在预渲染阶段调用会抛出 `STORE_UNAVAILABLE`。 */
export function createBrowserStore(kind: "local" | "session" = "local"): Store {
  return new BrowserStore(kind)
}

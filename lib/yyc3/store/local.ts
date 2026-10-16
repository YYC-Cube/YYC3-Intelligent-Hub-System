/**
 * 浏览器端 LocalStorage 适配器 —— 实现 `@/lib/yyc3/store` 的 `Store` 契约。
 *
 * B-3 收敛说明（原 `app/services/storage/local-storage-store.ts` 迁入）：
 * - 本仓库持久化契约的**唯一事实源**是 `./types` 的 `Store` 接口；
 *   此前本文件 `import type { Store } from "@yyc3/store"` 造成双契约并存，
 *   现统一为仓内契约，`@yyc3/store` 保留为平台侧（file/redis 适配器）依赖。
 * - JSON 便捷读写（getJson/putJson）统一由 `./json` 提供，本文件不再重复实现。
 *
 * 设计要点：
 * - `@yyc3/store` 官方三适配器（内存 / JSON 文件 / Redis）面向 Node 宿主；
 *   浏览器端以 `localStorage` 为持久层，本适配器按同一 `Store` 契约接入，
 *   调用方可随环境横向替换（测试 → MemoryStore，端侧 → 本适配器）。
 * - 异步接口的「同步内核」：`getSync` / `putSync` / `deleteSync` 直接映射
 *   `localStorage` 同步语义，供既有同步调用方零成本迁移；异步方法仅为
 *   接口契约的 `Promise.resolve` 包装，不引入真实 IO 延迟。
 * - 非浏览器环境（SSR / 静态导出预渲染）自动降级为进程内 Map（对齐
 *   `MemoryStore` 的降级哲学：进程重启即失，预渲染期读到空值即返回默认）。
 * - 所有读写均包裹 try/catch：隐私模式、配额溢出、SecurityError 等场景
 *   不抛出，由调用方按业务语义回退默认值（与既有容错行为一致）。
 */

import { assertValidKey, type Store, type StoreBackend } from "./types"

/** 同步 KV 语义（localStorage 的最小子集，Map 为 SSR 降级后端） */
interface SyncKV {
  get(key: string): string | null
  set(key: string, value: string): void
  delete(key: string): boolean
}

/** 基于浏览器 localStorage 的同步后端 */
class BrowserKV implements SyncKV {
  get(key: string): string | null {
    return window.localStorage.getItem(key)
  }

  set(key: string, value: string): void {
    window.localStorage.setItem(key, value)
  }

  delete(key: string): boolean {
    const existed = window.localStorage.getItem(key) !== null
    window.localStorage.removeItem(key)
    return existed
  }

  keys(): string[] {
    return Object.keys(window.localStorage)
  }
}

/** 进程内 Map 后端（SSR / 预渲染 / 测试降级） */
class MemoryKV implements SyncKV {
  private readonly map = new Map<string, string>()

  get(key: string): string | null {
    return this.map.get(key) ?? null
  }

  set(key: string, value: string): void {
    this.map.set(key, value)
  }

  delete(key: string): boolean {
    return this.map.delete(key)
  }

  keys(): string[] {
    return [...this.map.keys()]
  }
}

export class LocalStorageStore implements Store {
  readonly backend: StoreBackend = "local"

  private readonly kv: SyncKV & { keys(): string[] }

  constructor() {
    this.kv = typeof window !== "undefined" ? new BrowserKV() : new MemoryKV()
  }

  // ---- 同步内核（M-4：正式契约，见下方说明） ----
  //
  // 【同步内核契约】getSync / putSync / deleteSync 是 LocalStorageStore 的显式公共 API，
  // 而非内部实现细节：`localStorage` 本身即为同步存储，异步包装仅是对 `Store` 契约的
  // 形状适配，不引入任何真实 I/O 异步性。
  //
  // 使用规则：
  // - React 渲染路径（派生初始状态）与同步初始化路径：使用 getSync / putSync，
  //   避免"异步读取 → 二次渲染闪烁"；
  // - 通用持久化与可替换场景（未来切换 Redis/IndexedDB 等真异步后端）：
  //   必须走下方异步 `Store` 契约方法（get/put/delete/clear/keys），
  //   唯有异步契约保证跨适配器可替换（五高·高扩展）。
  // - 同步内核错误策略：读失败返回 undefined、写失败静默、删失败返回 false，
  //   由调用方决定兜底行为（与隐私模式/配额溢出的容错预期一致）。

  /** 同步读取；不存在或不可用返回 undefined */
  getSync(key: string): string | undefined {
    try {
      return this.kv.get(key) ?? undefined
    } catch {
      return undefined
    }
  }

  /** 同步写入；失败静默（调用方按需回退） */
  putSync(key: string, value: string): void {
    try {
      this.kv.set(key, value)
    } catch {
      // 隐私模式 / 配额溢出：与既有 CategoryMemoryService 容错行为对齐
    }
  }

  /** 同步删除；返回键是否存在（读取失败时按不存在处理） */
  deleteSync(key: string): boolean {
    try {
      return this.kv.delete(key)
    } catch {
      return false
    }
  }

  // ---- Store 异步契约（同步内核的 Promise 包装） ----

  async get(key: string): Promise<string | undefined> {
    assertValidKey(key, this.backend)
    return this.getSync(key)
  }

  async put(key: string, value: string): Promise<void> {
    assertValidKey(key, this.backend)
    this.putSync(key, value)
  }

  async delete(key: string): Promise<boolean> {
    assertValidKey(key, this.backend)
    return this.deleteSync(key)
  }

  async keys(prefix?: string): Promise<string[]> {
    try {
      const all = this.kv.keys()
      return prefix ? all.filter((k) => k.startsWith(prefix)) : all
    } catch {
      return []
    }
  }

  /**
   * 清空键并返回删除数量（对齐 `Store` 契约的 `Promise<number>` 语义）。
   * 注意：`prefix` 省略时浏览器端会波及同源下所有键，
   * 本项目为独立静态站点可接受；调用方应优先使用定向 `delete`。
   */
  async clear(prefix?: string): Promise<number> {
    const targets = await this.keys(prefix)
    for (const key of targets) {
      this.kv.delete(key)
    }
    return targets.length
  }

  async close(): Promise<void> {
    // localStorage 无需释放资源
  }
}

let browserStoreSingleton: LocalStorageStore | undefined

/**
 * 获取浏览器端存储适配器单例。
 *
 * @returns 实现 `@/lib/yyc3/store` `Store` 契约的 LocalStorage 适配器
 */
export function getBrowserStore(): LocalStorageStore {
  if (!browserStoreSingleton) {
    browserStoreSingleton = new LocalStorageStore()
  }
  return browserStoreSingleton
}

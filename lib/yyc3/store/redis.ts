/**
 * Redis 后端适配器（仅服务端可用）。
 *
 * 零硬依赖设计：本仓库不把 redis 客户端写进 `dependencies`，
 * 而是**运行期惰性加载**：依次尝试 `ioredis`、`redis`，
 * 均不可用时抛出 `STORE_UNAVAILABLE`，由上层决定降级到文件或内存后端。
 * 这样既避免为未使用 Redis 的部署增加安装体积，也避免构建期强绑。
 *
 * 兼容性：同时适配 ioredis 与 node-redis v4 的差异（`del(数组)`、`scan` 返回形态）。
 */

import { StoreError, assertValidKey, type Store, type StoreBackend } from "./types"
import { selectKeys } from "./memory"

/** 惰性加载的候选客户端模块，按优先级排列。 */
const CLIENT_MODULE_CANDIDATES = ["ioredis", "redis"] as const

/** SCAN 单批数量，避免一次性拉取海量键阻塞 Redis。 */
const SCAN_BATCH_SIZE = 200

/** 批量删除的每批大小。 */
const DELETE_BATCH_SIZE = 100

/** 本适配器实际使用到的客户端能力（结构化约束，不依赖具体客户端类型包）。 */
interface RedisLikeClient {
  get(key: string): Promise<string | null>
  set(key: string, value: string): Promise<unknown>
  del: (...keys: string[]) => Promise<number>
  scan(cursor: string, ...args: unknown[]): Promise<unknown>
  quit?: () => Promise<unknown>
  disconnect?: () => void
}

type RedisClientConstructor = new (url: string, options?: Record<string, unknown>) => RedisLikeClient

export interface RedisStoreOptions {
  /** 连接串，如 `redis://127.0.0.1:6379/0`。 */
  url: string
  /**
   * 存储层内部键前缀，用于把本应用的键与同一实例上的其他数据隔离。
   * 注意：该前缀**对调用方透明**，`keys()` 返回的仍是调用方传入的原始键名。
   */
  keyPrefix?: string
  /** 指定客户端模块名；默认按 `ioredis` → `redis` 顺序尝试。 */
  clientModule?: string
}

export class RedisStore implements Store {
  readonly backend: StoreBackend = "redis"

  private readonly client: RedisLikeClient

  private readonly keyPrefix: string

  private closed = false

  private constructor(client: RedisLikeClient, keyPrefix: string) {
    this.client = client
    this.keyPrefix = keyPrefix
  }

  /**
   * 建立连接并返回适配器实例。
   *
   * 懒加载策略：只有真正调用本方法时才会尝试加载客户端模块，
   * 未安装客户端的部署不会因此产生任何副作用。
   */
  static async connect(options: RedisStoreOptions): Promise<RedisStore> {
    if (typeof window !== "undefined") {
      throw new StoreError("STORE_UNAVAILABLE", "redis", "RedisStore 仅可在 Node.js 服务端使用")
    }

    const url = options.url?.trim()
    if (!url) {
      throw new StoreError("STORE_INVALID_ARGUMENT", "redis", "RedisStore 需要非空的连接串 url")
    }

    const candidates = options.clientModule ? [options.clientModule] : [...CLIENT_MODULE_CANDIDATES]
    const failures: string[] = []

    for (const moduleName of candidates) {
      try {
        // 变量说明符：使打包器不做静态解析，从而保持「可选依赖」语义
        const specifier: string = moduleName
        const loaded: unknown = await import(specifier)
        const Constructor = resolveClientConstructor(loaded)

        if (!Constructor) {
          failures.push(`${moduleName}: 未导出可用的构造函数`)
          continue
        }

        const instance: unknown = new Constructor(url, { lazyConnect: false })
        if (!isRedisLike(instance)) {
          failures.push(`${moduleName}: 实例缺少 get/set/del/scan 能力`)
          continue
        }

        return new RedisStore(instance, options.keyPrefix ?? "")
      } catch (error) {
        failures.push(`${moduleName}: ${describeError(error)}`)
      }
    }

    throw new StoreError(
      "STORE_UNAVAILABLE",
      "redis",
      `未能加载任何 Redis 客户端（已尝试 ${candidates.join(" / ")}）。` +
        `请安装其一后重试，例如 pnpm add ioredis。明细：${failures.join("；")}`,
    )
  }

  async get(key: string): Promise<string | undefined> {
    assertValidKey(key, this.backend)
    this.assertOpen()
    try {
      return (await this.client.get(this.toStorageKey(key))) ?? undefined
    } catch (error) {
      throw new StoreError("STORE_READ_FAILED", this.backend, `读取键 "${key}" 失败`, error)
    }
  }

  async put(key: string, value: string): Promise<void> {
    assertValidKey(key, this.backend)
    this.assertOpen()
    try {
      await this.client.set(this.toStorageKey(key), value)
    } catch (error) {
      throw new StoreError("STORE_WRITE_FAILED", this.backend, `写入键 "${key}" 失败`, error)
    }
  }

  async delete(key: string): Promise<boolean> {
    assertValidKey(key, this.backend)
    this.assertOpen()
    const removed = await this.deleteMany([this.toStorageKey(key)])
    return removed > 0
  }

  async keys(prefix?: string): Promise<string[]> {
    this.assertOpen()
    // 加内部前缀后再 SCAN，随后剥离前缀，保证调用方只看到自己写入的键名
    const pattern = `${this.keyPrefix}${prefix ?? ""}*`
    const found = await this.scanAll(pattern)
    return selectKeys(found.map((key) => this.fromStorageKey(key)), prefix)
  }

  async clear(prefix?: string): Promise<number> {
    this.assertOpen()

    if (prefix === undefined) {
      if (this.keyPrefix === "") {
        throw new StoreError(
          "STORE_INVALID_ARGUMENT",
          this.backend,
          "未配置 keyPrefix 时禁止 clear()，以免误删同实例上的其他数据；请显式传入前缀",
        )
      }
      const found = await this.scanAll(`${this.keyPrefix}*`)
      return this.deleteMany(found)
    }

    const found = await this.scanAll(`${this.keyPrefix}${prefix}*`)
    return this.deleteMany(found)
  }

  /** 关闭连接；幂等。 */
  async close(): Promise<void> {
    if (this.closed) {
      return
    }
    this.closed = true
    try {
      if (typeof this.client.quit === "function") {
        await this.client.quit()
      } else if (typeof this.client.disconnect === "function") {
        this.client.disconnect()
      }
    } catch {
      // 关闭阶段的失败不应向调用方抛出：连接已不可用，重试亦无意义
      this.client.disconnect?.()
    }
  }

  private toStorageKey(key: string): string {
    return `${this.keyPrefix}${key}`
  }

  private fromStorageKey(key: string): string {
    return this.keyPrefix.length > 0 && key.startsWith(this.keyPrefix)
      ? key.slice(this.keyPrefix.length)
      : key
  }

  /** 使用 SCAN 游标遍历，避免 KEYS 命令在大实例上阻塞服务端。 */
  private async scanAll(pattern: string): Promise<string[]> {
    const collected: string[] = []
    let cursor = "0"

    try {
      do {
        const reply = await this.client.scan(
          cursor,
          "MATCH",
          pattern,
          "COUNT",
          SCAN_BATCH_SIZE,
        )
        const parsed = parseScanReply(reply)
        cursor = parsed.cursor
        collected.push(...parsed.keys)
      } while (cursor !== "0")
    } catch (error) {
      throw new StoreError("STORE_READ_FAILED", this.backend, `扫描键模式 "${pattern}" 失败`, error)
    }

    return collected
  }

  private async deleteMany(storageKeys: string[]): Promise<number> {
    if (storageKeys.length === 0) {
      return 0
    }

    let removed = 0
    for (let index = 0; index < storageKeys.length; index += DELETE_BATCH_SIZE) {
      const batch = storageKeys.slice(index, index + DELETE_BATCH_SIZE)
      try {
        removed += await this.delCompat(batch)
      } catch (error) {
        throw new StoreError(
          "STORE_DELETE_FAILED",
          this.backend,
          `批量删除 ${batch.length} 个键失败`,
          error,
        )
      }
    }
    return removed
  }

  /** ioredis 用 `del(k1, k2)`，node-redis v4 用 `del([k1, k2])`，此处做兼容。 */
  private async delCompat(keys: string[]): Promise<number> {
    try {
      return await this.client.del(...keys)
    } catch (spreadError) {
      const asArray = this.client.del as unknown as (list: string[]) => Promise<number>
      try {
        return await asArray.call(this.client, keys)
      } catch {
        throw spreadError
      }
    }
  }

  private assertOpen(): void {
    if (this.closed) {
      throw new StoreError("STORE_UNAVAILABLE", this.backend, "RedisStore 已关闭，无法继续读写")
    }
  }
}

/** 兼容 ioredis 的 `[cursor, keys]` 与 node-redis v4 的 `{ cursor, keys }` 两种返回形态。 */
function parseScanReply(reply: unknown): { cursor: string; keys: string[] } {
  if (Array.isArray(reply)) {
    const [cursor, keys] = reply as [unknown, unknown]
    return {
      cursor: String(cursor),
      keys: Array.isArray(keys) ? keys.map((key) => String(key)) : [],
    }
  }

  if (typeof reply === "object" && reply !== null) {
    const record = reply as { cursor?: unknown; keys?: unknown }
    return {
      cursor: String(record.cursor ?? "0"),
      keys: Array.isArray(record.keys) ? record.keys.map((key) => String(key)) : [],
    }
  }

  return { cursor: "0", keys: [] }
}

/** 从动态导入结果中定位可用的构造函数，兼容 CJS/ESM 互操作的多层包装。 */
function resolveClientConstructor(loaded: unknown): RedisClientConstructor | undefined {
  if (typeof loaded === "function") {
    return loaded as RedisClientConstructor
  }

  if (typeof loaded !== "object" || loaded === null) {
    return undefined
  }

  const record = loaded as Record<string, unknown>
  const defaultExport = record.default

  if (typeof defaultExport === "function") {
    return defaultExport as RedisClientConstructor
  }

  // 双层 default：ESM 包装 CJS 时可能出现 { default: { default: Ctor } }
  if (typeof defaultExport === "object" && defaultExport !== null) {
    const nested = (defaultExport as Record<string, unknown>).default
    if (typeof nested === "function") {
      return nested as RedisClientConstructor
    }
  }

  const named = record.Redis ?? record.createClient
  if (typeof named === "function") {
    return named as RedisClientConstructor
  }

  return undefined
}

/** 结构化校验：只要求我们真正使用的能力存在。 */
function isRedisLike(value: unknown): value is RedisLikeClient {
  if (typeof value !== "object" || value === null) {
    return false
  }
  const record = value as Record<string, unknown>
  return (["get", "set", "del", "scan"] as const).every(
    (method) => typeof record[method] === "function",
  )
}

function describeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

/**
 * JSON 文件后端适配器（仅服务端可用）。
 *
 * 持久化格式：单个 JSON 文件承载全部键值。
 * `{ "version": 1, "entries": { "<key>": "<string>" } }`
 *
 * 可靠性设计：
 * 1. **原子写**：先写入同目录临时文件，再 `rename` 覆盖目标文件。
 *    `rename` 在同一文件系统内是原子操作，因此不会出现「写到一半」的半截文件，
 *    而直接 `writeFile` 覆盖在进程崩溃时会损坏整个存储。
 * 2. **写入串行化**：所有落盘经由内部 promise 链排队，
 *    避免并发写入导致临时文件互相覆盖或 `rename` 交错。
 * 3. **损坏即拒写**：读取到非法 JSON 时抛错而非重置为空，
 *    避免一次解析失败直接清空用户全部数据。
 * 4. 全量重写策略：每次落盘重写整个文件。当前数据规模（数十个键）下可接受，
 *    换取实现简单与格式可读；键数量增长到万级时应改用追加日志或数据库后端。
 */

import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises"
import { dirname } from "node:path"

import { assertValidKey, StoreError, type Store, type StoreBackend } from "./types"
import { selectKeys } from "./memory"

const PAYLOAD_VERSION = 1

interface FilePayload {
  version: number
  entries: Record<string, string>
}

export interface FileStoreOptions {
  /**
   * 落盘防抖窗口（毫秒）。默认 0，即每次写入立即落盘（durability 优先）。
   * 高频写入场景可调大以减少 IO 次数，但需自行调用 `flush()` 保证落盘。
   */
  debounceMs?: number
  /** 目标目录不存在时自动创建，默认 true。 */
  autoCreateDir?: boolean
}

interface FlushWaiter {
  resolve: () => void
  reject: (error: unknown) => void
}

export class FileStore implements Store {
  readonly backend: StoreBackend = "file"

  private readonly filePath: string

  private readonly debounceMs: number

  private readonly autoCreateDir: boolean

  private entries: Map<string, string> | null = null

  private loading: Promise<Map<string, string>> | null = null

  private pendingWrite: Promise<void> = Promise.resolve()

  private flushTimer: ReturnType<typeof setTimeout> | null = null

  private flushWaiters: FlushWaiter[] = []

  private closed = false

  private tempCounter = 0

  constructor(filePath: string, options: FileStoreOptions = {}) {
    if (typeof filePath !== "string" || filePath.trim().length === 0) {
      throw new StoreError("STORE_INVALID_ARGUMENT", "file", "FileStore 需要非空的文件路径")
    }
    this.filePath = filePath
    this.debounceMs = Math.max(0, options.debounceMs ?? 0)
    this.autoCreateDir = options.autoCreateDir ?? true
  }

  /** 存储文件绝对或相对路径，供运维排查使用。 */
  get path(): string {
    return this.filePath
  }

  async get(key: string): Promise<string | undefined> {
    assertValidKey(key, this.backend)
    const entries = await this.load()
    return entries.get(key)
  }

  async put(key: string, value: string): Promise<void> {
    assertValidKey(key, this.backend)
    const entries = await this.load()
    entries.set(key, value)
    await this.schedulePersist(entries)
  }

  async delete(key: string): Promise<boolean> {
    assertValidKey(key, this.backend)
    const entries = await this.load()
    const existed = entries.delete(key)
    if (existed) {
      await this.schedulePersist(entries)
    }
    return existed
  }

  async keys(prefix?: string): Promise<string[]> {
    const entries = await this.load()
    return selectKeys(entries.keys(), prefix)
  }

  async clear(prefix?: string): Promise<number> {
    const entries = await this.load()

    if (prefix === undefined) {
      const removed = entries.size
      entries.clear()
      if (removed > 0) {
        await this.schedulePersist(entries)
      }
      return removed
    }

    let removed = 0
    for (const key of Array.from(entries.keys())) {
      if (key.startsWith(prefix)) {
        entries.delete(key)
        removed += 1
      }
    }
    if (removed > 0) {
      await this.schedulePersist(entries)
    }
    return removed
  }

  /** 立即落盘未写入的数据；已无待写内容时等价于等待写入队列排空。 */
  async flush(): Promise<void> {
    if (this.flushTimer !== null) {
      clearTimeout(this.flushTimer)
      this.flushTimer = null
    }

    const waiters = this.flushWaiters
    this.flushWaiters = []

    try {
      const entries = this.entries ?? new Map<string, string>()
      await this.persist(entries)
      for (const waiter of waiters) {
        waiter.resolve()
      }
    } catch (error) {
      for (const waiter of waiters) {
        waiter.reject(error)
      }
      throw error
    }
  }

  /** 落盘并释放缓存；幂等。 */
  async close(): Promise<void> {
    if (this.closed) {
      return
    }
    await this.flush()
    this.closed = true
    this.entries = null
  }

  private async load(): Promise<Map<string, string>> {
    this.assertOpen()

    if (this.entries !== null) {
      return this.entries
    }

    if (this.loading === null) {
      this.loading = this.readFromDisk()
    }

    this.entries = await this.loading
    return this.entries
  }

  private async readFromDisk(): Promise<Map<string, string>> {
    let raw: string
    try {
      raw = await readFile(this.filePath, "utf8")
    } catch (error) {
      if (isFileNotFound(error)) {
        return new Map<string, string>()
      }
      throw new StoreError(
        "STORE_READ_FAILED",
        this.backend,
        `无法读取存储文件 ${this.filePath}`,
        error,
      )
    }

    if (raw.trim().length === 0) {
      return new Map<string, string>()
    }

    try {
      const parsed = JSON.parse(raw) as Partial<FilePayload>
      if (parsed === null || typeof parsed !== "object" || typeof parsed.entries !== "object") {
        throw new Error("缺少 entries 对象字段")
      }
      const entries = new Map<string, string>()
      for (const [key, value] of Object.entries(parsed.entries as Record<string, unknown>)) {
        entries.set(key, String(value))
      }
      return entries
    } catch (error) {
      throw new StoreError(
        "STORE_SERIALIZE_FAILED",
        this.backend,
        `存储文件 ${this.filePath} 内容损坏，已拒绝加载以避免覆盖丢失数据`,
        error,
      )
    }
  }

  private async schedulePersist(entries: Map<string, string>): Promise<void> {
    if (this.debounceMs <= 0) {
      await this.persist(entries)
      return
    }

    // 防抖：合并窗口内的多次写入，仅落盘一次。
    // 所有等待者必须在同一次落盘完成后统一结算，否则先到的调用者会永久挂起。
    await new Promise<void>((resolve, reject) => {
      this.flushWaiters.push({ resolve, reject })

      if (this.flushTimer !== null) {
        clearTimeout(this.flushTimer)
      }
      this.flushTimer = setTimeout(() => {
        this.flushTimer = null
        const waiters = this.flushWaiters
        this.flushWaiters = []
        this.persist(entries).then(
          () => waiters.forEach((waiter) => waiter.resolve()),
          (error: unknown) => waiters.forEach((waiter) => waiter.reject(error)),
        )
      }, this.debounceMs)
    })
  }

  /** 将落盘操作挂到串行队列尾部，保证任意时刻只有一个写入在途。 */
  private persist(entries: Map<string, string>): Promise<void> {
    const snapshot = new Map(entries)
    const next = this.pendingWrite.then(() => this.writeAtomically(snapshot))
    // 队列自身吞掉 rejection，避免一次失败导致后续写入被短路
    this.pendingWrite = next.then(
      () => undefined,
      () => undefined,
    )
    return next
  }

  private async writeAtomically(entries: Map<string, string>): Promise<void> {
    const payload: FilePayload = {
      version: PAYLOAD_VERSION,
      entries: Object.fromEntries(entries),
    }
    const body = `${JSON.stringify(payload, null, 2)}\n`

    if (this.autoCreateDir) {
      try {
        await mkdir(dirname(this.filePath), { recursive: true })
      } catch (error) {
        throw new StoreError(
          "STORE_UNAVAILABLE",
          this.backend,
          `无法创建存储目录 ${dirname(this.filePath)}`,
          error,
        )
      }
    }

    this.tempCounter += 1
    const tempPath = `${this.filePath}.${process.pid}.${this.tempCounter}.tmp`

    try {
      await writeFile(tempPath, body, "utf8")
      await rename(tempPath, this.filePath)
    } catch (error) {
      await unlink(tempPath).catch(() => undefined)
      throw new StoreError(
        "STORE_WRITE_FAILED",
        this.backend,
        `无法原子写入存储文件 ${this.filePath}`,
        error,
      )
    }
  }

  private assertOpen(): void {
    if (this.closed) {
      throw new StoreError("STORE_UNAVAILABLE", this.backend, "FileStore 已关闭，无法继续读写")
    }
  }
}

function isFileNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "ENOENT"
  )
}

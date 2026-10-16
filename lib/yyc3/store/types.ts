/**
 * 统一持久化抽象层（自研基座，零外部依赖）。
 *
 * 背景：本仓库此前在 20 余处直接读写 `localStorage` / `sessionStorage`，
 * 键名硬编码且散落各处，服务端则各自直连 `pg.Pool`；既无统一接口，
 * 也无法在「内存 / JSON 文件 / Redis」之间替换后端。
 *
 * 设计约束：
 * 1. 接口层**只处理字符串**（`get` / `put` 均为 string 语义）。
 *    这样浏览器 `localStorage`（仅支持字符串）与 Redis、文件后端可以共用同一契约，
 *    JSON 编解码统一上移到 `./json`，避免每个适配器重复实现序列化。
 * 2. 接口层禁止依赖任何三方包；Node 专属能力（fs / 子进程）只能出现在具体适配器内。
 * 3. 所有失败必须抛出携带 `code` 的 `StoreError`，禁止静默吞掉错误。
 */

/** 已实现的后端标识。 */
export type StoreBackend = "memory" | "file" | "redis" | "local" | "session"

/** 稳定错误码，便于上层按类别降级而不必解析文案。 */
export type StoreErrorCode =
  /** 后端不可用：未安装 redis 客户端、浏览器禁用 storage、目录不可写等 */
  | "STORE_UNAVAILABLE"
  | "STORE_READ_FAILED"
  | "STORE_WRITE_FAILED"
  | "STORE_DELETE_FAILED"
  /** 数据损坏或无法序列化 */
  | "STORE_SERIALIZE_FAILED"
  /** 入参非法（空 key 等） */
  | "STORE_INVALID_ARGUMENT"

/** 持久化层统一错误类型。 */
export class StoreError extends Error {
  readonly code: StoreErrorCode

  readonly backend: StoreBackend

  /** 原始错误，保留以便排查底层原因（如 ENOSPC、ECONNREFUSED）。 */
  readonly details?: unknown

  constructor(code: StoreErrorCode, backend: StoreBackend, message: string, details?: unknown) {
    super(message)
    this.name = "StoreError"
    this.code = code
    this.backend = backend
    this.details = details
  }
}

/**
 * 后端无关的键值存储契约。
 *
 * 语义约定：
 * - `put` 覆盖写入；`delete` 返回「是否确实删除了存在的键」；
 * - `keys(prefix)` 返回**完整键名**（不剥离前缀），并按字典序排列以保证可复现；
 * - `clear(prefix)` 返回被删除的键数量；未传 prefix 时清空整个后端；
 * - `close` 需幂等，可被重复调用。
 */
export interface Store {
  readonly backend: StoreBackend

  get(key: string): Promise<string | undefined>

  put(key: string, value: string): Promise<void>

  delete(key: string): Promise<boolean>

  keys(prefix?: string): Promise<string[]>

  clear(prefix?: string): Promise<number>

  close(): Promise<void>
}

/** 校验键名，拦截空串与纯空白等必然导致数据不可定位的入参。 */
export function assertValidKey(key: string, backend: StoreBackend): void {
  if (typeof key !== "string" || key.trim().length === 0) {
    throw new StoreError(
      "STORE_INVALID_ARGUMENT",
      backend,
      `持久化键名必须为非空字符串，实际收到: ${JSON.stringify(key)}`,
    )
  }
}

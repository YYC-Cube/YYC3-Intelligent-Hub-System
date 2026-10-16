/**
 * 持久化抽象层的**客户端安全出口**。
 *
 * 分层的理由：本项目为 `output: 'export'` 静态导出，客户端组件会被打进浏览器包。
 * 若把 `FileStore` / `RedisStore` 写进本出口，打包器会连带引入
 * `node:fs` 与 Redis 客户端，导致构建失败。
 * 因此服务端适配器一律由 `@/lib/yyc3/store/server` 单独引入。
 *
 * 用法：
 * ```ts
 * import { createBrowserStore, scopedKeys, putJson, getJson } from "@/lib/yyc3/store"
 * ```
 */

export { StoreError, assertValidKey } from "./types"
export type { Store, StoreBackend, StoreErrorCode } from "./types"

export { MemoryStore, selectKeys } from "./memory"

export {
  BrowserStore,
  createBrowserStore,
  getBrowserStorage,
  isBrowserStorageAvailable,
} from "./browser"

export { getJson, getJsonSafe, putJson, updateJson, removeKey, hasKey } from "./json"

export { assertUserId, scopedKeys, staticKeys, staticKeyValues } from "./keys"

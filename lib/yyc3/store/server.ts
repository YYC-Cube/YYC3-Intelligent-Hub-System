/**
 * 服务端出口（Node.js 专属）。
 *
 * **不得**被客户端组件（`"use client"`）或任何会被打包进浏览器包的模块引用：
 * 本文件链路会引入 `node:fs` / `node:path` 与可选的 Redis 客户端。
 *
 * 客户端请改用 `@/lib/yyc3/store`（index.ts）。
 */

export { FileStore } from "./file"
export type { FileStoreOptions } from "./file"

export { RedisStore } from "./redis"
export type { RedisStoreOptions } from "./redis"

export { createStoreFromEnv } from "./factory"
export type { ServerStoreBackend, StoreEnv, StoreSelection } from "./factory"

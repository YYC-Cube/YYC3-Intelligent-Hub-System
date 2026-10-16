/**
 * 后端选择工厂（仅服务端可用）。
 *
 * 设计要点：**降级不抛错，而是显式上报**。
 * 期望后端不可用时（Redis 未装客户端、目录只读、连接串写错），
 * 若直接抛错会让上层服务整体不可用；若静默降级则故障被隐藏。
 * 因此本工厂统一返回 `degradedReason`，由调用方决定是记录告警、暴露健康检查，
 * 还是拒绝启动。
 */

import { constants } from "node:fs"
import { access, mkdir } from "node:fs/promises"
import { dirname } from "node:path"

import { FileStore } from "./file"
import { MemoryStore } from "./memory"
import { RedisStore } from "./redis"
import { StoreError, type Store, type StoreBackend } from "./types"

/** 期望的后端类型（不含浏览器后端）。 */
export type ServerStoreBackend = Extract<StoreBackend, "memory" | "file" | "redis">

export interface StoreSelection {
  store: Store
  /** 实际生效的后端；降级时与期望值不同。 */
  backend: StoreBackend
  /** 非空表示发生了降级，内容为期望后端不可用的原因。 */
  degradedReason?: string
}

/** 工厂读取的环境变量（显式声明，便于测试注入而非依赖全局 `process.env`）。 */
export interface StoreEnv {
  /** 显式指定后端：`memory` | `file` | `redis`。缺省时按 REDIS_URL / STORE_FILE 推断。 */
  STORE_BACKEND?: string
  /** JSON 文件后端的存储路径。 */
  STORE_FILE?: string
  /** Redis 连接串。 */
  REDIS_URL?: string
  /** Redis 存储层的内部键前缀。 */
  STORE_KEY_PREFIX?: string
  /** 文件后端落盘防抖窗口（毫秒），默认 0 即每次写入立即落盘。 */
  STORE_FILE_DEBOUNCE_MS?: string
}

const SUPPORTED_BACKENDS: readonly ServerStoreBackend[] = ["memory", "file", "redis"]

/**
 * 按环境变量创建后端。
 *
 * 推断顺序：显式 `STORE_BACKEND` > `REDIS_URL` > `STORE_FILE` > 内存。
 */
export async function createStoreFromEnv(
  env: StoreEnv = process.env as StoreEnv,
): Promise<StoreSelection> {
  const requested = env.STORE_BACKEND?.trim().toLowerCase()
  const target = resolveTarget(requested, env)

  if (requested !== undefined && !SUPPORTED_BACKENDS.includes(requested as ServerStoreBackend)) {
    return degrade(`STORE_BACKEND="${requested}" 不是受支持的后端（可选 memory/file/redis）`)
  }

  if (target === "memory") {
    return { store: new MemoryStore(), backend: "memory" }
  }

  if (target === "file") {
    const filePath = env.STORE_FILE?.trim()
    if (!filePath) {
      return degrade("STORE_BACKEND=file 但未提供 STORE_FILE")
    }

    try {
      const store = new FileStore(filePath, {
        debounceMs: parseDebounce(env.STORE_FILE_DEBOUNCE_MS),
      })
      await probeFileBackend(store, filePath)
      return { store, backend: "file" }
    } catch (error) {
      return degrade(`文件后端不可用（${filePath}）：${describeError(error)}`)
    }
  }

  const url = env.REDIS_URL?.trim()
  if (!url) {
    return degrade("STORE_BACKEND=redis 但未提供 REDIS_URL")
  }

  try {
    const store = await RedisStore.connect({
      url,
      keyPrefix: env.STORE_KEY_PREFIX?.trim() ?? "",
    })
    await probeRedisBackend(store)
    return { store, backend: "redis" }
  } catch (error) {
    return degrade(`Redis 后端不可用：${describeError(error)}`)
  }
}

function resolveTarget(requested: string | undefined, env: StoreEnv): ServerStoreBackend {
  if (requested !== undefined && SUPPORTED_BACKENDS.includes(requested as ServerStoreBackend)) {
    return requested as ServerStoreBackend
  }
  if (env.REDIS_URL?.trim()) {
    return "redis"
  }
  if (env.STORE_FILE?.trim()) {
    return "file"
  }
  return "memory"
}

/**
 * 启动期探测文件后端。
 *
 * 1. 目录可写性：提前暴露 EACCES / EROFS / 只读挂载；
 * 2. 文件可读性：`keys()` 会触发一次加载，
 *    使「文件已损坏」在启动期暴露，而不是等到第一次业务读取。
 */
async function probeFileBackend(store: FileStore, filePath: string): Promise<void> {
  const directory = dirname(filePath)
  await mkdir(directory, { recursive: true })
  await access(directory, constants.W_OK)
  await store.keys()
}

/** 启动期探测 Redis 连通性：以哨兵键完成一次 SET/GET/DEL 全链路往返。 */
async function probeRedisBackend(store: RedisStore): Promise<void> {
  const sentinel = `__yyc3_probe__${Date.now().toString(36)}`
  await store.put(sentinel, "1")
  const echoed = await store.get(sentinel)
  await store.delete(sentinel)

  if (echoed !== "1") {
    throw new StoreError("STORE_UNAVAILABLE", "redis", "哨兵键写入后无法读回，连接状态可疑")
  }
}

function degrade(reason: string): StoreSelection {
  return {
    store: new MemoryStore(),
    backend: "memory",
    degradedReason: reason,
  }
}

function parseDebounce(raw: string | undefined): number {
  if (raw === undefined || raw.trim() === "") {
    return 0
  }
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

function describeError(error: unknown): string {
  if (error instanceof StoreError) {
    return `${error.code}: ${error.message}`
  }
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

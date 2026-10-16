/**
 * Store 之上的 JSON 编解码工具。
 *
 * 之所以把 JSON 能力做成独立工具而不是接口方法：
 * 接口只约定字符串语义，JSON 属**调用方关注点**。这样：
 * 1. 每个适配器无需重复实现序列化，只需专注自身存储介质；
 * 2. `localStorage`（字符串）、Redis、文件后端共享同一套 JSON 行为，消除实现差异。
 */

import { StoreError, type Store } from "./types"

/**
 * 读取并解析 JSON。
 *
 * 与 {@link getJsonSafe} 的区别：本函数在**数据损坏时抛错**。
 * 面向新增的、由本层写入的数据应使用本函数，
 * 以便把「键存在但内容不可解析」这类静默数据损坏尽早暴露出来。
 */
export async function getJson<T>(store: Store, key: string): Promise<T | undefined> {
  const raw = await store.get(key)
  if (raw === undefined) {
    return undefined
  }

  try {
    return JSON.parse(raw) as T
  } catch (error) {
    throw new StoreError(
      "STORE_SERIALIZE_FAILED",
      store.backend,
      `键 "${key}" 的内容不是合法 JSON（长度 ${raw.length}）`,
      error,
    )
  }
}

/**
 * 读取并解析 JSON，解析失败时返回 `undefined`。
 *
 * 供**历史数据迁移期**使用：既有实现存在把原始字符串
 * （如 `"true"`、裸 session id）直接写入同一批键的情况，
 * 迁移期需要容错而非中断。
 */
export async function getJsonSafe<T>(store: Store, key: string): Promise<T | undefined> {
  const raw = await store.get(key)
  if (raw === undefined) {
    return undefined
  }

  try {
    return JSON.parse(raw) as T
  } catch {
    return undefined
  }
}

/** 序列化并写入。`undefined` 视为删除该键。 */
export async function putJson(store: Store, key: string, value: unknown): Promise<void> {
  if (value === undefined) {
    await store.delete(key)
    return
  }

  let serialized: string
  try {
    serialized = JSON.stringify(value)
  } catch (error) {
    throw new StoreError(
      "STORE_SERIALIZE_FAILED",
      store.backend,
      `键 "${key}" 的值无法序列化为 JSON`,
      error,
    )
  }

  if (serialized === undefined) {
    // 函数、Symbol 等会被 JSON.stringify 解析为 undefined
    throw new StoreError(
      "STORE_SERIALIZE_FAILED",
      store.backend,
      `键 "${key}" 的值序列化结果为 undefined（不可序列化类型）`,
    )
  }

  await store.put(key, serialized)
}

/**
 * 原子的「读-改-写」。
 *
 * 注意：仅对单实例内存后端是严格原子的；文件后端依赖其写入锁，
 * Redis 后端依赖其互斥队列，跨进程并发需由 `SETNX` 类机制保证，
 * 本函数**不承诺**跨进程事务语义。
 */
export async function updateJson<T>(
  store: Store,
  key: string,
  updater: (previous: T | undefined) => T,
): Promise<T> {
  const previous = await getJsonSafe<T>(store, key)
  const next = updater(previous)
  await putJson(store, key, next)
  return next
}

/** 删除键；返回是否确实删除了存在的键。 */
export async function removeKey(store: Store, key: string): Promise<boolean> {
  return store.delete(key)
}

/** 判断键是否存在（不解析内容）。 */
export async function hasKey(store: Store, key: string): Promise<boolean> {
  return (await store.get(key)) !== undefined
}

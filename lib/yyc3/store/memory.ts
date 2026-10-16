/**
 * 内存后端适配器。
 *
 * 用途：
 * 1. 作为「降级后端」——当文件目录不可写、Redis 不可达时兜底，保证调用方无需分支处理；
 * 2. 单元测试与本地开发，无需任何外部依赖；
 * 3. 预渲染（SSG）阶段的服务端临时容器。
 *
 * 注意：进程退出即丢失，**不得**用于需要跨请求持久化的场景。
 */

import { assertValidKey, StoreError, type Store, type StoreBackend } from "./types"

export class MemoryStore implements Store {
  readonly backend: StoreBackend = "memory"

  private readonly entries = new Map<string, string>()

  private closed = false

  /** 当前键数量，供测试与运维观测使用。 */
  get size(): number {
    return this.entries.size
  }

  async get(key: string): Promise<string | undefined> {
    assertValidKey(key, this.backend)
    this.assertOpen()
    return this.entries.get(key)
  }

  async put(key: string, value: string): Promise<void> {
    assertValidKey(key, this.backend)
    this.assertOpen()
    this.entries.set(key, value)
  }

  async delete(key: string): Promise<boolean> {
    assertValidKey(key, this.backend)
    this.assertOpen()
    return this.entries.delete(key)
  }

  async keys(prefix?: string): Promise<string[]> {
    this.assertOpen()
    return selectKeys(this.entries.keys(), prefix)
  }

  async clear(prefix?: string): Promise<number> {
    this.assertOpen()

    if (prefix === undefined) {
      const removed = this.entries.size
      this.entries.clear()
      return removed
    }

    let removed = 0
    for (const key of this.entries.keys()) {
      if (key.startsWith(prefix)) {
        this.entries.delete(key)
        removed += 1
      }
    }
    return removed
  }

  /** 释放内存并标记关闭；幂等。关闭后任何读写都会抛出 `STORE_UNAVAILABLE`。 */
  async close(): Promise<void> {
    this.closed = true
    this.entries.clear()
  }

  private assertOpen(): void {
    if (this.closed) {
      throw new StoreError("STORE_UNAVAILABLE", this.backend, "MemoryStore 已关闭，无法继续读写")
    }
  }
}

/** 按前缀筛选并排序，保证跨后端结果可复现（不依赖各介质的天然遍历顺序）。 */
export function selectKeys(keys: Iterable<string>, prefix?: string): string[] {
  const result: string[] = []
  for (const key of keys) {
    if (prefix === undefined || key.startsWith(prefix)) {
      result.push(key)
    }
  }
  return result.sort()
}

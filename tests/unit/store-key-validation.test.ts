/**
 * Store 持久化键名校验对抗测试（阶段 2）。
 *
 * 覆盖面：
 * - assertValidKey 纯函数：空串 / 纯空白 / 非字符串注入 → STORE_INVALID_ARGUMENT；
 * - LocalStorageStore 异步契约入口的键名校验传导（空键必须被拦截，不得落盘）；
 * - keys(prefix) 完整键名语义 + clear(prefix) 删除计数语义（契约约定锁定）。
 */
import { beforeEach, describe, expect, it } from "vitest"

import { assertValidKey, StoreError } from "@/lib/yyc3/store/types"
import { getBrowserStore } from "@/lib/yyc3/store"

describe("阶段 2 · 持久化键名校验对抗（assertValidKey）", () => {
  it("TC-U-075 空串与纯空白键拒绝并携带 STORE_INVALID_ARGUMENT", () => {
    for (const bad of ["", " ", "\t", "\n", "  \t "]) {
      try {
        assertValidKey(bad, "local")
        expect.unreachable(`应拒绝键: ${JSON.stringify(bad)}`)
      } catch (error) {
        expect(error).toBeInstanceOf(StoreError)
        expect((error as StoreError).code).toBe("STORE_INVALID_ARGUMENT")
        expect((error as StoreError).backend).toBe("local")
        expect((error as StoreError).message).toContain(JSON.stringify(bad))
      }
    }
  })

  it("TC-U-076 非字符串注入（number/null/对象）拒绝", () => {
    for (const bad of [123, null, undefined, { key: "x" }, ["k"]]) {
      expect(() => assertValidKey(bad as unknown as string, "local")).toThrow(StoreError)
    }
  })

  it("TC-U-077 合法键放行（含中文 / 冒号 / 斜杠业务键）", () => {
    expect(() => assertValidKey("favorites:demo", "local")).not.toThrow()
    expect(() => assertValidKey("收藏_用户-1", "local")).not.toThrow()
    expect(() => assertValidKey("a/b/c", "local")).not.toThrow()
  })
})

describe("阶段 2 · LocalStorageStore 键名校验传导与契约语义", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("TC-U-078 空键经异步契约入口被拦截，不得写入存储", async () => {
    const store = getBrowserStore()
    await expect(store.put("", "v")).rejects.toMatchObject({ code: "STORE_INVALID_ARGUMENT" })
    await expect(store.get("   ")).rejects.toMatchObject({ code: "STORE_INVALID_ARGUMENT" })
    await expect(store.delete("")).rejects.toMatchObject({ code: "STORE_INVALID_ARGUMENT" })
    expect((await store.keys()).length).toBe(0)
  })

  it("TC-U-079 keys(prefix) 返回完整键名并按前缀过滤（契约锁定）", async () => {
    const store = getBrowserStore()
    await store.put("favorites:u1", "a")
    await store.put("favorites:u2", "b")
    await store.put("sync:u1", "c")

    const favKeys = await store.keys("favorites:")
    expect(favKeys).toEqual(["favorites:u1", "favorites:u2"])
    expect((await store.keys()).sort()).toEqual(["favorites:u1", "favorites:u2", "sync:u1"])
  })

  it("TC-U-080 clear(prefix) 返回删除计数且不波及其他前缀", async () => {
    const store = getBrowserStore()
    await store.put("favorites:u1", "a")
    await store.put("favorites:u2", "b")
    await store.put("other", "c")

    await expect(store.clear("favorites:")).resolves.toBe(2)
    expect(await store.keys()).toEqual(["other"])
    // 幂等：再次清空同前缀返回 0
    await expect(store.clear("favorites:")).resolves.toBe(0)
  })
})

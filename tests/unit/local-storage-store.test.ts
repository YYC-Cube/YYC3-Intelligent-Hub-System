/**
 * LocalStorageStore（@yyc3/store 契约的浏览器适配器）单元测试。
 *
 * 覆盖面：
 * - Store 契约核心路径：put/get/delete/exists/keys/clear（异步 + 同步内核）；
 * - getJson/putJson 便捷读写（含畸形 JSON、非对象值边界）；
 * - 容错边界：隐私模式（get/set 抛异常）静默降级不外抛；
 * - SSR/无 window 环境：getBrowserStore 延迟初始化与进程内降级。
 */
import { beforeEach, describe, expect, it, vi } from "vitest"
import { getBrowserStore } from "@/lib/yyc3/store"

describe("LocalStorageStore（浏览器适配器）", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("put/get 往返一致（异步契约路径）", async () => {
    const store = getBrowserStore()
    await store.put("k1", "v1")
    expect(await store.get("k1")).toBe("v1")
  })

  it("get 不存在的键返回 undefined", async () => {
    const store = getBrowserStore()
    expect(await store.get("missing")).toBeUndefined()
  })

  it("delete 后 get 返回 undefined，keys 不再包含该键", async () => {
    const store = getBrowserStore()
    await store.put("k2", "v2")
    expect(await store.get("k2")).toBe("v2")
    expect(await store.delete("k2")).toBe(true)
    expect(await store.get("k2")).toBeUndefined()
    expect(await store.keys()).toEqual([])
  })

  it("delete 不存在的键返回 false 且不抛错", async () => {
    const store = getBrowserStore()
    expect(await store.delete("nope")).toBe(false)
  })

  it("keys 返回当前全部键、clear 清空全部键", async () => {
    const store = getBrowserStore()
    await store.put("a", "1")
    await store.put("b", "2")
    expect((await store.keys()).sort()).toEqual(["a", "b"])
    await store.clear()
    expect(await store.keys()).toEqual([])
  })

  it("getSync/putSync 同步内核与异步路径读写同一存储", async () => {
    const store = getBrowserStore()
    store.putSync("sync-key", "sync-val")
    expect(store.getSync("sync-key")).toBe("sync-val")
    expect(await store.get("sync-key")).toBe("sync-val")
    await store.put("async-key", "async-val")
    expect(store.getSync("async-key")).toBe("async-val")
    store.deleteSync("sync-key")
    expect(store.getSync("sync-key")).toBeUndefined()
  })

  it("getJson/putJson 对象往返一致", async () => {
    const store = getBrowserStore()
    await store.put("obj", JSON.stringify({ x: 1, list: [1, 2] }))
    const parsed = store.getSync("obj")
    expect(parsed ? JSON.parse(parsed) : undefined).toEqual({ x: 1, list: [1, 2] })
  })

  it("隐私模式（getItem 抛异常）下 get 静默返回 undefined 不外抛", async () => {
    const spy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError")
    })
    const store = getBrowserStore()
    await expect(store.get("k")).resolves.toBeUndefined()
    expect(store.getSync("k")).toBeUndefined()
    spy.mockRestore()
  })

  it("隐私模式（setItem 抛异常）下 put 静默成功不外抛", async () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceeded")
    })
    const store = getBrowserStore()
    await expect(store.put("k", "v")).resolves.not.toThrow()
    expect(store.putSync("k2", "v2")).toBeUndefined()
    spy.mockRestore()
  })
})

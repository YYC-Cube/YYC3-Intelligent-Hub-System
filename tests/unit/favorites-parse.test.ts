/**
 * 收藏持久化数据解析对抗测试（阶段 2）。
 *
 * 背景：favorites-context 此前将 JSON.parse 结果未加类型守卫直接写入
 * React 状态，「合法 JSON 但非字符串数组」的损坏数据会导致渲染路径
 * `favorites.includes` 抛 TypeError 整页崩溃。本测试锁定
 * parseStoredFavorites 的收敛语义：任何输入 → 安全的 string[]。
 */
import { describe, expect, it } from "vitest"

import { parseStoredFavorites } from "@/app/utils/favorites-storage"

describe("阶段 2 · 收藏数据解析对抗（parseStoredFavorites）", () => {
  it("TC-U-081 合法字符串数组原样通过", () => {
    expect(parseStoredFavorites(["1", "2", "3"])).toEqual(["1", "2", "3"])
  })

  it("TC-U-082 数组内脏元素（数字 / null / 对象）过滤保留字符串", () => {
    expect(parseStoredFavorites([1, "2", null, { id: "x" }, "3", undefined])).toEqual(["2", "3"])
  })

  it("TC-U-083 JSON 字符串形态的数组解析通过（存储层直读场景）", () => {
    expect(parseStoredFavorites('["a","b"]')).toEqual(["a", "b"])
  })

  it("TC-U-084 合法 JSON 但非数组的损坏数据收敛为空数组（崩溃回归）", () => {
    // 以下任一输入在修复前都会导致 favorites-context 渲染崩溃
    expect(parseStoredFavorites("123")).toEqual([])
    expect(parseStoredFavorites(123)).toEqual([])
    expect(parseStoredFavorites('{"a":1}')).toEqual([])
    expect(parseStoredFavorites({ a: 1 })).toEqual([])
    expect(parseStoredFavorites('"text"')).toEqual([])
    expect(parseStoredFavorites("true")).toEqual([])
  })

  it("TC-U-085 非 JSON 噪声文本与空串收敛为空数组", () => {
    expect(parseStoredFavorites("not-json{{")).toEqual([])
    expect(parseStoredFavorites("")).toEqual([])
  })

  it("TC-U-086 null / undefined 收敛为空数组", () => {
    expect(parseStoredFavorites(null)).toEqual([])
    expect(parseStoredFavorites(undefined)).toEqual([])
  })

  it("TC-U-087 幽灵 id（越权收藏）按契约放行，展示层由交集过滤兜底", () => {
    // 业务约定：addFavorite 不校验 id 存在性；favoritesData 计算时自然排除
    expect(parseStoredFavorites(["999999", "ghost-id"])).toEqual(["999999", "ghost-id"])
  })
})

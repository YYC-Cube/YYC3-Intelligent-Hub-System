import { webcrypto } from "node:crypto"
import { describe, expect, it } from "vitest"

import { hashPassword, verifyPassword } from "@/lib/yyc3/password"

// jsdom 的 crypto 仅含 getRandomValues、缺 subtle —— 回退 Node webcrypto（浏览器环境原生具备）
if (!globalThis.crypto?.subtle) {
  Object.defineProperty(globalThis, "crypto", { value: webcrypto, configurable: true })
}

/**
 * 密码模块单测：验收第七章「身份认证安全 / 无明文存储密码」修复的闭环依据。
 * 覆盖：PBKDF2 新格式、legacy SHA-256 升级、明文字段升级清除、非法记录容错。
 */
describe("lib/yyc3/password", () => {
  it("hashPassword 生成自描述 PBKDF2 格式且每次盐随机", async () => {
    const h1 = await hashPassword("S3cure!pass")
    const h2 = await hashPassword("S3cure!pass")

    expect(h1).toMatch(/^pbkdf2\$100000\$[A-Za-z0-9+/=]+\$[A-Za-z0-9+/=]+$/)
    expect(h1).not.toEqual(h2)
  })

  it("verifyPassword 对现行 PBKDF2 记录校验通过/失败", async () => {
    const stored = await hashPassword("correct-horse")
    expect((await verifyPassword("correct-horse", { passwordHash: stored })).valid).toBe(true)
    expect((await verifyPassword("wrong", { passwordHash: stored })).valid).toBe(false)
  })

  it("legacy SHA-256 记录校验通过并给出升级哈希", async () => {
    // 旧算法：SHA-256(password + "__yyc3_salt__") 十六进制
    const data = new TextEncoder().encode("legacy-pass__yyc3_salt__")
    const digest = await crypto.subtle.digest("SHA-256", data)
    const legacyHex = Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")

    const result = await verifyPassword("legacy-pass", { passwordHash: legacyHex })
    expect(result.valid).toBe(true)
    expect(result.upgradedHash).toMatch(/^pbkdf2\$100000\$/)
    // 升级哈希必须能被现行校验通过
    expect((await verifyPassword("legacy-pass", { passwordHash: result.upgradedHash! })).valid).toBe(true)
  })

  it("明文字段记录校验通过并给出升级哈希（调用方应删除明文）", async () => {
    const record = { password: "plain-old-pass" }
    const result = await verifyPassword("plain-old-pass", record)
    expect(result.valid).toBe(true)
    expect(result.upgradedHash).toBeDefined()
    expect((await verifyPassword("not-the-pass", record)).valid).toBe(false)
  })

  it("非法/损坏记录安全拒绝而非抛错", async () => {
    expect((await verifyPassword("x", { passwordHash: "pbkdf2$bad$payload" })).valid).toBe(false)
    expect((await verifyPassword("x", { passwordHash: "zzz-not-a-format" })).valid).toBe(false)
    expect((await verifyPassword("x", {})).valid).toBe(false)
  })
})

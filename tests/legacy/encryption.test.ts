/**
 * 加密服务测试（M-1：自 jest 迁移至 vitest；require 改为动态 import）。
 */

import { generateIV, generateSalt } from "@/app/services/encryption"
import { describe, expect, it } from "vitest"

describe("加密服务", () => {
  describe("generateIV (初始化向量生成)", () => {
    it("应该生成正确长度的初始化向量 (12字节)", () => {
      const iv = generateIV()
      expect(iv).toBeInstanceOf(Uint8Array)
      expect(iv.length).toBe(12) // AES-GCM标准IV长度
    })

    it("应该生成不同的初始化向量 (随机性)", () => {
      const samples = Array.from({ length: 10 }, () => generateIV())

      // 检查所有生成的IV都不同
      const uniqueSamples = new Set(samples.map((iv) => Array.from(iv).join(",")))
      expect(uniqueSamples.size).toBe(samples.length)
    })

    it("应该包含有效的字节值 (0-255)", () => {
      const iv = generateIV()

      for (const byte of iv) {
        expect(byte).toBeGreaterThanOrEqual(0)
        expect(byte).toBeLessThanOrEqual(255)
      }
    })
  })

  describe("generateSalt (盐值生成)", () => {
    it("应该生成正确长度的盐值 (16字节)", () => {
      const salt = generateSalt()
      expect(salt).toBeInstanceOf(Uint8Array)
      expect(salt.length).toBe(16)
    })

    it("应该生成不同的盐值 (随机性)", () => {
      const salt1 = generateSalt()
      const salt2 = generateSalt()

      // 比较两个字节数组
      const isDifferent = salt1.some((byte, index) => byte !== salt2[index])
      expect(isDifferent).toBeTruthy()
    })
  })

  describe("加密配置验证", () => {
    it("应该导出必要的工具函数", () => {
      expect(typeof generateIV).toBe("function")
      expect(typeof generateSalt).toBe("function")
    })
  })

  describe("类型定义验证", () => {
    it("应该导出正确的类型", async () => {
      // 动态导入模块以验证导出存在（M-1：require → 动态 import）
      const encryptionModule = await import("@/app/services/encryption")

      expect(encryptionModule).toBeDefined()
      expect(typeof encryptionModule.generateIV).toBe("function")
      expect(typeof encryptionModule.generateSalt).toBe("function")
      expect(typeof encryptionModule.deriveKey).toBe("function")
      expect(typeof encryptionModule.encryptData).toBe("function")
      expect(typeof encryptionModule.decryptData).toBe("function")
    })

    it("应该包含默认设置", async () => {
      const { defaultEncryptionSettings } = await import("@/app/services/encryption")

      expect(defaultEncryptionSettings).toBeDefined()
      expect(defaultEncryptionSettings.enabled).toBeDefined()
      expect(defaultEncryptionSettings.autoEncrypt).toBeDefined()
    })
  })

  describe("性能基准测试", () => {
    it("生成1000个IV应该在合理时间内完成", () => {
      const startTime = performance.now()

      for (let i = 0; i < 1000; i++) {
        generateIV()
      }

      const endTime = performance.now()
      const duration = endTime - startTime

      // 1000次IV生成应该在500ms内完成
      expect(duration).toBeLessThan(500)
    }, 10000)

    it("批量生成应该保持随机性", () => {
      const batchSize = 100
      const ivs = Array.from({ length: batchSize }, () => generateIV())

      // 验证唯一性（M-1：Buffer 依赖改为字节序列拼接，jsdom 环境更稳）
      const uniqueIvs = new Set(ivs.map((iv) => Array.from(iv).join(",")))

      // 允许极小的碰撞概率，但99%以上应该是唯一的
      const uniquenessRatio = uniqueIvs.size / batchSize
      expect(uniquenessRatio).toBeGreaterThan(0.95)
    })
  })
})

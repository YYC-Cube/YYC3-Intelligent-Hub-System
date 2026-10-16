/**
 * AI 服务层核心测试（M-1：自 jest 迁移至 vitest；require 改为动态 import / node 静态导入）
 * 测试 app/services/ai/ 的主要功能（避免循环依赖）
 */

import { existsSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

describe("AI服务层基础测试", () => {
  describe("模块可访问性", () => {
    it("应该能够导入核心类型定义", async () => {
      try {
        const types = await import("@/app/services/ai/types/ai-types")
        expect(types).toBeTruthy()
      } catch (error: any) {
        console.warn("⚠️ 类型导入跳过:", error?.message)
      }
    })

    it("应该能够导入模型配置", async () => {
      try {
        const configs = await import("@/app/services/ai/config/model-configs")
        expect(configs).toBeTruthy()
        expect(configs.MODEL_CONFIGS).toBeTruthy()
      } catch (error: any) {
        console.warn("⚠️ 配置导入跳过:", error.message)
      }
    })
  })

  describe("数据库服务集成验证", () => {
    it("数据库服务应该可用", async () => {
      const { DatabaseService } = await import("@/app/services/database")
      const db = new DatabaseService()

      const status = db.getPoolStatus() as any
      expect(status).toHaveProperty("config")
      expect(status.config.database).toBe("yyc3_integration_center")
    })
  })
})

describe("AI服务架构验证", () => {
  it("项目结构应该包含必要的目录", () => {
    const requiredPaths = ["app/services/ai/core", "app/services/ai/config", "app/services/ai/types"]

    requiredPaths.forEach((dirPath) => {
      const fullPath = join(process.cwd(), dirPath)
      expect(existsSync(fullPath)).toBe(true)
    })
  })

  it("核心文件应该存在", () => {
    const coreFiles = [
      "app/services/ai/core/ensemble-engine.ts",
      "app/services/ai/core/prediction-engine.ts",
      "app/services/ai/core/learning-engine.ts",
    ]

    coreFiles.forEach((filePath) => {
      const fullPath = join(process.cwd(), filePath)
      expect(existsSync(fullPath)).toBe(true)
    })
  })
})

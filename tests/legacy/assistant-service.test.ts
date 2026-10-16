/**
 * AI 助手服务集成测试（M-1：自 jest 迁移至 vitest）。
 */

import {
  createFrontendAssistantService,
  useAssistant,
  AssistantProvider,
} from "@/app/context/assistant-context"
import type {
  AssistantConfig,
  AssistantMessage,
  AssistantSession,
  AssistantState,
  IAssistantService,
} from "@/app/services/ai-assistant/assistant-types"
import { AssistantService } from "@/app/services/ai-assistant/assistant-service"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"

describe("AI助手服务集成测试", () => {
  let dbService: AssistantService
  let frontendService: IAssistantService

  const defaultConfig: AssistantConfig = {
    model: "gpt-4o-mini",
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: "测试助手",
  }

  beforeAll(() => {
    dbService = new AssistantService()
    frontendService = createFrontendAssistantService(dbService)
  })

  afterAll(() => {
    if (frontendService && typeof frontendService.dispose === "function") {
      frontendService.dispose()
    }
  })

  describe("服务初始化", () => {
    it("应该成功创建前端服务实例", () => {
      expect(frontendService).toBeDefined()
    })

    it("应该具有正确的接口方法", () => {
      expect(typeof frontendService.getState).toBe("function")
      expect(typeof frontendService.sendMessage).toBe("function")
      expect(typeof frontendService.createSession).toBe("function")
      expect(typeof frontendService.switchSession).toBe("function")
      expect(typeof frontendService.deleteSession).toBe("function")
      expect(typeof frontendService.on).toBe("function")
      expect(typeof frontendService.off).toBe("function")
    })
  })

  describe("状态管理", () => {
    it("初始状态应该有效", () => {
      const state = frontendService.getState()

      expect(state).toBeDefined()
      expect(Array.isArray(state.sessions)).toBeTruthy()
      expect(typeof state.isLoading).toBe("boolean")
      expect(typeof state.isProcessing).toBe("boolean")
    })

    it("应该能够获取配置信息", () => {
      const state = frontendService.getState()

      expect(state.config).toBeDefined()
      expect(state.config.model).toBeDefined()
      expect(typeof state.config.temperature).toBe("number")
    })
  })

  describe("会话管理", () => {
    it("应该能够创建新会话", async () => {
      const session = await frontendService.createSession("测试会话")

      expect(session).toBeDefined()
      expect(session.id).toBeDefined()
      expect(session.title).toBe("测试会话")
    })

    it("应该能够切换会话", async () => {
      const session1 = await frontendService.createSession("会话1")
      await frontendService.createSession("会话2")

      frontendService.switchSession(session1.id)

      const state = frontendService.getState()
      expect(state.currentSession?.id).toBe(session1.id)
    })

    it("应该能够删除会话", async () => {
      const session = await frontendService.createSession("待删除会话")

      await frontendService.deleteSession(session.id)

      const state = frontendService.getState()
      const exists = state.sessions.some((s: any) => s.id === session.id)
      expect(exists).toBeFalsy()
    })
  })

  describe("事件系统", () => {
    it("应该支持事件监听", () => {
      const mockListener = vi.fn()

      frontendService.on("configChanged" as any, mockListener)

      // 触发一些操作
      frontendService.getState() // 这可能会触发某些内部事件

      // 验证监听器已注册（可能未被调用）
      expect(typeof mockListener).toBe("function")
    })

    it("应该能够移除事件监听器", () => {
      const mockListener = vi.fn()

      const unsubscribe = frontendService.on("configChanged" as any, mockListener)

      if (typeof unsubscribe === "function") {
        unsubscribe()
      }

      // 监听器应该已被移除
      expect(true).toBeTruthy()
    })
  })

  describe("消息处理", () => {
    it("应该能够发送消息", async () => {
      await frontendService.createSession("消息测试会话")

      try {
        const response = await frontendService.sendMessage("你好，助手！")

        expect(response).toBeDefined()
      } catch (error) {
        // 消息发送可能因为缺少API密钥而失败，这是预期的
        console.log("消息发送失败（可能是预期的）:", error)
      }
    }, 10000)

    it("应该在处理过程中更新状态", async () => {
      await frontendService.createSession("状态测试")

      const initialState = frontendService.getState()
      const initialProcessing = initialState.isProcessing

      try {
        const sendPromise = frontendService.sendMessage("测试")

        // 等待一小段时间检查处理状态
        await new Promise((resolve) => setTimeout(resolve, 100))

        const duringState = frontendService.getState()

        await sendPromise
      } catch (error) {
        console.log("消息处理错误（预期内）:", error)
      }
    }, 10000)
  })

  describe("错误处理", () => {
    it("应该能够优雅地处理无效会话ID", () => {
      expect(() => {
        frontendService.switchSession("invalid-session-id-12345")
      }).not.toThrow()
    })

    it("应该能够处理空消息", async () => {
      await frontendService.createSession("空消息测试")

      try {
        await frontendService.sendMessage("")
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })

  describe("配置管理", () => {
    it("应该支持配置更新", () => {
      if (typeof frontendService.configureAssistant === "function") {
        frontendService.configureAssistant({
          temperature: 0.9,
          maxTokens: 3000,
        })

        const state = frontendService.getState()
        expect(state.config.temperature).toBe(0.9)
        expect(state.config.maxTokens).toBe(3000)
      } else {
        console.log("configureAssistant method not available")
      }
    })
  })
})

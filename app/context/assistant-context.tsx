"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { AssistantService } from "@/app/services/ai-assistant/assistant-service"
import type {
  AssistantState,
  AssistantConfig,
  AssistantMessage,
  AssistantSession,
  IAssistantService,
  AssistantEventType,
  EventListener,
} from "@/app/services/ai-assistant/assistant-types"

// 默认配置
const DEFAULT_CONFIG: AssistantConfig = {
  model: "gpt-4o",
  temperature: 0.7,
  maxTokens: 4000,
  systemPrompt: "你是YanYuCloudCube集成中心的智能助手",
}

// 默认状态
const DEFAULT_STATE: AssistantState = {
  currentSession: null,
  sessions: [],
  isLoading: false,
  isProcessing: false,
  error: null,
  config: DEFAULT_CONFIG,
}

/**
 * 前端AI助手服务实现
 * 包装数据库服务，添加事件系统和状态管理
 */
class FrontendAssistantService implements IAssistantService {
  private dbService: AssistantService
  private state: AssistantState = { ...DEFAULT_STATE }
  private listeners: Map<AssistantEventType, Set<EventListener>> = new Map()
  private currentUserId: number = 1 // TODO: 从认证系统获取

  constructor(dbService: AssistantService) {
    this.dbService = dbService
  }

  getState(): AssistantState {
    return { ...this.state }
  }

  on(event: AssistantEventType, listener: EventListener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(listener)
    return () => {
      this.listeners.get(event)?.delete(listener)
    }
  }

  off(event: AssistantEventType, listener: EventListener): void {
    this.listeners.get(event)?.delete(listener)
  }

  removeAllListeners(): void {
    this.listeners.clear()
  }

  private emit(event: AssistantEventType, ...args: any[]): void {
    this.listeners.get(event)?.forEach(listener => {
      try {
        listener(...args)
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error)
      }
    })
  }

  private updateState(updates: Partial<AssistantState>): void {
    this.state = { ...this.state, ...updates }
    this.emit('configChanged') // 通知状态变更
  }

  createSession(title?: string): AssistantSession {
    const session: AssistantSession = {
      id: `session-${Date.now()}`,
      title: title || `对话 ${this.state.sessions.length + 1}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const sessions = [...this.state.sessions, session]
    this.updateState({ 
      currentSession: session, 
      sessions,
    })
    
    this.emit('sessionCreated', session)
    return session
  }

  switchSession(sessionId: string): AssistantSession | null {
    const session = this.state.sessions.find(s => s.id === sessionId) || null
    if (session) {
      this.updateState({ currentSession: session })
      this.emit('sessionSwitched', session)
    }
    return session
  }

  deleteSession(sessionId: string): boolean {
    const sessions = this.state.sessions.filter(s => s.id !== sessionId)
    const wasCurrentSession = this.state.currentSession?.id === sessionId
    
    this.updateState({
      sessions,
      currentSession: wasCurrentSession ? (sessions[0] || null) : this.state.currentSession,
    })
    
    this.emit('sessionDeleted', sessionId)
    return true
  }

  async sendMessage(content: string): Promise<AssistantMessage | null> {
    if (!this.state.currentSession) {
      this.createSession()
    }

    const userMessage: AssistantMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content,
      timestamp: new Date(),
    }

    // 更新状态：添加用户消息
    const updatedSession = {
      ...this.state.currentSession!,
      messages: [...this.state.currentSession!.messages, userMessage],
      updatedAt: new Date(),
    }
    
    this.updateState({ 
      isLoading: true, 
      isProcessing: true,
      currentSession: updatedSession,
      sessions: this.state.sessions.map(s => 
        s.id === updatedSession.id ? updatedSession : s
      ),
    })
    this.emit('messageSent', userMessage)
    this.emit('processingStarted')

    try {
      // 调用实际的数据库服务（需要conversationId）
      // 这里简化处理，实际应该先创建或获取conversation
      const responseContent = await this.mockAIResponse(content)
      
      const assistantMessage: AssistantMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      }

      // 更新状态：添加助手回复
      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, assistantMessage],
        updatedAt: new Date(),
      }

      this.updateState({ 
        isLoading: false, 
        isProcessing: false,
        currentSession: finalSession,
        sessions: this.state.sessions.map(s => 
          s.id === finalSession.id ? finalSession : s
        ),
      })

      this.emit('responseReceived', assistantMessage)
      return assistantMessage

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '发送消息失败'
      this.updateState({ isLoading: false, isProcessing: false, error: errorMessage })
      this.emit('error', error)
      return null
    }
  }

  cancelRequest(): void {
    if (this.state.isLoading || this.state.isProcessing) {
      this.updateState({ isLoading: false, isProcessing: false })
      this.emit('requestCancelled')
    }
  }

  configureAssistant(config: Partial<AssistantConfig>): void {
    const newConfig = { ...this.state.config, ...config }
    this.updateState({ config: newConfig })
  }

  dispose(): void {
    this.removeAllListeners()
    this.state = { ...DEFAULT_STATE }
  }

  loadSessionsFromStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('assistant-sessions')
        if (stored) {
          const sessions: AssistantSession[] = JSON.parse(stored)
          const currentId = localStorage.getItem('assistant-current-session')
          const currentSession = sessions.find(s => s.id === currentId) || sessions[0] || null
          
          this.updateState({ sessions, currentSession })
          this.emit('sessionsLoaded')
        }
      }
    } catch (error) {
      console.error('Failed to load sessions from storage:', error)
    }
  }

  saveSessionsToStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('assistant-sessions', JSON.stringify(this.state.sessions))
        if (this.state.currentSession) {
          localStorage.setItem('assistant-current-session', this.state.currentSession.id)
        }
      }
    } catch (error) {
      console.error('Failed to save sessions to storage:', error)
    }
  }

  // 模拟AI响应（实际应调用dbService）
  private async mockAIResponse(userMessage: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 500)) // 模拟延迟
    
    const content = userMessage.toLowerCase()
    
    if (content.includes('你好') || content.includes('嗨')) {
      return '您好！我是YanYuCloudCube智能助手。有什么可以帮助您的吗？'
    }
    
    if (content.includes('集成') || content.includes('应用')) {
      return 'YanYuCloudCube集成中心提供多种应用集成服务，包括数据库、API、营销工具等。您想了解哪方面的信息？'
    }

    return '感谢您的提问！作为YanYuCloudCube集成助手，我可以帮助您了解各种集成应用和解决问题。请告诉我更多细节。'
  }
}

// 创建前端服务的工厂函数
export function createFrontendAssistantService(dbService: AssistantService): IAssistantService {
  return new FrontendAssistantService(dbService)
}

// 上下文类型定义
type AssistantContextType = {
  state: AssistantState
  sendMessage: (content: string) => Promise<AssistantMessage | null>
  createSession: (title?: string) => AssistantSession
  switchSession: (sessionId: string) => AssistantSession | null
  deleteSession: (sessionId: string) => boolean
  cancelRequest: () => void
  configureAssistant: (config: Partial<AssistantConfig>) => void
  clearCurrentSession: () => void
}

// 创建上下文
const AssistantContext = createContext<AssistantContextType | undefined>(undefined)

// 提供者组件
export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const [frontendService] = useState<IAssistantService>(() => {
    const dbService = new AssistantService()
    return createFrontendAssistantService(dbService)
  })
  
  const [state, setState] = useState<AssistantState>(frontendService.getState())

  // 更新状态的事件监听器
  useEffect(() => {
    const updateState = () => {
      setState(frontendService.getState())
    }

    // 注册事件监听
    const events: AssistantEventType[] = [
      'messageSent',
      'responseReceived',
      'processingStarted',
      'requestCancelled',
      'error',
      'sessionCreated',
      'sessionSwitched',
      'sessionDeleted',
      'configChanged',
      'sessionsLoaded',
    ]

    events.forEach(event => {
      frontendService.on(event, updateState)
    })

    // 从本地存储加载会话
    frontendService.loadSessionsFromStorage()

    // 清理事件监听
    return () => {
      frontendService.removeAllListeners()
    }
  }, [frontendService])

  // 发送消息
  const sendMessage = useCallback(
    (content: string) => frontendService.sendMessage(content),
    [frontendService]
  )

  // 创建会话
  const createSession = useCallback(
    (title?: string) => frontendService.createSession(title),
    [frontendService]
  )

  // 切换会话
  const switchSession = useCallback(
    (sessionId: string) => frontendService.switchSession(sessionId),
    [frontendService],
  )

  // 删除会话
  const deleteSession = useCallback(
    (sessionId: string) => frontendService.deleteSession(sessionId),
    [frontendService],
  )

  // 取消请求
  const cancelRequest = useCallback(() => frontendService.cancelRequest(), [frontendService])

  // 配置助手
  const configureAssistant = useCallback(
    (config: Partial<AssistantConfig>) => frontendService.configureAssistant(config),
    [frontendService],
  )

  // 清空当前会话
  const clearCurrentSession = useCallback(() => {
    if (state.currentSession) {
      const newSession = frontendService.createSession("新对话")
      return newSession
    }
    return null
  }, [frontendService, state.currentSession])

  // 保存会话到本地存储
  useEffect(() => {
    const saveToStorage = () => {
      frontendService.saveSessionsToStorage()
    }

    // 当会话更新时保存
    frontendService.on('messageSent', saveToStorage)
    frontendService.on('responseReceived', saveToStorage)
    frontendService.on('sessionCreated', saveToStorage)
    frontendService.on('sessionDeleted', saveToStorage)

    return () => {
      frontendService.off('messageSent', saveToStorage)
      frontendService.off('responseReceived', saveToStorage)
      frontendService.off('sessionCreated', saveToStorage)
      frontendService.off('sessionDeleted', saveToStorage)
    }
  }, [frontendService])

  // 提供上下文值
  const contextValue: AssistantContextType = {
    state,
    sendMessage,
    createSession,
    switchSession,
    deleteSession,
    cancelRequest,
    configureAssistant,
    clearCurrentSession,
  }

  return (
    <AssistantContext.Provider value={contextValue}>
      {children}
    </AssistantContext.Provider>
  )
}

// Hook: 使用助手上下文
export function useAssistant() {
  const context = useContext(AssistantContext)
  if (!context) {
    throw new Error('useAssistant must be used within an AssistantProvider')
  }
  return context
}

export default AssistantContext

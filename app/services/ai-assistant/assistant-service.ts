import {
  userDao,
  aiModelDao,
  conversationDao,
  messageDao,
  userPreferenceDao,
  apiKeyDao,
  usageStatisticsDao,
  type User,
  type AiModel,
  type Conversation,
  type Message,
  type UserPreference,
} from "./assistant-dao"

// 计算token数量的简单估算函数
function estimateTokenCount(text: string): number {
  // 英文大约每4个字符1个token，中文每个字符约1.5个token
  // 这只是粗略估计，实际应使用tiktoken等库进行准确计算
  const englishCharCount = (text.match(/[a-zA-Z0-9.,?!;:'"()\s]/g) || []).length
  const chineseCharCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length

  return Math.ceil(englishCharCount / 4 + chineseCharCount * 1.5)
}

// AI助手服务
export class AssistantService {
  // 创建或获取用户
  async getOrCreateUser(email: string, name: string): Promise<User> {
    try {
      let user = await userDao.getUserByEmail(email)

      if (!user) {
        user = await userDao.createUser(email, name)
      }

      return user
    } catch (error) {
      throw new Error(`获取或创建用户失败: ${error instanceof Error ? error.message : "未知错误"}`)
    }
  }

  // 获取可用的AI模型
  async getAvailableModels(): Promise<AiModel[]> {
    try {
      return await aiModelDao.getActiveModels()
    } catch (error) {
      throw new Error(`获取AI模型失败: ${error instanceof Error ? error.message : "未知错误"}`)
    }
  }

  // 创建对话会话
  async createConversation(
    userId: number,
    title: string,
    modelId?: number,
    systemPrompt?: string,
  ): Promise<Conversation> {
    try {
      // 如果没有提供模型ID，尝试使用用户的默认模型
      if (!modelId) {
        const userPreference = await userPreferenceDao.getUserPreference(userId)
        if (userPreference?.default_model_id) {
          modelId = userPreference.default_model_id
        }
      }

      // 如果没有提供系统提示，尝试使用用户的默认系统提示
      if (!systemPrompt) {
        const userPreference = await userPreferenceDao.getUserPreference(userId)
        if (userPreference?.default_system_prompt) {
          systemPrompt = userPreference.default_system_prompt
        } else {
          // 默认系统提示
          systemPrompt = "你是YanYuCloudCube集成中心的智能助手，可以帮助用户了解各种集成应用、解决集成问题，并提供相关建议。"
        }
      }

      const conversation = await conversationDao.createConversation({
        user_id: userId,
        title,
        model_id: modelId || null,
        system_prompt: systemPrompt || null,
        is_pinned: false,
      })

      // 如果有系统提示，添加为系统消息
      if (systemPrompt) {
        await messageDao.createMessage({
          conversation_id: conversation.id,
          role: "system",
          content: systemPrompt,
          tokens_used: estimateTokenCount(systemPrompt),
        })
      }

      return conversation
    } catch (error) {
      throw new Error(`创建对话会话失败: ${error instanceof Error ? error.message : "未知错误"}`)
    }
  }

  // 获取用户的所有对话会话
  async getUserConversations(userId: number): Promise<Conversation[]> {
    try {
      return await conversationDao.getUserConversations(userId)
    } catch (error) {
      throw new Error(`获取用户对话会话失败: ${error instanceof Error ? error.message : "未知错误"}`)
    }
  }

  // 获取对话会话详情（包括消息）
  async getConversationWithMessages(
    conversationId: number,
  ): Promise<{ conversation: Conversation; messages: Message[] }> {
    try {
      const conversation = await conversationDao.getConversationById(conversationId)

      if (!conversation) {
        throw new Error(`对话会话不存在: ${conversationId}`)
      }

      const messages = await messageDao.getConversationMessages(conversationId)

      return { conversation, messages }
    } catch (error) {
      throw new Error(`获取对话会话详情失败: ${error instanceof Error ? error.message : "未知错误"}`)
    }
  }

  // 发送消息并获取AI回复
  async sendMessage(
    conversationId: number,
    content: string,
  ): Promise<{ userMessage: Message; assistantMessage: Message }> {
    try {
      const conversation = await conversationDao.getConversationById(conversationId)

      if (!conversation) {
        throw new Error(`对话会话不存在: ${conversationId}`)
      }

      // 创建用户消息
      const userTokens = estimateTokenCount(content)
      const userMessage = await messageDao.createMessage({
        conversation_id: conversationId,
        role: "user",
        content,
        tokens_used: userTokens,
      })

      // 获取对话历史
      const messages = await messageDao.getConversationMessages(conversationId)

      // 获取AI模型信息
      let model: AiModel | null = null
      if (conversation.model_id) {
        model = await aiModelDao.getModelById(conversation.model_id)
      }

      // 获取用户偏好设置
      const userPreference = await userPreferenceDao.getUserPreference(conversation.user_id)

      // 生成AI回复
      const aiResponse = await this.generateAiResponse(conversation.user_id, messages, model, userPreference)

      // 创建助手消息
      const assistantTokens = estimateTokenCount(aiResponse)
      const assistantMessage = await messageDao.createMessage({
        conversation_id: conversationId,
        role: "assistant",
        content: aiResponse,
        tokens_used: assistantTokens,
      })

      // 记录使用统计
      if (model) {
        await usageStatisticsDao.recordUsage(conversation.user_id, model.id, userTokens + assistantTokens)
      }

      return { userMessage, assistantMessage }
    } catch (error) {
      throw new Error(`发送消息失败: ${error instanceof Error ? error.message : "未知错误"}`)
    }
  }

  // 生成AI回复
  private async generateAiResponse(
    userId: number,
    messages: Message[],
    model: AiModel | null,
    userPreference: UserPreference | null,
  ): Promise<string> {
    try {
      // 如果没有模型或是本地模型，使用简单的回复逻辑
      if (!model || model.provider === "local") {
        return this.generateLocalResponse(messages)
      }

      // 根据不同的提供商生成回复
      switch (model.provider) {
        case "openai":
          return await this.generateOpenAIResponse(userId, messages, model, userPreference)
        case "anthropic":
          return await this.generateAnthropicResponse(userId, messages, model, userPreference)
        case "gemini":
          return await this.generateGeminiResponse(userId, messages, model, userPreference)
        default:
          return this.generateLocalResponse(messages)
      }
    } catch (error) {
      console.error("生成AI回复失败:", error)
      return "抱歉，生成回复时出现错误。请稍后再试。"
    }
  }

  // 本地模式的响应生成（模拟）
  private generateLocalResponse(messages: Message[]): string {
    // 获取最后一条用户消息
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")

    if (!lastUserMessage) {
      return "您好！我是YanYuCloudCube智能助手。有什么可以帮助您的吗？"
    }

    const content = lastUserMessage.content.toLowerCase()

    if (content.includes("你好") || content.includes("嗨") || content.includes("hi")) {
      return "您好！我是YanYuCloudCube智能助手。有什么可以帮助您的吗？"
    }

    if (content.includes("集成") || content.includes("应用")) {
      return "YanYuCloudCube集成中心提供多种应用集成服务，包括数据库、API、营销工具、CRM系统等。您需要了解哪方面的集成信息？"
    }

    if (content.includes("数据库") || content.includes("database")) {
      return "我们支持多种数据库集成，包括MySQL、PostgreSQL、MongoDB、Redis等。您可以通过简单的配置步骤连接您的数据库。"
    }

    if (content.includes("api") || content.includes("接口")) {
      return "YanYuCloudCube支持REST API、GraphQL和SOAP等多种API集成方式，可以帮助您连接各种第三方服务。"
    }

    if (content.includes("问题") || content.includes("错误") || content.includes("bug")) {
      return "遇到问题了吗？请描述一下您遇到的具体情况，例如错误信息、操作步骤等，我会尽力帮助您解决。"
    }

    // 默认回复
    return "感谢您的提问。作为YanYuCloudCube集成助手，我可以帮助您了解各种集成应用、解决集成问题，并提供相关建议。请告诉我您需要了解的具体内容。"
  }

  // OpenAI响应生成
  private async generateOpenAIResponse(
    userId: number,
    messages: Message[],
    model: AiModel,
    userPreference: UserPreference | null,
  ): Promise<string> {
    // 获取API密钥
    const apiKey = await apiKeyDao.getApiKey(userId, "openai")

    if (!apiKey) {
      return "请先在设置中配置OpenAI API密钥。"
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model.model_id,
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          temperature: userPreference?.temperature || 0.7,
          max_tokens: userPreference?.max_tokens || 1000,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`OpenAI API错误: ${error.error?.message || response.statusText}`)
      }

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error("OpenAI API调用失败:", error)
      throw new Error(`OpenAI API调用失败: ${error instanceof Error ? error.message : "未知错误"}`)
    }
  }

  // Anthropic响应生成
  private async generateAnthropicResponse(
    userId: number,
    messages: Message[],
    model: AiModel,
    userPreference: UserPreference | null,
  ): Promise<string> {
    // 获取API密钥
    const apiKey = await apiKeyDao.getApiKey(userId, "anthropic")

    if (!apiKey) {
      return "请先在设置中配置Anthropic API密钥。"
    }

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: model.model_id,
          messages: messages.map((m) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content,
          })),
          max_tokens: userPreference?.max_tokens || 1000,
          temperature: userPreference?.temperature || 0.7,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`Anthropic API错误: ${error.error?.message || response.statusText}`)
      }

      const data = await response.json()
      return data.content[0].text
    } catch (error) {
      console.error("Anthropic API调用失败:", error)
      throw new Error(`Anthropic API调用失败: ${error instanceof Error ? error.message : "未知错误"}`)
    }
  }

  // Google Gemini响应生成
  private async generateGeminiResponse(
    userId: number,
    messages: Message[],
    model: AiModel,
    userPreference: UserPreference | null,
  ): Promise<string> {
    // 获取API密钥
    const apiKey = await apiKeyDao.getApiKey(userId, "gemini")

    if (!apiKey) {
      return "请先在设置中配置Google Gemini API密钥。"
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model.model_id}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: messages.map((m) => ({
              role: m.role === "system" ? "user" : m.role,
              parts: [{ text: m.content }],
            })),
            generationConfig: {
              temperature: userPreference?.temperature || 0.7,
              maxOutputTokens: userPreference?.max_tokens || 1000,
            },
          }),
        },
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`Google Gemini API错误: ${error.error?.message || response.statusText}`)
      }

      const data = await response.json()
      return data.candidates[0].content.parts[0].text
    } catch (error) {
      console.error("Google Gemini API调用失败:", error)
      throw new Error(`Google Gemini API调用失败: ${error instanceof Error ? error.message : "未知错误"}`)
    }
  }

  // 获取用户偏好设置
  async getUserPreference(userId: number): Promise<UserPreference | null> {
    try {
      return await userPreferenceDao.getUserPreference(userId)
    } catch (error) {
      throw new Error(`获取用户偏好设置失败: ${error instanceof Error ? error.message : "未知错误"}`)
    }
  }

  // 更新用户偏好设置
  async updateUserPreference(userId: number, preferences: Partial<UserPreference>): Promise<UserPreference> {
    try {
      return await userPreferenceDao.upsertUserPreference({
        user_id: userId,
        ...preferences,
      })
    } catch (error) {
      throw new Error(`更新用户偏好设置失败: ${error instanceof Error ? error.message : "未知错误"}`)
    }
  }

  // 保存API密钥
  async saveApiKey(userId: number, provider: string, apiKey: string): Promise<boolean> {
    try {
      return await apiKeyDao.saveApiKey(userId, provider, apiKey)
    } catch (error) {
      throw new Error(`保存API密钥失败: ${error instanceof Error ? error.message : "未知错误"}`)
    }
  }

  // 获取用户使用统计
  async getUserUsageStats(userId: number, days = 30): Promise<any[]> {
    try {
      const endDate = new Date().toISOString().split("T")[0]
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

      return await usageStatisticsDao.getUserUsageStats(userId, startDate, endDate)
    } catch (error) {
      throw new Error(`获取用户使用统计失败: ${error instanceof Error ? error.message : "未知错误"}`)
    }
  }
}

// 创建单例实例
export const assistantService = new AssistantService()

// 创建助手服务实例的工厂函数
export function createAssistantService(): AssistantService {
  return new AssistantService()
}

// 模拟数据类型
export type User = {
  id: number
  email: string
  name: string
  created_at: Date
  updated_at: Date
}

export type AiModel = {
  id: number
  name: string
  provider: string
  model_id: string
  description: string | null
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export type Conversation = {
  id: number
  user_id: number
  title: string
  model_id: number | null
  system_prompt: string | null
  is_pinned: boolean
  created_at: Date
  updated_at: Date
}

export type Message = {
  id: number
  conversation_id: number
  role: "user" | "assistant" | "system"
  content: string
  tokens_used: number | null
  created_at: Date
}

export type UserPreference = {
  user_id: number
  default_model_id: number | null
  default_system_prompt: string | null
  temperature: number
  max_tokens: number
  theme: string
  language: string
  created_at: Date
  updated_at: Date
}

export type UsageStat = {
  date: string
  tokens_used: number
  request_count: number
  model_name: string
  provider: string
}

// 模拟AI模型数据
export const mockAiModels: AiModel[] = [
  {
    id: 1,
    name: "GPT-4",
    provider: "openai",
    model_id: "gpt-4",
    description: "OpenAI的最新大型语言模型",
    is_active: true,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: 2,
    name: "GPT-3.5 Turbo",
    provider: "openai",
    model_id: "gpt-3.5-turbo",
    description: "快速且经济的语言模型",
    is_active: true,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: 3,
    name: "Claude-3",
    provider: "anthropic",
    model_id: "claude-3-opus-20240229",
    description: "Anthropic的高性能AI助手",
    is_active: true,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: 4,
    name: "Gemini Pro",
    provider: "gemini",
    model_id: "gemini-pro",
    description: "Google的多模态AI模型",
    is_active: true,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: 5,
    name: "本地助手",
    provider: "local",
    model_id: "local-assistant",
    description: "内置的智能助手",
    is_active: true,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
]

// 模拟用户数据
export const mockUsers: User[] = [
  {
    id: 1,
    email: "demo@example.com",
    name: "演示用户",
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
]

// 模拟对话数据
export const mockConversations: Conversation[] = [
  {
    id: 1,
    user_id: 1,
    title: "集成应用问题",
    model_id: 1,
    system_prompt: "你是YanYuCloudCube集成中心的智能助手，可以帮助用户了解各种集成应用、解决集成问题，并提供相关建议。",
    is_pinned: true,
    created_at: new Date("2024-05-01"),
    updated_at: new Date("2024-05-01"),
  },
  {
    id: 2,
    user_id: 1,
    title: "API集成帮助",
    model_id: 2,
    system_prompt: null,
    is_pinned: false,
    created_at: new Date("2024-05-02"),
    updated_at: new Date("2024-05-02"),
  },
]

// 模拟消息数据
export const mockMessages: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      conversation_id: 1,
      role: "system",
      content: "你是YanYuCloudCube集成中心的智能助手，可以帮助用户了解各种集成应用、解决集成问题，并提供相关建议。",
      tokens_used: 30,
      created_at: new Date("2024-05-01T10:00:00"),
    },
    {
      id: 2,
      conversation_id: 1,
      role: "user",
      content: "如何连接MySQL数据库？",
      tokens_used: 10,
      created_at: new Date("2024-05-01T10:01:00"),
    },
    {
      id: 3,
      conversation_id: 1,
      role: "assistant",
      content:
        "连接MySQL数据库需要以下步骤：\n\n1. 在集成中心选择MySQL集成\n2. 填写数据库连接信息（主机、端口、用户名、密码）\n3. 测试连接\n4. 选择要同步的表\n5. 配置同步频率\n6. 保存配置\n\n完成这些步骤后，您的MySQL数据库就成功连接到YanYuCloudCube集成中心了。如果遇到连接问题，请确保：\n\n- 数据库服务器允许远程连接\n- 防火墙设置正确\n- 用户有足够的权限\n- 连接信息无误",
      tokens_used: 150,
      created_at: new Date("2024-05-01T10:01:30"),
    },
  ],
  2: [
    {
      id: 4,
      conversation_id: 2,
      role: "user",
      content: "如何集成第三方API？",
      tokens_used: 10,
      created_at: new Date("2024-05-02T14:00:00"),
    },
    {
      id: 5,
      conversation_id: 2,
      role: "assistant",
      content:
        "集成第三方API的步骤如下：\n\n1. 在集成中心选择API集成\n2. 选择API类型（REST、GraphQL、SOAP等）\n3. 输入API端点URL\n4. 配置认证方式（API密钥、OAuth等）\n5. 设置请求头和参数\n6. 测试API连接\n7. 配置数据映射\n8. 设置触发条件\n9. 保存配置\n\n完成后，您就可以在工作流中使用这个API集成了。如需帮助，可以查看我们的API集成文档或联系支持团队。",
      tokens_used: 180,
      created_at: new Date("2024-05-02T14:00:30"),
    },
  ],
}

// 模拟用户偏好设置
export const mockUserPreferences: Record<number, UserPreference> = {
  1: {
    user_id: 1,
    default_model_id: 1,
    default_system_prompt:
      "你是YanYuCloudCube集成中心的智能助手，可以帮助用户了解各种集成应用、解决集成问题，并提供相关建议。",
    temperature: 0.7,
    max_tokens: 1000,
    theme: "light",
    language: "zh-CN",
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
}

// 模拟API密钥
export const mockApiKeys: Record<string, string> = {
  "1_openai": "sk-mock-openai-key",
  "1_anthropic": "sk-mock-anthropic-key",
}

// 模拟使用统计
export const mockUsageStats: UsageStat[] = [
  {
    date: "2024-05-01",
    tokens_used: 190,
    request_count: 1,
    model_name: "GPT-4",
    provider: "openai",
  },
  {
    date: "2024-05-02",
    tokens_used: 190,
    request_count: 1,
    model_name: "GPT-3.5 Turbo",
    provider: "openai",
  },
  {
    date: "2024-05-03",
    tokens_used: 250,
    request_count: 2,
    model_name: "GPT-4",
    provider: "openai",
  },
  {
    date: "2024-05-04",
    tokens_used: 150,
    request_count: 1,
    model_name: "Claude-3",
    provider: "anthropic",
  },
]

// 模拟数据访问函数
export const mockDataService = {
  // 用户相关
  getUser(id: number): User | undefined {
    return mockUsers.find((user) => user.id === id)
  },

  getUserByEmail(email: string): User | undefined {
    return mockUsers.find((user) => user.email === email)
  },

  // 模型相关
  getActiveModels(): AiModel[] {
    return mockAiModels.filter((model) => model.is_active)
  },

  getModelById(id: number): AiModel | undefined {
    return mockAiModels.find((model) => model.id === id)
  },

  // 对话相关
  getUserConversations(userId: number): Conversation[] {
    return mockConversations
      .filter((conv) => conv.user_id === userId)
      .sort((a, b) => {
        if (a.is_pinned !== b.is_pinned) {
          return a.is_pinned ? -1 : 1
        }
        return b.updated_at.getTime() - a.updated_at.getTime()
      })
  },

  getConversationById(id: number): Conversation | undefined {
    return mockConversations.find((conv) => conv.id === id)
  },

  // 消息相关
  getConversationMessages(conversationId: number): Message[] {
    return mockMessages[conversationId] || []
  },

  // 用户偏好相关
  getUserPreference(userId: number): UserPreference | undefined {
    return mockUserPreferences[userId]
  },

  // API密钥相关
  getApiKey(userId: number, provider: string): string | undefined {
    return mockApiKeys[`${userId}_${provider}`]
  },

  // 使用统计相关
  getUserUsageStats(): UsageStat[] {
    return mockUsageStats
  },
}

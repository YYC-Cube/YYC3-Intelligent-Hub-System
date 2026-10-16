// 简单的身份验证模拟
// 在实际应用中，应该使用NextAuth.js或类似的身份验证库
import { t } from "@/lib/yyc3/i18n"

// 模拟用户数据库
const users = [
  {
    id: "1",
    name: "测试用户",
    email: "test@example.com",
    password: "password123", // 实际应用中应该使用加密密码
  },
]

// 获取当前用户信息
export async function auth() {
  // 从会话中获取用户（这里简化为返回第一个用户）
  return {
    user: users[0],
  }
}

// 登录功能
export async function login(email: string, password: string) {
  // 查找用户
  const user = users.find((u) => u.email === email)

  // 验证密码
  if (user && user.password === password) {
    // 实际应用中，这里应该创建会话或JWT令牌
    return { success: true, user: { id: user.id, name: user.name, email: user.email } }
  }

  return { success: false, message: t("auth.邮箱或密码不正确") }
}

// 注册功能
export async function register(name: string, email: string, password: string) {
  // 检查邮箱是否已被使用
  if (users.find((u) => u.email === email)) {
    return { success: false, message: t("auth.该邮箱已被注册") }
  }

  // 创建新用户（实际应用中应该存入数据库）
  const newUser = {
    id: String(users.length + 1),
    name,
    email,
    password, // 实际应用中应该加密存储
  }

  users.push(newUser)

  return {
    success: true,
    user: { id: newUser.id, name: newUser.name, email: newUser.email },
  }
}

// 登出功能
export async function logout() {
  // 实际应用中，这里应该清除会话或JWT令牌
  return { success: true }
}

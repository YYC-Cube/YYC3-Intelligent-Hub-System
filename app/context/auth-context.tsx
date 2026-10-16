"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/app/hooks/use-i18n"

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + "__yyc3_salt__")
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export type User = {
  id: string
  name: string
  email: string
  avatar?: string
  lastSyncTime?: string
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { t } = useI18n()

  // 从localStorage加载用户数据
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Error loading user from localStorage:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  // 模拟登录功能
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)

      // 模拟API请求延迟
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 检查用户是否存在（模拟）
      const usersData = localStorage.getItem("users")
      const users = usersData ? JSON.parse(usersData) : []

      const foundUser = users.find((u: any) => u.email === email)

      if (!foundUser) {
        toast({
          title: t("auth.登录失败"),
          description: t("auth.邮箱或密码不正确"),
          variant: "destructive",
        })
        return false
      }

      const hashedInput = await hashPassword(password)
      if (foundUser.passwordHash !== hashedInput && foundUser.password !== password) {
        toast({
          title: t("auth.登录失败"),
          description: t("auth.邮箱或密码不正确"),
          variant: "destructive",
        })
        return false
      }

      // 创建用户对象（不包含密码）
      const userObj: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        avatar: foundUser.avatar,
        lastSyncTime: new Date().toISOString(),
      }

      // 保存到状态和localStorage
      setUser(userObj)
      localStorage.setItem("user", JSON.stringify(userObj))

      toast({
        title: t("auth.登录成功"),
        description: t("auth.欢迎回来，{name}！", { name: userObj.name }),
      })

      return true
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: t("auth.登录失败"),
        description: t("auth.发生错误，请稍后重试"),
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // 模拟注册功能
  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true)

      // 模拟API请求延迟
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 检查用户是否已存在
      const usersData = localStorage.getItem("users")
      const users = usersData ? JSON.parse(usersData) : []

      if (users.some((u: any) => u.email === email)) {
        toast({
          title: t("auth.注册失败"),
          description: t("auth.该邮箱已被注册"),
          variant: "destructive",
        })
        return false
      }

      // 创建新用户
      const hashedPw = await hashPassword(password)
      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        passwordHash: hashedPw,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        createdAt: new Date().toISOString(),
      }

      // 保存到"数据库"
      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      // 创建用户对象（不包含密码）
      const userObj: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        lastSyncTime: new Date().toISOString(),
      }

      // 保存到状态和localStorage
      setUser(userObj)
      localStorage.setItem("user", JSON.stringify(userObj))

      toast({
        title: t("auth.注册成功"),
        description: t("auth.欢迎，{name}！", { name }),
      })

      return true
    } catch (error) {
      console.error("Register error:", error)
      toast({
        title: t("auth.注册失败"),
        description: t("auth.发生错误，请稍后重试"),
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // 登出功能
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    toast({
      title: t("auth.已退出登录"),
      description: t("auth.您已成功退出登录"),
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

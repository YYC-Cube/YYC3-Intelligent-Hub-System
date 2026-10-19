/**
 * 加密服务 - 提供端到端加密功能
 * 使用Web Crypto API实现安全的加密和解密
 */

import { requireSession } from "@/lib/yyc3/session"

// 加密配置
const ENCRYPTION_ALGORITHM = "AES-GCM"
const KEY_LENGTH = 256 // 密钥长度（位）
const SALT_LENGTH = 16 // 盐长度（字节）
const IV_LENGTH = 12 // 初始化向量长度（字节）
const ITERATION_COUNT = 100000 // PBKDF2迭代次数

// 密钥派生参数
const KEY_DERIVATION_PARAMS = {
  name: "PBKDF2",
  hash: "SHA-256",
  iterations: ITERATION_COUNT,
}

// 加密状态类型
export type EncryptionStatus = "enabled" | "disabled" | "initializing" | "error"

// 加密设置类型
export type EncryptionSettings = {
  enabled: boolean
  autoEncrypt: boolean
  passwordHint?: string
}

// 默认加密设置
export const defaultEncryptionSettings: EncryptionSettings = {
  enabled: false,
  autoEncrypt: true,
  passwordHint: "",
}

/**
 * 生成随机盐值
 */
export function generateSalt(): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH))
}

/**
 * 生成随机初始化向量
 */
export function generateIV(): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(IV_LENGTH))
}

/**
 * 从密码派生加密密钥
 * @param password 用户密码
 * @param salt 盐值
 */
export async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  // 从密码创建密钥材料
  const encoder = new TextEncoder()
  const passwordBuffer = encoder.encode(password)

  // 导入密钥材料
  const keyMaterial = await window.crypto.subtle.importKey("raw", passwordBuffer, { name: "PBKDF2" }, false, [
    "deriveBits",
    "deriveKey",
  ])

  // 派生实际的加密密钥
  return window.crypto.subtle.deriveKey(
    {
      ...KEY_DERIVATION_PARAMS,
      salt: salt as BufferSource,
    },
    keyMaterial,
    { name: ENCRYPTION_ALGORITHM, length: KEY_LENGTH },
    false, // 不可导出
    ["encrypt", "decrypt"],
  )
}

/**
 * 加密数据
 * @param data 要加密的数据
 * @param key 加密密钥
 */
export async function encryptData(data: string, key: CryptoKey): Promise<string> {
  try {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)

    // 生成初始化向量
    const iv = generateIV()

    // 加密数据
    const encryptedBuffer = await (window.crypto.subtle.encrypt as any)(
      {
        name: ENCRYPTION_ALGORITHM,
        iv: iv,
      },
      key,
      dataBuffer,
    )

    // 将IV和加密数据合并为一个数组
    const result = new Uint8Array(iv.length + encryptedBuffer.byteLength)
    result.set(iv, 0)
    result.set(new Uint8Array(encryptedBuffer), iv.length)

    // 转换为Base64字符串
    return btoa(String.fromCharCode(...result))
  } catch (error) {
    console.error("加密失败:", error)
    throw new Error("加密失败")
  }
}

/**
 * 解密数据
 * @param encryptedData 加密的数据
 * @param key 解密密钥
 */
export async function decryptData(encryptedData: string, key: CryptoKey): Promise<string> {
  try {
    // 从Base64转换回二进制
    const encryptedBytes = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0))

    // 提取IV和加密数据
    const iv = encryptedBytes.slice(0, IV_LENGTH)
    const ciphertext = encryptedBytes.slice(IV_LENGTH)

    // 解密数据
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv: iv,
      },
      key,
      ciphertext,
    )

    // 转换为字符串
    const decoder = new TextDecoder()
    return decoder.decode(decryptedBuffer)
  } catch (error) {
    console.error("解密失败:", error)
    throw new Error("解密失败，密码可能不正确")
  }
}

/**
 * 生成密钥包（包含盐和加密的主密钥）
 * @param password 用户密码
 */
export async function generateKeyPackage(
  password: string,
): Promise<{ salt: string; encryptedValidationToken: string }> {
  // 生成盐
  const salt = generateSalt()

  // 派生密钥
  const key = await deriveKey(password, salt)

  // 创建验证令牌（用于验证密码是否正确）
  const validationToken = JSON.stringify({
    timestamp: Date.now(),
    message: "This is a validation token for encryption verification",
  })

  // 加密验证令牌
  const encryptedValidationToken = await encryptData(validationToken, key)

  // 返回密钥包
  return {
    salt: btoa(String.fromCharCode(...salt)),
    encryptedValidationToken,
  }
}

/**
 * 验证密码是否正确
 * @param password 用户密码
 * @param saltBase64 Base64编码的盐
 * @param encryptedValidationToken 加密的验证令牌
 */
export async function verifyPassword(
  password: string,
  saltBase64: string,
  encryptedValidationToken: string,
): Promise<boolean> {
  try {
    // 解码盐
    const salt = Uint8Array.from(atob(saltBase64), (c) => c.charCodeAt(0))

    // 派生密钥
    const key = await deriveKey(password, salt)

    // 尝试解密验证令牌
    await decryptData(encryptedValidationToken, key)

    // 如果解密成功，密码正确
    return true
  } catch (error) {
    // 解密失败，密码错误
    return false
  }
}

/**
 * 获取用户的加密设置
 * @param userId 用户ID
 */
export function getUserEncryptionSettings(userId: string): EncryptionSettings {
  try {
    const settings = localStorage.getItem(`encryption_settings_${userId}`)
    return settings ? JSON.parse(settings) : defaultEncryptionSettings
  } catch (error) {
    console.error("加载加密设置失败:", error)
    return defaultEncryptionSettings
  }
}

/**
 * 保存用户的加密设置
 *
 * 数据层二次校验（P3 固化）：写盘前核对持久会话真源并验证归属，
 * 不信任调用方传入的登录状态；无会话/跨用户写入直接抛错拒绝。
 * @param userId 用户ID
 * @param settings 加密设置
 */
export function saveUserEncryptionSettings(userId: string, settings: EncryptionSettings): void {
  requireSession("encryption_settings", userId)
  localStorage.setItem(`encryption_settings_${userId}`, JSON.stringify(settings))
}

/**
 * 保存用户的密钥包
 *
 * 数据层二次校验（P3 固化）：密钥包为高敏数据，写入口强制会话归属校验。
 * @param userId 用户ID
 * @param keyPackage 密钥包
 */
export function saveKeyPackage(userId: string, keyPackage: { salt: string; encryptedValidationToken: string }): void {
  requireSession("key_package", userId)
  localStorage.setItem(`key_package_${userId}`, JSON.stringify(keyPackage))
}

/**
 * 获取用户的密钥包
 * @param userId 用户ID
 */
export function getKeyPackage(userId: string): { salt: string; encryptedValidationToken: string } | null {
  try {
    const keyPackage = localStorage.getItem(`key_package_${userId}`)
    return keyPackage ? JSON.parse(keyPackage) : null
  } catch (error) {
    console.error("加载密钥包失败:", error)
    return null
  }
}

/**
 * 检查浏览器是否支持所需的加密API
 */
export function isEncryptionSupported(): boolean {
  return (
    window.crypto &&
    window.crypto.subtle &&
    typeof window.crypto.subtle.importKey === "function" &&
    typeof window.crypto.subtle.deriveKey === "function" &&
    typeof window.crypto.subtle.encrypt === "function" &&
    typeof window.crypto.subtle.decrypt === "function"
  )
}

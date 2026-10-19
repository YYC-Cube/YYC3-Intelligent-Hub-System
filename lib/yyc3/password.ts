/**
 * 密码哈希与校验 —— 全项目唯一事实源。
 *
 * 算法：PBKDF2-SHA-256（Web Crypto 原生），100,000 迭代，16 字节随机盐。
 * 存储格式：`pbkdf2$<iterations>$<saltBase64>$<hashBase64>`（自描述，支持未来代价因子演进）。
 *
 * 旧格式兼容（验证通过时返回 upgradedHash，由调用方一次性升级并清除旧字段）：
 *  - legacy-sha256：64 位十六进制（= SHA-256("__yyc3_salt__" + password)，单次快速摘要）
 *  - 明文字段：记录上的 `password` 字段（验收第七章 P1 缺陷，升级后必须删除该字段）
 */

const PBKDF2_PREFIX = "pbkdf2"
const PBKDF2_ITERATIONS = 100_000
const PBKDF2_KEY_BITS = 256
const SALT_BYTES = 16
const HASH_ALGO = "SHA-256"
/** 历史 hashPassword 的静态盐（仅用于旧记录迁移校验） */
const LEGACY_SHA256_SALT = "__yyc3_salt__"

/** 常量时间字符串比较（防时序侧信道的基线卫生） */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

function toBase64(bytes: Uint8Array): string {
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function pbkdf2(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, [
    "deriveBits",
  ])
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: HASH_ALGO, salt: salt as BufferSource, iterations },
    keyMaterial,
    PBKDF2_KEY_BITS,
  )
  return new Uint8Array(bits)
}

/** 旧版单次 SHA-256 摘要（十六进制），仅为迁移校验保留 */
async function legacySha256Hex(password: string): Promise<string> {
  const data = new TextEncoder().encode(`${password}${LEGACY_SHA256_SALT}`)
  const digest = await crypto.subtle.digest(HASH_ALGO, data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

/** 用户凭据存储记录（localStorage "users" 数组项） */
export type PasswordRecord = {
  passwordHash?: string
  /** @deprecated 旧版明文密码字段，登录校验成功后必须立即删除 */
  password?: string
}

export type PasswordVerification = {
  valid: boolean
  /** 旧格式校验通过时给出新哈希，调用方应持久化并清除旧字段 */
  upgradedHash?: string
}

/** 生成 PBKDF2 密码哈希（注册 / 升级时使用） */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES))
  const hash = await pbkdf2(password, salt, PBKDF2_ITERATIONS)
  return `${PBKDF2_PREFIX}$${PBKDF2_ITERATIONS}$${toBase64(salt)}$${toBase64(hash)}`
}

/**
 * 校验密码，自动识别三种历史格式：
 * 1. `pbkdf2$…`（现行）
 * 2. 64 位十六进制（legacy SHA-256）→ 命中后返回 upgradedHash
 * 3. 明文 `password` 字段 → 命中后返回 upgradedHash（调用方须 delete record.password）
 */
export async function verifyPassword(password: string, record: PasswordRecord): Promise<PasswordVerification> {
  const storedHash = record.passwordHash

  if (typeof storedHash === "string" && storedHash.startsWith(`${PBKDF2_PREFIX}$`)) {
    const [, iterationsRaw, saltB64, hashB64] = storedHash.split("$")
    const iterations = Number.parseInt(iterationsRaw, 10)
    if (!Number.isFinite(iterations) || iterations <= 0 || !saltB64 || !hashB64) {
      return { valid: false }
    }
    try {
      const computed = toBase64(await pbkdf2(password, fromBase64(saltB64), iterations))
      return { valid: timingSafeEqual(computed, hashB64) }
    } catch {
      return { valid: false }
    }
  }

  if (typeof storedHash === "string" && /^[0-9a-f]{64}$/i.test(storedHash)) {
    const legacy = await legacySha256Hex(password)
    if (timingSafeEqual(legacy, storedHash.toLowerCase())) {
      return { valid: true, upgradedHash: await hashPassword(password) }
    }
    return { valid: false }
  }

  if (typeof record.password === "string" && record.password.length > 0 && record.password === password) {
    return { valid: true, upgradedHash: await hashPassword(password) }
  }

  return { valid: false }
}

/**
 * 持久化键注册表（唯一事实源）。
 *
 * 背景：此前 20 余处 `localStorage` 读写各自内联键名字符串，
 * 同一业务键在不同文件写法不一致，且无法静态检索「谁在用这个键」。
 *
 * 两条硬约束：
 * 1. **字面值必须与历史实现逐字一致**。本表只做「集中登记」，不改名：
 *    改名等于既有用户数据全部读不到（静默数据丢失），键名统一需另配迁移方案。
 * 2. 所有按用户分片的键必须经过 {@link assertUserId} 校验，
 *    历史上存在 `favorites_${user?.id}` 这类写法，登录态竞态时会写出
 *    `favorites_undefined` 幽灵键，后续读取全部落空。
 *
 * 已发现的键复用缺陷（登记备查，整改属阶段 3，本次不改行为）：
 * - `favorites_encrypted_${userId}`：`app/context/favorites-context.tsx` 既写入数据载荷
 *   （第 163、166 行），又在第 85 行以 `=== "true"` 当布尔标记读取，
 *   同一键承担两种语义；
 * - `cloud_favorites_encrypted_${userId}`：`app/services/cloud-sync.ts` 第 174 行同样以
 *   `=== "true"` 当布尔标记读取，而第 163 行写入的却是数据。
 */

/** 按用户分片的键必须携带合法用户标识，否则拒绝生成键名。 */
export function assertUserId(userId: string | undefined | null, keyBuilder: string): string {
  if (typeof userId !== "string" || userId.trim().length === 0) {
    throw new Error(
      `构建持久化键 "${keyBuilder}" 时缺少合法 userId（实际: ${JSON.stringify(userId)}）；` +
        `这通常意味着在登录态就绪前访问了用户数据`,
    )
  }
  return userId
}

/** 全局键（不按用户分片）。 */
export const staticKeys = {
  /** 当前登录用户对象（`app/context/auth-context.tsx`） */
  currentUser: "user",
  /** 用户表，模拟数据库（`app/context/auth-context.tsx`） */
  users: "users",
  /** 未登录态的收藏集合；**未按用户隔离**，登录后应迁移为分片键 */
  anonymousFavorites: "favorites",
  /** 版本检查设置（`app/context/version-check-context.tsx`） */
  versionCheckSettings: "version_check_settings",
  /** 上次版本检查时间（`app/services/version-check.ts`） */
  versionLastChecked: "version_last_checked",
  /** 版本检查间隔（`app/services/version-check.ts`） */
  versionCheckInterval: "version_check_interval",
  /** 开发者指南页偏好（`app/developer/guide/page.tsx`） */
  userPreferences: "user_preferences",
  /** 助手会话列表（`app/context/assistant-context.tsx`） */
  assistantSessions: "assistant-sessions",
  /** 当前助手会话（`app/context/assistant-context.tsx`） */
  assistantCurrentSession: "assistant-current-session",
  /** 分类记忆（`app/services/category-memory.ts`） */
  categoryMemory: "yanyu-category-memory",
  /** 搜索历史（`app/services/category-memory.ts`） */
  searchHistory: "yanyu-search-history",
} as const

/** 按用户分片的键。 */
export const scopedKeys = {
  /** 用户收藏（`app/context/favorites-context.tsx` 第 171 行） */
  favorites: (userId: string) => `favorites_${assertUserId(userId, "favorites")}`,

  /** 加密收藏；见文件头「键复用缺陷」说明 */
  favoritesEncrypted: (userId: string) =>
    `favorites_encrypted_${assertUserId(userId, "favorites_encrypted")}`,

  /** 云端同步的明文收藏（`app/services/cloud-sync.ts`） */
  cloudFavorites: (userId: string) => `cloud_favorites_${assertUserId(userId, "cloud_favorites")}`,

  /** 云端同步的加密收藏数据（`app/services/cloud-sync.ts` 第 160、178 行） */
  cloudFavoritesEncrypted: (userId: string) =>
    `encrypted_cloud_favorites_${assertUserId(userId, "encrypted_cloud_favorites")}`,

  /** 云端加密收藏的布尔标记；见文件头「键复用缺陷」说明 */
  cloudFavoritesEncryptedFlag: (userId: string) =>
    `cloud_favorites_encrypted_${assertUserId(userId, "cloud_favorites_encrypted")}`,

  /** 用户订阅（`app/context/subscription-context.tsx`） */
  subscriptions: (userId: string) => `subscriptions_${assertUserId(userId, "subscriptions")}`,

  /** 密钥包（`app/services/encryption.ts`、`app/context/encryption-context.tsx`） */
  keyPackage: (userId: string) => `key_package_${assertUserId(userId, "key_package")}`,

  /** 加密设置（`app/services/encryption.ts`） */
  encryptionSettings: (userId: string) =>
    `encryption_settings_${assertUserId(userId, "encryption_settings")}`,

  /** 同步统计（`app/services/cloud-sync.ts`、`app/context/favorites-context.tsx`） */
  syncStats: (userId: string) => `sync_stats_${assertUserId(userId, "sync_stats")}`,

  /** 同步选项（`app/services/cloud-sync.ts`、`app/context/favorites-context.tsx`） */
  syncOptions: (userId: string) => `sync_options_${assertUserId(userId, "sync_options")}`,
} as const

/** 全局键的全部字面值，供批量清理与审计使用。 */
export const staticKeyValues: readonly string[] = Object.values(staticKeys)

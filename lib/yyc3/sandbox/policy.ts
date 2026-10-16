/**
 * 沙箱策略定义。
 *
 * 明确的**能力边界**（不做过度承诺）：
 * 本沙箱提供的隔离手段——
 * 1. 进程隔离：技能代码在独立子进程中执行，崩溃不波及宿主；
 * 2. 无 shell：子进程以 `shell: false` 启动，且**不接受任意命令字符串**，
 *    只接受要被执行的源码，从结构上消除命令注入；
 * 3. 环境净化：只透传白名单环境变量，
 *    避免 `DATABASE_URL` / `API_KEY` 这类凭证随子进程泄漏；
 * 4. 资源限额：执行超时、堆内存上限、输出字节上限；
 * 5. Node 权限模型（可选）：限制文件系统读写的可达范围。
 *
 * 本沙箱**不**提供的保证：网络访问隔离、CPU 时间片配额、
 * 容器级文件系统隔离。`blockedPatterns` 属纵深防御，正则匹配**可被绕过**，
 * 不得作为唯一安全边界依赖。
 */

export interface SandboxPolicy {
  /**
   * 允许启动的可执行文件白名单。
   *
   * 默认只允许当前 Node 可执行文件（`process.execPath`）：
   * 沙箱的用途是执行技能代码，不需要任意二进制。
   */
  allowedExecutables: readonly string[]

  /** 透传给子进程的环境变量名白名单。其余一律剔除。 */
  allowedEnvKeys: readonly string[]

  /** 默认执行超时（毫秒）。 */
  timeoutMs: number

  /** 允许请求方设置的最大超时（毫秒），防止绕开策略设置超长超时。 */
  maxTimeoutMs: number

  /** 单流（stdout / stderr 各自）捕获的最大字节数，超出即截断。 */
  maxOutputBytes: number

  /** 子进程堆内存上限（MB），映射为 `--max-old-space-size`。 */
  maxOldSpaceMb: number

  /**
   * 是否启用 Node 权限模型限制文件系统访问。
   * 仅 Node >= 20 支持；不受支持的版本会自动降级为不启用。
   */
  usePermissionModel: boolean

  /** 源码中被禁止出现的特征（纵深防御）。 */
  blockedPatterns: readonly RegExp[]

  /** 单份源码的最大字节数。 */
  maxCodeBytes: number

  /**
   * 临时脚本目录的父目录。默认使用系统临时目录；
   * 生产环境应指向专用目录以便配额与审计。
   */
  workspaceDir?: string
}

/** 环境变量白名单：仅保留进程正常运行所必需的最小集合，凭证类变量一律不外传。 */
export const DEFAULT_ENV_ALLOWLIST: readonly string[] = [
  "PATH",
  "HOME",
  "LANG",
  "LC_ALL",
  "TZ",
  "TMPDIR",
  "NODE_ENV",
]

/**
 * 默认禁止的源码特征。
 *
 * 这些都是「技能代码不应主动触碰的能力」，命中即拒绝执行。
 * 再次强调：正则可被字符串拼接等方式绕过，这只是第一道提示性防线。
 */
export const DEFAULT_BLOCKED_PATTERNS: readonly RegExp[] = [
  /child_process/,
  /\bexecSync\b/,
  /\bspawnSync\b/,
  /\brm\s+-rf\b/,
  /\bmkfifo\b/,
  /\bprocess\.exit\s*\(\s*0\s*\)\s*;\s*\/\/\s*bypass\b/,
]

/** 默认策略：偏保守，允许执行纯计算型技能代码。 */
export const DEFAULT_SANDBOX_POLICY: SandboxPolicy = {
  allowedExecutables: [process.execPath],
  allowedEnvKeys: DEFAULT_ENV_ALLOWLIST,
  timeoutMs: 5_000,
  maxTimeoutMs: 30_000,
  maxOutputBytes: 64 * 1024,
  maxOldSpaceMb: 128,
  usePermissionModel: true,
  blockedPatterns: DEFAULT_BLOCKED_PATTERNS,
  maxCodeBytes: 64 * 1024,
}

/** 合并用户策略与默认策略；数组类字段为整体覆盖而非追加。 */
export function resolvePolicy(overrides: Partial<SandboxPolicy> = {}): SandboxPolicy {
  const merged: SandboxPolicy = {
    ...DEFAULT_SANDBOX_POLICY,
    ...overrides,
    allowedExecutables: overrides.allowedExecutables ?? DEFAULT_SANDBOX_POLICY.allowedExecutables,
    allowedEnvKeys: overrides.allowedEnvKeys ?? DEFAULT_SANDBOX_POLICY.allowedEnvKeys,
    blockedPatterns: overrides.blockedPatterns ?? DEFAULT_SANDBOX_POLICY.blockedPatterns,
  }

  if (merged.timeoutMs <= 0) {
    throw new Error("沙箱策略 timeoutMs 必须为正数")
  }
  if (merged.maxTimeoutMs < merged.timeoutMs) {
    throw new Error("沙箱策略 maxTimeoutMs 不得小于 timeoutMs")
  }
  if (merged.maxOutputBytes <= 0) {
    throw new Error("沙箱策略 maxOutputBytes 必须为正数")
  }

  return merged
}

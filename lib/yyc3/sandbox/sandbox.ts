/**
 * Skill 沙箱（仅服务端可用）。
 *
 * 执行模型：把技能源码写入临时目录下的 `.mjs` 文件，
 * 以**当前 Node 可执行文件 + `shell: false`** 启动子进程执行，
 * 全程受超时、内存、输出限额约束，结束后清理临时目录。
 *
 * 之所以不接受「命令字符串」而只接受源码：
 * 命令字符串必然经过 shell 解析才能表达管道/重定向，
 * 那正是命令注入的入口。只收源码则从结构上消灭了这一类风险。
 */

import { spawn, type ChildProcess } from "node:child_process"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { randomBytes } from "node:crypto"
import { tmpdir } from "node:os"
import { join, resolve as resolvePath } from "node:path"

import { resolvePolicy, type SandboxPolicy } from "./policy"

export interface SandboxRequest {
  /** 要执行的技能源码（ESM 语法）。 */
  code: string
  /** 覆盖默认超时（仍受策略 maxTimeoutMs 限制）。 */
  timeoutMs?: number
  /** 传给脚本的命令行参数。 */
  args?: readonly string[]
  /** 附加环境变量，仍需通过策略白名单。 */
  env?: Record<string, string>
  /** 诊断标签，会出现在临时目录名中。 */
  label?: string
}

export interface SandboxResult {
  ok: boolean
  exitCode: number | null
  signal: NodeJS.Signals | null
  stdout: string
  stderr: string
  durationMs: number
  /** 是否因超时被强制终止。 */
  timedOut: boolean
  /** 输出是否被截断。 */
  truncated: boolean
  /** 实际使用的解释器路径。 */
  executable: string
}

/** 策略拒绝（未启动子进程）。与「脚本自身执行失败」严格区分。 */
export class SandboxViolationError extends Error {
  readonly reason: string

  constructor(reason: string) {
    super(`沙箱策略拒绝执行：${reason}`)
    this.name = "SandboxViolationError"
    this.reason = reason
  }
}

export class SkillSandbox {
  readonly policy: SandboxPolicy

  constructor(overrides: Partial<SandboxPolicy> = {}) {
    this.policy = resolvePolicy(overrides)
  }

  /**
   * 在沙箱中执行一段技能源码。
   *
   * 策略违规抛 `SandboxViolationError`；
   * 脚本自身非零退出**不抛错**，而是以 `ok: false` 与 `exitCode` 返回，
   * 因为「技能执行失败」是正常业务结果，不应与基础设施故障混同。
   */
  async run(request: SandboxRequest): Promise<SandboxResult> {
    const code = this.validate(request)
    const timeoutMs = this.resolveTimeout(request.timeoutMs)
    const executable = this.policy.allowedExecutables[0]
    if (!executable) {
      throw new SandboxViolationError("策略未配置任何允许的可执行文件")
    }

    const workingDirectory = await mkdtemp(
      join(this.policy.workspaceDir ?? tmpdir(), `yyc3-sandbox-${sanitizeLabel(request.label)}-`),
    )
    const scriptPath = join(workingDirectory, "skill.mjs")
    await writeFile(scriptPath, code, "utf8")

    const startedAt = Date.now()

    try {
      return await this.execute({
        executable,
        scriptPath,
        workingDirectory,
        args: request.args ?? [],
        env: this.buildEnv(request.env),
        timeoutMs,
        startedAt,
      })
    } finally {
      // 无论成功、失败还是超时，都必须清理临时目录，避免磁盘被逐步填满
      await rm(workingDirectory, { recursive: true, force: true }).catch(() => undefined)
    }
  }

  private validate(request: SandboxRequest): string {
    const { code } = request
    if (typeof code !== "string" || code.trim().length === 0) {
      throw new SandboxViolationError("技能源码不能为空")
    }

    const codeBytes = Buffer.byteLength(code, "utf8")
    if (codeBytes > this.policy.maxCodeBytes) {
      throw new SandboxViolationError(
        `技能源码 ${codeBytes} 字节超出上限 ${this.policy.maxCodeBytes} 字节`,
      )
    }

    for (const pattern of this.policy.blockedPatterns) {
      if (pattern.test(code)) {
        throw new SandboxViolationError(`源码命中禁止特征 ${pattern}`)
      }
    }

    return code
  }

  private resolveTimeout(requested: number | undefined): number {
    if (requested === undefined) {
      return this.policy.timeoutMs
    }
    if (requested <= 0) {
      throw new SandboxViolationError("timeoutMs 必须为正数")
    }
    if (requested > this.policy.maxTimeoutMs) {
      throw new SandboxViolationError(
        `请求超时 ${requested}ms 超出策略上限 ${this.policy.maxTimeoutMs}ms`,
      )
    }
    return requested
  }

  /**
   * 构建子进程环境变量。
   *
   * 关键安全点：**不从 `process.env` 整体继承**。
   * 常见的凭证泄漏（数据库连接串、第三方 API Key）
   * 正是通过环境变量整份继承扩散到不受信子进程的。
   */
  private buildEnv(overrides: Record<string, string> | undefined): Record<string, string> {
    const env: Record<string, string> = {}
    const allowlist = new Set(this.policy.allowedEnvKeys)

    for (const key of allowlist) {
      const value = process.env[key]
      if (value !== undefined) {
        env[key] = value
      }
    }

    if (overrides) {
      for (const [key, value] of Object.entries(overrides)) {
        if (!allowlist.has(key)) {
          throw new SandboxViolationError(`环境变量 "${key}" 不在白名单内，拒绝注入`)
        }
        env[key] = value
      }
    }

    // 明确兜底：即便宿主通过 NODE_OPTIONS 注入了预加载脚本，也不向下传递
    delete env.NODE_OPTIONS
    return env
  }

  private async execute(context: {
    executable: string
    scriptPath: string
    workingDirectory: string
    args: readonly string[]
    env: Record<string, string>
    timeoutMs: number
    startedAt: number
  }): Promise<SandboxResult> {
    const flags = this.buildNodeFlags(context.workingDirectory)

    // 显式收敛为通用 ChildProcess：stdio 字面量会命中 @types/node 的
    // 条件返回重载并把返回类型折叠成 never；此处只需要可空的管道流。
    const child = spawn(context.executable, [...flags, context.scriptPath, ...context.args], {
      cwd: context.workingDirectory,
      env: {
        ...context.env,
        // 新版 @types/node 将 ProcessEnv.NODE_ENV 定义为必填，沙箱内缺省视为生产
        NODE_ENV: (context.env.NODE_ENV ?? "production") as NodeJS.ProcessEnv["NODE_ENV"],
      },
      // 禁用 shell：杜绝经由 shell 元字符的命令注入
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    }) as ChildProcess

    let stdout = ""
    let stderr = ""
    let truncated = false
    let timedOut = false
    let settled = false

    const append = (target: "stdout" | "stderr", chunk: string): void => {
      const current = target === "stdout" ? stdout : stderr
      if (current.length >= this.policy.maxOutputBytes) {
        truncated = true
        return
      }
      const next = current + chunk
      if (Buffer.byteLength(next, "utf8") > this.policy.maxOutputBytes) {
        truncated = true
        const sliced = next.slice(0, this.policy.maxOutputBytes)
        if (target === "stdout") {
          stdout = sliced
        } else {
          stderr = sliced
        }
        return
      }
      if (target === "stdout") {
        stdout = next
      } else {
        stderr = next
      }
    }

    child.stdout?.setEncoding("utf8")
    child.stdout?.on("data", (chunk: string) => append("stdout", chunk))
    child.stderr?.setEncoding("utf8")
    child.stderr?.on("data", (chunk: string) => append("stderr", chunk))

    return new Promise<SandboxResult>((resolve, reject) => {
      const timer = setTimeout(() => {
        timedOut = true
        child.kill("SIGKILL")
      }, context.timeoutMs)

      const finish = (result: SandboxResult): void => {
        if (settled) {
          return
        }
        settled = true
        clearTimeout(timer)
        resolve(result)
      }

      child.on("error", (error: Error) => {
        if (settled) {
          return
        }
        settled = true
        clearTimeout(timer)
        reject(new Error(`沙箱子进程启动失败（${context.executable}）：${error.message}`))
      })

      child.on("close", (exitCode: number | null, signal: NodeJS.Signals | null) => {
        finish({
          ok: exitCode === 0 && !timedOut,
          exitCode,
          signal,
          stdout,
          stderr,
          durationMs: Date.now() - context.startedAt,
          timedOut,
          truncated,
          executable: context.executable,
        })
      })
    })
  }

  /**
   * 组装 Node 启动参数。
   *
   * 权限模型（`--permission`）在 Node >= 22 可用、Node 20 为 `--experimental-permission`；
   * 不被支持时自动跳过，避免因参数名不匹配导致子进程直接启动失败。
   * 启用后仅开放临时脚本目录的读权限，技能代码无法读取仓库源码或用户主目录。
   */
  private buildNodeFlags(workingDirectory: string): string[] {
    const flags = [`--max-old-space-size=${this.policy.maxOldSpaceMb}`]

    if (!this.policy.usePermissionModel) {
      return flags
    }

    const major = Number.parseInt(process.versions.node.split(".")[0] ?? "0", 10)
    if (!Number.isFinite(major) || major < 20) {
      return flags
    }

    const permissionFlag = major >= 22 ? "--permission" : "--experimental-permission"
    // 只读开放脚本目录：技能代码需能读取自身模块，但不应触达宿主其他路径
    flags.push(permissionFlag, `--allow-fs-read=${resolvePath(workingDirectory)}`)
    return flags
  }
}

function sanitizeLabel(label: string | undefined): string {
  if (!label) {
    return randomBytes(4).toString("hex")
  }
  const safe = label.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 24)
  return safe.length > 0 ? safe : randomBytes(4).toString("hex")
}

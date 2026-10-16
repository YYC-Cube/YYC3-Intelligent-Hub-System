/**
 * MCP 传输层（仅服务端可用；`StdioTransport` 依赖 `node:child_process`）。
 *
 * 分帧约定：MCP 的 stdio 传输使用**换行分隔的 JSON**，
 * 即每条消息序列化为单行 JSON 后以 `\n` 结尾。
 * 该约定使任意一侧都可以在流式读取时按行切分，
 * 而 `\r\n\r\n` 之类的分隔符会破坏与其他实现的互操作。
 */

import { spawn, type ChildProcess } from "node:child_process"

import { isJsonRpcMessage, type JsonRpcMessage } from "./types"

/** 传输层抽象，便于用内存实现替换真实进程做测试。 */
export interface McpTransport {
  readonly connected: boolean
  connect(): Promise<void>
  send(message: JsonRpcMessage): Promise<void>
  close(): Promise<void>
  onMessage(handler: (message: JsonRpcMessage) => void): void
  onError(handler: (error: Error) => void): void
  onClose(handler: () => void): void
}

/** 消息处理器集合，供各传输实现复用。 */
export class TransportHandlers {
  private readonly messageHandlers: Array<(message: JsonRpcMessage) => void> = []

  private readonly errorHandlers: Array<(error: Error) => void> = []

  private readonly closeHandlers: Array<() => void> = []

  onMessage(handler: (message: JsonRpcMessage) => void): void {
    this.messageHandlers.push(handler)
  }

  onError(handler: (error: Error) => void): void {
    this.errorHandlers.push(handler)
  }

  onClose(handler: () => void): void {
    this.closeHandlers.push(handler)
  }

  emitMessage(message: JsonRpcMessage): void {
    for (const handler of this.messageHandlers) {
      handler(message)
    }
  }

  emitError(error: Error): void {
    for (const handler of this.errorHandlers) {
      handler(error)
    }
  }

  emitClose(): void {
    for (const handler of this.closeHandlers) {
      handler()
    }
  }
}

/**
 * 按行切分流式数据。
 *
 * 关键点：网络/管道分块与消息边界无关，一次 `data` 事件可能
 * 包含半条消息或三条半消息，因此必须缓存残片直到遇到换行符。
 * 忽略无法解析为 JSON-RPC 的行（服务端可能把日志误写到 stdout）。
 */
export function createLineFramer(onMessage: (message: JsonRpcMessage) => void): {
  push: (chunk: string) => void
  reset: () => void
} {
  let buffer = ""

  return {
    push(chunk: string): void {
      buffer += chunk

      let newlineIndex = buffer.indexOf("\n")
      while (newlineIndex !== -1) {
        const line = buffer.slice(0, newlineIndex).trim()
        buffer = buffer.slice(newlineIndex + 1)

        if (line.length > 0) {
          try {
            const parsed: unknown = JSON.parse(line)
            if (isJsonRpcMessage(parsed)) {
              onMessage(parsed)
            }
          } catch {
            // 非 JSON 行按噪声丢弃：MCP 服务端可能存在非协议输出
          }
        }

        newlineIndex = buffer.indexOf("\n")
      }
    },
    reset(): void {
      buffer = ""
    },
  }
}

export interface StdioTransportOptions {
  command: string
  args?: string[]
  env?: Record<string, string>
  cwd?: string
  /** 关闭时等待子进程自行退出的宽限时间（毫秒），超时后强制 kill。 */
  shutdownGraceMs?: number
}

/** 基于子进程 stdio 的 MCP 传输。 */
export class StdioTransport implements McpTransport {
  private readonly options: StdioTransportOptions

  private readonly handlers = new TransportHandlers()

  private readonly framer = createLineFramer((message) => this.handlers.emitMessage(message))

  private child: ChildProcess | null = null

  private closed = false

  private stderrBuffer = ""

  constructor(options: StdioTransportOptions) {
    if (!options.command?.trim()) {
      throw new Error("StdioTransport 需要非空的 command")
    }
    this.options = options
  }

  get connected(): boolean {
    return this.child !== null && !this.closed
  }

  /** 子进程 stderr 的环形缓冲（保留最近 8KB），用于诊断启动失败。 */
  get stderr(): string {
    return this.stderrBuffer
  }

  async connect(): Promise<void> {
    if (typeof window !== "undefined") {
      throw new Error("StdioTransport 仅可在 Node.js 环境使用")
    }
    if (this.child !== null) {
      return
    }

    const child = spawn(this.options.command, this.options.args ?? [], {
      cwd: this.options.cwd,
      env: { ...process.env, ...this.options.env },
      stdio: ["pipe", "pipe", "pipe"],
    })
    this.child = child

    child.stdout?.setEncoding("utf8")
    child.stdout?.on("data", (chunk: string) => this.framer.push(chunk))

    child.stderr?.setEncoding("utf8")
    child.stderr?.on("data", (chunk: string) => {
      this.stderrBuffer = `${this.stderrBuffer}${chunk}`.slice(-8192)
    })

    child.on("error", (error: Error) => this.handlers.emitError(error))
    child.on("exit", () => {
      this.closed = true
      this.child = null
      this.framer.reset()
      this.handlers.emitClose()
    })

    await new Promise<void>((resolve, reject) => {
      child.once("spawn", () => resolve())
      child.once("error", (error: Error) => reject(error))
    })
  }

  async send(message: JsonRpcMessage): Promise<void> {
    const child = this.child
    const stdin = child?.stdin
    if (!child || !stdin || this.closed) {
      throw new Error("StdioTransport 未连接，无法发送消息")
    }

    const line = `${JSON.stringify(message)}\n`

    await new Promise<void>((resolve, reject) => {
      // 处理背压：write 返回 false 时必须等待 drain，否则大消息会被截断
      stdin.write(line, (error) => {
        if (error) {
          reject(error)
        }
      })
      if (stdin.writableNeedDrain) {
        stdin.once("drain", () => resolve())
      } else {
        resolve()
      }
    })
  }

  async close(): Promise<void> {
    const child = this.child
    if (!child || this.closed) {
      this.closed = true
      return
    }

    const grace = this.options.shutdownGraceMs ?? 2000

    await new Promise<void>((resolve) => {
      const timer = setTimeout(() => {
        child.kill("SIGKILL")
        resolve()
      }, grace)

      child.once("exit", () => {
        clearTimeout(timer)
        resolve()
      })

      // 先关闭 stdin 让对端有机会优雅退出
      child.stdin?.end()
      child.kill("SIGTERM")
    })

    this.child = null
    this.closed = true
  }

  onMessage(handler: (message: JsonRpcMessage) => void): void {
    this.handlers.onMessage(handler)
  }

  onError(handler: (error: Error) => void): void {
    this.handlers.onError(handler)
  }

  onClose(handler: () => void): void {
    this.handlers.onClose(handler)
  }
}

/**
 * 回环传输：把请求交给进程内处理函数，用于单元测试与嵌入式工具提供方。
 *
 * 不涉及任何进程与网络，因此可在 jsdom 测试环境中直接使用。
 */
export class LoopbackTransport implements McpTransport {
  private readonly handler: (message: JsonRpcMessage) => JsonRpcMessage | undefined

  private readonly handlers = new TransportHandlers()

  private opened = false

  constructor(handler: (message: JsonRpcMessage) => JsonRpcMessage | undefined) {
    this.handler = handler
  }

  get connected(): boolean {
    return this.opened
  }

  async connect(): Promise<void> {
    this.opened = true
  }

  async send(message: JsonRpcMessage): Promise<void> {
    if (!this.opened) {
      throw new Error("LoopbackTransport 未连接")
    }

    const reply = this.handler(message)
    if (reply !== undefined) {
      // 异步派发，模拟真实传输的时序，避免调用方依赖同步返回
      queueMicrotask(() => this.handlers.emitMessage(reply))
    }
  }

  async close(): Promise<void> {
    this.opened = false
    this.handlers.emitClose()
  }

  onMessage(handler: (message: JsonRpcMessage) => void): void {
    this.handlers.onMessage(handler)
  }

  onError(handler: (error: Error) => void): void {
    this.handlers.onError(handler)
  }

  onClose(handler: () => void): void {
    this.handlers.onClose(handler)
  }
}

/**
 * MCP 客户端（自研实现，零外部依赖）。
 *
 * 职责：在 {@link McpTransport} 之上实现请求-响应配对、请求超时、
 * 服务端通知分发与握手流程，使调用方只看到 `listTools()` / `callTool()` 这类语义方法。
 *
 * 关键设计：
 * - **请求超时**：JSON-RPC 本身无超时语义，若不设超时，
 *   对端挂起会导致调用方的 promise 永久 pending（在服务端进程里就是内存泄漏）；
 * - **待决请求清理**：连接关闭时必须 reject 所有待决请求，否则同样永久 pending；
 * - **未知通知忽略**：协议允许对端发送本端未实现的通知，不应视为错误。
 */

import type { McpTransport } from "./transport"
import {
  JsonRpcErrorCode,
  MCP_PROTOCOL_VERSION,
  isJsonRpcResponse,
  type JsonRpcMessage,
  type JsonRpcResponse,
  type McpInitializeResult,
  type McpResource,
  type McpTool,
  type McpToolResult,
} from "./types"

export interface McpClientOptions {
  /** 客户端名称，随握手上报给服务端。 */
  name: string
  /** 客户端版本。 */
  version: string
  transport: McpTransport
  /** 单次请求超时（毫秒），默认 30 秒。 */
  requestTimeoutMs?: number
}

/** 事件载荷契约。所有事件都携带一个参数，空事件以 `undefined` 占位以统一签名。 */
export interface McpClientEventMap {
  connected: (info: McpInitializeResult) => void
  disconnected: (reason?: string) => void
  error: (error: Error) => void
  toolsChanged: (tools: McpTool[]) => void
}

export type McpClientEvent = keyof McpClientEventMap

interface PendingRequest {
  method: string
  resolve: (result: unknown) => void
  reject: (error: Error) => void
  timer: ReturnType<typeof setTimeout>
}

/** 带 JSON-RPC 错误码的异常，便于上层区分「临时失败」与「方法不存在」。 */
export class McpClientError extends Error {
  readonly code: number

  readonly data?: unknown

  constructor(message: string, code: number, data?: unknown) {
    super(message)
    this.name = "McpClientError"
    this.code = code
    this.data = data
  }
}

export class McpClient {
  private readonly options: McpClientOptions

  private readonly transport: McpTransport

  private readonly requestTimeoutMs: number

  private readonly pending = new Map<number | string, PendingRequest>()

  private readonly listeners: {
    [K in McpClientEvent]: Set<McpClientEventMap[K]>
  } = {
    connected: new Set(),
    disconnected: new Set(),
    error: new Set(),
    toolsChanged: new Set(),
  }

  private messageId = 0

  private toolList: McpTool[] = []

  private resourceList: McpResource[] = []

  private initializeResult: McpInitializeResult | undefined

  private closed = false

  constructor(options: McpClientOptions) {
    this.options = options
    this.transport = options.transport
    this.requestTimeoutMs = options.requestTimeoutMs ?? 30_000

    this.transport.onMessage((message) => this.handleMessage(message))
    this.transport.onError((error) => this.emit("error", error))
    this.transport.onClose(() => this.handleTransportClose("transport closed"))
  }

  get connected(): boolean {
    return this.transport.connected && !this.closed
  }

  /** 最近一次 `tools/list` 的结果。 */
  get tools(): readonly McpTool[] {
    return this.toolList
  }

  /** 最近一次 `resources/list` 的结果。 */
  get resources(): readonly McpResource[] {
    return this.resourceList
  }

  /** 握手结果，未握手时为 undefined。 */
  get server(): McpInitializeResult | undefined {
    return this.initializeResult
  }

  on<K extends McpClientEvent>(event: K, handler: McpClientEventMap[K]): void {
    this.listeners[event].add(handler)
  }

  off<K extends McpClientEvent>(event: K, handler: McpClientEventMap[K]): void {
    this.listeners[event].delete(handler)
  }

  /**
   * 建立连接并完成 MCP 握手。
   *
   * 握手后按对端声明的能力（capabilities）决定是否预取工具与资源列表，
   * 避免对不支持的工具清单做无谓请求。
   */
  async connect(): Promise<McpInitializeResult> {
    await this.transport.connect()

    const result = (await this.request("initialize", {
      protocolVersion: MCP_PROTOCOL_VERSION,
      capabilities: { tools: true, resources: true },
      clientInfo: { name: this.options.name, version: this.options.version },
    })) as McpInitializeResult

    this.initializeResult = result

    // 按协议要求，握手后需回一条 initialized 通知（通知无 id，不应答）
    await this.notify("notifications/initialized", {})

    if (result?.capabilities?.tools) {
      await this.refreshTools()
    }
    if (result?.capabilities?.resources) {
      await this.refreshResources()
    }

    this.emit("connected", result ?? {})
    return result ?? {}
  }

  async refreshTools(): Promise<McpTool[]> {
    const result = (await this.request("tools/list", {})) as { tools?: McpTool[] }
    this.toolList = Array.isArray(result?.tools) ? result.tools : []
    this.emit("toolsChanged", this.toolList)
    return this.toolList
  }

  async refreshResources(): Promise<McpResource[]> {
    const result = (await this.request("resources/list", {})) as { resources?: McpResource[] }
    this.resourceList = Array.isArray(result?.resources) ? result.resources : []
    return this.resourceList
  }

  /** 调用远端工具。`isError` 为真的结果不会抛错，由调用方判断。 */
  async callTool(name: string, args: Record<string, unknown> = {}): Promise<McpToolResult> {
    if (!name?.trim()) {
      throw new McpClientError("callTool 需要非空的工具名", JsonRpcErrorCode.InvalidParams)
    }
    const result = (await this.request("tools/call", {
      name,
      arguments: args,
    })) as McpToolResult
    return result ?? {}
  }

  /** 关闭连接；幂等。所有待决请求会被 reject。 */
  async close(): Promise<void> {
    if (this.closed) {
      return
    }
    this.closed = true
    this.rejectAllPending(new McpClientError("客户端已关闭", JsonRpcErrorCode.InternalError))
    await this.transport.close()
  }

  /** 发送单次请求并等待应答，超时或收到错误响应时抛错。 */
  private async request(method: string, params: unknown): Promise<unknown> {
    if (this.closed) {
      throw new McpClientError(`客户端已关闭，无法发起请求 ${method}`, JsonRpcErrorCode.InternalError)
    }

    this.messageId += 1
    const id = this.messageId

    return new Promise<unknown>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id)
        reject(
          new McpClientError(
            `MCP 请求超时（${this.requestTimeoutMs}ms）: ${method}`,
            JsonRpcErrorCode.RequestTimeout,
          ),
        )
      }, this.requestTimeoutMs)

      this.pending.set(id, { method, resolve, reject, timer })

      this.transport.send({ jsonrpc: "2.0", id, method, params }).catch((error: unknown) => {
        const pending = this.pending.get(id)
        if (pending) {
          clearTimeout(pending.timer)
          this.pending.delete(id)
        }
        reject(error instanceof Error ? error : new Error(String(error)))
      })
    })
  }

  /** 发送通知（无 id、不应答）。 */
  private async notify(method: string, params: unknown): Promise<void> {
    await this.transport.send({ jsonrpc: "2.0", method, params })
  }

  private handleMessage(message: JsonRpcMessage): void {
    if (isJsonRpcResponse(message)) {
      this.settleResponse(message)
      return
    }

    // 服务端主动通知：仅处理已知方法，其余按协议忽略
    if ("method" in message && typeof message.method === "string") {
      switch (message.method) {
        case "notifications/tools/list_changed":
          this.refreshTools().catch((error: unknown) => this.emit("error", toError(error)))
          break
        case "notifications/resources/list_changed":
          this.refreshResources().catch((error: unknown) => this.emit("error", toError(error)))
          break
        default:
          break
      }
    }
  }

  private settleResponse(response: JsonRpcResponse): void {
    const pending = this.pending.get(response.id as number | string)
    if (!pending) {
      // 迟到的响应（已超时或已关闭）：无可结算对象，按协议忽略
      return
    }
    this.pending.delete(response.id as number | string)
    clearTimeout(pending.timer)

    if ("error" in response) {
      pending.reject(
        new McpClientError(
          `MCP 调用失败 [${response.error.code}] ${response.error.message}`,
          response.error.code,
          response.error.data,
        ),
      )
      return
    }

    pending.resolve(response.result)
  }

  private handleTransportClose(reason: string): void {
    this.rejectAllPending(new McpClientError(`连接已关闭: ${reason}`, JsonRpcErrorCode.InternalError))
    if (!this.closed) {
      this.emit("disconnected", reason)
    }
  }

  private rejectAllPending(error: Error): void {
    for (const [id, pending] of this.pending) {
      clearTimeout(pending.timer)
      pending.reject(error)
      this.pending.delete(id)
    }
  }

  private emit<K extends McpClientEvent>(
    event: K,
    payload: Parameters<McpClientEventMap[K]>[0],
  ): void {
    // 泛型索引下的「联合处理器」无法与载荷建立静态相关性（TS 会把参数收敛成交集），
    // 按单一事件视图分发——运行时本就逐事件触发，收窄是安全的。
    const handlers = this.listeners[event] as unknown as Array<
      (payload: Parameters<McpClientEventMap[K]>[0]) => void
    >
    for (const handler of handlers) {
      handler(payload)
    }
  }
}

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value))
}

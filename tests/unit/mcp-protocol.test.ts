/**
 * MCP 协议全维度对抗测试（阶段 2：非法指令 / 畸形报文 / 生命周期边界）。
 *
 * 覆盖面（此前零覆盖的高危盲区）：
 * - types.ts 纯函数守卫：isJsonRpcMessage / isJsonRpcResponse / isJsonRpcNotification
 *   对原始值、错误版本、畸形结构的对抗；
 * - transport.ts createLineFramer：分块切分（半条消息 / 多条合一）、
 *   日志噪声行、空行、reset 语义；
 * - client.ts McpClient 全生命周期：握手与能力预取、请求-响应配对、
 *   错误响应码透传、超时与迟到响应、未知通知、断连清算、close 幂等。
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { McpClient, McpClientError } from "@/lib/yyc3/mcp/client"
import { createLineFramer, LoopbackTransport, StdioTransport, type McpTransport } from "@/lib/yyc3/mcp/transport"
import {
  isJsonRpcMessage,
  isJsonRpcNotification,
  isJsonRpcResponse,
  JsonRpcErrorCode,
  MCP_PROTOCOL_VERSION,
  type JsonRpcMessage,
} from "@/lib/yyc3/mcp/types"

// ---------- 测试用传输层：回环应答 + 手动注入（超时/断连场景需要） ----------

type ReplyFn = (message: JsonRpcMessage) => JsonRpcMessage | undefined

class MockTransport implements McpTransport {
  connected = false

  sent: JsonRpcMessage[] = []

  replyFn: ReplyFn | undefined

  private messageHandlers: Array<(message: JsonRpcMessage) => void> = []

  private errorHandlers: Array<(error: Error) => void> = []

  private closeHandlers: Array<() => void> = []

  private sendShouldFail = false

  failNextSend(): void {
    this.sendShouldFail = true
  }

  async connect(): Promise<void> {
    this.connected = true
  }

  async send(message: JsonRpcMessage): Promise<void> {
    if (this.sendShouldFail) {
      this.sendShouldFail = false
      throw new Error("模拟管道破裂")
    }
    this.sent.push(message)
    const reply = this.replyFn?.(message)
    if (reply) {
      queueMicrotask(() => this.dispatchMessage(reply))
    }
  }

  async close(): Promise<void> {
    this.connected = false
    for (const handler of this.closeHandlers) {
      handler()
    }
  }

  dispatchMessage(message: JsonRpcMessage): void {
    for (const handler of this.messageHandlers) {
      handler(message)
    }
  }

  dispatchClose(): void {
    // 模拟真实传输层断开语义：先置离线，再通知 close 处理器
    this.connected = false
    for (const handler of this.closeHandlers) {
      handler()
    }
  }

  dispatchError(error: Error): void {
    for (const handler of this.errorHandlers) {
      handler(error)
    }
  }

  onMessage(handler: (message: JsonRpcMessage) => void): void {
    this.messageHandlers.push(handler)
  }

  onError(handler: (error: Error) => void): void {
    this.errorHandlers.push(handler)
  }

  onClose(handler: () => void): void {
    this.closeHandlers.push(handler)
  }
}

/** 标准服务端应答器：initialize / tools/list / resources/list / tools/call。 */
function createServerReplyFn(options?: { capabilities?: Record<string, unknown> }): ReplyFn {
  let toolsListCalls = 0
  return (message) => {
    if (!("method" in message) || typeof message.method !== "string") {
      return undefined
    }
    const id = (message as { id: number | string }).id
    switch (message.method) {
      case "initialize":
        return {
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: MCP_PROTOCOL_VERSION,
            capabilities: options?.capabilities ?? { tools: {}, resources: {} },
            serverInfo: { name: "mock-server", version: "1.0.0" },
          },
        }
      case "tools/list": {
        toolsListCalls += 1
        const tools =
          toolsListCalls === 1
            ? [{ name: "echo", description: "回声工具" }]
            : [{ name: "echo-v2", description: "升级后的回声" }]
        return { jsonrpc: "2.0", id, result: { tools } }
      }
      case "resources/list":
        return { jsonrpc: "2.0", id, result: { resources: [{ uri: "mem://demo" }] } }
      case "tools/call": {
        const params = (message as { params?: { name?: string } }).params
        if (params?.name === "boom") {
          return { jsonrpc: "2.0", id, error: { code: -32601, message: "工具不存在", data: { name: params.name } } }
        }
        return { jsonrpc: "2.0", id, result: { content: [{ type: "text", text: "ok" }], isError: false } }
      }
      default:
        return undefined
    }
  }
}

function createConnectedClient(replyFn?: ReplyFn, requestTimeoutMs?: number) {
  const transport = new MockTransport()
  transport.replyFn = replyFn ?? createServerReplyFn()
  const client = new McpClient({
    name: "test-client",
    version: "0.0.1",
    transport,
    ...(requestTimeoutMs === undefined ? {} : { requestTimeoutMs }),
  })
  return { transport, client }
}

// ---------- 1. types.ts 类型守卫对抗 ----------

describe("阶段 2 · MCP 类型守卫（isJsonRpc*）", () => {
  it("TC-U-050 原始值与容器类型全部拒绝", () => {
    for (const bad of [null, undefined, 42, "msg", true, [], [{ jsonrpc: "2.0", method: "m" }]]) {
      expect(isJsonRpcMessage(bad), `应拒绝: ${JSON.stringify(bad)}`).toBe(false)
      expect(isJsonRpcResponse(bad)).toBe(false)
    }
  })

  it("TC-U-051 错误协议版本与空对象拒绝", () => {
    expect(isJsonRpcMessage({ jsonrpc: "1.0", method: "m" })).toBe(false)
    expect(isJsonRpcMessage({ jsonrpc: 2.0, method: "m" })).toBe(false)
    expect(isJsonRpcMessage({})).toBe(false)
    expect(isJsonRpcMessage({ method: "m" })).toBe(false)
  })

  it("TC-U-052 请求 / 通知 / 响应三形态精确区分", () => {
    const notification = { jsonrpc: "2.0", method: "notifications/x" }
    const request = { jsonrpc: "2.0", id: 1, method: "tools/list" }
    const success = { jsonrpc: "2.0", id: 1, result: {} }
    const failure = { jsonrpc: "2.0", id: "abc", error: { code: -32601, message: "x" } }

    expect(isJsonRpcNotification(notification)).toBe(true)
    expect(isJsonRpcResponse(notification)).toBe(false)

    expect(isJsonRpcMessage(request)).toBe(true)
    expect(isJsonRpcNotification(request)).toBe(false)
    expect(isJsonRpcResponse(request)).toBe(false)

    expect(isJsonRpcResponse(success)).toBe(true)
    expect(isJsonRpcResponse(failure)).toBe(true)
    expect(isJsonRpcNotification(success)).toBe(false)
  })

  it("TC-U-053 错误响应允许 id:null（JSON-RPC 约定）", () => {
    expect(isJsonRpcResponse({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "parse" } })).toBe(true)
  })

  it("TC-U-054 标准错误码快照（协议基线锁定）", () => {
    expect(JsonRpcErrorCode.ParseError).toBe(-32700)
    expect(JsonRpcErrorCode.InvalidRequest).toBe(-32600)
    expect(JsonRpcErrorCode.MethodNotFound).toBe(-32601)
    expect(JsonRpcErrorCode.InvalidParams).toBe(-32602)
    expect(JsonRpcErrorCode.InternalError).toBe(-32603)
    expect(JsonRpcErrorCode.RequestTimeout).toBe(-32001)
  })
})

// ---------- 2. createLineFramer 分块对抗 ----------

describe("阶段 2 · MCP 行分帧器（createLineFramer）", () => {
  const valid = JSON.stringify({ jsonrpc: "2.0", id: 1, result: { ok: true } })

  it("TC-U-055 单 chunk 单消息完整投递", () => {
    const received: JsonRpcMessage[] = []
    const framer = createLineFramer((m) => received.push(m))
    framer.push(`${valid}\n`)
    expect(received).toHaveLength(1)
    expect(received[0]).toMatchObject({ id: 1 })
  })

  it("TC-U-056 消息跨 chunk 拆分后残片缓存重组", () => {
    const received: JsonRpcMessage[] = []
    const framer = createLineFramer((m) => received.push(m))
    framer.push(valid.slice(0, 10))
    framer.push(valid.slice(10))
    framer.push("\n")
    expect(received).toHaveLength(1)
  })

  it("TC-U-057 单 chunk 多条消息逐条投递", () => {
    const received: JsonRpcMessage[] = []
    const framer = createLineFramer((m) => received.push(m))
    framer.push(`${valid}\n${valid}\n${valid}\n`)
    expect(received).toHaveLength(3)
  })

  it("TC-U-058 日志噪声行（非 JSON / 非 JSON-RPC 结构）静默丢弃", () => {
    const received: JsonRpcMessage[] = []
    const framer = createLineFramer((m) => received.push(m))
    framer.push(`[INFO] server starting\nnot json at all\n{"hello":1}\n[]\n${valid}\n`)
    expect(received).toHaveLength(1)
  })

  it("TC-U-059 空行与 \\r\\n 结尾容忍", () => {
    const received: JsonRpcMessage[] = []
    const framer = createLineFramer((m) => received.push(m))
    framer.push(`\n\r\n  ${valid}  \r\n`)
    expect(received).toHaveLength(1)
  })

  it("TC-U-060 reset 丢弃残片缓冲（子进程退出后重连场景）", () => {
    const received: JsonRpcMessage[] = []
    const framer = createLineFramer((m) => received.push(m))
    framer.push(valid.slice(0, 8))
    framer.reset()
    framer.push(`${valid}\n`)
    expect(received).toHaveLength(1)
  })
})

// ---------- 3. McpClient 生命周期对抗 ----------

describe("阶段 2 · MCP 客户端生命周期（McpClient）", () => {
  it("TC-U-061 握手成功并按能力预取工具与资源", async () => {
    const { transport, client } = createConnectedClient()
    const info = await client.connect()

    expect(info.serverInfo).toEqual({ name: "mock-server", version: "1.0.0" })
    expect(client.connected).toBe(true)
    expect(client.tools).toHaveLength(1)
    expect(client.resources).toHaveLength(1)
    // 消息序列：initialize → initialized 通知 → tools/list → resources/list
    expect(transport.sent.map((m) => ("method" in m ? m.method : ""))).toEqual([
      "initialize",
      "notifications/initialized",
      "tools/list",
      "resources/list",
    ])
  })

  it("TC-U-062 对端未声明能力时不做无谓预取", async () => {
    const { transport, client } = createConnectedClient(createServerReplyFn({ capabilities: {} }))
    await client.connect()

    expect(client.tools).toEqual([])
    expect(transport.sent.map((m) => ("method" in m ? m.method : ""))).toEqual([
      "initialize",
      "notifications/initialized",
    ])
  })

  it("TC-U-063 callTool 结果透传且 isError 不抛错", async () => {
    const { client } = createConnectedClient()
    await client.connect()

    const result = await client.callTool("echo", { text: "hi" })
    expect(result.content?.[0]?.text).toBe("ok")
    expect(result.isError).toBe(false)
  })

  it("TC-U-064 服务端错误响应透传错误码（MethodNotFound）", async () => {
    const { client } = createConnectedClient()
    await client.connect()

    const promise = client.callTool("boom")
    await expect(promise).rejects.toMatchObject({
      name: "McpClientError",
      code: JsonRpcErrorCode.MethodNotFound,
      data: { name: "boom" },
    })
    await expect(promise).rejects.toBeInstanceOf(McpClientError)
  })

  it("TC-U-065 callTool 空白工具名本地拦截（InvalidParams，不出网）", async () => {
    const { transport, client } = createConnectedClient()
    await client.connect()
    const sentBefore = transport.sent.length

    await expect(client.callTool("")).rejects.toMatchObject({ code: JsonRpcErrorCode.InvalidParams })
    await expect(client.callTool("   ")).rejects.toMatchObject({ code: JsonRpcErrorCode.InvalidParams })
    expect(transport.sent.length).toBe(sentBefore)
  })

  it("TC-U-066 请求超时抛 RequestTimeout，迟到响应被忽略不崩溃", async () => {
    vi.useFakeTimers()
    try {
      // tools/call 悬挂（模拟服务端不回包），握手与清单流程照常应答
      const base = createServerReplyFn()
      const { transport, client } = createConnectedClient((message) => {
        if ("method" in message && message.method === "tools/call") {
          return undefined
        }
        return base(message)
      }, 50)
      await client.connect()

      const promise = client.callTool("echo") // 服务端悬挂 → 只能靠超时清算
      const assertion = expect(promise).rejects.toMatchObject({ code: JsonRpcErrorCode.RequestTimeout })
      await vi.advanceTimersByTimeAsync(80)
      await assertion

      // 迟到响应：pending 已清算，settleResponse 无可结算对象，按协议静默忽略
      const callSent = transport.sent.filter((m) => "method" in m && m.method === "tools/call")
      const lateId = (callSent[callSent.length - 1] as { id: number }).id
      const errors: Error[] = []
      client.on("error", (error) => errors.push(error))
      transport.dispatchMessage({ jsonrpc: "2.0", id: lateId, result: { content: [] } })

      expect(errors).toEqual([])
      expect(client.connected).toBe(true)
    } finally {
      vi.useRealTimers()
    }
  })

  it("TC-U-067 未知服务端通知按协议忽略", async () => {
    const { transport, client } = createConnectedClient()
    await client.connect()

    const errors: Error[] = []
    client.on("error", (error) => errors.push(error))
    transport.dispatchMessage({ jsonrpc: "2.0", method: "notifications/some_unknown" })

    expect(errors).toEqual([])
    expect(client.connected).toBe(true)
  })

  it("TC-U-068 tools/list_changed 通知触发工具刷新与事件", async () => {
    const { transport, client } = createConnectedClient()
    await client.connect()
    expect(client.tools[0]?.name).toBe("echo")

    const changed: unknown[][] = []
    client.on("toolsChanged", (tools) => changed.push(tools))
    transport.dispatchMessage({ jsonrpc: "2.0", method: "notifications/tools/list_changed" })
    await vi.waitFor(() => expect(changed).toHaveLength(1))

    expect(client.tools[0]?.name).toBe("echo-v2")
  })

  it("TC-U-069 close 清算全部待决请求且幂等", async () => {
    vi.useFakeTimers()
    try {
      const { client } = createConnectedClient(undefined, 10_000)
      await client.connect()

      const hanging = client.callTool("echo")
      const assertion = expect(hanging).rejects.toThrow("客户端已关闭")
      await client.close()
      await assertion
      await expect(client.close()).resolves.toBeUndefined() // 幂等
    } finally {
      vi.useRealTimers()
    }
  })

  it("TC-U-070 传输层意外断开：待决请求清算 + disconnected 事件", async () => {
    vi.useFakeTimers()
    try {
      const { transport, client } = createConnectedClient(undefined, 10_000)
      await client.connect()

      const disconnected: (string | undefined)[] = []
      client.on("disconnected", (reason) => disconnected.push(reason))

      const hanging = client.callTool("echo")
      const assertion = expect(hanging).rejects.toThrow("连接已关闭")
      transport.dispatchClose()
      await assertion

      expect(disconnected).toEqual(["transport closed"])
      expect(client.connected).toBe(false)
    } finally {
      vi.useRealTimers()
    }
  })

  it("TC-U-071 传输发送失败时请求立即失败", async () => {
    const { transport, client } = createConnectedClient()
    await client.connect()
    transport.failNextSend()

    await expect(client.callTool("echo")).rejects.toThrow("模拟管道破裂")
  })

  it("TC-U-072 close 后再发起请求本地拒绝（InternalError）", async () => {
    const { client } = createConnectedClient()
    await client.close()

    await expect(client.callTool("echo")).rejects.toMatchObject({ code: JsonRpcErrorCode.InternalError })
  })

  it("TC-U-073 LoopbackTransport 未连接时 send 拒绝、close 触发 onClose", async () => {
    const loopback = new LoopbackTransport(() => undefined)
    await expect(loopback.send({ jsonrpc: "2.0", id: 1, method: "x" })).rejects.toThrow("未连接")

    let closed = false
    loopback.onClose(() => {
      closed = true
    })
    await loopback.close()
    expect(closed).toBe(true)
  })

  it("TC-U-074 StdioTransport 构造期校验：空 command 拒绝", () => {
    expect(() => new StdioTransport({ command: "" })).toThrow("非空的 command")
    expect(() => new StdioTransport({ command: "   " })).toThrow("非空的 command")
  })
})

// ---------- 全局清理 ----------

let consoleErrorSpy: ReturnType<typeof vi.spyOn> | undefined

beforeEach(() => {
  // 悬挂请求在 fake timer 快进后可能触发 client 内部 console 噪声，静默以保持输出干净
  consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => { })
})

afterEach(() => {
  consoleErrorSpy?.mockRestore()
})

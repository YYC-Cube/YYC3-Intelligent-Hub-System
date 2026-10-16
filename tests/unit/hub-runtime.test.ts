/**
 * hub 运行时组合根（B-2 接线）单元测试。
 *
 * 覆盖面：
 * - 客户端出口：`getHubStore` 单例与往返读写（业务唯一取存储实例的入口）；
 * - 服务端出口 · 沙箱：合法技能源码执行、策略拒绝（禁止特征）；
 * - 服务端出口 · MCP：经 `LoopbackTransport` 完成握手 / 工具发现 / 工具调用全链路。
 */
import { describe, expect, it } from "vitest"

import { getHubStore } from "@/lib/yyc3/hub"
import { createHubMcpClient, createSkillSandbox, SandboxViolationError } from "@/lib/yyc3/hub/server"
import { LoopbackTransport } from "@/lib/yyc3/mcp/transport"
import { MCP_PROTOCOL_VERSION, type JsonRpcMessage } from "@/lib/yyc3/mcp/types"

describe("hub 运行时 · 存储接线（客户端出口）", () => {
  it("getHubStore 返回同一单例，且读写走统一 Store 契约", async () => {
    const store = getHubStore()
    expect(getHubStore()).toBe(store)

    await store.put("hub:test-key", "hub-test-value")
    expect(await store.get("hub:test-key")).toBe("hub-test-value")
    expect(await store.delete("hub:test-key")).toBe(true)
    expect(await store.get("hub:test-key")).toBeUndefined()
  })
})

describe("hub 运行时 · Skill 沙箱（服务端出口）", () => {
  it(
    "执行合法技能源码并回传 stdout",
    async () => {
      const sandbox = createSkillSandbox()
      const result = await sandbox.run({ code: `console.log("sandbox-ok")`, label: "hub-test" })

      expect(result.ok).toBe(true)
      expect(result.timedOut).toBe(false)
      expect(result.stdout.trim()).toBe("sandbox-ok")
    },
    20_000,
  )

  it("源码命中禁止特征（child_process）时抛 SandboxViolationError 且不启动子进程", async () => {
    const sandbox = createSkillSandbox()
    await expect(sandbox.run({ code: `import "child_process"` })).rejects.toBeInstanceOf(
      SandboxViolationError,
    )
  })
})

/** 进程内 mock MCP 服务端：响应 initialize / tools/list / tools/call，其余返回 MethodNotFound。 */
function createMockServerHandler(): (message: JsonRpcMessage) => JsonRpcMessage | undefined {
  return (message) => {
    if (!("method" in message) || !("id" in message)) {
      return undefined
    }
    const { method, id } = message

    switch (method) {
      case "initialize":
        return {
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: MCP_PROTOCOL_VERSION,
            capabilities: { tools: {} },
            serverInfo: { name: "mock-hub-server", version: "1.0.0" },
          },
        }
      case "tools/list":
        return {
          jsonrpc: "2.0",
          id,
          result: {
            tools: [{ name: "echo", description: "回显入参", inputSchema: { type: "object" } }],
          },
        }
      case "tools/call": {
        const args = (message as { params?: { arguments?: unknown } }).params?.arguments ?? {}
        return {
          jsonrpc: "2.0",
          id,
          result: {
            content: [{ type: "text", text: `echo:${JSON.stringify(args)}` }],
            isError: false,
          },
        }
      }
      default:
        return {
          jsonrpc: "2.0",
          id,
          error: { code: -32601, message: `method not found: ${String(method)}` },
        }
    }
  }
}

describe("hub 运行时 · MCP 客户端（服务端出口）", () => {
  it(
    "经 LoopbackTransport 完成握手、按能力预取工具清单",
    async () => {
      const client = createHubMcpClient({
        name: "hub-test-client",
        version: "0.0.1",
        transport: new LoopbackTransport(createMockServerHandler()),
        requestTimeoutMs: 2_000,
      })

      const info = await client.connect()
      expect(info.protocolVersion).toBe(MCP_PROTOCOL_VERSION)
      expect(info.serverInfo?.name).toBe("mock-hub-server")
      expect(client.connected).toBe(true)
      expect(client.tools.map((tool) => tool.name)).toContain("echo")

      await client.close()
      expect(client.connected).toBe(false)
    },
    10_000,
  )

  it(
    "callTool 全链路返回工具执行结果",
    async () => {
      const client = createHubMcpClient({
        name: "hub-test-client",
        version: "0.0.1",
        transport: new LoopbackTransport(createMockServerHandler()),
        requestTimeoutMs: 2_000,
      })
      await client.connect()

      const result = await client.callTool("echo", { msg: "hi" })
      expect(result.isError).toBeFalsy()
      expect(result.content?.[0]?.text).toContain('"msg":"hi"')

      await client.close()
    },
    10_000,
  )
})

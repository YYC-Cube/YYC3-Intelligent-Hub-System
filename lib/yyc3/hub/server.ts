/**
 * YYC³ 集成中枢运行时 —— 服务端出口（仅 Node 宿主）。
 *
 * 组装客户端不可用的基座能力：
 * - {@link createSkillSandbox}：Skill 沙箱（进程隔离 + 资源限额 + 环境净化）；
 * - {@link createHubMcpClient}：MCP 客户端（JSON-RPC 2.0，请求配对 / 超时 / 通知分发）；
 * - {@link getHubStore}：与客户端出口同源的存储适配器（Node 下降级为进程内 Map）。
 *
 * 客户端代码请改用 `@/lib/yyc3/hub`（index.ts），
 * 否则 `node:child_process` 等模块会进入浏览器 bundle 导致静态导出构建失败。
 */

import { SkillSandbox, SandboxViolationError, type SandboxRequest, type SandboxResult } from "../sandbox/sandbox"
import type { SandboxPolicy } from "../sandbox/policy"
import { McpClient, type McpClientOptions } from "../mcp/client"

export { getBrowserStore as getHubStore } from "../store/local"
export { StoreError, assertValidKey } from "../store/types"
export type { Store, StoreBackend, StoreErrorCode } from "../store/types"

export { SandboxViolationError }
export type { SandboxRequest, SandboxResult }

/**
 * 创建 Skill 沙箱实例。
 *
 * @param overrides - 策略覆盖项（数组类字段为整体覆盖，见 {@link resolvePolicy}）
 * @returns 受 {@link SandboxPolicy} 约束的沙箱实例
 */
export function createSkillSandbox(overrides: Partial<SandboxPolicy> = {}): SkillSandbox {
  return new SkillSandbox(overrides)
}

/**
 * 创建 MCP 客户端实例。
 *
 * @param options - 客户端名称 / 版本 / 传输层 / 请求超时
 * @returns 未连接的 MCP 客户端，调用方需自行 `connect()` 完成握手
 */
export function createHubMcpClient(options: McpClientOptions): McpClient {
  return new McpClient(options)
}

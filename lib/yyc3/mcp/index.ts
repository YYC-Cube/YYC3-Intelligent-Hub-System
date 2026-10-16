/**
 * MCP 协议层出口（**仅服务端可用**）。
 *
 * `StdioTransport` 依赖 `node:child_process`，因此本目录不得被客户端组件引用。
 */

export {
  JsonRpcErrorCode,
  MCP_PROTOCOL_VERSION,
  isJsonRpcMessage,
  isJsonRpcNotification,
  isJsonRpcResponse,
} from "./types"
export type {
  JsonRpcErrorObject,
  JsonRpcErrorResponse,
  JsonRpcMessage,
  JsonRpcNotification,
  JsonRpcRequest,
  JsonRpcResponse,
  JsonRpcSuccessResponse,
  McpContentBlock,
  McpInitializeResult,
  McpResource,
  McpServerCapabilities,
  McpServerInfo,
  McpTool,
  McpToolResult,
} from "./types"

export { LoopbackTransport, StdioTransport, TransportHandlers, createLineFramer } from "./transport"
export type { McpTransport, StdioTransportOptions } from "./transport"

export { McpClient, McpClientError } from "./client"
export type { McpClientEvent, McpClientEventMap, McpClientOptions } from "./client"

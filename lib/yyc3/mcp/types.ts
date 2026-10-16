/**
 * MCP（Model Context Protocol）消息契约（自研实现，零外部依赖）。
 *
 * 仅覆盖本项目实际需要的子集：`initialize` 握手、`tools/list`、`tools/call`
 * 与 `resources/list`。协议基线为 JSON-RPC 2.0。
 *
 * 设计约束：本文件只放类型与纯函数校验，不含 IO，便于客户端与服务端共用。
 */

/** 协议版本号，需与对端协商；不一致时以对端返回值为准。 */
export const MCP_PROTOCOL_VERSION = "2025-03-26"

export interface JsonRpcRequest {
  jsonrpc: "2.0"
  id: number | string
  method: string
  params?: unknown
}

export interface JsonRpcNotification {
  jsonrpc: "2.0"
  method: string
  params?: unknown
}

export interface JsonRpcErrorObject {
  code: number
  message: string
  data?: unknown
}

export interface JsonRpcSuccessResponse {
  jsonrpc: "2.0"
  id: number | string
  result: unknown
}

export interface JsonRpcErrorResponse {
  jsonrpc: "2.0"
  id: number | string | null
  error: JsonRpcErrorObject
}

export type JsonRpcResponse = JsonRpcSuccessResponse | JsonRpcErrorResponse

/** 传输层可能收到的任意消息（含服务端主动通知）。 */
export type JsonRpcMessage = JsonRpcRequest | JsonRpcNotification | JsonRpcResponse

export interface McpTool {
  name: string
  description?: string
  /** JSON Schema 描述入参 */
  inputSchema?: Record<string, unknown>
}

export interface McpResource {
  uri: string
  name?: string
  description?: string
  mimeType?: string
}

export interface McpServerInfo {
  name: string
  version: string
}

export interface McpServerCapabilities {
  tools?: Record<string, unknown>
  resources?: Record<string, unknown>
  prompts?: Record<string, unknown>
}

export interface McpInitializeResult {
  protocolVersion?: string
  capabilities?: McpServerCapabilities
  serverInfo?: McpServerInfo
}

/** `tools/call` 返回的内容块。 */
export interface McpContentBlock {
  type: string
  text?: string
  data?: string
  mimeType?: string
}

export interface McpToolResult {
  content?: McpContentBlock[]
  isError?: boolean
}

/** JSON-RPC 标准错误码。 */
export const JsonRpcErrorCode = {
  ParseError: -32700,
  InvalidRequest: -32600,
  MethodNotFound: -32601,
  InvalidParams: -32602,
  InternalError: -32603,
  /** MCP 约定：请求超时 */
  RequestTimeout: -32001,
} as const

/** 判断任意值是否为结构合法的 JSON-RPC 消息。 */
export function isJsonRpcMessage(value: unknown): value is JsonRpcMessage {
  if (typeof value !== "object" || value === null) {
    return false
  }
  const record = value as Record<string, unknown>
  if (record.jsonrpc !== "2.0") {
    return false
  }

  const hasMethod = typeof record.method === "string"
  const hasId = typeof record.id === "number" || typeof record.id === "string"
  const isResponse = "result" in record || "error" in record

  return hasMethod || isResponse || hasId
}

/** 判断是否为「响应」消息（带 id 且含 result 或 error）。 */
export function isJsonRpcResponse(value: unknown): value is JsonRpcResponse {
  if (typeof value !== "object" || value === null) {
    return false
  }
  const record = value as Record<string, unknown>
  if (record.jsonrpc !== "2.0" || !("id" in record)) {
    return false
  }
  return "result" in record || "error" in record
}

/** 判断是否为「通知」消息（有 method 且无 id，按 JSON-RPC 约定无需应答）。 */
export function isJsonRpcNotification(value: unknown): value is JsonRpcNotification {
  return isJsonRpcMessage(value) && "method" in value && !("id" in value)
}

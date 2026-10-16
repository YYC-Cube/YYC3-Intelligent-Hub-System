/**
 * YYC³ 集成中枢运行时 —— 客户端安全出口（B-2 接线组合根）。
 *
 * 定位：`@/lib/yyc3/hub` 是业务代码获取基座能力的**唯一入口**；
 * 具体模块（store / mcp / sandbox）不再被 `app/**` 直接 import，
 * 从而保证：更换适配器、调整协议版本、收紧沙箱策略都在运行时一处收口。
 *
 * 分层约束（与 `@/lib/yyc3/store/server` 同理）：
 * 本项目为 `output: 'export'` 静态导出，客户端组件会被打进浏览器包。
 * 服务端专属能力（SkillSandbox 依赖 `node:child_process`、StdioTransport
 * 依赖 `node:child_process` / net）**严禁**出现在本出口，
 * 一律由 `@/lib/yyc3/hub/server` 单独引入。
 *
 * 用法：
 * ```ts
 * import { getHubStore } from "@/lib/yyc3/hub"
 * ```
 */

export { getBrowserStore as getHubStore } from "../store/local"

export { StoreError, assertValidKey } from "../store/types"
export type { Store, StoreBackend, StoreErrorCode } from "../store/types"

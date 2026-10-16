# 迁移裁决（补充规范）

1. `user-menu.tsx` 归属 auth namespace（按 spec 表）。
2. 超长 markdown 文档内容不迁移：`app/developer/guide/page.tsx` 的 `documentSections[].content`、`app/developer/progressive-guide/module/[id]/client-page.tsx` 的 `steps[].content`、代码块内中文注释、`app/services/`（不存在）。标题/类型等短文案仍迁移。
3. 演示/死代码跳过：`app/components/ui/design-system.tsx`、`app/components/error-handling/test-error-button.tsx`（无引用）。
4. 不迁：date-fns 格式串、`"全部分类"` 等过滤哨兵值（仅渲染处翻译）、console.*、英文开发断言、人名（张明/李华/王芳）、`app/lib/auth.ts` 的"测试用户"。
5. 组件参数默认值含中文：签名去掉默认值，组件体内 `?? t(...)` 兜底（loading-screen 的 message、error-display 的 title、SearchBar 的 placeholder）。
6. 需加 `"use client"` 的文件：app/not-found.tsx、app/components/ui/spinner.tsx、app/components/ui/dialog.tsx、components/ui/dialog.tsx、components/ui/breadcrumb.tsx、app/privacy/page.tsx、app/terms/page.tsx、app/developer/api/page.tsx、app/developer/components/page.tsx、app/admin/page.tsx、app/integrations/components/IntegrationGrid.tsx、app/components/category/category-heat-badge.tsx。
7. `throw new Error` 若最终经 toast/边界展示给用户→迁移（如 db-assistant 5 处、test-error-button 除外）；仅被 console 消费→不迁（encryption-context 4 处、db-assistant L890、integration-recommendation L51）。
8. toast 模板串如 `欢迎回来，${name}！` → `t("auth.欢迎回来，{name}！", { name })`，key 原样保留标点。
9. 插值参数一律 `String()` 包装数字。
10. `subscription-context.tsx` 嵌套三元 `您已经订阅了该${分类/开发者/集成}` → `t("common.您已经订阅了该{type}", { type: t(cond ? "common.分类" : cond ? "common.开发者" : "common.集成") })`。
11. `category-visualization.tsx` canvas 绘制：t/dataCat 结果存局部变量再 fillText，并加入 effect 依赖。
12. `assistant-context.tsx` 类方法内用 `import { t } from "@/lib/yyc3/i18n"`；L21 systemPrompt 不迁。
13. `app/components/version/` 两个组件与 `app/context/version-check-context.tsx`、`app/context/subscription-context.tsx`、`app/context/favorites-context.tsx`、`app/context/assistant-context.tsx` 用 common 或对应模块 ns（version→common、favorites→favorites、assistant→ai）。
14. `app/hooks/use-error-handler.ts`（L29/30 操作失败/发生了未知错误）→ errors ns，一并迁移。
15. marketplace `integration/[id]/client-page.tsx` 的 `reviews` 数组移到 hook 之后，content 用 t（作者名除外）。

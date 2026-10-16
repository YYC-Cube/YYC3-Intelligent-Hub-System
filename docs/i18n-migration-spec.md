# i18n 全键覆盖迁移规范（@yyc3/i18n-core）

## 背景
项目已接入自研包 `@yyc3/i18n-core`。基础设施已就绪：
- 引擎：`lib/yyc3/i18n/index.ts`（导出 `t`、`appI18n`、`APP_LOCALES`）
- React hook：`app/hooks/use-i18n.ts`（`useI18n()` 返回 `{ locale, setLocale, t }`，语言切换自动重渲染）
- 数据层 helper：`lib/yyc3/i18n/data.ts`（`tc`、`dataCat`、`dataSub`、`dataIntegrationName`、`dataIntegrationDesc`）
- 语言包：`lib/yyc3/i18n/messages/{zh-CN,en}.ts`（zh 由脚本自动生成，**不要手改**）

## key 规范：`<namespace>.<中文原文>`
原文本身即 key 的一部分（含标点、空格，原样保留）。例：
- `t("integrations.集成市场")`
- `t("install.安装集成", { name })` — 插值写 `{name}`，参数对象传 `{ name }`

## 替换规则
1. **JSX 文本**：`<h1>集成市场</h1>` → `<h1>{t("integrations.集成市场")}</h1>`
2. **字符串属性**：`placeholder="搜索集成"` → `placeholder={t("integrations.搜索集成")}`；`title/aria-label/alt/description/label/error/message` 等用户可见属性同样处理
3. **模板字符串**：`` `已安装 ${name} 个应用` `` → `t("install.已安装 {name} 个应用", { name })`
4. **三运条件内文案**：`{loading ? "加载中" : "完成"}` → `{loading ? t("common.加载中") : t("common.完成")}`
5. **数据驱动文案**（来自 `app/data/integrations.ts` 的中文值）在渲染处包 helper，不改数据文件：
   - category → `{dataCat(c)}`
   - subcategory → `{dataSub(s)}`
   - integration.name → `{dataIntegrationName(n)}`
   - integration.description → `{dataIntegrationDesc(d)}`
   - 其他数组内文案 → `{tc("<ns>", text)}`
6. **不迁移**：中文注释、`console.*`、测试断言、`app/data/integrations.ts` 本身、`app/design-system|examples|loading-demo|error-test`（演示页）
7. **metadata**：`export const metadata` 保持中文不翻（SSG SEO，另一议题）。若 page.tsx 既有 metadata 又有大段正文文案：正文抽到同目录新建 `xxx-content.tsx`（加 `"use client"`，用 `useI18n`），page.tsx 只留 metadata + 渲染 Content。若页面本来就是 client 组件（有 "use client"）直接改。
8. **导入来源**：
   - 组件内响应式：`import { useI18n } from "@/app/hooks/use-i18n"` → `const { t } = useI18n()`
   - 非组件模块（常量默认值、抛错消息、utils）：`import { t } from "@/lib/yyc3/i18n"`（SSG 中文，可接受）
   - helper：`import { tc, dataCat, dataSub, dataIntegrationName, dataIntegrationDesc } from "@/lib/yyc3/i18n/data"`
9. **纯展示 server 组件**（无 "use client"、无交互、含大量文案）：文件顶部加 `"use client"` 再用 hook（静态导出兼容）。

## namespace 分配（按文件路径）
| 路径包含 | namespace |
|---|---|
| `app/page.tsx` | home（已完成，勿动） |
| `app/integrations/**` | integrations |
| 安装向导 installation-wizard / install 相关 | install |
| `app/favorites/**` | favorites |
| `app/marketplace/**` | marketplace |
| `app/ai-assistant/**`、`components/ai-assistant` | ai |
| auth/login/user-menu 相关 | auth |
| `app/account/**` | account |
| `app/admin/**` | admin |
| `app/developer/**` | developer |
| `app/about|contact|privacy|terms|services/**` | pages |
| sync 相关 | sync |
| encryption 相关 | encryption |
| category 组件 | category |
| error-handling / error.tsx / not-found | errors |
| 通用 UI（loading、page-transition、toaster 文案等） | ui |
| 以上皆非 | common |

## 完成标准
- 目录内所有用户可见中文都经 `t()/tc()/dataXxx()` 输出
- `npx tsc --noEmit` 对你改过的文件无新增错误（全量 tsc 可能慢，可只看你的文件）
- 返回：改动文件清单（路径+每文件替换条数）、metadata 抽取情况、存疑项（无法判断是否用户可见的）

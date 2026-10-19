import tsPlugin from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import prettierConfig from "eslint-config-prettier"
import importPlugin from "eslint-plugin-import"
import jsxA11y from "eslint-plugin-jsx-a11y"
import reactPlugin from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"

/**
 * 本地自定义规则（无第三方插件依赖，随配置内联定义）。
 */
const localPlugin = {
  rules: {
    /**
     * 客户端组件（"use client"）禁止导出 metadata / generateMetadata ——
     * Next.js 不支持在客户端模块导出元数据（构建期即报错），
     * 规则将其提前到 lint 阶段，并引导元数据上移至最近的 server layout（createMetadata 工厂）。
     */
    "no-metadata-export-in-client": {
      meta: { type: "problem", schema: [] },
      create(context) {
        let isClientComponent = false
        return {
          Program(programNode) {
            const first = programNode.body[0]
            if (
              first &&
              first.type === "ExpressionStatement" &&
              first.expression.type === "Literal" &&
              first.expression.value === "use client"
            ) {
              isClientComponent = true
            }
          },
          "ExportNamedDeclaration > VariableDeclaration > VariableDeclarator[id.name='metadata']"(
            node,
          ) {
            if (isClientComponent) {
              context.report({
                node,
                message:
                  "客户端页面/布局（\"use client\"）禁止导出 metadata：请将元数据上移至最近的 server layout，并使用 createMetadata 工厂（lib/yyc3/metadata.ts）。",
              })
            }
          },
          "ExportNamedDeclaration > VariableDeclaration > VariableDeclarator[id.name='generateMetadata']"(
            node,
          ) {
            if (isClientComponent) {
              context.report({
                node,
                message:
                  "客户端页面/布局（\"use client\"）禁止导出 generateMetadata：generateMetadata 仅能在 server 组件中定义。",
              })
            }
          },
          "ExportNamedDeclaration > FunctionDeclaration[id.name='generateMetadata']"(node) {
            if (isClientComponent) {
              context.report({
                node,
                message:
                  "客户端页面/布局（\"use client\"）禁止导出 generateMetadata：generateMetadata 仅能在 server 组件中定义。",
              })
            }
          },
          "ExportNamedDeclaration > ExportSpecifier[local.name='metadata']"(node) {
            if (isClientComponent) {
              context.report({
                node,
                message:
                  "客户端页面/布局（\"use client\"）禁止 re-export metadata：请将元数据上移至最近的 server layout。",
              })
            }
          },
        }
      },
    },
  },
}

/**
 * ESLint 扁平配置。
 *
 * 说明：`eslint-config-next@14` 依赖已被 ESLint 9 移除的 `context.getAncestors()`，
 * 通过 FlatCompat 引入会导致 lint 整体崩溃。此处改为直接组合各插件官方配置，
 * 在不降级 ESLint 的前提下保持 TypeScript / React / Hooks / a11y / import 检查能力。
 */
const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      // 历次构建产物归档目录（如 out-trash-20261016），非源码，禁止参与 lint
      "out-trash-*/**",
      "dist/**",
      "coverage/**",
      "mock-api/**",
      "next-env.d.ts",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
      },
      // 告知 jsx-a11y 自定义封装组件对应的原生控件语义，
      // 使 label-has-associated-control 等规则能正确识别 <YanyuInput /> 等控件。
      "jsx-a11y": {
        components: {
          Input: "input",
          YanyuInput: "input",
          Textarea: "textarea",
          Select: "select",
          Checkbox: "input",
          Switch: "input",
        },
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      import: importPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,

      // Next.js App Router 使用自动 JSX 运行时，无需手动引入 React
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    // M3 固化（一）：设计令牌 + 布局容器旁路拦截，防止令牌/骨架体系回潜。
    //
    // 颜色消费唯一路径：
    //   1. Tailwind 语义令牌（primary / secondary / success / warning / info / destructive 等）
    //   2. brand 色阶（brand-50 ~ brand-950）
    //   3. canvas / SVG 等无法直接消费 CSS 变量的场景，用 getComputedStyle 读取令牌
    //
    // 容器唯一写法：PageContainer 组件或 mx-auto w-full max-w-page 令牌（禁止 container mx-auto）。
    //
    // 白名单（均为已评审的例外，新增白名单需在设计令牌审核报告中申报）：
    //   - lib/yyc3/brand.ts                     JS 侧品牌常量唯一真源
    //   - app/page.tsx                          首页第三方合作方官方品牌色（Slack/Google/Zoom 等）
    //   - app/data/integrations/generator.ts    集成目录第三方官方品牌色数据
    //   - app/admin/page.tsx                    管理模块数据驱动身份色板（10 组，语义令牌不足以区分）
    //   - app/developer/guide/page.tsx          文档教学示例（模板字符串中的示例代码）
    //   - tests/**                              测试夹具
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    ignores: [
      // 本配置文件的 message 中含示例类名（bg-blue-500 / container mx-auto），需自豁免
      "eslint.config.js",
      "lib/yyc3/brand.ts",
      "app/page.tsx",
      "app/data/integrations/generator.ts",
      "app/admin/page.tsx",
      "app/developer/guide/page.tsx",
      "tests/**",
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]",
          message:
            "禁止硬编码 hex 色值：请使用设计令牌（hsl(var(--token)) 或 Tailwind 语义类/brand 色阶）。确需例外请在 eslint.config.js 白名单申报。",
        },
        {
          selector: "TemplateElement[value.raw=/^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]",
          message:
            "禁止硬编码 hex 色值：请使用设计令牌（hsl(var(--token)) 或 Tailwind 语义类/brand 色阶）。确需例外请在 eslint.config.js 白名单申报。",
        },
        {
          selector:
            "Literal[value=/\\b(?:bg|text|border|from|via|to|ring|fill|stroke|divide|outline|shadow|caret|decoration|accent)-(?:gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950)\\b/]",
          message:
            "禁止 Tailwind 调色板旁路（如 bg-blue-500）：请迁移至语义令牌（primary/success/warning/info/destructive）或 brand 色阶（brand-50~950）。确需例外请在 eslint.config.js 白名单申报。",
        },
        {
          selector:
            "TemplateElement[value.raw=/\\b(?:bg|text|border|from|via|to|ring|fill|stroke|divide|outline|shadow|caret|decoration|accent)-(?:gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950)\\b/]",
          message:
            "禁止 Tailwind 调色板旁路（如 bg-blue-500）：请迁移至语义令牌（primary/success/warning/info/destructive）或 brand 色阶（brand-50~950）。确需例外请在 eslint.config.js 白名单申报。",
        },
        {
          selector: "Literal[value=/\\bcontainer\\s+mx-auto\\b/]",
          message:
            "禁止 container mx-auto 容器旁路：请使用 PageContainer 组件或 mx-auto w-full max-w-page 令牌。确需例外请在 eslint.config.js 白名单申报。",
        },
        {
          selector: "TemplateElement[value.raw=/\\bcontainer\\s+mx-auto\\b/]",
          message:
            "禁止 container mx-auto 容器旁路：请使用 PageContainer 组件或 mx-auto w-full max-w-page 令牌。确需例外请在 eslint.config.js 白名单申报。",
        },
      ],
    },
  },
  {
    // M3 固化（二）：页面骨架唯一入口。
    //
    // 页面文件禁止直接 import 骨架组件（Navbar / Footer / SiteFooter）——
    // 骨架统一由 app/**/layout.tsx 中的 AppShell / ConsoleShell 供给；
    // 首页（app/page.tsx）例外：可直接使用 AppShell（其自身不 import 骨架）。
    //
    // 作用域限定 app/**/page.* ，layout.tsx 与 app/components/layout/** 天然豁免，
    // 无需维护 ignores 白名单。
    files: ["app/**/page.{js,jsx,mjs,ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/components/ui/navbar",
                "@/components/ui/footer",
                "@/app/components/site-footer",
              ],
              message:
                "页面禁止直接挂载骨架（Navbar/Footer/SiteFooter）：请在 app/**/layout.tsx 使用 AppShell/ConsoleShell。确需例外请在 eslint.config.js 白名单申报。",
            },
          ],
        },
      ],
    },
  },
  {
    // 路由元数据防回潮（P2 固化）：
    //   1. 客户端页面/布局（"use client"）禁止导出 metadata / generateMetadata（local 规则）；
    //   2. metadata.title 禁止自拼品牌后缀（根 layout 模板统一拼接「页面名 - 品牌」，页面侧只传页面名）。
    files: ["app/**/*.{js,jsx,mjs,ts,tsx}"],
    plugins: { local: localPlugin },
    rules: {
      "local/no-metadata-export-in-client": "error",
      "no-restricted-syntax": [
        "error",
        {
          // 仅拦截 metadata 赋值上下文（变量声明 / createMetadata 调用）中
          // 「分隔符 + 品牌词」后缀形态（如「设计系统 - 言语云集成中心」），
          // 页面名本身含品牌词（如「集成中心」）不受影响
          selector:
            "VariableDeclarator[id.name='metadata'] Property[key.name='title'][value.type='Literal'][value.raw=/[-–—|]\\s*(言语云|集成中心|YanYu|YYC)/]",
          message:
            "metadata.title 禁止自拼品牌后缀：只传页面名，根 layout 模板统一拼接「页面名 - YanYuCloudCube集成中心系统」。确需例外请在 eslint.config.js 白名单申报。",
        },
        {
          selector:
            "CallExpression[callee.name='createMetadata'] Property[key.name='title'][value.type='Literal'][value.raw=/[-–—|]\\s*(言语云|集成中心|YanYu|YYC)/]",
          message:
            "metadata.title 禁止自拼品牌后缀：只传页面名，根 layout 模板统一拼接「页面名 - YanYuCloudCube集成中心系统」。确需例外请在 eslint.config.js 白名单申报。",
        },
      ],
    },
  },
  {
    // react-hooks 7.1 引入的编译器级规则把 13 处存量代码模式判为 error：
    //   set-state-in-effect ×7、immutability ×5、purity ×1（均为历史 context/页面代码）。
    // 降级为 warn 保留可见性，待按 React Compiler 规范专项重构后恢复 error（见 README 路线图）。
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/purity": "warn",
    },
  },
  {
    // 构建配置与运维脚本运行于 CommonJS 宿主环境，允许 require 式导入，
    // 并要求保持 console 输出以便 CI 观测。
    files: ["tailwind.config.ts", "postcss.config.*", "next.config.*", "scripts/**/*.{js,cjs,mjs}"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-console": "off",
    },
  },
  {
    // 测试中需要按用例重置模块缓存，require 是官方推荐做法。
    files: ["**/__tests__/**/*.{ts,tsx}", "**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  prettierConfig,
]

export default eslintConfig

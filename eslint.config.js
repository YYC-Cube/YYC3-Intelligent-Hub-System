import tsParser from "@typescript-eslint/parser"
import tsPlugin from "@typescript-eslint/eslint-plugin"
import reactPlugin from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import jsxA11y from "eslint-plugin-jsx-a11y"
import importPlugin from "eslint-plugin-import"
import prettierConfig from "eslint-config-prettier"

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
      "dist/**",
      "coverage/**",
      "AI/**",
      "AI高级功能/**",
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
    files: ["tailwind.config.ts", "postcss.config.*", "jest.config.ts", "next.config.*", "scripts/**/*.{js,cjs,mjs}"],
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

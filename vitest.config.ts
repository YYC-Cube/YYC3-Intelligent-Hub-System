import react from "@vitejs/plugin-react"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

/**
 * 阶段2 测试体系（vitest + @testing-library/react）。
 *
 * M-1 迁移后为全仓唯一测试运行器：接管 `tests/**` 全部单测，
 * 既有 jest 双轨已于 M-1 收敛移除（__tests__/、jest.config.ts、jest.setup.ts）。
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    // vmThreads：jsdom 环境按 worker 复用（此前 28 文件各自新建 jsdom 占总耗时 52%），
    // 默认 isolate 语义保留，单文件间隔离不受影响。
    pool: "vmThreads",
    globals: true,
    setupFiles: ["./vitest.setup.tsx"],
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules/**", ".next/**", "out/**", "**/*.d.ts"],
    css: false,
    restoreMocks: true,
    testTimeout: 20000,
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage-vitest",
      reporter: ["text", "json", "json-summary", "html"],
      include: [
        "app/data/**/*.{ts,tsx}",
        "app/utils/**/*.{ts,tsx}",
        "app/hooks/**/*.{ts,tsx}",
        "app/services/**/*.{ts,tsx}",
        "app/context/**/*.{ts,tsx}",
        "app/components/**/*.{ts,tsx}",
        "app/integrations/components/**/*.{ts,tsx}",
        "app/marketplace/components/**/*.{ts,tsx}",
        "hooks/**/*.{ts,tsx}",
        "lib/**/*.{ts,tsx}",
      ],
      exclude: ["**/*.d.ts", "**/node_modules/**"],
    },
  },
})

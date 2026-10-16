import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import { fileURLToPath } from "node:url"

/**
 * 阶段2 测试体系（vitest + @testing-library/react）。
 *
 * 与既有 jest 配置并存：vitest 仅接管 `tests/**`，jest 继续负责 `__tests__/**`，
 * 两者互不干扰（见 jest.config.ts 的 testPathIgnorePatterns）。
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

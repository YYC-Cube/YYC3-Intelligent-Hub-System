import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // 提供Next.js应用的路径以加载next.config.js和.env文件
  dir: './',
});

// 添加自定义Jest配置
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    // 支持绝对路径导入
    '^@/(.*)$': '<rootDir>/$1',
  },
  modulePaths: ['<rootDir>/node_modules', '<rootDir>/src'],
  transform: {
    '^.+\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'services/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/.next/**',
    '!**/out/**',
    '!**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  // 阶段2 的 vitest 测试位于 tests/ 目录，由 vitest 负责，jest 需排除以免重复/报错
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/tests/'],
  testMatch: [
    '**/__tests__/**/*.(test|spec).(ts|tsx)',
    '**/*.(test|spec).(ts|tsx)',
  ],
  verbose: true,
  testTimeout: 30000,
};

// createJestConfig会自动配置Next.js的路径解析
// 导出一个异步函数来确保正确的配置顺序
export default createJestConfig(config);
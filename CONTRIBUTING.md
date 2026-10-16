# 贡献指南（Contributing Guide）

感谢你考虑为 **言语云³集成中心系统** 贡献力量！🌿
在开始之前，请阅读以下指南，以确保贡献过程顺畅高效。

## 📋 目录

- [行为准则](#行为准则)
- [环境准备](#环境准备)
- [开发工作流](#开发工作流)
- [项目结构](#项目结构)
- [提交规范](#提交规范)
- [测试要求](#测试要求)
- [Pull Request 流程](#pull-request-流程)
- [文档闭环](#文档闭环)

---

## 🤝 行为准则

参与本项目即表示你同意遵守 [行为准则](CODE_OF_CONDUCT.md)。请始终保持尊重与专业。

## 🧰 环境准备

| 依赖 | 版本要求 | 说明 |
|:---:|:---:|:---|
| Node.js | `≥ 20` | 推荐 LTS |
| pnpm | `≥ 9` | 包管理器（勿用 npm/yarn 生成锁文件） |
| Git | 任意较新版本 | 支持 `main` 分支历史 |

```bash
# 1. 克隆仓库
git clone https://github.com/YYC-Cube/YYC3-Intelligent-Hub-System.git
cd YYC3-Intelligent-Hub-System

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm dev          # http://localhost:3000

# 4.（可选）带 Mock API 的联调模式
pnpm dev-with-mock
```

## 🔄 开发工作流

```bash
pnpm dev            # 开发服务器
pnpm build          # 生产构建（静态导出，产物在 out/）
pnpm lint           # ESLint 检查
pnpm lint:fix       # ESLint 自动修复
pnpm format         # Prettier 格式化
pnpm format:check   # Prettier 校验
pnpm test           # Jest 单元测试（__tests__/）
pnpm test:unit      # Vitest 业务测试（tests/）
pnpm test:all       # 双运行器全量测试
```

## 🏗️ 项目结构

```text
├── app/                  # Next.js App Router 页面与路由
│   ├── components/ui/    # 应用层 UI 组件（logo、loading-screen 等）
│   └── services/         # 业务服务（AI 分析等存活副本）
├── components/ui/        # shadcn/ui 基础组件库 + 全局导航/页脚
├── lib/yyc3/             # 🔑 核心库（唯一事实源）
│   ├── brand.ts          # 品牌资产与仓库地址常量
│   ├── store/            # 持久化层（local/redis + 键注册表）
│   ├── mcp/              # MCP（JSON-RPC 2.0）协议层
│   └── sandbox/          # Skill 沙箱
├── public/yyc3-icons/    # 全端图标资产（favicon/ios/pwa/webp/android）
├── docs/                 # 团队规范与历史报告（文档闭环）
├── __tests__/            # Jest 单元测试
└── tests/                # Vitest 业务测试
```

> ⚠️ **重要**：logo、仓库名、主题色等常量一律从 `lib/yyc3/brand.ts` 引用，禁止在页面中硬编码路径字符串。

## ✅ 提交规范

采用 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)：

```text
<类型>(<范围>): <主题>

类型：feat | fix | docs | style | refactor | perf | test | build | ci | chore
```

示例：

```text
feat(marketplace): 新增集成分类筛选
fix(logo): 修正全端图标引用断链
docs(readme): 补充图标可视化架构说明
```

## 🧪 测试要求

本项目采用**双运行器**策略，二者职责分离：

| 运行器 | 目录 | 运行命令 | 负责范围 |
|:---:|:---:|:---:|:---|
| Jest | `__tests__/` | `pnpm test` | 组件级单元测试 |
| Vitest | `tests/` | `pnpm test:unit` | 业务流程测试 |

- 新增业务流程测试请放入 `tests/`，使用 `vi.mock` 等 Vitest API
- 新增组件测试请放入 `__tests__/`，使用 Jest API
- PR 前请确保 `pnpm test:all` 全绿

## 🚀 Pull Request 流程

1. **Fork & 分支**：从 `main` 拉取特性分支
   ```bash
   git checkout -b feat/your-feature
   ```
2. **开发**：保持单一职责，一个 PR 只做一件事
3. **自检**（合并前必须全绿）：
   ```bash
   pnpm lint && pnpm format:check && pnpm test:all
   ```
4. **提交 PR**：标题遵循提交规范，描述包含「变更内容 / 动机 / 影响面」
5. **代码评审**：至少一位维护者批准后合并

### PR 检查清单

- [ ] `pnpm lint` 通过
- [ ] `pnpm test:all` 通过
- [ ] 新增代码有对应测试
- [ ] 未硬编码品牌资产路径（使用 `lib/yyc3/brand.ts`）
- [ ] 文档已同步更新（见下节）

## 📚 文档闭环

本项目遵循团队的**文档闭环**规范（详见 `docs/YYC3-团队通用-标准规范/YYC3-团队规范-文档闭环.md`）：

> 任何影响架构、目录结构、公共 API 或构建配置的变更，**必须**在同一个 PR 中同步更新相关文档；重大变更需在 `docs/` 下沉淀变更记录。

| 变更类型 | 需更新的文档 |
|:---|:---|
| 品牌资产 / 图标 | `lib/yyc3/brand.ts` 注释 + `README.md` 图标架构节 |
| 目录结构 | `README.md` + 本指南「项目结构」 |
| 依赖升级 | `README.md` 技术栈徽章 |
| 核心机制 | `docs/YYC3-团队通用-标准规范/` 对应规范文档 |

---

## 🆘 需要帮助？

- 🐛 [提交 Issue](https://github.com/YYC-Cube/YYC3-Intelligent-Hub-System/issues)
- 🔒 安全问题请走 [安全政策](SECURITY.md) 流程
- 💬 阅读 [README](README.md) 了解项目全貌

<div align="center">

**⭐ 如果这个项目对你有帮助，欢迎 Star 支持！**

</div>

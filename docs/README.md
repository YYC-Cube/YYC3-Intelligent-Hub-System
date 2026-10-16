# 📚 文档中心索引

> **更名说明**：本仓库已于 2026-10 由 `yyc3-integration-center` 更名为
> **[YYC3-Intelligent-Hub-System](https://github.com/YYC-Cube/YYC3-Intelligent-Hub-System)**。
> 归档目录中的历史快照保留旧项目名**历史原貌**，不代表当前仓库地址。

---

## 📜 根级治理文件

| 文档 | 用途 |
|:---|:---|
| [README.md](../README.md) | 项目门面：架构、图标资产体系、快速开始 |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | 贡献指南：环境、工作流、提交规范、文档闭环 |
| [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) | 行为准则（Contributor Covenant 2.1） |
| [SECURITY.md](../SECURITY.md) | 安全政策与漏洞上报流程 |
| [LICENSE](../LICENSE) | MIT 许可证 |

## 🧭 工程文档（活跃维护）

| 文档 | 内容 |
|:---|:---|
| [developer-guide.md](developer-guide.md) | 开发者上手指南（技术栈 / 环境 / 工作流） |
| [i18n-migration-spec.md](i18n-migration-spec.md) | i18n 全键覆盖迁移规范（`@yyc3/i18n-core`） |
| [i18n-migration-decisions.md](i18n-migration-decisions.md) | i18n 迁移裁决记录（15 条边界规则） |

## 🧭 活跃团队规范（`YYC3-团队通用-标准规范/`）

| 文档 | 内容 |
|:---|:---|
| [核心机制-五高五标五化五维](YYC3-团队通用-标准规范/YYC3-核心机制-五高五标五化五维.md) | 核心质量机制（五高架构 / 五标体系 / 五化转型 / 五维评估） |
| [智能编程-提示词](YYC3-团队通用-标准规范/YYC3-智能编程-提示词.md) | 智能编程主提示词 |
| [智能编程-分类提示](YYC3-团队通用-标准规范/YYC3-智能编程-分类提示.md) | 分类场景提示词 |
| [智能编程-闭环审核提示词](YYC3-团队通用-标准规范/YYC3-智能编程-闭环审核提示词.md) | 闭环审核提示词 |
| [智能编程UI-UX提示词体系](YYC3-团队通用-标准规范/YYC3-智能编程UI-UX提示词体系.md) | UI/UX 提示词体系 |
| [团队通用-标规文档/](YYC3-团队通用-标准规范/YYC3-团队通用-标规文档) | 开发文档 / 开发标准 / 文档闭环 / 多端适配 / 品牌资产（7 篇） |
| [项目闭环-验收系统/](YYC3-团队通用-标准规范/YYC3-项目闭环-验收系统) | 验收标准 / 审核验收 / 性能优化 / 安全加固（17 篇） |

## 🗄️ 会话报告（`yyc3-<主题>-<yyyymmdd>/`）

| 目录 | 时点 | 内容 |
|:---|:---|:---|
| [yyc3-intelligent-hub-fullchain-20261017/](yyc3-intelligent-hub-fullchain-20261017) | 2026-10-17 | 全链路闭环审核：全局审核报告（含四附录）+ 执行日志 |

## 🗄️ 归档快照（`archive/`，只读）

| 目录 | 时点 | 内容 |
|:---|:---|:---|
| `archive/yyc3-closed-loop-20261016/` | 2026-10-16 | 全局审核报告 + P0 清零复核报告 |
| `archive/yyc3-integration-center-glm5-turbo-20260503/` | 2026-05-03 | 历史审核产物（沿用当时仓库名） |

> 历史报告中涉及旧目录路径（如 `_api_backup/`）与旧项目名的描述均以**当时**为准。

---

## 🔄 文档闭环规则

任何影响架构、目录、公共 API 或构建配置的变更，必须在同一 PR 中同步更新对应文档（详见
[CONTRIBUTING.md · 文档闭环](../CONTRIBUTING.md#-文档闭环)）。新会话报告按
`yyc3-<主题>-<yyyymmdd>/` 命名存放于本目录，会话终结后移入 `archive/`。

**2026-10-17 治理记录**：删除零引用实验目录 `AI高级功能/`（6 文件，早期 API 设计草稿，
正式实现位于 `app/services/ai/`）；历史会话目录收拢至 `archive/`。

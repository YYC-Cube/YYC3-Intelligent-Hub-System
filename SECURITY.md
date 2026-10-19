# 安全政策（Security Policy）

## 📌 支持版本

本项目处于积极开发阶段，仅对以下版本提供安全更新：

| 版本 | 支持状态 |
|:---:|:---:|
| `0.1.x`（main 分支） | ✅ 支持 |
| 历史 tag | ❌ 不支持 |

## 🚨 漏洞上报

**请勿通过公开 Issue 报告安全漏洞。**

上报渠道（按优先级）：

1. **GitHub 私密安全公告**（推荐）：
   前往 [Security 选项卡](https://github.com/YYC-Cube/YYC3-Intelligent-Hub-System/security/advisories)
   选择 **Report a vulnerability** 提交。
2. **私密 Issue**：在仓库新建 Issue 并仅邀请维护者可见（如仓库已启用私密 Issue）。

响应时限承诺：

| 阶段 | 时限 |
|---|---|
| 确认收到上报 | 3 个工作日 |
| 初步评估与分级 | 7 个工作日 |
| 修复发布或缓解方案 | 视严重程度 14–90 天 |

## 🔍 负责任披露

- 请提供可复现步骤、影响范围评估与（如可能）修复建议。
- 我们欢迎在修复发布后公开披露，请给社区留出升级窗口期（建议 ≥ 30 天）。
- 我们不会对依规上报的研究者采取法律行动。

## 🎯 报告范围

**接受：**

- 任何导致机密性、完整性、可用性受损的缺陷（XSS、CSRF、注入、越权、SSRF 等）
- 依赖链（供应链）中的已知高危漏洞
- 密钥/凭据意外提交到仓库

**不接受：**

- 未经授权的批量爬取或压力测试
- 社会工程、钓鱼、物理攻击
- 与安全无关的功能缺陷（请走普通 [Issue](https://github.com/YYC-Cube/YYC3-Intelligent-Hub-System/issues)）

## 🛡️ 内建安全实践

本项目在架构层面的既有安全机制（详见 [README](README.md)）：

- 🔐 客户端敏感数据加密上下文（`app/context/encryption-context.tsx`）
- 🧺 Skill 执行沙箱：进程隔离 + 环境变量净化 + 超时与输出限额（`lib/yyc3/sandbox/`）
- 🔑 凭据仅经服务端适配器流转，不进入浏览器包（`lib/yyc3/store/server.ts`）
- ⚙️ 依赖定期同步升级，构建期执行完整类型检查与 Lint

---

<div align="center">

🔒 安全无小事 · 感谢你帮助保护YanYuCloudCube

</div>

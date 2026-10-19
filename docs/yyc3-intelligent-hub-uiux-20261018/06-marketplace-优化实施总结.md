---
file: 06-marketplace-优化实施总结.md
description: /marketplace 信息层级与视觉权重优化 阶段实施总结与状态同步 - UI/UX全链路审核专家 - 2026-10-19
author: AI Tutor <UI/UX Full-Link Audit Expert>
version: v1.0.0
created: 2026-10-19
updated: 2026-10-19
status: stable
tags: [summary],[implementation],[marketplace],[p0],[p1],[p2],[typography]
category: report
---

# 📝 应用市场（/marketplace）优化实施总结

> **对应审核**：[05-marketplace-信息层级与视觉权重审核.md](./05-marketplace-信息层级与视觉权重审核.md)
> **实施范围**：P0 ×2、P1 ×3、P2 ×7、卡片排版令牌 ×1
> **结论**：审核清单全部闭环（除 1 项 P1 明确未实施），三重门禁全绿，跨语言视觉一致

---

## 一、阶段目标与范围

| 阶段 | 目标 | 状态 |
| --- | --- | --- |
| P0 | 消除可读性阻断与非法交互结构 | ✅ 完成 |
| P1 | 核心内容前置、分类减压、主 CTA 归位 | ✅ 完成（含 Hero 搜索表单追加修复） |
| P2 | 降噪、语义归位、动效治理、无障碍命名 | ✅ 完成 |
| 排版 | 卡片语义字号令牌化（18px 行高方案） | ✅ 完成 |

---

## 二、变更文件清单

| # | 文件 | 变更要点 |
| --- | --- | --- |
| 1 | `app/marketplace/page.tsx` | 区块顺序重排；分类磁贴 8 个；主 CTA 降权；「精选推荐」改取 featured；信任条替代统计卡；Hero 副标题对比度；Tabs 响应式堆叠 |
| 2 | `app/marketplace/components/featured-carousel.tsx` | 品牌渐变背景；次级文字 95% 白；安装按钮透明底；箭头/圆点移入底部控制条；8s + hover/focus 暂停 + reduced-motion；carousel 语义 |
| 3 | `app/marketplace/components/category-grid.tsx` | 图标统一中性色 + hover 主色；移动端单行横向滚动；去除缩放动效 |
| 4 | `app/components/integrations/integration-card.tsx` | 链接区/操作区拆分（消除嵌套交互）；新增「立即安装」入口；去缩放动效；卡片字号令牌接线；长分类名截断 |
| 5 | `app/components/favorites/favorite-button.tsx` | `aria-label` + `aria-pressed` |
| 6 | `components/ui/collapsible-navbar.tsx` | 通知按钮 `aria-label`；菜单按钮 `aria-label` + `aria-expanded` |
| 7 | `tailwind.config.ts` | 新增 `card-title / card-body / card-meta / card-chip` 四个语义字号令牌 |
| 8 | `lib/yyc3/i18n/messages/zh-CN.ts`、`en.ts` | 补充 `nav.通知 / nav.打开菜单 / nav.关闭菜单` 3 键（中英同步） |
| 9 | `tests/business/integrations-page.test.tsx` | `cardLinks` 统计排除 `/install` 入口 |
| 10 | `tests/components/integration-card.test.tsx` | TC-C-002 / TC-C-009 改为按 href 精确定位，并断言安装链接 |
| 11 | `scripts/i18n-add-keys.mjs` | 复用已归档工具完成 3 键注入（含双转义体检） |
| 12 | `docs/.../attachments/marketplace-audit/*` | 全过程截图与采集数据（30 个文件） |

---

## 三、分阶段实施记录

### 3.1 P0-1 轮播对比度

| 项 | 前 | 后 |
| --- | --- | --- |
| 背景 | `linear-gradient(${color}80, ${color}40)` | `bg-gradient-to-r from-primary to-accent` |
| 白字对比度 | 1.06–1.51:1（17/17 色失败） | **5.17:1 / 6.80:1** |
| 次级文字 | `text-white/80` = 3.90:1 | `text-white/95` = **4.82:1** |
| 立即安装 | `outline` 白底 + 白字（不可见） | `bg-transparent text-white` + 白/30 边框 |

验证：`backgroundImage = linear-gradient(to right, rgb(36,99,235), rgb(71,71,209))`；截图 `after-desktop-zh-fold.png`。

### 3.2 P0-2 嵌套按钮

```
前：<Link><Card>…<FavoriteButton/>…</Card></Link>   → a button = 1
后：<Card><Badge/><FavoriteButton/><Link><CardContent/></Link></Card> → a button = 0
```

验证：收藏点击后 URL 不变；卡片主体点击仍正常进入详情。

### 3.3 P0-3 轮播箭头压字（追加项）

箭头由 `absolute left-4/right-4 top-1/2` 改为**卡片下方控制条**（◀ ● ● ● ● ● ▶），圆点命中区 8px → **24px**，箭头补无障碍名称。

验证：`arrowOverlapsDescription = false`（桌面/移动）；点击「下一页」切换正常。

### 3.4 P1 结构重排

| 指标 | 前 | 后 |
| --- | --- | --- |
| 首卡位置 · 桌面 | 1616px（1.80 屏） | **507px（0.56 屏）** |
| 首卡位置 · 移动 | 2960px（3.51 屏） | **571px（0.68 屏）** |
| 分类磁贴 | 29 | **8** |
| 分类区高度 · 桌面 | 694px | **304px** |
| 分类区高度 · 移动 | 1994px | **182px（-91%）** |
| 实心主按钮 | 2 | **1** |
| 卡片安装入口 | 0 | **9** |
| 页面总高 · 桌面 | 2660px | **2312px（-13%）** |
| 页面总高 · 移动 | 6072px | **4368px（-28%）** |

附：移动端 Tabs 与标题改为上下堆叠，修复 4 个触发器把 h2 挤成两行的问题（标题恢复单行 32px）。

### 3.5 P2 治理

| # | 变更 | 验证 |
| --- | --- | --- |
| P2-1 | 统计区 → 单行信任条；数字 36px → 14px；`4987K+` → **`4.99M+`** | 区块高度 122 → **20px** |
| P2-2 | 「精选推荐」数据源 → `featured` 集合前 8 条 | 标签名实一致 |
| P2-3 | 分类图标 7 种语义色 → 1 种中性色 | 实测图标颜色种类 **7 → 1** |
| P2-4 | 轮播 5s → 8s；hover/focus 暂停；reduced-motion 停用 | 悬停 9s 不切换；移出 9s 切换；reduced-motion 9s 不切换 |
| P2-5 | 15 个无名图标按钮 → 0 | 收藏（8）+ 通知 + 菜单补齐名称 |
| P2-6 | Hero 副标题 `brand-100` → `white/95` | 4.28:1 → **4.82:1** |
| P2-7 | 卡片/分类去缩放动效 | 改描边 + 阴影 |

### 3.6 卡片语义字号令牌

```ts
fontSize: {
  "2xs": ["0.625rem", { lineHeight: "1rem" }],
  "card-title": ["0.9375rem", { lineHeight: "1.375rem", fontWeight: "600" }],
  "card-body":  ["0.8125rem", { lineHeight: "1.125rem" }],
  "card-meta":  ["0.75rem",    { lineHeight: "1rem" }],
  "card-chip":  ["0.6875rem",  { lineHeight: "1rem" }],
}
```

| 元素 | 前 | 后（计算值） |
| --- | --- | --- |
| 集成名称 | 14 / 20 / 600 | **15 / 22 / 600** |
| 开发者 | 12 / 16 | 12 / 16 |
| 简介 | 12 / 16 | **13 / 18** |
| 评分 · 评论数 · 安装量 | 12 / 16 | 12 / 16 |
| 分类 chip | 12 / 16 | **11 / 16** |
| 立即安装 | 12 / 16 / 500 | 12 / 16 / 500（不变） |

**跨语言一致性**：英文长分类名（Customer Support / Content Management）原本会把操作区挤成两行、卡片 199 → 229px；增加 `max-w-20 truncate` + `title` 后恢复 **199px**，中文 chip（60px）不触发截断。

### 3.7 Hero 搜索表单（追加修复，原遗留 #1）

Hero 搜索由「按钮 `onClick` 单独驱动」改为**原生表单提交**，统一 Enter / 点击 / 移动端软键盘「搜索」键。

```tsx
const composingRef = useRef(false)
const submitSearch = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  if (composingRef.current) return // IME 选词回车保护
  const query = searchQuery.trim()
  if (!query) return
  router.push(`/marketplace/search?q=${encodeURIComponent(query)}`)
}
```

| 项 | 前 | 后 |
| --- | --- | --- |
| 结构 | `motion.div` + `Button onClick` | `motion.form role="search"` + `onSubmit` |
| Enter / 软键盘搜索键 | 无响应 | 正常提交 |
| 空白输入 | 不跳转（沿用） | 不跳转 |
| `trim` | 否 | **是** |
| 表单语义 | 无 | `action/method/name="q"` + `aria-label` |
| 装饰图标 | 进入无障碍树 | `aria-hidden="true"` |
| IME 组合回车 | — | **不误提交** |

**测试**：新增 `tests/business/marketplace-search.test.tsx` 7 条（Enter 等价 / 点击 / 空值 / trim / 编码 / IME / 表单语义）。
**E2E 实测**：Enter → `/marketplace/search/?q=crm`；点击同；空白保持 `/marketplace/`；`a&b` → `q=a%26b`；`window.__spaMarker` 保持存活，确认 SPA 导航无整页刷新。

> 测试基建同步修复：`vitest.setup.tsx` 的 framer-motion mock 原每次渲染返回新组件类型，导致 `motion.*` 子树在 setState 后整体重挂载、受控输入状态丢失；已改为按标签缓存组件类型。

### 3.8 剩余 4 项 P2/P3 收尾

| # | 项 | 处理 | 验证 |
| --- | --- | --- | --- |
| P3-1 | 5 列窄卡操作区换行（229px） | 操作区改单行：价格 `shrink-0` + 分类 chip `min-w-0 truncate` 弹性截断 + 按钮 `ml-auto shrink-0`；卡片按钮文案改用新增短键 `marketplace.安装` | `/integrations` 卡片 **229 → 199px**，行高 33px 单行；`/marketplace` 保持 199×294 |
| P3-2 | 移动端分类区 182px | 磁贴 `p-3 md:p-4`、图标 `w-10 h-10 md:w-12 md:h-12`、标题 `text-xs md:text-sm`；区块标题间距 `mb-4 md:mb-6` | 移动端分类区 **182 → 150px**（≤150 目标达成），磁贴 114 → 90px |
| P3-3 | 设计系统页缺排版章节 | 在「排版」Tab 新增「卡片排版令牌（全站卡片唯一真源）」演示块（4 个令牌 + 使用规则） | 实测 15/22/600、13/18、12/16、11/16 渲染正确 |
| P2-4 | 其他页面彩色图标 | `/marketplace/categories` 29 个图标统一中性色（hover 主色）并去缩放；首页 feature 的 `warning/success` 改品牌色；contact / developer 页 `success` 图标改主色 | 分类页图标颜色种类 **7 → 1**；首页语义色图标 **0** |

> 词表工具修正：`scripts/i18n-add-keys.mjs` 的去重检查原先作用于整份文件，会因其他命名空间存在同名字符串而误跳过（如 `favorites.安装` 导致 `marketplace.安装` 未注入）；已改为命名空间作用域内去重。
> 保留观察：`/admin` 控制台的彩色导航卡（success/warning/destructive）属于后台独立视觉语言，本轮未动；如需统一需单独立项。

---

## 四、量化结果总览

| 维度 | 前 | 后 | 改善 |
| --- | --- | --- | --- |
| 首屏商品卡 | 0 张 | 2 行（≥4 张） | — |
| 首卡位置（桌面/移动） | 1.80 / 3.51 屏 | **0.56 / 0.68 屏** | -69% / -81% |
| 分类磁贴 | 29 | 8 | -72% |
| 分类区高度（移动） | 1994px | **150px** | -92% |
| 卡片高度（5 列窄卡 218px） | 225 → 229px（操作区换行） | **199px（单行）** | -13% |
| 分类图标颜色种类（marketplace + categories 页） | 7 种语义色 | **1 种中性色** | -86% |
| 轮播最低对比度 | 1.06:1 | **5.17:1** | +388% |
| 语义色装饰用例 | 7 色 | 1 色 | -86% |
| 未命名图标按钮 | 15 | 0 | -100% |
| 嵌套交互 | 1 | 0 | -100% |
| 实心主按钮 | 2 | 1 | -50% |
| 卡片安装入口 | 0 | 9 | — |
| 页面总高（桌面/移动） | 2660 / 6072px | 2312 / 4368px | -13% / -28% |

---

## 五、测试适配

| 测试 | 原假设 | 适配内容 |
| --- | --- | --- |
| `tests/business/integrations-page.test.tsx` | 每卡 1 个 `/integrations/` 链接 | `cardLinks` 排除 `[href$='/install']`，仍按卡片数断言（30 / 10） |
| `tests/components/integration-card.test.tsx` · TC-C-002 | `getByRole("link")` 唯一 | 改为按 href 定位详情链接，并新增安装链接断言 |
| `tests/components/integration-card.test.tsx` · TC-C-009 | 同上 | 改为按 href 定位 `/integrations/77` |
| `tests/business/marketplace-search.test.tsx`（新增） | 无 | 7 条：Enter 等价 / 点击 / 空值 / trim / 编码 / IME / 表单语义 |
| `vitest.setup.tsx` | framer-motion mock 每次返回新组件类型 | 按标签缓存组件类型，避免 `motion.*` 子树在 setState 后重挂载 |

> 测试调整属于**行为契约变更**（一卡双链接 / 新增表单语义），非为通过而放宽断言。

---

## 六、门禁与验收

| 门禁 | 结果 |
| --- | --- |
| `pnpm exec tsc --noEmit` | **0 errors** |
| `pnpm lint` | **0 errors**（353 条存量 warning 未新增；轮播 hook 无新增告警） |
| `pnpm exec vitest run` | **30 files / 275 passed / 7 skipped（282）** |
| `pnpm i18n:check-escapes` | zh-CN / en 均 **0 双转义** |

DoD 对照见 [05 文档 Layer 5](./05-marketplace-信息层级与视觉权重审核.md#layer-5--验收标准dod)。

---

## 七、遗留与后续建议

**本轮审核清单已全部闭环**，无在册遗留项。

| # | 观察项 | 说明 | 优先级 |
| --- | --- | --- | --- |
| 1 | `/admin` 彩色导航卡 | success/warning/destructive 用于后台模块卡，属后台独立视觉语言；如需与前台统一需单独立项 | P3 |
| 2 | 分类侧栏品牌渐变图标 | `/integrations` 侧栏使用品牌色渐变（非语义色），符合规则，保持现状 | — |

> 05 审核文档列出的 P0（3）/ P1（4）/ P2（9）问题与 4 项收尾观察均已处理完毕；仅保留 2 条「非缺陷观察」。

---

## 八、复现与验证命令

```bash
# 门禁
pnpm exec tsc --noEmit
pnpm lint
pnpm exec vitest run
node scripts/i18n-add-keys.mjs --check-escapes

# 本地预览
pnpm dev   # http://localhost:3000/marketplace
```

**关键观测点**

| 观测项 | 期望值 |
| --- | --- |
| 首卡 top（1440×900） | 507px ± 2 |
| 首卡 top（390×844） | 571px ± 2 |
| 卡片高度（marketplace 4 列） | 199px ± 2（中/英一致） |
| 卡片高度（integrations 5 列） | 229px ± 2 |
| 分类磁贴数 | 8 |
| 实心主按钮 | 1（搜索） |
| 分类图标颜色 | 1 种（`rgb(107,114,128)`） |
| 轮播悬停 9s | 不切换 |
| reduced-motion 9s | 不切换 |

> 说明：本轮的 Playwright 采集脚本为临时脚本（`/tmp`），未归档；已归档的自动化工具为 `scripts/en-audit.py`（18 路由 × C1-C9）。如后续需要回归，建议将 marketplace 观测项并入该脚本。

---

## 九、经验沉淀

1. **数据色不能直接做背景层**：集成色 50%→25% 冲白后，17 个调色板色全部低于 AA（最低 1.06:1）。任何「动态色 + 白字」都必须先算对比度。
2. **审计选择器要按渲染事实写**：Badge 渲染为 `div` 而非 `span`，导致 C4/C5 两次误判；以 role / 文本 / href 定位更稳。
3. **修复嵌套交互要拆结构，不是阻止冒泡**：将链接区与操作区拆为兄弟节点，既满足语义，也天然解决误跳转。
4. **排版用令牌，不用运行时自适应**：网格内同行卡片等宽，自适应无收益；令牌化可预测、可测试、可复用。
5. **一卡双链接会破坏既有测试契约**：结构性改动需同步更新测试假设，并在提交说明中标注契约变更。
6. **关键修改后以 shell 核验落盘**：本次出现两次编辑器缓冲与磁盘不同步（修改显示成功但文件被回滚），最终以 `sed`/`grep` 复核确认；建议复杂改动后追加 `wc -c` / `grep` 体检。
7. **测试 mock 的组件类型必须稳定**：framer-motion mock 若每次渲染返回新函数，React 会视为不同类型并重挂载子树，受控输入的 composition/焦点状态随之丢失；按标签缓存组件类型后问题消失。
8. **搜索类交互统一走表单**：`form onSubmit` 天然覆盖 Enter、点击与移动端软键盘搜索键，并自带 `<form>` 语义；`onKeyDown` 手工监听既无法被辅助技术识别，也易与 IME 组合冲突。
9. **词表去重必须限定命名空间**：同名字符串键在不同命名空间合法共存（`favorites.安装` / `integrations.安装` / `marketplace.安装`），全局去重会静默跳过注入；`i18n-add-keys.mjs` 已按命名空间块切片校验。

---

**阶段状态**：✅ 全部完成（P0/P1/P2/P3 全闭环）
**下次衔接**：无在册遗留。可选后续：① `/admin` 彩色导航卡视觉语言统一（需产品决策）；② 将 marketplace 观测项并入 `scripts/en-audit.py` 作为常态回归。

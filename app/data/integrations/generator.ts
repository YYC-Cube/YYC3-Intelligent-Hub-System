/**
 * 确定性数据集生成器（L-4：自 integrations.ts 拆分）。
 *
 * 1000 条集成应用记录全部由此模块在模块加载期一次性生成，
 * 依赖 categories/subcategories/iconMap/industries 元数据。
 * 消费方请从 `@/app/data/integrations` 聚合出口导入。
 */
import { categories, subcategories } from "./categories"
import { industries } from "./filters"
import { iconMap } from "./icons"
import type { Integration } from "./types"

export type RandomFn = () => number

/** 集成应用数据集的固定随机种子 */
export const INTEGRATIONS_SEED = 20261016

/**
 * 集成应用数据集的时间基准点。
 *
 * 生成器中涉及时间差的字段（`lastUpdate`、`new` 标记）必须以此常量而非
 * `Date.now()` 为基准，否则同一份数据在服务端预渲染与客户端水合时会得到
 * 不同结果。
 */
export const INTEGRATIONS_REFERENCE_DATE = new Date("2026-10-16T00:00:00.000Z")

/**
 * 价格筛选滑块上限（H-6）。
 *
 * 付费应用价格由生成器产生，区间为 `[10, 109]`；原筛选上限 100 无法表达
 * `¥100–109` 区间。此常量是筛选 UI（FilterSidebar 滑块）与搜索页
 * （maxPrice 参数默认值/哨兵值）共享的唯一事实源，须满足：
 * 1. 大于等于数据集付费价格最大值（由 TC-U-036 不变量测试保证）；
 * 2. 为滑块步长 5 的整数倍，保证上限值本身可被滑块表达。
 */
export const PRICE_FILTER_MAX = 120

/**
 * 创建确定性伪随机数生成器（mulberry32 算法）。
 *
 * 用于替代 `Math.random()`，使 1000 条集成数据在任意环境下完全可复现，
 * 保证 Next.js 静态预渲染与客户端水合结果一致，并支持快照测试。
 *
 * @param seed - 32 位无符号整数种子
 * @returns 每次调用返回 [0, 1) 区间内确定性浮点数的函数
 */
export function createSeededRandom(seed: number): RandomFn {
  let state = seed >>> 0
  return function random(): number {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const colorPalette = [
  "#FF4A00",
  "#96BF48",
  "#E37400",
  "#FFE01B",
  "#F06A6A",
  "#FFCC22",
  "#6772E5",
  "#F22F46",
  "#2D8CFF",
  "#0061FF",
  "#00A1E0",
  "#D32D27",
  "#4CAF50",
  "#9C27B0",
  "#FF9800",
  "#795548",
  "#607D8B",
  "#3F51B5",
  "#00BCD4",
  "#FFC107",
  "#8BC34A",
  "#673AB7",
  "#E91E63",
  "#009688",
  "#FF5722",
  "#CDDC39",
  "#2196F3",
  "#FF4081",
  "#03A9F4",
  "#9E9E9E",
]

// 中文集成名称和描述
const chineseNames = [
  "数据同步",
  "智能分析",
  "客户管理",
  "邮件营销",
  "日程安排",
  "文档协作",
  "支付处理",
  "通信平台",
  "视频会议",
  "云存储",
  "网站优化",
  "安全防护",
  "媒体管理",
  "音频处理",
  "知识库",
  "项目管理",
  "团队协作",
  "性能监控",
  "数据库",
  "客服系统",
  "内容创作",
  "社交管理",
  "电商平台",
  "财务管理",
  "人力资源",
  "学习平台",
  "设计工具",
  "开发环境",
  "测试工具",
  "营销自动化",
  "数据可视化",
  "流程自动化",
  "智能助手",
  "虚拟现实",
  "增强现实",
  "区块链",
  "人工智能",
  "物联网",
  "移动应用",
  "游戏开发",
]

const chineseDescriptions = [
  "提供高效的数据同步服务，确保您的信息在各平台间实时更新，提高工作效率。",
  "利用人工智能技术分析您的业务数据，提供深入洞察和决策支持。",
  "全面的客户关系管理解决方案，帮助您维护客户关系并提升销售业绩。",
  "专业的邮件营销工具，支持个性化内容和自动化营销流程。",
  "智能日程管理工具，帮助您高效安排会议和管理时间。",
  "实时文档协作平台，支持多人同时编辑和版本控制。",
  "安全可靠的支付处理系统，支持多种支付方式和货币。",
  "统一通信平台，整合电话、短信和即时通讯功能。",
  "高清视频会议解决方案，支持屏幕共享和会议录制。",
  "安全的云存储服务，随时随地访问您的文件。",
  "网站性能优化工具，提升用户体验和搜索引擎排名。",
  "全方位的网络安全解决方案，保护您的数据和隐私。",
  "媒体资源管理系统，高效组织和分享您的图片和视频。",
  "专业的音频处理工具，提供录制、编辑和转换功能。",
  "智能知识库系统，集中管理和分享团队知识。",
  "全功能项目管理平台，跟踪任务进度和资源分配。",
  "团队协作工具，促进沟通和提高工作效率。",
  "实时性能监控系统，及时发现和解决问题。",
  "高性能数据库解决方案，支持复杂查询和大数据处理。",
  "智能客服系统，提供多渠道支持和自动化响应。",
  "专业内容创作平台，简化内容生产和发布流程。",
  "社交媒体管理工具，统一管理多平台社交账号。",
  "全渠道电商解决方案，优化销售流程和用户体验。",
  "智能财务管理系统，自动化财务流程和报表生成。",
  "一体化人力资源管理平台，简化招聘和员工管理。",
  "在线学习平台，提供灵活的培训和技能发展解决方案。",
  "专业设计工具，支持UI/UX、平面和3D设计。",
  "集成开发环境，提高代码质量和开发效率。",
  "自动化测试工具，确保软件质量和性能。",
  "营销自动化平台，优化营销流程和提高转化率。",
  "数据可视化工具，将复杂数据转化为直观图表。",
  "业务流程自动化系统，减少重复工作和人为错误。",
  "AI驱动的智能助手，提供个性化支持和建议。",
  "虚拟现实开发平台，创建沉浸式体验和培训。",
  "增强现实解决方案，融合虚拟内容和现实环境。",
  "区块链技术平台，提供安全透明的数据交换。",
  "人工智能开发工具，简化AI模型训练和部署。",
  "物联网管理平台，连接和监控智能设备。",
  "移动应用开发套件，加速应用设计和发布。",
  "游戏开发引擎，支持多平台游戏创建和发布。",
]

const developers = [
  "言语云科技",
  "数字智联",
  "云端科技",
  "智慧软件",
  "创新科技",
  "未来网络",
  "星辰数据",
  "蓝海科技",
  "绿洲软件",
  "山川科技",
  "智联云创",
  "数智未来",
  "云智科技",
  "华夏软件",
  "东方数码",
  "南方云计算",
  "北极星科技",
  "西部数据",
  "中原软件",
  "长江信息",
  "黄河科技",
  "珠江网络",
  "泰山云服务",
  "华山软件",
  "恒山科技",
  "嵩山数据",
  "衡山网络",
  "庐山云计算",
  "峨眉科技",
  "黄山软件",
]

const tags = [
  "自动化",
  "人工智能",
  "机器学习",
  "实时同步",
  "高性能",
  "安全加密",
  "多平台",
  "可扩展",
  "易用性",
  "定制化",
  "企业级",
  "团队协作",
  "移动支持",
  "API接口",
  "数据分析",
  "云原生",
  "微服务",
  "开源",
  "SaaS",
  "离线支持",
  "低代码",
  "无代码",
  "跨平台",
  "响应式",
  "实时数据",
  "大数据",
  "区块链",
  "物联网",
  "边缘计算",
  "5G技术",
  "增强现实",
  "虚拟现实",
  "语音识别",
  "图像识别",
  "自然语言处理",
  "深度学习",
  "预测分析",
  "推荐系统",
  "知识图谱",
  "数据可视化",
  "流程自动化",
  "敏捷开发",
  "持续集成",
  "持续部署",
  "容器化",
  "无服务器",
  "混合云",
  "多云管理",
  "数据治理",
  "合规认证",
]

function generateRandomDate(random: RandomFn, start: Date, end: Date) {
  return new Date(start.getTime() + random() * (end.getTime() - start.getTime())).toISOString().split("T")[0]
}

function generateRandomVersion(random: RandomFn) {
  const major = Math.floor(random() * 5) + 1
  const minor = Math.floor(random() * 10)
  const patch = Math.floor(random() * 10)
  return `${major}.${minor}.${patch}`
}

function getRandomSubcategory(random: RandomFn, category: string) {
  if (category === "全部分类") return undefined
  const subs = subcategories[category as keyof typeof subcategories] || []
  return subs.length > 0 ? subs[Math.floor(random() * subs.length)] : undefined
}

/**
 * 使用确定性随机源做 Fisher–Yates 洗牌。
 *
 * 不可使用 `arr.sort(() => 0.5 - random())`：`Array.prototype.sort` 对比较器的
 * 调用次数取决于 JS 引擎的排序算法实现，而本随机源是有状态的，因此同一份种子
 * 在 Node（预渲染）与浏览器（水合）中会得到不同顺序，进而使后续所有随机值整体
 * 偏移，造成 SSG/CSR 数据不一致。
 */
function shuffleWithRandom<T>(items: readonly T[], random: RandomFn): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    const tmp = result[i]
    result[i] = result[j]
    result[j] = tmp
  }
  return result
}

function getRandomTags(random: RandomFn) {
  const numTags = Math.floor(random() * 5) + 1
  return shuffleWithRandom(tags, random).slice(0, numTags)
}

function getRandomIndustries(random: RandomFn) {
  const numIndustries = Math.floor(random() * 3) + 1
  return shuffleWithRandom(industries.slice(1), random).slice(0, numIndustries) // 排除"全部行业"
}

function generateIntegrations(count: number, seed: number = INTEGRATIONS_SEED): Integration[] {
  const random = createSeededRandom(seed)
  const integrations: Integration[] = []
  const iconKeys = Object.keys(iconMap)
  const newThreshold = INTEGRATIONS_REFERENCE_DATE.getTime() - 30 * 24 * 60 * 60 * 1000 // 30天内更新的为新

  for (let i = 0; i < count; i++) {
    const iconKey = iconKeys[Math.floor(random() * iconKeys.length)]
    const category = categories[Math.floor(random() * (categories.length - 1)) + 1] // 排除 '全部分类'
    const color = colorPalette[Math.floor(random() * colorPalette.length)]
    const nameIndex = i % chineseNames.length
    const descIndex = i % chineseDescriptions.length
    const developer = developers[Math.floor(random() * developers.length)]
    const rating = (random() * 2 + 3).toFixed(1) // 3.0-5.0
    const reviewCount = Math.floor(random() * 1000)
    const installCount = Math.floor(random() * 10000)
    const releaseDate = generateRandomDate(random, new Date(2020, 0, 1), new Date(2022, 0, 1))
    const lastUpdate = generateRandomDate(random, new Date(2022, 0, 1), INTEGRATIONS_REFERENCE_DATE)
    const version = generateRandomVersion(random)
    const priceType = ["free", "paid", "freemium"][Math.floor(random() * 3)] as "free" | "paid" | "freemium"
    const priceValue = priceType === "free" ? 0 : Math.floor(random() * 100) + 10
    const subcategory = getRandomSubcategory(random, category)
    const featured = random() < 0.1 // 10%的几率被推荐
    const isNew = new Date(lastUpdate).getTime() > newThreshold // 基准时间前30天内更新的为新
    const popular = installCount > 5000 // 安装量超过5000为热门
    const industryFocus = getRandomIndustries(random)

    integrations.push({
      id: `${i + 1}`,
      name: `${chineseNames[nameIndex]}${i + 1}`,
      description: `${chineseDescriptions[descIndex]}该集成提供${category}服务，旨在简化您的工作流程并提高效率。凭借强大的功能和简便的集成方式，它是现代企业优化运营和在竞争市场中保持领先地位的必备工具。`,
      category,
      subcategory,
      icon: iconKey,
      color,
      developer,
      rating: Number.parseFloat(rating),
      reviewCount,
      price: {
        type: priceType,
        value: priceType !== "free" ? priceValue : undefined,
      },
      installCount,
      releaseDate,
      lastUpdate,
      version,
      tags: getRandomTags(random),
      featured,
      new: isNew,
      popular,
      industryFocus,
    })
  }

  return integrations
}

export const integrations = generateIntegrations(1000)

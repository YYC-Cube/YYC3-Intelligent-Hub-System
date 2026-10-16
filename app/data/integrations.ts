import {
  Zap,
  ShoppingCart,
  BarChart,
  Mail,
  Calendar,
  ArrowRight,
  FileText,
  CreditCard,
  Phone,
  Video,
  Cloud,
  Globe,
  Shield,
  Camera,
  Music,
  Book,
  Briefcase,
  Coffee,
  Cpu,
  Database,
  Headphones,
  Heart,
  ImageIcon,
  Key,
  Laptop,
  Map,
  Printer,
  Rocket,
  Scissors,
  Truck,
  Wifi,
  Users,
  Bookmark,
  PenToolIcon,
  MessageSquare,
  BarChart2,
  DollarSign,
  Share2,
  Smartphone,
  Server,
  Code,
  Layers,
  Compass,
  Codesandbox,
  Framer,
  GitBranch,
  Figma,
  Trello,
  Slack,
  Chrome,
  Droplet,
  Feather,
  Film,
  Flag,
  Folder,
  Gift,
  Grid,
  Hash,
  Home,
  Link,
  Monitor,
  Package,
  Paperclip,
  Percent,
  PieChart,
  Play,
  Radio,
  RefreshCw,
  Search,
  Send,
  Settings,
  Star,
  Tag,
  Terminal,
  ThumbsUp,
  Trash,
  TrendingUp,
  Tv,
  Type,
  Umbrella,
  Upload,
  User,
  Watch,
  Wind,
} from "lucide-react"
export type Integration = {
  id: string
  name: string
  description: string
  category: string
  subcategory?: string
  icon: string
  color: string
  developer: string
  rating: number
  reviewCount: number
  price: {
    type: "free" | "paid" | "freemium"
    value?: number
  }
  installCount: number
  releaseDate: string
  lastUpdate: string
  version: string
  tags: string[]
  featured?: boolean
  new?: boolean
  popular?: boolean
  industryFocus?: string[]
}

// 扩展主分类
export const categories = [
  "全部分类",
  "数据分析",
  "营销推广",
  "效率工具",
  "销售管理",
  "财务管理",
  "通信工具",
  "云端服务",
  "安全防护",
  "设计创意",
  "开发工具",
  "人力资源",
  "客户支持",
  "电子商务",
  "社交媒体",
  "内容管理",
  "教育培训",
  "医疗健康",
  "物联网",
  "区块链",
  "人工智能",
  "虚拟现实",
  "增强现实",
  "游戏开发",
  "移动应用",
  "办公自动化",
  "视频处理",
  "音频处理",
  "3D建模",
  "地理信息",
]

/**
 * 主分类联合类型。
 *
 * 由 `categories` 单一数据源派生，禁止另行硬编码枚举，
 * 以消除分类体系「双源冲突」导致的类型安全失效。
 */
export type IntegrationCategory = (typeof categories)[number]

// 扩展子分类
export const subcategories = {
  数据分析: [
    "数据可视化",
    "商业智能",
    "预测分析",
    "大数据处理",
    "报表工具",
    "数据挖掘",
    "实时分析",
    "数据集成",
    "数据清洗",
    "数据标注",
    "数据湖",
    "数据仓库",
  ],
  营销推广: [
    "电子邮件营销",
    "社交媒体营销",
    "内容营销",
    "SEO工具",
    "广告管理",
    "营销自动化",
    "影响者营销",
    "短信营销",
    "推送通知",
    "会员营销",
    "活动管理",
    "落地页优化",
    "A/B测试",
    "转化率优化",
  ],
  效率工具: [
    "项目管理",
    "任务跟踪",
    "文档协作",
    "日程管理",
    "笔记工具",
    "时间跟踪",
    "思维导图",
    "白板协作",
    "流程自动化",
    "知识管理",
    "会议管理",
    "待办事项",
    "文件管理",
    "团队协作",
  ],
  销售管理: [
    "CRM系统",
    "销售自动化",
    "报价管理",
    "销售分析",
    "客户跟踪",
    "销售漏斗",
    "销售预测",
    "销售培训",
    "销售激励",
    "销售地图",
    "销售脚本",
    "销售演示",
    "合同管理",
    "佣金计算",
  ],
  财务管理: [
    "会计软件",
    "发票管理",
    "支付处理",
    "费用跟踪",
    "财务报表",
    "预算规划",
    "税务管理",
    "资产管理",
    "现金流管理",
    "财务预测",
    "工资管理",
    "审计工具",
    "财务分析",
    "投资管理",
    "风险评估",
  ],
  通信工具: [
    "视频会议",
    "团队聊天",
    "电话系统",
    "消息推送",
    "邮件客户端",
    "统一通信",
    "语音通话",
    "屏幕共享",
    "网络研讨会",
    "直播工具",
    "协作白板",
    "即时翻译",
    "语音转文字",
    "远程协助",
  ],
  云端服务: [
    "云存储",
    "服务器管理",
    "容器服务",
    "数据库服务",
    "API管理",
    "无服务器计算",
    "云函数",
    "云安全",
    "云监控",
    "云备份",
    "云迁移",
    "混合云",
    "多云管理",
    "边缘计算",
    "云原生开发",
  ],
  安全防护: [
    "身份验证",
    "数据加密",
    "威胁检测",
    "合规管理",
    "访问控制",
    "漏洞扫描",
    "防火墙",
    "入侵检测",
    "安全审计",
    "终端保护",
    "网络安全",
    "安全培训",
    "密码管理",
    "风险评估",
    "安全运营中心",
  ],
  设计创意: [
    "图形设计",
    "原型设计",
    "3D建模",
    "视频编辑",
    "动画制作",
    "UI设计",
    "UX设计",
    "插图设计",
    "品牌设计",
    "印刷设计",
    "字体设计",
    "色彩管理",
    "设计系统",
    "设计协作",
    "设计资源库",
  ],
  开发工具: [
    "代码管理",
    "CI/CD",
    "测试工具",
    "API工具",
    "开发环境",
    "代码编辑器",
    "调试工具",
    "版本控制",
    "代码审查",
    "文档生成",
    "依赖管理",
    "容器化",
    "微服务",
    "无代码平台",
    "低代码平台",
    "开发框架",
    "SDK工具包",
  ],
  人力资源: [
    "招聘管理",
    "员工管理",
    "绩效评估",
    "薪资管理",
    "培训系统",
    "考勤管理",
    "福利管理",
    "人才发展",
    "员工体验",
    "员工调查",
    "组织结构",
    "继任计划",
    "员工自助",
    "人力分析",
    "远程工作管理",
  ],
  客户支持: [
    "帮助台",
    "聊天机器人",
    "知识库",
    "客户反馈",
    "工单系统",
    "客户门户",
    "社区论坛",
    "实时聊天",
    "视频支持",
    "远程协助",
    "客户满意度",
    "服务水平协议",
    "多渠道支持",
    "自助服务",
    "客户旅程",
  ],
  电子商务: [
    "购物车",
    "库存管理",
    "订单处理",
    "产品目录",
    "支付网关",
    "物流管理",
    "退货管理",
    "会员系统",
    "忠诚度计划",
    "多渠道销售",
    "产品推荐",
    "价格管理",
    "促销管理",
    "市场分析",
    "跨境电商",
  ],
  社交媒体: [
    "社交分析",
    "内容管理",
    "社区管理",
    "社交监控",
    "社交自动化",
    "社交广告",
    "社交电商",
    "社交CRM",
    "社交聆听",
    "社交策划",
    "社交日历",
    "社交评论",
    "社交竞争分析",
    "社交影响力",
    "社交媒体合规",
  ],
  内容管理: [
    "内容创建",
    "内容发布",
    "内容分析",
    "内容策略",
    "内容协作",
    "内容库",
    "内容分发",
    "内容优化",
    "内容翻译",
    "内容审核",
    "内容个性化",
    "内容保护",
    "内容归档",
    "内容搜索",
    "内容工作流",
  ],
  教育培训: [
    "学习管理",
    "课程创建",
    "在线考试",
    "学习分析",
    "虚拟课堂",
    "微课学习",
    "技能评估",
    "认证管理",
    "学习路径",
    "互动学习",
    "游戏化学习",
    "移动学习",
    "社交学习",
    "企业大学",
    "知识图谱",
  ],
  医疗健康: [
    "电子病历",
    "远程医疗",
    "健康监测",
    "医疗分析",
    "药物管理",
    "患者参与",
    "医疗预约",
    "医疗影像",
    "医疗保险",
    "医疗研究",
    "医疗合规",
    "医疗物联网",
    "医疗AI",
    "健康管理",
    "医疗数据交换",
  ],
  物联网: [
    "设备管理",
    "数据采集",
    "远程监控",
    "边缘计算",
    "物联网安全",
    "物联网分析",
    "智能家居",
    "工业物联网",
    "智慧城市",
    "智能农业",
    "智能零售",
    "智能交通",
    "智能能源",
    "物联网平台",
    "物联网连接",
  ],
  区块链: [
    "智能合约",
    "去中心化应用",
    "区块链分析",
    "加密货币",
    "区块链安全",
    "区块链身份",
    "区块链存储",
    "区块链支付",
    "区块链溯源",
    "区块链投票",
    "区块链审计",
    "区块链合规",
    "区块链开发",
    "区块链集成",
    "区块链咨询",
  ],
  人工智能: [
    "机器学习",
    "自然语言处理",
    "计算机视觉",
    "语音识别",
    "推荐系统",
    "预测分析",
    "决策支持",
    "AI自动化",
    "AI助手",
    "AI生成内容",
    "AI翻译",
    "AI标注",
    "AI训练",
    "AI模型管理",
    "AI伦理与治理",
  ],
  虚拟现实: [
    "VR内容创建",
    "VR培训",
    "VR协作",
    "VR展示",
    "VR教育",
    "VR医疗",
    "VR游戏",
    "VR旅游",
    "VR房地产",
    "VR零售",
    "VR会议",
    "VR设计",
    "VR分析",
    "VR平台",
    "VR硬件集成",
  ],
  增强现实: [
    "AR内容创建",
    "AR营销",
    "AR培训",
    "AR导航",
    "AR购物",
    "AR教育",
    "AR医疗",
    "AR游戏",
    "AR工业",
    "AR远程协助",
    "AR试穿试戴",
    "AR展示",
    "AR分析",
    "AR平台",
    "AR硬件集成",
  ],
  游戏开发: [
    "游戏引擎",
    "游戏设计",
    "游戏资产",
    "游戏测试",
    "游戏分析",
    "游戏货币化",
    "游戏社区",
    "游戏发行",
    "游戏本地化",
    "游戏安全",
    "游戏服务器",
    "游戏AI",
    "游戏物理",
    "游戏音效",
    "游戏营销",
  ],
  移动应用: [
    "应用开发",
    "应用设计",
    "应用测试",
    "应用分析",
    "应用优化",
    "应用营销",
    "应用货币化",
    "应用安全",
    "应用集成",
    "应用本地化",
    "应用发布",
    "应用维护",
    "应用反馈",
    "应用评级",
    "应用商店优化",
  ],
  办公自动化: [
    "文档管理",
    "流程自动化",
    "表单处理",
    "电子签名",
    "会议管理",
    "办公协作",
    "办公分析",
    "办公安全",
    "办公集成",
    "办公模板",
    "办公培训",
    "办公支持",
    "办公硬件",
    "办公软件",
    "远程办公",
  ],
  视频处理: [
    "视频编辑",
    "视频转码",
    "视频分析",
    "视频直播",
    "视频存储",
    "视频分发",
    "视频保护",
    "视频搜索",
    "视频字幕",
    "视频特效",
    "视频合成",
    "视频监控",
    "视频会议",
    "视频教学",
    "视频营销",
  ],
  音频处理: [
    "音频编辑",
    "音频转码",
    "音频分析",
    "音频直播",
    "音频存储",
    "音频分发",
    "音频保护",
    "音频搜索",
    "音频转写",
    "音频特效",
    "音频合成",
    "音频监控",
    "音频会议",
    "音频教学",
    "音频营销",
  ],
  "3D建模": [
    "3D设计",
    "3D打印",
    "3D扫描",
    "3D渲染",
    "3D动画",
    "3D可视化",
    "3D协作",
    "3D资产管理",
    "3D模拟",
    "3D分析",
    "3D展示",
    "3D培训",
    "3D原型",
    "3D游戏",
    "3D虚拟现实",
  ],
  地理信息: [
    "地图服务",
    "位置分析",
    "路线规划",
    "地理编码",
    "地理围栏",
    "地理标记",
    "地理可视化",
    "地理数据",
    "地理搜索",
    "地理监控",
    "地理协作",
    "地理分享",
    "地理集成",
    "地理安全",
    "地理合规",
  ],
}

// 行业分类
export const industries = [
  "全部行业",
  "金融服务",
  "医疗健康",
  "教育培训",
  "零售电商",
  "制造业",
  "物流运输",
  "房地产",
  "旅游酒店",
  "媒体娱乐",
  "科技IT",
  "能源环保",
  "农业食品",
  "政府公共",
  "非营利组织",
  "专业服务",
  "建筑工程",
  "汽车行业",
  "电信通讯",
  "法律服务",
]

// 企业规模
export const companyScales = ["全部规模", "初创企业", "小型企业", "中型企业", "大型企业", "跨国公司"]

// 部署方式
export const deploymentTypes = ["全部部署方式", "云端部署", "本地部署", "混合部署", "私有云", "公有云", "边缘部署"]

// 集成方式
export const integrationMethods = [
  "全部集成方式",
  "API集成",
  "插件集成",
  "无代码集成",
  "低代码集成",
  "SDK集成",
  "数据同步",
  "事件触发",
  "批量处理",
  "实时集成",
]

// 数据安全等级
export const securityLevels = ["全部安全等级", "基础安全", "增强安全", "高级安全", "企业级安全", "合规认证"]

export const iconMap = {
  Zap,
  ShoppingCart,
  BarChart,
  Mail,
  Calendar,
  ArrowRight,
  FileText,
  CreditCard,
  Phone,
  Video,
  Cloud,
  Globe,
  Shield,
  Camera,
  Music,
  Book,
  Briefcase,
  Coffee,
  Cpu,
  Database,
  Headphones,
  Heart,
  ImageIcon,
  Key,
  Laptop,
  Map,
  Printer,
  Rocket,
  Scissors,
  Truck,
  Wifi,
  Users,
  Bookmark,
  PenToolIcon,
  MessageSquare,
  BarChart2,
  DollarSign,
  Share2,
  Smartphone,
  Server,
  Code,
  Layers,
  Compass,
  Codesandbox,
  Framer,
  GitBranch,
  Figma,
  Trello,
  Slack,
  Chrome,
  Droplet,
  Feather,
  Film,
  Flag,
  Folder,
  Gift,
  Grid,
  Hash,
  Home,
  Link,
  Monitor,
  Package,
  Paperclip,
  Percent,
  PieChart,
  Play,
  Radio,
  RefreshCw,
  Search,
  Send,
  Settings,
  Star,
  Tag,
  Terminal,
  ThumbsUp,
  Trash,
  TrendingUp,
  Tv,
  Type,
  Umbrella,
  Upload,
  User,
  Watch,
  Wind,
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

/** 确定性随机数生成函数签名 */
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

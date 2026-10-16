/**
 * 集成应用数据集聚合出口（L-4：自 1125 行单文件 integrations.ts 拆分）。
 *
 * 目录 index 与原单文件路径 `@/app/data/integrations` 完全兼容，
 * 35 处消费方零改动。各模块职责：
 * - types.ts       ：Integration 核心类型
 * - categories.ts  ：主分类/子分类元数据 + ALL_CATEGORY 哨兵
 * - filters.ts     ：行业/规模/部署/集成方式/安全等级筛选维度
 * - icons.ts       ：lucide 图标注册表
 * - generator.ts   ：确定性数据集生成器（种子/时间基准/价格上限常量）
 */
export type { Integration } from "./types"
export {
  ALL_CATEGORY,
  categories,
  subcategories,
  type IntegrationCategory,
} from "./categories"
export {
  industries,
  companyScales,
  deploymentTypes,
  integrationMethods,
  securityLevels,
} from "./filters"
export { iconMap } from "./icons"
export {
  createSeededRandom,
  integrations,
  INTEGRATIONS_REFERENCE_DATE,
  INTEGRATIONS_SEED,
  PRICE_FILTER_MAX,
  type RandomFn,
} from "./generator"

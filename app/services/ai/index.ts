import { EnsembleEngine } from "./core/ensemble-engine"
import { LearningEngine } from "./core/learning-engine"
import { MODEL_CONFIGS } from "./config/model-configs"
import type { EnsembleConfig } from "./types/ai-types"

/**
 * 构建集成引擎的默认配置。
 *
 * 将 `MODEL_CONFIGS.ensemble.default`（纯超参数）补齐 `BaseConfig`
 * 所需的运行期元信息（id / version / timestamp），得到合法的
 * {@link EnsembleConfig}，避免在调用处硬编码散落字段。
 */
function createDefaultEnsembleConfig(): EnsembleConfig {
  return {
    ...MODEL_CONFIGS.ensemble.default,
    id: "ensemble:default",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  } as EnsembleConfig
}

export { EnsembleEngine } from "./core/ensemble-engine"
export { LearningEngine } from "./core/learning-engine"
export { BasePredictor } from "./core/models/base-predictor"
export * from "./types/ai-types"
export { MODEL_CONFIGS, TRAINING_PARAMS } from "./config/model-configs"

/**
 * AI 引擎聚合实例。
 *
 * 收敛集成中心所需的本地推理能力：多模型集成预测（ensemble）与
 * 在线学习（learning）。
 *
 * 注: 原云端推荐/行为分析服务（第三方 AI SDK）已随依赖移除，
 * 对应能力由本地 ensemble 引擎与 `app/services/ai-assistant/` 提供。
 */
export interface AIEngine {
  /** 多模型集成预测引擎 */
  ensemble: EnsembleEngine
  /** 在线学习引擎 */
  learning: LearningEngine
}

let aiEngineInstance: AIEngine | null = null

/**
 * 创建（或复用）AI 引擎单例。
 *
 * 使用静态 ES Module 导入而非动态 `require`，保证构建期即可完成 TreeShaking
 * 与循环依赖检测。实例在首次调用时惰性创建，避免模块加载阶段产生副作用。
 *
 * @returns 已初始化的 {@link AIEngine} 单例
 */
export function createAIEngine(): AIEngine {
  if (!aiEngineInstance) {
    aiEngineInstance = {
      ensemble: new EnsembleEngine(createDefaultEnsembleConfig()),
      learning: new LearningEngine(),
    }
  }

  return aiEngineInstance
}

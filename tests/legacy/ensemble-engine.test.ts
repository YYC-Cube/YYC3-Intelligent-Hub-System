/**
 * EnsembleEngine 单元测试（M-1：自 app/services/ai/tests/ 迁移至 vitest）。
 *
 * 原文件位于 app/services/ai/tests/，由 jest 的全仓 testMatch 接管；
 * vitest include 为 `tests/**`，故迁移至本目录统一纳管。
 */
import { EnsembleEngine } from "@/app/services/ai/core/ensemble-engine"
import type { EnsembleConfig, PredictionData } from "@/app/services/ai/types/ai-types"
import { beforeEach, describe, expect, it } from "vitest"

describe("EnsembleEngine", () => {
  let engine: EnsembleEngine
  let mockConfig: EnsembleConfig
  let mockData: PredictionData

  beforeEach(() => {
    mockConfig = {
      id: "test-ensemble",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      type: "stacking",
      basePredictors: ["arima", "lstm", "prophet"],
      metaLearner: "gradient_boosting",
      diversityThreshold: 0.7,
      crossValidationFolds: 5,
    }

    mockData = {
      features: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
      targets: [10, 20, 30],
      timestamps: ["2024-01-01", "2024-01-02", "2024-01-03"],
    }

    engine = new EnsembleEngine(mockConfig)
  })

  describe("initialization", () => {
    it("should initialize with correct config", () => {
      expect(engine["config"]).toEqual(mockConfig)
    })

    it("should initialize base predictors", async () => {
      await engine["initializeBasePredictors"]()
      expect(engine["basePredictors"].size).toBeGreaterThan(0)
    })
  })

  describe("training", () => {
    it("should train model successfully", async () => {
      const result = await engine.train(mockData)
      expect(result.success).toBe(true)
      expect(result.accuracy).toBeGreaterThan(0)
      expect(result.modelId).toBeDefined()
    })

    it("should handle empty data", async () => {
      const emptyData = { features: [], targets: [] }
      await expect(engine.train(emptyData)).rejects.toThrow()
    })
  })

  describe("prediction", () => {
    beforeEach(async () => {
      await engine.train(mockData)
    })

    it("should make predictions", async () => {
      const result = await engine.predict(mockData, 5)
      expect(result.predictions).toHaveLength(5)
      expect(result.confidence).toBeGreaterThanOrEqual(0)
      expect(result.confidence).toBeLessThanOrEqual(1)
    })

    it("should calculate ensemble confidence", () => {
      const basePredictions = [
        { predictions: [1, 2, 3], confidence: 0.8 },
        { predictions: [1.1, 2.1, 3.1], confidence: 0.9 },
      ]
      const confidence = engine["calculateEnsembleConfidence"](basePredictions)
      expect(confidence).toBeGreaterThan(0)
      expect(confidence).toBeLessThanOrEqual(1)
    })
  })

  describe("diversity calculation", () => {
    it("should calculate prediction diversity", () => {
      const pred1 = [1, 2, 3]
      const pred2 = [1.1, 2.1, 3.1]
      const diversity = engine["calculatePredictionDiversity"](pred1, pred2)
      expect(diversity).toBeGreaterThanOrEqual(0)
      expect(diversity).toBeLessThanOrEqual(1)
    })

    it("should handle identical predictions", () => {
      const pred1 = [1, 2, 3]
      const pred2 = [1, 2, 3]
      const diversity = engine["calculatePredictionDiversity"](pred1, pred2)
      expect(diversity).toBe(0)
    })
  })

  describe("data preprocessing", () => {
    it("should normalize features", async () => {
      const features = [
        [1, 2],
        [3, 4],
        [5, 6],
      ]
      const normalized = await engine["normalizeFeatures"](features)

      expect(normalized).toHaveLength(features.length)
      expect(normalized[0]).toHaveLength(features[0].length)

      // 检查值域
      const flat = normalized.flat()
      expect(Math.min(...flat)).toBeGreaterThanOrEqual(-3)
      expect(Math.max(...flat)).toBeLessThanOrEqual(3)
    })
  })
})

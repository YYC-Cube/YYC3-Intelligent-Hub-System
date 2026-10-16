/**
 * M-8：加权相关度评分（共享纯函数）。
 *
 * 「相关性」排序此前为空实现（与默认顺序无异），本函数为其提供真实语义：
 * 命中权重 `name > tags > description`，同字段内越靠前命中得分越高。
 * 返回 0 表示无命中；调用方应以稳定排序保持无命中项的原有顺序。
 */

/** 参与相关度评分的字段（搜索页与浏览器组件共用的最小形状）。 */
export interface RelevanceCandidate {
  /** 应用名称 */
  name: string
  /** 标签列表 */
  tags: string[]
  /** 方案简介 */
  description: string
}

/**
 * 计算候选条目相对查询词的加权相关度得分。
 *
 * @param query - 用户输入的查询词（原始大小写均可，内部统一小写比较）
 * @param candidate - 候选条目（name / tags / description）
 * @returns 得分：name 前缀命中 100 ＞ name 包含 60 ＞ tag 全等 40 ＞ tag 包含 25 ＞ 简介包含 10；无命中为 0
 */
export function relevanceScore(query: string, candidate: RelevanceCandidate): number {
  const q = query.trim().toLowerCase()
  if (!q) return 0

  const name = candidate.name.toLowerCase()
  const tags = candidate.tags.map((tag) => tag.toLowerCase())
  const description = candidate.description.toLowerCase()

  let score = 0
  if (name.startsWith(q)) score += 100
  else if (name.includes(q)) score += 60

  if (tags.some((tag) => tag === q)) score += 40
  else if (tags.some((tag) => tag.includes(q))) score += 25

  if (description.includes(q)) score += 10

  return score
}

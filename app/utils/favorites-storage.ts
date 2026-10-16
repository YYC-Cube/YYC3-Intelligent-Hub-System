/**
 * 收藏持久化数据解析（阶段 2 全维度测试：对抗性输入守卫）。
 *
 * 背景：favorites-context 从存储适配器读出的值经过 `JSON.parse` 后
 * 直接进入 React 状态。若持久化数据损坏为「合法 JSON 但非字符串数组」
 * （如 `123`、`{"a":1}`、`"text"`），渲染路径的 `favorites.includes(...)`
 * 将抛出 TypeError 导致整页崩溃。
 *
 * 本帮助函数是渲染路径前的唯一类型守卫：任何输入都收敛为 `string[]`，
 * 幽灵 id（不存在于数据集的收藏）按业务约定放行——展示层由
 * `favoritesData` 的交集过滤自然排除。
 */

/**
 * 将任意持久化输入规整为字符串数组。
 *
 * 规则：
 * - 数组 → 过滤保留字符串元素（数字 id 等脏元素丢弃）；
 * - 字符串 → 尝试 `JSON.parse` 后递归规整，解析失败返回空数组；
 * - 其余类型（number / object / null / undefined / boolean）→ 空数组。
 *
 * @param value - 存储层读出的任意值（含解密后的二次解析结果）
 * @returns 可安全进入 React 状态的字符串数组
 */
export function parseStoredFavorites(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string")
  }

  if (typeof value === "string") {
    try {
      return parseStoredFavorites(JSON.parse(value) as unknown)
    } catch {
      // 非 JSON 文本：整体视为损坏数据，回退空集合
      return []
    }
  }

  return []
}

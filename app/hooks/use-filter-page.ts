import { useState } from "react"

/**
 * 分页页码状态 —— 筛选依赖变化时自动重置回第 1 页。
 *
 * 全站唯一「筛选 → 页码重置」机制（交互规范禁令第 1 条的配套基建），
 * 业务禁止再手写 setCurrentPage(1)。采用 React 官方「渲染期间调整状态」
 * 模式（替代 effect 副作用）：同步无闪帧、不产生额外渲染轮次。
 *
 * 依赖数组按元素 Object.is 逐项比对（数组本身每轮新建不影响判定），
 * 天然覆盖三类筛选来源：
 * - 本地 state：搜索输入、排序、子分类 Tab
 * - URL 参数：router.push 新搜索（组件不重挂载）、动态路由 param 导航
 * - 父组件 props：source 等数据源切换
 *
 * @param deps 筛选依赖列表（参与筛选的全部原始值 / 稳定引用）
 * @returns [页码, 设置页码] —— setPage 仅用于分页组件 onPageChange
 */
export function useFilterPage(deps: readonly unknown[]): [number, (page: number) => void] {
  const [page, setPage] = useState(1)
  const [prevDeps, setPrevDeps] = useState<readonly unknown[]>(deps)

  const changed =
    prevDeps.length !== deps.length ||
    deps.some((dep, index) => !Object.is(dep, prevDeps[index]))
  if (changed) {
    setPrevDeps(deps)
    setPage(1)
  }

  return [page, setPage] as const
}

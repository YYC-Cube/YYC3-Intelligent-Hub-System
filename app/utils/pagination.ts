/**
 * 分页页码窗口工具（H-3）。
 *
 * 自 `integration-browser` 抽取为共享纯函数，供应用市场浏览页与
 * 搜索结果页共用同一窗口化分页交互，避免百页级列表全量渲染页码按钮。
 */

/**
 * 计算分页页码窗口。
 *
 * 当总页数较多时，仅返回当前页附近的连续页码，避免一次性渲染上百个按钮。
 * 越界的当前页会被收敛到首/末页窗口。
 *
 * @param currentPage - 当前页码（从 1 开始，越界值会被收敛）
 * @param totalPages - 总页数
 * @param windowSize - 窗口内展示的页码数量，默认 5
 * @returns 需要渲染的页码数组（升序、连续）
 */
export function buildPageWindow(currentPage: number, totalPages: number, windowSize = 5): number[] {
  if (totalPages <= windowSize) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const half = Math.floor(windowSize / 2)
  let start = Math.max(1, currentPage - half)
  const end = Math.min(totalPages, start + windowSize - 1)
  start = Math.max(1, end - windowSize + 1)

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

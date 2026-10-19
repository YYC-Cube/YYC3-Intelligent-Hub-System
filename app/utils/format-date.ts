import { format } from "date-fns"
import { enUS, zhCN } from "date-fns/locale"

/**
 * 按 UI 语言格式化日期时间（zh-CN: 2026年10月19日 14:30 / en: Oct 19, 2026 14:30）。
 * @param value Date 对象或 ISO 日期字符串
 * @param locale 当前 UI 语言
 */
export function formatDateTime(value: Date | string | number, locale = "zh-CN"): string {
  const isEn = locale.startsWith("en")
  return format(new Date(value), isEn ? "MMM d, yyyy HH:mm" : "yyyy年MM月dd日 HH:mm", {
    locale: isEn ? enUS : zhCN,
  })
}

/**
 * 按 UI 语言格式化日期（zh-CN: 2026年10月19日 / en: Oct 19, 2026）。
 * @param value Date 对象或 ISO 日期字符串
 * @param locale 当前 UI 语言
 */
export function formatDateOnly(value: Date | string | number, locale = "zh-CN"): string {
  const isEn = locale.startsWith("en")
  return format(new Date(value), isEn ? "MMM d, yyyy" : "yyyy年MM月dd日", {
    locale: isEn ? enUS : zhCN,
  })
}

/**
 * 格式化日期为本地化字符串
 * @param dateString ISO格式的日期字符串
 * @param locale 区域设置，默认为中文
 * @returns 格式化后的日期字符串
 */
export function formatDate(dateString: string | undefined, locale = "zh-CN"): string {
  if (!dateString) return "未知日期"

  try {
    const date = new Date(dateString)

    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return "日期格式无效"
    }

    // 格式化日期
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch (error) {
    console.error("日期格式化错误:", error)
    return "日期格式化错误"
  }
}

/**
 * 计算相对时间（例如：3天前，2小时前）
 * @param dateString ISO格式的日期字符串
 * @returns 相对时间字符串
 */
export function getRelativeTimeString(dateString: string | undefined): string {
  if (!dateString) return "未知时间"

  try {
    const date = new Date(dateString)
    const now = new Date()

    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return "日期格式无效"
    }

    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    // 不同时间单位的秒数
    const minute = 60
    const hour = minute * 60
    const day = hour * 24
    const week = day * 7
    const month = day * 30
    const year = day * 365

    // 根据时间差返回相应的相对时间字符串
    if (diffInSeconds < minute) {
      return `${diffInSeconds} 秒前`
    } else if (diffInSeconds < hour) {
      const minutes = Math.floor(diffInSeconds / minute)
      return `${minutes} 分钟前`
    } else if (diffInSeconds < day) {
      const hours = Math.floor(diffInSeconds / hour)
      return `${hours} 小时前`
    } else if (diffInSeconds < week) {
      const days = Math.floor(diffInSeconds / day)
      return `${days} 天前`
    } else if (diffInSeconds < month) {
      const weeks = Math.floor(diffInSeconds / week)
      return `${weeks} 周前`
    } else if (diffInSeconds < year) {
      const months = Math.floor(diffInSeconds / month)
      return `${months} 个月前`
    } else {
      const years = Math.floor(diffInSeconds / year)
      return `${years} 年前`
    }
  } catch (error) {
    console.error("相对时间计算错误:", error)
    return "时间计算错误"
  }
}

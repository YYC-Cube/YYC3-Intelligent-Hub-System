import "@testing-library/jest-dom/vitest"
import { afterEach, vi } from "vitest"
import { cleanup } from "@testing-library/react"

// ---------------------------------------------------------------------------
// i18n 确定性语言环境（zh-CN）
//
// `@yyc3/i18n-core` 的 I18nEngine 在构造期经 resolveInitialLocale() →
// resolveNavigatorLocale() 读取 navigator.languages/language，
// 会覆盖实例化时显式传入的 locale 配置。
// jsdom 的 navigator 默认 en-US，导致测试渲染英文、与用例中文断言冲突。
// setupFiles 先于测试文件的应用模块导入执行，此处钉死 navigator 语言。
// ---------------------------------------------------------------------------
Object.defineProperty(window.navigator, "languages", {
  value: ["zh-CN", "zh"],
  configurable: true,
})
Object.defineProperty(window.navigator, "language", {
  value: "zh-CN",
  configurable: true,
})

afterEach(() => {
  cleanup()
})

// ---------------------------------------------------------------------------
// next/link -> 原生 <a>（jsdom 无 Next Router Context）
// ---------------------------------------------------------------------------
vi.mock("next/link", async () => {
  const React = await import("react")
  return {
    __esModule: true,
    default: React.forwardRef(function Link(props: any, ref: any) {
      const { href, children, ...rest } = props ?? {}
      const url = typeof href === "string" ? href : (href?.pathname ?? "#")
      return React.createElement("a", { href: url, ref, ...rest }, children)
    }),
  }
})

// ---------------------------------------------------------------------------
// framer-motion -> 静态透传（避免 jsdom 下动画/布局测量报错）
// ---------------------------------------------------------------------------
vi.mock("framer-motion", async () => {
  const React = await import("react")
  const OMIT = new Set([
    "initial",
    "animate",
    "exit",
    "transition",
    "variants",
    "whileHover",
    "whileTap",
    "whileInView",
    "whileFocus",
    "whileDrag",
    "layout",
    "layoutId",
    "drag",
    "dragConstraints",
    "viewport",
    "onAnimationComplete",
    "onAnimationStart",
    "onHoverStart",
    "onHoverEnd",
  ])
  const make = (tag: string) =>
    React.forwardRef(function Motion(props: any, ref: any) {
      const rest: Record<string, unknown> = {}
      for (const key in props) {
        if (!OMIT.has(key)) rest[key] = props[key]
      }
      // framer-motion 专有 hover 回调映射为原生事件，便于测试触发
      if (typeof props.onHoverStart === "function") rest.onMouseEnter = props.onHoverStart
      if (typeof props.onHoverEnd === "function") rest.onMouseLeave = props.onHoverEnd
      return React.createElement(tag, { ...rest, ref })
    })
  const motion = new Proxy(
    {},
    {
      get: (_target, key) => (typeof key === "symbol" ? undefined : make(String(key))),
    },
  )
  return {
    __esModule: true,
    motion: motion as any,
    AnimatePresence: ({ children }: any) => children ?? null,
    useAnimation: () => ({ start: async () => {}, stop: () => {} }),
    useInView: () => true,
    useReducedMotion: () => false,
  }
})

// ---------------------------------------------------------------------------
// 浏览器 API polyfill
// ---------------------------------------------------------------------------
if (!("ResizeObserver" in globalThis)) {
  ;(globalThis as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

if (!("IntersectionObserver" in globalThis)) {
  ;(globalThis as any).IntersectionObserver = class {
    root = null
    rootMargin = ""
    thresholds: number[] = []
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }
}

if (typeof window !== "undefined") {
  if (typeof window.matchMedia !== "function") {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    })
  }

  window.scrollTo = (() => {}) as any

  const proto = window.Element?.prototype as any
  if (proto) {
    if (!proto.scrollIntoView) proto.scrollIntoView = () => {}
    if (!proto.hasPointerCapture) proto.hasPointerCapture = () => false
    if (!proto.setPointerCapture) proto.setPointerCapture = () => {}
    if (!proto.releasePointerCapture) proto.releasePointerCapture = () => {}
  }
}

if (!(globalThis as any).TextEncoder) {
  // @ts-expect-error node util 与 DOM 类型不完全一致
  ;(globalThis as any).TextEncoder = (await import("node:util")).TextEncoder
}
if (!(globalThis as any).TextDecoder) {
  // @ts-expect-error node util 与 DOM 类型不完全一致
  ;(globalThis as any).TextDecoder = (await import("node:util")).TextDecoder
}

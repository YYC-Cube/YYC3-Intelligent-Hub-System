import type { Config } from 'tailwindcss';

// YYC³ 集成中心系统 · 唯一真源映射层
// 规范：色值只存在于 app/globals.css 的 CSS 变量中，此处仅做 hsl() 包装映射
const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── shadcn 语义层 ─────────────────────────────────────
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        // ── 功能色：业务状态一令牌一态（集成运行中=success / 同步失败=destructive / 提示=info） ──
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },

        // ── YYC³ 品牌色阶（蓝→靛→紫渐变体系的色阶化落点，hover 用 brand-600 这类确定色阶） ──
        brand: {
          50: 'hsl(var(--brand-50))',
          100: 'hsl(var(--brand-100))',
          200: 'hsl(var(--brand-200))',
          300: 'hsl(var(--brand-300))',
          400: 'hsl(var(--brand-400))',
          500: 'hsl(var(--brand-500))',
          600: 'hsl(var(--brand-600))',
          700: 'hsl(var(--brand-700))',
          800: 'hsl(var(--brand-800))',
          900: 'hsl(var(--brand-900))',
          950: 'hsl(var(--brand-950))',
        },

        // ── 图表色 ────────────────────────────────────────────
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },

      // ── 字号：补微字号 2xs（10px）+ 卡片语义字号（唯一真源，禁止再用同值 text-sm/text-xs 混用） ──
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        'card-title': ['0.9375rem', { lineHeight: '1.375rem', fontWeight: '600' }], // 15/22
        'card-body': ['0.8125rem', { lineHeight: '1.125rem' }], // 13/18
        'card-meta': ['0.75rem', { lineHeight: '1rem' }], // 12/16
        'card-chip': ['0.6875rem', { lineHeight: '1rem' }], // 11/16
      },

      // ── 圆角：以 --radius 为基的完整五级 ──────────────────
      borderRadius: {
        sm: 'calc(var(--radius) - 4px)',
        DEFAULT: 'calc(var(--radius) - 2px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
      },

      // ── 阴影：统一品牌层级（消除 shadow-[...] 魔法值） ────
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        glow: 'var(--brand-glow)',
      },

      // ── 布局：容器/结构尺寸令牌（页面宽度归一） ───────────
      maxWidth: {
        page: '80rem', // 页面主容器（1280px）
        content: '48rem', // 阅读型内容（768px）
        form: '28rem', // 表单/对话框（448px）
      },
      height: {
        header: '4rem',
      },

      // ── z-index：统一层级刻度 ─────────────────────────────
      zIndex: {
        dropdown: '1000',
        sticky: '1020',
        fixed: '1030',
        backdrop: '1040',
        modal: '1050',
        popover: '1060',
        tooltip: '1070',
        toast: '1080',
      },

      // ── 动效：统一时长与缓动（唯一真源见 globals.css 的 --motion-*） ──
      transitionDuration: {
        instant: 'var(--motion-duration-instant)',
        fast: 'var(--motion-duration-fast)',
        base: 'var(--motion-duration-base)',
        slow: 'var(--motion-duration-slow)',
        exit: 'var(--motion-duration-exit)',
      },
      transitionTimingFunction: {
        standard: 'var(--motion-ease-standard)',
        enter: 'var(--motion-ease-enter)',
        exit: 'var(--motion-ease-exit)',
        emphasized: 'var(--motion-ease-emphasized)',
        // 兼容旧类名，取值收敛到 standard
        brand: 'var(--motion-ease-standard)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'yyc3-fade-up': {
          from: { opacity: '0', transform: 'translate3d(0, var(--motion-distance-sm), 0)' },
          to: { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        'yyc3-skeleton': {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        'yyc3-typing': {
          '0%, 60%, 100%': { opacity: '0.35', transform: 'translate3d(0, 0, 0)' },
          '30%': { opacity: '1', transform: 'translate3d(0, -2px, 0)' },
        },
        'caret-blink': {
          '0%, 70%, 100%': { opacity: '1' },
          '20%, 50%': { opacity: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down var(--motion-duration-base) var(--motion-ease-standard)',
        'accordion-up': 'accordion-up var(--motion-duration-base) var(--motion-ease-standard)',
        'fade-up': 'yyc3-fade-up var(--motion-duration-base) var(--motion-ease-enter) both',
        'page-enter': 'yyc3-fade-up var(--motion-duration-base) var(--motion-ease-enter) both',
        skeleton: 'yyc3-skeleton 1.6s var(--motion-ease-standard) infinite',
        typing: 'yyc3-typing 1.2s var(--motion-ease-standard) infinite',
        'caret-blink': 'caret-blink 1.2s step-end infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;

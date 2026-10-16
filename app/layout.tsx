import type React from "react"
import "./globals.css"
// 添加正确的设计系统CSS导入
import "./styles/design-system.css"
import type { Metadata, Viewport } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { FavoritesProvider } from "./context/favorites-context"
import { AuthProvider } from "./context/auth-context"
import { EncryptionProvider } from "./context/encryption-context"
import { integrations } from "./data/integrations"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "./components/error-handling/error-boundary"
import { I18nBootstrap } from "./components/i18n/i18n-bootstrap"
import { BRAND, ICON_BASE, THEME_COLORS, brandAssets } from "@/lib/yyc3/brand"

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.siteUrl),
  title: {
    default: `${BRAND.name} - ${BRAND.shortName}`,
    template: `%s | ${BRAND.shortName}`,
  },
  description: BRAND.description,
  applicationName: BRAND.name,
  generator: BRAND.slug,

  // 全端图标接入：路径统一取自 lib/yyc3/brand.ts，禁止在此硬编码
  manifest: brandAssets.manifest,
  icons: {
    icon: [
      { url: brandAssets.favicon, sizes: "48x48", type: "image/x-icon" },
      { url: `${ICON_BASE}/favicon/favicon-16x16.png`, sizes: "16x16", type: "image/png" },
      { url: `${ICON_BASE}/favicon/favicon-32x32.png`, sizes: "32x32", type: "image/png" },
      { url: `${ICON_BASE}/favicon/favicon-96x96.png`, sizes: "96x96", type: "image/png" },
      { url: brandAssets.logoPng, sizes: "512x512", type: "image/png" },
    ],
    shortcut: brandAssets.favicon,
    apple: [{ url: brandAssets.appleTouchIcon, sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: BRAND.shortName,
    statusBarStyle: "default",
  },

  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: BRAND.siteUrl,
    siteName: BRAND.name,
    title: BRAND.name,
    description: BRAND.description,
    images: [
      {
        url: brandAssets.family,
        alt: BRAND.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND.name,
    description: BRAND.description,
    images: [brandAssets.family],
  },

  robots: { index: true, follow: true },

  // M-11：静态导出无法设置 HTTP Referrer-Policy 响应头，以 meta 等价声明。
  // 与 public/_headers 的部署层策略保持一致。
  other: {
    referrer: "strict-origin-when-cross-origin",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLORS.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLORS.dark },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <I18nBootstrap />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ErrorBoundary>
            <AuthProvider>
              <EncryptionProvider>
                <FavoritesProvider integrations={integrations}>
                  {children}
                  <Toaster />
                </FavoritesProvider>
              </EncryptionProvider>
            </AuthProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}
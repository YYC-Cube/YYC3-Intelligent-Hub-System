/**
 * 集成应用核心类型（L-4：自 integrations.ts 拆分）。
 */
export type Integration = {
  id: string
  name: string
  description: string
  category: string
  subcategory?: string
  icon: string
  color: string
  developer: string
  rating: number
  reviewCount: number
  price: {
    type: "free" | "paid" | "freemium"
    value?: number
  }
  installCount: number
  releaseDate: string
  lastUpdate: string
  version: string
  tags: string[]
  featured?: boolean
  new?: boolean
  popular?: boolean
  industryFocus?: string[]
}

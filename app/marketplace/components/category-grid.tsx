"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { dataCat } from "@/lib/yyc3/i18n/data"
import {
  BarChart,
  Cloud,
  Code,
  CreditCard,
  HeadphonesIcon,
  Mail,
  MessageSquare,
  Palette,
  Share2,
  Shield,
  ShoppingBag,
  ShoppingCart,
  UserCheck,
  Users,
} from "lucide-react"
import Link from "next/link"

interface CategoryGridProps {
  categories: string[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  // 为每个类别分配图标
  const categoryIcons: Record<string, React.ReactNode> = {
    数据分析: <BarChart className="w-5 h-5 md:w-6 md:h-6" />,
    营销推广: <Mail className="w-5 h-5 md:w-6 md:h-6" />,
    效率工具: <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />,
    销售管理: <Users className="w-5 h-5 md:w-6 md:h-6" />,
    财务管理: <CreditCard className="w-5 h-5 md:w-6 md:h-6" />,
    通信工具: <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />,
    云端服务: <Cloud className="w-5 h-5 md:w-6 md:h-6" />,
    安全防护: <Shield className="w-5 h-5 md:w-6 md:h-6" />,
    设计创意: <Palette className="w-5 h-5 md:w-6 md:h-6" />,
    开发工具: <Code className="w-6 h-6 text-muted-foreground" />,
    人力资源: <UserCheck className="w-5 h-5 md:w-6 md:h-6" />,
    客户支持: <HeadphonesIcon className="w-5 h-5 md:w-6 md:h-6" />,
    电子商务: <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />,
    社交媒体: <Share2 className="w-5 h-5 md:w-6 md:h-6" />,
  }

  return (
    // 移动端单行横向滚动（避免 29 个磁贴纵向堆叠近 2000px）；
    // 桌面端 md 起转为 4 列网格，首页仅传入前 8 个分类。
    <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0 md:pb-0">
      {categories.map((category) => (
        <div key={category} className="w-[124px] shrink-0 md:w-auto">
          <Link href={`/marketplace/category/${encodeURIComponent(category)}`}>
            <Card className="group h-full hover:border-primary/50 transition-colors duration-base ease-standard">
              <CardContent className="p-3 md:p-4 flex flex-col items-center text-center">
                {/* 分类图标统一中性色，hover 转主色：语义色仅用于状态，避免装饰化 */}
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-muted flex items-center justify-center mb-2 md:mb-3 text-muted-foreground transition-colors group-hover:text-primary">
                  {categoryIcons[category] || <BarChart className="w-5 h-5 md:w-6 md:h-6" />}
                </div>
                <h3 className="text-xs md:text-sm font-medium">{dataCat(category)}</h3>
              </CardContent>
            </Card>
          </Link>
        </div>
      ))}
    </div>
  )
}

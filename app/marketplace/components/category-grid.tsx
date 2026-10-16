"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  BarChart,
  Mail,
  ShoppingCart,
  Users,
  CreditCard,
  MessageSquare,
  Cloud,
  Shield,
  Palette,
  Code,
  UserCheck,
  HeadphonesIcon,
  ShoppingBag,
  Share2,
} from "lucide-react"
import { dataCat } from "@/lib/yyc3/i18n/data"

interface CategoryGridProps {
  categories: string[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  // 为每个类别分配图标
  const categoryIcons: Record<string, React.ReactNode> = {
    数据分析: <BarChart className="w-6 h-6 text-blue-600" />,
    营销推广: <Mail className="w-6 h-6 text-green-600" />,
    效率工具: <ShoppingCart className="w-6 h-6 text-purple-600" />,
    销售管理: <Users className="w-6 h-6 text-red-600" />,
    财务管理: <CreditCard className="w-6 h-6 text-yellow-600" />,
    通信工具: <MessageSquare className="w-6 h-6 text-pink-600" />,
    云端服务: <Cloud className="w-6 h-6 text-cyan-600" />,
    安全防护: <Shield className="w-6 h-6 text-orange-600" />,
    设计创意: <Palette className="w-6 h-6 text-indigo-600" />,
    开发工具: <Code className="w-6 h-6 text-gray-600" />,
    人力资源: <UserCheck className="w-6 h-6 text-teal-600" />,
    客户支持: <HeadphonesIcon className="w-6 h-6 text-amber-600" />,
    电子商务: <ShoppingBag className="w-6 h-6 text-lime-600" />,
    社交媒体: <Share2 className="w-6 h-6 text-rose-600" />,
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {categories.map((category) => (
        <motion.div key={category} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400 }}>
          <Link href={`/marketplace/category/${encodeURIComponent(category)}`}>
            <Card className="h-full hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  {categoryIcons[category] || <BarChart className="w-6 h-6 text-gray-600" />}
                </div>
                <h3 className="text-sm font-medium">{dataCat(category)}</h3>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

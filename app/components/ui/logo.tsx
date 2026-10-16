import Image from "next/image"
import Link from "next/link"

import { BRAND, brandAssets } from "@/lib/yyc3/brand"

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-3 group">
      <div className="relative w-12 h-12 overflow-hidden transition-transform duration-300 group-hover:scale-110">
        <Image
          src={brandAssets.logoPng}
          alt={BRAND.name}
          width={48}
          height={48}
          className="object-contain drop-shadow-lg"
        />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-lg leading-tight bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
          言语云³集成中心系统
        </span>
        <span className="text-xs text-muted-foreground leading-tight font-medium">YY C³-IC</span>
      </div>
    </Link>
  )
}

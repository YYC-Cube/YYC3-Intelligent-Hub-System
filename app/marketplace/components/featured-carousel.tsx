"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star, Calendar } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import type { Integration } from "@/app/data/integrations"
import { iconMap } from "@/app/data/integrations"
import { useI18n } from "@/app/hooks/use-i18n"
import { dataIntegrationDesc, dataIntegrationName } from "@/lib/yyc3/i18n/data"

interface FeaturedCarouselProps {
  integrations: Integration[]
}

export function FeaturedCarousel({ integrations }: FeaturedCarouselProps) {
  const { t } = useI18n()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % integrations.length)
  }

  const handlePrevious = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + integrations.length) % integrations.length)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  const integration = integrations[currentIndex]
  const Icon = integration?.icon ? iconMap[integration.icon as keyof typeof iconMap] : Calendar

  if (!integration) return null

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold mb-6">{t("marketplace.特色集成")}</h2>

      <div className="relative overflow-hidden rounded-xl">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full"
          >
            <Card className="border-0 shadow-lg overflow-hidden">
              <div
                className="h-64 bg-gradient-to-r from-blue-600 to-indigo-700 relative"
                style={{
                  backgroundImage: `linear-gradient(to right, ${integration.color}80, ${integration.color}40)`,
                }}
              >
                <CardContent className="p-8 h-full">
                  <div className="flex flex-col md:flex-row h-full gap-8">
                    <div className="flex-1 text-white">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{dataIntegrationName(integration.name)}</h3>
                          <div className="text-sm text-white/80">{integration.developer}</div>
                        </div>
                      </div>

                      <p className="mb-4 line-clamp-2">{dataIntegrationDesc(integration.description)}</p>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-300 mr-1" />
                          <span className="font-medium">{integration.rating}</span>
                          <span className="text-white/80 ml-1">({integration.reviewCount})</span>
                        </div>
                        <div className="text-white/80">
                          {integration.installCount > 1000
                            ? t("marketplace.{count}K+ 安装", { count: (integration.installCount / 1000).toFixed(1) })
                            : t("marketplace.{count} 安装", { count: String(integration.installCount) })}
                        </div>
                      </div>

                      <div className="flex gap-3 mt-auto">
                        <Button asChild className="bg-white text-blue-700 hover:bg-white/90">
                          <Link href={`/marketplace/integration/${integration.id}`}>{t("marketplace.查看详情")}</Link>
                        </Button>
                        <Button asChild variant="outline" className="text-white border-white/30 hover:bg-white/10">
                          <Link href={`/integrations/${integration.id}/install`}>{t("marketplace.立即安装")}</Link>
                        </Button>
                      </div>
                    </div>

                    <div className="hidden md:flex items-center justify-center flex-1">
                      <div className="w-48 h-48 rounded-full bg-white/10 flex items-center justify-center">
                        <Icon className="w-24 h-24 text-white" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
        onClick={handlePrevious}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
        onClick={handleNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="flex justify-center mt-4 gap-1">
        {integrations.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? "bg-blue-600" : "bg-gray-300"
            } transition-colors`}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1)
              setCurrentIndex(index)
            }}
          />
        ))}
      </div>
    </div>
  )
}

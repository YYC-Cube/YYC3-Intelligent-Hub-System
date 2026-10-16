"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useI18n } from "@/app/hooks/use-i18n"

interface QuickQuestionsProps {
  onSelectQuestion: (question: string) => void
}

export function QuickQuestions({ onSelectQuestion }: QuickQuestionsProps) {
  const { t } = useI18n()
  const questions = [
    t("ai.如何添加新的集成应用？"),
    t("ai.如何连接数据库集成？"),
    t("ai.推荐适合我的营销工具"),
    t("ai.热门集成应用有哪些？"),
    t("ai.如何解决集成同步问题？"),
  ]

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2 text-gray-500">{t("ai.快捷问题")}</h3>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <Button
              variant="outline"
              size="sm"
              className="text-xs py-1 h-auto"
              onClick={() => onSelectQuestion(question)}
            >
              {question}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

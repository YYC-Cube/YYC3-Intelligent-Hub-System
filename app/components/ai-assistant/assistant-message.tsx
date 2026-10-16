"use client"

import { cn } from "@/lib/utils"
import { Bot, User } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"

interface AssistantMessageProps {
  content: string
  /** 消息发送方。命名为 `sender` 以避免与 DOM 的 ARIA `role` 属性语义冲突。 */
  sender: "user" | "assistant"
  isLoading?: boolean
}

export function AssistantMessage({ content, sender, isLoading = false }: AssistantMessageProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [content])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-3 p-4 rounded-lg",
        sender === "user" ? "bg-blue-50 ml-8" : "bg-gray-50 mr-8",
        isLoading && "animate-pulse",
      )}
      ref={scrollRef}
    >
      <div className="flex-shrink-0">
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            sender === "user" ? "bg-blue-100" : "bg-gray-200",
          )}
        >
          {sender === "user" ? <User className="w-4 h-4 text-blue-600" /> : <Bot className="w-4 h-4 text-gray-600" />}
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex space-x-1 items-center">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  )
}

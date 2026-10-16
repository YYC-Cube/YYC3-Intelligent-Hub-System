"use client"

import { useWizard } from "./wizard-context"
import { WizardNavigation } from "./wizard-navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useState, useId } from "react"
import { motion } from "framer-motion"

export function StepCompletion() {
  const { formData } = useWizard()
  const { toast } = useToast()
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  // 使用 React 提供的稳定标识符替代渲染期 Math.random()，
  // 既保证 SSR/CSR 水合一致，也满足 react-hooks/purity 的纯函数约束。
  const reactId = useId()
  const integrationId = `int_${reactId.replace(/[^a-zA-Z0-9]/g, "")}`

  const handleCopyId = () => {
    navigator.clipboard.writeText(integrationId)
    setCopied(true)
    toast({
      title: "已复制",
      description: "集成ID已复制到剪贴板",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleComplete = () => {
    router.push("/integrations")
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center py-6"
      >
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">安装成功！</h2>
        <p className="text-gray-500 text-center max-w-md mb-6">
          您已成功安装并配置了 {formData.name} 集成应用。现在您可以开始使用它了。
        </p>

        <div className="bg-gray-50 p-4 rounded-lg border w-full max-w-md mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">集成ID</span>
            <Button variant="ghost" size="sm" onClick={handleCopyId} className="gap-1 h-7">
              {copied ? "已复制" : "复制"}
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          <div className="bg-gray-100 p-2 rounded text-sm font-mono">{integrationId}</div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
          <Button className="flex-1 gap-2" onClick={handleComplete}>
            完成
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            查看文档
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      <WizardNavigation />
    </div>
  )
}

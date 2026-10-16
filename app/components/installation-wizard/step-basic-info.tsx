"use client"

import { useWizard } from "./wizard-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { WizardNavigation } from "./wizard-navigation"
import { useI18n } from "@/app/hooks/use-i18n"

export function StepBasicInfo() {
  const { t } = useI18n()
  const { formData, updateFormData } = useWizard()
  const [name, setName] = useState(formData.name || "")
  const [environment, setEnvironment] = useState(formData.environment || "production")
  const [description, setDescription] = useState(formData.description || "")

  // 校验结果由输入直接派生，无需额外的 state + effect。
  const isValid = !!name.trim()

  const handleNext = () => {
    updateFormData({
      name,
      environment,
      description,
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            {t("install.集成名称")} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder={t("install.输入集成名称")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="max-w-md"
          />
          <p className="text-xs text-gray-500">{t("install.为您的集成应用提供一个易于识别的名称")}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="environment">
            {t("install.环境")} <span className="text-red-500">*</span>
          </Label>
          <Select value={environment} onValueChange={setEnvironment}>
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder={t("install.选择环境")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="development">{t("install.开发环境")}</SelectItem>
              <SelectItem value="testing">{t("install.测试环境")}</SelectItem>
              <SelectItem value="staging">{t("install.预发布环境")}</SelectItem>
              <SelectItem value="production">{t("install.生产环境")}</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">{t("install.选择此集成将运行的环境")}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">{t("install.描述")}</Label>
          <Input
            id="description"
            placeholder={t("install.输入集成描述（可选）")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="max-w-md"
          />
          <p className="text-xs text-gray-500">{t("install.添加描述以便于团队成员理解此集成的用途")}</p>
        </div>
      </div>

      <WizardNavigation disableNext={!isValid} onComplete={handleNext} />
    </div>
  )
}

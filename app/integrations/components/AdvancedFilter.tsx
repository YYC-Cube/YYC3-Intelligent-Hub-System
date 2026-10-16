"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { industries, companyScales, deploymentTypes, integrationMethods, securityLevels } from "@/app/data/integrations"
import { useI18n } from "@/app/hooks/use-i18n"
import { tc } from "@/lib/yyc3/i18n/data"

type AdvancedFilterProps = {
  onFilterChange: (filters: AdvancedFilters) => void
}

export type AdvancedFilters = {
  industries: string[]
  companyScales: string[]
  deploymentTypes: string[]
  integrationMethods: string[]
  securityLevels: string[]
  priceTypes: string[]
}

export default function AdvancedFilter({ onFilterChange }: AdvancedFilterProps) {
  const { t } = useI18n()
  const [filters, setFilters] = useState<AdvancedFilters>({
    industries: [],
    companyScales: [],
    deploymentTypes: [],
    integrationMethods: [],
    securityLevels: [],
    priceTypes: [],
  })

  const handleFilterChange = (category: keyof AdvancedFilters, value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev }
      if (newFilters[category].includes(value)) {
        newFilters[category] = newFilters[category].filter((item) => item !== value)
      } else {
        newFilters[category] = [...newFilters[category], value]
      }
      onFilterChange(newFilters)
      return newFilters
    })
  }

  const priceTypes = [
    { id: "free", label: t("integrations.免费") },
    { id: "freemium", label: t("integrations.免费增值") },
    { id: "paid", label: t("integrations.付费") },
  ]

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4">{t("integrations.高级筛选")}</h3>

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="industry">
          <AccordionTrigger className="text-sm font-medium">{t("integrations.行业适用")}</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {industries.slice(1).map((industry) => (
                <div key={industry} className="flex items-center space-x-2">
                  <Checkbox
                    id={`industry-${industry}`}
                    checked={filters.industries.includes(industry)}
                    onCheckedChange={() => handleFilterChange("industries", industry)}
                  />
                  <Label htmlFor={`industry-${industry}`} className="text-sm">
                    {tc("integrations", industry)}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="companyScale">
          <AccordionTrigger className="text-sm font-medium">{t("integrations.企业规模")}</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {companyScales.slice(1).map((scale) => (
                <div key={scale} className="flex items-center space-x-2">
                  <Checkbox
                    id={`scale-${scale}`}
                    checked={filters.companyScales.includes(scale)}
                    onCheckedChange={() => handleFilterChange("companyScales", scale)}
                  />
                  <Label htmlFor={`scale-${scale}`} className="text-sm">
                    {tc("integrations", scale)}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="deploymentType">
          <AccordionTrigger className="text-sm font-medium">{t("integrations.部署方式")}</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {deploymentTypes.slice(1).map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`deployment-${type}`}
                    checked={filters.deploymentTypes.includes(type)}
                    onCheckedChange={() => handleFilterChange("deploymentTypes", type)}
                  />
                  <Label htmlFor={`deployment-${type}`} className="text-sm">
                    {tc("integrations", type)}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="integrationMethod">
          <AccordionTrigger className="text-sm font-medium">{t("integrations.集成方式")}</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {integrationMethods.slice(1).map((method) => (
                <div key={method} className="flex items-center space-x-2">
                  <Checkbox
                    id={`method-${method}`}
                    checked={filters.integrationMethods.includes(method)}
                    onCheckedChange={() => handleFilterChange("integrationMethods", method)}
                  />
                  <Label htmlFor={`method-${method}`} className="text-sm">
                    {tc("integrations", method)}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="securityLevel">
          <AccordionTrigger className="text-sm font-medium">{t("integrations.安全等级")}</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {securityLevels.slice(1).map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox
                    id={`security-${level}`}
                    checked={filters.securityLevels.includes(level)}
                    onCheckedChange={() => handleFilterChange("securityLevels", level)}
                  />
                  <Label htmlFor={`security-${level}`} className="text-sm">
                    {tc("integrations", level)}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="priceType">
          <AccordionTrigger className="text-sm font-medium">{t("integrations.价格类型")}</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {priceTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`price-${type.id}`}
                    checked={filters.priceTypes.includes(type.id)}
                    onCheckedChange={() => handleFilterChange("priceTypes", type.id)}
                  />
                  <Label htmlFor={`price-${type.id}`} className="text-sm">
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-4 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setFilters({
              industries: [],
              companyScales: [],
              deploymentTypes: [],
              integrationMethods: [],
              securityLevels: [],
              priceTypes: [],
            })
            onFilterChange({
              industries: [],
              companyScales: [],
              deploymentTypes: [],
              integrationMethods: [],
              securityLevels: [],
              priceTypes: [],
            })
          }}
        >
          {t("integrations.重置筛选")}
        </Button>
      </div>
    </div>
  )
}

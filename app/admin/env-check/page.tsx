"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { InfoIcon, AlertTriangleIcon, CheckCircleIcon, CopyIcon, RefreshCwIcon, PlusIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/app/hooks/use-i18n"
import { tc } from "@/lib/yyc3/i18n"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EnvVariable {
  key: string
  value: string
  type: "public" | "server" | "missing" | "custom"
  status: "ok" | "warning" | "error"
  description?: string
}

/** 预期的环境变量清单（构建期由脚本注入） */
const EXPECTED_VARIABLES: ReadonlyArray<Pick<EnvVariable, "key" | "type" | "description">> = [
  {
    key: "NEXT_PUBLIC_APP_VERSION",
    type: "public",
    description: "应用版本号，由构建脚本自动生成",
  },
  {
    key: "NEXT_PUBLIC_BUILD_DATE",
    type: "public",
    description: "应用构建日期，由构建脚本自动生成",
  },
]

/**
 * 采集并校验环境变量。
 *
 * `process.env` 在构建期即被内联为静态值，整个采集过程是纯函数，
 * 因此直接以惰性初始化 / 渲染期派生方式获取，无需 state + effect。
 */
function collectEnvironmentVariables(): EnvVariable[] {
  const variables: EnvVariable[] = []

  // 检查预期的环境变量
  EXPECTED_VARIABLES.forEach((expected) => {
    const value = process.env[expected.key] || ""

    variables.push({
      key: expected.key,
      value: value,
      type: expected.type as "public" | "server",
      status: value ? "ok" : "error",
      description: expected.description,
    })
  })

  // 检查其他可用的公共环境变量
  Object.keys(process.env).forEach((key) => {
    if (key.startsWith("NEXT_PUBLIC_") && !variables.some((v) => v.key === key)) {
      variables.push({
        key,
        value: process.env[key] || "",
        type: "public",
        status: "ok",
      })
    }
  })

  return variables
}

export default function EnvironmentVariablesCheck() {
  const [detectedVariables, setDetectedVariables] = useState<EnvVariable[]>(collectEnvironmentVariables)
  const [customVariables, setCustomVariables] = useState<EnvVariable[]>([])
  const [newEnvKey, setNewEnvKey] = useState("")
  const [newEnvValue, setNewEnvValue] = useState("")
  const { toast } = useToast()
  const { t } = useI18n()

  // 检测结果与自定义变量合并后即为最终展示列表。
  const envVariables = useMemo(
    () => [...detectedVariables, ...customVariables],
    [detectedVariables, customVariables],
  )

  const refreshEnvironmentVariables = () => {
    setDetectedVariables(collectEnvironmentVariables())
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: t("admin.已复制到剪贴板"),
      description: t("admin.环境变量信息已成功复制"),
    })
  }

  const addCustomVariable = () => {
    if (!newEnvKey || !newEnvValue) {
      toast({
        title: t("admin.输入错误"),
        description: t("admin.请输入环境变量的键和值"),
        variant: "destructive",
      })
      return
    }

    // 在客户端，我们不能真正添加环境变量，但可以模拟添加
    setCustomVariables((prev) => [
      ...prev,
      {
        key: newEnvKey,
        value: newEnvValue,
        type: "custom",
        status: "warning",
        description: "客户端添加的自定义变量（仅供参考，需在服务器端配置）",
      },
    ])

    setNewEnvKey("")
    setNewEnvValue("")

    toast({
      title: t("admin.添加成功"),
      description: t("admin.自定义环境变量已添加到列表（仅供参考）"),
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ok":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />
      case "error":
        return <AlertTriangleIcon className="h-5 w-5 text-red-500" />
      default:
        return <InfoIcon className="h-5 w-5 text-blue-500" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "public":
        return (
          <Badge variant="outline" className="bg-sky-100 text-sky-800 border-sky-200">
            {t("admin.公共")}
          </Badge>
        )
      case "server":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
            {t("admin.服务端")}
          </Badge>
        )
      case "missing":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            {t("admin.缺失")}
          </Badge>
        )
      case "custom":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
            {t("admin.自定义")}
          </Badge>
        )
      default:
        return <Badge variant="outline">{t("admin.未知")}</Badge>
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-sky-600 to-blue-700 text-white">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">{t("admin.环境变量检查工具")}</CardTitle>
              <CardDescription className="text-sky-100 mt-2">{t("admin.查看和管理当前项目中的环境变量配置")}</CardDescription>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              onClick={refreshEnvironmentVariables}
            >
              <RefreshCwIcon className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <InfoIcon className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-800">{t("admin.关于环境变量")}</AlertTitle>
            <AlertDescription className="text-blue-700">
              {t("admin.环境变量用于存储配置信息，如API密钥、数据库连接字符串等。以")}{" "}
              <code className="bg-blue-100 px-1 rounded">NEXT_PUBLIC_</code>{" "}
              {t("admin.开头的环境变量可在客户端访问。")}
            </AlertDescription>
          </Alert>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[50px]">{t("admin.状态")}</TableHead>
                  <TableHead className="w-[200px]">{t("admin.变量名")}</TableHead>
                  <TableHead className="w-[100px]">{t("admin.类型")}</TableHead>
                  <TableHead>{t("admin.值")}</TableHead>
                  <TableHead className="w-[250px]">{t("admin.描述")}</TableHead>
                  <TableHead className="w-[80px]">{t("admin.操作")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {envVariables.map((variable) => (
                  <TableRow key={variable.key}>
                    <TableCell>{getStatusIcon(variable.status)}</TableCell>
                    <TableCell className="font-mono text-sm">{variable.key}</TableCell>
                    <TableCell>{getTypeBadge(variable.type)}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {variable.value ? (
                        variable.value.length > 30 ? (
                          `${variable.value.substring(0, 30)}...`
                        ) : (
                          variable.value
                        )
                      ) : (
                        <span className="text-red-500">{t("admin.未设置")}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">
                      {variable.description ? tc("admin", variable.description) : "-"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(`${variable.key}=${variable.value}`)}
                      >
                        <CopyIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t p-6">
          <div className="text-sm text-gray-500">
            {t("admin.检测到 {total} 个环境变量，{ok} 个正常，{warn} 个警告，{error} 个错误", {
              total: String(envVariables.length),
              ok: String(envVariables.filter((v) => v.status === "ok").length),
              warn: String(envVariables.filter((v) => v.status === "warning").length),
              error: String(envVariables.filter((v) => v.status === "error").length),
            })}
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800">
                <PlusIcon className="h-4 w-4 mr-2" />
                {t("admin.添加自定义变量")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("admin.添加自定义环境变量")}</DialogTitle>
                <DialogDescription>
                  {t("admin.添加的变量仅在此会话中可见，不会永久保存。要永久添加环境变量，请修改项目根目录中的 .env.local 文件。")}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="envKey" className="text-right">
                    {t("admin.变量名")}
                  </Label>
                  <Input
                    id="envKey"
                    value={newEnvKey}
                    onChange={(e) => setNewEnvKey(e.target.value)}
                    placeholder={t("admin.例如: NEXT_PUBLIC_API_URL")}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="envValue" className="text-right">
                    {t("admin.变量值")}
                  </Label>
                  <Input
                    id="envValue"
                    value={newEnvValue}
                    onChange={(e) => setNewEnvValue(e.target.value)}
                    placeholder="例如: https://api.example.com"
                    className="col-span-3"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button onClick={addCustomVariable}>{t("admin.添加变量")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  )
}

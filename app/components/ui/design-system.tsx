"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Check, Info } from "lucide-react"
import React from "react"

export function DesignSystem() {
  const [isDarkMode, setIsDarkMode] = React.useState(false)

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  return (
    <div className="mx-auto w-full max-w-page py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">YanYuCloudCube集成中心系统 - 设计系统</h1>
        <div className="flex items-center space-x-2">
          <Label htmlFor="dark-mode">暗色模式</Label>
          <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={setIsDarkMode} />
        </div>
      </div>

      <Tabs defaultValue="colors">
        <TabsList className="mb-6">
          <TabsTrigger value="colors">颜色系统</TabsTrigger>
          <TabsTrigger value="typography">排版</TabsTrigger>
          <TabsTrigger value="components">组件</TabsTrigger>
          <TabsTrigger value="patterns">设计模式</TabsTrigger>
        </TabsList>

        <TabsContent value="colors">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>主色调</CardTitle>
                <CardDescription>系统的主要颜色，用于主要按钮、链接和强调元素</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="h-20 rounded-md bg-primary mb-2"></div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">主色调</span>
                      <span className="text-sm text-muted-foreground">var(--primary)</span>
                    </div>
                  </div>
                  <div>
                    <div className="h-20 rounded-md bg-primary-light mb-2"></div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">主色调-浅色</span>
                      <span className="text-sm text-muted-foreground">var(--primary-light)</span>
                    </div>
                  </div>
                  <div>
                    <div className="h-20 rounded-md bg-primary/80 mb-2"></div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">主色调-深色</span>
                      <span className="text-sm text-muted-foreground">var(--primary-dark)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>辅助色</CardTitle>
                <CardDescription>用于次要按钮、背景和辅助元素</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="h-20 rounded-md bg-secondary mb-2"></div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">辅助色</span>
                      <span className="text-sm text-muted-foreground">var(--secondary)</span>
                    </div>
                  </div>
                  <div>
                    <div className="h-20 rounded-md bg-accent mb-2"></div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">强调色</span>
                      <span className="text-sm text-muted-foreground">var(--accent)</span>
                    </div>
                  </div>
                  <div>
                    <div className="h-20 rounded-md bg-muted mb-2"></div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">柔和背景色</span>
                      <span className="text-sm text-muted-foreground">var(--muted)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>功能色</CardTitle>
                <CardDescription>用于表示不同状态和功能的颜色</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="h-16 rounded-md bg-success mb-2"></div>
                    <span className="text-sm font-medium">成功</span>
                  </div>
                  <div>
                    <div className="h-16 rounded-md bg-warning mb-2"></div>
                    <span className="text-sm font-medium">警告</span>
                  </div>
                  <div>
                    <div className="h-16 rounded-md bg-destructive mb-2"></div>
                    <span className="text-sm font-medium">错误</span>
                  </div>
                  <div>
                    <div className="h-16 rounded-md bg-info mb-2"></div>
                    <span className="text-sm font-medium">信息</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>中性色</CardTitle>
                <CardDescription>用于文本、背景和边框的中性颜色</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-12 h-8 rounded-md bg-background border border-border mr-3"></div>
                    <span className="text-sm">background · 页面背景</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-8 rounded-md bg-card border border-border mr-3"></div>
                    <span className="text-sm">card · 卡片表面</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-8 rounded-md bg-muted border border-border mr-3"></div>
                    <span className="text-sm">muted · 弱化背景</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-8 rounded-md bg-secondary mr-3"></div>
                    <span className="text-sm">secondary · 次级表面</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-8 rounded-md bg-accent mr-3"></div>
                    <span className="text-sm">accent · 强调表面</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-8 rounded-md bg-border mr-3"></div>
                    <span className="text-sm">border · 边框</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-8 rounded-md bg-input mr-3"></div>
                    <span className="text-sm">input · 输入框边框</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-8 rounded-md bg-muted-foreground mr-3"></div>
                    <span className="text-sm">muted-foreground · 次要文本</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-8 rounded-md bg-foreground mr-3"></div>
                    <span className="text-sm">foreground · 主要文本</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="typography">
          <Card>
            <CardHeader>
              <CardTitle>排版系统</CardTitle>
              <CardDescription>系统使用的字体、大小和样式</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h6 className="text-sm font-medium text-muted-foreground mb-4">标题</h6>
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-4xl font-bold">标题 1</h1>
                      <p className="text-sm text-muted-foreground mt-1">text-4xl font-bold</p>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">标题 2</h2>
                      <p className="text-sm text-muted-foreground mt-1">text-3xl font-bold</p>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">标题 3</h3>
                      <p className="text-sm text-muted-foreground mt-1">text-2xl font-bold</p>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">标题 4</h4>
                      <p className="text-sm text-muted-foreground mt-1">text-xl font-bold</p>
                    </div>
                    <div>
                      <h5 className="text-lg font-bold">标题 5</h5>
                      <p className="text-sm text-muted-foreground mt-1">text-lg font-bold</p>
                    </div>
                    <div>
                      <h6 className="text-base font-bold">标题 6</h6>
                      <p className="text-sm text-muted-foreground mt-1">text-base font-bold</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h6 className="text-sm font-medium text-muted-foreground mb-4">正文</h6>
                  <div className="space-y-4">
                    <div>
                      <p className="text-lg">大号正文文本</p>
                      <p className="text-sm text-muted-foreground mt-1">text-lg</p>
                    </div>
                    <div>
                      <p className="text-base">标准正文文本</p>
                      <p className="text-sm text-muted-foreground mt-1">text-base</p>
                    </div>
                    <div>
                      <p className="text-sm">小号正文文本</p>
                      <p className="text-sm text-muted-foreground mt-1">text-sm</p>
                    </div>
                    <div>
                      <p className="text-xs">超小号文本</p>
                      <p className="text-sm text-muted-foreground mt-1">text-xs</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h6 className="text-sm font-medium text-muted-foreground mb-4">特殊文本</h6>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">中等粗细文本</p>
                      <p className="text-sm text-muted-foreground mt-1">font-medium</p>
                    </div>
                    <div>
                      <p className="font-semibold">半粗体文本</p>
                      <p className="text-sm text-muted-foreground mt-1">font-semibold</p>
                    </div>
                    <div>
                      <p className="font-bold">粗体文本</p>
                      <p className="text-sm text-muted-foreground mt-1">font-bold</p>
                    </div>
                    <div>
                      <p className="italic">斜体文本</p>
                      <p className="text-sm text-muted-foreground mt-1">italic</p>
                    </div>
                    <div>
                      <p className="underline">下划线文本</p>
                      <p className="text-sm text-muted-foreground mt-1">underline</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">次要文本</p>
                      <p className="text-sm text-muted-foreground mt-1">text-muted-foreground</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h6 className="text-sm font-medium text-muted-foreground mb-4">卡片排版令牌（全站卡片唯一真源）</h6>
                  <div className="space-y-4">
                    <div>
                      <p className="text-card-title">集成应用卡片标题</p>
                      <p className="text-sm text-muted-foreground mt-1">text-card-title · 15 / 22 · 600</p>
                    </div>
                    <div>
                      <p className="text-card-body text-muted-foreground">
                        卡片简介正文使用 card-body，两行截断以保持网格等高。
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">text-card-body · 13 / 18</p>
                    </div>
                    <div>
                      <p className="text-card-meta text-muted-foreground">评分 4.9 · 评论 516 · 安装 2.1K</p>
                      <p className="text-sm text-muted-foreground mt-1">text-card-meta · 12 / 16</p>
                    </div>
                    <div>
                      <span className="text-card-chip px-2 py-0.5 rounded-full bg-muted text-muted-foreground">客户支持</span>
                      <p className="text-sm text-muted-foreground mt-1">text-card-chip · 11 / 16</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      规则：卡片型组件只引用以上四个令牌，禁止用同值的 text-sm / text-xs 表达不同语义；语义色仅表达状态。
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="components">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>按钮</CardTitle>
                <CardDescription>各种样式的按钮组件</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">按钮变体</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button>默认按钮</Button>
                    <Button variant="secondary">次要按钮</Button>
                    <Button variant="outline">轮廓按钮</Button>
                    <Button variant="ghost">幽灵按钮</Button>
                    <Button variant="link">链接按钮</Button>
                    <Button variant="destructive">危险按钮</Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3">按钮尺寸</h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button size="sm">小号按钮</Button>
                    <Button>默认按钮</Button>
                    <Button size="lg">大号按钮</Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3">按钮状态</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button>正常状态</Button>
                    <Button disabled>禁用状态</Button>
                    <Button variant="outline" className="border-dashed">
                      虚线边框
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90">悬停状态</Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3">带图标按钮</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button>
                      <Check className="mr-2 h-4 w-4" /> 确认
                    </Button>
                    <Button variant="outline">
                      <Info className="mr-2 h-4 w-4" /> 信息
                    </Button>
                    <Button variant="secondary">
                      设置{" "}
                      <svg
                        className="ml-2 h-4 w-4"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>表单元素</CardTitle>
                <CardDescription>输入框、选择器和其他表单组件</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="email" className="mb-2 block">
                    电子邮箱
                  </Label>
                  <Input id="email" placeholder="请输入您的邮箱地址" type="email" />
                </div>

                <div>
                  <Label htmlFor="select" className="mb-2 block">
                    选择项目
                  </Label>
                  <Select>
                    <SelectTrigger id="select">
                      <SelectValue placeholder="选择一个选项" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">选项一</SelectItem>
                      <SelectItem value="option2">选项二</SelectItem>
                      <SelectItem value="option3">选项三</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block">复选框</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      接受条款和条件
                    </label>
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">单选按钮</Label>
                  <RadioGroup defaultValue="option1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option1" id="option1" />
                      <Label htmlFor="option1">选项一</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option2" id="option2" />
                      <Label htmlFor="option2">选项二</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="mb-2 block">滑块</Label>
                  <Slider defaultValue={[50]} max={100} step={1} />
                </div>

                <div>
                  <Label className="mb-2 block">开关</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="airplane-mode" />
                    <Label htmlFor="airplane-mode">飞行模式</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>卡片和容器</CardTitle>
                <CardDescription>用于内容分组的容器组件</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">标准卡片</h3>
                  <Card>
                    <CardHeader>
                      <CardTitle>卡片标题</CardTitle>
                      <CardDescription>卡片的简短描述信息</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>卡片的主要内容区域，可以包含各种元素。</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="ghost">取消</Button>
                      <Button>确定</Button>
                    </CardFooter>
                  </Card>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3">分隔线</h3>
                  <div className="space-y-4">
                    <p>上方内容</p>
                    <Separator />
                    <p>下方内容</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>提示和通知</CardTitle>
                <CardDescription>用于向用户显示信息的组件</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">提示标签</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge>默认</Badge>
                    <Badge variant="secondary">次要</Badge>
                    <Badge variant="outline">轮廓</Badge>
                    <Badge variant="destructive">危险</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3">警告提示</h3>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>提示</AlertTitle>
                    <AlertDescription>这是一条信息提示，用于向用户展示重要信息。</AlertDescription>
                  </Alert>
                </div>

                <div className="space-y-2">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>错误</AlertTitle>
                    <AlertDescription>操作失败，请检查您的输入并重试。</AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patterns">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>页面布局</CardTitle>
                <CardDescription>常用的页面布局模式</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">标准页面</h3>
                    <div className="border rounded-md p-4">
                      <div className="h-12 bg-muted rounded-md mb-4"></div>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-1">
                          <div className="h-64 bg-muted rounded-md"></div>
                        </div>
                        <div className="col-span-3">
                          <div className="h-16 bg-muted rounded-md mb-4"></div>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="h-24 bg-muted rounded-md"></div>
                            <div className="h-24 bg-muted rounded-md"></div>
                          </div>
                          <div className="h-16 bg-muted rounded-md"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-3">仪表盘布局</h3>
                    <div className="border rounded-md p-4">
                      <div className="h-12 bg-muted rounded-md mb-4"></div>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="h-24 bg-muted rounded-md"></div>
                        <div className="h-24 bg-muted rounded-md"></div>
                        <div className="h-24 bg-muted rounded-md"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-48 bg-muted rounded-md"></div>
                        <div className="h-48 bg-muted rounded-md"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>导航模式</CardTitle>
                <CardDescription>常用的导航和菜单模式</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">顶部导航</h3>
                    <div className="border rounded-md p-4">
                      <div className="h-12 bg-primary rounded-md mb-4 flex items-center px-4">
                        <div className="w-32 h-6 bg-primary-foreground rounded-md opacity-80"></div>
                        <div className="flex-1 flex justify-center">
                          <div className="flex space-x-4">
                            <div className="w-16 h-6 bg-primary-foreground rounded-md opacity-60"></div>
                            <div className="w-16 h-6 bg-primary-foreground rounded-md opacity-90"></div>
                            <div className="w-16 h-6 bg-primary-foreground rounded-md opacity-60"></div>
                          </div>
                        </div>
                        <div className="w-24 h-6 bg-primary-foreground rounded-md opacity-80"></div>
                      </div>
                      <div className="h-64 bg-muted rounded-md"></div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-3">侧边导航</h3>
                    <div className="border rounded-md p-4">
                      <div className="flex">
                        <div className="w-48 h-80 bg-muted rounded-l-md p-4 flex flex-col space-y-3">
                          <div className="w-full h-6 bg-background rounded-md"></div>
                          <div className="w-full h-6 bg-primary rounded-md"></div>
                          <div className="w-full h-6 bg-background rounded-md"></div>
                          <div className="w-full h-6 bg-background rounded-md"></div>
                        </div>
                        <div className="flex-1 h-80 bg-background rounded-r-md p-4">
                          <div className="h-12 bg-card rounded-md mb-4"></div>
                          <div className="h-60 bg-card rounded-md"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>数据展示</CardTitle>
                <CardDescription>数据展示的常用模式</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">卡片网格</h3>
                    <div className="border rounded-md p-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-32 bg-muted rounded-md"></div>
                        <div className="h-32 bg-muted rounded-md"></div>
                        <div className="h-32 bg-muted rounded-md"></div>
                        <div className="h-32 bg-muted rounded-md"></div>
                        <div className="h-32 bg-muted rounded-md"></div>
                        <div className="h-32 bg-muted rounded-md"></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-3">列表视图</h3>
                    <div className="border rounded-md p-4">
                      <div className="space-y-2">
                        <div className="h-12 bg-muted rounded-md"></div>
                        <div className="h-12 bg-muted rounded-md"></div>
                        <div className="h-12 bg-muted rounded-md"></div>
                        <div className="h-12 bg-muted rounded-md"></div>
                        <div className="h-12 bg-muted rounded-md"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>交互模式</CardTitle>
                <CardDescription>常用的用户交互模式</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">表单布局</h3>
                    <div className="border rounded-md p-4">
                      <div className="space-y-4">
                        <div className="h-16 bg-muted rounded-md"></div>
                        <div className="h-16 bg-muted rounded-md"></div>
                        <div className="h-16 bg-muted rounded-md"></div>
                        <div className="flex justify-end">
                          <div className="w-24 h-10 bg-primary rounded-md"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-3">步骤流程</h3>
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between mb-4">
                        <div className="w-24 h-8 bg-primary rounded-full"></div>
                        <div className="w-24 h-8 bg-muted rounded-full"></div>
                        <div className="w-24 h-8 bg-muted rounded-full"></div>
                      </div>
                      <div className="h-48 bg-muted rounded-md mb-4"></div>
                      <div className="flex justify-between">
                        <div className="w-24 h-10 bg-muted rounded-md"></div>
                        <div className="w-24 h-10 bg-primary rounded-md"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

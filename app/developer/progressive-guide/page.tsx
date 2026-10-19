'use client';

import {
  BookOpen,
  CheckCircle,
  ChevronRight,
  Clock,
  Code,
  Layers,
  Lock,
  Package,
  Server,
  Settings,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { learningPaths, type LearningPath } from '@/app/data/learning-paths';
import { useI18n } from '@/app/hooks/use-i18n';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { tc } from '@/lib/yyc3/i18n/data';

// 模拟用户进度数据
const userProgress = {
  completedPaths: ['getting-started'],
  completedModules: ['intro-to-yanyu', 'setup-environment', 'first-integration'],
  currentModule: 'component-basics',
  overallProgress: 28,
};

export default function ProgressiveGuidePage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 模拟进度加载动画
    const timer = setTimeout(() => {
      setProgress(userProgress.overallProgress);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handlePathSelect = (path: LearningPath) => {
    setSelectedPath(path);
    setActiveTab('path-details');
  };

  const isPathCompleted = (pathId: string) => {
    return userProgress.completedPaths.includes(pathId);
  };

  const isPathUnlocked = (path: LearningPath) => {
    if (!path.prerequisites || path.prerequisites.length === 0) return true;
    return path.prerequisites.every((prereq) => isPathCompleted(prereq));
  };

  const isModuleCompleted = (moduleId: string) => {
    return userProgress.completedModules.includes(moduleId);
  };

  const isModuleCurrent = (moduleId: string) => {
    return userProgress.currentModule === moduleId;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case '入门':
        return 'bg-primary';
      case '基础':
        return 'bg-success';
      case '中级':
        return 'bg-warning';
      case '高级':
        return 'bg-warning/80';
      case '专家':
        return 'bg-destructive';
      default:
        return 'bg-muted-foreground';
    }
  };

  return (
    <div className="pb-12">
      {/* 页面标题 */}
      <div className="bg-gradient-to-r from-primary to-accent text-white py-12 px-4">
        <div className="mx-auto w-full max-w-page">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('developer.递进式开发指南')}</h1>
          <p className="text-xl opacity-90 max-w-content">
            {t('developer.从入门到精通，循序渐进地学习YanYuCloudCube集成中心系统的开发')}
          </p>

          {/* 总体进度 */}
          <div className="mt-8 bg-white/20 p-4 rounded-lg backdrop-blur-sm max-w-md">
            <div className="flex justify-between mb-2">
              <span className="font-medium">{t('developer.总体学习进度')}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-page px-4 mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
            <TabsTrigger value="overview">{t('developer.学习路径概览')}</TabsTrigger>
            <TabsTrigger value="path-details" disabled={!selectedPath}>
              {selectedPath ? tc('developer', selectedPath.title) : t('developer.路径详情')}
            </TabsTrigger>
          </TabsList>

          {/* 学习路径概览 */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningPaths.map((path) => {
                const isUnlocked = isPathUnlocked(path);
                const isCompleted = isPathCompleted(path.id);

                return (
                  <Card
                    key={path.id}
                    className={`overflow-hidden motion-card ${
                      isUnlocked ? 'hover:shadow-md cursor-pointer' : 'opacity-75'
                    }`}
                    onClick={() => isUnlocked && handlePathSelect(path)}
                  >
                    <div className={`h-2 ${path.color}`}></div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-2 rounded-full ${path.color} bg-opacity-20`}>
                          <path.icon className={`h-6 w-6 ${path.color.replace('bg-', 'text-')}`} />
                        </div>
                        <Badge
                          variant="outline"
                          className={`${getLevelColor(path.level)} text-white`}
                        >
                          {tc('developer', path.level)}
                        </Badge>
                      </div>

                      <h3 className="text-xl font-bold mb-2">{tc('developer', path.title)}</h3>
                      <p className="text-muted-foreground mb-4">
                        {tc('developer', path.description)}
                      </p>

                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>
                            {t('developer.约 {hours} 小时', { hours: String(path.estimatedHours) })}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Layers className="h-4 w-4 mr-1" />
                          <span>
                            {t('developer.{count} 个模块', { count: String(path.modules.length) })}
                          </span>
                        </div>
                      </div>

                      {isCompleted ? (
                        <div className="flex items-center text-success">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          <span>{t('developer.已完成')}</span>
                        </div>
                      ) : isUnlocked ? (
                        <Button className="w-full">
                          {userProgress.currentModule === path.modules[0].id
                            ? t('developer.继续学习')
                            : t('developer.开始学习')}
                        </Button>
                      ) : (
                        <div className="flex items-center text-warning">
                          <Lock className="h-5 w-5 mr-2" />
                          <span>{t('developer.需要完成前置路径')}</span>
                        </div>
                      )}

                      {path.prerequisites && path.prerequisites.length > 0 && (
                        <div className="mt-4 text-sm text-muted-foreground">
                          <p>{t('developer.前置要求：')}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {path.prerequisites.map((prereq) => {
                              const prereqPath = learningPaths.find((p) => p.id === prereq);
                              return (
                                <Badge key={prereq} variant="outline" className="bg-muted">
                                  {prereqPath ? tc('developer', prereqPath.title) : prereq}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* 路径详情 */}
          <TabsContent value="path-details" className="space-y-8">
            {selectedPath && (
              <>
                <div className="flex items-center space-x-2 mb-6">
                  <Button variant="ghost" onClick={() => setActiveTab('overview')}>
                    <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
                    {t('developer.返回')}
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <h2 className="text-2xl font-bold">{tc('developer', selectedPath.title)}</h2>
                  <Badge
                    variant="outline"
                    className={`${getLevelColor(selectedPath.level)} text-white ml-2`}
                  >
                    {tc('developer', selectedPath.level)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* 左侧：路径信息 */}
                  <div className="lg:col-span-1">
                    <Card>
                      <CardContent className="p-6">
                        <div
                          className={`p-3 rounded-full ${selectedPath.color} bg-opacity-20 inline-block mb-4`}
                        >
                          <selectedPath.icon
                            className={`h-6 w-6 ${selectedPath.color.replace('bg-', 'text-')}`}
                          />
                        </div>

                        <h3 className="text-xl font-bold mb-2">
                          {tc('developer', selectedPath.title)}
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          {tc('developer', selectedPath.description)}
                        </p>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">{t('developer.难度级别')}</span>
                            <Badge
                              variant="outline"
                              className={`${getLevelColor(selectedPath.level)} text-white`}
                            >
                              {tc('developer', selectedPath.level)}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              {t('developer.预计学习时间')}
                            </span>
                            <span>
                              {t('developer.{hours} 小时', {
                                hours: String(selectedPath.estimatedHours),
                              })}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">{t('developer.模块数量')}</span>
                            <span>
                              {t('developer.{count} 个', {
                                count: String(selectedPath.modules.length),
                              })}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">{t('developer.完成状态')}</span>
                            {isPathCompleted(selectedPath.id) ? (
                              <Badge className="bg-success">{t('developer.已完成')}</Badge>
                            ) : (
                              <Badge className="bg-primary">{t('developer.进行中')}</Badge>
                            )}
                          </div>
                        </div>

                        {selectedPath.prerequisites && selectedPath.prerequisites.length > 0 && (
                          <div className="mt-6 pt-6 border-t border-border">
                            <h4 className="font-medium mb-2">{t('developer.前置要求')}</h4>
                            <div className="space-y-2">
                              {selectedPath.prerequisites.map((prereq) => {
                                const prereqPath = learningPaths.find((p) => p.id === prereq);
                                return (
                                  <div key={prereq} className="flex items-center justify-between">
                                    <span>
                                      {prereqPath ? tc('developer', prereqPath.title) : prereq}
                                    </span>
                                    {isPathCompleted(prereq) ? (
                                      <Badge className="bg-success">{t('developer.已完成')}</Badge>
                                    ) : (
                                      <Badge className="bg-warning">{t('developer.未完成')}</Badge>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* 右侧：模块列表 */}
                  <div className="lg:col-span-2 space-y-4">
                    {selectedPath.modules.map((module, index) => {
                      const isCompleted = isModuleCompleted(module.id);
                      const isCurrent = isModuleCurrent(module.id);
                      const isLocked = module.locked && !isCompleted && !isCurrent;

                      return (
                        <Collapsible key={module.id} className="border rounded-lg overflow-hidden">
                          <CollapsibleTrigger
                            className={`flex items-center justify-between w-full p-4 text-left ${
                              isLocked
                                ? 'bg-muted'
                                : isCurrent
                                  ? 'bg-brand-50'
                                  : isCompleted
                                    ? 'bg-success/10'
                                    : ''
                            }`}
                          >
                            <div className="flex items-center">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted mr-3 text-foreground">
                                {index + 1}
                              </div>
                              <div>
                                <h3 className="font-medium">{tc('developer', module.title)}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {tc('developer', module.description)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              {isLocked ? (
                                <Lock className="h-5 w-5 text-muted-foreground mr-2" />
                              ) : isCompleted ? (
                                <CheckCircle className="h-5 w-5 text-success mr-2" />
                              ) : isCurrent ? (
                                <Badge className="bg-primary mr-2">{t('developer.当前')}</Badge>
                              ) : null}
                              <span className="text-sm text-muted-foreground mr-2">
                                {t('developer.{duration} 分钟', {
                                  duration: String(module.duration),
                                })}
                              </span>
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </CollapsibleTrigger>

                          <CollapsibleContent className={`${isLocked ? 'bg-muted' : ''}`}>
                            <div className="p-4 border-t">
                              {isLocked ? (
                                <div className="flex flex-col items-center justify-center py-6">
                                  <Lock className="h-12 w-12 text-muted-foreground mb-2" />
                                  <p className="text-muted-foreground mb-4">
                                    {t('developer.完成前面的模块以解锁此内容')}
                                  </p>
                                  {index > 0 && (
                                    <Button variant="outline">{t('developer.前往上一模块')}</Button>
                                  )}
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  <h4 className="font-medium mb-2">{t('developer.学习步骤')}</h4>
                                  <div className="space-y-2">
                                    {module.steps.map((step, stepIndex) => (
                                      <div
                                        key={step.id}
                                        className="flex items-center justify-between p-3 bg-card border rounded-md"
                                      >
                                        <div className="flex items-center">
                                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted mr-3 text-xs">
                                            {stepIndex + 1}
                                          </div>
                                          <div>
                                            <p className="font-medium">
                                              {tc('developer', step.title)}
                                            </p>
                                            <div className="flex items-center text-sm text-muted-foreground">
                                              <Badge variant="outline" className="mr-2">
                                                {tc('developer', step.type)}
                                              </Badge>
                                              <span>
                                                {t('developer.{duration} 分钟', {
                                                  duration: String(step.duration),
                                                })}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        {step.completed ? (
                                          <CheckCircle className="h-5 w-5 text-success" />
                                        ) : (
                                          <Button size="sm">{t('developer.开始')}</Button>
                                        )}
                                      </div>
                                    ))}
                                  </div>

                                  <div className="flex justify-between pt-4">
                                    {index > 0 && (
                                      <Button variant="outline">
                                        <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
                                        {t('developer.上一模块')}
                                      </Button>
                                    )}
                                    {index < selectedPath.modules.length - 1 && (
                                      <Button className="ml-auto">
                                        {t('developer.下一模块')}
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* 推荐资源 */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">{t('developer.推荐学习资源')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-brand-100 p-3 rounded-full">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">{t('developer.API参考文档')}</h3>
                    <p className="text-muted-foreground mb-4">
                      {t('developer.完整的API参考文档，包含所有端点和参数说明。')}
                    </p>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/developer/api" className="flex items-center justify-between">
                        <span>{t('developer.查看文档')}</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-accent/15 p-3 rounded-full">
                    <Package className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">{t('developer.组件示例')}</h3>
                    <p className="text-muted-foreground mb-4">
                      {t('developer.浏览所有UI组件的示例和用法说明。')}
                    </p>
                    <Button variant="outline" asChild className="w-full">
                      <Link
                        href="/developer/components"
                        className="flex items-center justify-between"
                      >
                        <span>{t('developer.查看组件')}</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">{t('developer.开发者社区')}</h3>
                    <p className="text-muted-foreground mb-4">
                      {t('developer.加入我们的开发者社区，获取帮助和分享经验。')}
                    </p>
                    <Button variant="outline" asChild className="w-full">
                      <Link
                        href="https://community.yanyu.cloud"
                        target="_blank"
                        className="flex items-center justify-between"
                      >
                        <span>{t('developer.加入社区')}</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useAssistant } from '@/app/context/assistant-context';
import { useI18n } from '@/app/hooks/use-i18n';
import { formatDateTime } from '@/app/utils/format-date';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Bot,
  ChevronDown,
  ChevronUp,
  Copy,
  Edit,
  Maximize2,
  MessageSquare,
  Minimize2,
  Plus,
  RefreshCw,
  Send,
  Settings,
  StopCircle,
  Trash2,
  User,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

// 消息组件
function AssistantMessageItem({ message }: { message: any }) {
  const [copied, setCopied] = useState(false);
  const { locale, t } = useI18n();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex gap-3 p-4 rounded-lg group ${message.role === 'user' ? 'bg-brand-50 ml-8' : 'bg-card mr-8'}`}
    >
      <div className="flex-shrink-0">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            message.role === 'user' ? 'bg-brand-100' : 'bg-muted'
          }`}
        >
          {message.role === 'user' ? (
            <User className="w-4 h-4 text-primary" />
          ) : (
            <Bot className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-start">
          <div className="text-xs text-muted-foreground mb-1">
            {formatDateTime(message.timestamp, locale)}
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyToClipboard}>
              {copied ? (
                <Badge variant="outline" className="text-xs">
                  {t('ai.已复制')}
                </Badge>
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

// 会话列表项组件
function SessionListItem({
  session,
  isActive,
  onClick,
  onDelete,
  onRename,
}: {
  session: any;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
  onRename: (newTitle: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(session.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleRename = () => {
    if (title.trim()) {
      onRename(title);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setTitle(session.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted ${
        isActive ? 'bg-brand-50 border-l-4 border-primary' : ''
      }`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-center flex-1 min-w-0">
        <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
            className="flex-1 text-sm border rounded px-1 py-0.5"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="flex-1 truncate text-sm">{session.title}</div>
        )}
      </div>
      <div className="flex space-x-1">
        {!isEditing && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

// 设置对话框组件
function AssistantSettings({
  config,
  onConfigChange,
}: {
  config: any;
  onConfigChange: (config: any) => void;
}) {
  const [localConfig, setLocalConfig] = useState(config);
  const { t } = useI18n();

  const handleChange = (key: string, value: any) => {
    setLocalConfig((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onConfigChange(localConfig);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="provider">{t('ai.AI提供商')}</Label>
        <Select
          value={localConfig.provider}
          onValueChange={(value) => handleChange('provider', value)}
        >
          <SelectTrigger id="provider">
            <SelectValue placeholder={t('ai.选择AI提供商')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="local">{t('ai.本地模式（模拟）')}</SelectItem>
            <SelectItem value="openai">OpenAI</SelectItem>
            <SelectItem value="anthropic">Anthropic</SelectItem>
            <SelectItem value="gemini">Google Gemini</SelectItem>
            <SelectItem value="custom">{t('ai.自定义API')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {localConfig.provider !== 'local' && (
        <div className="space-y-2">
          <Label htmlFor="apiKey">{t('ai.API密钥')}</Label>
          <Input
            id="apiKey"
            type="password"
            value={localConfig.apiKey || ''}
            onChange={(e) => handleChange('apiKey', e.target.value)}
            placeholder={t('ai.输入API密钥')}
          />
        </div>
      )}

      {localConfig.provider === 'custom' && (
        <div className="space-y-2">
          <Label htmlFor="endpoint">{t('ai.API端点')}</Label>
          <Input
            id="endpoint"
            value={localConfig.endpoint || ''}
            onChange={(e) => handleChange('endpoint', e.target.value)}
            placeholder="https://api.example.com/chat"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="model">{t('ai.模型')}</Label>
        <Input
          id="model"
          value={localConfig.model || ''}
          onChange={(e) => handleChange('model', e.target.value)}
          placeholder={
            localConfig.provider === 'openai'
              ? 'gpt-4o'
              : localConfig.provider === 'anthropic'
                ? 'claude-3-opus-20240229'
                : localConfig.provider === 'gemini'
                  ? 'gemini-pro'
                  : t('ai.模型名称')
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="temperature">
          {t('ai.温度 ({value})', { value: String(localConfig.temperature || 0.7) })}
        </Label>
        <input
          id="temperature"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={localConfig.temperature || 0.7}
          onChange={(e) => handleChange('temperature', Number.parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{t('ai.精确')}</span>
          <span>{t('ai.创造性')}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="systemPrompt">{t('ai.系统提示词')}</Label>
        <Textarea
          id="systemPrompt"
          value={localConfig.systemPrompt || ''}
          onChange={(e) => handleChange('systemPrompt', e.target.value)}
          placeholder={t('ai.输入系统提示词，定义助手的行为和知识范围')}
          rows={4}
        />
      </div>

      <Button onClick={handleSave} className="w-full">
        {t('ai.保存设置')}
      </Button>
    </div>
  );
}

// 主助手组件
export function AutonomousAssistant({
  initialExpanded = false,
  className = '',
}: {
  initialExpanded?: boolean;
  className?: string;
}) {
  const {
    state,
    sendMessage,
    createSession,
    switchSession,
    deleteSession,
    cancelRequest,
    configureAssistant,
    clearCurrentSession,
  } = useAssistant();
  const { t } = useI18n();

  const [input, setInput] = useState('');
  const [expanded, setExpanded] = useState(initialExpanded);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 滚动到最新消息
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.currentSession?.messages]);

  // 确保有当前会话
  useEffect(() => {
    if (!state.currentSession && state.sessions.length === 0) {
      createSession();
    }
  }, [state.currentSession, state.sessions.length, createSession]);

  // 处理发送消息
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (input.trim() && !state.isProcessing) {
      await sendMessage(input);
      setInput('');
    }
  };

  // 处理重命名会话
  const handleRenameSession = (sessionId: string, newTitle: string) => {
    const session = state.sessions.find((s) => s.id === sessionId);
    if (session) {
      session.title = newTitle;
      // 触发状态更新
      switchSession(sessionId);
    }
  };

  // 渲染会话列表
  const renderSessionList = () => {
    return (
      <div className="space-y-1">
        {state.sessions.map((session) => (
          <SessionListItem
            key={session.id}
            session={session}
            isActive={state.currentSession?.id === session.id}
            onClick={() => switchSession(session.id)}
            onDelete={() => deleteSession(session.id)}
            onRename={(newTitle) => handleRenameSession(session.id, newTitle)}
          />
        ))}
      </div>
    );
  };

  // 渲染消息列表
  const renderMessages = () => {
    if (!state.currentSession || state.currentSession.messages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <Bot className="h-12 w-12 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">{t('ai.YanYuCloudCube智能助手')}</h3>
          <p className="text-muted-foreground mb-4">{t('ai.有什么可以帮助您的？')}</p>
          <div className="grid grid-cols-2 gap-2 w-full max-w-md">
            <Button
              variant="outline"
              className="text-left h-auto py-2"
              onClick={() => sendMessage(t('ai.介绍一下YanYuCloudCube集成中心'))}
            >
              <div>
                <div className="font-medium">{t('ai.YanYuCloudCube介绍')}</div>
                <div className="text-xs text-muted-foreground">
                  {t('ai.了解YanYuCloudCube集成中心的功能')}
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="text-left h-auto py-2"
              onClick={() => sendMessage(t('ai.如何连接数据库集成？'))}
            >
              <div>
                <div className="font-medium">{t('ai.数据库集成')}</div>
                <div className="text-xs text-muted-foreground">{t('ai.了解如何连接数据库')}</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="text-left h-auto py-2"
              onClick={() => sendMessage(t('ai.推荐适合我的营销工具'))}
            >
              <div>
                <div className="font-medium">{t('ai.营销工具推荐')}</div>
                <div className="text-xs text-muted-foreground">{t('ai.获取营销工具推荐')}</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="text-left h-auto py-2"
              onClick={() => sendMessage(t('ai.如何解决集成同步问题？'))}
            >
              <div>
                <div className="font-medium">{t('ai.同步问题')}</div>
                <div className="text-xs text-muted-foreground">{t('ai.解决集成同步问题')}</div>
              </div>
            </Button>
          </div>
        </div>
      );
    }

    return (
      <>
        {state.currentSession.messages.map((message) => (
          <AssistantMessageItem key={message.id} message={message} />
        ))}
        {state.isProcessing && (
          <div className="flex gap-3 p-4 rounded-lg bg-card mr-8">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted">
                <Bot className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex space-x-1 items-center">
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-typing"
                  style={{ animationDelay: '0ms' }}
                ></div>
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-typing"
                  style={{ animationDelay: '150ms' }}
                ></div>
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-typing"
                  style={{ animationDelay: '300ms' }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </>
    );
  };

  return (
    <Card className={`border-2 border-primary/20 overflow-hidden ${className}`}>
      <CardHeader className="p-4 bg-gradient-to-r from-brand-50 to-accent/20 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary text-xs">AI</span>
          </div>
          {t('ai.YanYuCloudCube智能助手')}
        </CardTitle>
        <div className="flex items-center gap-1">
          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('ai.助手设置')}</DialogTitle>
              </DialogHeader>
              <AssistantSettings
                config={state.config || {}}
                onConfigChange={(config) => {
                  configureAssistant(config);
                  setSettingsOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="icon" onClick={() => setExpanded(!expanded)}>
            {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      <div className="flex">
        {showSidebar && (
          <div className="animate-fade-up w-[250px] border-r">
            <div className="p-4">
              <Button
                onClick={() => createSession()}
                className="w-full mb-4 flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" /> {t('ai.新对话')}
              </Button>
              <ScrollArea className={expanded ? 'h-[calc(100vh-280px)]' : 'h-80'}>
                {renderSessionList()}
              </ScrollArea>
            </div>
          </div>
        )}

        <div className="flex-1">
          <Tabs
            defaultValue="chat"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex items-center justify-between border-b px-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                {showSidebar ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
              <TabsList className="grid grid-cols-2 w-40">
                <TabsTrigger value="chat">{t('ai.对话')}</TabsTrigger>
                <TabsTrigger value="info">{t('ai.信息')}</TabsTrigger>
              </TabsList>
              <div className="w-8"></div> {/* 占位，保持居中 */}
            </div>

            <TabsContent value="chat" className="m-0">
              <ScrollArea
                className={`${expanded ? 'h-[calc(100vh-280px)]' : 'h-80'} p-4 space-y-4 bg-card`}
              >
                {renderMessages()}
              </ScrollArea>

              <CardFooter className="flex flex-col p-4 pt-2 gap-2 border-t">
                <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t('ai.输入您的问题...')}
                    className="flex-grow"
                    disabled={state.isProcessing}
                  />
                  {state.isProcessing ? (
                    <Button type="button" size="icon" onClick={cancelRequest}>
                      <StopCircle className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit" size="icon" disabled={!input.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  )}
                </form>

                <div className="flex justify-between w-full mt-2 text-xs text-muted-foreground">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={clearCurrentSession}
                          className="hover:underline flex items-center gap-1"
                        >
                          <RefreshCw className="h-3 w-3" /> {t('ai.清空对话')}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('ai.清空当前对话内容')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <span className="text-xs text-muted-foreground">
                    {state.config?.provider === 'local' ? t('ai.本地模式') : state.config?.provider}
                  </span>
                </div>
              </CardFooter>
            </TabsContent>

            <TabsContent value="info" className="m-0">
              <ScrollArea
                className={`${expanded ? 'h-[calc(100vh-280px)]' : 'h-80'} p-4 space-y-4 bg-card`}
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">{t('ai.关于助手')}</h3>
                    <p className="text-xs text-muted-foreground">
                      {t(
                        'ai.YanYuCloudCube智能助手是一个自治运行的AI助手，可以帮助您了解各种集成应用、解决集成问题，并提供相关建议。'
                      )}
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium mb-2">{t('ai.当前配置')}</h3>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('ai.提供商:')}</span>
                        <span>{state.config?.provider || t('ai.本地模式')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('ai.模型:')}</span>
                        <span>{state.config?.model || t('ai.默认')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('ai.温度:')}</span>
                        <span>{state.config?.temperature || 0.7}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium mb-2">{t('ai.使用提示')}</h3>
                    <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                      <li>{t('ai.您可以询问关于集成应用的问题')}</li>
                      <li>{t('ai.助手可以帮助解决集成过程中的常见问题')}</li>
                      <li>{t('ai.提供具体信息可以获得更准确的回答')}</li>
                      <li>{t('ai.点击设置图标可以配置AI提供商')}</li>
                    </ul>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium mb-2">{t('ai.支持的AI提供商')}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="border rounded p-2 text-xs">
                        <div className="font-medium">OpenAI</div>
                        <div className="text-muted-foreground">{t('ai.支持GPT-4o等模型')}</div>
                      </div>
                      <div className="border rounded p-2 text-xs">
                        <div className="font-medium">Anthropic</div>
                        <div className="text-muted-foreground">{t('ai.支持Claude系列模型')}</div>
                      </div>
                      <div className="border rounded p-2 text-xs">
                        <div className="font-medium">Google Gemini</div>
                        <div className="text-muted-foreground">{t('ai.支持Gemini系列模型')}</div>
                      </div>
                      <div className="border rounded p-2 text-xs">
                        <div className="font-medium">{t('ai.自定义API')}</div>
                        <div className="text-muted-foreground">{t('ai.支持自定义端点')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Card>
  );
}

// 辅助组件
function ChevronLeft(props: any) {
  return <ChevronDown {...props} />;
}

function ChevronRight(props: any) {
  return <ChevronUp {...props} />;
}

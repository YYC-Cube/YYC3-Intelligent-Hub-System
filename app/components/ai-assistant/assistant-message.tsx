'use client';

import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

interface AssistantMessageProps {
  content: string;
  /** 消息发送方。命名为 `sender` 以避免与 DOM 的 ARIA `role` 属性语义冲突。 */
  sender: 'user' | 'assistant';
  isLoading?: boolean;
}

export function AssistantMessage({ content, sender, isLoading = false }: AssistantMessageProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [content]);

  return (
    <div
      className={cn(
        'animate-fade-up flex gap-3 p-4 rounded-lg',
        sender === 'user' ? 'bg-brand-50 ml-8' : 'bg-card mr-8'
      )}
      ref={scrollRef}
    >
      <div className="flex-shrink-0">
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center',
            sender === 'user' ? 'bg-brand-100' : 'bg-muted'
          )}
        >
          {sender === 'user' ? (
            <User className="w-4 h-4 text-primary" />
          ) : (
            <Bot className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
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
        ) : (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

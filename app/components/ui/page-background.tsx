'use client';

import { cn } from '@/lib/utils';
import type React from 'react';

interface PageBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'pattern';
}

export function PageBackground({ children, className, variant = 'default' }: PageBackgroundProps) {
  const backgroundStyles = {
    default: 'bg-gradient-to-br from-brand-50/50 via-brand-50/30 to-brand-100/50',
    gradient: 'bg-gradient-to-br from-brand-50 via-brand-50 to-brand-100',
    pattern:
      'bg-gradient-to-br from-brand-50/50 via-brand-50/30 to-brand-100/50 bg-[radial-gradient(circle_at_1px_1px,hsl(var(--brand-400)/0.1)_1px,transparent_0)] bg-[length:20px_20px]',
  };

  return (
    <div
      className={cn(
        'min-h-screen transition-colors duration-fast ease-standard motion-reduce:transition-none',
        backgroundStyles[variant],
        className
      )}
    >
      {children}
    </div>
  );
}

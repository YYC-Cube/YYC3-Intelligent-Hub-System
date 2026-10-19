'use client';

import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const button3DVariants = cva(
  'relative inline-flex items-center justify-center font-medium transition-[transform,box-shadow,background-color,border-color,opacity] duration-fast ease-standard transform-gpu perspective-1000 preserve-3d group overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none',
  {
    variants: {
      variant: {
        primary: [
          'bg-gradient-to-br from-primary via-accent to-info',
          'hover:from-primary/90 hover:via-accent/90 hover:to-info/90',
          'text-white shadow-lg hover:shadow-xl',
          'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100',
          'after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/10 after:to-transparent',
        ],
        secondary: [
          'bg-gradient-to-br from-brand-50 via-brand-50 to-brand-100',
          'hover:from-brand-100 hover:via-brand-100 hover:to-brand-200',
          'text-foreground shadow-md hover:shadow-lg',
          'border border-border/60',
        ],
        accent: [
          'bg-gradient-to-br from-success via-success/80 to-info',
          'hover:from-success/90 hover:via-success/70 hover:to-info/90',
          'text-white shadow-lg hover:shadow-xl',
        ],
        warning: [
          'bg-gradient-to-br from-warning via-destructive to-destructive',
          'hover:from-warning/90 hover:via-destructive/90 hover:to-destructive/90',
          'text-white shadow-lg hover:shadow-xl',
        ],
        success: [
          'bg-gradient-to-br from-success via-success/85 to-info',
          'hover:from-success/90 hover:via-success/75 hover:to-info/90',
          'text-white shadow-lg hover:shadow-xl',
        ],
        glass: [
          'bg-white/10 backdrop-blur-md border border-white/20',
          'hover:bg-white/20 hover:border-white/30',
          'text-white shadow-lg hover:shadow-xl',
        ],
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-md',
        default: 'h-10 px-4 py-2 text-sm rounded-lg',
        lg: 'h-12 px-6 py-3 text-base rounded-xl',
        xl: 'h-14 px-8 py-4 text-lg rounded-2xl',
        icon: 'h-10 w-10 rounded-lg',
      },
      effect: {
        none: '',
        glow: 'hover:shadow-2xl hover:shadow-current/25',
        float: 'hover:-translate-y-1 hover:shadow-2xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      effect: 'float',
    },
  }
);

export interface Button3DProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof button3DVariants> {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button3D = React.forwardRef<HTMLButtonElement, Button3DProps>(
  ({ className, variant, size, effect, icon, iconPosition = 'left', children, ...props }, ref) => {
    return (
      <button
        className={cn(button3DVariants({ variant, size, effect }), className)}
        ref={ref}
        {...props}
      >
        {/* 3D 底面效果 */}
        <div className="absolute inset-0 bg-black/20 transform translate-y-1 translate-x-1 rounded-lg -z-10 group-hover:translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-fast ease-standard motion-reduce:transition-none" />

        {/* 光泽效果 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-fast ease-standard rounded-lg motion-reduce:transition-none" />

        {/* 内容 */}
        <div className="relative z-10 flex items-center gap-2">
          {icon && iconPosition === 'left' && (
            <span className="transition-transform duration-fast ease-standard group-hover:scale-110 motion-reduce:transition-none">
              {icon}
            </span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="transition-transform duration-fast ease-standard group-hover:scale-110 motion-reduce:transition-none">
              {icon}
            </span>
          )}
        </div>

        {/* 品牌光晕边框效果 */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary via-accent to-info opacity-0 group-hover:opacity-20 transition-opacity duration-fast ease-standard motion-reduce:transition-none" />
      </button>
    );
  }
);
Button3D.displayName = 'Button3D';

export { Button3D, button3DVariants };

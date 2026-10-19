import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva('rounded-lg border bg-card text-card-foreground shadow-sm', {
  variants: {
    variant: {
      default: 'border-border',
      primary: 'border-primary/20 bg-primary/5',
      secondary: 'border-secondary/20 bg-secondary/5',
      accent: 'border-accent/20 bg-accent/5',
      success: 'border-success/20 bg-success/5',
      warning: 'border-warning/20 bg-warning/5',
      destructive: 'border-destructive/20 bg-destructive/5',
      info: 'border-info/20 bg-info/5',
    },
    hover: {
      default: '',
      lift: 'motion-card hover:translate-y-[-4px] hover:shadow-md',
      glow: 'transition-shadow duration-fast ease-standard hover:shadow-glow motion-reduce:transition-none',
    },
  },
  defaultVariants: {
    variant: 'default',
    hover: 'default',
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

const YanyuCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, hover, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant, hover, className }))} {...props} />
  )
);
YanyuCard.displayName = 'YanyuCard';

const YanyuCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
);
YanyuCardHeader.displayName = 'YanyuCardHeader';

const YanyuCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-xl font-semibold leading-none tracking-tight', className)}
    {...props}
  >
    {children}
  </h3>
));
YanyuCardTitle.displayName = 'YanyuCardTitle';

const YanyuCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
YanyuCardDescription.displayName = 'YanyuCardDescription';

const YanyuCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
YanyuCardContent.displayName = 'YanyuCardContent';

const YanyuCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
);
YanyuCardFooter.displayName = 'YanyuCardFooter';

export {
  YanyuCard,
  YanyuCardHeader,
  YanyuCardFooter,
  YanyuCardTitle,
  YanyuCardDescription,
  YanyuCardContent,
};

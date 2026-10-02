import React from 'react';
import { cn } from '../../utils/cn';

interface PageTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3';
  gradient?: boolean;
}

export const PageTitle: React.FC<PageTitleProps> = ({
  children,
  className,
  as: Component = 'h1',
  gradient = false,
  ...props
}) => {
  return (
    <Component
      className={cn(
        'text-2xl sm:text-3xl font-extrabold tracking-tight text-white',
        gradient && 'bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export const PageSubtitle: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <p className={cn('text-sm text-slate-400 mt-1', className)} {...props}>
      {children}
    </p>
  );
};

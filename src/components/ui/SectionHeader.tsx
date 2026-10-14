import React from 'react';
import { cn } from '../../utils/cn';

interface SectionHeaderProps {
  title: string;
  body?: string;
  action?: React.ReactNode;
  align?: 'start' | 'center';
  tone?: 'dark' | 'light';
  className?: string;
  id?: string;
}

export function SectionHeader({ title, body, action, align = 'start', tone = 'dark', className, id }: SectionHeaderProps) {
  const centered = align === 'center';
  return (
    <div
      className={cn(
        'flex flex-col gap-6',
        centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between',
        className
      )}>
      
      <div className={cn('max-w-2xl', centered && 'mx-auto')}>
        <h2
          id={id}
          className={cn(
            'font-display text-[34px] font-medium leading-[1.08] tracking-[-0.015em] sm:text-[44px]',
            tone === 'light' ? 'text-white' : 'text-ink'
          )}>
          
          {title}
        </h2>
        {body &&
        <p className={cn('mt-4 text-[17px] leading-relaxed', tone === 'light' ? 'text-white/75' : 'text-muted')}>{body}</p>
        }
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>);

}
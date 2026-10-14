import React from 'react';
import { InfoIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

/** Inline disclosure for illustrative content (sample prices, profiles, reviews). */
export function SampleNote({ children, className, tone = 'dark' }: {children: React.ReactNode;className?: string;tone?: 'dark' | 'light';}) {
  return (
    <p className={cn('flex items-start gap-2 text-[13px] leading-snug', tone === 'light' ? 'text-white/70' : 'text-muted', className)}>
      <InfoIcon className="mt-[1px] h-3.5 w-3.5 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>);

}
import React from 'react';
import { cn } from '../../utils/cn';

type Tone = 'mint' | 'neutral' | 'coral' | 'white' | 'amber' | 'teal';

const tones: Record<Tone, string> = {
  mint: 'bg-mint text-brand-dark',
  neutral: 'bg-[#EEF2F0] text-ink',
  coral: 'bg-coral-soft text-[#9A3B22]',
  white: 'bg-white/95 text-ink',
  amber: 'bg-[#FDF3DC] text-[#7A5310]',
  teal: 'bg-brand text-white'
};

export function Badge({ tone = 'mint', className, children }: {tone?: Tone;className?: string;children: React.ReactNode;}) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold', tones[tone], className)}>
      {children}
    </span>);

}
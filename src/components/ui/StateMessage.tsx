import React from 'react';
import { AlertCircleIcon, SearchXIcon, CheckCircle2Icon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StateMessageProps {
  kind?: 'empty' | 'error' | 'success';
  title: string;
  body?: string;
  action?: React.ReactNode;
  className?: string;
}

export function StateMessage({ kind = 'empty', title, body, action, className }: StateMessageProps) {
  const Icon = kind === 'error' ? AlertCircleIcon : kind === 'success' ? CheckCircle2Icon : SearchXIcon;
  return (
    <div role={kind === 'error' ? 'alert' : 'status'} className={cn('flex flex-col items-center rounded-3xl border border-dashed border-line bg-white px-6 py-14 text-center', className)}>
      <span className={cn('flex h-12 w-12 items-center justify-center rounded-full', kind === 'error' ? 'bg-coral-soft text-coral' : 'bg-mint text-brand')}>
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
      {body && <p className="mt-1.5 max-w-sm text-[15px] text-muted">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>);

}
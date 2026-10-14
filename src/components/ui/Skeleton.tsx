import { cn } from '../../utils/cn';

export function Skeleton({ className }: {className?: string;}) {
  return <div aria-hidden className={cn('animate-pulse rounded-xl bg-[#EAF0ED]', className)} />;
}
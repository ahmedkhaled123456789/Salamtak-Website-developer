import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2Icon } from 'lucide-react';
import { cn } from '../../utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'light' | 'outlineLight';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  to?: string;
  loading?: boolean;
  iconEnd?: React.ReactNode;
  iconStart?: React.ReactNode;
}

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark shadow-[0_1px_0_rgba(255,255,255,0.15)_inset,0_6px_16px_-8px_rgba(15,118,110,0.6)]',
  secondary: 'bg-white text-ink border border-line hover:border-brand/40 hover:text-brand-dark',
  ghost: 'text-ink hover:bg-mint/60',
  light: 'bg-white text-brand-deep hover:bg-mint',
  outlineLight: 'border border-white/30 text-white hover:bg-white/10'
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-11 px-5 text-[15px] gap-2',
  lg: 'h-[52px] px-7 text-base gap-2'
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
{ variant = 'primary', size = 'md', to, loading = false, iconEnd, iconStart, className, children, disabled, type = 'button', ...rest },
ref)
{
  const classes = cn(
    'inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-full font-semibold transition-[background-color,color,border-color,transform] duration-150 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-55',
    variants[variant],
    sizes[size],
    className
  );
  const content =
  <>
      {loading ? <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden /> : iconStart}
      <span>{children}</span>
      {!loading && iconEnd}
    </>;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>);

  }
  return (
    <button ref={ref} type={type} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {content}
    </button>);

});
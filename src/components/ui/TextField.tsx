import React from 'react';
import { cn } from '../../utils/cn';
import { controlClass, labelClass } from '../../utils/styles';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  hideLabel?: boolean;
  multiline?: boolean;
  rows?: number;
  trailing?: React.ReactNode;
  wrapperClassName?: string;
}

export const TextField = React.forwardRef<HTMLInputElement & HTMLTextAreaElement, TextFieldProps>(function TextField(
{ label, error, hint, hideLabel, multiline, rows = 4, trailing, id, className, wrapperClassName, ...rest },
ref)
{
  const generated = React.useId();
  const fieldId = id ?? generated;
  const describedBy = [error && `${fieldId}-error`, hint && `${fieldId}-hint`].filter(Boolean).join(' ') || undefined;
  const shared = {
    id: fieldId,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    className: cn(controlClass, trailing ? 'pe-12' : undefined, className)
  };
  return (
    <div className={wrapperClassName}>
      <label htmlFor={fieldId} className={cn(labelClass, hideLabel && 'sr-only')}>
        {label}
      </label>
      <div className="relative">
        {multiline ?
        <textarea ref={ref} rows={rows} {...shared} {...rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>} /> :

        <input ref={ref} {...shared} {...rest} />
        }
        {trailing && <div className="absolute end-2 top-1/2 -translate-y-1/2">{trailing}</div>}
      </div>
      {hint && !error &&
      <p id={`${fieldId}-hint`} className="mt-1.5 text-[13px] text-muted">
          {hint}
        </p>
      }
      {error &&
      <p id={`${fieldId}-error`} className="mt-1.5 text-[13px] font-medium text-coral-dark">
          {error}
        </p>
      }
    </div>);

});
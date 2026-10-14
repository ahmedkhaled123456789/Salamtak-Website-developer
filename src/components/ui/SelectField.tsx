import React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { controlClass, labelClass } from '../../utils/styles';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  hideLabel?: boolean;
  wrapperClassName?: string;
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
{ label, options, error, hideLabel, id, wrapperClassName, className, ...rest },
ref)
{
  const generated = React.useId();
  const fieldId = id ?? generated;
  return (
    <div className={wrapperClassName}>
      {label &&
      <label htmlFor={fieldId} className={cn(labelClass, hideLabel && 'sr-only')}>
          {label}
        </label>
      }
      <div className="relative">
        <select
          ref={ref}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className={cn(controlClass, 'appearance-none pe-10', className)}
          {...rest}>
          
          {options.map((o) =>
          <option key={o.value} value={o.value}>
              {o.label}
            </option>
          )}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute end-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
      </div>
      {error &&
      <p id={`${fieldId}-error`} className="mt-1.5 text-[13px] font-medium text-coral-dark">
          {error}
        </p>
      }
    </div>);

});
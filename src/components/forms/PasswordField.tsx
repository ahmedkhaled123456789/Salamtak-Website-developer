import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import { TextField } from '../ui/TextField';

type PasswordFieldProps = Omit<React.ComponentProps<typeof TextField>, 'type' | 'trailing'>;

export const PasswordField = React.forwardRef<HTMLInputElement & HTMLTextAreaElement, PasswordFieldProps>(function PasswordField(props, ref) {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      ref={ref}
      type={visible ? 'text' : 'password'}
      trailing={
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? t('auth.hide') : t('auth.show')}
        aria-pressed={visible}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-ivory hover:text-ink">
        
          {visible ? <EyeOffIcon className="h-4 w-4" aria-hidden /> : <EyeIcon className="h-4 w-4" aria-hidden />}
        </button>
      }
      {...props} />);


});
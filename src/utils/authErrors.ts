import type { TranslationKey } from '../contexts/I18nContext';
import { ApiError } from './apiClient';

/** Maps backend auth failures to user-facing copy without leaking details. */
export function authErrorKey(error: unknown): TranslationKey {
  if (error instanceof ApiError) {
    if (error.code === 'invalid_credentials') return 'auth.invalidCredentials';
    if (error.code === 'conflict') return 'auth.emailTaken';
    if (error.code === 'session_expired') return 'auth.sessionExpired';
    if (error.code === 'not_configured') return 'common.notConfigured';
  }
  return 'common.errorBody';
}
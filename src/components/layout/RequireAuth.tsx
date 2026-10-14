import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function RequireAuth({ children }: {children: React.ReactNode;}) {
  const { isAuthenticated, sessionExpired } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    const params = new URLSearchParams({
      redirect: `${location.pathname}${location.search}`,
      reason: sessionExpired ? 'expired' : 'required'
    });
    return <Navigate to={`/sign-in?${params.toString()}`} replace />;
  }
  return <>{children}</>;
}
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { endHydration } from '../../utils/hydration';

export function ScrollToTop() {
  const { pathname } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    endHydration(); // later pages render normally, with their intro animations
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}
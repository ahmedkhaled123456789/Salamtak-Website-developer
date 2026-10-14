import React, { useState } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { isHydrating } from '../../utils/hydration';

/** One-time, short fade-up used sparingly on major content blocks. */
export function Reveal({ children, delay = 0, className }: {children: React.ReactNode;delay?: number;className?: string;}) {
  const reduce = useReducedMotion();
  const [still] = useState(() => isHydrating()); // prerendered content is already visible: no intro
  if (reduce || still) return <div className={className}>{children}</div>;
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.28, delay, ease: [0.23, 1, 0.32, 1] }}>
      
      {children}
    </m.div>);

}
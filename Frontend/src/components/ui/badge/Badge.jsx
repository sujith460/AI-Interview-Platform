import React from 'react';

const variantStyles = {
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  danger:  'bg-rose-500/10 text-rose-400 border-rose-500/20',
  info:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
  neutral: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  violet:  'bg-violet-500/10 text-violet-400 border-violet-500/20',
};

export default function Badge({ variant = 'neutral', children, className = '' }) {
  const styles = variantStyles[variant] ?? variantStyles.neutral;
  return (
    <span
      className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold ${styles} ${className}`}
    >
      {children}
    </span>
  );
}

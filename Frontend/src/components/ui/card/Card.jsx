import { cn } from '@/utils/helpers/cn';

export default function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-slate-200/80 bg-white/80 shadow-xl shadow-slate-200/50 backdrop-blur-xl',
        'dark:border-white/10 dark:bg-white/[0.04] dark:shadow-2xl dark:shadow-black/40',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

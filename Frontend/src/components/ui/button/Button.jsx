import { cn } from '@/utils/helpers/cn';
import Spinner from '@/components/ui/spinner/Spinner';

const variants = {
  primary:
    'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-purple-500 focus-visible:ring-violet-500 dark:shadow-violet-900/40',
  outline:
    'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-violet-500 dark:border-white/10 dark:bg-[#12122a]/60 dark:text-slate-200 dark:hover:border-white/20 dark:hover:bg-[#12122a]/80',
  ghost:
    'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-200',
};

const sizes = {
  md: 'h-12 px-5 text-sm',
  sm: 'h-9 px-3 text-sm',
  icon: 'h-10 w-10',
};

export default function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#070714]',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading && <Spinner size="sm" className="border-white/30 border-t-white" />}
      {children}
    </button>
  );
}

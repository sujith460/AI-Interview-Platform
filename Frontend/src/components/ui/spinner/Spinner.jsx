import { cn } from '@/utils/helpers/cn';

const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-5 w-5 border-2',
};

export default function Spinner({ size = 'md', className }) {
  return (
    <span
      className={cn(
        'inline-block animate-spin rounded-full border-slate-300 border-t-indigo-600 dark:border-slate-600 dark:border-t-indigo-400',
        sizes[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

import { cn } from '@/utils/helpers/cn';

export default function Input({
  id,
  label,
  error,
  className,
  containerClassName,
  as,
  ...props
}) {
  const Component = as === 'textarea' ? 'textarea' : 'input';

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          {label}
        </label>
      )}
      <Component
        id={id}
        className={cn(
          'w-full rounded-xl border bg-white/70 px-4 py-3 text-sm text-slate-900 outline-none transition',
          'placeholder:text-slate-400 dark:bg-slate-900/50 dark:text-slate-100 dark:placeholder:text-slate-500',
          'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
          error
            ? 'border-red-400 dark:border-red-500'
            : 'border-slate-200 dark:border-slate-700',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

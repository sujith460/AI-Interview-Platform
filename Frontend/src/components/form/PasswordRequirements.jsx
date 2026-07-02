import { cn } from '@/utils/helpers/cn';

const REQUIREMENTS = [
  { key: 'minLength', label: '8+ characters' },
  { key: 'uppercase', label: '1 uppercase letter' },
  { key: 'number', label: '1 number' },
];

export default function PasswordRequirements({ checks }) {
  return (
    <div className="space-y-2.5">
      <p className="text-xs text-slate-500 dark:text-slate-400">Password must contain:</p>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {REQUIREMENTS.map(({ key, label }) => {
          const met = checks[key];

          return (
            <div
              key={key}
              className={cn(
                'flex items-center gap-1.5 text-xs transition-colors',
                met ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'
              )}
            >
              <span
                className={cn(
                  'flex h-4 w-4 items-center justify-center rounded-full border',
                  met
                    ? 'border-emerald-500/50 bg-emerald-500/10'
                    : 'border-slate-300 bg-transparent dark:border-slate-600'
                )}
              >
                {met && (
                  <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path
                      d="M2.5 6l2.5 2.5 4.5-5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

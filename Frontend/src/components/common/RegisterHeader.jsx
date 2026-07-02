import { Link } from 'react-router-dom';
import ThemeToggle from '@/components/common/ThemeToggle';

export default function RegisterHeader() {
  return (
    <header className="relative z-10 border-b border-slate-200/60 bg-white/70 backdrop-blur-md dark:border-white/5 dark:bg-[#070714]/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 text-xs font-bold text-white shadow-lg shadow-violet-900/40">
            AI
          </div>
          <span className="text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
            AI Interview Platform
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block sm:text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-violet-600 transition hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300"
            >
              Sign in
            </Link>
          </p>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

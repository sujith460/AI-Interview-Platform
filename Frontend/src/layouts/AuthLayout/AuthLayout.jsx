import ThemeToggle from '@/components/common/ThemeToggle';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="register-grid relative min-h-screen overflow-hidden bg-slate-50 dark:bg-[#070714]">
      <div className="pointer-events-none absolute inset-0 bg-register-glow opacity-60 dark:opacity-100" />
      <div className="pointer-events-none absolute -left-32 top-32 h-96 w-96 rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-600/10" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-600/10" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md animate-slide-up">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 text-lg font-bold text-white shadow-lg shadow-violet-900/30 dark:shadow-violet-900/50">
              AI
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] dark:shadow-2xl dark:shadow-black/40 sm:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

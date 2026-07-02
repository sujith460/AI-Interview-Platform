import ThemeToggle from '@/components/common/ThemeToggle';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-white to-violet-100 dark:from-slate-950 dark:via-indigo-950 dark:to-violet-950" />
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/10" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-violet-400/20 blur-3xl dark:bg-violet-500/10" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md animate-slide-up">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-lg font-bold text-white shadow-lg shadow-indigo-500/30">
              AI
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {subtitle}
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/50 dark:shadow-black/20 sm:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

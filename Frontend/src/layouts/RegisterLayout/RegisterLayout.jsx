import RegisterHeader from '@/components/common/RegisterHeader';
import RegisterMarketingPanel from '@/components/common/RegisterMarketingPanel';

export default function RegisterLayout({ children }) {
  return (
    <div className="register-grid relative min-h-screen overflow-hidden bg-slate-50 dark:bg-[#070714]">
      <div className="pointer-events-none absolute inset-0 bg-register-glow opacity-60 dark:opacity-100" />
      <div className="pointer-events-none absolute -left-32 top-32 h-96 w-96 rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-600/10" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-600/10" />

      <div className="pointer-events-none absolute left-8 top-1/3 hidden h-40 w-40 opacity-20 lg:block dark:opacity-30">
        <svg viewBox="0 0 200 200" className="h-full w-full text-violet-500/40" fill="none">
          <path
            d="M20 180 Q 80 40 180 20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />
        </svg>
      </div>

      <RegisterHeader />

      <main className="relative mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 py-10 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:gap-16 lg:px-8 lg:py-14">
        <RegisterMarketingPanel />

        <div className="w-full max-w-md lg:max-w-[440px] lg:pt-4">
          <div className="mb-6 text-center lg:hidden">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-600 dark:text-violet-300">
              AI-Powered
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Ace Your{' '}
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-purple-400">
                Dream Interviews
              </span>
            </h1>
          </div>

          <div className="animate-slide-up">{children}</div>
        </div>
      </main>
    </div>
  );
}

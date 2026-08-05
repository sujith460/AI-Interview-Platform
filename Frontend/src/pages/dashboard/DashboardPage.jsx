import { useNavigate } from 'react-router-dom';
import Alert from '@/components/ui/alert/Alert';
import Button from '@/components/ui/button/Button';
import Card from '@/components/ui/card/Card';
import Spinner from '@/components/ui/spinner/Spinner';
import ThemeToggle from '@/components/common/ThemeToggle';
import useCurrentUser from '@/hooks/user/useCurrentUser';
import { TOKEN_KEY } from '@/utils/constants/auth';
import { UPCOMING_FEATURES } from '@/utils/constants/dashboard';
import { cn } from '@/utils/helpers/cn';
import { calculateProfileCompletion } from '@/utils/helpers/profileCompletion';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, isLoading, error, refetch } = useCurrentUser();

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    navigate('/login');
  };

  return (
    <div className="register-grid relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#070714] dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-register-glow opacity-60 dark:opacity-100" />
      <div className="pointer-events-none absolute -left-32 top-32 h-96 w-96 rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-600/10" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-600/10" />

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
            <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
              Profile
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-4 py-24 animate-fade-in">
            <Spinner className="h-10 w-10 border-[3px] border-violet-200 border-t-violet-600 dark:border-violet-900 dark:border-t-violet-400" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading your profile...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="mx-auto max-w-lg animate-slide-up">
            <Alert variant="error">{error}</Alert>
            <Button variant="outline" className="mt-4 w-full" onClick={refetch}>
              Try again
            </Button>
          </div>
        )}

        {!isLoading && !error && user && (
          <div className="space-y-8 animate-slide-up">
            {/* Header Hero Area */}
            <Card className="relative overflow-hidden p-6 sm:p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-900/20 dark:to-purple-900/20" />
              <div className="relative">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold tracking-wider text-violet-600 dark:text-violet-400 uppercase">
                      {(() => {
                        const hr = new Date().getHours();
                        if (hr < 12) return 'Good Morning';
                        if (hr < 17) return 'Good Afternoon';
                        return 'Good Evening';
                      })()}
                    </p>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                      {user.fullName}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                      Welcome to your AI Interview Preparation hub. Track your readiness, practice coding challenges, and clear mock interviews with live AI assessors.
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 text-xl font-bold text-white shadow-lg shadow-violet-900/30">
                      {localStorage.getItem('profile_avatar') ? (
                        <img
                          src={localStorage.getItem('profile_avatar')}
                          alt={user.fullName}
                          className="h-full w-full rounded-2xl object-cover"
                        />
                      ) : (
                        user.fullName?.charAt(0)?.toUpperCase() || 'U'
                      )}
                      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 opacity-30 blur-lg -z-10" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-white/5 grid gap-6 sm:grid-cols-2 items-center">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <ProfileField label="Full Name" value={user.fullName} />
                    <ProfileField label="Email" value={user.email} />
                  </div>

                  {/* Dynamic profile completion widget in dashboard */}
                  <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profile Setup</p>
                      <button
                        onClick={() => navigate('/profile')}
                        className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline text-left block"
                      >
                        Complete settings →
                      </button>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                        {calculateProfileCompletion(user)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <section>
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Quick Actions &amp; Modules
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Select a practice module to begin your technical preparation.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {UPCOMING_FEATURES.map(({ title, description, icon: Icon, accent, statusClass }) => {
                  // Derive action config from title
                  const config = (() => {
                    if (title === 'AI Interview')
                      return { onClick: () => navigate('/interview/start'), label: 'Start Interview', btnGradient: 'from-violet-600 via-indigo-600 to-purple-700', shadow: 'shadow-violet-500/30' };
                    if (title === 'Practice Coding')
                      return { onClick: () => navigate('/practice'), label: 'Get Started', btnGradient: 'from-indigo-600 via-blue-600 to-indigo-700', shadow: 'shadow-indigo-500/30' };
                    if (title === 'Interview History')
                      return { onClick: () => navigate('/interview/history'), label: 'View History', btnGradient: 'from-emerald-600 via-teal-600 to-emerald-700', shadow: 'shadow-emerald-500/30' };
                    if (title === 'Profile')
                      return { onClick: () => navigate('/profile'), label: 'Manage Profile', btnGradient: 'from-amber-500 via-orange-500 to-amber-600', shadow: 'shadow-amber-500/30' };
                    if (title === 'Analytics')
                      return { onClick: () => navigate('/analytics'), label: 'View Analytics', btnGradient: 'from-cyan-600 via-sky-600 to-blue-700', shadow: 'shadow-cyan-500/30' };
                    return null;
                  })();

                  return (
                    <DashboardCard
                      key={title}
                      title={title}
                      description={description}
                      accent={accent}
                      statusClass={statusClass}
                      config={config}
                    >
                      <Icon />
                    </DashboardCard>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

function ProfileField({ label, value, className }) {
  return (
    <div className={className}>
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function DashboardCard({ title, description, accent, statusClass, config, children }) {
  const isActive = !!config;

  return (
    <Card
      onClick={isActive ? config.onClick : undefined}
      className={cn(
        'group relative overflow-hidden p-5 transition-all duration-300 border flex flex-col justify-between',
        isActive
          ? 'cursor-pointer border-slate-200/60 dark:border-white/5 hover:-translate-y-1.5 hover:shadow-xl dark:hover:border-violet-500/20 dark:hover:bg-white/[0.025] hover:border-violet-400/30'
          : 'border-slate-200/40 dark:border-white/5 opacity-80'
      )}
      aria-disabled={!isActive}
    >
      {/* Subtle hover glow */}
      {isActive && (
        <div
          className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl bg-gradient-to-br ${accent} blur-2xl`}
          style={{ opacity: 0 }}
        />
      )}

      <div className="relative">
        {/* Icon Container with Diagonal Ribbon for Inactive Modules */}
        <div className="relative inline-block mb-4">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg transition-transform duration-300 group-hover:scale-105 overflow-hidden relative`}
          >
            {children}

            {/* Diagonal COMING SOON Ribbon overlay matching reference UI screenshot */}
            {!isActive && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
                <div className="absolute top-[8px] -left-[28px] w-[95px] -rotate-45 bg-black/95 border-y border-white/20 py-[1px] text-[7px] font-black tracking-widest text-white text-center shadow-lg uppercase leading-tight">
                  COMING SOON
                </div>
              </div>
            )}
          </div>
        </div>

        <h3 className="font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      {/* Action Area */}
      {isActive ? (
        <div className="mt-5 relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              config.onClick();
            }}
            className={cn(
              'w-full h-10 flex items-center justify-center gap-2 rounded-xl text-xs font-bold text-white',
              'bg-gradient-to-r shadow-md transition-all duration-200',
              'hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]',
              config.btnGradient,
              config.shadow
            )}
          >
            {config.label}
            <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="mt-5 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500/80 animate-pulse" />
          <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 tracking-wide">Coming Soon</p>
        </div>
      )}
    </Card>
  );
}

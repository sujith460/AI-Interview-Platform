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
                        {(() => {
                          const savedAvatar = localStorage.getItem('profile_avatar');
                          const savedResume = localStorage.getItem('profile_resume');
                          const fields = [user.fullName, user.email, savedAvatar, savedResume];
                          const filled = fields.filter(Boolean).length;
                          return Math.round((filled / fields.length) * 100);
                        })()}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <section>
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Quick Actions & Modules
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Select a practice module to begin your technical preparation.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {UPCOMING_FEATURES.map(({ title, description, icon: Icon, accent, statusClass }) => {
                  let onClick = null;
                  let actionText = null;
                  let isButton = false;
                  if (title === 'AI Interview') {
                    onClick = () => navigate('/interview/start');
                    actionText = 'Start Interview';
                    isButton = true;
                  } else if (title === 'Practice Coding') {
                    onClick = () => navigate('/practice');
                  } else if (title === 'Profile') {
                    onClick = () => navigate('/profile');
                  }
                  return (
                    <DashboardCard
                      key={title}
                      title={title}
                      description={description}
                      accent={accent}
                      statusClass={statusClass}
                      onClick={onClick}
                      actionText={actionText}
                      isButton={isButton}
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

function DashboardCard({ title, description, accent, statusClass, onClick, actionText, isButton, children }) {
  const isActive = !!onClick;
  return (
    <Card
      onClick={onClick}
      className={cn(
        "p-5 transition-all duration-200 border border-slate-200/60 dark:border-white/5 flex flex-col justify-between",
        isActive 
          ? "cursor-pointer hover:-translate-y-1 hover:shadow-lg dark:hover:border-violet-500/30 dark:hover:bg-white/[0.03] hover:border-violet-500/20" 
          : "opacity-90"
      )}
      aria-disabled={!isActive}
    >
      <div>
        <div
          className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-white shadow-lg`}
        >
          {children}
        </div>
        <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
      {isButton ? (
        <div className="mt-4">
          <Button
            size="sm"
            className="w-full text-xs shadow-none"
            onClick={(e) => {
              e.stopPropagation();
              if (onClick) onClick();
            }}
          >
            {actionText || 'Start Interview'}
          </Button>
        </div>
      ) : isActive ? (
        <p className="mt-4 text-xs font-bold text-violet-600 dark:text-violet-400 flex items-center gap-1">
          {actionText || 'Get Started'}
          <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </p>
      ) : (
        <p className={`mt-4 text-xs font-medium ${statusClass}`}>Coming Soon</p>
      )}
    </Card>
  );
}

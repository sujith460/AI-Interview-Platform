import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/ui/button/Button';
import Card from '@/components/ui/card/Card';
import ThemeToggle from '@/components/common/ThemeToggle';
import { cn } from '@/utils/helpers/cn';

export default function InterviewRoomPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId: paramSessionId } = useParams();

  const session = location.state?.session || null;

  const sessionId = session?.sessionId || paramSessionId || 'N/A';
  const companyName = session?.companyName || 'N/A';
  const interviewType = session?.interviewType || 'N/A';
  const difficulty = session?.difficulty || 'N/A';
  const interviewState = session?.state || 'N/A';
  const createdAt = session?.createdAt
    ? new Date(session.createdAt).toLocaleString()
    : 'N/A';

  return (
    <div className="register-grid relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#070714] dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-register-glow opacity-60 dark:opacity-100" />
      <div className="pointer-events-none absolute -left-32 top-32 h-96 w-96 rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-600/10" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-600/10" />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-200/60 bg-white/70 backdrop-blur-md dark:border-white/5 dark:bg-[#070714]/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 text-xs font-bold text-white shadow-lg shadow-violet-900/40 transition-transform hover:scale-105 active:scale-95"
            >
              AI
            </button>
            <span className="text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
              Interview Room
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-600 dark:text-violet-400 border border-violet-500/20 mb-3">
            <span className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
            Session Created
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Interview Workspace
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Review your session details below before initiating the AI interview process.
          </p>
        </div>

        <Card className="overflow-hidden border border-slate-200/60 p-6 backdrop-blur-md dark:border-white/5 dark:bg-white/[0.02] sm:p-8">
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <DetailItem label="Session ID" value={sessionId} isCopyable />
              <DetailItem label="Company Name" value={companyName} />
              <DetailItem label="Interview Type" value={interviewType} />
              <DetailItem
                label="Difficulty"
                value={difficulty}
                badgeClass={cn(
                  difficulty === 'EASY' && 'text-emerald-600 dark:text-emerald-400',
                  difficulty === 'MEDIUM' && 'text-amber-600 dark:text-amber-400',
                  difficulty === 'HARD' && 'text-rose-600 dark:text-rose-400'
                )}
              />
              <DetailItem label="Interview State" value={interviewState} />
              <DetailItem label="Created Time" value={createdAt} />
            </div>

            <div className="pt-6 border-t border-slate-200/60 dark:border-white/5">
              <Button
                variant="primary"
                disabled
                className="w-full h-12 text-base font-bold opacity-60 cursor-not-allowed"
              >
                Start Conversation
              </Button>
              <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">
                Conversation module is coming soon.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}

function DetailItem({ label, value, badgeClass, isCopyable }) {
  return (
    <div className="rounded-xl border border-slate-200/50 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-slate-900/40">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <p
        className={cn(
          'mt-1.5 font-bold text-slate-900 dark:text-white truncate',
          badgeClass || 'text-sm sm:text-base'
        )}
      >
        {value}
      </p>
    </div>
  );
}

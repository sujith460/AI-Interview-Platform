import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/button/Button';
import ThemeToggle from '@/components/common/ThemeToggle';
import SummaryCards from '@/components/history/SummaryCards';
import HistoryToolbar from '@/components/history/HistoryToolbar';
import InterviewCard from '@/components/history/InterviewCard';
import HistorySkeleton from '@/components/history/HistorySkeleton';
import HistoryEmptyState from '@/components/history/HistoryEmptyState';
import InterviewReportModal from '@/components/history/InterviewReportModal';
import ReplayInterviewModal from '@/components/history/ReplayInterviewModal';
import DeleteInterviewModal from '@/components/history/DeleteInterviewModal';
import Toast from '@/components/ui/toast/Toast';
import { getUserInterviewHistory } from '@/services/interview/interviewService';
import { TOKEN_KEY } from '@/utils/constants/auth';

export default function InterviewHistoryPage() {
  const navigate = useNavigate();

  // State Management
  const [historyData, setHistoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  // Toolbar state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST');

  // Active Modals state
  const [reportSessionId, setReportSessionId] = useState(null);
  const [replaySession, setReplaySession] = useState(null);
  const [deleteSession, setDeleteSession] = useState(null);

  const fetchHistory = () => {
    setIsLoading(true);
    setError(null);
    getUserInterviewHistory()
      .then((data) => {
        setHistoryData(data);
      })
      .catch((err) => {
        console.error('Failed to fetch history', err);
        setError('Failed to load interview history. Please check connection and try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    navigate('/login');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setTypeFilter('ALL');
    setDifficultyFilter('ALL');
    setSortBy('NEWEST');
  };

  const handleDeleteSuccess = (deletedId) => {
    setToast({ message: 'Interview session deleted successfully.', type: 'success' });
    setHistoryData((prev) => {
      if (!prev) return prev;
      const updatedSessions = prev.sessions?.filter((s) => s.sessionId !== deletedId) || [];
      return {
        ...prev,
        totalInterviews: updatedSessions.length,
        sessions: updatedSessions,
      };
    });
  };

  // Filter & Sort Logic
  const filteredSessions = useMemo(() => {
    if (!historyData?.sessions) return [];

    return historyData.sessions
      .filter((session) => {
        // Search query (Company or Role)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const compMatch = session.companyName?.toLowerCase().includes(q);
          const roleMatch = session.role?.toLowerCase().includes(q);
          if (!compMatch && !roleMatch) return false;
        }

        // Status Filter
        if (statusFilter !== 'ALL' && session.state !== statusFilter) {
          return false;
        }

        // Type Filter
        if (typeFilter !== 'ALL' && session.interviewType !== typeFilter) {
          return false;
        }

        // Difficulty Filter
        if (difficultyFilter !== 'ALL' && session.difficulty !== difficultyFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'NEWEST') {
          return new Date(b.startedAt || b.createdAt) - new Date(a.startedAt || a.createdAt);
        }
        if (sortBy === 'OLDEST') {
          return new Date(a.startedAt || a.createdAt) - new Date(b.startedAt || b.createdAt);
        }
        if (sortBy === 'HIGHEST_SCORE') {
          return (b.overallScore || 0) - (a.overallScore || 0);
        }
        if (sortBy === 'LOWEST_SCORE') {
          return (a.overallScore || 0) - (b.overallScore || 0);
        }
        if (sortBy === 'LONGEST_DURATION') {
          return (b.durationMinutes || 0) - (a.durationMinutes || 0);
        }
        return 0;
      });
  }, [historyData, searchQuery, statusFilter, typeFilter, difficultyFilter, sortBy]);

  const isFiltered =
    searchQuery ||
    statusFilter !== 'ALL' ||
    typeFilter !== 'ALL' ||
    difficultyFilter !== 'ALL' ||
    sortBy !== 'NEWEST';

  return (
    <div className="register-grid relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#070714] dark:text-slate-100 pb-16">
      {/* Background Decorative Glows */}
      <div className="pointer-events-none absolute inset-0 bg-register-glow opacity-60 dark:opacity-100" />
      <div className="pointer-events-none absolute -left-32 top-32 h-96 w-96 rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-600/10" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-600/10" />

      {/* App Header */}
      <header className="relative z-10 border-b border-slate-200/60 bg-white/70 backdrop-blur-md dark:border-white/5 dark:bg-[#070714]/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 text-xs font-bold text-white shadow-lg shadow-violet-900/40">
              AI
            </div>
            <span className="text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
              AI Interview Platform
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                Dashboard Module
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Interview History
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              Review past mock interviews, inspect detailed performance reports, replay conversations, and track your technical readiness over time.
            </p>
          </div>

          <button
            onClick={() => navigate('/interview/start')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-900/40 hover:scale-105 active:scale-95 transition-all shrink-0"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Start New Interview
          </button>
        </div>

        {isLoading ? (
          <HistorySkeleton />
        ) : error ? (
          <div className="mx-auto max-w-md text-center py-16 space-y-4">
            <p className="text-rose-400 text-sm">{error}</p>
            <Button variant="outline" onClick={fetchHistory}>
              Try Again
            </Button>
          </div>
        ) : (
          <>
            {/* Top Summary Statistics Cards */}
            <SummaryCards
              totalInterviews={historyData?.totalInterviews || 0}
              averageScore={historyData?.averageScore || 0}
              averageDuration={historyData?.averageDurationMinutes || 0}
              lastInterviewDate={historyData?.lastInterviewDate}
            />

            {/* Search and Filters Toolbar */}
            <HistoryToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              typeFilter={typeFilter}
              onTypeChange={setTypeFilter}
              difficultyFilter={difficultyFilter}
              onDifficultyChange={setDifficultyFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onResetFilters={handleResetFilters}
            />

            {/* Interview Cards Grid or Empty State */}
            {filteredSessions.length === 0 ? (
              <HistoryEmptyState isFiltered={isFiltered} onResetFilters={handleResetFilters} />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSessions.map((session) => (
                  <InterviewCard
                    key={session.sessionId}
                    session={session}
                    onViewReport={(s) => setReportSessionId(s.sessionId)}
                    onReplay={(s) => setReplaySession(s)}
                    onDelete={(s) => setDeleteSession(s)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <InterviewReportModal
        isOpen={!!reportSessionId}
        onClose={() => setReportSessionId(null)}
        sessionId={reportSessionId}
      />

      <ReplayInterviewModal
        isOpen={!!replaySession}
        onClose={() => setReplaySession(null)}
        session={replaySession}
      />

      <DeleteInterviewModal
        isOpen={!!deleteSession}
        onClose={() => setDeleteSession(null)}
        session={deleteSession}
        onDeleteSuccess={handleDeleteSuccess}
      />

      {/* Toast Alert */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />
    </div>
  );
}

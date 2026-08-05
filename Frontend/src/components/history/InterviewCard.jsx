import React from 'react';
import Card from '@/components/ui/card/Card';
import Badge from '@/components/ui/badge/Badge';
import CompanyLogo from '@/components/common/CompanyLogo';

export default function InterviewCard({ session, onViewReport, onReplay, onDelete }) {
  const {
    companyName,
    companyLogoUrl,
    role,
    interviewType,
    difficulty,
    state,
    startedAt,
    createdAt,
    durationMinutes = 0,
    overallScore = 0,
  } = session;

  // Format Date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'N/A';
    }
  };

  // Status Badge Styling
  const getStatusBadge = () => {
    switch (state) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Completed
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20 animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            In Progress
          </span>
        );
      case 'CANCELLED':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 px-2.5 py-1 text-xs font-semibold text-slate-400 border border-slate-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Cancelled
          </span>
        );
    }
  };

  // Difficulty Badge
  const getDifficultyBadge = () => {
    switch (difficulty) {
      case 'EASY':
        return <Badge variant="success">Easy</Badge>;
      case 'MEDIUM':
        return <Badge variant="warning">Medium</Badge>;
      case 'HARD':
        return <Badge variant="danger">Hard</Badge>;
      default:
        return <Badge variant="neutral">{difficulty}</Badge>;
    }
  };

  // Score Badge Color
  const getScoreColor = () => {
    if (overallScore >= 80) return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', bar: 'from-emerald-500 to-teal-400' };
    if (overallScore >= 60) return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', bar: 'from-amber-500 to-yellow-400' };
    return { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', bar: 'from-rose-500 to-red-400' };
  };

  const scoreTheme = getScoreColor();

  return (
    <Card className="group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-500/30 hover:shadow-2xl dark:border-white/10 dark:bg-[#0d0e24]/80 flex flex-col justify-between">
      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <CompanyLogo name={companyName} logoUrl={companyLogoUrl} className="h-12 w-12" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-violet-400 transition-colors">
                {companyName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{role || 'Software Engineer'}</p>
            </div>
          </div>
          <div>{getStatusBadge()}</div>
        </div>

        {/* Type & Difficulty Badges */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-white/5 dark:text-slate-300">
            {interviewType?.replace('_', ' ')}
          </span>
          {getDifficultyBadge()}
          <span className="flex items-center gap-1 text-xs text-slate-400 ml-auto">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {durationMinutes} min
          </span>
        </div>

        {/* Score Progress Bar */}
        <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-white/5 dark:bg-white/[0.02]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-slate-500 dark:text-slate-400">Performance Score</span>
            <span className={`font-bold px-2 py-0.5 rounded-md border ${scoreTheme.bg} ${scoreTheme.text} ${scoreTheme.border}`}>
              {overallScore}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${scoreTheme.bar} transition-all duration-500`}
              style={{ width: `${overallScore}%` }}
            />
          </div>
        </div>

        {/* Metadata Footer */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
          <span>Date: {formatDate(startedAt || createdAt)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-white/5">
        <button
          onClick={() => onViewReport(session)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-violet-600/10 px-3 py-2 text-xs font-bold text-violet-400 border border-violet-500/20 hover:bg-violet-600 hover:text-white transition-all shadow-sm"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Report
        </button>

        <button
          onClick={() => onReplay(session)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600/10 px-3 py-2 text-xs font-bold text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Replay
        </button>

        <button
          onClick={() => onDelete(session)}
          title="Delete Interview"
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200/60 bg-slate-100 text-slate-400 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 transition-all dark:border-white/10 dark:bg-white/5"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </Card>
  );
}

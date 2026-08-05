import React from 'react';
import Card from '@/components/ui/card/Card';

export default function SummaryCards({ totalInterviews = 0, averageScore = 0, averageDuration = 0, lastInterviewDate }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return 'N/A';
    }
  };

  const cards = [
    {
      title: 'Total Interviews',
      value: totalInterviews,
      subtext: 'Completed sessions',
      gradient: 'from-violet-600 to-indigo-600',
      icon: (
        <svg className="h-6 w-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: 'Average Score',
      value: `${averageScore}%`,
      subtext: 'Across all modules',
      gradient: 'from-emerald-600 to-teal-600',
      icon: (
        <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: 'Average Duration',
      value: `${averageDuration} min`,
      subtext: 'Per interview session',
      gradient: 'from-blue-600 to-cyan-600',
      icon: (
        <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Last Interview',
      value: formatDate(lastInterviewDate),
      subtext: 'Most recent activity',
      gradient: 'from-purple-600 to-fuchsia-600',
      icon: (
        <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.title}
          className="relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.02]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {card.title}
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/80 dark:bg-white/5">
              {card.icon}
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {card.value}
            </span>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{card.subtext}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

import React from 'react';

export default function HistorySkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Summary Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 dark:border-white/5 dark:bg-white/[0.02]"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-slate-800 dark:bg-slate-700/50" />
              <div className="h-8 w-8 rounded-xl bg-slate-800 dark:bg-slate-700/50" />
            </div>
            <div className="mt-4 h-7 w-16 rounded bg-slate-800 dark:bg-slate-700/50" />
          </div>
        ))}
      </div>

      {/* Toolbar Skeleton */}
      <div className="h-14 rounded-2xl border border-slate-800 bg-slate-900/60 dark:border-white/5 dark:bg-white/[0.02]" />

      {/* Cards Grid Skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-64 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 dark:border-white/5 dark:bg-white/[0.02]"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-slate-800 dark:bg-slate-700/50 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-32 rounded bg-slate-800 dark:bg-slate-700/50" />
                <div className="h-3 w-20 rounded bg-slate-800 dark:bg-slate-700/50" />
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="h-3 w-full rounded bg-slate-800 dark:bg-slate-700/50" />
              <div className="h-3 w-3/4 rounded bg-slate-800 dark:bg-slate-700/50" />
            </div>
            <div className="mt-8 flex gap-3">
              <div className="h-9 flex-1 rounded-xl bg-slate-800 dark:bg-slate-700/50" />
              <div className="h-9 flex-1 rounded-xl bg-slate-800 dark:bg-slate-700/50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

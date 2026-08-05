import React from 'react';

export default function HistoryToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  difficultyFilter,
  onDifficultyChange,
  sortBy,
  onSortChange,
  onResetFilters,
}) {
  const hasActiveFilters =
    searchQuery ||
    statusFilter !== 'ALL' ||
    typeFilter !== 'ALL' ||
    difficultyFilter !== 'ALL' ||
    sortBy !== 'NEWEST';

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white/60 p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.02]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by company or role..."
            className="w-full rounded-xl border border-slate-200 bg-white/80 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-white/10 dark:bg-slate-900/60 dark:text-white dark:placeholder-slate-500"
          />
        </div>

        {/* Filter Dropdowns / Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-xs font-medium text-slate-700 transition-colors focus:border-violet-500 focus:outline-none dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200"
          >
            <option value="ALL">Status: All</option>
            <option value="COMPLETED">Completed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-xs font-medium text-slate-700 transition-colors focus:border-violet-500 focus:outline-none dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200"
          >
            <option value="ALL">Type: All</option>
            <option value="DSA">DSA</option>
            <option value="BEHAVIOURAL">Behavioural</option>
            <option value="SYSTEM_DESIGN">System Design</option>
          </select>

          {/* Difficulty Filter */}
          <select
            value={difficultyFilter}
            onChange={(e) => onDifficultyChange(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-xs font-medium text-slate-700 transition-colors focus:border-violet-500 focus:outline-none dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200"
          >
            <option value="ALL">Difficulty: All</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-xs font-medium text-slate-700 transition-colors focus:border-violet-500 focus:outline-none dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200"
          >
            <option value="NEWEST">Sort: Newest</option>
            <option value="OLDEST">Sort: Oldest</option>
            <option value="HIGHEST_SCORE">Highest Score</option>
            <option value="LOWEST_SCORE">Lowest Score</option>
            <option value="LONGEST_DURATION">Longest Duration</option>
          </select>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import Button from '@/components/ui/button/Button';
import Card from '@/components/ui/card/Card';
import { useNavigate } from 'react-router-dom';

export default function HistoryEmptyState({ isFiltered = false, onResetFilters }) {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed dark:border-white/10 dark:bg-white/[0.01] my-8 animate-fade-in">
      {/* Icon Illustration Container */}
      <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600/20 to-purple-600/20 border border-violet-500/20 text-violet-400 shadow-xl">
        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <div className="absolute -inset-2 rounded-3xl bg-violet-600/10 blur-xl -z-10" />
      </div>

      {isFiltered ? (
        <>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No matching interviews found</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md">
            No interview sessions match your active search term or filter criteria. Try resetting your search filters.
          </p>
          <div className="mt-6">
            <Button variant="outline" onClick={onResetFilters}>
              Reset Filters
            </Button>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No interviews completed yet.</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
            Practice AI-driven technical interviews, get live feedback, and track your progress over time. Start your first session now!
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/interview/start')}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-violet-900/40 hover:scale-105 active:scale-95 transition-all"
            >
              Start Interview
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </>
      )}
    </Card>
  );
}

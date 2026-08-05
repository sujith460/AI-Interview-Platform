import React, { useEffect, useState } from 'react';
import Modal from '@/components/ui/modal/Modal';
import Spinner from '@/components/ui/spinner/Spinner';
import CompanyLogo from '@/components/common/CompanyLogo';
import Badge from '@/components/ui/badge/Badge';
import { getInterviewReport } from '@/services/interview/interviewService';

export default function InterviewReportModal({ isOpen, onClose, sessionId }) {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !sessionId) return;
    setIsLoading(true);
    setError(null);
    getInterviewReport(sessionId)
      .then((data) => {
        setReport(data);
      })
      .catch((err) => {
        console.error('Failed to load report', err);
        setError('Failed to load interview report details.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isOpen, sessionId]);

  if (!isOpen) return null;

  const session = report?.session;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner className="h-10 w-10 border-violet-500" />
          <p className="mt-4 text-sm text-slate-400">Loading interview performance report...</p>
        </div>
      ) : error ? (
        <div className="p-6 text-center text-rose-400">{error}</div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          {/* Header Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-900/40 via-purple-900/20 to-slate-900 border border-violet-500/20 p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <CompanyLogo name={session?.companyName} logoUrl={session?.companyLogoUrl} className="h-14 w-14" />
                <div>
                  <h2 className="text-2xl font-extrabold text-white">{session?.companyName}</h2>
                  <p className="text-sm font-medium text-violet-300">{session?.role || 'Software Engineer'}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-lg bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-slate-200">
                      {session?.interviewType?.replace('_', ' ')}
                    </span>
                    <Badge variant="warning">{session?.difficulty}</Badge>
                    <span className="rounded-lg bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                      Recommendation: {report?.hiringRecommendation || 'Hire'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Overall Score Gauge */}
              <div className="flex flex-col items-center justify-center rounded-2xl bg-white/5 p-4 border border-white/10 shrink-0 min-w-[140px]">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Overall Score</span>
                <div className="mt-1 text-4xl font-extrabold bg-gradient-to-r from-violet-400 to-purple-300 bg-clip-text text-transparent">
                  {session?.overallScore}%
                </div>
                <span className="text-[11px] text-slate-400 mt-1">{session?.durationMinutes} mins total</span>
              </div>
            </div>
          </div>

          {/* AI Executive Feedback Summary */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 dark:border-white/10 dark:bg-white/[0.02] space-y-3">
            <h3 className="flex items-center gap-2 text-base font-bold text-white">
              <svg className="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI Assessment Summary
            </h3>
            <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-line">
              {report?.overallSummary}
            </p>
          </div>

          {/* Question Timeline Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Question Timeline &amp; Performance Breakdown
            </h3>

            <div className="relative border-l-2 border-violet-500/20 pl-6 ml-3 space-y-8">
              {report?.questionTimeline?.map((item) => (
                <div key={item.questionNumber} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[31px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white ring-4 ring-slate-950">
                    {item.questionNumber}
                  </div>

                  {/* Question Card */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 dark:border-white/10 dark:bg-[#12132e] space-y-4 shadow-lg">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="text-sm font-bold text-slate-100 flex-1">
                        Question #{item.questionNumber}: {item.question}
                      </h4>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="rounded-md bg-violet-500/10 px-2 py-1 text-xs font-bold text-violet-400 border border-violet-500/20">
                          Score: {item.score}%
                        </span>
                        <span className="text-xs text-slate-400">{Math.round(item.timeTakenSeconds / 60)}m {item.timeTakenSeconds % 60}s</span>
                      </div>
                    </div>

                    {/* Candidate Response */}
                    <div className="rounded-xl bg-slate-950/60 p-4 border border-white/5">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Candidate Answer:</p>
                      <p className="text-sm text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                        {item.candidateResponse}
                      </p>
                    </div>

                    {/* AI Evaluation */}
                    <div className="rounded-xl bg-violet-950/20 p-4 border border-violet-500/15">
                      <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">AI Evaluation &amp; Guidance:</p>
                      <p className="text-sm text-slate-200 leading-relaxed">
                        {item.evaluation}
                      </p>
                    </div>

                    {/* Strengths & Weaknesses Chips */}
                    <div className="grid gap-3 sm:grid-cols-2 pt-2">
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Key Strengths:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.strengths?.map((str, idx) => (
                            <span key={idx} className="rounded-lg bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-300 border border-emerald-500/20">
                              ✓ {str}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Areas for Improvement:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.weaknesses?.map((wk, idx) => (
                            <span key={idx} className="rounded-lg bg-rose-500/10 px-2 py-1 text-[11px] font-medium text-rose-300 border border-rose-500/20">
                              ⚠ {wk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

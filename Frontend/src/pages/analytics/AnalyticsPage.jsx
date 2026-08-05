import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/card/Card';
import Button from '@/components/ui/button/Button';
import Spinner from '@/components/ui/spinner/Spinner';
import Alert from '@/components/ui/alert/Alert';
import { fetchUserAnalytics, refreshUserAnalytics } from '@/services/analytics/analyticsService';
import { cn } from '@/utils/helpers/cn';

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [chartTab, setChartTab] = useState('score'); // 'score', 'duration', 'accuracy'

  const loadAnalytics = async (refresh = false) => {
    try {
      if (refresh) setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);

      const data = await (refresh ? refreshUserAnalytics() : fetchUserAnalytics());
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch analytics data.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalytics(false);
  }, []);

  const filteredSkills = useMemo(() => {
    if (!analytics?.skillRatings) return [];
    if (selectedCategory === 'All') return analytics.skillRatings;
    return analytics.skillRatings.filter((s) => s.category === selectedCategory);
  }, [analytics, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#070714] text-slate-100 selection:bg-violet-500/30">
      {/* Background glow effects */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-10 left-1/3 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[100px]" />
      </div>

      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070714]/95 backdrop-blur-xl shadow-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
              title="Back to Dashboard"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 text-xs font-bold text-white shadow-lg shadow-violet-900/40">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">Candidate AI Analytics</h1>
                <p className="text-xs text-slate-400">Multi-interview performance & readiness insights</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {analytics?.lastUpdated && (
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
                <span className={cn('h-2 w-2 rounded-full', analytics.isCached ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse')} />
                {analytics.isCached ? 'Cached Report' : 'Live AI Sync'}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadAnalytics(true)}
              disabled={isLoading || isRefreshing}
              className="border-violet-500/30 text-violet-300 hover:bg-violet-500/10 hover:text-white"
            >
              {isRefreshing ? (
                <>
                  <Spinner className="mr-2 h-3.5 w-3.5 border-2 border-violet-400 border-t-transparent" />
                  Analyzing...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh AI Insights
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {isLoading && <AnalyticsSkeleton />}

        {!isLoading && error && (
          <div className="mx-auto max-w-lg py-12">
            <Alert variant="error">{error}</Alert>
            <Button variant="outline" className="mt-4 w-full" onClick={() => loadAnalytics(false)}>
              Retry
            </Button>
          </div>
        )}

        {!isLoading && !error && analytics && (
          <>
            {/* 1. TOP SUMMARY CARDS GRID */}
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
              <MetricCard
                label="Total Interviews"
                value={analytics.summary?.totalInterviews ?? 0}
                unit="Sessions"
                badge="Multi-session"
                icon={(
                  <svg className="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                accent="from-violet-500/20 to-purple-500/10"
              />

              <MetricCard
                label="Average Score"
                value={`${analytics.summary?.averageScore ?? 0}%`}
                unit="Overall"
                badge={analytics.summary?.averageScore >= 80 ? 'Exceptional' : 'Solid'}
                icon={(
                  <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                )}
                accent="from-indigo-500/20 to-blue-500/10"
              />

              <MetricCard
                label="Avg Duration"
                value={`${analytics.summary?.averageDurationMinutes ?? 0}`}
                unit="Minutes / Session"
                badge="Pacing"
                icon={(
                  <svg className="h-5 w-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                accent="from-sky-500/20 to-cyan-500/10"
              />

              <MetricCard
                label="Coding Accuracy"
                value={`${analytics.summary?.averageCodingAccuracy ?? 0}%`}
                unit="Test Passing"
                badge="AI Evaluated"
                icon={(
                  <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                )}
                accent="from-emerald-500/20 to-teal-500/10"
              />

              <div className="col-span-2 sm:col-span-1 relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/40 via-[#0c0c24] to-purple-950/40 p-4 shadow-xl">
                <div className="absolute top-0 right-0 h-16 w-16 rounded-full bg-violet-500/10 blur-xl pointer-events-none" />
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-violet-300">Readiness Score</span>
                  <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-300 border border-violet-500/30">AI Generated</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white">{analytics.summary?.interviewReadinessPercentage ?? 0}%</span>
                  <span className="text-xs text-slate-400">Target Bar</span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/5 border border-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-400 transition-all duration-1000"
                    style={{ width: `${Math.min(100, Math.max(0, analytics.summary?.interviewReadinessPercentage ?? 0))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 2. AI EXECUTIVE SUMMARY & RECURRING PATTERNS */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Performance Summary Card */}
              <Card className="lg:col-span-2 relative overflow-hidden border-violet-500/20 bg-gradient-to-br from-[#0c0c24] to-[#120d2d] p-6 sm:p-7 shadow-2xl">
                <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-white">AI Coach Executive Evaluation</h2>
                </div>
                <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-line font-normal">
                  {analytics.performanceSummary}
                </p>
              </Card>

              {/* Recurring Mistakes Card */}
              <Card className="relative overflow-hidden border-amber-500/20 bg-gradient-to-br from-[#18111d] to-[#0c0c24] p-6 sm:p-7 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-3 text-amber-400">
                    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recurring Pattern Insights</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-300">
                    {analytics.recurringMistakes}
                  </p>
                </div>
                <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-[11px] text-amber-200/90 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping shrink-0" />
                  Pattern observed across {analytics.summary?.totalInterviews ?? 0} past interview evaluations.
                </div>
              </Card>
            </div>

            {/* 3. TOPIC & SKILL ANALYSIS (18 Core Topics) */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Skill & Topic Proficiency</h2>
                  <p className="text-xs text-slate-400">AI ratings derived from problem solving, code accuracy, and transcript analysis</p>
                </div>
                <div className="flex flex-wrap gap-1.5 rounded-xl border border-white/10 bg-white/5 p-1">
                  {['All', 'Data Structures', 'Algorithms', 'Core CS'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        'rounded-lg px-3 py-1 text-xs font-medium transition-all',
                        selectedCategory === cat
                          ? 'bg-violet-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSkills.map((skill) => (
                  <SkillProgressBar key={skill.topic} skill={skill} />
                ))}
              </div>
            </section>

            {/* 4. STRENGTHS & WEAKNESSES GRID */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Top Strengths */}
              <Card className="border-emerald-500/20 bg-gradient-to-br from-[#0a1815] via-[#0c0c24] to-[#0c0c24] p-6 shadow-xl">
                <div className="flex items-center gap-2.5 mb-4 text-emerald-400">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-white">Top Technical Strengths</h3>
                </div>
                <ul className="space-y-3">
                  {analytics.strengths?.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-3 rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-3 text-xs text-slate-200">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-400">✓</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Weaknesses & Improvement Areas */}
              <Card className="border-rose-500/20 bg-gradient-to-br from-[#1d1015] via-[#0c0c24] to-[#0c0c24] p-6 shadow-xl">
                <div className="flex items-center gap-2.5 mb-4 text-rose-400">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/20 border border-rose-500/30">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-white">Weaknesses &amp; Growth Areas</h3>
                </div>
                <ul className="space-y-3">
                  {analytics.weaknesses?.map((wk, idx) => (
                    <li key={idx} className="flex items-start gap-3 rounded-xl border border-rose-500/10 bg-rose-500/5 p-3 text-xs text-slate-200">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-[10px] font-bold text-rose-400">!</span>
                      <span>{wk}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* 5. TARGET COMPANY READINESS (Amazon, Microsoft, Google, Meta, Netflix) */}
            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">Company Target Readiness Bar</h2>
                <p className="text-xs text-slate-400">AI evaluation against target company hiring bars & question difficulty distributions</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {analytics.companyReadiness?.map((comp) => (
                  <CompanyCard key={comp.companyName} company={comp} />
                ))}
              </div>
            </section>

            {/* 6. PERSONALIZED LEARNING PATH & RECOMMENDATIONS */}
            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">Adaptive Learning Roadmap</h2>
                <p className="text-xs text-slate-400">Prioritized study recommendations tailored dynamically to your skill gaps</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {analytics.learningRecommendations?.map((rec) => (
                  <Card key={rec.priority} className="relative overflow-hidden border-white/10 bg-[#0c0c24] p-5 shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-600 text-xs font-extrabold text-white">
                          #{rec.priority}
                        </span>
                        <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-[10px] font-semibold text-violet-300">
                          {rec.difficultyProgression}
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-sm tracking-tight">{rec.topic}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-400">{rec.suggestedPractice}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5">
                      <p className="text-[11px] text-slate-400 italic">"{rec.reason}"</p>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* 7. PROGRESS CHARTS SECTION (Interactive SVG Charts) */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Progress Analytics Trends</h2>
                  <p className="text-xs text-slate-400">Historical performance trends across completed mock interviews</p>
                </div>
                <div className="flex gap-1.5 rounded-xl border border-white/10 bg-white/5 p-1">
                  <button
                    onClick={() => setChartTab('score')}
                    className={cn(
                      'rounded-lg px-3 py-1 text-xs font-medium transition-all',
                      chartTab === 'score' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    )}
                  >
                    Score Trend
                  </button>
                  <button
                    onClick={() => setChartTab('duration')}
                    className={cn(
                      'rounded-lg px-3 py-1 text-xs font-medium transition-all',
                      chartTab === 'duration' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    )}
                  >
                    Duration Trend
                  </button>
                  <button
                    onClick={() => setChartTab('accuracy')}
                    className={cn(
                      'rounded-lg px-3 py-1 text-xs font-medium transition-all',
                      chartTab === 'accuracy' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    )}
                  >
                    Coding &amp; Comm
                  </button>
                </div>
              </div>

              <Card className="border-white/10 bg-[#0c0c24] p-6 shadow-2xl">
                <InteractiveSVGChart trends={analytics.progressTrends} activeTab={chartTab} />
              </Card>
            </section>

            {/* 8. KEY INSIGHTS HIGHLIGHTS GRID */}
            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">Key Performance Metrics</h2>
                <p className="text-xs text-slate-400">Specific behavioral, timing, and problem difficulty metrics</p>
              </div>

              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                <InsightBox label="Most Improved Skill" value={analytics.insights?.mostImprovedSkill} color="emerald" />
                <InsightBox label="Most Difficult Topic" value={analytics.insights?.mostDifficultTopic} color="rose" />
                <InsightBox label="Most Frequent Topic" value={analytics.insights?.mostFrequentlyAskedTopic} color="violet" />
                <InsightBox label="Explanation Quality" value={analytics.insights?.avgExplanationQuality} color="indigo" />
                <InsightBox label="Avg Thinking Time" value={`${analytics.insights?.avgThinkingTimeSeconds ?? 0}s`} color="sky" />
                <InsightBox label="Avg Coding Time" value={`${analytics.insights?.avgCodingTimeSeconds ?? 0}s`} color="blue" />
                <InsightBox label="Longest Session" value={`${analytics.insights?.longestInterviewMinutes ?? 0} mins`} color="amber" />
                <InsightBox label="Shortest Session" value={`${analytics.insights?.shortestInterviewMinutes ?? 0} mins`} color="purple" />
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function MetricCard({ label, value, unit, badge, icon, accent }) {
  return (
    <Card className="relative overflow-hidden border-white/10 bg-[#0c0c24] p-4 shadow-xl flex flex-col justify-between">
      <div className={cn('absolute -top-6 -right-6 h-20 w-20 rounded-full bg-gradient-to-br blur-xl pointer-events-none', accent)} />
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</span>
          <div className="p-1 rounded-lg bg-white/5 border border-white/10">{icon}</div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-white">{value}</span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2">
        <span className="text-[10px] text-slate-400">{unit}</span>
        {badge && (
          <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[9px] font-medium text-slate-300">
            {badge}
          </span>
        )}
      </div>
    </Card>
  );
}

function SkillProgressBar({ skill }) {
  const getTrendIcon = (t) => {
    if (t === 'Improving') return <span className="text-emerald-400 font-bold">↑</span>;
    if (t === 'Needs Focus') return <span className="text-amber-400 font-bold">!</span>;
    return <span className="text-slate-400 font-bold">→</span>;
  };

  const getBarColor = (score) => {
    if (score >= 80) return 'from-emerald-500 to-teal-400';
    if (score >= 65) return 'from-violet-500 to-indigo-400';
    return 'from-amber-500 to-orange-400';
  };

  return (
    <div className="rounded-xl border border-white/5 bg-[#0c0c24] p-3.5 shadow-md transition-all hover:border-white/10 hover:bg-white/[0.02]">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-semibold text-xs text-white tracking-tight">{skill.topic}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-white">{skill.score}%</span>
          <span className="text-[10px] text-slate-400">{getTrendIcon(skill.trend)}</span>
        </div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/5 border border-white/5">
        <div
          className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-700', getBarColor(skill.score))}
          style={{ width: `${Math.min(100, Math.max(0, skill.score))}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
        <span>{skill.category}</span>
        <span className="rounded-md bg-white/5 px-1.5 py-0.5 font-medium text-slate-300">{skill.level}</span>
      </div>
    </div>
  );
}

function CompanyCard({ company }) {
  const getVerdictStyle = (v) => {
    if (v === 'Strong Hire') return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    if (v === 'Hire') return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
    if (v === 'Leaning Hire') return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  };

  return (
    <Card className="relative overflow-hidden border-white/10 bg-[#0c0c24] p-4 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-extrabold text-sm text-white tracking-wide">{company.companyName}</span>
          <span className={cn('rounded-md border px-2 py-0.5 text-[10px] font-bold', getVerdictStyle(company.verdict))}>
            {company.verdict}
          </span>
        </div>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-2xl font-extrabold text-white">{company.score}%</span>
          <span className="text-[10px] text-slate-400">Readiness</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-400"
            style={{ width: `${Math.min(100, Math.max(0, company.score))}%` }}
          />
        </div>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-slate-400 border-t border-white/5 pt-2 line-clamp-3">
        {company.explanation}
      </p>
    </Card>
  );
}

function InsightBox({ label, value, color }) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#0c0c24] p-3.5 shadow-md">
      <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-white tracking-tight truncate">{value || 'N/A'}</p>
    </div>
  );
}

function InteractiveSVGChart({ trends, activeTab }) {
  if (!trends || trends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-xs">
        <svg className="h-10 w-10 text-slate-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
        No historical trends available yet. Complete sessions to populate interactive charts.
      </div>
    );
  }

  const height = 220;
  const width = 800;
  const padding = 40;

  const points = trends.map((t, idx) => {
    const x = padding + (idx / Math.max(1, trends.length - 1)) * (width - padding * 2);
    let val = t.score;
    if (activeTab === 'duration') val = t.durationMinutes;
    if (activeTab === 'accuracy') val = t.codingAccuracy;

    const maxVal = activeTab === 'duration' ? 60 : 100;
    const y = height - padding - (val / maxVal) * (height - padding * 2);
    return { x, y, val, date: t.date, topic: t.topic };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[600px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.1)" />

          {/* Area gradient under line */}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
            fill="url(#chartGradient)"
          />

          {/* Chart Line */}
          <path d={pathD} fill="none" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data points */}
          {points.map((p, i) => (
            <g key={i} className="group cursor-pointer">
              <circle cx={p.x} cy={p.y} r="5" fill="#a855f7" stroke="#0c0c24" strokeWidth="2" className="transition-transform group-hover:scale-150" />
              <text x={p.x} y={height - 12} fill="#94a3b8" fontSize="10" textAnchor="middle">
                {p.date}
              </text>
              {/* Tooltip on hover */}
              <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <rect x={p.x - 35} y={p.y - 35} width="70" height="24" rx="6" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" />
                <text x={p.x} y={p.y - 19} fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  {p.val}{activeTab === 'duration' ? ' min' : '%'}
                </text>
              </g>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-white/5 border border-white/5" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 h-44 rounded-2xl bg-white/5 border border-white/5" />
        <div className="h-44 rounded-2xl bg-white/5 border border-white/5" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-white/5 border border-white/5" />
        ))}
      </div>
    </div>
  );
}

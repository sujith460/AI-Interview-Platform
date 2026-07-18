import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@/components/ui/alert/Alert';
import Button from '@/components/ui/button/Button';
import Card from '@/components/ui/card/Card';
import Spinner from '@/components/ui/spinner/Spinner';
import ThemeToggle from '@/components/common/ThemeToggle';
import { getAllQuestions } from '@/services/practice/practiceService';
import { cn } from '@/utils/helpers/cn';

export default function PracticeListPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedCompany, setSelectedCompany] = useState('ALL');
  const [selectedPattern, setSelectedPattern] = useState('ALL');

  const fetchQuestionsList = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getAllQuestions();
      console.log('API RESPONSE RAW DATA:', data);
      let extractedQuestions = [];
      if (Array.isArray(data)) {
        extractedQuestions = data;
      } else if (data && Array.isArray(data.content)) {
        extractedQuestions = data.content;
      }
      console.log('EXTRACTED QUESTIONS:', extractedQuestions);
      setQuestions(extractedQuestions);
    } catch (err) {
      console.error('API FETCH ERROR:', err);
      setError(err?.response?.data?.message || 'Failed to load coding questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionsList();
  }, []);

  // Compute all unique companies and patterns dynamically for filter dropdowns
  const { uniqueCompanies, uniquePatterns } = useMemo(() => {
    const companiesSet = new Set();
    const patternsSet = new Set();
    
    questions.forEach((q) => {
      if (q.companies) {
        q.companies.forEach((c) => companiesSet.add(c));
      }
      if (q.patterns) {
        q.patterns.forEach((p) => patternsSet.add(p));
      }
    });

    return {
      uniqueCompanies: Array.from(companiesSet).sort(),
      uniquePatterns: Array.from(patternsSet).sort(),
    };
  }, [questions]);

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesSearch = q.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        q.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDifficulty = selectedDifficulty === 'ALL' || 
        q.difficulty === selectedDifficulty;
      
      const matchesCompany = selectedCompany === 'ALL' || 
        (q.companies && q.companies.includes(selectedCompany));
      
      const matchesPattern = selectedPattern === 'ALL' || 
        (q.patterns && q.patterns.includes(selectedPattern));

      return matchesSearch && matchesDifficulty && matchesCompany && matchesPattern;
    });
  }, [questions, searchQuery, selectedDifficulty, selectedCompany, selectedPattern]);

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
              Practice Coding Challenges
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
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Coding Workspace
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Select a problem from our curated list of technical coding challenges.
          </p>
        </div>

        {/* Filter Section Card */}
        <Card className="mb-6 p-5 border border-slate-200/60 dark:border-white/5 bg-white/50 backdrop-blur-md dark:bg-white/[0.02]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Search Problem
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition duration-200 focus:border-violet-500 dark:border-white/5 dark:bg-[#0c0c1e] dark:text-slate-100 dark:focus:border-violet-500"
                />
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition duration-200 focus:border-violet-500 dark:border-white/5 dark:bg-[#0c0c1e] dark:text-slate-100 dark:focus:border-violet-500"
              >
                <option value="ALL">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            {/* Company Filter */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Company
              </label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition duration-200 focus:border-violet-500 dark:border-white/5 dark:bg-[#0c0c1e] dark:text-slate-100 dark:focus:border-violet-500"
              >
                <option value="ALL">All Companies</option>
                {uniqueCompanies.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* DSA Pattern Filter */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                DSA Pattern
              </label>
              <select
                value={selectedPattern}
                onChange={(e) => setSelectedPattern(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition duration-200 focus:border-violet-500 dark:border-white/5 dark:bg-[#0c0c1e] dark:text-slate-100 dark:focus:border-violet-500"
              >
                <option value="ALL">All Patterns</option>
                {uniquePatterns.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Content list */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <Card key={n} className="p-6 border border-slate-200/60 dark:border-white/5">
                <div className="flex animate-pulse justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="flex gap-2">
                      <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
                      <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
                    </div>
                  </div>
                  <div className="h-6 w-12 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="mx-auto max-w-lg text-center">
            <Alert variant="error">{error}</Alert>
            <Button variant="outline" className="mt-4" onClick={fetchQuestionsList}>
              Try again
            </Button>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <Card className="p-12 text-center border border-dashed border-slate-200 dark:border-white/5">
            <p className="text-slate-500 dark:text-slate-400">No questions found matching your filters.</p>
            <Button variant="outline" className="mt-4" onClick={() => {
              setSearchQuery('');
              setSelectedDifficulty('ALL');
              setSelectedCompany('ALL');
              setSelectedPattern('ALL');
            }}>
              Clear Filters
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((q) => {
              const diffText = q.difficulty?.charAt(0) + q.difficulty?.slice(1).toLowerCase();
              return (
                <div
                  key={q.id}
                  onClick={() => navigate(`/practice/${q.slug}`)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/60 bg-white/40 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 dark:border-white/5 dark:bg-white/[0.01] dark:hover:bg-white/[0.03] dark:hover:border-violet-500/20"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 transition-colors group-hover:text-violet-600 dark:group-hover:text-violet-400">
                          {q.title}
                        </h3>
                        {q.interviewQuestion && (
                          <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                            Interview
                          </span>
                        )}
                        {q.premium && (
                          <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            Premium
                          </span>
                        )}
                      </div>

                      {/* Details & Tags */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <span className={cn(
                          "font-bold uppercase tracking-wider",
                          q.difficulty === 'EASY' && "text-emerald-600 dark:text-emerald-400",
                          q.difficulty === 'MEDIUM' && "text-amber-600 dark:text-amber-400",
                          q.difficulty === 'HARD' && "text-rose-600 dark:text-rose-400"
                        )}>
                          {diffText}
                        </span>
                        <span>•</span>
                        <span>Est: {q.estimatedTimeMinutes || 30} mins</span>
                        {q.frequencyScore && (
                          <>
                            <span>•</span>
                            <span>Frequency: {q.frequencyScore}%</span>
                          </>
                        )}
                      </div>

                      {/* Companies & Patterns */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {q.patterns && q.patterns.slice(0, 3).map((pat) => (
                          <span
                            key={pat}
                            className="rounded-lg bg-violet-500/5 dark:bg-violet-950/20 px-2.5 py-0.5 text-[10px] font-medium text-violet-700 dark:text-violet-300 border border-violet-500/10"
                          >
                            {pat}
                          </span>
                        ))}
                        {q.companies && q.companies.slice(0, 3).map((comp) => (
                          <span
                            key={comp}
                            className="rounded-lg bg-blue-500/5 dark:bg-blue-950/20 px-2.5 py-0.5 text-[10px] font-medium text-blue-700 dark:text-blue-300 border border-blue-500/10"
                          >
                            {comp.charAt(0).toUpperCase() + comp.slice(1)}
                          </span>
                        ))}
                        {q.patterns && q.patterns.length > 3 && (
                          <span className="text-[10px] text-slate-400 self-center pl-1">
                            +{q.patterns.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="text-xs font-semibold text-slate-400 group-hover:text-violet-500 transition-colors">
                        Solve Challenge
                      </span>
                      <svg
                        className="h-4 w-4 text-slate-400 group-hover:text-violet-500 transition-all duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

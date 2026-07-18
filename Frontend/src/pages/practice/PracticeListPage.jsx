import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Alert from '@/components/ui/alert/Alert';
import Button from '@/components/ui/button/Button';
import Card from '@/components/ui/card/Card';
import Spinner from '@/components/ui/spinner/Spinner';
import ThemeToggle from '@/components/common/ThemeToggle';
import { searchQuestions, getAllCompanies, getAllPatterns } from '@/services/practice/practiceService';
import { cn } from '@/utils/helpers/cn';

export default function PracticeListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state synchronization
  const page = parseInt(searchParams.get('page') || '1', 10);
  const size = parseInt(searchParams.get('size') || '20', 10);
  const search = searchParams.get('search') || '';
  const difficulty = searchParams.get('difficulty') || 'ALL';
  const company = searchParams.get('company') || 'ALL';
  const pattern = searchParams.get('pattern') || 'ALL';

  // Filters catalog state
  const [allCompanies, setAllCompanies] = useState([]);
  const [allPatterns, setAllPatterns] = useState([]);
  const [companiesLoaded, setCompaniesLoaded] = useState(false);
  const [patternsLoaded, setPatternsLoaded] = useState(false);

  // Questions and pagination states
  const [questions, setQuestions] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Local state for search query to debounce inputs
  const [localSearch, setLocalSearch] = useState(search);

  // Load companies and patterns lists on mount
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [compData, patData] = await Promise.all([
          getAllCompanies(),
          getAllPatterns()
        ]);
        setAllCompanies(compData || []);
        setAllPatterns(patData || []);
      } catch (err) {
        console.error('Failed to load companies or patterns:', err);
      } finally {
        setCompaniesLoaded(true);
        setPatternsLoaded(true);
      }
    };
    loadFilters();
  }, []);

  // Sync search input when URL changes (e.g. back navigation)
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Fetch questions from backend
  const fetchQuestionsList = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Find matching IDs from string names for the backend API search DTO
      let companyIds = null;
      if (company !== 'ALL') {
        const found = allCompanies.find((c) => c.name.toLowerCase() === company.toLowerCase());
        companyIds = found ? [found.id] : [];
      }

      let patternIds = null;
      if (pattern !== 'ALL') {
        const found = allPatterns.find((p) => p.name.toLowerCase() === pattern.toLowerCase());
        patternIds = found ? [found.id] : [];
      }

      const payload = {
        page: page - 1, // 0-based page in Spring Boot
        size: size,
        search: search || null,
        difficulty: difficulty !== 'ALL' ? difficulty : null,
        companyIds: companyIds,
        patternIds: patternIds,
        sortBy: 'CREATED_AT',
        sortDirection: 'DESC'
      };

      const data = await searchQuestions(payload);
      setQuestions(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('API FETCH ERROR:', err);
      setError(err?.response?.data?.message || 'Failed to load coding questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger search on parameter/filter change
  useEffect(() => {
    if (companiesLoaded && patternsLoaded) {
      fetchQuestionsList();
    }
  }, [page, size, search, difficulty, company, pattern, companiesLoaded, patternsLoaded]);

  // Debounced search trigger
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (localSearch !== search) {
        updateFilters({ search: localSearch });
      }
    }, 450);
    return () => clearTimeout(delayDebounce);
  }, [localSearch]);

  // Helper to update query parameters in URL
  const updateFilters = (newFilters) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', '1'); // Reset page to 1 on filter update
    
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val === 'ALL' || val === '') {
        nextParams.delete(key);
      } else {
        nextParams.set(key, val);
      }
    });
    setSearchParams(nextParams);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', newPage.toString());
    setSearchParams(nextParams);
  };

  const handleSizeChange = (newSize) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', '1');
    nextParams.set('size', newSize.toString());
    setSearchParams(nextParams);
  };

  const renderFrequencyBadge = (score) => {
    if (score === null || score === undefined) return null;
    let label = 'Low';
    let badgeClass = 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    if (score >= 300) {
      label = 'Very High';
      badgeClass = 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
    } else if (score >= 150) {
      label = 'High';
      badgeClass = 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
    } else if (score >= 50) {
      label = 'Medium';
      badgeClass = 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    }
    return (
      <span className={cn("rounded px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide border", badgeClass)}>
        {label}
      </span>
    );
  };

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
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
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
                value={difficulty}
                onChange={(e) => updateFilters({ difficulty: e.target.value })}
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
                value={company}
                onChange={(e) => updateFilters({ company: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition duration-200 focus:border-violet-500 dark:border-white/5 dark:bg-[#0c0c1e] dark:text-slate-100 dark:focus:border-violet-500"
              >
                <option value="ALL">All Companies</option>
                {allCompanies.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name.charAt(0).toUpperCase() + c.name.slice(1)}
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
                value={pattern}
                onChange={(e) => updateFilters({ pattern: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition duration-200 focus:border-violet-500 dark:border-white/5 dark:bg-[#0c0c1e] dark:text-slate-100 dark:focus:border-violet-500"
              >
                <option value="ALL">All Patterns</option>
                {allPatterns.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
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
              <Card key={n} className="p-6 border border-slate-200/60 dark:border-white/5 animate-pulse">
                <div className="flex justify-between gap-4">
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
        ) : questions.length === 0 ? (
          <Card className="p-12 text-center border border-dashed border-slate-200 dark:border-white/5">
            <p className="text-slate-500 dark:text-slate-400">No questions found matching your filters.</p>
            <Button variant="outline" className="mt-4" onClick={() => setSearchParams({})}>
              Clear Filters
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {questions.map((q) => {
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
                            <span>Freq: </span>
                            {renderFrequencyBadge(q.frequencyScore)}
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
                        {q.companies && Array.from(q.companies).sort().slice(0, 3).map((comp) => (
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

        {/* Pagination controls */}
        {!isLoading && !error && totalPages > 1 && (
          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200/60 pt-6 pb-8 dark:border-white/5 sm:flex-row">
            {/* Showing details */}
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{((page - 1) * size) + 1}</span>–
              <span className="font-semibold text-slate-800 dark:text-slate-200">{Math.min(page * size, totalElements)}</span> of{' '}
              <span className="font-semibold text-slate-800 dark:text-slate-200">{totalElements}</span> Questions
            </div>

            {/* Desktop/Mobile buttons container */}
            <div className="flex items-center gap-4">
              
              {/* Page Size selector */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pl-2">
                <span>Per page:</span>
                <select
                  value={size}
                  onChange={(e) => handleSizeChange(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 outline-none dark:border-white/5 dark:bg-[#0c0c1e] text-slate-800 dark:text-slate-200 focus:border-violet-500"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>

              {/* Mobile UI (hidden on sm up) */}
              <div className="flex items-center gap-2 sm:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="h-8 text-xs font-semibold"
                >
                  Previous
                </Button>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="h-8 text-xs font-semibold"
                >
                  Next
                </Button>
              </div>

              {/* Desktop UI (hidden on mobile) */}
              <div className="hidden items-center gap-1 sm:flex">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={page === 1}
                  className="h-8 px-2 text-xs font-semibold"
                  title="First Page"
                >
                  &lt;&lt;
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="h-8 px-2 text-xs font-semibold"
                  title="Previous Page"
                >
                  &lt;
                </Button>
                
                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                  let pageNumber = page;
                  if (page <= 3) {
                    pageNumber = index + 1;
                  } else if (page >= totalPages - 2) {
                    pageNumber = totalPages - 4 + index;
                  } else {
                    pageNumber = page - 2 + index;
                  }
                  
                  if (pageNumber < 1 || pageNumber > totalPages) return null;

                  return (
                    <Button
                      key={pageNumber}
                      variant={page === pageNumber ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(pageNumber)}
                      className={cn(
                        "h-8 w-8 p-0 font-mono text-xs font-bold",
                        page === pageNumber ? "bg-violet-600 hover:bg-violet-700 text-white" : ""
                      )}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="h-8 px-2 text-xs font-semibold"
                  title="Next Page"
                >
                  &gt;
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={page === totalPages}
                  className="h-8 px-2 text-xs font-semibold"
                  title="Last Page"
                >
                  &gt;&gt;
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@/components/ui/alert/Alert';
import Button from '@/components/ui/button/Button';
import Card from '@/components/ui/card/Card';
import Spinner from '@/components/ui/spinner/Spinner';
import ThemeToggle from '@/components/common/ThemeToggle';
import { getCompanies, createInterviewSession } from '@/services/interview/interviewService';
import { cn } from '@/utils/helpers/cn';

export default function InterviewSetupPage() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [companyError, setCompanyError] = useState('');

  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [interviewType, setInterviewType] = useState('DSA');
  const [difficulty, setDifficulty] = useState('MEDIUM');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    fetchCompaniesList();
  }, []);

  const fetchCompaniesList = async () => {
    setLoadingCompanies(true);
    setCompanyError('');
    try {
      const data = await getCompanies();
      const companyList = Array.isArray(data) ? data : [];
      setCompanies(companyList);
      if (companyList.length > 0) {
        setSelectedCompanyId(String(companyList[0].id));
      }
    } catch (err) {
      console.error('Failed to fetch companies:', err);
      setCompanyError(
        err?.response?.data?.message || 'Failed to load companies. Please check backend connection.'
      );
    } finally {
      setLoadingCompanies(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!selectedCompanyId) {
      setSubmitError('Please select a company to proceed.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        companyId: Number(selectedCompanyId),
        interviewType: interviewType,
        difficulty: difficulty,
      };

      const session = await createInterviewSession(payload);
      if (session && session.sessionId) {
        navigate(`/interview/${session.sessionId}`, { state: { session } });
      } else {
        setSubmitError('Failed to create session: Invalid response received from server.');
      }
    } catch (err) {
      console.error('Failed to create interview session:', err);
      setSubmitError(
        err?.response?.data?.message || err?.message || 'Failed to start interview session. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
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
              Interview Setup
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
      <main className="relative z-10 mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Configure Your AI Interview
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Select your target company, interview type, and difficulty level to begin.
          </p>
        </div>

        <Card className="p-6 sm:p-8 border border-slate-200/60 dark:border-white/5 bg-white/70 backdrop-blur-md dark:bg-white/[0.02]">
          {loadingCompanies ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Spinner className="h-8 w-8 border-[3px] border-violet-200 border-t-violet-600 dark:border-violet-900 dark:border-t-violet-400" />
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading configuration parameters...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {companyError && <Alert variant="error">{companyError}</Alert>}
              {submitError && <Alert variant="error">{submitError}</Alert>}

              {/* Company Dropdown */}
              <div className="space-y-2">
                <label
                  htmlFor="company-select"
                  className="block text-sm font-semibold text-slate-800 dark:text-slate-200"
                >
                  Target Company
                </label>
                <select
                  id="company-select"
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  disabled={isSubmitting || companies.length === 0}
                  className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:border-violet-500"
                >
                  {companies.length === 0 ? (
                    <option value="">No companies available</option>
                  ) : (
                    companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Interview Type Selection */}
              <div className="space-y-3">
                <label
                  className="block text-sm font-semibold text-slate-800 dark:text-slate-200"
                >
                  Interview Type
                </label>
                <div className="grid gap-3 sm:grid-cols-3">
                  {/* DSA Option */}
                  <div
                    onClick={() => setInterviewType('DSA')}
                    className={cn(
                      'relative flex cursor-pointer flex-col justify-between rounded-xl border p-3.5 transition-all duration-200',
                      interviewType === 'DSA'
                        ? 'border-violet-500 bg-violet-500/10 ring-2 ring-violet-500/20 dark:bg-violet-500/20'
                        : 'border-slate-200 bg-white/70 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/50'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-violet-600 dark:text-violet-400">DSA</span>
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <p className="mt-2 text-xs font-bold text-slate-900 dark:text-white">Data Structures</p>
                    <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">Live Voice & Coding</p>
                  </div>

                  {/* RESUME Option (Coming Soon) */}
                  <div
                    className="relative flex cursor-not-allowed opacity-60 flex-col justify-between rounded-xl border border-slate-200 bg-slate-100/50 p-3.5 dark:border-slate-800 dark:bg-slate-900/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-400">RESUME</span>
                      <span className="rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-500 border border-amber-500/30">
                        Soon
                      </span>
                    </div>
                    <p className="mt-2 text-xs font-bold text-slate-400">Resume Based</p>
                    <p className="mt-1 text-[10px] text-slate-400">Coming Soon</p>
                  </div>

                  {/* BEHAVIORAL Option (Coming Soon) */}
                  <div
                    className="relative flex cursor-not-allowed opacity-60 flex-col justify-between rounded-xl border border-slate-200 bg-slate-100/50 p-3.5 dark:border-slate-800 dark:bg-slate-900/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-400">BEHAVIORAL</span>
                      <span className="rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-500 border border-amber-500/30">
                        Soon
                      </span>
                    </div>
                    <p className="mt-2 text-xs font-bold text-slate-400">Behavioral</p>
                    <p className="mt-1 text-[10px] text-slate-400">Coming Soon</p>
                  </div>
                </div>

                <select
                  id="interview-type-select"
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:border-violet-500"
                >
                  <option value="DSA">DSA (Voice & Coding Active)</option>
                  <option value="RESUME" disabled>RESUME (Coming Soon)</option>
                  <option value="BEHAVIORAL" disabled>BEHAVIORAL (Coming Soon)</option>
                </select>
              </div>

              {/* Difficulty Dropdown */}
              <div className="space-y-2">
                <label
                  htmlFor="difficulty-select"
                  className="block text-sm font-semibold text-slate-800 dark:text-slate-200"
                >
                  Difficulty Level
                </label>
                <select
                  id="difficulty-select"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:border-violet-500"
                >
                  <option value="EASY">EASY</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HARD">HARD</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                  disabled={isSubmitting || companies.length === 0}
                  className="w-full h-12 text-base font-bold shadow-lg shadow-violet-500/25"
                >
                  {isSubmitting ? 'Creating Interview Session...' : 'Start Interview'}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </main>
    </div>
  );
}

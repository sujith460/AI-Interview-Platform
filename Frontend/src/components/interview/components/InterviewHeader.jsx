import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/button/Button';
import ThemeToggle from '@/components/common/ThemeToggle';
import { cn } from '@/utils/helpers/cn';

/**
 * InterviewHeader component matching the reference design layout:
 * - Logo & Welcome Banner
 * - Top Action Buttons: Start Interview, Start Coding, Set Profile
 * - Countdown Timer & Exit Safeguard Modal
 */
export default function InterviewHeader({
  companyName = 'Netflix',
  roleName = 'Software Engineer',
  interviewType = 'DSA',
  difficulty = 'MEDIUM',
  durationMinutes = 45,
  onStartInterview,
  onStartCoding,
  onSetProfile,
  onAutoFinish,
}) {
  const navigate = useNavigate();

  const [timeLeftSeconds, setTimeLeftSeconds] = useState(durationMinutes * 60);
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsTimeUp(true);
          if (onAutoFinish) onAutoFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [onAutoFinish]);

  const formatCountdown = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeftSeconds < 300 && !isTimeUp;

  const handleDashboardClick = () => {
    setShowDashboardModal(true);
  };

  const handleConfirmExit = () => {
    setShowDashboardModal(false);
    navigate('/dashboard');
  };

  const handleSetProfile = () => {
    if (onSetProfile) {
      onSetProfile();
    } else {
      navigate('/profile');
    }
  };

  return (
    <>
      <header className="relative z-20 shrink-0 border-b border-slate-800 bg-[#070714] text-slate-100 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleDashboardClick}
              className="flex items-center gap-2.5 group"
              title="Return to Dashboard"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 font-black text-sm text-white shadow-md shadow-violet-900/40 group-hover:scale-105 transition-transform">
                AI
              </div>
              <span className="text-base font-black tracking-tight text-white hidden sm:inline">
                AI Interview Platform
              </span>
            </button>
          </div>
          {/* Right: Timer & Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Timer Countdown */}
            <div
              className={cn(
                'flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-mono font-bold transition-colors',
                isTimeUp
                  ? 'border-rose-600 bg-rose-600 text-white animate-bounce'
                  : isLowTime
                  ? 'border-rose-500/40 bg-rose-500/10 text-rose-400 animate-pulse'
                  : 'border-slate-800 bg-slate-900/90 text-slate-200'
              )}
            >
              <span className={cn("h-2 w-2 rounded-full", isTimeUp ? "bg-white" : isLowTime ? "bg-rose-500" : "bg-emerald-500 animate-pulse")} />
              <span className="text-[11px] font-sans opacity-70">
                {isTimeUp ? 'EXPIRED' : 'Time:'}
              </span>
              <span>{formatCountdown(timeLeftSeconds)}</span>
            </div>

            <Button variant="outline" size="sm" onClick={handleDashboardClick} className="h-8 text-xs border-slate-700 bg-slate-900/60">
              Dashboard
            </Button>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Dashboard Exit Safeguard Modal */}
      {showDashboardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-[#0c0c1e] p-6 text-center text-white space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-white">
                Interview is still in progress
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Leaving now will exit your active technical interview session. Do you really want to exit?
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 text-xs font-semibold border-slate-700 bg-slate-900"
                onClick={() => setShowDashboardModal(false)}
              >
                Continue Session
              </Button>
              <Button
                variant="danger"
                className="flex-1 text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold"
                onClick={handleConfirmExit}
              >
                Exit Interview
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

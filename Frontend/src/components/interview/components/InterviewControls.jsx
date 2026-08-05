import { useState } from 'react';
import { cn } from '@/utils/helpers/cn';

/**
 * InterviewControls component providing bottom action bar for media, voice mode, code execution,
 * hint request, solution submission, and session finish confirmation.
 */
export default function InterviewControls({
  isCameraOn = true,
  isMicOn = true,
  isAiVoiceMuted = false,
  onToggleCamera,
  onToggleMic,
  onToggleAiVoice,
  onResetCode,
  onRunCode,
  onRequestHint,
  onSubmitCode,
  onEndInterview,
  isExecutingCode = false,
  isSubmittingCode = false,
  isRequestingHint = false,
  isAiTyping = false,
}) {
  const [showFinishModal, setShowFinishModal] = useState(false);

  const handleConfirmFinish = () => {
    setShowFinishModal(false);
    onEndInterview();
  };

  return (
    <>
      <div className="rounded-2xl border border-slate-800 bg-[#0f111a] shadow-xl backdrop-blur-md p-3 shrink-0">
        {/* Media row */}
        <div className="flex items-center gap-1.5 mb-2">
          <button
            onClick={onToggleMic}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 h-8 rounded-xl border text-[11px] font-semibold transition-all',
              isMicOn
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                : 'border-rose-500/40 bg-rose-500/10 text-rose-400'
            )}
            title={isMicOn ? 'Click to Mute Candidate Microphone' : 'Click to Unmute Candidate Microphone'}
          >
            <span>{isMicOn ? '🎙️' : '🔇'}</span>
            <span>{isMicOn ? 'Mic ON' : 'Mic OFF'}</span>
          </button>

          <button
            onClick={onToggleCamera}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 h-8 rounded-xl border text-[11px] font-semibold transition-all',
              isCameraOn
                ? 'border-white/10 bg-slate-900/60 text-slate-200 hover:bg-slate-800'
                : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
            )}
          >
            <span>{isCameraOn ? '📹' : '🚫'}</span>
            <span>{isCameraOn ? 'Stop Cam' : 'Start Cam'}</span>
          </button>

          <button
            onClick={onToggleAiVoice}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 h-8 rounded-xl border text-[11px] font-semibold transition-all',
              !isAiVoiceMuted
                ? 'border-violet-500/40 bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/20'
                : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:bg-slate-800'
            )}
            title={!isAiVoiceMuted ? 'Mute AI Voice Speech' : 'Unmute AI Voice Speech'}
          >
            <span>{!isAiVoiceMuted ? '🔊' : '🔇'}</span>
            <span>{!isAiVoiceMuted ? 'AI Voice ON' : 'AI Voice OFF'}</span>
          </button>
        </div>

        {/* Code action row */}
        <div className="flex items-center gap-1.5 mb-2">
          <button
            onClick={onRequestHint}
            disabled={isAiTyping || isRequestingHint}
            className="flex flex-1 items-center justify-center gap-1 h-8 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 text-[11px] font-semibold hover:bg-amber-500/20 transition-all disabled:opacity-50"
          >
            {isRequestingHint ? (
              <span className="h-3 w-3 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            ) : (
              <span>💡</span>
            )}
            <span>Hint</span>
          </button>

          <button
            onClick={onResetCode}
            className="flex flex-1 items-center justify-center gap-1 h-8 rounded-xl border border-white/10 bg-slate-900/60 text-slate-300 text-[11px] font-semibold hover:bg-slate-800 transition-all"
          >
            <span>↺</span>
            <span>Reset</span>
          </button>
        </div>

        {/* Submit + Finish row */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onSubmitCode}
            disabled={isAiTyping || isSubmittingCode}
            className="flex flex-1 items-center justify-center gap-1.5 h-9 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[11px] font-bold shadow-md shadow-violet-500/25 hover:from-violet-500 hover:to-indigo-500 transition-all disabled:opacity-50"
          >
            {isSubmittingCode ? (
              <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <span>🚀</span>
            )}
            <span>Submit Solution</span>
          </button>

          <button
            onClick={() => setShowFinishModal(true)}
            className="flex items-center justify-center gap-1.5 h-9 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold transition-all"
          >
            <span>⏹</span>
            <span>Finish</span>
          </button>
        </div>
      </div>

      {/* REQUIREMENT 3: Finish Interview Confirmation Modal */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0c0c1e] text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Are you sure you want to finish this interview?
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                You will not be able to continue afterwards. Your transcript and code submissions will be evaluated to generate your final report.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 text-xs font-semibold"
                onClick={() => setShowFinishModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                className="flex-1 text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold"
                onClick={handleConfirmFinish}
              >
                Finish Interview
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

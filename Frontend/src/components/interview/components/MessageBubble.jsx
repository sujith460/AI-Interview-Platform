import { cn } from '@/utils/helpers/cn';

/**
 * MessageBubble component displaying distinct Candidate vs AI Interviewer entries.
 * Features left/right layout alignment, distinct color schemes, avatars, and timestamps.
 */
export default function MessageBubble({ message }) {
  const { role, content, createdAt, isCodeSubmission } = message;

  const formattedTime = createdAt
    ? new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  // System or Stage Announcement
  if (role === 'SYSTEM') {
    return (
      <div className="my-4 flex justify-center px-4">
        <div className="flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-semibold text-violet-700 shadow-sm backdrop-blur-md dark:border-violet-400/20 dark:bg-violet-500/15 dark:text-violet-300 max-w-lg text-center">
          <svg className="h-4 w-4 shrink-0 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <span>{content}</span>
          {formattedTime && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono ml-1">
              {formattedTime}
            </span>
          )}
        </div>
      </div>
    );
  }

  const isCandidate = role === 'CANDIDATE' || role === 'USER';

  return (
    <div className={cn("my-3 flex w-full gap-3", isCandidate ? "justify-end" : "justify-start")}>
      {/* AI Avatar on Left */}
      {!isCandidate && (
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 font-extrabold text-xs text-white shadow-md ring-2 ring-violet-500/20 mt-0.5">
          🤖
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#070714]" />
        </div>
      )}

      {/* Message Box */}
      <div className={cn("flex flex-col max-w-[85%] sm:max-w-[78%]", isCandidate ? "items-end" : "items-start")}>
        {/* Author Header */}
        <div className="flex items-center gap-2 mb-1 px-1">
          <span
            className={cn(
              "text-[11px] font-extrabold tracking-wide uppercase",
              isCandidate ? "text-indigo-600 dark:text-indigo-400" : "text-violet-600 dark:text-violet-400"
            )}
          >
            {isCandidate ? '👤 You (Candidate)' : '🤖 AI Interviewer'}
          </span>
          {formattedTime && (
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
              {formattedTime}
            </span>
          )}
        </div>

        {/* Bubble Frame */}
        <div
          className={cn(
            "rounded-2xl px-4 py-3 shadow-xs leading-relaxed text-xs sm:text-sm backdrop-blur-md border transition-all duration-200",
            isCandidate
              ? "rounded-tr-xs border-indigo-500/30 bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-indigo-500/10"
              : "rounded-tl-xs border-slate-200/80 bg-white text-slate-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-100 shadow-sm"
          )}
        >
          {isCodeSubmission ? (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-200">
                <span>💻 Submitted Solution</span>
              </div>
              <pre className="overflow-x-auto rounded-xl bg-slate-950 p-3 font-mono text-xs text-emerald-400 border border-slate-800">
                <code>{content}</code>
              </pre>
            </div>
          ) : (
            <p className="whitespace-pre-wrap font-sans font-normal leading-relaxed">
              {content}
            </p>
          )}
        </div>
      </div>

      {/* Candidate Avatar on Right */}
      {isCandidate && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 font-extrabold text-xs text-white shadow-md ring-2 ring-indigo-500/20 mt-0.5">
          👤
        </div>
      )}
    </div>
  );
}

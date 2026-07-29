import { cn } from '@/utils/helpers/cn';

/**
 * AIInterviewerAvatar – animated AI interviewer face panel.
 * Props:
 *   isSpeaking  – boolean, when true plays talking animation (wired up later)
 *   name        – interviewer name
 *   title       – interviewer title/role
 */
export default function AIInterviewerAvatar({
  isSpeaking = false,
  name = 'Alex',
  title = 'Senior Software Engineer',
  className,
}) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-[#0f111a] shadow-xl backdrop-blur-md overflow-hidden px-4 py-3 h-full w-full',
        className
      )}
    >
      {/* Ambient glow background */}
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-700',
          isSpeaking ? 'opacity-100' : 'opacity-40'
        )}
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 60%, rgba(124,58,237,0.22) 0%, transparent 75%)',
        }}
      />

      {/* Outer ring — pulses when speaking */}
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full transition-all duration-500',
          isSpeaking
            ? 'ring-4 ring-violet-500/60 ring-offset-4 ring-offset-[#0f111a] animate-pulse'
            : 'ring-2 ring-violet-700/40 ring-offset-2 ring-offset-[#0f111a]'
        )}
        style={{ width: 104, height: 104 }}
      >
        {/* Avatar face SVG */}
        <div className="relative flex items-center justify-center w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-violet-700 via-indigo-700 to-purple-800 shadow-2xl shadow-violet-900/60">
          {/* Face SVG */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Head / face base */}
            <circle cx="50" cy="45" r="28" fill="#e8d5c4" />
            {/* Hair */}
            <ellipse cx="50" cy="20" rx="28" ry="14" fill="#2d1b69" />
            {/* Eyes */}
            <circle cx="40" cy="40" r="4" fill="#1e1b4b" />
            <circle cx="60" cy="40" r="4" fill="#1e1b4b" />
            {/* Eye highlights */}
            <circle cx="42" cy="38.5" r="1.2" fill="white" />
            <circle cx="62" cy="38.5" r="1.2" fill="white" />
            {/* Nose */}
            <ellipse cx="50" cy="47" rx="2.5" ry="3" fill="#c9a98c" />
            {/* Mouth — animated lip movement when speaking */}
            <ellipse
              cx="50"
              cy="55"
              rx={isSpeaking ? 7 : 5}
              ry={isSpeaking ? 3.5 : 2}
              fill="#9d4b4b"
              className="transition-all duration-150"
            />
            {/* Collar / shirt */}
            <path
              d="M22 90 Q50 72 78 90 L100 100 L0 100 Z"
              fill="#312e81"
            />
            {/* Tie */}
            <path
              d="M45 75 L50 68 L55 75 L52 90 L48 90 Z"
              fill="#7c3aed"
            />
          </svg>

          {/* Speaking wave overlay */}
          {isSpeaking && (
            <div className="absolute inset-0 rounded-full pointer-events-none">
              {[1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="absolute inset-0 rounded-full border border-violet-400/30 animate-ping"
                  style={{ animationDelay: `${i * 180}ms`, animationDuration: '1.2s' }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Name & title */}
      <div className="relative mt-4 text-center z-10">
        <p className="text-sm font-extrabold text-white tracking-tight">{name}</p>
        <p className="text-[10px] text-violet-300 font-medium mt-0.5">{title}</p>
      </div>

      {/* Status badge */}
      <div className="relative mt-3 z-10">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold border transition-colors duration-300',
            isSpeaking
              ? 'bg-violet-600/25 border-violet-500/50 text-violet-200'
              : 'bg-slate-800/80 border-slate-700/60 text-slate-400'
          )}
        >
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              isSpeaking ? 'bg-violet-400 animate-pulse' : 'bg-emerald-500'
            )}
          />
          {isSpeaking ? 'Speaking…' : 'Listening'}
        </span>
      </div>

      {/* Sound wave bars — animated when speaking */}
      <div className="relative mt-4 flex items-end gap-0.5 h-8 z-10">
        {[0.4, 0.7, 1, 0.8, 0.5, 0.9, 0.6, 1, 0.7, 0.4].map((scale, i) => (
          <span
            key={i}
            className={cn(
              'w-1 rounded-full transition-all',
              isSpeaking ? 'bg-violet-400' : 'bg-slate-700'
            )}
            style={{
              height: isSpeaking ? `${Math.round(scale * 28)}px` : '4px',
              animation: isSpeaking
                ? `soundBar 0.8s ease-in-out infinite alternate`
                : 'none',
              animationDelay: `${i * 60}ms`,
            }}
          />
        ))}
      </div>

      {/* Inline keyframes for sound bar animation */}
      <style>{`
        @keyframes soundBar {
          0%   { transform: scaleY(0.3); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}

const FEATURES = [
  {
    title: 'AI Interviewer',
    description: 'Realistic AI interviews tailored to your role.',
    icon: BrainIcon,
  },
  {
    title: 'Smart Analytics',
    description: 'Track your progress and identify areas to improve.',
    icon: ChartIcon,
  },
  {
    title: 'Personalized Learning',
    description: 'Get custom questions and feedback based on your performance.',
    icon: TargetIcon,
  },
];

export default function RegisterMarketingPanel() {
  return (
    <div className="hidden max-w-xl flex-1 animate-fade-in lg:block">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-600 dark:text-violet-300">
        <SparkleIcon />
        AI-Powered
      </div>

      <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white xl:text-5xl">
        Ace Your{' '}
        <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-purple-400">
          Dream Interviews
        </span>
      </h1>

      <p className="mt-4 max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-400">
        Practice with AI, get real-time feedback and land your dream job.
      </p>

      <ul className="mt-10 space-y-6">
        {FEATURES.map(({ title, description, icon: Icon }) => (
          <li key={title} className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Icon />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l1.2 4.2L17.5 7.5 13.2 8.7 12 13l-1.2-4.3L6.5 7.5l4.3-1.3L12 2zm7 9l.9 3.1L23 15l-3.1.9L19 19l-.9-3.1L15 15l3.1-.9L19 11zm-14 0l.9 3.1L9 15l-3.1.9L5 19l-.9-3.1L1 15l3.1-.9L5 11z" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 2A5.5 5.5 0 0 0 4 7.5v.5A4.5 4.5 0 0 0 2 12a4.5 4.5 0 0 0 2 4.5v.5A5.5 5.5 0 0 0 9.5 22M14.5 2A5.5 5.5 0 0 1 20 7.5v.5A4.5 4.5 0 0 1 22 12a4.5 4.5 0 0 1-2 4.5v.5A5.5 5.5 0 0 1 14.5 22M9 12h6" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 14l3-3 4 4 5-6" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

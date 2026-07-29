import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import Spinner from '@/components/ui/spinner/Spinner';

/**
 * MessageList renders the live Interview Conversation stream.
 * Supports distinct candidate/AI bubbles, AI typing indicator, and smooth auto-scroll.
 */
export default function MessageList({
  messages = [],
  isLoading = false,
  isAiTyping = false,
  error = '',
  welcomeMessage = '',
}) {
  const bottomRef = useRef(null);

  const scrollToBottom = (behavior = 'smooth') => {
    bottomRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, isAiTyping, isLoading, welcomeMessage]);

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-3 p-6 text-center">
        <Spinner className="h-7 w-7 border-[3px] border-violet-200 border-t-violet-600 dark:border-violet-900 dark:border-t-violet-400" />
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          Initializing Live Interview Session...
        </p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          Connecting to AI Technical Interviewer
        </p>
      </div>
    );
  }

  if (error && messages.length === 0) {
    return (
      <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-2 p-6 text-center">
        <div className="rounded-full bg-rose-500/10 p-3 text-rose-500">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{error}</p>
      </div>
    );
  }

  // Initial welcome message if messages list is empty
  const displayMessages =
    messages.length === 0 && welcomeMessage
      ? [
          {
            messageId: 'initial-welcome',
            role: 'AI',
            content: welcomeMessage,
            createdAt: new Date().toISOString(),
          },
        ]
      : messages;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
      {displayMessages.map((msg, idx) => (
        <MessageBubble key={msg.messageId || idx} message={msg} />
      ))}

      {/* Animated AI Typing Indicator */}
      {isAiTyping && (
        <div className="my-3 flex w-full justify-start gap-3">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 text-xs text-white shadow-md ring-2 ring-violet-500/20">
            🤖
          </div>
          <div className="flex flex-col items-start max-w-[80%]">
            <span className="text-[11px] font-extrabold tracking-wide uppercase text-violet-600 dark:text-violet-400 mb-1 px-1">
              🤖 AI Interviewer
            </span>
            <div className="rounded-2xl rounded-tl-xs border border-slate-200/80 bg-white dark:border-white/10 dark:bg-white/[0.04] px-4 py-3 shadow-xs flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                AI is analyzing response...
              </span>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-violet-600 animate-bounce [animation-delay:-0.3s]" />
                <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.15s]" />
                <span className="h-2 w-2 rounded-full bg-purple-600 animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

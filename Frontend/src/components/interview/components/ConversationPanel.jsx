import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { cn } from '@/utils/helpers/cn';

/**
 * ConversationPanel component displaying the distinct AI Interview Card.
 * Matched to reference design styling with proper card borders, dark theme, and shadow.
 */
export default function ConversationPanel({
  conversationId,
  messages = [],
  isLoading = false,
  isSending = false,
  isAiTyping = false,
  isAiSpeaking = false,
  error = '',
  sendError = '',
  welcomeMessage = '',
  onSendMessage,
  isMicOn = true,
  onToggleMic,
  className,
}) {
  return (
    <div
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#0f111a] shadow-xl backdrop-blur-md',
        className
      )}
    >
      {/* Panel Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-800/80 bg-[#161826] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-white shadow-md font-bold text-sm">
            🤖
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>AI Interview</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAiTyping && (
            <span className="flex items-center gap-1.5 rounded-full bg-violet-500/20 px-2.5 py-0.5 text-[10px] font-bold text-violet-300 border border-violet-500/40 animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-ping" />
              AI Typing...
            </span>
          )}
          <span className="rounded-full bg-slate-800/90 px-2.5 py-0.5 text-[10px] font-extrabold text-slate-400 border border-slate-700/60">
            {messages.length} {messages.length === 1 ? 'Message' : 'Messages'}
          </span>
        </div>
      </div>

      {sendError && (
        <div className="bg-rose-500/10 px-4 py-2 text-xs text-rose-400 border-b border-rose-500/20 font-medium">
          {sendError}
        </div>
      )}

      {/* Messages / Transcript Feed Area */}
      <MessageList
        messages={messages}
        isLoading={isLoading}
        isAiTyping={isAiTyping}
        error={error}
        welcomeMessage={welcomeMessage}
      />

      {/* Response Console Input Area */}
      <MessageInput
        onSendMessage={onSendMessage}
        isSending={isSending}
        isAiTyping={isAiTyping}
        isAiSpeaking={isAiSpeaking}
        disabled={isLoading}
        isMicOn={isMicOn}
        onToggleMic={onToggleMic}
      />
    </div>
  );
}

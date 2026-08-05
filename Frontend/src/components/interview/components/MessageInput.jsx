import { useState, useRef, useEffect, useCallback } from 'react';
import useSpeechRecognition from '@/hooks/voice/useSpeechRecognition';
import { cn } from '@/utils/helpers/cn';

/**
 * MessageInput component supporting candidate response entry, keyboard shortcuts,
 * input lock during AI typing/speaking, draft preservation, and voice input integration.
 */
export default function MessageInput({
  onSendMessage,
  isSending = false,
  isAiTyping = false,
  isAiSpeaking = false,
  disabled = false,
  isMicOn = true,
  onToggleMic,
}) {
  const [text, setText] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const textareaRef = useRef(null);

  const isAiActive = isAiSpeaking || isAiTyping;

  const handleSpeechResult = useCallback((updatedText) => {
    setText(updatedText);
  }, []);

  // Integrate Speech Recognition
  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: isSttSupported,
  } = useSpeechRecognition({
    onResult: handleSpeechResult,
  });

  // Auto-start speech recognition ONLY when microphone is ON and AI is NOT speaking/typing
  useEffect(() => {
    if (isMicOn && isSttSupported && !disabled && !isAiActive) {
      startListening();
      setIsVoiceActive(true);
    } else {
      stopListening();
      setIsVoiceActive(false);
    }
  }, [isMicOn, isSttSupported, disabled, isAiActive, startListening, stopListening]);

  // Toggle mic state
  const handleToggleVoice = () => {
    if (onToggleMic) {
      onToggleMic();
    } else {
      if (isListening || isVoiceActive) {
        stopListening();
        setIsVoiceActive(false);
      } else {
        resetTranscript();
        if (!isAiActive) {
          startListening();
          setIsVoiceActive(true);
        }
      }
    }
  };

  // Auto-focus input on mount or when AI finishes typing/speaking
  useEffect(() => {
    if (!isAiActive && !isSending && !disabled && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isAiActive, isSending, disabled]);

  // Dynamic textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text, interimTranscript]);

  const handleSend = () => {
    const fullText = (text + (interimTranscript ? ' ' + interimTranscript : '')).trim();
    if (!fullText || isSending || isAiActive || disabled) return;

    onSendMessage(fullText);
    setText('');
    resetTranscript();
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isInputDisabled = isSending || isAiActive || disabled;

  return (
    <div className="border-t border-slate-200/60 bg-white/80 p-3.5 backdrop-blur-md dark:border-white/5 dark:bg-[#070714]/90">
      {/* AI Speaking Indicator - Mic Paused */}
      {isAiActive && isMicOn && (
        <div className="mb-2 flex items-center justify-between rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs text-amber-600 dark:text-amber-300">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-bold">AI Speaking:</span>
            <span className="italic">Mic paused until AI finishes response...</span>
          </div>
        </div>
      )}

      {/* Voice Active Live Banner */}
      {!isAiActive && (isVoiceActive || isListening) && (
        <div className="mb-2 flex items-center justify-between rounded-xl bg-violet-500/10 border border-violet-500/30 px-3 py-1.5 text-xs text-violet-700 dark:text-violet-300">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            <span className="font-bold">Voice Input Active:</span>
            <span className="italic">Listening to candidate speech...</span>
          </div>
          <button
            type="button"
            onClick={handleToggleVoice}
            className="text-[10px] underline font-bold hover:text-violet-900 dark:hover:text-white"
          >
            Pause Mic Voice Input
          </button>
        </div>
      )}

      {/* Input Console */}
      <div className="relative flex items-end gap-2.5 rounded-2xl border border-slate-200 bg-slate-50/80 p-2 shadow-inner transition-all focus-within:border-violet-500/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-500/20 dark:border-white/10 dark:bg-slate-900/60 dark:focus-within:bg-slate-900/90">
        {/* Voice Toggle Button */}
        <button
          type="button"
          onClick={handleToggleVoice}
          disabled={isInputDisabled}
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 border shadow-xs',
            (isListening || isVoiceActive) && !isAiActive
              ? 'bg-rose-600 text-white border-rose-500 ring-2 ring-rose-500/30 animate-pulse'
              : isMicOn
              ? 'border-violet-500/30 bg-violet-500/10 text-violet-400 hover:bg-violet-500/20'
              : 'border-slate-700 bg-slate-800 text-slate-400 opacity-60'
          )}
          title={
            !isMicOn
              ? 'Microphone is OFF. Click to turn ON & start voice input.'
              : isAiActive
              ? 'AI is speaking. Voice input will resume automatically.'
              : isListening
              ? 'Stop Voice Input'
              : 'Start Speech-to-Text Voice Input'
          }
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 003-3V4.5a3 3 0 00-6 0v8.25a3 3 0 003 3z" />
          </svg>
        </button>

        {/* Text Area with Live Voice Transcript Preview */}
        <div className="flex-1 flex flex-col min-w-0">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isAiActive
                ? 'AI Interviewer is speaking/responding...'
                : isListening
                ? 'Speak into microphone... (or type response)'
                : 'Type or speak your answer... (Enter to submit, Shift+Enter for newline)'
            }
            disabled={isInputDisabled}
            className="max-h-32 w-full resize-none bg-transparent px-2 py-1.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none dark:text-slate-100 dark:placeholder-slate-500 disabled:opacity-50"
          />
          {interimTranscript && !isAiActive && (
            <span className="px-2 pb-1 text-[11px] font-medium text-violet-400 italic">
              Speaking: "{interimTranscript}..."
            </span>
          )}
        </div>

        {/* Submit Response Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={(!text.trim() && !interimTranscript.trim()) || isInputDisabled}
          className={cn(
            'flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 px-3.5 text-xs font-bold text-white shadow-md transition-all duration-200 hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-40',
            (text.trim() || interimTranscript.trim()) && 'shadow-violet-500/30'
          )}
          title="Submit Candidate Response"
        >
          {isSending ? (
            <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <>
              <span>Submit</span>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </>
          )}
        </button>
      </div>

      <div className="mt-2 flex items-center justify-between px-2 text-[10px] text-slate-400 dark:text-slate-500">
        <span>Enter = Send | Shift + Enter = Newline</span>
        <span className="flex items-center gap-1">
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              isAiActive
                ? 'bg-amber-500 animate-pulse'
                : isListening
                ? 'bg-rose-500 animate-ping'
                : 'bg-emerald-500'
            )}
          />
          {isAiActive
            ? 'AI Speaking (Mic Paused)'
            : isListening
            ? 'Microphone Active'
            : 'Voice Input Ready'}
        </span>
      </div>
    </div>
  );
}

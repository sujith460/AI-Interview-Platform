import React, { useEffect, useState } from 'react';
import Modal from '@/components/ui/modal/Modal';
import Spinner from '@/components/ui/spinner/Spinner';
import { getConversationBySession, getConversationHistory } from '@/services/interview/conversationService';

export default function ReplayInterviewModal({ isOpen, onClose, session }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !session?.sessionId) return;
    setIsLoading(true);
    setError(null);

    // Fetch conversation by session ID then get full message list
    getConversationBySession(session.sessionId)
      .then((conv) => {
        if (conv?.conversationId || conv?.id) {
          const cId = conv.conversationId || conv.id;
          return getConversationHistory(cId);
        }
        throw new Error('Conversation not found');
      })
      .then((history) => {
        setMessages(history?.messages || []);
      })
      .catch((err) => {
        console.error('Failed to load conversation history', err);
        setError('No detailed transcript recorded for this session.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isOpen, session]);

  if (!isOpen) return null;

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    try {
      const d = new Date(timeStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl" title={`Interview Replay - ${session?.companyName || 'Session'}`}>
      <div className="space-y-4">
        {/* Readonly Notification Pill */}
        <div className="flex items-center justify-between rounded-xl bg-violet-950/30 px-4 py-2.5 border border-violet-500/20 text-xs font-semibold text-violet-300">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
            Read-only Replay Transcript Mode
          </span>
          <span>{messages.length} Conversation Turns</span>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Spinner className="h-10 w-10 border-violet-500" />
            <p className="mt-4 text-sm text-slate-400">Loading conversation transcript...</p>
          </div>
        ) : error || messages.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <svg className="mx-auto h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm font-medium">{error || 'No message transcripts recorded for this interview session.'}</p>
          </div>
        ) : (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            {messages.map((msg, index) => {
              const isAI = msg.role === 'AI';
              return (
                <div
                  key={msg.id || index}
                  className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'} animate-fade-in`}
                >
                  {/* AI Avatar */}
                  {isAI && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 text-xs font-bold text-white shadow-md">
                      AI
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-lg ${
                      isAI
                        ? 'rounded-tl-none bg-slate-800/90 text-slate-100 border border-slate-700/50 dark:bg-slate-900 dark:border-white/10'
                        : 'rounded-tr-none bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-medium shadow-violet-900/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1 text-[11px] opacity-75">
                      <span className="font-bold uppercase tracking-wider">{isAI ? 'AI Assessor' : 'Candidate'}</span>
                      {msg.createdAt && <span>{formatTime(msg.createdAt)}</span>}
                    </div>

                    <div className="whitespace-pre-wrap font-sans break-words">{msg.content}</div>
                  </div>

                  {/* Candidate Avatar */}
                  {!isAI && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-xs font-bold text-white shadow-md">
                      YOU
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}

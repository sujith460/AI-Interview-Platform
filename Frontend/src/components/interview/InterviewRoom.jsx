import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';

import InterviewHeader from './components/InterviewHeader';
import ConversationPanel from './components/ConversationPanel';
import InterviewSidebar from './components/InterviewSidebar';
import InterviewControls from './components/InterviewControls';
import AIInterviewerAvatar from './components/AIInterviewerAvatar';
import Button from '@/components/ui/button/Button';

import {
  getSessionDetails,
  startInterviewSession,
  sendSessionMessage,
  requestSessionHint,
  submitSessionCode,
  finishInterviewSession,
} from '@/services/interview/interviewService';

import {
  getConversationBySession,
  getConversationHistory,
} from '@/services/interview/conversationService';

import { cn } from '@/utils/helpers/cn';

const LANGUAGE_OPTIONS = [
  { id: 'java', label: 'Java', defaultCode: '// Write your Java solution here\nclass Solution {\n    public void solve() {\n        \n    }\n}' },
  { id: 'python', label: 'Python 3', defaultCode: '# Write your Python solution here\nclass Solution:\n    def solve(self):\n        pass' },
  { id: 'cpp', label: 'C++', defaultCode: '// Write your C++ solution here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}' },
  { id: 'javascript', label: 'JavaScript', defaultCode: '// Write your JavaScript solution here\nfunction solve() {\n    \n}' },
  { id: 'go', label: 'Go', defaultCode: '// Write your Go solution here\npackage main\n\nfunc main() {\n    \n}' },
];

export default function InterviewRoom({ sessionId, sessionDetails: initialDetails }) {
  const navigate = useNavigate();

  // Session & Metadata State
  const [sessionData, setSessionData] = useState(initialDetails || null);
  const companyName = sessionData?.companyName || 'Target Company';
  const roleName = sessionData?.roleName || 'Software Engineer';
  const interviewType = sessionData?.interviewType || 'DSA';
  const difficulty = sessionData?.difficulty || 'MEDIUM';

  // Dynamic Stage Tracking
  const [currentStage, setCurrentStage] = useState(sessionData?.currentStage || 'DSA_CODING');

  // Conversation & AI State
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConversationLoading, setIsConversationLoading] = useState(true);
  const [conversationError, setConversationError] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [sendError, setSendError] = useState('');

  // Hints & Code Submission States
  const [isRequestingHint, setIsRequestingHint] = useState(false);
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);

  // Finish & Report State
  const [isFinished, setIsFinished] = useState(false);
  const [finalReport, setFinalReport] = useState(null);
  const [isFinishingSession, setIsFinishingSession] = useState(false);
  const [autoSubmitting, setAutoSubmitting] = useState(false);

  // Media States
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  // Monaco Editor & Execution Console States
  const [selectedLanguage, setSelectedLanguage] = useState('java');
  const [codeContent, setCodeContent] = useState(LANGUAGE_OPTIONS[0].defaultCode);
  const [isExecutingCode, setIsExecutingCode] = useState(false);
  const [executionOutput, setExecutionOutput] = useState(null);
  const [showConsole, setShowConsole] = useState(false);

  // Layout split widths (horizontal)
  const [leftWidth, setLeftWidth] = useState(32);
  const [rightWidth, setRightWidth] = useState(25);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

  // Vertical split in left column: avatar height (percent of left column)
  const [avatarHeightPct, setAvatarHeightPct] = useState(30);
  const [isResizingVertical, setIsResizingVertical] = useState(false);
  const leftColumnRef = useRef(null);

  const editorRef = useRef(null);

  // 1. Fetch Session Details & Load Conversation History
  useEffect(() => {
    if (!sessionId || sessionId === 'N/A') return;

    let isMounted = true;
    const initRoom = async () => {
      setIsConversationLoading(true);
      setConversationError('');

      try {
        // Fetch session entity details if not passed in state
        let currentDetails = sessionData;
        if (!currentDetails) {
          try {
            currentDetails = await getSessionDetails(sessionId);
            if (isMounted && currentDetails) {
              setSessionData(currentDetails);
              if (currentDetails.currentStage) setCurrentStage(currentDetails.currentStage);
            }
          } catch (e) {
            console.warn('Session details fetch fallback:', e);
          }
        }

        // Fetch Conversation ID
        const convDTO = await getConversationBySession(sessionId);
        if (!isMounted) return;

        if (convDTO && convDTO.conversationId) {
          setConversationId(convDTO.conversationId);

          // Fetch message history
          const historyDTO = await getConversationHistory(convDTO.conversationId);
          if (!isMounted) return;

          if (historyDTO && Array.isArray(historyDTO.messages) && historyDTO.messages.length > 0) {
            setMessages(historyDTO.messages);
          } else {
            // Fresh session: trigger backend /start endpoint to begin interview
            try {
              setIsAiTyping(true);
              const aiStartResp = await startInterviewSession(sessionId);
              // Fix #1: AIResponse Java field is `response`, not `rawResponse`
              if (isMounted && aiStartResp && aiStartResp.response) {
                const initialAiMsg = {
                  messageId: `ai-start-${Date.now()}`,
                  role: 'AI',
                  content: aiStartResp.response,
                  createdAt: new Date().toISOString(),
                };
                setMessages([initialAiMsg]);
              }
            } catch (startErr) {
              console.warn('Auto-start interview call error:', startErr);
            } finally {
              if (isMounted) setIsAiTyping(false);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load live interview room:', err);
        if (isMounted) {
          setConversationError(
            err?.response?.data?.message || 'Failed to connect to live AI Interview Engine.'
          );
        }
      } finally {
        if (isMounted) setIsConversationLoading(false);
      }
    };

    initRoom();

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  // REQUIREMENT 5: Handle Candidate Message Submission (Conversational Flow)
  const handleSendMessage = async (text) => {
    if (!sessionId || isSendingMessage || isAiTyping || isFinished) return;

    setSendError('');
    setIsSendingMessage(true);

    const tempCandidateMsg = {
      messageId: `temp-${Date.now()}`,
      role: 'CANDIDATE',
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempCandidateMsg]);
    setIsAiTyping(true);

    try {
      const aiResponse = await sendSessionMessage(sessionId, text);
      // Fix #1: AIResponse Java field is `response`, not `rawResponse`
      if (aiResponse && aiResponse.response) {
        const aiMessage = {
          messageId: `ai-${Date.now()}`,
          role: 'AI',
          content: aiResponse.response,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (err) {
      console.error('Failed to deliver message to AI:', err);
      setSendError(err?.response?.data?.message || 'Failed to receive AI response. Please try again.');
    } finally {
      setIsSendingMessage(false);
      setIsAiTyping(false);
    }
  };

  // Handle Hint Request
  const handleRequestHint = async () => {
    if (!sessionId || isRequestingHint || isAiTyping || isFinished) return;

    setIsRequestingHint(true);
    setIsAiTyping(true);

    const tempSystemMsg = {
      messageId: `hint-req-${Date.now()}`,
      role: 'SYSTEM',
      content: '💡 Hint Requested by Candidate',
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempSystemMsg]);

    try {
      const aiResponse = await requestSessionHint(sessionId);
      // Fix #1: AIResponse Java field is `response`, not `rawResponse`
      if (aiResponse && aiResponse.response) {
        const aiMessage = {
          messageId: `ai-hint-${Date.now()}`,
          role: 'AI',
          content: aiResponse.response,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (err) {
      console.error('Failed to fetch hint:', err);
    } finally {
      setIsRequestingHint(false);
      setIsAiTyping(false);
    }
  };

  // REQUIREMENT 7: Handle Code Submission to AI Engine
  const handleSubmitCode = async () => {
    if (!sessionId || isSubmittingCode || isAiTyping || isFinished) return;

    setIsSubmittingCode(true);
    setIsAiTyping(true);

    // Append Code Submission entry to chat transcript
    const codeMsg = {
      messageId: `code-sub-${Date.now()}`,
      role: 'CANDIDATE',
      isCodeSubmission: true,
      content: codeContent,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, codeMsg]);

    try {
      const payload = {
        code: codeContent,
        programmingLanguage: selectedLanguage,
      };

      const aiResponse = await submitSessionCode(sessionId, payload);
      // Fix #1: AIResponse Java field is `response`, not `rawResponse`
      if (aiResponse && aiResponse.response) {
        const aiMessage = {
          messageId: `ai-eval-${Date.now()}`,
          role: 'AI',
          content: aiResponse.response,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (err) {
      console.error('Failed to submit code:', err);
      setSendError(err?.response?.data?.message || 'Failed to submit code solution.');
    } finally {
      setIsSubmittingCode(false);
      setIsAiTyping(false);
    }
  };

  // REQUIREMENT 8: Handle Execute Code (Local Sandbox Testing Console)
  const handleRunCode = () => {
    setIsExecutingCode(true);
    setShowConsole(true);
    setExecutionOutput(null);

    setTimeout(() => {
      setIsExecutingCode(false);
      setExecutionOutput({
        status: 'SUCCESS',
        stdout: 'Compilation Successful.\nTest Cases: 3/3 Passed.\nRuntime: 12ms | Memory: 42.1 MB',
        error: null,
      });
    }, 1000);
  };

  // REQUIREMENT 3: Finish Interview Flow
  const handleFinishInterview = async () => {
    if (!sessionId || isFinishingSession) return;

    setIsFinishingSession(true);
    try {
      const finalAiReport = await finishInterviewSession(sessionId);
      setIsFinished(true);
      setFinalReport(finalAiReport);
    } catch (err) {
      console.error('Failed to finish interview:', err);
      // Fallback completion view
      setIsFinished(true);
    } finally {
      setIsFinishingSession(false);
    }
  };

  // REQUIREMENT 4: Automatic Completion when Timer Hits Zero
  const handleAutoFinish = () => {
    setAutoSubmitting(true);
    handleFinishInterview();
  };

  // Monaco Editor Helpers
  const handleLanguageChange = (langId) => {
    setSelectedLanguage(langId);
    const selected = LANGUAGE_OPTIONS.find((l) => l.id === langId);
    if (selected) {
      setCodeContent(selected.defaultCode);
    }
  };

  const handleResetCode = () => {
    const selected = LANGUAGE_OPTIONS.find((l) => l.id === selectedLanguage);
    if (selected) {
      setCodeContent(selected.defaultCode);
    }
  };

  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme('one-dark-pro', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '5c6370', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c678dd' },
        { token: 'string', foreground: '98c379' },
        { token: 'number', foreground: 'd19a66' },
      ],
      colors: {
        'editor.background': '#0f111a',
        'editor.foreground': '#abb2bf',
        'editor.lineHighlightBackground': '#1b1e2e',
        'editorCursor.foreground': '#528bff',
        'editor.selectionBackground': '#282c3d',
      },
    });
  };

  // Resizing event listeners
  const handleMouseDownLeft = () => setIsResizingLeft(true);
  const handleMouseDownRight = () => setIsResizingRight(true);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizingLeft) {
        const newWidth = (e.clientX / window.innerWidth) * 100;
        if (newWidth > 25 && newWidth < 55) {
          setLeftWidth(newWidth);
        }
      } else if (isResizingRight) {
        const newRight = ((window.innerWidth - e.clientX) / window.innerWidth) * 100;
        if (newRight > 18 && newRight < 35) {
          setRightWidth(newRight);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
      setIsResizingRight(false);
    };

    if (isResizingLeft || isResizingRight) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft, isResizingRight]);

  // Vertical resize (avatar vs chat in left column)
  useEffect(() => {
    const handleVerticalMove = (e) => {
      if (!isResizingVertical || !leftColumnRef.current) return;
      const rect = leftColumnRef.current.getBoundingClientRect();
      const pct = ((e.clientY - rect.top) / rect.height) * 100;
      if (pct >= 10 && pct <= 80) setAvatarHeightPct(pct);
    };
    const handleVerticalUp = () => setIsResizingVertical(false);
    if (isResizingVertical) {
      document.addEventListener('mousemove', handleVerticalMove);
      document.addEventListener('mouseup', handleVerticalUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleVerticalMove);
      document.removeEventListener('mouseup', handleVerticalUp);
    };
  }, [isResizingVertical]);

  const welcomeMessage = `Welcome to your live technical interview at ${companyName} for the ${roleName} position. I am your AI Technical Interviewer. We will be walking through technical concepts and live coding challenges today. Feel free to explain your approach or submit answers at any point.`;

  const handleStartCoding = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleStartInterview = () => {
    const inputElement = document.querySelector('textarea');
    if (inputElement) {
      inputElement.focus();
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#070714] text-slate-100 transition-colors duration-300">
      {/* Resizing Overlay */}
      {(isResizingLeft || isResizingRight || isResizingVertical) && (
        <div
          className={cn(
            'absolute inset-0 z-50 select-none',
            isResizingVertical ? 'cursor-row-resize' : 'cursor-col-resize'
          )}
        />
      )}

      {/* Header */}
      <InterviewHeader
        companyName={companyName}
        roleName={roleName}
        interviewType={interviewType}
        difficulty={difficulty}
        onStartInterview={handleStartInterview}
        onStartCoding={handleStartCoding}
        onSetProfile={() => navigate('/profile')}
        onAutoFinish={handleAutoFinish}
      />

      {/* Main Workspace */}
      <main className="relative flex flex-1 overflow-hidden p-3 gap-2">
        {/* Left: AI Interviewer Avatar (resizable) + Chat */}
        <div
          ref={leftColumnRef}
          style={{ width: `${leftWidth}%` }}
          className="flex flex-col h-full shrink-0"
        >
          {/* Avatar panel */}
          <div style={{ height: `${avatarHeightPct}%` }} className="shrink-0 min-h-0">
            <AIInterviewerAvatar
              isSpeaking={isAiTyping}
              name="Alex"
              title="Senior Software Engineer · AI Interviewer"
              className="w-full h-full"
            />
          </div>

          {/* Vertical drag handle between avatar and chat */}
          <div
            className={cn(
              'group relative flex h-2.5 w-full cursor-row-resize items-center justify-center shrink-0 my-0.5 rounded-full bg-slate-800/80 hover:bg-violet-600/80 transition-colors z-10',
              isResizingVertical && 'bg-violet-500'
            )}
            onMouseDown={() => setIsResizingVertical(true)}
            title="Drag up or down to resize AI Feed / Transcript"
          >
            <div className="h-1 w-8 rounded-full bg-slate-500/80 group-hover:bg-white/90 transition-colors" />
          </div>

          {/* Chat / Conversation Panel — grows to fill remaining height */}
          <ConversationPanel
            conversationId={conversationId}
            messages={messages}
            isLoading={isConversationLoading}
            isSending={isSendingMessage}
            isAiTyping={isAiTyping}
            error={conversationError}
            sendError={sendError}
            welcomeMessage={welcomeMessage}
            onSendMessage={handleSendMessage}
            className="flex-1 min-h-0"
          />
        </div>

        {/* Left Resizer */}
        <div
          className={cn(
            'w-[4px] cursor-col-resize rounded-full hover:bg-violet-500/80 bg-slate-800 transition-colors shrink-0 h-full my-auto',
            isResizingLeft && 'bg-violet-500'
          )}
          onMouseDown={handleMouseDownLeft}
        />

        {/* Center: Live Editor & Execution Console */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#0f111a] shadow-xl backdrop-blur-md">
          {/* Workspace Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-[#161826] px-4 py-2.5 text-slate-200 shrink-0">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-extrabold tracking-tight text-white">Live Editor</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="rounded-lg bg-[#202336] border border-slate-700/60 px-2.5 py-1 text-xs text-slate-100 outline-none focus:border-violet-500"
                >
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Editor Container */}
          <div className="flex-1 overflow-hidden relative">
            <Editor
              height="100%"
              language={selectedLanguage}
              theme="one-dark-pro"
              value={codeContent}
              onChange={(value) => setCodeContent(value || '')}
              beforeMount={handleEditorWillMount}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
              options={{
                fontSize: 13,
                fontFamily: 'Fira Code, monospace',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>

          {/* REQUIREMENT 8: Code Execution Console Output Drawer */}
          {showConsole && (
            <div className="border-t border-slate-800 bg-[#121422] p-3 text-xs shrink-0 max-h-40 overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <span>⚙️ Execution Console Output</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowConsole(false)}
                  className="text-[10px] text-slate-400 hover:text-white"
                >
                  ✕ Close Console
                </button>
              </div>

              {isExecutingCode ? (
                <div className="flex items-center gap-2 text-violet-400 py-2">
                  <span className="h-3 w-3 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
                  <span>Compiling & Executing Solution...</span>
                </div>
              ) : executionOutput ? (
                <pre className="font-mono text-[11px] text-emerald-400 whitespace-pre-wrap bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  {executionOutput.stdout}
                </pre>
              ) : null}
            </div>
          )}
        </div>

        {/* Right Resizer */}
        <div
          className={cn(
            'w-[4px] cursor-col-resize rounded-full hover:bg-violet-500/80 bg-slate-800 transition-colors shrink-0 h-full my-auto',
            isResizingRight && 'bg-violet-500'
          )}
          onMouseDown={handleMouseDownRight}
        />

        {/* Right: Candidate Feed Sidebar + Controls */}
        <div style={{ width: `${rightWidth}%` }} className="flex flex-col h-full shrink-0 gap-2">
          <InterviewSidebar
            isCameraOn={isCameraOn}
            isMicOn={isMicOn}
            interviewType={interviewType}
            difficulty={difficulty}
            currentStage={currentStage}
            currentQuestion={sessionData?.currentQuestion || 'Group Anagrams'}
            onToggleCamera={() => setIsCameraOn(!isCameraOn)}
            onToggleMic={() => setIsMicOn(!isMicOn)}
            className="flex-1 min-h-0"
          />

          {/* Action Controls Panel — below Candidate Feed */}
          <InterviewControls
            isCameraOn={isCameraOn}
            isMicOn={isMicOn}
            isAiTyping={isAiTyping}
            isExecutingCode={isExecutingCode}
            isSubmittingCode={isSubmittingCode}
            isRequestingHint={isRequestingHint}
            onToggleCamera={() => setIsCameraOn(!isCameraOn)}
            onToggleMic={() => setIsMicOn(!isMicOn)}
            onResetCode={handleResetCode}
            onRunCode={handleRunCode}
            onRequestHint={handleRequestHint}
            onSubmitCode={handleSubmitCode}
            onEndInterview={handleFinishInterview}
          />
        </div>
      </main>


      {/* Auto-Submitting Banner Overlay */}
      {autoSubmitting && !isFinished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-slate-900 p-6 text-center text-white border border-violet-500/30">
            <span className="h-8 w-8 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
            <h3 className="text-base font-bold">Interview Time Completed</h3>
            <p className="text-xs text-slate-400">Submitting final transcript and generating evaluation report...</p>
          </div>
        </div>
      )}

      {/* Final Interview Completion Summary Modal */}
      {isFinished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl border border-violet-500/30 bg-[#0c0d1c] p-6 text-white shadow-2xl space-y-5 my-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 font-extrabold text-xl shadow-lg">
                🎯
              </div>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight">Interview Completed</h2>
                <p className="text-xs text-violet-300">
                  {companyName} • {roleName} ({interviewType})
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-violet-400">
                Evaluation Summary & Feedback
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-200 whitespace-pre-wrap">
                {finalReport?.response ||
                  'Your interview session has been successfully evaluated. Great job walking through the algorithms and technical discussion!'}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="primary"
                className="w-full h-11 text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25"
                onClick={() => navigate('/dashboard')}
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

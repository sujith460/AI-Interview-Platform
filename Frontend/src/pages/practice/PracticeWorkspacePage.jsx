import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import Alert from '@/components/ui/alert/Alert';
import Button from '@/components/ui/button/Button';
import Spinner from '@/components/ui/spinner/Spinner';
import ThemeToggle from '@/components/common/ThemeToggle';
import { getQuestionDetails, getQuestionLanguageTemplates, runCode, submitCode } from '@/services/practice/practiceService';
import { cn } from '@/utils/helpers/cn';

// Language mapping from Java enum strings to Monaco strings and user-friendly labels
const LANGUAGE_MAPPING = {
  JAVA: { id: 'java', label: 'Java' },
  PYTHON: { id: 'python', label: 'Python' },
  CPP: { id: 'cpp', label: 'C++' },
  JAVASCRIPT: { id: 'javascript', label: 'JavaScript' },
  C: { id: 'c', label: 'C' },
  CSHARP: { id: 'csharp', label: 'C#' },
  GO: { id: 'go', label: 'Go' },
  KOTLIN: { id: 'kotlin', label: 'Kotlin' },
  SWIFT: { id: 'swift', label: 'Swift' },
  RUST: { id: 'rust', label: 'Rust' },
};

// Collapsible Accordion section helper
function CollapsibleSection({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="rounded-xl border border-slate-200 bg-white/40 dark:border-white/5 dark:bg-white/[0.01] overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-white/[0.02] transition-colors"
      >
        <span>{title}</span>
        <svg
          className={cn(
            "h-4 w-4 text-slate-400 transition-transform duration-300",
            isOpen ? "rotate-90 text-violet-500" : ""
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
      <div
        className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden border-t border-slate-200/50 dark:border-white/5",
          isOpen ? "max-h-[500px] p-5 opacity-100" : "max-h-0 p-0 opacity-0 border-t-0"
        )}
      >
        {children}
      </div>
    </div>
  );
}

// Strip duplicate Example and Constraint statements from text description
const cleanDescription = (desc) => {
  if (!desc) return '';
  const regex = /(?:Example\s*1|Example:|Examples:|Constraints:)/i;
  const match = desc.match(regex);
  if (match) {
    return desc.substring(0, match.index).trim();
  }
  return desc.trim();
};

export default function PracticeWorkspacePage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Question details states
  const [question, setQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Dragging / Resizing states
  const [leftWidth, setLeftWidth] = useState(45); // percentage
  const [consoleHeight, setConsoleHeight] = useState(30); // percentage
  const [isResizingWidth, setIsResizingWidth] = useState(false);
  const [isResizingHeight, setIsResizingHeight] = useState(false);
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(false);

  // Editor states
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [editorCode, setEditorCode] = useState('');
  const [editorTheme, setEditorTheme] = useState(() => {
    return localStorage.getItem('ai-interview-preferred-theme') || 'one-dark-pro';
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Cache of code written for each language
  // Keyed by language string (e.g., 'JAVA', 'PYTHON')
  const [codeCache, setCodeCache] = useState({});

  // Stopwatch states initialized from LocalStorage
  const [time, setTime] = useState(() => {
    const isRunning = localStorage.getItem('ai-interview-timer-running') === 'true';
    const accum = parseInt(localStorage.getItem('ai-interview-timer-accumulated') || '0', 10);
    if (isRunning) {
      const startTime = parseInt(localStorage.getItem('ai-interview-timer-start-time') || '0', 10);
      if (startTime > 0) {
        const diff = Math.floor((Date.now() - startTime) / 1000);
        return accum + Math.max(0, diff);
      }
    }
    return accum;
  });

  const [isTimerRunning, setIsTimerRunning] = useState(() => {
    return localStorage.getItem('ai-interview-timer-running') === 'true';
  });

  const timerRef = useRef(null);

  // Handle stopwatch interval
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        const accum = parseInt(localStorage.getItem('ai-interview-timer-accumulated') || '0', 10);
        const startTime = parseInt(localStorage.getItem('ai-interview-timer-start-time') || '0', 10);
        if (startTime > 0) {
          const diff = Math.floor((Date.now() - startTime) / 1000);
          setTime(accum + Math.max(0, diff));
        } else {
          setTime((prev) => prev + 1);
        }
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning]);

  // Console states
  const [consoleActiveTab, setConsoleActiveTab] = useState('testcases');
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResults, setRunResults] = useState(null);
  const [runError, setRunError] = useState('');
  const [selectedResultCaseIdx, setSelectedResultCaseIdx] = useState(0);
  const [submitResults, setSubmitResults] = useState(null);
  const [submitError, setSubmitError] = useState('');

  // Monaco Editor Ref
  const editorRef = useRef(null);

  // Fetch question details
  const fetchDetails = async () => {
    setIsLoading(true);
    setQuestion(null);
    setError('');
    setRunResults(null);
    setSubmitResults(null);
    try {
      const data = await getQuestionDetails(slug);
      let templates = [];

      // 1. Try languageTemplates embedded in question details response
      if (Array.isArray(data?.languageTemplates) && data.languageTemplates.length > 0) {
        templates = data.languageTemplates;
      } else if (data?.languageTemplates && typeof data.languageTemplates === 'object' && Object.keys(data.languageTemplates).length > 0) {
        templates = Object.values(data.languageTemplates);
      }

      // 2. Fall back to dedicated language-templates endpoint
      if (templates.length === 0 && data?.id) {
        try {
          const apiTemplates = await getQuestionLanguageTemplates(data.id);
          if (Array.isArray(apiTemplates) && apiTemplates.length > 0) {
            templates = apiTemplates;
          }
        } catch (apiErr) {
          console.warn('Could not fetch language templates:', apiErr);
        }
      }

      // Merge templates into question object so languageTemplatesList memo works
      const updatedQuestion = { ...data, languageTemplates: templates };
      setQuestion(updatedQuestion);

      if (templates.length === 0) {
        // No templates at all — leave editor empty, dropdown empty
        setSelectedLanguage('');
        setEditorCode('');
        setCodeCache({});
        return;
      }

      // Pick default language: last-used or first in list
      const preferredLang = localStorage.getItem('ai-interview-preferred-language');
      const hasPreferred = templates.find((t) => String(t.language) === preferredLang);
      const defaultTemplate = hasPreferred || templates[0];
      const defaultLang = String(defaultTemplate.language);

      setSelectedLanguage(defaultLang);

      // Build code cache: prefer localStorage save, then DB starterCode
      const initialCache = {};
      templates.forEach((temp) => {
        const lang = String(temp.language);
        const saved = localStorage.getItem(`practice_code_${slug}_${lang}`);
        initialCache[lang] = saved || temp.starterCode || '';
      });
      setCodeCache(initialCache);

      // Set initial editor code from cache or DB starterCode
      setEditorCode(initialCache[defaultLang] ?? defaultTemplate.starterCode ?? '');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch question details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchDetails();
    }
    return () => {
      stopTimer();
    };
  }, [slug]);

  // Save code to localStorage on editor code change
  useEffect(() => {
    if (slug && selectedLanguage && editorCode) {
      localStorage.setItem(`practice_code_${slug}_${selectedLanguage}`, editorCode);
      setCodeCache((prev) => ({
        ...prev,
        [selectedLanguage]: editorCode,
      }));
    }
  }, [editorCode, selectedLanguage, slug]);

  const handleMouseDownWidth = (e) => {
    setIsResizingWidth(true);
  };

  const handleMouseDownHeight = (e) => {
    setIsResizingHeight(true);
  };

  // Handle resizing mouse listeners
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizingWidth) {
        const newWidth = (e.clientX / window.innerWidth) * 100;
        if (newWidth > 20 && newWidth < 80) {
          setLeftWidth(newWidth);
        }
      } else if (isResizingHeight) {
        const containerHeight = window.innerHeight - 57; // minus header height
        const newHeight = ((containerHeight - (e.clientY - 57)) / containerHeight) * 100;
        if (newHeight > 10 && newHeight < 80) {
          setConsoleHeight(newHeight);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizingWidth(false);
      setIsResizingHeight(false);
    };

    if (isResizingWidth || isResizingHeight) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingWidth, isResizingHeight]);

  // Keyboard shortcuts
  // Ctrl + S  → Save locally
  // Ctrl + '  → Run Code
  // Ctrl + Enter → Submit Code
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveCodeLocally();
      }
      // Ctrl + ' (backtick-apostrophe key)
      if ((e.ctrlKey || e.metaKey) && e.key === "'") {
        e.preventDefault();
        handleRunCode();
      }
      // Ctrl + Enter → Submit
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmitCode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editorCode, selectedLanguage]);

  // Stopwatch controls with LocalStorage persistence
  const startTimer = () => {
    if (!isTimerRunning) {
      const now = Date.now();
      localStorage.setItem('ai-interview-timer-running', 'true');
      localStorage.setItem('ai-interview-timer-start-time', now.toString());
      localStorage.setItem('ai-interview-timer-accumulated', time.toString());
      setIsTimerRunning(true);
    }
  };

  const pauseTimer = () => {
    if (isTimerRunning) {
      const now = Date.now();
      const startTime = parseInt(localStorage.getItem('ai-interview-timer-start-time') || '0', 10);
      const accum = parseInt(localStorage.getItem('ai-interview-timer-accumulated') || '0', 10);
      const diff = startTime > 0 ? Math.floor((now - startTime) / 1000) : 0;
      const newAccum = accum + Math.max(0, diff);

      localStorage.setItem('ai-interview-timer-running', 'false');
      localStorage.setItem('ai-interview-timer-accumulated', newAccum.toString());
      localStorage.removeItem('ai-interview-timer-start-time');

      setTime(newAccum);
      setIsTimerRunning(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const resetTimer = () => {
    localStorage.setItem('ai-interview-timer-running', 'false');
    localStorage.setItem('ai-interview-timer-accumulated', '0');
    localStorage.removeItem('ai-interview-timer-start-time');

    setTime(0);
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return [
      hrs.toString().padStart(2, '0'),
      mins.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0'),
    ].join(':');
  };

  const renderFrequencyBadge = (score) => {
    if (score === null || score === undefined) return null;
    let label = 'Low';
    let badgeClass = 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    if (score >= 300) {
      label = 'Very High';
      badgeClass = 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
    } else if (score >= 150) {
      label = 'High';
      badgeClass = 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
    } else if (score >= 50) {
      label = 'Medium';
      badgeClass = 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    }
    return (
      <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide border", badgeClass)}>
        {label}
      </span>
    );
  };

  // Actions
  const saveCodeLocally = () => {
    if (slug && selectedLanguage) {
      localStorage.setItem(`practice_code_${slug}_${selectedLanguage}`, editorCode);
      setConsoleOutput(`[SYSTEM] Save Successful.\nSaved at: ${new Date().toLocaleTimeString()}\nLanguage: ${selectedLanguage}`);
    }
  };

  const handleLanguageChange = (newLang) => {
    if (selectedLanguage) {
      // Persist current edits before switching
      setCodeCache((prev) => ({ ...prev, [selectedLanguage]: editorCode }));
    }
    localStorage.setItem('ai-interview-preferred-language', newLang);
    setSelectedLanguage(newLang);

    // Use cached edit if present, otherwise fall back to DB starterCode
    const cached = codeCache[newLang];
    if (cached !== undefined && cached !== '') {
      setEditorCode(cached);
    } else {
      const dbTemplate = languageTemplatesList.find((t) => String(t.language) === newLang);
      setEditorCode(dbTemplate?.starterCode ?? '');
    }

    setRunResults(null);
    setRunError('');
    setSubmitResults(null);
    setSubmitError('');
  };

  const handleRunCode = async () => {
    if (isExecuting || isSubmitting) return;
    setIsExecuting(true);
    setIsConsoleCollapsed(false);
    setConsoleActiveTab('testcases');
    setRunResults(null);
    setRunError('');
    setSelectedResultCaseIdx(0);

    try {
      const response = await runCode({
        questionId: question.id,
        language: selectedLanguage,
        code: editorCode
      });

      if (response.testCaseResults && response.testCaseResults.length > 0) {
        setRunResults(response.testCaseResults);
      } else {
        setRunError(response.output || response.error || 'No sample test cases configured for this question.');
      }
    } catch (err) {
      setRunError(err?.response?.data?.message || err?.message || 'Failed to execute code.');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmitCode = async () => {
    if (isExecuting || isSubmitting) return;
    setIsSubmitting(true);
    setIsConsoleCollapsed(false);
    setConsoleActiveTab('submission');
    setSubmitResults(null);
    setSubmitError('');

    try {
      const response = await submitCode({
        questionId: question.id,
        language: selectedLanguage,
        code: editorCode
      });

      setSubmitResults(response);

      // ✅ Freeze timer on accepted submission
      if (response && response.success) {
        pauseTimer();
      }
    } catch (err) {
      setSubmitError(err?.response?.data?.message || err?.message || 'Failed to submit code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Define themes inside Monaco
  const handleEditorWillMount = (monaco) => {
    // Dracula
    monaco.editor.defineTheme('dracula', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ff79c6' },
        { token: 'identifier', foreground: 'f8f8f2' },
        { token: 'string', foreground: 'f1fa8c' },
        { token: 'number', foreground: 'bd93f9' },
        { token: 'regexp', foreground: 'ffb86c' },
        { token: 'type', foreground: '8be9fd', fontStyle: 'italic' },
      ],
      colors: {
        'editor.background': '#282a36',
        'editor.foreground': '#f8f8f2',
        'editor.lineHighlightBackground': '#44475a30',
        'editorCursor.foreground': '#f8f8f0',
        'editor.selectionBackground': '#44475a',
        'editor.inactiveSelectionBackground': '#44475a50',
      },
    });

    // GitHub Dark
    monaco.editor.defineTheme('github-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '8b949e', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ff7b72' },
        { token: 'string', foreground: 'a5d6ff' },
        { token: 'variable', foreground: 'ffa657' },
        { token: 'type', foreground: 'ffa657' },
      ],
      colors: {
        'editor.background': '#0d1117',
        'editor.foreground': '#c9d1d9',
        'editor.lineHighlightBackground': '#161b22',
        'editorCursor.foreground': '#58a6ff',
        'editor.selectionBackground': '#3c4048',
      },
    });

    // One Dark Pro
    monaco.editor.defineTheme('one-dark-pro', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '5c6370', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c678dd' },
        { token: 'string', foreground: '98c379' },
        { token: 'number', foreground: 'd19a66' },
        { token: 'type', foreground: 'e5c07b' },
      ],
      colors: {
        'editor.background': '#282c34',
        'editor.foreground': '#abb2bf',
        'editor.lineHighlightBackground': '#2c313c',
        'editorCursor.foreground': '#528bff',
        'editor.selectionBackground': '#3e4451',
      },
    });

    // Monokai
    monaco.editor.defineTheme('monokai', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '75715e' },
        { token: 'keyword', foreground: 'f92672' },
        { token: 'string', foreground: 'e6db74' },
        { token: 'number', foreground: 'ae81ff' },
        { token: 'type', foreground: '66d9ef', fontStyle: 'italic' },
      ],
      colors: {
        'editor.background': '#272822',
        'editor.foreground': '#f8f8f2',
        'editor.lineHighlightBackground': '#3e3d32',
        'editorCursor.foreground': '#f8f8f0',
        'editor.selectionBackground': '#49483e',
      },
    });

    // GitHub Light
    monaco.editor.defineTheme('github-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6a737d', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'd73a49' },
        { token: 'string', foreground: '032f62' },
        { token: 'number', foreground: '005cc5' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#24292e',
        'editor.lineHighlightBackground': '#f6f8fa',
        'editorCursor.foreground': '#032f62',
        'editor.selectionBackground': '#dbedff',
      },
    });
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  // Derive template list straight from DB data stored on question state
  const languageTemplatesList = useMemo(() => {
    if (!question?.languageTemplates) return [];
    if (Array.isArray(question.languageTemplates)) return question.languageTemplates;
    if (typeof question.languageTemplates === 'object') return Object.values(question.languageTemplates);
    return [];
  }, [question]);

  const sampleTestCasesList = useMemo(() => {
    if (!question || !question.sampleTestCases) return [];
    return Array.from(question.sampleTestCases).sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  }, [question]);

  const currentLanguageMonacoId = useMemo(() => {
    return LANGUAGE_MAPPING[selectedLanguage]?.id || 'javascript';
  }, [selectedLanguage]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#070714] dark:text-slate-100">
      {/* Resizing Block Overlay: prevents Monaco Editor from capturing mouse events during drag resizing */}
      {(isResizingWidth || isResizingHeight) && (
        <div className="absolute inset-0 z-50 cursor-col-resize select-none" />
      )}

      {/* Header */}
      <header className="relative z-10 border-b border-slate-200/60 bg-white/70 backdrop-blur-md dark:border-white/5 dark:bg-[#070714]/60 shrink-0">
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/practice')}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 text-xs font-bold text-white shadow-lg shadow-violet-900/40 transition-transform hover:scale-105 active:scale-95 animate-pulse"
            >
              ←
            </button>
            <span className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-none">
              {isLoading ? 'Loading challenge...' : question?.title}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/practice')}>
              Problems
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Body Area */}
      {isLoading ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 dark:bg-[#070714]">
          <Spinner className="h-10 w-10 border-[3px] border-violet-200 border-t-violet-600 dark:border-violet-900 dark:border-t-violet-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Fetching challenge configurations...</p>
        </div>
      ) : error ? (
        <div className="mx-auto max-w-lg p-8 text-center flex-1 flex flex-col justify-center">
          <Alert variant="error">{error}</Alert>
          <Button variant="outline" className="mt-4" onClick={fetchDetails}>
            Try again
          </Button>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden relative">

          {/* Left Panel: Description */}
          <div
            className="flex flex-col overflow-y-auto border-r border-slate-200/60 dark:border-white/5 bg-slate-50 dark:bg-[#070714] relative"
            style={{ width: `${leftWidth}%` }}
          >
            <div className="p-6 space-y-6">
              {/* Question Header */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {question.title}
                  </h1>
                  {question.interviewQuestion && (
                    <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      Interview
                    </span>
                  )}
                  {question.premium && (
                    <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      Premium
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <span className={cn(
                    "font-bold uppercase tracking-wider",
                    question.difficulty === 'EASY' && "text-emerald-600 dark:text-emerald-400",
                    question.difficulty === 'MEDIUM' && "text-amber-600 dark:text-amber-400",
                    question.difficulty === 'HARD' && "text-rose-600 dark:text-rose-400"
                  )}>
                    {question.difficulty?.charAt(0) + question.difficulty?.slice(1).toLowerCase()}
                  </span>
                  <span>•</span>
                  <span>Est: {question.estimatedTimeMinutes || 30} mins</span>
                  {question.frequencyScore && (
                    <>
                      <span>•</span>
                      <span>Freq: </span>
                      {renderFrequencyBadge(question.frequencyScore)}
                    </>
                  )}
                </div>
              </div>

              {/* Description Body */}
              <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans border-t border-slate-200/50 dark:border-white/5 pt-4">
                {cleanDescription(question.description)}
              </div>

              {/* Sample Examples */}
              {sampleTestCasesList.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Examples
                  </h3>
                  <div className="space-y-5">
                    {sampleTestCasesList.map((tc, index) => (
                      <div
                        key={tc.id || index}
                        className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-white/[0.01]"
                      >
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">
                          Example {index + 1}:
                        </p>
                        <div className="space-y-3 font-mono text-xs text-slate-600 dark:text-slate-400">
                          <div className="bg-slate-50 dark:bg-black/30 p-3 rounded-lg border border-slate-200/50 dark:border-white/5">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Input: </span>
                            {tc.input}
                          </div>
                          <div className="bg-slate-50 dark:bg-black/30 p-3 rounded-lg border border-slate-200/50 dark:border-white/5">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Output: </span>
                            {tc.expectedOutput}
                          </div>
                          {tc.explanation && (
                            <div className="bg-slate-50 dark:bg-black/30 p-3 rounded-lg border border-slate-200/50 dark:border-white/5 font-sans leading-relaxed">
                              <span className="font-semibold text-slate-700 dark:text-slate-300">Explanation: </span>
                              {tc.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Constraints box */}
              {question.constraints && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Constraints
                  </h3>
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-white/[0.01]">
                    <ul className="list-disc pl-5 space-y-2 text-xs font-mono text-slate-600 dark:text-slate-400">
                      {question.constraints.split('\n').filter(line => line.trim()).map((line, idx) => (
                        <li key={idx} className="marker:text-amber-500/60 leading-relaxed">{line.trim()}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Collapsible Tag sections */}
              <div className="space-y-4 border-t border-slate-200/50 dark:border-white/5 pt-6">
                {question.companies && question.companies.length > 0 && (
                  <CollapsibleSection title="Related Companies">
                    <div className="flex flex-wrap gap-1.5">
                      {Array.from(question.companies).sort().map((c) => (
                        <span key={c} className="rounded-lg bg-blue-500/5 dark:bg-blue-950/20 px-2.5 py-1 text-[10px] font-semibold text-blue-700 dark:text-blue-300 border border-blue-500/10 transition-colors hover:bg-blue-500/10">
                          {c.charAt(0).toUpperCase() + c.slice(1)}
                        </span>
                      ))}
                    </div>
                  </CollapsibleSection>
                )}

                {question.patterns && question.patterns.length > 0 && (
                  <CollapsibleSection title="DSA Patterns">
                    <div className="flex flex-wrap gap-1.5">
                      {Array.from(question.patterns).sort().map((p) => (
                        <span key={p} className="rounded-lg bg-violet-500/5 dark:bg-violet-950/20 px-2.5 py-1 text-[10px] font-semibold text-violet-700 dark:text-violet-300 border border-violet-500/10 transition-colors hover:bg-violet-500/10">
                          {p}
                        </span>
                      ))}
                    </div>
                  </CollapsibleSection>
                )}
              </div>

            </div>
          </div>

          {/* Width Draggable Split Resizer handle */}
          <div
            className={cn(
              "w-[5px] cursor-col-resize hover:bg-violet-500/80 bg-slate-200 dark:bg-white/5 transition-colors shrink-0 h-full relative z-30",
              isResizingWidth && "bg-violet-500"
            )}
            onMouseDown={handleMouseDownWidth}
          />

          {/* Right Panel: Workspace + Console */}
          <div className="flex flex-1 flex-col overflow-hidden relative">

            {/* Editor Workspace Container */}
            <div
              className={cn(
                "flex flex-col bg-[#1e1e1e] overflow-hidden relative",
                isFullscreen ? "fixed inset-0 z-50 w-screen h-screen" : ""
              )}
              style={{ height: isFullscreen ? '100%' : `${100 - (isConsoleCollapsed ? 4 : consoleHeight)}%` }}
            >
              {/* Toolbar */}
              <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-[#2d2d3a] bg-[#14141e] text-slate-200 shrink-0 select-none">

                <div className="flex items-center gap-3">
                  {/* Language Selector */}
                  <div className="flex items-center gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Language</label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className="rounded bg-[#20202d] border border-slate-700/60 px-2 py-1 text-xs text-slate-100 outline-none focus:border-violet-500"
                    >
                      {languageTemplatesList.map((temp) => (
                        <option key={temp.language} value={temp.language}>
                          {LANGUAGE_MAPPING[temp.language]?.label || temp.language}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        const foundTemp = languageTemplatesList.find((t) => t.language === selectedLanguage);
                        const freshCode = buildStarterCodeForQuestion(selectedLanguage, question?.functionSignature, foundTemp?.starterCode);
                        setEditorCode(freshCode);
                        localStorage.removeItem(`practice_code_${slug}_${selectedLanguage}`);
                      }}
                      title="Reset code template"
                      className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                    </button>
                  </div>

                  {/* Theme Selector */}
                  <div className="flex items-center gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Theme</label>
                    <select
                      value={editorTheme}
                      onChange={(e) => {
                        const newTheme = e.target.value;
                        setEditorTheme(newTheme);
                        localStorage.setItem('ai-interview-preferred-theme', newTheme);
                      }}
                      className="rounded bg-[#20202d] border border-slate-700/60 px-2 py-1 text-xs text-slate-100 outline-none focus:border-violet-500"
                    >
                      <option value="one-dark-pro">One Dark Pro</option>
                      <option value="dracula">Dracula</option>
                      <option value="github-dark">GitHub Dark</option>
                      <option value="github-light">GitHub Light</option>
                      <option value="monokai">Monokai</option>
                      <option value="vs-dark">VS Dark</option>
                      <option value="light">VS Light</option>
                    </select>
                  </div>
                </div>

                {/* ─── Premium Glassmorphic Stopwatch ─── */}
                <div className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs border backdrop-blur-sm transition-all duration-500",
                  isTimerRunning
                    ? "bg-gradient-to-r from-violet-900/40 to-purple-900/30 border-violet-500/30 shadow-[0_0_12px_-4px_rgba(139,92,246,0.5)]"
                    : "bg-[#1a1a2e]/80 border-slate-700/40"
                )}>
                  {/* Clock Icon */}
                  <svg
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 transition-colors duration-300",
                      isTimerRunning ? "text-violet-400" : "text-slate-500"
                    )}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
                  </svg>

                  {/* Time display */}
                  <span className={cn(
                    "font-mono font-bold tracking-widest tabular-nums transition-colors duration-300",
                    isTimerRunning ? "text-violet-300" : "text-slate-400"
                  )}>
                    {formatTime(time)}
                  </span>

                  {/* Divider */}
                  <div className="w-px h-4 bg-slate-700/60" />

                  {/* Timer controls */}
                  <div className="flex items-center gap-1">
                    {isTimerRunning ? (
                      <button
                        onClick={pauseTimer}
                        title="Pause Timer"
                        className="flex items-center justify-center w-5 h-5 rounded-md bg-violet-500/10 hover:bg-violet-500/25 text-violet-400 hover:text-violet-200 transition-all duration-150 active:scale-90"
                      >
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                          <rect x="5" y="4" width="4" height="16" rx="1" />
                          <rect x="15" y="4" width="4" height="16" rx="1" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        onClick={startTimer}
                        title="Start Timer"
                        className="flex items-center justify-center w-5 h-5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 hover:text-emerald-200 transition-all duration-150 active:scale-90"
                      >
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={resetTimer}
                      title="Reset Timer"
                      className="flex items-center justify-center w-5 h-5 rounded-md bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 hover:text-rose-200 transition-all duration-150 active:scale-90"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* ─── Action Controls ─── */}
                <div className="flex items-center gap-2">

                  {/* Run Code Button — glassmorphic green tint */}
                  <button
                    onClick={handleRunCode}
                    disabled={isExecuting || isSubmitting}
                    title="Run Code (Ctrl + ')"
                    className={cn(
                      "relative group flex items-center gap-1.5 px-3.5 h-8 rounded-xl text-xs font-bold border transition-all duration-200 select-none overflow-hidden",
                      isExecuting || isSubmitting
                        ? "cursor-not-allowed opacity-50 bg-[#1a1a2e] border-slate-700/40 text-slate-500"
                        : "bg-gradient-to-r from-emerald-900/30 to-teal-900/20 border-emerald-500/30 text-emerald-300 hover:from-emerald-900/50 hover:to-teal-900/40 hover:border-emerald-400/50 hover:text-emerald-200 hover:shadow-[0_0_14px_-4px_rgba(52,211,153,0.5)] active:scale-[0.97]"
                    )}
                  >
                    {/* Shimmer on hover */}
                    {!(isExecuting || isSubmitting) && (
                      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 ease-in-out pointer-events-none" />
                    )}
                    {isExecuting ? (
                      <>
                        <Spinner className="h-3 w-3 border-[2px] border-emerald-700/40 border-t-emerald-400" />
                        <span>Running…</span>
                      </>
                    ) : (
                      <>
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                        </svg>
                        <span>Run</span>

                      </>
                    )}
                  </button>

                  {/* Submit Button — glassmorphic violet */}
                  <button
                    onClick={handleSubmitCode}
                    disabled={isExecuting || isSubmitting}
                    title="Submit"
                    className={cn(
                      "relative group flex items-center gap-1.5 px-3.5 h-8 rounded-xl text-xs font-bold border transition-all duration-200 select-none overflow-hidden",
                      isExecuting || isSubmitting
                        ? "cursor-not-allowed opacity-50 bg-[#1a1a2e] border-slate-700/40 text-slate-500"
                        : "bg-gradient-to-r from-violet-700/40 to-purple-700/30 border-violet-500/40 text-violet-200 hover:from-violet-600/50 hover:to-purple-600/40 hover:border-violet-400/60 hover:text-white hover:shadow-[0_0_18px_-4px_rgba(139,92,246,0.65)] active:scale-[0.97]"
                    )}
                  >
                    {/* Shimmer on hover */}
                    {!(isExecuting || isSubmitting) && (
                      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 ease-in-out pointer-events-none" />
                    )}
                    {isSubmitting ? (
                      <>
                        <Spinner className="h-3 w-3 border-[2px] border-violet-700/40 border-t-violet-300" />
                        <span>Submitting…</span>
                      </>
                    ) : (
                      <>
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span>Submit</span>

                      </>
                    )}
                  </button>

                  {/* Fullscreen Toggle */}
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="flex items-center justify-center w-8 h-8 rounded-xl border border-slate-700/40 bg-[#1a1a2e]/80 hover:bg-[#20202d] text-slate-400 hover:text-slate-200 hover:border-slate-600/60 focus:outline-none transition-all duration-150 active:scale-90"
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    {isFullscreen ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3 3m12 6V4.5M15 9h4.5M15 9l6-6M9 15v4.5M9 15H4.5M9 15l-6 6m12-6v4.5M15 15h4.5M15 15l6 6" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Monaco Editor Component */}
              <div className="flex-1 w-full bg-[#1e1e1e]">
                <Editor
                  height="100%"
                  language={currentLanguageMonacoId}
                  value={editorCode}
                  theme={editorTheme}
                  onChange={(val) => setEditorCode(val || '')}
                  beforeMount={handleEditorWillMount}
                  onMount={handleEditorDidMount}
                  options={{
                    fontSize: 15,
                    tabSize: 4,
                    wordWrap: 'on',
                    minimap: { enabled: true },
                    lineNumbers: 'on',
                    bracketPairColorization: { enabled: true },
                    folding: true,
                    autoIndent: 'advanced',
                    renderLineHighlight: 'all',
                    automaticLayout: true,
                    fixedOverflowWidgets: true,
                  }}
                />
              </div>
            </div>

            {/* Height Draggable Split Resizer handle */}
            {!isFullscreen && (
              <div
                className={cn(
                  "h-[5px] cursor-row-resize hover:bg-violet-500/80 bg-slate-200 dark:bg-white/5 transition-colors shrink-0 w-full relative z-30",
                  isResizingHeight && "bg-violet-500"
                )}
                onMouseDown={handleMouseDownHeight}
              />
            )}

            {/* Bottom Console Drawer */}
            {!isFullscreen && (
              <div
                className="flex flex-col bg-[#14141e] border-t border-[#2d2d3a] text-slate-300 relative z-10 shrink-0 overflow-hidden"
                style={{ height: isConsoleCollapsed ? '32px' : `${consoleHeight}%` }}
              >
                {/* Console Drawer Header toolbar */}
                <div className="flex items-center justify-between px-4 py-1.5 bg-[#0f0f18] border-b border-[#2d2d3a] select-none shrink-0 text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setIsConsoleCollapsed(!isConsoleCollapsed)}
                      className="text-slate-400 hover:text-slate-200 font-bold p-0.5 rounded focus:outline-none"
                    >
                      {isConsoleCollapsed ? '▲' : '▼'}
                    </button>
                    <span className="font-bold tracking-wider uppercase text-slate-400">Console</span>
                  </div>

                  {!isConsoleCollapsed && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConsoleActiveTab('testcases')}
                        className={cn(
                          "px-2.5 py-1 rounded transition-colors font-semibold",
                          consoleActiveTab === 'testcases' ? "bg-[#20202d] text-violet-400 border border-violet-500/20" : "text-slate-400 hover:text-slate-200"
                        )}
                      >
                        Test Cases
                      </button>
                      {(submitResults || submitError || isSubmitting) && (
                        <button
                          onClick={() => setConsoleActiveTab('submission')}
                          className={cn(
                            "px-2.5 py-1 rounded transition-colors font-semibold",
                            consoleActiveTab === 'submission' ? "bg-[#20202d] text-violet-400 border border-violet-500/20" : "text-slate-400 hover:text-slate-200"
                          )}
                        >
                          Submission
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Console Drawer Content */}
                {!isConsoleCollapsed && (
                  <div className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed text-slate-300">

                    {consoleActiveTab === 'testcases' && (
                      <div className="space-y-4">
                        {isExecuting ? (
                          <div className="flex flex-col items-center justify-center py-8 gap-3">
                            <Spinner className="h-8 w-8 border-[3px] border-violet-500/20 border-t-violet-500" />
                            <p className="text-xs text-slate-400 font-sans">Compiling and running test cases...</p>
                          </div>
                        ) : runError ? (
                          <div className="p-4 bg-rose-950/20 border border-rose-500/20 rounded-xl text-rose-300 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-rose-500" />
                              <span className="font-bold text-xs uppercase tracking-wider">Execution Failed</span>
                            </div>
                            <pre className="font-mono text-xs whitespace-pre-wrap leading-relaxed select-text overflow-x-auto p-2 bg-black/40 rounded border border-[#2d2d3a]/30">{runError}</pre>
                          </div>
                        ) : runResults ? (
                          <div>
                            {/* Case Tabs */}
                            <div className="flex flex-wrap gap-2 border-b border-[#2d2d3a] pb-2 mb-4">
                              {runResults.map((result, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setSelectedResultCaseIdx(idx)}
                                  className={cn(
                                    "px-3 py-1.5 rounded text-xs font-bold border flex items-center gap-1.5 transition-all duration-200",
                                    selectedResultCaseIdx === idx
                                      ? "bg-[#20202d] text-violet-400 border-violet-500/40 shadow-sm"
                                      : "bg-[#0c0c14] text-slate-400 border-[#2d2d3a] hover:text-slate-200 hover:bg-[#0c0c14]/80"
                                  )}
                                >
                                  <span className={cn(
                                    "h-2 w-2 rounded-full",
                                    result.passed ? "bg-emerald-500 shadow-sm shadow-emerald-500/50" : "bg-rose-500 shadow-sm shadow-rose-500/50"
                                  )} />
                                  Case {idx + 1}
                                </button>
                              ))}
                            </div>

                            {/* Details of selected case */}
                            {runResults[selectedResultCaseIdx] && (() => {
                              const activeCase = runResults[selectedResultCaseIdx];
                              return (
                                <div className="space-y-3 p-4 bg-[#0c0c14] rounded-xl border border-[#2d2d3a] transition-all duration-300">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Case {selectedResultCaseIdx + 1} Details</span>
                                    <span className={cn(
                                      "px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider border",
                                      activeCase.passed
                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                    )}>
                                      {activeCase.status || (activeCase.passed ? "Accepted" : "Wrong Answer")}
                                    </span>
                                  </div>

                                  <div className="space-y-3 text-xs">
                                    <div>
                                      <span className="text-slate-500 font-sans font-semibold">Input:</span>
                                      <pre className="p-2.5 mt-1 rounded bg-black/40 text-slate-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap select-text border border-[#2d2d3a]/30">{activeCase.input}</pre>
                                    </div>
                                    <div>
                                      <span className="text-slate-500 font-sans font-semibold">Expected Output:</span>
                                      <pre className="p-2.5 mt-1 rounded bg-black/40 text-slate-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap select-text border border-[#2d2d3a]/30">{activeCase.expectedOutput}</pre>
                                    </div>
                                    <div>
                                      <span className="text-slate-500 font-sans font-semibold">Actual Output / Stdout:</span>
                                      <pre className={cn(
                                        "p-2.5 mt-1 rounded bg-black/40 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap select-text border border-[#2d2d3a]/30",
                                        activeCase.passed ? "text-emerald-400 border-emerald-500/10" : "text-rose-400 border-rose-500/10"
                                      )}>
                                        {activeCase.actualOutput || "(no output)"}
                                      </pre>
                                    </div>
                                    {!activeCase.passed && activeCase.error && (
                                      <div>
                                        <span className="text-rose-400 font-sans font-semibold">Error Details:</span>
                                        <pre className="p-2.5 mt-1 rounded bg-rose-950/20 text-rose-300 border border-rose-500/10 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap select-text">{activeCase.error}</pre>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        ) : (
                          <div>
                            <p className="text-[10px] text-slate-400 font-sans uppercase font-bold tracking-wider mb-2">Sample Test Cases Configured</p>
                            {sampleTestCasesList.length === 0 ? (
                              <p className="text-slate-500 font-sans">No sample test cases configured for this question.</p>
                            ) : (
                              <div className="grid gap-3 sm:grid-cols-2">
                                {sampleTestCasesList.map((tc, idx) => (
                                  <div key={tc.id || idx} className="p-3 bg-[#0c0c14] rounded-xl border border-[#2d2d3a] flex flex-col gap-1.5">
                                    <p className="text-[10px] text-violet-400 font-semibold uppercase">Case {idx + 1}</p>
                                    <div>
                                      <span className="text-slate-500 font-sans">Input:</span>
                                      <div className="p-1.5 mt-0.5 rounded bg-black/30 text-slate-300 font-mono text-[11px] truncate">{tc.input}</div>
                                    </div>
                                    <div>
                                      <span className="text-slate-500 font-sans">Expected output:</span>
                                      <div className="p-1.5 mt-0.5 rounded bg-black/30 text-slate-300 font-mono text-[11px] truncate">{tc.expectedOutput}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {consoleActiveTab === 'submission' && (
                      <div className="space-y-5 font-sans">
                        {isSubmitting ? (
                          <div className="flex flex-col items-center justify-center py-10 gap-3">
                            <Spinner className="h-9 w-9 border-[3px] border-violet-500/20 border-t-violet-500" />
                            <p className="text-xs text-slate-400 font-sans tracking-wide">Submitting solution & running hidden test cases...</p>
                          </div>
                        ) : submitError ? (
                          <div className="p-4 bg-rose-950/20 border border-rose-500/20 rounded-xl text-rose-300 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-rose-500" />
                              <span className="font-bold text-xs uppercase tracking-wider">Submission Failed</span>
                            </div>
                            <pre className="font-mono text-xs whitespace-pre-wrap leading-relaxed select-text overflow-x-auto p-2 bg-black/40 rounded border border-[#2d2d3a]/30">{submitError}</pre>
                          </div>
                        ) : submitResults ? (
                          <div className="space-y-5">
                            {/* Glowing verdict banner */}
                            <div className={cn(
                              "relative overflow-hidden p-5 rounded-2xl border transition-all duration-500 shadow-md",
                              submitResults.success
                                ? "bg-gradient-to-r from-emerald-950/30 to-teal-950/20 border-emerald-500/20 shadow-emerald-900/10"
                                : "bg-gradient-to-r from-rose-950/30 to-red-950/20 border-rose-500/20 shadow-rose-900/10"
                            )}>
                              {/* Glowing pulse background */}
                              <div className={cn(
                                "absolute -right-16 -top-16 w-36 h-36 rounded-full blur-3xl opacity-30 animate-pulse",
                                submitResults.success ? "bg-emerald-400" : "bg-rose-400"
                              )} />

                              <div className="flex items-center justify-between gap-4 relative z-10">
                                <div>
                                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Submission Verdict</p>
                                  <h3 className={cn(
                                    "text-2xl font-black tracking-wide uppercase mt-1.5 flex items-center gap-2",
                                    submitResults.success ? "text-emerald-400" : "text-rose-400"
                                  )}>
                                    <span>{submitResults.success ? '✓' : '✗'}</span>
                                    <span>{submitResults.status || (submitResults.success ? "Accepted" : "Wrong Answer")}</span>
                                  </h3>
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Tests Passed</p>
                                  <p className="text-lg font-black text-slate-100 mt-1">
                                    {submitResults.passedTestCases} / {submitResults.totalTestCases}
                                  </p>
                                </div>
                              </div>

                              {/* Progress bar */}
                              <div className="mt-4">
                                <div className="flex justify-between text-[10px] text-slate-400 mb-1.5 font-bold uppercase tracking-wider">
                                  <span>Suite progress</span>
                                  <span>{Math.round((submitResults.passedTestCases / (submitResults.totalTestCases || 1)) * 100)}%</span>
                                </div>
                                <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                                  <div
                                    className={cn(
                                      "h-full rounded-full transition-all duration-1000 ease-out",
                                      submitResults.success ? "bg-emerald-500" : "bg-rose-500"
                                    )}
                                    style={{ width: `${(submitResults.passedTestCases / (submitResults.totalTestCases || 1)) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Performance metrics grid */}
                            <div className="grid grid-cols-2 gap-4 font-mono">
                              <div className="p-4 bg-[#0c0c14] rounded-2xl border border-[#2d2d3a] flex flex-col gap-1.5 hover:border-violet-500/20 transition-all duration-300">
                                <div className="flex items-center gap-1.5 text-slate-400">
                                  <span className="text-xs">⚡</span>
                                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider">Runtime</span>
                                </div>
                                <span className="text-xl font-black text-violet-400">
                                  {submitResults.runtimeMs !== undefined ? `${submitResults.runtimeMs} ms` : "N/A"}
                                </span>
                              </div>
                              <div className="p-4 bg-[#0c0c14] rounded-2xl border border-[#2d2d3a] flex flex-col gap-1.5 hover:border-violet-500/20 transition-all duration-300">
                                <div className="flex items-center gap-1.5 text-slate-400">
                                  <span className="text-xs">🧠</span>
                                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider">Memory</span>
                                </div>
                                <span className="text-xl font-black text-violet-400">
                                  {submitResults.memoryMb !== undefined ? `${submitResults.memoryMb.toFixed(1)} MB` : "N/A"}
                                </span>
                              </div>
                            </div>

                            {/* Failure details card */}
                            {!submitResults.success && submitResults.failedTestCase && (
                              <div className="p-5 bg-[#0c0c14] rounded-2xl border border-[#2d2d3a]/80 space-y-4">
                                <div className="flex items-center gap-2 border-b border-[#2d2d3a] pb-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                  <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Failed Test Case Info</h4>
                                </div>
                                <div className="space-y-3 font-mono text-[11px]">
                                  <div>
                                    <span className="text-slate-500 font-sans font-semibold">Input:</span>
                                    <pre className="p-3 mt-1.5 rounded bg-black/40 text-slate-300 border border-white/[0.02] overflow-x-auto whitespace-pre-wrap select-text">{submitResults.failedTestCase.input}</pre>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 font-sans font-semibold">Expected Output:</span>
                                    <pre className="p-3 mt-1.5 rounded bg-black/40 text-slate-300 border border-white/[0.02] overflow-x-auto whitespace-pre-wrap select-text">{submitResults.failedTestCase.expectedOutput}</pre>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 font-sans font-semibold">Actual Output:</span>
                                    <pre className="p-3 mt-1.5 rounded bg-rose-950/20 text-rose-400 border border-rose-500/10 overflow-x-auto whitespace-pre-wrap select-text font-bold">{submitResults.failedTestCase.actualOutput || "(no output)"}</pre>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Back to Testcases helper */}
                            <div className="flex justify-end">
                              <button
                                onClick={() => setConsoleActiveTab('testcases')}
                                className="text-xs font-bold text-slate-400 hover:text-violet-400 transition-colors uppercase tracking-wider flex items-center gap-1"
                              >
                                <span>←</span>
                                <span>Back to Test Cases</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-6 text-slate-400 font-sans text-xs">
                            No submission history in this session.
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      )}
    </div>
  );
}

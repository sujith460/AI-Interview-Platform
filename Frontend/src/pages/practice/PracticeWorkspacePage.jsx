import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import Alert from '@/components/ui/alert/Alert';
import Button from '@/components/ui/button/Button';
import Spinner from '@/components/ui/spinner/Spinner';
import ThemeToggle from '@/components/common/ThemeToggle';
import { getQuestionDetails } from '@/services/practice/practiceService';
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
  const [editorTheme, setEditorTheme] = useState('one-dark-pro');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Cache of code written for each language
  // Keyed by language string (e.g., 'JAVA', 'PYTHON')
  const [codeCache, setCodeCache] = useState({});

  // Stopwatch states
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);

  // Console states
  const [consoleActiveTab, setConsoleActiveTab] = useState('testcases');
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Monaco Editor Ref
  const editorRef = useRef(null);

  // Fetch question details
  const fetchDetails = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getQuestionDetails(slug);
      setQuestion(data);

      // Populate language templates
      if (data.languageTemplates && data.languageTemplates.size > 0 || Array.from(data.languageTemplates || []).length > 0) {
        const templates = Array.from(data.languageTemplates);
        // Default to first template
        const defaultTemplate = templates[0];
        const defaultLang = defaultTemplate.language;
        setSelectedLanguage(defaultLang);
        
        // Build initial cache from localStorage or starter code
        const initialCache = {};
        templates.forEach((temp) => {
          const savedCode = localStorage.getItem(`practice_code_${slug}_${temp.language}`);
          initialCache[temp.language] = savedCode || temp.starterCode || '';
        });
        setCodeCache(initialCache);
        
        // Load initial code
        setEditorCode(initialCache[defaultLang] || '');
      }
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

  // Keyboard shortcuts (Ctrl + S to save, Ctrl + Enter to run)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveCodeLocally();
      }
      // Ctrl + Enter
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunCode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editorCode, selectedLanguage]);

  // Stopwatch controls
  const startTimer = () => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTime(0);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
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

  // Actions
  const saveCodeLocally = () => {
    if (slug && selectedLanguage) {
      localStorage.setItem(`practice_code_${slug}_${selectedLanguage}`, editorCode);
      setConsoleOutput(`[SYSTEM] Save Successful.\nSaved at: ${new Date().toLocaleTimeString()}\nLanguage: ${selectedLanguage}`);
      setConsoleActiveTab('output');
      setIsConsoleCollapsed(false);
    }
  };

  const handleLanguageChange = (newLang) => {
    if (selectedLanguage) {
      // Save current code to cache
      setCodeCache((prev) => ({
        ...prev,
        [selectedLanguage]: editorCode,
      }));
    }
    setSelectedLanguage(newLang);
    setEditorCode(codeCache[newLang] || '');
  };

  const handleRunCode = () => {
    if (isExecuting || isSubmitting) return;
    setIsExecuting(true);
    setIsConsoleCollapsed(false);
    setConsoleActiveTab('output');
    setConsoleOutput('[RUN] Initiating code validation...\n[RUN] Building dependency graph...\n[RUN] Compiling source code...');
    
    setTimeout(() => {
      setConsoleOutput(
        `[RUN] Compilation successful.\n\n` +
        `[INFO] Code Execution API is not implemented yet.\n` +
        `Below are the mock verification cases corresponding to your details configuration:\n\n` +
        JSON.stringify(Array.from(question.sampleTestCases || []), null, 2) +
        `\n\n[STATUS] Execution finished. (Mocked Output)`
      );
      setIsExecuting(false);
    }, 1500);
  };

  const handleSubmitCode = () => {
    if (isExecuting || isSubmitting) return;
    setIsSubmitting(true);
    setIsConsoleCollapsed(false);
    setConsoleActiveTab('output');
    setConsoleOutput('[SUBMIT] Registering submission in dashboard...\n[SUBMIT] Transferring code bundle to tester sandbox...');

    setTimeout(() => {
      setConsoleOutput(
        `[ERROR] Submission API not implemented.\n\n` +
        `Stopwatch is kept running so you can continue working on the challenge.\n` +
        `Elapsed solving time: ${formatTime(time)}`
      );
      setIsSubmitting(false);
    }, 1800);
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

  // Format templates safely
  const languageTemplatesList = useMemo(() => {
    if (!question || !question.languageTemplates) return [];
    return Array.from(question.languageTemplates);
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
                      <span>Frequency: {question.frequencyScore}%</span>
                    </>
                  )}
                </div>
              </div>

              {/* Tag sections */}
              <div className="flex flex-wrap gap-4 pt-1 border-t border-slate-200/50 dark:border-white/5">
                {question.companies && question.companies.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Target Companies</p>
                    <div className="flex flex-wrap gap-1">
                      {Array.from(question.companies).map((c) => (
                        <span key={c} className="rounded-lg bg-blue-500/5 dark:bg-blue-950/20 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:text-blue-300 border border-blue-500/10">
                          {c.charAt(0).toUpperCase() + c.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {question.patterns && question.patterns.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">DSA Patterns</p>
                    <div className="flex flex-wrap gap-1">
                      {Array.from(question.patterns).map((p) => (
                        <span key={p} className="rounded-lg bg-violet-500/5 dark:bg-violet-950/20 px-2.5 py-0.5 text-[10px] font-semibold text-violet-700 dark:text-violet-300 border border-violet-500/10">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Description Body */}
              <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans border-t border-slate-200/50 dark:border-white/5 pt-4">
                {question.description}
              </div>

              {/* Sample Examples */}
              {sampleTestCasesList.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Examples & Test Cases
                  </h3>
                  <div className="space-y-4">
                    {sampleTestCasesList.map((tc, index) => (
                      <div 
                        key={tc.id || index}
                        className="rounded-2xl border border-slate-200/60 bg-white/30 p-4 dark:border-white/5 dark:bg-white/[0.01]"
                      >
                        <p className="text-xs font-bold text-violet-600 dark:text-violet-400 mb-2.5">
                          Example {index + 1}
                        </p>
                        <div className="space-y-2 text-xs font-mono">
                          <div>
                            <span className="text-slate-400 font-sans">Input:</span>
                            <pre className="mt-1 p-2 rounded bg-slate-100 dark:bg-black/40 text-slate-800 dark:text-slate-200 overflow-x-auto">
                              {tc.input}
                            </pre>
                          </div>
                          <div>
                            <span className="text-slate-400 font-sans">Output:</span>
                            <pre className="mt-1 p-2 rounded bg-slate-100 dark:bg-black/40 text-slate-800 dark:text-slate-200 overflow-x-auto">
                              {tc.expectedOutput}
                            </pre>
                          </div>
                          {tc.explanation && (
                            <div className="pt-1.5 font-sans leading-relaxed text-slate-500 dark:text-slate-400">
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
                  <div className="rounded-xl border border-amber-500/10 bg-amber-500/[0.02] p-4 text-xs font-mono leading-relaxed text-slate-600 dark:text-slate-400">
                    <ul className="list-disc pl-4 space-y-1">
                      {question.constraints.split('\n').map((line, idx) => (
                        <li key={idx} className="marker:text-amber-500/60">{line}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

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
                  </div>

                  {/* Theme Selector */}
                  <div className="flex items-center gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Theme</label>
                    <select
                      value={editorTheme}
                      onChange={(e) => setEditorTheme(e.target.value)}
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

                {/* Stopwatch widget */}
                <div className="flex items-center gap-2 rounded-lg bg-[#20202d] px-3 py-1 text-xs border border-slate-700/60">
                  <span className="font-mono text-violet-400 font-semibold">{formatTime(time)}</span>
                  <div className="flex items-center gap-1.5 border-l border-slate-700/50 pl-2">
                    {isTimerRunning ? (
                      <button onClick={pauseTimer} title="Pause Timer" className="text-slate-400 hover:text-slate-200">
                        ⏸
                      </button>
                    ) : (
                      <button onClick={startTimer} title="Start Timer" className="text-emerald-400 hover:text-emerald-300">
                        ▶
                      </button>
                    )}
                    <button onClick={resetTimer} title="Reset Timer" className="text-rose-400 hover:text-rose-300">
                      ⟲
                    </button>
                  </div>
                </div>

                {/* Action controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-slate-700 hover:bg-[#20202d] text-slate-200"
                    onClick={handleRunCode}
                    disabled={isExecuting || isSubmitting}
                    isLoading={isExecuting}
                  >
                    {isExecuting ? 'Running...' : 'Run Code'}
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="h-8 bg-violet-600 hover:bg-violet-700 border-none text-white shadow-lg"
                    onClick={handleSubmitCode}
                    disabled={isExecuting || isSubmitting}
                    isLoading={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>

                  {/* Fullscreen Toggle */}
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-1 rounded hover:bg-[#20202d] text-slate-400 hover:text-slate-200 focus:outline-none"
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    {isFullscreen ? (
                      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3 3m12 6V4.5M15 9h4.5M15 9l6-6M9 15v4.5M9 15H4.5M9 15l-6 6m12-6v4.5M15 15h4.5M15 15l6 6" />
                      </svg>
                    ) : (
                      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
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
                      <button
                        onClick={() => setConsoleActiveTab('output')}
                        className={cn(
                          "px-2.5 py-1 rounded transition-colors font-semibold",
                          consoleActiveTab === 'output' ? "bg-[#20202d] text-violet-400 border border-violet-500/20" : "text-slate-400 hover:text-slate-200"
                        )}
                      >
                        Output
                      </button>
                      <button
                        onClick={() => setConsoleActiveTab('details')}
                        className={cn(
                          "px-2.5 py-1 rounded transition-colors font-semibold",
                          consoleActiveTab === 'details' ? "bg-[#20202d] text-violet-400 border border-violet-500/20" : "text-slate-400 hover:text-slate-200"
                        )}
                      >
                        Execution Details
                      </button>
                    </div>
                  )}
                </div>

                {/* Console Drawer Content */}
                {!isConsoleCollapsed && (
                  <div className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed text-slate-300">
                    
                    {consoleActiveTab === 'output' && (
                      <pre className="whitespace-pre-wrap font-mono select-text bg-[#0c0c14] p-3 rounded-lg min-h-[90%] border border-[#2d2d3a]/60">
                        {consoleOutput || '[INFO] System Idle. Run code or submit to inspect terminal logs.'}
                      </pre>
                    )}

                    {consoleActiveTab === 'testcases' && (
                      <div className="space-y-4">
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

                    {consoleActiveTab === 'details' && (
                      <div className="space-y-2 text-slate-400 font-sans">
                        <h4 className="text-xs font-semibold text-slate-200">Execution Backend Status</h4>
                        <p className="text-xs leading-relaxed">
                          The DSA practice coding workspace supports running arbitrary programming solutions in an isolated sandbox. 
                        </p>
                        <div className="mt-3 p-3 bg-[#0c0c14] rounded-lg border border-[#2d2d3a] font-mono text-[11px] text-violet-400 space-y-1">
                          <div>ENDPOINT: POST /api/questions/slug/{slug}/run</div>
                          <div>MOCK_SUBMIT: POST /api/questions/slug/{slug}/submit</div>
                          <div>STATUS: API NOT IMPLEMENTED</div>
                        </div>
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

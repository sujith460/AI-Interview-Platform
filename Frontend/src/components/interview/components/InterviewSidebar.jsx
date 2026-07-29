import { useState } from 'react';
import { cn } from '@/utils/helpers/cn';

/**
 * InterviewSidebar component:
 * - Candidate Feed Header with Mic/Camera status indicators
 * - Current Question Card (Title, Problem Description, Example Input/Output)
 * - Interview Info Metrics (Type, Difficulty, Stage)
 */
export default function InterviewSidebar({
  isCameraOn = true,
  isMicOn = true,
  interviewType = 'DSA',
  difficulty = 'MEDIUM',
  currentStage = 'Introduction',
  currentQuestion = 'Group Anagrams',
  questionDescription = 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
  exampleInput = '["eat","tea","tan","ate","nat","bat"]',
  exampleOutput = '[["bat"],["nat","tan"],["ate","eat","tea"]]',
  onToggleCamera,
  onToggleMic,
  className,
}) {

  return (
    <div
      className={cn(
        'flex flex-col h-full overflow-y-auto space-y-3.5 p-1 scrollbar-thin scrollbar-thumb-slate-800',
        className
      )}
    >
      {/* 1. Candidate Feed Card */}
      <div className="rounded-2xl border border-slate-800 bg-[#0f111a] p-4 shadow-xl backdrop-blur-md">
        {/* Header with Mic/Camera status */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-600/30 text-violet-400 font-bold text-xs">
              👤
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold text-white tracking-tight">
              Candidate Feed
            </h3>
          </div>

          <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-300">
            <button
              type="button"
              onClick={onToggleMic}
              className="flex items-center gap-1 hover:text-white transition-colors"
              title="Toggle Microphone"
            >
              <span className={cn('h-2 w-2 rounded-full', isMicOn ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500')} />
              <span>{isMicOn ? 'Mic On' : 'Mic Off'}</span>
            </button>

            <button
              type="button"
              onClick={onToggleCamera}
              className="flex items-center gap-1 hover:text-white transition-colors"
              title="Toggle Camera"
            >
              <span className={cn('h-2 w-2 rounded-full', isCameraOn ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500')} />
              <span>{isCameraOn ? 'Camera On' : 'Camera Off'}</span>
            </button>
          </div>
        </div>

        {/* Current Question Box */}
        <div className="rounded-xl border border-slate-800/80 bg-[#141727] p-3.5 space-y-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 block">
            Current Question
          </span>
          <h4 className="text-sm font-extrabold text-white tracking-tight">
            {currentQuestion || 'Group Anagrams'}
          </h4>
          <p className="text-xs leading-relaxed text-slate-300 font-sans">
            {questionDescription}
          </p>

          {(exampleInput || exampleOutput) && (
            <div className="rounded-lg bg-[#0b0c16] p-2.5 font-mono text-[11px] text-slate-300 border border-slate-800/60 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 font-sans block mb-1">Example:</span>
              <div><span className="text-violet-400">Input:</span> {exampleInput}</div>
              <div><span className="text-emerald-400">Output:</span> {exampleOutput}</div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Interview Info Metrics Card */}
      <div className="rounded-2xl border border-slate-800 bg-[#0f111a] p-3.5 shadow-xl backdrop-blur-md">
        <h4 className="text-xs font-extrabold text-white mb-3 tracking-tight">
          Interview Info
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {/* Type */}
          <div className="rounded-xl border border-slate-800/80 bg-[#141727] p-2.5">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Type
            </span>
            <span className="text-xs font-extrabold text-white">
              {interviewType}
            </span>
          </div>

          {/* Difficulty */}
          <div className="rounded-xl border border-slate-800/80 bg-[#141727] p-2.5">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Difficulty
            </span>
            <span
              className={cn(
                'text-xs font-extrabold',
                difficulty === 'EASY' && 'text-emerald-400',
                difficulty === 'MEDIUM' && 'text-amber-400',
                difficulty === 'HARD' && 'text-rose-400'
              )}
            >
              {difficulty}
            </span>
          </div>

          {/* Stage */}
          <div className="rounded-xl border border-slate-800/80 bg-[#141727] p-2.5">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Stage
            </span>
            <span className="text-xs font-extrabold text-violet-300 truncate block">
              {currentStage}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import {
  GitFork,
  Play,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Database,
  Search,
  Filter,
  Zap,
  BookOpenCheck,
  Sparkles,
} from 'lucide-react';
import type { ForwardChainingStep, StudentProfile, Examination } from '../expert-system/types.ts';
import { InferenceEngine } from '../expert-system/engine.ts';

interface ForwardChainingViewProps {
  profile: StudentProfile | null;
  exams: Examination[];
}

export const ForwardChainingView: React.FC<ForwardChainingViewProps> = ({
  profile,
  exams,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Generate steps using the real underlying inference engine
  const engine = new InferenceEngine();
  if (profile) {
    engine.loadFacts(profile, exams, 1);
  }
  const steps: ForwardChainingStep[] = engine.generateDemonstrationSteps();

  const currentStep = steps[currentStepIndex] || steps[0];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsRunning(false);
  };

  const handleStart = () => {
    setCurrentStepIndex(0);
    setIsRunning(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <GitFork className="w-4 h-4" />
            <span>Forward-Chaining Expert System Simulation</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Interactive Forward-Chaining Viva Demonstration
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Step through the deterministic data-driven inference cycle: Ground Facts &rarr; Working Memory &rarr; Pattern Matching &rarr; Conflict Resolution &rarr; Rule Firing &rarr; New Directives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStart}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-xs transition"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Start Inference</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 5-Step Process Pipeline Indicator */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          {steps.map((st, idx) => {
            const isCurrent = idx === currentStepIndex;
            const isPassed = idx < currentStepIndex;

            return (
              <button
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={`p-2.5 rounded-xl transition text-left sm:text-center ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-bold'
                    : isPassed
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="text-[10px] uppercase tracking-wider opacity-75">
                  Step {idx + 1}
                </div>
                <div className="text-xs font-semibold truncate mt-0.5">
                  {st.stepName.split(' ')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Panel */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono font-extrabold text-xs flex items-center justify-center">
                #{currentStep.stepNumber}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {currentStep.stepName}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {currentStep.description}
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 text-xs font-semibold transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
            <button
              onClick={handleNext}
              disabled={currentStepIndex === steps.length - 1}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 text-xs font-semibold transition shadow-xs"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* STEP 1: Working Memory State */}
        {currentStepIndex === 0 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-500" />
                <span>Working Memory Assertions ({currentStep.activeFacts.length} Facts)</span>
              </span>
              <span className="text-[11px] text-slate-400">Ground facts derived from inputs</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {currentStep.activeFacts.map((fact, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 truncate max-w-[150px]">
                      {fact.key}
                    </span>
                    <span
                      className={`text-[9px] font-semibold px-1.5 py-0.2 rounded uppercase ${
                        fact.source === 'subject'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                          : fact.source === 'profile'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                      }`}
                    >
                      {fact.source}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white truncate">
                    {fact.label}
                  </div>
                  <div className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold truncate">
                    Value: {String(fact.value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Pattern Matching & Evaluation */}
        {currentStepIndex === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Search className="w-4 h-4 text-indigo-500" />
                <span>Condition Pattern Matching against Working Memory</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Evaluating IF clauses of all 18 rules
              </span>
            </div>

            <div className="space-y-2">
              {currentStep.rulesBeingEvaluated.map((r, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                    r.matched
                      ? 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                        r.matched
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {r.ruleId}
                    </span>
                    <div>
                      <span className="font-bold">{r.ruleName}</span>
                      <p className="text-[11px] opacity-80 mt-0.5">{r.reason}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${
                      r.matched
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}
                  >
                    {r.matched ? 'Condition Satisfied' : 'Precondition Failed'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Conflict Resolution */}
        {currentStepIndex === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Filter className="w-4 h-4 text-indigo-500" />
                <span>Conflict Set & Priority Ordering</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Strategy: Strict Priority Ranking Descending
              </span>
            </div>

            <div className="space-y-2.5">
              {currentStep.conflictSet.map((cr, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                    idx === 0
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {cr.ruleId}
                    </span>
                    <span className="text-slate-900 dark:text-white font-medium">
                      {cr.ruleName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                      Priority Score: {cr.priority}
                    </span>
                    {idx === 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                        First in Firing Queue
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Rule Firing & Knowledge Deduction */}
        {currentStepIndex === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Executing THEN Actions & Deriving New Knowledge</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Updating conclusion base
              </span>
            </div>

            <div className="space-y-2">
              {currentStep.newDerivedConclusions.map((conclusion, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{conclusion}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Final Study Plan Synthesis */}
        {currentStepIndex === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Final Schedule & Advisory Directives Synthesized</span>
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Inference Complete
              </span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 space-y-2 text-xs">
              <p className="font-bold text-emerald-800 dark:text-emerald-300">
                Expert System Conclusions:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                {currentStep.newDerivedConclusions.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  ListOrdered,
  Info,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Clock,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { Subject, PriorityTier } from '../expert-system/types.ts';
import { rankSubjectsByPriority } from '../expert-system/priority.ts';

interface PriorityViewProps {
  subjects: Subject[];
}

export const PriorityView: React.FC<PriorityViewProps> = ({ subjects }) => {
  const [filterTier, setFilterTier] = useState<string>('all');
  const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>(null);

  const analyses = rankSubjectsByPriority(subjects);

  const filteredAnalyses = analyses.filter((a) => {
    if (filterTier === 'all') return true;
    return a.tier === filterTier;
  });

  const toggleExpand = (id: string) => {
    setExpandedSubjectId(expandedSubjectId === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <ListOrdered className="w-4 h-4" />
          <span>Deterministic Priority Calculation Engine</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Subject Priority & Academic Urgency Analysis
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          The priority score is a deterministic planning aid that balances preparation deficit, confidence ratings, syllabus progress, and impending examination proximity. It informs how study slots are allocated to prevent subject neglect.
        </p>

        {/* Disclaimer Note */}
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5 mt-3">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <span>
            <strong>Educational Planning Disclaimer:</strong> The priority score is strictly a resource-allocation aid for study timetable scheduling. It is <em>not</em> an algorithmic prediction of final examination marks or academic capability.
          </span>
        </div>
      </div>

      {/* Transparent Formula Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <span>Mathematical Scoring Formula Specification</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
            Formula v1.2
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
              1. Preparation Level (Max 30 pts)
            </span>
            <p className="text-slate-600 dark:text-slate-400 text-[11px]">
              Low = +30 pts <br />
              Medium = +15 pts <br />
              High = 0 pts
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
              2. Confidence Rating (Max 25 pts)
            </span>
            <p className="text-slate-600 dark:text-slate-400 text-[11px]">
              1/5 = +25 pts | 2/5 = +18 pts <br />
              3/5 = +10 pts | 4/5 = +4 pts <br />
              5/5 = 0 pts
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
              3. Syllabus Deficit (Max 25 pts)
            </span>
            <p className="text-slate-600 dark:text-slate-400 text-[11px]">
              &lt; 50% = +25 pts <br />
              50% - 74% = +15 pts <br />
              75% - 89% = +5 pts | &ge;90% = 0 pts
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
              4. Exam Proximity (Max 35 pts)
            </span>
            <p className="text-slate-600 dark:text-slate-400 text-[11px]">
              &le; 1 day = +35 pts | &le; 3 days = +30 pts <br />
              &le; 7 days = +22 pts | &le; 14 days = +12 pts <br />
              &gt; 14 days = +4 pts | Unknown = +5 pts
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
              5. Difficulty & Marks (Max 30 pts)
            </span>
            <p className="text-slate-600 dark:text-slate-400 text-[11px]">
              Difficult Subject Flag = +10 pts <br />
              Past Marks (only if given): &lt;40% = +20, 40-59% = +12. <strong>Missing marks = 0 pts (not zeroed).</strong>
            </p>
          </div>

          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex flex-col justify-center">
            <span className="font-bold text-indigo-700 dark:text-indigo-300 text-xs block mb-1">
              Tier Thresholds (Normalized 0-100)
            </span>
            <p className="text-[11px] text-slate-700 dark:text-slate-300">
              <strong className="text-rose-600 dark:text-rose-400">&ge; 60 pts:</strong> High Priority <br />
              <strong className="text-amber-600 dark:text-amber-400">35 - 59 pts:</strong> Medium Priority <br />
              <strong className="text-emerald-600 dark:text-emerald-400">&lt; 35 pts:</strong> Low Priority
            </p>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {['all', 'High Priority', 'Medium Priority', 'Low Priority'].map((tier) => (
            <button
              key={tier}
              onClick={() => setFilterTier(tier)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterTier === tier
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {tier === 'all' ? 'All Subjects' : tier}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-500">{filteredAnalyses.length} subject(s)</span>
      </div>

      {/* Ranked Subject Cards */}
      <div className="space-y-4">
        {filteredAnalyses.map((analysis, index) => {
          const isExpanded = expandedSubjectId === analysis.subjectId;
          const sub = subjects.find((s) => s.id === analysis.subjectId);

          return (
            <div
              key={analysis.subjectId}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono font-extrabold text-sm flex items-center justify-center text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {analysis.subjectName}
                      </h3>
                      {sub?.code && (
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {sub.code}
                        </span>
                      )}
                      {sub?.isDifficult && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300">
                          Difficult
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {analysis.daysToExam !== null
                        ? `Exam in ${analysis.daysToExam} day(s) (${sub?.examDate})`
                        : 'No exam date defined'}
                      {analysis.hasMissingMarks && ' • Missing marks omitted from penalty'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                          analysis.tier === 'High Priority'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                            : analysis.tier === 'Medium Priority'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                        }`}
                      >
                        {analysis.tier}
                      </span>
                      <span className="text-lg font-mono font-extrabold text-slate-900 dark:text-white">
                        {analysis.totalScore}
                        <span className="text-xs text-slate-400">/100</span>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpand(analysis.subjectId)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    aria-label="Expand score breakdown"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    analysis.tier === 'High Priority'
                      ? 'bg-gradient-to-r from-rose-500 to-red-600'
                      : analysis.tier === 'Medium Priority'
                      ? 'bg-gradient-to-r from-amber-400 to-amber-600'
                      : 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                  }`}
                  style={{ width: `${Math.max(8, analysis.totalScore)}%` }}
                />
              </div>

              {/* Natural Explanation & Recommendation */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                <div className="text-slate-700 dark:text-slate-300 font-medium">
                  <strong>Why this priority?</strong> {analysis.explanation}
                </div>
                <div className="text-indigo-700 dark:text-indigo-400 font-semibold">
                  <strong>Recommended Strategy:</strong> {analysis.recommendedAction}
                </div>
              </div>

              {/* Expanded Breakdown */}
              {isExpanded && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 animate-in fade-in duration-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Detailed Points Ledger:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {analysis.breakdown.map((item, bIdx) => (
                      <div
                        key={bIdx}
                        className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {item.factor}
                          </span>
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            +{item.points} / {item.maxPoints} pts
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                          {item.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

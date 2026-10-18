import React, { useState } from 'react';
import {
  AlarmClockCheck,
  Calendar,
  AlertCircle,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  Moon,
  Zap,
  Info,
  FileText,
  CheckSquare,
  Binary,
} from 'lucide-react';
import type { Examination, Subject, ExamFormatType } from '../expert-system/types.ts';
import { calculateDaysToExam } from '../expert-system/priority.ts';

interface ExamAdvisorViewProps {
  exams: Examination[];
  subjects: Subject[];
  onAddExam: (exam: Examination) => void;
  onDeleteExam: (examId: string) => void;
}

export const ExamAdvisorView: React.FC<ExamAdvisorViewProps> = ({
  exams,
  subjects,
  onAddExam,
  onDeleteExam,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubId, setNewSubId] = useState(subjects[0]?.id || '');
  const [newDate, setNewDate] = useState('');
  const [newFormat, setNewFormat] = useState<ExamFormatType>('Problem-Solving / Technical');
  const [newSyllabusRem, setNewSyllabusRem] = useState(50);
  const [newConf, setNewConf] = useState(3);
  const [newNotes, setNewNotes] = useState('');

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubId || !newDate) return;

    const sub = subjects.find((s) => s.id === newSubId);
    if (!sub) return;

    const newExam: Examination = {
      id: `exam_${Date.now()}`,
      subjectId: sub.id,
      subjectName: sub.name,
      examDate: newDate,
      examFormat: newFormat,
      syllabusRemaining: Math.min(100, Math.max(0, Number(newSyllabusRem))),
      confidenceLevel: Number(newConf),
      notes: newNotes,
    };

    onAddExam(newExam);
    setShowAddModal(false);
    setNewDate('');
    setNewNotes('');
  };

  const getStrategyByDaysAndFormat = (
    days: number,
    format: ExamFormatType = 'Problem-Solving / Technical',
    conf: number,
    remSyllabus: number
  ) => {
    // 1. Eve of exam (<= 1 day) - Rule R12
    if (days <= 1) {
      return {
        ruleId: 'R12',
        phase: 'Final 24-Hour Review Protocol',
        badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900',
        strategy: 'Cease all new exploratory reading immediately. Review 1-page formula summaries, error log notes, and ensure at least 7.5 hours of uninterrupted sleep tonight to facilitate neural memory consolidation.',
        icon: Moon,
      };
    }

    // 2. Format-specific strategies for <= 3 days:
    if (days <= 3) {
      if (format === 'Problem-Solving / Technical' || format === 'Mixed (Theory + Numericals)') {
        return {
          ruleId: 'R25 / R11',
          phase: 'Technical Problem-Solving Sprint (<= 3 Days)',
          badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900',
          strategy: 'Practice blank-sheet formula derivation drills and timed step-by-step numerical solving under pressure. Double check arithmetic and unit consistency.',
          icon: Zap,
        };
      }
      if (format === 'Multiple Choice (MCQ)') {
        return {
          ruleId: 'R24 / R11',
          phase: 'MCQ Elimination Speed Sprint (<= 3 Days)',
          badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900',
          strategy: 'Focus on rapid option elimination, common conceptual traps, and negative marking penalty management. Take timed 50-question mock tests.',
          icon: CheckSquare,
        };
      }
      return {
        ruleId: 'R11',
        phase: 'Critical 72-Hour Rapid Recall',
        badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900',
        strategy: 'Transition 80% of daily study slots to solving the last 3 years of University question papers under strict timer conditions.',
        icon: Zap,
      };
    }

    // 3. Format-specific strategies for <= 7 days:
    if (days <= 7) {
      if (format === 'Essay & Descriptive') {
        return {
          ruleId: 'R22 / R04',
          phase: 'Essay & Descriptive Structural Drill (<= 7 Days)',
          badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-900',
          strategy: 'Practice speed outline drafting, labeled block diagrams, and structured paragraph presentation for major recurring 10-mark questions.',
          icon: FileText,
        };
      }
      if (format === 'Problem-Solving / Technical') {
        return {
          ruleId: 'R21 / R04',
          phase: 'Technical Algorithm & Numerical Review (<= 7 Days)',
          badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900',
          strategy: 'Balance remaining high-yield chapters with cumulative numerical solving. Work through standard university question paper patterns.',
          icon: Binary,
        };
      }
      return {
        ruleId: 'R04',
        phase: 'Spaced Revision & High-Weightage Focus',
        badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900',
        strategy: 'Balance remaining high-yield chapters with cumulative revision. Solve at least 2 full solved numerical sets per unit and construct concise mind maps.',
        icon: AlarmClockCheck,
      };
    }

    // 4. General early strategies:
    if (format === 'Problem-Solving / Technical') {
      return {
        ruleId: 'R21',
        phase: 'Technical Foundation & Problem Sets',
        badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900',
        strategy: 'Shift study balance to 70% active problem solving and step-by-step numerical drills, minimizing passive theory reading.',
        icon: Binary,
      };
    }
    if (format === 'Multiple Choice (MCQ)') {
      return {
        ruleId: 'R23',
        phase: 'Objective Concept Boundary Review',
        badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900',
        strategy: 'Review concise summary tables comparing system properties, protocols, and time complexities to master fine conceptual boundaries.',
        icon: CheckSquare,
      };
    }

    return {
      ruleId: 'R17 / R03',
      phase: 'Foundational Syllabus Mass Building',
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900',
      strategy: 'Focus heavily on closing the remaining syllabus gap. Break down unfinished modules into daily 45-minute sprints and test understanding with textbook review problems.',
      icon: Calendar,
    };
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <AlarmClockCheck className="w-4 h-4" />
            <span>Format & Timeline-Driven Countdown Advisor</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Examination Preparation & Strategy Advisor
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Production rules adjust preparation tactics based on exam format (Technical, Essay, MCQ) and days remaining.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Examination</span>
        </button>
      </div>

      {/* Planning Aid Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-3">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <span>
          <strong>Academic Disclaimer:</strong> EduGuide AI recommendations are rule-based organizational planning aids designed to optimize preparation efficiency. The system cannot guarantee marks, grades, or examination success.
        </span>
      </div>

      {/* Add Exam Modal */}
      {showAddModal && (
        <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-200">
              Schedule Upcoming Examination
            </h3>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateExam} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                Subject *
              </label>
              <select
                value={newSubId}
                onChange={(e) => setNewSubId(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                Exam Format *
              </label>
              <select
                value={newFormat}
                onChange={(e) => setNewFormat(e.target.value as ExamFormatType)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
              >
                <option value="Problem-Solving / Technical">Problem-Solving / Technical (Rules R21, R25)</option>
                <option value="Essay & Descriptive">Essay & Descriptive (Rule R22)</option>
                <option value="Multiple Choice (MCQ)">Multiple Choice (MCQ) (Rules R23, R24)</option>
                <option value="Mixed (Theory + Numericals)">Mixed (Theory + Numericals)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                Exam Date *
              </label>
              <input
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                Syllabus Remaining (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={newSyllabusRem}
                onChange={(e) => setNewSyllabusRem(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                Confidence (1-5)
              </label>
              <select
                value={newConf}
                onChange={(e) => setNewConf(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="1">1 / 5 (Critical)</option>
                <option value="2">2 / 5 (Low)</option>
                <option value="3">3 / 5 (Moderate)</option>
                <option value="4">4 / 5 (Good)</option>
                <option value="5">5 / 5 (High)</option>
              </select>
            </div>

            <div className="lg:col-span-4">
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                Important Chapters / Topics Focus
              </label>
              <input
                type="text"
                placeholder="e.g. Unit 3 B+ Trees, Concurrency Control, SQL queries"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
              >
                Save Exam
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Exam Countdown Cards */}
      <div className="space-y-4">
        {exams.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <AlarmClockCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No upcoming examinations scheduled
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Add your examination dates to trigger stage and format-specific expert rules.
            </p>
          </div>
        ) : (
          exams.map((exam) => {
            const daysRemaining = calculateDaysToExam(exam.examDate) ?? 0;
            const format = exam.examFormat || 'Problem-Solving / Technical';
            const strategy = getStrategyByDaysAndFormat(
              daysRemaining,
              format,
              exam.confidenceLevel,
              exam.syllabusRemaining
            );
            const StrategyIcon = strategy.icon;

            return (
              <div
                key={exam.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold text-center border ${
                        daysRemaining <= 3
                          ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900'
                          : daysRemaining <= 7
                          ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900'
                      }`}
                    >
                      <span className="text-xl font-mono leading-none">{daysRemaining}</span>
                      <span className="text-[10px] uppercase font-semibold">
                        {daysRemaining === 1 ? 'day' : 'days'}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {exam.subjectName}
                        </h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {format}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${strategy.badgeColor}`}>
                          Rule {strategy.ruleId}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>Scheduled: {exam.examDate}</span>
                        <span>•</span>
                        <span>Remaining Syllabus: {exam.syllabusRemaining}%</span>
                        <span>•</span>
                        <span>Confidence: {exam.confidenceLevel}/5</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteExam(exam.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Remove examination"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Strategy Directive */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-400">
                    <StrategyIcon className="w-4 h-4" />
                    <span>{strategy.phase}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {strategy.strategy}
                  </p>
                </div>

                {exam.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    Focus chapters: "{exam.notes}"
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

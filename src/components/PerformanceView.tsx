import React from 'react';
import {
  BarChart3,
  Clock,
  CheckCircle2,
  Calendar,
  Flame,
  TrendingUp,
  Info,
  BookOpen,
} from 'lucide-react';
import type { StudySessionLog, StudyTask, Subject, Examination } from '../expert-system/types.ts';

interface PerformanceViewProps {
  sessions: StudySessionLog[];
  tasks: StudyTask[];
  subjects: Subject[];
  exams: Examination[];
}

export const PerformanceView: React.FC<PerformanceViewProps> = ({
  sessions,
  tasks,
  subjects,
  exams,
}) => {
  // Aggregate real recorded stats
  const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // Group study minutes by subject
  const subjectMinutesMap = new Map<string, number>();
  for (const s of sessions) {
    const current = subjectMinutesMap.get(s.subjectName) || 0;
    subjectMinutesMap.set(s.subjectName, current + s.durationMinutes);
  }

  // Active study streak calculation
  const uniqueDates = new Set(sessions.map((s) => s.startTime.split('T')[0]));
  const streak = uniqueDates.size;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <BarChart3 className="w-4 h-4" />
          <span>Verified Academic Analytics</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Academic Progress & Study Performance Dashboard
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          All metrics below are computed from your verified study sessions and task checklists.
        </p>
      </div>

      {/* 4 Stat Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Total Logged Hours</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalHours}h</div>
          <p className="text-[10px] text-slate-400 mt-1">{totalMinutes} actual minutes</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Task Completion Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{taskCompletionRate}%</div>
          <p className="text-[10px] text-slate-400 mt-1">
            {completedTasks} of {tasks.length} tasks done
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Study Consistency</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{streak} days</div>
          <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-semibold">Active study days</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Upcoming Exams</span>
            <Calendar className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{exams.length}</div>
          <p className="text-[10px] text-slate-400 mt-1">Scheduled papers</p>
        </div>
      </div>

      {/* Subject-Wise Time Allocation Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Subject-Wise Study Time Distribution
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Actual hours invested into each subject based on logged sessions
          </p>
        </div>

        {sessions.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No study sessions recorded yet. Start logging sessions in the Study Progress Tracker.
          </div>
        ) : (
          <div className="space-y-4">
            {Array.from(subjectMinutesMap.entries()).map(([subName, mins]) => {
              const pct = totalMinutes > 0 ? Math.round((mins / totalMinutes) * 100) : 0;
              const subHours = (mins / 60).toFixed(1);

              return (
                <div key={subName} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {subName}
                    </span>
                    <span className="font-mono text-slate-600 dark:text-slate-400">
                      {subHours} hrs ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-2.5 rounded-full bg-indigo-600 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Subject-Wise Syllabus Completion Progress */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Curriculum Syllabus Coverage by Subject
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Self-assessed completion percentage across enrolled courses
          </p>
        </div>

        <div className="space-y-4">
          {subjects.map((sub) => (
            <div key={sub.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {sub.name}
                </span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                  {sub.syllabusCompletion}%
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    sub.syllabusCompletion >= 80
                      ? 'bg-emerald-500'
                      : sub.syllabusCompletion >= 50
                      ? 'bg-indigo-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${sub.syllabusCompletion}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

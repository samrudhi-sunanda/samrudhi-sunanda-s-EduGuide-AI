import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Plus,
  Trash2,
  Calendar,
  Download,
  Filter,
  Check,
  Sparkles,
} from 'lucide-react';
import type { StudyTask, StudentProfile, TaskType } from '../expert-system/types.ts';
import { rescheduleMissedTasks } from '../expert-system/planner.ts';

interface PlannerViewProps {
  tasks: StudyTask[];
  deferredTasks: { subjectName: string; reason: string }[];
  profile: StudentProfile | null;
  onToggleTask: (taskId: string) => void;
  onUpdateTasks: (tasks: StudyTask[]) => void;
}

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const PlannerView: React.FC<PlannerViewProps> = ({
  tasks,
  deferredTasks,
  profile,
  onToggleTask,
  onUpdateTasks,
}) => {
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('weekly');
  const [showAddCustom, setShowAddCustom] = useState(false);

  // New task form
  const [customSubjectId, setCustomSubjectId] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [customStartTime, setCustomStartTime] = useState('09:00');
  const [customEndTime, setCustomEndTime] = useState('10:00');
  const [customType, setCustomType] = useState<TaskType>('Concept Study');
  const [customDay, setCustomDay] = useState(0);

  const missedTasks = tasks.filter((t) => !t.completed && t.dayIndex < activeDayIndex);

  const handleRescheduleMissed = () => {
    const missedIds = tasks.filter((t) => !t.completed).map((t) => t.id);
    const updated = rescheduleMissedTasks(tasks, missedIds);
    onUpdateTasks(updated);
  };

  const handleAddCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || profile.subjects.length === 0) return;

    const sub = profile.subjects.find((s) => s.id === customSubjectId) || profile.subjects[0];
    const sParts = customStartTime.split(':').map(Number);
    const eParts = customEndTime.split(':').map(Number);
    const durMins = Math.max(15, (eParts[0] * 60 + eParts[1]) - (sParts[0] * 60 + sParts[1]));

    const newTask: StudyTask = {
      id: `custom_task_${Date.now()}`,
      dayIndex: customDay,
      dayName: DAYS_OF_WEEK[customDay],
      dateStr: new Date().toISOString().split('T')[0],
      startTime: customStartTime,
      endTime: customEndTime,
      durationMinutes: durMins,
      subjectId: sub.id,
      subjectName: sub.name,
      topic: customTopic || 'Custom Self-Study & Problem Solving',
      type: customType,
      priority: 'Medium',
      completed: false,
    };

    onUpdateTasks([...tasks, newTask]);
    setShowAddCustom(false);
    setCustomTopic('');
  };

  const handleDeleteTask = (taskId: string) => {
    onUpdateTasks(tasks.filter((t) => t.id !== taskId));
  };

  const handleExportTimetable = () => {
    const lines = [
      `EduGuide AI - Personalized Study Timetable for ${profile?.name || 'Student'}`,
      `Course: ${profile?.course || 'Engineering'} | Daily Budget: ${profile?.availableHoursPerDay || 3} hrs`,
      '=========================================================================',
    ];

    for (let d = 0; d < 7; d++) {
      lines.push(`\n[${DAYS_OF_WEEK[d].toUpperCase()}]`);
      const dayTasks = tasks.filter((t) => t.dayIndex === d);
      if (dayTasks.length === 0) {
        lines.push('  No sessions scheduled.');
      } else {
        dayTasks.forEach((t) => {
          lines.push(`  • ${t.startTime} - ${t.endTime} (${t.durationMinutes}m) | [${t.subjectName}] ${t.topic} [${t.type}] ${t.completed ? '[DONE]' : '[PENDING]'}`);
        });
      }
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EduGuide_Study_Plan_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <CalendarDays className="w-4 h-4" />
            <span>Time-Budget-Constrained Generator</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Personalized Academic Study Timetable
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generates discrete, non-overlapping study blocks strictly respecting your {profile?.availableHoursPerDay || 3}h/day limit.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleRescheduleMissed}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold transition"
            title="Reschedule incomplete tasks to weekend buffer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reschedule Incomplete</span>
          </button>

          <button
            onClick={() => setShowAddCustom(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Slot</span>
          </button>

          <button
            onClick={handleExportTimetable}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Timetable</span>
          </button>
        </div>
      </div>

      {/* Deferred Tasks Alert (Explicit Constraint Requirement) */}
      {deferredTasks.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Study Time Constraint Alert: Tasks Deferred Under Rule R05</span>
          </div>
          <p className="text-[11px] text-amber-800 dark:text-amber-300">
            Because daily study availability is set to {profile?.availableHoursPerDay} hours, the engine protected higher-priority subjects and deferred the following non-critical sessions:
          </p>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-700 dark:text-amber-400">
            {deferredTasks.map((d, i) => (
              <li key={i}>
                <strong>{d.subjectName}:</strong> {d.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add Custom Slot Modal */}
      {showAddCustom && (
        <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-200">
              Add Custom Study Block
            </h3>
            <button
              onClick={() => setShowAddCustom(false)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleAddCustomTask} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">Day</label>
              <select
                value={customDay}
                onChange={(e) => setCustomDay(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                {DAYS_OF_WEEK.map((day, idx) => (
                  <option key={day} value={idx}>{day}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
              <select
                value={customSubjectId}
                onChange={(e) => setCustomSubjectId(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                {profile?.subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
              <input
                type="time"
                value={customStartTime}
                onChange={(e) => setCustomStartTime(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">End Time</label>
              <input
                type="time"
                value={customEndTime}
                onChange={(e) => setCustomEndTime(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">Session Type</label>
              <select
                value={customType}
                onChange={(e) => setCustomType(e.target.value as TaskType)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Concept Study">Concept Study</option>
                <option value="Practice Questions">Practice Questions</option>
                <option value="Active Recall & Revision">Active Recall & Revision</option>
                <option value="Mock Test & Analysis">Mock Test & Analysis</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
              >
                Insert Slot
              </button>
            </div>
          </form>
        </div>
      )}

      {/* View Mode Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Day Selectors */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {DAYS_OF_WEEK.map((day, idx) => {
            const count = tasks.filter((t) => t.dayIndex === idx).length;
            const completedCount = tasks.filter((t) => t.dayIndex === idx && t.completed).length;
            const isSelected = activeDayIndex === idx;

            return (
              <button
                key={day}
                onClick={() => {
                  setActiveDayIndex(idx);
                  setViewMode('daily');
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition flex items-center gap-2 ${
                  isSelected && viewMode === 'daily'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{day.substring(0, 3)}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected && viewMode === 'daily'
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {completedCount}/{count}
                </span>
              </button>
            );
          })}
        </div>

        {/* View Toggle */}
        <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-3 py-1 rounded-lg transition ${
              viewMode === 'daily'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Daily View
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-3 py-1 rounded-lg transition ${
              viewMode === 'weekly'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Weekly Grid
          </button>
        </div>
      </div>

      {/* Daily View Mode */}
      {viewMode === 'daily' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {DAYS_OF_WEEK[activeDayIndex]} Study Sessions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any session checkbox to toggle completion and track actual progress.
              </p>
            </div>
          </div>

          {tasks.filter((t) => t.dayIndex === activeDayIndex).length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No study tasks scheduled for {DAYS_OF_WEEK[activeDayIndex]}. Use "Add Slot" to create a custom study block.
            </div>
          ) : (
            <div className="space-y-3">
              {tasks
                .filter((t) => t.dayIndex === activeDayIndex)
                .map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      task.completed
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => onToggleTask(task.id)}
                        className={`mt-1 w-5 h-5 rounded-md flex items-center justify-center transition border ${
                          task.completed
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-indigo-500'
                        }`}
                        aria-label={`Toggle task completion`}
                      >
                        {task.completed && <Check className="w-3.5 h-3.5" />}
                      </button>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-sm font-bold ${
                              task.completed
                                ? 'line-through text-slate-400'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {task.subjectName}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                            {task.type}
                          </span>
                          {task.priority === 'High' && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                              High Priority
                            </span>
                          )}
                          {task.triggeredRuleId && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                              Rule {task.triggeredRuleId}
                            </span>
                          )}
                        </div>

                        <p
                          className={`text-xs mt-1 ${
                            task.completed
                              ? 'line-through text-slate-400'
                              : 'text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {task.topic}
                        </p>

                        {task.notes && (
                          <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                            {task.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                          {task.startTime} - {task.endTime}
                        </span>
                        <p className="text-[10px] text-slate-400">{task.durationMinutes} minutes</p>
                      </div>

                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                        title="Delete slot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Weekly Grid View Mode */}
      {viewMode === 'weekly' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
          {DAYS_OF_WEEK.map((day, dIdx) => {
            const dayTasks = tasks.filter((t) => t.dayIndex === dIdx);
            return (
              <div
                key={day}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      {day.substring(0, 3)}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {dayTasks.filter((t) => t.completed).length}/{dayTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {dayTasks.length === 0 ? (
                      <p className="text-[10px] text-slate-400 text-center py-4">No sessions</p>
                    ) : (
                      dayTasks.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => onToggleTask(t.id)}
                          className={`cursor-pointer p-2 rounded-xl text-left border transition text-xs ${
                            t.completed
                              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-slate-400'
                              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-0.5">
                            <span>{t.startTime}</span>
                            <span className="font-semibold">{t.durationMinutes}m</span>
                          </div>
                          <div
                            className={`font-bold text-xs truncate ${
                              t.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {t.subjectName}
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {t.topic}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 flex justify-between">
                  <span>Total Study</span>
                  <span className="font-mono font-semibold">
                    {dayTasks.reduce((acc, t) => acc + t.durationMinutes, 0)}m
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

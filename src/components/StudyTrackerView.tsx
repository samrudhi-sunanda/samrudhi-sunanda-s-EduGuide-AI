import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  BookOpen,
  Calendar,
  Star,
  CheckCircle2,
} from 'lucide-react';
import type { StudySessionLog, Subject } from '../expert-system/types.ts';

interface StudyTrackerViewProps {
  sessions: StudySessionLog[];
  subjects: Subject[];
  onAddSession: (session: StudySessionLog) => void;
  onDeleteSession: (sessionId: string) => void;
}

export const StudyTrackerView: React.FC<StudyTrackerViewProps> = ({
  sessions,
  subjects,
  onAddSession,
  onDeleteSession,
}) => {
  // Timer modes: 'pomodoro25', 'pomodoro50', 'stopwatch'
  const [timerMode, setTimerMode] = useState<'pomodoro25' | 'pomodoro50' | 'stopwatch'>('pomodoro25');
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [manualMinutes, setManualMinutes] = useState<number>(45);
  const [manualRating, setManualRating] = useState<number>(4);
  const [manualNotes, setManualNotes] = useState<string>('');
  const [showManualLog, setShowManualLog] = useState<boolean>(false);

  const timerRef = useRef<any>(null);

  // Switch timer presets
  const handleSelectMode = (mode: 'pomodoro25' | 'pomodoro50' | 'stopwatch') => {
    setIsRunning(false);
    setTimerMode(mode);
    if (mode === 'pomodoro25') setSecondsLeft(25 * 60);
    else if (mode === 'pomodoro50') setSecondsLeft(50 * 60);
    else setSecondsLeft(0);
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (timerMode === 'stopwatch') {
            return prev + 1;
          } else {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              setIsRunning(false);
              // Auto log when countdown finishes
              const durMins = timerMode === 'pomodoro25' ? 25 : 50;
              const sub = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
              if (sub) {
                onAddSession({
                  id: `sess_${Date.now()}`,
                  subjectId: sub.id,
                  subjectName: sub.name,
                  topic: currentTopic || `${timerMode === 'pomodoro25' ? '25' : '50'}m Pomodoro Focus Session`,
                  startTime: new Date(Date.now() - durMins * 60000).toISOString(),
                  endTime: new Date().toISOString(),
                  durationMinutes: durMins,
                  qualityRating: 5,
                  notes: 'Completed Pomodoro sprint timer.',
                });
              }
              return 0;
            }
            return prev - 1;
          }
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timerMode, selectedSubjectId, currentTopic, subjects, onAddSession]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (timerMode === 'pomodoro25') setSecondsLeft(25 * 60);
    else if (timerMode === 'pomodoro50') setSecondsLeft(50 * 60);
    else setSecondsLeft(0);
  };

  const handleFinishStopwatch = () => {
    if (secondsLeft < 60) return; // ignore less than 1 min
    const durMins = Math.round(secondsLeft / 60);
    const sub = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
    if (sub) {
      onAddSession({
        id: `sess_${Date.now()}`,
        subjectId: sub.id,
        subjectName: sub.name,
        topic: currentTopic || 'Stopwatch Study Session',
        startTime: new Date(Date.now() - durMins * 60000).toISOString(),
        endTime: new Date().toISOString(),
        durationMinutes: durMins,
        qualityRating: 4,
        notes: 'Logged via active study stopwatch.',
      });
    }
    resetTimer();
  };

  const handleManualLog = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
    if (!sub || manualMinutes <= 0) return;

    onAddSession({
      id: `sess_${Date.now()}`,
      subjectId: sub.id,
      subjectName: sub.name,
      topic: currentTopic || 'Manual Study Session',
      startTime: new Date(Date.now() - manualMinutes * 60000).toISOString(),
      endTime: new Date().toISOString(),
      durationMinutes: manualMinutes,
      qualityRating: manualRating,
      notes: manualNotes,
    });

    setCurrentTopic('');
    setManualNotes('');
    setShowManualLog(false);
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Stats computed strictly from real sessions
  const totalRecordedMins = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalHours = (totalRecordedMins / 60).toFixed(1);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Timer className="w-4 h-4" />
            <span>Actual Progress Verifier</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Study Session Tracker & Pomodoro Timer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            All progress metrics, streaks, and charts are calculated from verified recorded sessions (no synthetic data).
          </p>
        </div>

        <button
          onClick={() => setShowManualLog(!showManualLog)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showManualLog ? 'Hide Manual Form' : 'Log Past Session'}</span>
        </button>
      </div>

      {/* Timer Card */}
      <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center space-y-6">
        {/* Preset Selector */}
        <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
          <button
            onClick={() => handleSelectMode('pomodoro25')}
            className={`px-4 py-1.5 rounded-lg transition ${
              timerMode === 'pomodoro25'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            25m Pomodoro
          </button>
          <button
            onClick={() => handleSelectMode('pomodoro50')}
            className={`px-4 py-1.5 rounded-lg transition ${
              timerMode === 'pomodoro50'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            50m Deep Sprint
          </button>
          <button
            onClick={() => handleSelectMode('stopwatch')}
            className={`px-4 py-1.5 rounded-lg transition ${
              timerMode === 'stopwatch'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Free Stopwatch
          </button>
        </div>

        {/* Big Digital Clock Display */}
        <div className="py-2">
          <div className="text-6xl sm:text-7xl font-mono font-extrabold text-slate-900 dark:text-white tracking-tighter">
            {formatTimer(secondsLeft)}
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            {isRunning ? 'Session in progress...' : 'Ready to begin study session'}
          </p>
        </div>

        {/* Subject & Topic Selector */}
        <div className="max-w-md mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-500 mb-1 text-left">Subject</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-500 mb-1 text-left">Topic / Chapter</label>
            <input
              type="text"
              placeholder="e.g. B+ Tree node splitting"
              value={currentTopic}
              onChange={(e) => setCurrentTopic(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={toggleTimer}
            className={`px-8 py-3 rounded-xl font-bold text-sm text-white shadow-md transition flex items-center gap-2 ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/25'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/25'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'Pause Timer' : 'Start Session'}</span>
          </button>

          <button
            onClick={resetTimer}
            className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {timerMode === 'stopwatch' && isRunning && (
            <button
              onClick={handleFinishStopwatch}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition"
            >
              Finish & Log
            </button>
          )}
        </div>
      </div>

      {/* Manual Session Log Modal / Drawer */}
      {showManualLog && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Log Offline / Past Study Session
            </h3>
            <button
              onClick={() => setShowManualLog(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleManualLog} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Subject</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Topic Covered</label>
              <input
                type="text"
                required
                placeholder="e.g. Solved 5 NP-complete reductions"
                value={currentTopic}
                onChange={(e) => setCurrentTopic(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Duration (Minutes)</label>
              <input
                type="number"
                min="5"
                max="360"
                required
                value={manualMinutes}
                onChange={(e) => setManualMinutes(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Focus Rating (1 - 5)</label>
              <select
                value={manualRating}
                onChange={(e) => setManualRating(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
              >
                <option value="5">⭐⭐⭐⭐⭐ 5/5 High Focus</option>
                <option value="4">⭐⭐⭐⭐ 4/5 Good</option>
                <option value="3">⭐⭐⭐ 3/5 Moderate</option>
                <option value="2">⭐⭐ 2/5 Distracted</option>
                <option value="1">⭐ 1/5 Low Retention</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Session Notes (Optional)</label>
              <input
                type="text"
                placeholder="Key takeaways, formulas mastered, or doubts"
                value={manualNotes}
                onChange={(e) => setManualNotes(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
              >
                Save Session Log
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recorded Sessions History Log */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recorded Study Session History
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Total {sessions.length} sessions logged ({totalHours} study hours recorded)
            </p>
          </div>
        </div>

        {sessions.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No study sessions logged yet. Start the Pomodoro timer above or click "Log Past Session".
          </div>
        ) : (
          <div className="space-y-2.5">
            {sessions.map((sess) => (
              <div
                key={sess.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {sess.subjectName}
                      </span>
                      {sess.qualityRating && (
                        <span className="text-[10px] text-amber-500">
                          {'★'.repeat(sess.qualityRating)}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                      {sess.topic}
                    </p>
                    {sess.notes && (
                      <p className="text-[10px] text-slate-400 italic mt-0.5">
                        "{sess.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {sess.durationMinutes} mins
                    </span>
                    <p className="text-[10px] text-slate-400">
                      {sess.startTime ? sess.startTime.split('T')[0] : 'Today'}
                    </p>
                  </div>
                  <button
                    onClick={() => onDeleteSession(sess.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

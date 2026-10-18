import React from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Flame,
  Brain,
  ListOrdered,
  AlarmClockCheck,
  Timer,
  HelpCircle,
  GraduationCap,
  CalendarDays,
  Target,
  BookOpen,
} from 'lucide-react';
import type { StudentProfile, Examination, StudyTask, InferenceResult, StudySessionLog } from '../expert-system/types.ts';
import type { ActiveTab } from './Sidebar.tsx';
import { rankSubjectsByPriority } from '../expert-system/priority.ts';

interface DashboardViewProps {
  profile: StudentProfile | null;
  exams: Examination[];
  todayTasks: StudyTask[];
  inferenceResult: InferenceResult | null;
  sessions: StudySessionLog[];
  onToggleTask: (taskId: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
  onResetDemo: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  exams,
  todayTasks,
  inferenceResult,
  sessions,
  onToggleTask,
  setActiveTab,
  onResetDemo,
}) => {
  if (!profile || profile.subjects.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-800 shadow-sm">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Welcome to EduGuide AI
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8">
          A Rule-Based Artificial Intelligence Expert System designed to generate personalized study plans, prioritize difficult subjects, and guide exam preparation through deterministic forward chaining.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setActiveTab('profile')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/25 transition"
          >
            Create New Student Profile
          </button>
          <button
            onClick={onResetDemo}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm border border-slate-300 dark:border-slate-700 shadow-sm transition"
          >
            Load Third-Year Engineering Sample Data
          </button>
        </div>
      </div>
    );
  }

  // Calculate stats from actual recorded data
  const totalStudyMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalStudyHours = (totalStudyMinutes / 60).toFixed(1);
  const completedTodayCount = todayTasks.filter((t) => t.completed).length;

  // Study streak calculation
  const uniqueDates = new Set(
    sessions.map((s) => s.startTime.split('T')[0])
  );
  const studyStreak = uniqueDates.size > 0 ? uniqueDates.size : 1;

  // Top recommendation from inference engine
  const topRecommendation = inferenceResult?.recommendations[0];

  // Subject priority analysis
  const rankedSubjects = rankSubjectsByPriority(profile.subjects);

  // Sorted upcoming exams
  const sortedExams = [...exams]
    .map((e) => {
      const examDate = new Date(e.examDate);
      const today = new Date();
      const diffDays = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return { ...e, daysRemaining: diffDays };
    })
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-indigo-900/40 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-3">
            <Brain className="w-3.5 h-3.5 text-indigo-400" />
            <span>Forward-Chaining Expert System Active</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-2">
            Welcome back, {profile.name}! 👋
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            {profile.course} • {profile.academicYear} ({profile.semester}). Daily study allocation is set to{' '}
            <strong className="text-white font-semibold">{profile.availableHoursPerDay} hours/day</strong> in the{' '}
            <strong className="text-white font-semibold">{profile.preferredTimeSlot}</strong> window.
          </p>

          {/* Quick Goals pill */}
          {profile.personalGoals && (
            <div className="flex items-center gap-2 text-xs text-indigo-200/90 bg-indigo-900/30 px-3.5 py-2 rounded-xl border border-indigo-800/40">
              <Target className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Goal: {profile.personalGoals}</span>
            </div>
          )}
        </div>

        {/* Decorative corner glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Recommended Next Action Banner (Derived directly from Rule-Based Inference) */}
      {topRecommendation && (
        <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/20 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                  AI Recommended Next Action
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                  Triggered by Rule {topRecommendation.triggeredRuleIds?.join(', ')}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {topRecommendation.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                {topRecommendation.suggestedAction}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('explainable-ai')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 shadow-xs shrink-0 transition"
          >
            <span>View Rule Proof</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Tasks */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Today's Study Plan</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {completedTodayCount}/{todayTasks.length}
            </span>
            <span className="text-xs text-slate-500">completed</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${todayTasks.length > 0 ? (completedTodayCount / todayTasks.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Study Hours Recorded */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Recorded Hours</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{totalStudyHours}</span>
            <span className="text-xs text-slate-500">hrs logged</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            {sessions.length} actual verified session(s)
          </p>
        </div>

        {/* Active Study Streak */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Study Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{studyStreak}</span>
            <span className="text-xs text-slate-500">active day(s)</span>
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-2 font-medium">
            🔥 Consistent habit forming
          </p>
        </div>

        {/* Next Exam Proximity */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Upcoming Exam</span>
            <Calendar className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {sortedExams[0] ? `${sortedExams[0].daysRemaining}d` : 'None'}
            </span>
            <span className="text-xs text-slate-500">
              {sortedExams[0] ? sortedExams[0].subjectName.split(' ')[0] : 'scheduled'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 truncate">
            {sortedExams[0] ? `Date: ${sortedExams[0].examDate}` : 'Add dates in Exam Advisor'}
          </p>
        </div>
      </div>

      {/* Main Grid: Today's Tasks & Subject Preparation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Study Plan (2 Cols) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-indigo-600" />
                <span>Today's Personalized Timetable</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generated from expert system rules respecting your {profile.availableHoursPerDay}h budget
              </p>
            </div>
            <button
              onClick={() => setActiveTab('planner')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View Full Week</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {todayTasks.length === 0 ? (
            <div className="py-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No tasks scheduled for today. Check your weekly timetable in the Study Planner.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className={`cursor-pointer p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    task.completed
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-slate-500'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition border ${
                        task.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-indigo-500'
                      }`}
                      aria-label={`Mark ${task.topic} complete`}
                    >
                      {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold ${
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
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300">
                            High Priority
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
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {task.startTime} - {task.endTime}
                    </span>
                    <p className="text-[10px] text-slate-400">{task.durationMinutes} mins</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subject-Wise Preparation Status (1 Col) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span>Subject Prioritization</span>
            </h3>
            <button
              onClick={() => setActiveTab('priority')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Analyze
            </button>
          </div>

          <div className="space-y-3.5">
            {rankedSubjects.slice(0, 5).map((analysis) => {
              const sub = profile.subjects.find((s) => s.id === analysis.subjectId);
              return (
                <div key={analysis.subjectId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
                      {analysis.subjectName}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          analysis.tier === 'High Priority'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                            : analysis.tier === 'Medium Priority'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        }`}
                      >
                        {analysis.tier.replace(' Priority', '')}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                        {analysis.totalScore} pts
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        analysis.tier === 'High Priority'
                          ? 'bg-rose-500'
                          : analysis.tier === 'Medium Priority'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.max(10, analysis.totalScore)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                    <span>Prep: {sub?.preparationLevel || 'Medium'}</span>
                    <span>Syllabus: {sub?.syllabusCompletion || 0}%</span>
                    <span>Conf: {sub?.confidenceLevel || 3}/5</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 6 Quick-Access Action Buttons (Explicit Project Requirement) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Quick System Navigation
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Access the core expert system modules and viva demonstration tools
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. Create Study Plan */}
          <button
            onClick={() => setActiveTab('planner')}
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-800 text-left transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              1. Study Plan
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Daily & weekly schedule
            </p>
          </button>

          {/* 2. Analyze Academic Performance */}
          <button
            onClick={() => setActiveTab('priority')}
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-800 text-left transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <ListOrdered className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              2. Priority Math
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Subject scoring formula
            </p>
          </button>

          {/* 3. Add Examination */}
          <button
            onClick={() => setActiveTab('exams')}
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-800 text-left transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <AlarmClockCheck className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              3. Exam Advisor
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Timeline countdowns
            </p>
          </button>

          {/* 4. Track Study Session */}
          <button
            onClick={() => setActiveTab('tracker')}
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-800 text-left transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Timer className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              4. Study Timer
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Pomodoro & logs
            </p>
          </button>

          {/* 5. View AI Recommendations */}
          <button
            onClick={() => setActiveTab('explainable-ai')}
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-800 text-left transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              5. AI Proofs
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Rules & XAI reasoning
            </p>
          </button>

          {/* 6. Learn About Expert Systems */}
          <button
            onClick={() => setActiveTab('learning-center')}
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-800 text-left transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              6. Viva Theory
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              AI concepts & Q&A
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  Menu,
  Sun,
  Moon,
  Sparkles,
  RotateCcw,
  BookOpen,
  Calendar,
} from 'lucide-react';
import type { ActiveTab } from './Sidebar.tsx';
import type { StudentProfile } from '../expert-system/types.ts';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSidebar: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  profile: StudentProfile | null;
  onResetDemo: () => void;
  nextExamDays: number | null;
}

const TAB_TITLES: Record<ActiveTab, { title: string; subtitle: string }> = {
  dashboard: { title: 'Academic Planning Dashboard', subtitle: 'Overview of student readiness, today\'s plan & AI directives' },
  profile: { title: 'Student Academic Profile', subtitle: 'Onboarding data, course details, enrolled subjects & target goals' },
  priority: { title: 'Subject Priority Analyzer', subtitle: 'Deterministic priority scoring formula & educational mathematical weights' },
  planner: { title: 'Personalized Study Planner', subtitle: 'Daily timetable & weekly schedule respecting available hours with zero overlaps' },
  exams: { title: 'Examination Preparation Advisor', subtitle: 'Countdown timers, stage-specific strategies & high-yield revision protocols' },
  tracker: { title: 'Study Progress Tracker & Timer', subtitle: 'Pomodoro / stopwatch session logger with subject-wise analytics' },
  performance: { title: 'Academic Performance Analytics', subtitle: 'Recorded study hours, task completion metrics & syllabus tracking' },
  'explainable-ai': { title: 'Explainable AI (XAI) Panel', subtitle: 'Inspect working memory facts, fired rule IDs & natural deduction chains' },
  'forward-chaining': { title: 'Forward-Chaining Simulator', subtitle: 'Interactive 5-step expert system demonstration for college viva presentations' },
  'rule-explorer': { title: 'Knowledge Base Rule Explorer', subtitle: 'Searchable production rules catalog & real-time scenario sandbox' },
  'learning-center': { title: 'AI & Expert Systems Learning Center', subtitle: 'Symbolic AI fundamentals, Rule-Based vs ML comparison & viva cheat sheet' },
  'gemini-mentor': { title: 'Gemini AI Academic Mentor & Viva Coach', subtitle: 'Multi-turn neural advisor with viva simulator and reasoning modes' },
  about: { title: 'About Mini-Project & Architecture', subtitle: 'Project documentation, developer profiles & formal system architecture flow' },
};

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSidebar,
  isDark,
  toggleTheme,
  profile,
  onResetDemo,
  nextExamDays,
}) => {
  const currentTabInfo = TAB_TITLES[activeTab] || {
    title: 'EduGuide AI',
    subtitle: 'Rule-Based Academic Planning Expert System',
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{currentTabInfo.title}</span>
            {activeTab === 'forward-chaining' && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                Viva Ready
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            {currentTabInfo.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Next Exam Badge if applicable */}
        {nextExamDays !== null && nextExamDays >= 0 && (
          <div
            onClick={() => setActiveTab('exams')}
            className={`cursor-pointer hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              nextExamDays <= 3
                ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900'
                : nextExamDays <= 7
                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>
              Next Exam in {nextExamDays} day{nextExamDays === 1 ? '' : 's'}
            </span>
          </div>
        )}

        {/* Student Quick Pill */}
        {profile && (
          <div
            onClick={() => setActiveTab('profile')}
            className="cursor-pointer hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium transition"
            title="Edit student profile"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">{profile.name}</span>
            <span className="text-slate-400 dark:text-slate-500">|</span>
            <span className="text-slate-500 dark:text-slate-400">{profile.availableHoursPerDay}h/day</span>
          </div>
        )}

        {/* Quick Demo Reset Button */}
        <button
          onClick={onResetDemo}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 text-xs font-medium border border-slate-200 dark:border-slate-700 transition"
          title="Reset to Computer Engineering TE sample data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Load Sample</span>
        </button>

        {/* Quick Ask AI Mentor button */}
        <button
          onClick={() => setActiveTab('gemini-mentor')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-xs shadow-indigo-500/20 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Mentor</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Toggle theme mode"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
        </button>
      </div>
    </header>
  );
};

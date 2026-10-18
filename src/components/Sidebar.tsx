import React from 'react';
import {
  LayoutDashboard,
  UserCircle2,
  ListOrdered,
  CalendarDays,
  AlarmClockCheck,
  Timer,
  BarChart3,
  HelpCircle,
  GitFork,
  BookOpenCheck,
  GraduationCap,
  Sparkles,
  Info,
  Sun,
  Moon,
  RotateCcw,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'profile'
  | 'priority'
  | 'planner'
  | 'exams'
  | 'tracker'
  | 'performance'
  | 'explainable-ai'
  | 'forward-chaining'
  | 'rule-explorer'
  | 'learning-center'
  | 'gemini-mentor'
  | 'about';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDark: boolean;
  toggleTheme: () => void;
  onResetDemo: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  toggleTheme,
  onResetDemo,
  isOpen,
  setIsOpen,
}) => {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard, badge: '' },
    { id: 'profile' as ActiveTab, label: 'Student Profile', icon: UserCircle2, badge: '' },
    { id: 'priority' as ActiveTab, label: 'Subject Priority', icon: ListOrdered, badge: 'Formula' },
    { id: 'planner' as ActiveTab, label: 'Study Planner', icon: CalendarDays, badge: 'Timetable' },
    { id: 'exams' as ActiveTab, label: 'Exam Advisor', icon: AlarmClockCheck, badge: '' },
    { id: 'tracker' as ActiveTab, label: 'Study Timer & Log', icon: Timer, badge: 'Pomodoro' },
    { id: 'performance' as ActiveTab, label: 'Performance', icon: BarChart3, badge: '' },
    { id: 'explainable-ai' as ActiveTab, label: 'Explainable AI (XAI)', icon: HelpCircle, badge: 'Rules' },
    { id: 'forward-chaining' as ActiveTab, label: 'Forward Chaining Demo', icon: GitFork, badge: 'Viva Demo' },
    { id: 'rule-explorer' as ActiveTab, label: 'Rule Explorer', icon: BookOpenCheck, badge: '18 Rules' },
    { id: 'learning-center' as ActiveTab, label: 'AI Learning Center', icon: GraduationCap, badge: 'Theory' },
    { id: 'gemini-mentor' as ActiveTab, label: 'Gemini AI Mentor', icon: Sparkles, badge: 'AI Chat' },
    { id: 'about' as ActiveTab, label: 'About & Architecture', icon: Info, badge: '' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-72 bg-slate-900 text-slate-100 border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">EduGuide AI</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  ES-v1
                </span>
              </div>
              <p className="text-xs text-slate-400">Rule-Based Expert System</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>

        {/* Demo Preset Callout */}
        <div className="px-4 py-3 bg-indigo-950/40 border-b border-indigo-900/30">
          <div className="flex items-center justify-between text-xs">
            <span className="text-indigo-200 font-medium">Viva Demo Ready</span>
            <button
              onClick={onResetDemo}
              title="Load standard Third-Year Engineering sample student data"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition shadow-xs"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Load TE Demo</span>
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badge === 'Viva Demo'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : item.badge === 'AI Chat'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info & theme toggle */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/50 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Inference: Forward Chaining</span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              title="Toggle Light / Dark mode"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-300" />}
              <span>{isDark ? 'Light' : 'Dark'}</span>
            </button>
          </div>
          <div className="text-[11px] text-slate-500 leading-tight">
            Designed for Third-Year Computer Engineering AI Mini-Project & Viva
          </div>
        </div>
      </aside>
    </>
  );
};

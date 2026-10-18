/**
 * EduGuide AI - A Rule-Based Expert System for Personalized Student Academic Planning
 * Core Application Controller
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar, type ActiveTab } from './components/Sidebar.tsx';
import { Navbar } from './components/Navbar.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { ProfileView } from './components/ProfileView.tsx';
import { PriorityView } from './components/PriorityView.tsx';
import { PlannerView } from './components/PlannerView.tsx';
import { ExamAdvisorView } from './components/ExamAdvisorView.tsx';
import { StudyTrackerView } from './components/StudyTrackerView.tsx';
import { PerformanceView } from './components/PerformanceView.tsx';
import { ExplainableAiView } from './components/ExplainableAiView.tsx';
import { ForwardChainingView } from './components/ForwardChainingView.tsx';
import { RuleExplorerView } from './components/RuleExplorerView.tsx';
import { LearningCenterView } from './components/LearningCenterView.tsx';
import { GeminiMentorView } from './components/GeminiMentorView.tsx';
import { AboutProjectView } from './components/AboutProjectView.tsx';

import type {
  StudentProfile,
  Examination,
  StudyTask,
  StudySessionLog,
  InferenceResult,
} from './expert-system/types.ts';
import { InferenceEngine } from './expert-system/engine.ts';
import { generateWeeklyStudyPlan, getTodaysTasks } from './expert-system/planner.ts';
import { calculateDaysToExam } from './expert-system/priority.ts';
import {
  loadProfileFromStorage,
  saveProfileToStorage,
  loadExamsFromStorage,
  saveExamsToStorage,
  loadTasksFromStorage,
  saveTasksToStorage,
  loadSessionsFromStorage,
  saveSessionsToStorage,
  loadDeveloperInfo,
  saveDeveloperInfo,
  getSampleEngineeringProfile,
  type DeveloperInfo,
} from './expert-system/storage.ts';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('eduguide_theme_mode');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Navigation & UI state
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Application Data States
  const [profile, setProfile] = useState<StudentProfile | null>(() => {
    const saved = loadProfileFromStorage();
    if (saved) return saved;
    // Pre-populate with realistic Third-Year Computer Engineering Demo Data
    const demo = getSampleEngineeringProfile();
    saveProfileToStorage(demo.profile);
    return demo.profile;
  });

  const [exams, setExams] = useState<Examination[]>(() => {
    const saved = loadExamsFromStorage();
    if (saved && saved.length > 0) return saved;
    const demo = getSampleEngineeringProfile();
    saveExamsToStorage(demo.exams);
    return demo.exams;
  });

  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    const saved = loadTasksFromStorage();
    if (saved && saved.length > 0) return saved;
    if (profile) {
      const plan = generateWeeklyStudyPlan(profile);
      saveTasksToStorage(plan.weeklyTasks);
      return plan.weeklyTasks;
    }
    return [];
  });

  const [sessions, setSessions] = useState<StudySessionLog[]>(() => {
    const saved = loadSessionsFromStorage();
    if (saved && saved.length > 0) return saved;
    const demo = getSampleEngineeringProfile();
    saveSessionsToStorage(demo.sessions);
    return demo.sessions;
  });

  const [devInfo, setDevInfo] = useState<DeveloperInfo>(() => loadDeveloperInfo());

  // Apply dark mode class to html document
  useEffect(() => {
    try {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('eduguide_theme_mode', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('eduguide_theme_mode', 'light');
      }
    } catch (e) {
      console.error('Error saving theme:', e);
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Run Inference Engine whenever profile, exams, or incomplete sessions change
  const inferenceResult: InferenceResult | null = useMemo(() => {
    if (!profile) return null;
    const engine = new InferenceEngine();
    const missedCount = tasks.filter((t) => !t.completed).length;
    engine.loadFacts(profile, exams, missedCount);
    return engine.infer();
  }, [profile, exams, tasks]);

  // Today's tasks filtered from active weekly timetable
  const todayTasks = useMemo(() => {
    return getTodaysTasks(tasks);
  }, [tasks]);

  // Calculate upcoming exam proximity for Navbar badge
  const nextExamDays = useMemo(() => {
    if (!exams || exams.length === 0) return null;
    let minDays: number | null = null;
    for (const ex of exams) {
      const d = calculateDaysToExam(ex.examDate);
      if (d !== null && d >= 0) {
        if (minDays === null || d < minDays) {
          minDays = d;
        }
      }
    }
    return minDays;
  }, [exams]);

  // Handlers
  const handleSaveProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    saveProfileToStorage(newProfile);
    // Regenerate weekly study plan
    const { weeklyTasks } = generateWeeklyStudyPlan(newProfile);
    setTasks(weeklyTasks);
    saveTasksToStorage(weeklyTasks);
  };

  const handleAddExam = (newExam: Examination) => {
    const updated = [...exams, newExam];
    setExams(updated);
    saveExamsToStorage(updated);
  };

  const handleDeleteExam = (examId: string) => {
    const updated = exams.filter((e) => e.id !== examId);
    setExams(updated);
    saveExamsToStorage(updated);
  };

  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        return {
          ...t,
          completed: nextState,
          completedAt: nextState ? new Date().toISOString() : undefined,
        };
      }
      return t;
    });

    setTasks(updated);
    saveTasksToStorage(updated);

    // If marked complete, also automatically log session
    const target = updated.find((t) => t.id === taskId);
    if (target && target.completed) {
      const newSession: StudySessionLog = {
        id: `sess_auto_${Date.now()}`,
        subjectId: target.subjectId,
        subjectName: target.subjectName,
        topic: target.topic,
        startTime: new Date(Date.now() - target.durationMinutes * 60000).toISOString(),
        endTime: new Date().toISOString(),
        durationMinutes: target.durationMinutes,
        qualityRating: 5,
        notes: `Completed task on ${target.dayName}: ${target.type}`,
      };
      const updatedSessions = [newSession, ...sessions];
      setSessions(updatedSessions);
      saveSessionsToStorage(updatedSessions);
    }
  };

  const handleUpdateTasks = (newTasks: StudyTask[]) => {
    setTasks(newTasks);
    saveTasksToStorage(newTasks);
  };

  const handleAddSession = (newSession: StudySessionLog) => {
    const updated = [newSession, ...sessions];
    setSessions(updated);
    saveSessionsToStorage(updated);
  };

  const handleDeleteSession = (sessionId: string) => {
    const updated = sessions.filter((s) => s.id !== sessionId);
    setSessions(updated);
    saveSessionsToStorage(updated);
  };

  const handleSaveDevInfo = (info: DeveloperInfo) => {
    setDevInfo(info);
    saveDeveloperInfo(info);
  };

  // Reset demo data to clean Third-Year Engineering preset
  const handleResetDemo = () => {
    const demo = getSampleEngineeringProfile();
    setProfile(demo.profile);
    saveProfileToStorage(demo.profile);

    setExams(demo.exams);
    saveExamsToStorage(demo.exams);

    const { weeklyTasks } = generateWeeklyStudyPlan(demo.profile);
    setTasks(weeklyTasks);
    saveTasksToStorage(weeklyTasks);

    setSessions(demo.sessions);
    saveSessionsToStorage(demo.sessions);

    setActiveTab('dashboard');
  };

  // Deferred tasks list for the planner view
  const plannerSummary = useMemo(() => {
    if (!profile) return { deferredTasks: [] };
    const { deferredTasks } = generateWeeklyStudyPlan(profile);
    return { deferredTasks };
  }, [profile]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased flex flex-col transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onResetDemo={handleResetDemo}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-72">
        {/* Top Header Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          isDark={isDark}
          toggleTheme={toggleTheme}
          profile={profile}
          onResetDemo={handleResetDemo}
          nextExamDays={nextExamDays}
        />

        {/* Viewport Router Container */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              profile={profile}
              exams={exams}
              todayTasks={todayTasks}
              inferenceResult={inferenceResult}
              sessions={sessions}
              onToggleTask={handleToggleTask}
              setActiveTab={setActiveTab}
              onResetDemo={handleResetDemo}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              profile={profile}
              onSaveProfile={handleSaveProfile}
              onResetDemo={handleResetDemo}
            />
          )}

          {activeTab === 'priority' && (
            <PriorityView subjects={profile?.subjects || []} />
          )}

          {activeTab === 'planner' && (
            <PlannerView
              tasks={tasks}
              deferredTasks={plannerSummary.deferredTasks}
              profile={profile}
              onToggleTask={handleToggleTask}
              onUpdateTasks={handleUpdateTasks}
            />
          )}

          {activeTab === 'exams' && (
            <ExamAdvisorView
              exams={exams}
              subjects={profile?.subjects || []}
              onAddExam={handleAddExam}
              onDeleteExam={handleDeleteExam}
            />
          )}

          {activeTab === 'tracker' && (
            <StudyTrackerView
              sessions={sessions}
              subjects={profile?.subjects || []}
              onAddSession={handleAddSession}
              onDeleteSession={handleDeleteSession}
            />
          )}

          {activeTab === 'performance' && (
            <PerformanceView
              sessions={sessions}
              tasks={tasks}
              subjects={profile?.subjects || []}
              exams={exams}
            />
          )}

          {activeTab === 'explainable-ai' && (
            <ExplainableAiView inferenceResult={inferenceResult} />
          )}

          {activeTab === 'forward-chaining' && (
            <ForwardChainingView profile={profile} exams={exams} />
          )}

          {activeTab === 'rule-explorer' && <RuleExplorerView />}

          {activeTab === 'learning-center' && <LearningCenterView />}

          {activeTab === 'gemini-mentor' && (
            <GeminiMentorView profile={profile} />
          )}

          {activeTab === 'about' && (
            <AboutProjectView
              devInfo={devInfo}
              onSaveDevInfo={handleSaveDevInfo}
            />
          )}
        </main>
      </div>
    </div>
  );
}

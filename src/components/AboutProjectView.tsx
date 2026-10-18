import React, { useState } from 'react';
import {
  Info,
  UserCheck,
  Building,
  GraduationCap,
  Layers,
  ArrowDown,
  CheckCircle2,
  FileCode2,
  BookOpen,
  Edit2,
  Save,
  Shield,
  Sparkles,
} from 'lucide-react';
import type { DeveloperInfo } from '../expert-system/storage.ts';

interface AboutProjectViewProps {
  devInfo: DeveloperInfo;
  onSaveDevInfo: (info: DeveloperInfo) => void;
}

export const AboutProjectView: React.FC<AboutProjectViewProps> = ({
  devInfo,
  onSaveDevInfo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<DeveloperInfo>(devInfo);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveDevInfo(formData);
    setIsEditing(false);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Info className="w-4 h-4" />
            <span>Academic Mini-Project Documentation</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            EduGuide AI: Project Overview & System Architecture
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            A Rule-Based Expert System for Personalized Student Academic Planning (Third-Year Computer Engineering).
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold transition"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>{isEditing ? 'Cancel Edit' : 'Edit College & Developer Info'}</span>
        </button>
      </div>

      {savedFeedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Developer information updated successfully!</span>
        </div>
      )}

      {/* Editable Developer & Co-Developer Profile Cards */}
      {isEditing ? (
        <form onSubmit={handleSave} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-2">
            Edit Project Contributors & Institutional Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Developer Name</label>
              <input
                type="text"
                value={formData.developerName}
                onChange={(e) => setFormData({ ...formData, developerName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Developer Roll No / ID</label>
              <input
                type="text"
                value={formData.developerRoll || ''}
                onChange={(e) => setFormData({ ...formData, developerRoll: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Co-Developer Name</label>
              <input
                type="text"
                value={formData.coDeveloperName}
                onChange={(e) => setFormData({ ...formData, coDeveloperName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Co-Developer Roll No / ID</label>
              <input
                type="text"
                value={formData.coDeveloperRoll || ''}
                onChange={(e) => setFormData({ ...formData, coDeveloperRoll: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">College / University Name</label>
              <input
                type="text"
                value={formData.collegeName}
                onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-xs"
            >
              Save Details
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Developer Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
                👨‍💻
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Lead Developer
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {devInfo.developerName}
                </h3>
                {devInfo.developerRoll && (
                  <span className="text-xs font-mono text-slate-500">Roll: {devInfo.developerRoll}</span>
                )}
              </div>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1">
              <p><strong>Department:</strong> {devInfo.department}</p>
              <p><strong>Institution:</strong> {devInfo.collegeName}</p>
            </div>
          </div>

          {/* Co-Developer Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-lg">
                👩‍💻
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Co-Developer
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {devInfo.coDeveloperName}
                </h3>
                {devInfo.coDeveloperRoll && (
                  <span className="text-xs font-mono text-slate-500">Roll: {devInfo.coDeveloperRoll}</span>
                )}
              </div>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1">
              <p><strong>Department:</strong> {devInfo.department}</p>
              <p><strong>Institution:</strong> {devInfo.collegeName}</p>
            </div>
          </div>
        </div>
      )}

      {/* Formal System Architecture Flow Diagram */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>Formal Expert System Architecture Flowchart</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            A schematic breakdown of data collection, working memory, inference execution, and timetable synthesis
          </p>
        </div>

        {/* Visual Architecture Diagram */}
        <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
          {/* Layer 1: Student Input */}
          <div className="flex flex-col items-center">
            <div className="w-full sm:w-80 p-3 rounded-xl bg-indigo-600 text-white text-center shadow-md font-bold text-xs">
              Student User
              <p className="text-[10px] font-normal opacity-80">Profile, Subjects, Exam Dates & Available Hours</p>
            </div>
            <ArrowDown className="w-4 h-4 text-indigo-400 my-1" />
          </div>

          {/* Layer 2: Fact Collection & Working Memory */}
          <div className="flex flex-col items-center">
            <div className="w-full sm:w-96 p-3 rounded-xl bg-white dark:bg-slate-900 border-2 border-indigo-500 text-center shadow-xs">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block">
                Fact Collection & Working Memory
              </span>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Asserts dynamic ground facts (e.g. preparation, confidence, days to exam, difficulty)
              </p>
            </div>
            <ArrowDown className="w-4 h-4 text-indigo-400 my-1" />
          </div>

          {/* Layer 3: Inference Engine & Knowledge Base (Dual Box) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-center space-y-1">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 block">
                Knowledge Base (Production Rules)
              </span>
              <p className="text-[10px] text-slate-600 dark:text-slate-400">
                25 Executable IF–THEN Rules with static conflict resolution priority scores
              </p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-center space-y-1">
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300 block">
                Inference Engine
              </span>
              <p className="text-[10px] text-slate-600 dark:text-slate-400">
                Pattern Matching &rarr; Conflict Resolution (Priority Queue) &rarr; Rule Firing
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-4 h-4 text-indigo-400 my-1" />
          </div>

          {/* Layer 4: Recommendation Generator & Priority Math */}
          <div className="flex flex-col items-center">
            <div className="w-full sm:w-96 p-3 rounded-xl bg-white dark:bg-slate-900 border-2 border-purple-500 text-center shadow-xs">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 block">
                Priority Analyzer & Recommendation Generator
              </span>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Transparent math weights (High/Med/Low) + Explainable AI (XAI) traces
              </p>
            </div>
            <ArrowDown className="w-4 h-4 text-indigo-400 my-1" />
          </div>

          {/* Layer 5: Planner & Progress Tracking */}
          <div className="flex flex-col items-center">
            <div className="w-full sm:w-80 p-3 rounded-xl bg-emerald-600 text-white text-center shadow-md font-bold text-xs">
              Personalized Timetable & Pomodoro Tracker
              <p className="text-[10px] font-normal opacity-80">Zero overlaps, daily hour constraints & feedback loop</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mini-Project Scope & Limitations (Standard viva requirement) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Project Scope & Capabilities</span>
          </h4>
          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
            <li>Deterministic forward-chaining expert reasoning with 25 rules.</li>
            <li>Subject priority mathematical scoring with explicit difficulty flags.</li>
            <li>Personalized non-overlapping study timetable generation.</li>
            <li>Zero cloud server requirements (runs 100% offline in browser).</li>
            <li>Complete Explainable AI (XAI) transparent audit trails.</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-500" />
            <span>Limitations & Future Enhancements</span>
          </h4>
          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
            <li>Current rules use crisp boolean logic; future versions can incorporate Fuzzy Logic for confidence nuance.</li>
            <li>Local storage persistence is browser-dependent (export JSON provided).</li>
            <li>Does not predict marks; serves as an organizational planning aid.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

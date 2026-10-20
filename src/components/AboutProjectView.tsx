import React, { useState } from 'react';
import {
  Info,
  Users,
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
  Award,
  Code2,
  Brain,
  Calendar,
  Clock,
  Target,
  Check,
} from 'lucide-react';
import type { DeveloperInfo } from '../expert-system/storage.ts';

interface AboutProjectViewProps {
  devInfo: DeveloperInfo;
  onSaveDevInfo: (info: DeveloperInfo) => void;
}

interface TeamMember {
  id: string;
  name: string;
  role: 'Project Developer' | 'Co-Developer';
  initials: string;
  rollNumber: string;
  tagline: string;
  avatarGradient: string;
  badgeStyle: string;
  responsibilities: string[];
  keyModules: string[];
}

export const AboutProjectView: React.FC<AboutProjectViewProps> = ({
  devInfo,
  onSaveDevInfo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<DeveloperInfo>(devInfo);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [roleFilter, setRoleFilter] = useState<'all' | 'Project Developer' | 'Co-Developer'>('all');

  // Authoritative Team Members Specification
  const teamMembers: TeamMember[] = [
    {
      id: 'samruddhi-s',
      name: 'Samruddhi S',
      role: 'Project Developer',
      initials: 'SS',
      rollNumber: devInfo.developerRoll?.split('&')[0]?.trim() || 'BE-CS-041',
      tagline: 'Inference Engine, Knowledge Base & Explainable AI (XAI)',
      avatarGradient: 'from-indigo-600 via-indigo-700 to-purple-700',
      badgeStyle: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      responsibilities: [
        'Formulated authoritative Knowledge Base with 25 executable IF–THEN production rules (R01–R25).',
        'Engineered forward-chaining pattern matcher and conflict resolution priority queue.',
        'Designed transparent mathematical priority scoring formula with itemized ledger breakdowns.',
        'Implemented Explainable AI (XAI) deduction proof inspector and real-time conflict logs.',
      ],
      keyModules: ['Inference Engine', 'Forward Chaining', '25 Production Rules', 'XAI Audit Trail', 'Priority Math'],
    },
    {
      id: 'jay-k',
      name: 'Jay K',
      role: 'Project Developer',
      initials: 'JK',
      rollNumber: devInfo.developerRoll?.split('&')[1]?.trim() || 'BE-CS-042',
      tagline: 'Personalized Study Planner, Difficulty Rebalancing & Full-Stack Server',
      avatarGradient: 'from-blue-600 via-indigo-600 to-cyan-600',
      badgeStyle: 'bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      responsibilities: [
        'Developed zero-overlapping weekly timetable generator with circadian time slot templates.',
        'Implemented dynamic difficulty time rebalancing (+25% time for Difficult, compression for Easy).',
        'Built full-stack Express server API with Gemini AI Academic Mentor thinking mode proxy.',
        'Architected LocalStorage persistence engine with demo seeds and state reset handlers.',
      ],
      keyModules: ['Study Planner', 'Slot Generator', 'Difficulty Rebalancing', 'Express Backend', 'State Persistence'],
    },
    {
      id: 'pratiksha-k',
      name: 'Pratiksha K',
      role: 'Co-Developer',
      initials: 'PK',
      rollNumber: devInfo.coDeveloperRoll?.split('&')[0]?.trim() || 'BE-CS-043',
      tagline: 'UI/UX Architecture, Academic Dashboard & Exam Advisor Module',
      avatarGradient: 'from-purple-600 via-violet-600 to-pink-600',
      badgeStyle: 'bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      responsibilities: [
        'Crafted responsive academic dashboard UI with dark/light mode and accessible color contrast.',
        'Built Examination Advisor module with format-specific strategies (Technical, MCQ, Essay).',
        'Constructed interactive student profile onboarding workflow and subject editor.',
        'Developed the 5-step interactive forward-chaining simulation visualizer for viva demos.',
      ],
      keyModules: ['Dashboard UI', 'Exam Advisor', 'Forward Chaining Visualizer', 'Responsive Design', 'Onboarding Form'],
    },
    {
      id: 'akanksha-g',
      name: 'Akanksha G',
      role: 'Co-Developer',
      initials: 'AG',
      rollNumber: devInfo.coDeveloperRoll?.split('&')[1]?.trim() || 'BE-CS-044',
      tagline: 'Progress Analytics, Pomodoro Study Tracker & AI Learning Center',
      avatarGradient: 'from-emerald-600 via-teal-600 to-indigo-600',
      badgeStyle: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      responsibilities: [
        'Engineered Pomodoro study timer with active stopwatch and verified session logging.',
        'Implemented comprehensive performance analytics dashboard with weekly completion charts.',
        'Curated AI Learning Center educational guides, viva questions, and architecture proofs.',
        'Formulated third-year Computer Engineering demo presets for viva and college evaluation.',
      ],
      keyModules: ['Pomodoro Tracker', 'Performance Analytics', 'AI Learning Center', 'Viva Prep QA', 'Session Logging'],
    },
  ];

  const filteredMembers = teamMembers.filter((m) => {
    if (roleFilter === 'all') return true;
    return m.role === roleFilter;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveDevInfo(formData);
    setIsEditing(false);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Info className="w-4 h-4" />
            <span>Academic Mini-Project Documentation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            EduGuide AI: Project Overview & Engineering Team
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            A Rule-Based Expert System for Personalized Student Academic Planning submitted for Third-Year (TE) Computer Engineering Artificial Intelligence Mini-Project.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold transition shrink-0"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>{isEditing ? 'Cancel Edit' : 'Edit Institutional Info'}</span>
        </button>
      </div>

      {savedFeedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Institutional & developer information updated successfully!</span>
        </div>
      )}

      {/* Editable Institutional Details Form */}
      {isEditing && (
        <form onSubmit={handleSave} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-2">
            Edit Project Contributors & Institutional Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Project Developers</label>
              <input
                type="text"
                value={formData.developerName}
                onChange={(e) => setFormData({ ...formData, developerName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Project Developers Roll Nos</label>
              <input
                type="text"
                value={formData.developerRoll || ''}
                onChange={(e) => setFormData({ ...formData, developerRoll: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Co-Developers</label>
              <input
                type="text"
                value={formData.coDeveloperName}
                onChange={(e) => setFormData({ ...formData, coDeveloperName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Co-Developers Roll Nos</label>
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
      )}

      {/* ========================================================================= */}
      {/* MEET OUR TEAM SECTION */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Users className="w-4 h-4" />
              <span>Project Contributors</span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Meet Our Team
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              The engineers and researchers behind the EduGuide AI Rule-Based Expert System
            </p>
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            <button
              onClick={() => setRoleFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                roleFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Members (4)
            </button>
            <button
              onClick={() => setRoleFilter('Project Developer')}
              className={`px-3 py-1.5 rounded-lg transition ${
                roleFilter === 'Project Developer'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Project Developers (2)
            </button>
            <button
              onClick={() => setRoleFilter('Co-Developer')}
              className={`px-3 py-1.5 rounded-lg transition ${
                roleFilter === 'Co-Developer'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Co-Developers (2)
            </button>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-5 relative overflow-hidden group"
            >
              {/* Subtle accent top border bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${member.avatarGradient}`}
              />

              <div className="space-y-4">
                {/* Header row with Initials Avatar & Basic Info */}
                <div className="flex items-start gap-4">
                  {/* Initials Avatar */}
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.avatarGradient} text-white flex items-center justify-center font-extrabold text-lg shadow-md shrink-0 ring-2 ring-white dark:ring-slate-800`}
                  >
                    {member.initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                        {member.name}
                      </h4>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${member.badgeStyle}`}
                      >
                        {member.role}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                      <span>Roll: {member.rollNumber}</span>
                      <span>•</span>
                      <span>TE Computer Engg</span>
                    </div>

                    <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-1 leading-snug">
                      {member.tagline}
                    </p>
                  </div>
                </div>

                {/* Responsibilities List */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Core Engineering Responsibilities:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {member.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Module Tags */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Key Modules & Capabilities:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {member.keyModules.map((mod, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                    >
                      {mod}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Institutional & Supervision Summary Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/70 dark:from-slate-900 dark:via-slate-900/90 dark:to-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Academic Program
              </span>
              <p className="font-bold text-slate-900 dark:text-white">
                B.E. Computer Engineering
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Third Year (TE) • Semester VI
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Department & College
              </span>
              <p className="font-bold text-slate-900 dark:text-white">
                {formData.department}
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                {formData.collegeName}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Subject & Course Code
              </span>
              <p className="font-bold text-slate-900 dark:text-white">
                Artificial Intelligence & Expert Systems
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Course: Mini-Project (AI CS305)
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Project Guide / Faculty Mentor
              </span>
              <p className="font-bold text-slate-900 dark:text-white">
                {formData.guideProfessor}
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Academic Year {formData.academicYear}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SYSTEM ARCHITECTURE FLOWCHART */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>Formal Expert System Architecture Flowchart</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            A schematic breakdown of student data ingestion, working memory assertion, forward-chaining inference, and timetable synthesis
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
                Asserts dynamic ground facts (preparation, confidence, exam proximity, difficulty tag)
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
                25 Executable IF–THEN Rules with static conflict resolution priority scores (R01–R25)
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

      {/* Mini-Project Scope & Limitations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Project Scope & Capabilities</span>
          </h4>
          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
            <li>Deterministic forward-chaining expert reasoning with 25 production rules.</li>
            <li>Subject priority mathematical scoring with explicit difficulty flags (Difficult/Easy).</li>
            <li>Personalized non-overlapping study timetable generation with circadian preferences.</li>
            <li>Zero cloud server requirements (runs 100% offline in browser with LocalStorage).</li>
            <li>Complete Explainable AI (XAI) transparent audit trails and conflict resolution logs.</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-500" />
            <span>Viva Preparation & Architecture Notes</span>
          </h4>
          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
            <li>Strictly separates Knowledge Base (rules) from Inference Engine (matcher/resolver).</li>
            <li>Production rules use crisp conditions; conflict set resolved by static rule priority.</li>
            <li>Transparent planning aid: does not predict exam marks or replace faculty guidance.</li>
            <li>Includes Gemini 4 Argon thinking mode for simulated external viva examinations.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

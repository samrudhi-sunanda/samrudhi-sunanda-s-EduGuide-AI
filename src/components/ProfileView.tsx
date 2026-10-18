import React, { useState } from 'react';
import {
  UserCircle2,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Calendar,
  Clock,
  Target,
  Sparkles,
} from 'lucide-react';
import type { StudentProfile, Subject, PreparationLevel, PreferredTimeSlot, SubjectDifficulty } from '../expert-system/types.ts';

interface ProfileViewProps {
  profile: StudentProfile | null;
  onSaveProfile: (profile: StudentProfile) => void;
  onResetDemo: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onSaveProfile,
  onResetDemo,
}) => {
  const [formData, setFormData] = useState<StudentProfile>(
    profile || {
      name: '',
      course: 'B.E. Computer Engineering',
      academicYear: 'Third Year (TE)',
      semester: 'Semester VI',
      availableHoursPerDay: 3,
      preferredTimeSlot: 'Morning',
      preferredLearningMethod: 'Active Recall & Practice',
      personalGoals: 'Target SGPA > 9.0 and clear all core concepts',
      subjects: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );

  const [savedFeedback, setSavedFeedback] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New subject modal state
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubPrep, setNewSubPrep] = useState<PreparationLevel>('Medium');
  const [newSubConf, setNewSubConf] = useState(3);
  const [newSubSyllabus, setNewSubSyllabus] = useState(50);
  const [newSubMarks, setNewSubMarks] = useState<string>('');
  const [newSubExamDate, setNewSubExamDate] = useState('');
  const [newSubDiff, setNewSubDiff] = useState<SubjectDifficulty>('Moderate');

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) {
      setErrorMsg('Please enter a valid Subject Name');
      return;
    }

    const marksNum = newSubMarks.trim() !== '' ? Number(newSubMarks) : undefined;

    const newSubject: Subject = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: newSubName.trim(),
      code: newSubCode.trim() || undefined,
      preparationLevel: newSubPrep,
      confidenceLevel: Number(newSubConf),
      syllabusCompletion: Math.min(100, Math.max(0, Number(newSubSyllabus))),
      previousMarks: marksNum !== undefined && !isNaN(marksNum) ? marksNum : undefined,
      examDate: newSubExamDate || undefined,
      difficulty: newSubDiff,
      isDifficult: newSubDiff === 'Difficult',
    };

    setFormData((prev) => ({
      ...prev,
      subjects: [...prev.subjects, newSubject],
    }));

    // Reset form
    setNewSubName('');
    setNewSubCode('');
    setNewSubPrep('Medium');
    setNewSubConf(3);
    setNewSubSyllabus(50);
    setNewSubMarks('');
    setNewSubExamDate('');
    setNewSubDiff('Moderate');
    setShowAddSubject(false);
    setErrorMsg(null);
  };

  const handleDeleteSubject = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s.id !== id),
    }));
  };

  const handleSubjectChange = (id: string, field: keyof Subject, val: any) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) => (s.id === id ? { ...s, [field]: val } : s)),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Student Name / Nickname is required.');
      return;
    }
    if (formData.availableHoursPerDay <= 0 || isNaN(formData.availableHoursPerDay)) {
      setErrorMsg('Available study hours must be greater than 0.');
      return;
    }
    if (formData.subjects.length === 0) {
      setErrorMsg('Please add at least one subject to generate an academic plan.');
      return;
    }

    setErrorMsg(null);
    onSaveProfile(formData);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <UserCircle2 className="w-4 h-4" />
            <span>Academic Onboarding & Configuration</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Student Profile & Academic Assessment Form
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            These parameters form the core facts asserted into the Expert System's Working Memory.
          </p>
        </div>

        <button
          onClick={onResetDemo}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>Load Sample Student Profile</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {savedFeedback && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>Profile saved successfully! Inference Engine updated with new Working Memory facts.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-3">
            1. Student General Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Student Name / Nickname *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Samruddhi"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Course / Degree Program
              </label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                placeholder="e.g. B.E. Computer Engineering"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Academic Year
              </label>
              <select
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="First Year (FE)">First Year (FE)</option>
                <option value="Second Year (SE)">Second Year (SE)</option>
                <option value="Third Year (TE)">Third Year (TE)</option>
                <option value="Final Year (BE)">Final Year (BE)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Semester
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Semester V">Semester V</option>
                <option value="Semester VI">Semester VI</option>
                <option value="Semester VII">Semester VII</option>
                <option value="Semester VIII">Semester VIII</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>Available Study Time (Hours / Day) *</span>
                <span className="font-mono text-indigo-600 font-bold">{formData.availableHoursPerDay} hrs</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="12"
                required
                value={formData.availableHoursPerDay}
                onChange={(e) =>
                  setFormData({ ...formData, availableHoursPerDay: parseFloat(e.target.value) || 2 })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">Rule R05 triggers if &le; 2 hours.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Preferred Study Window
              </label>
              <select
                value={formData.preferredTimeSlot}
                onChange={(e) =>
                  setFormData({ ...formData, preferredTimeSlot: e.target.value as PreferredTimeSlot })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Morning">Morning (07:00 - 10:00)</option>
                <option value="Afternoon">Afternoon (14:00 - 17:00)</option>
                <option value="Evening">Evening (17:30 - 20:30)</option>
                <option value="Night">Night (20:00 - 23:30)</option>
              </select>
              <p className="text-[10px] text-slate-500 mt-1">Rules R15/R16 place hardest subjects accordingly.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Preferred Learning Methodology
              </label>
              <select
                value={formData.preferredLearningMethod}
                onChange={(e) => setFormData({ ...formData, preferredLearningMethod: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Active Recall & Practice">Active Recall & Problem Solving</option>
                <option value="Concept Outlines & Summary">Concept Outlines & Video Lectures</option>
                <option value="Pomodoro Intervals">50/10 Pomodoro Sprint Intervals</option>
                <option value="Past Paper Drills">Past Examination Paper Drills</option>
              </select>
              <p className="text-[10px] text-slate-500 mt-1">Rule R17 aligns study task compositions.</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Personal Academic Goals & Targets
            </label>
            <input
              type="text"
              value={formData.personalGoals}
              onChange={(e) => setFormData({ ...formData, personalGoals: e.target.value })}
              placeholder="e.g. Target SGPA > 9.0 and clear all concepts without backlogs"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Subjects Manager Section */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                2. Enrolled Subjects & Academic Readiness
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Currently tracking {formData.subjects.length} subject(s). Missing marks are strictly NOT penalized.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddSubject(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subject</span>
            </button>
          </div>

          {/* Add Subject Modal / Expansion */}
          {showAddSubject && (
            <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                  Add New Subject Module
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddSubject(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    value={newSubName}
                    onChange={(e) => setNewSubName(e.target.value)}
                    placeholder="e.g. Distributed Systems"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Course Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={newSubCode}
                    onChange={(e) => setNewSubCode(e.target.value)}
                    placeholder="e.g. CS306"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Preparation Level
                  </label>
                  <select
                    value={newSubPrep}
                    onChange={(e) => setNewSubPrep(e.target.value as PreparationLevel)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Low">Low (Needs foundational catch-up)</option>
                    <option value="Medium">Medium (Moderate confidence)</option>
                    <option value="High">High (Strong command)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Confidence Level (1 - 5)
                  </label>
                  <select
                    value={newSubConf}
                    onChange={(e) => setNewSubConf(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="1">1 - Very Low (High Anxiety)</option>
                    <option value="2">2 - Low (Hesitant)</option>
                    <option value="3">3 - Moderate</option>
                    <option value="4">4 - Good</option>
                    <option value="5">5 - Excellent (Confident)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Syllabus Completion (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newSubSyllabus}
                    onChange={(e) => setNewSubSyllabus(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Previous Marks % (Optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Leave empty if none"
                    value={newSubMarks}
                    onChange={(e) => setNewSubMarks(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Exam Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={newSubExamDate}
                    onChange={(e) => setNewSubExamDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Difficulty Classification
                  </label>
                  <select
                    value={newSubDiff}
                    onChange={(e) => setNewSubDiff(e.target.value as SubjectDifficulty)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Difficult">Difficult (Allocates extra study time via Rule R19)</option>
                    <option value="Moderate">Moderate (Standard time allocation)</option>
                    <option value="Easy">Easy (Compresses review time via Rule R20)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Save Subject
                </button>
              </div>
            </div>
          )}

          {/* Subjects Table / Card List */}
          <div className="space-y-3">
            {formData.subjects.map((sub, idx) => {
              const currentDiff = sub.difficulty || (sub.isDifficult ? 'Difficult' : 'Moderate');
              return (
              <div
                key={sub.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={sub.name}
                      onChange={(e) => handleSubjectChange(sub.id, 'name', e.target.value)}
                      className="font-bold text-sm bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-indigo-500 focus:outline-hidden text-slate-900 dark:text-white"
                    />
                    {sub.code && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                        {sub.code}
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        currentDiff === 'Difficult'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                          : currentDiff === 'Easy'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {currentDiff}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteSubject(sub.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition text-xs flex items-center gap-1"
                    title="Delete subject"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs pt-1">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Difficulty Tag</label>
                    <select
                      value={currentDiff}
                      onChange={(e) => {
                        const val = e.target.value as SubjectDifficulty;
                        handleSubjectChange(sub.id, 'difficulty', val);
                        handleSubjectChange(sub.id, 'isDifficult', val === 'Difficult');
                      }}
                      className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                    >
                      <option value="Difficult">Difficult (+Time)</option>
                      <option value="Moderate">Moderate (Standard)</option>
                      <option value="Easy">Easy (Compressed)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Preparation</label>
                    <select
                      value={sub.preparationLevel}
                      onChange={(e) =>
                        handleSubjectChange(sub.id, 'preparationLevel', e.target.value as PreparationLevel)
                      }
                      className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Confidence (1-5)</label>
                    <select
                      value={sub.confidenceLevel}
                      onChange={(e) => handleSubjectChange(sub.id, 'confidenceLevel', Number(e.target.value))}
                      className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    >
                      <option value="1">1 / 5 (Low)</option>
                      <option value="2">2 / 5</option>
                      <option value="3">3 / 5 (Avg)</option>
                      <option value="4">4 / 5</option>
                      <option value="5">5 / 5 (High)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Syllabus %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={sub.syllabusCompletion}
                      onChange={(e) =>
                        handleSubjectChange(
                          sub.id,
                          'syllabusCompletion',
                          Math.min(100, Math.max(0, Number(e.target.value)))
                        )
                      }
                      className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Past Marks %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Omitted"
                      value={sub.previousMarks !== undefined ? sub.previousMarks : ''}
                      onChange={(e) =>
                        handleSubjectChange(
                          sub.id,
                          'previousMarks',
                          e.target.value !== '' ? Number(e.target.value) : undefined
                        )
                      }
                      className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Exam Date</label>
                    <input
                      type="date"
                      value={sub.examDate || ''}
                      onChange={(e) => handleSubjectChange(sub.id, 'examDate', e.target.value || undefined)}
                      className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>

        {/* Action Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/25 transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Trigger Inference Engine</span>
          </button>
        </div>
      </form>
    </div>
  );
};

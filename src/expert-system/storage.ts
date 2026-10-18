/**
 * EduGuide AI - LocalStorage State Management & Demo Seeds
 * Provides persistent storage for student profiles, exams, study tasks,
 * study session logs, and viva demonstration presets.
 */

import type { StudentProfile, Examination, StudyTask, StudySessionLog } from './types.ts';

const STORAGE_KEYS = {
  PROFILE: 'eduguide_student_profile',
  EXAMS: 'eduguide_examinations',
  TASKS: 'eduguide_study_tasks',
  SESSIONS: 'eduguide_study_sessions',
  THEME: 'eduguide_theme_mode',
  DEV_INFO: 'eduguide_developer_info',
};

export interface DeveloperInfo {
  developerName: string;
  developerRoll?: string;
  coDeveloperName: string;
  coDeveloperRoll?: string;
  department: string;
  collegeName: string;
  academicYear: string;
  guideProfessor: string;
}

export const DEFAULT_DEVELOPER_INFO: DeveloperInfo = {
  developerName: 'Student Developer',
  developerRoll: 'BE-CS-042',
  coDeveloperName: 'Co-Developer Partner',
  coDeveloperRoll: 'BE-CS-043',
  department: 'Department of Computer Engineering',
  collegeName: 'College of Engineering & Technology',
  academicYear: '2025 - 2026',
  guideProfessor: 'Prof. Artificial Intelligence & Expert Systems',
};

// Realistic Third-Year Computer Engineering Demo Data
export function getSampleEngineeringProfile(): {
  profile: StudentProfile;
  exams: Examination[];
  initialTasks: StudyTask[];
  sessions: StudySessionLog[];
} {
  const now = new Date();
  const formatExamDate = (daysFromNow: number) => {
    const d = new Date(now);
    d.setDate(now.getDate() + daysFromNow);
    return d.toISOString().split('T')[0];
  };

  const profile: StudentProfile = {
    name: 'Samruddhi',
    course: 'B.E. Computer Engineering',
    academicYear: 'Third Year (TE)',
    semester: 'Semester VI',
    availableHoursPerDay: 3.5,
    preferredTimeSlot: 'Morning',
    preferredLearningMethod: 'Active Recall & Practice',
    personalGoals: 'Aiming for SGPA > 9.0 and comprehensive mastery of Core Systems',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subjects: [
      {
        id: 'sub-dbms',
        name: 'Database Management Systems',
        code: 'CS301',
        preparationLevel: 'Low',
        confidenceLevel: 2,
        syllabusCompletion: 42,
        previousMarks: undefined, // Missing marks test (strictly not penalized as 0)
        examDate: formatExamDate(5), // 5 days away
        difficulty: 'Difficult',
        isDifficult: true,
        creditHours: 4,
      },
      {
        id: 'sub-toc',
        name: 'Theory of Computation',
        code: 'CS302',
        preparationLevel: 'Low',
        confidenceLevel: 1,
        syllabusCompletion: 32,
        previousMarks: 48,
        examDate: formatExamDate(11), // 11 days away
        difficulty: 'Difficult',
        isDifficult: true,
        creditHours: 4,
      },
      {
        id: 'sub-os',
        name: 'Operating Systems',
        code: 'CS303',
        preparationLevel: 'Medium',
        confidenceLevel: 3,
        syllabusCompletion: 68,
        previousMarks: 65,
        examDate: formatExamDate(18), // 18 days away
        difficulty: 'Moderate',
        isDifficult: false,
        creditHours: 3,
      },
      {
        id: 'sub-cn',
        name: 'Computer Networks',
        code: 'CS304',
        preparationLevel: 'High',
        confidenceLevel: 4,
        syllabusCompletion: 84,
        previousMarks: 78,
        examDate: formatExamDate(26), // 26 days away
        difficulty: 'Moderate',
        isDifficult: false,
        creditHours: 3,
      },
      {
        id: 'sub-sepm',
        name: 'Software Engineering & Agile',
        code: 'CS305',
        preparationLevel: 'High',
        confidenceLevel: 5,
        syllabusCompletion: 92,
        previousMarks: 86,
        examDate: undefined, // Unknown date
        difficulty: 'Easy',
        isDifficult: false,
        creditHours: 3,
      },
    ],
  };

  const exams: Examination[] = [
    {
      id: 'exam-dbms',
      subjectId: 'sub-dbms',
      subjectName: 'Database Management Systems',
      examDate: formatExamDate(5),
      examFormat: 'Problem-Solving / Technical',
      syllabusRemaining: 58,
      confidenceLevel: 2,
      availablePrepHoursPerDay: 2,
      notes: 'Focus on Normalization, B+ Trees, Concurrency Control (2PL) & SQL queries',
    },
    {
      id: 'exam-toc',
      subjectId: 'sub-toc',
      subjectName: 'Theory of Computation',
      examDate: formatExamDate(11),
      examFormat: 'Problem-Solving / Technical',
      syllabusRemaining: 68,
      confidenceLevel: 1,
      availablePrepHoursPerDay: 1.5,
      notes: 'Pumping Lemma proofs, Turing Machine design, Chomsky Normal Form',
    },
    {
      id: 'exam-os',
      subjectId: 'sub-os',
      subjectName: 'Operating Systems',
      examDate: formatExamDate(18),
      examFormat: 'Mixed (Theory + Numericals)',
      syllabusRemaining: 32,
      confidenceLevel: 3,
      availablePrepHoursPerDay: 1,
      notes: 'Page Replacement algorithms, Banker Algorithm deadlock avoidance',
    },
  ];

  const sessions: StudySessionLog[] = [
    {
      id: 'sess-1',
      subjectId: 'sub-dbms',
      subjectName: 'Database Management Systems',
      topic: 'ER Diagrams and Relational Schema Conversion',
      startTime: new Date(Date.now() - 2 * 86400000).toISOString(),
      endTime: new Date(Date.now() - 2 * 86400000 + 50 * 60000).toISOString(),
      durationMinutes: 50,
      qualityRating: 4,
      notes: 'Solved 3 university ER model questions.',
    },
    {
      id: 'sess-2',
      subjectId: 'sub-os',
      subjectName: 'Operating Systems',
      topic: 'CPU Scheduling (Round Robin & SJF)',
      startTime: new Date(Date.now() - 1 * 86400000).toISOString(),
      endTime: new Date(Date.now() - 1 * 86400000 + 45 * 60000).toISOString(),
      durationMinutes: 45,
      qualityRating: 5,
      notes: 'Calculated average waiting times with Gantt charts.',
    },
    {
      id: 'sess-3',
      subjectId: 'sub-dbms',
      subjectName: 'Database Management Systems',
      topic: 'SQL Joins, Group By, Subqueries practice',
      startTime: new Date(Date.now() - 4 * 3600000).toISOString(),
      endTime: new Date(Date.now() - 3 * 3600000).toISOString(),
      durationMinutes: 60,
      qualityRating: 3,
      notes: 'Need more practice on correlated nested queries.',
    },
  ];

  return {
    profile,
    exams,
    initialTasks: [],
    sessions,
  };
}

export function loadProfileFromStorage(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading profile from storage:', e);
    return null;
  }
}

export function saveProfileToStorage(profile: StudentProfile): void {
  try {
    profile.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile to storage:', e);
  }
}

export function loadExamsFromStorage(): Examination[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXAMS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading exams:', e);
    return [];
  }
}

export function saveExamsToStorage(exams: Examination[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
  } catch (e) {
    console.error('Error saving exams:', e);
  }
}

export function loadTasksFromStorage(): StudyTask[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading tasks:', e);
    return [];
  }
}

export function saveTasksToStorage(tasks: StudyTask[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error('Error saving tasks:', e);
  }
}

export function loadSessionsFromStorage(): StudySessionLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading sessions:', e);
    return [];
  }
}

export function saveSessionsToStorage(sessions: StudySessionLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (e) {
    console.error('Error saving sessions:', e);
  }
}

export function loadDeveloperInfo(): DeveloperInfo {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DEV_INFO);
    if (!raw) return DEFAULT_DEVELOPER_INFO;
    return { ...DEFAULT_DEVELOPER_INFO, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_DEVELOPER_INFO;
  }
}

export function saveDeveloperInfo(info: DeveloperInfo): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DEV_INFO, JSON.stringify(info));
  } catch (e) {
    console.error('Error saving developer info:', e);
  }
}

export function clearAllStorageData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.EXAMS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
  } catch (e) {
    console.error('Error clearing data:', e);
  }
}

/**
 * EduGuide AI - Core Type Definitions for Rule-Based Expert System
 */

export type PreparationLevel = 'Low' | 'Medium' | 'High';
export type PreferredTimeSlot = 'Morning' | 'Afternoon' | 'Evening' | 'Night';
export type PriorityTier = 'High Priority' | 'Medium Priority' | 'Low Priority';
export type SubjectDifficulty = 'Easy' | 'Moderate' | 'Difficult';
export type ExamFormatType =
  | 'Problem-Solving / Technical'
  | 'Essay & Descriptive'
  | 'Multiple Choice (MCQ)'
  | 'Mixed (Theory + Numericals)';

export interface Subject {
  id: string;
  name: string;
  code?: string;
  preparationLevel: PreparationLevel;
  confidenceLevel: number; // 1 to 5
  syllabusCompletion: number; // 0 to 100
  previousMarks?: number; // Optional 0 to 100 (never treat undefined as 0)
  examDate?: string; // YYYY-MM-DD
  difficulty: SubjectDifficulty; // 'Easy' | 'Moderate' | 'Difficult'
  isDifficult?: boolean; // backwards compat flag
  creditHours?: number;
}

export interface StudentProfile {
  name: string;
  course: string; // e.g., 'B.E. Computer Engineering'
  academicYear: string; // e.g., 'Third Year (TE)'
  semester: string; // e.g., 'Semester VI'
  availableHoursPerDay: number; // e.g., 3.5
  preferredTimeSlot: PreferredTimeSlot;
  preferredLearningMethod: string; // e.g., 'Active Recall & Practice'
  personalGoals: string; // e.g., 'Target SGPA > 9.0 and clear all concepts'
  subjects: Subject[];
  createdAt: string;
  updatedAt: string;
}

export interface Examination {
  id: string;
  subjectId: string;
  subjectName: string;
  examDate: string; // YYYY-MM-DD
  examFormat: ExamFormatType; // Technical, Essay, MCQ, Mixed
  syllabusRemaining: number; // 0 to 100
  confidenceLevel: number; // 1 to 5
  availablePrepHoursPerDay?: number;
  notes?: string;
}

export interface WorkingMemoryFact {
  key: string;
  value: any;
  subjectId?: string;
  label: string;
  description: string;
  source: 'profile' | 'subject' | 'exam' | 'derived';
}

export type RuleCategory =
  | 'Preparation'
  | 'Confidence'
  | 'Syllabus'
  | 'Exam Proximity'
  | 'Exam Format Strategy'
  | 'Subject Difficulty'
  | 'Time Management'
  | 'Learning Strategy'
  | 'Session Rescheduling';

export interface ActionRecommendation {
  type: string;
  title: string;
  description: string;
  subjectId?: string;
  subjectName?: string;
  suggestedAction: string;
  urgency: 'High' | 'Medium' | 'Low';
}

export interface Rule {
  id: string;
  name: string;
  category: RuleCategory;
  priority: number; // 1 to 100 (higher means fired first in conflict resolution)
  conditionDescription: string;
  actionDescription: string;
  explanation: string;
  condition: (facts: Map<string, WorkingMemoryFact>) => boolean;
  execute: (facts: Map<string, WorkingMemoryFact>) => ActionRecommendation[];
}

export interface TriggeredRuleInfo {
  ruleId: string;
  ruleName: string;
  category: RuleCategory;
  priority: number;
  conditionDescription: string;
  actionDescription: string;
  explanation: string;
  satisfiedFacts: Array<{ label: string; value: string | number }>;
  recommendations: ActionRecommendation[];
}

export interface InferenceResult {
  facts: WorkingMemoryFact[];
  evaluatedRulesCount: number;
  firedRules: TriggeredRuleInfo[];
  recommendations: Array<
    ActionRecommendation & {
      triggeredRuleIds: string[];
      explanation: string;
      satisfiedConditions: string[];
      factsConsidered: Array<{ label: string; value: string | number }>;
    }
  >;
  conflictResolutionLog: string[];
  summaryMessage: string;
  timestamp: string;
}

export interface PriorityScoreBreakdown {
  factor: string;
  points: number;
  maxPoints: number;
  reason: string;
}

export interface SubjectPriorityAnalysis {
  subjectId: string;
  subjectName: string;
  totalScore: number;
  tier: PriorityTier;
  difficulty: SubjectDifficulty;
  breakdown: PriorityScoreBreakdown[];
  daysToExam: number | null;
  hasMissingMarks: boolean;
  explanation: string;
  recommendedAction: string;
}

export type TaskType =
  | 'Concept Study'
  | 'Practice Questions'
  | 'Active Recall & Revision'
  | 'Mock Test & Analysis'
  | 'Essay / Structure Writing'
  | 'MCQ Speed Drill'
  | 'Break';

export interface StudyTask {
  id: string;
  dayIndex: number; // 0=Mon ... 6=Sun
  dayName: string; // 'Monday', 'Tuesday', ...
  dateStr: string; // YYYY-MM-DD
  startTime: string; // e.g. "07:00"
  endTime: string; // e.g. "08:30"
  durationMinutes: number;
  subjectId: string;
  subjectName: string;
  topic: string;
  type: TaskType;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  completedAt?: string;
  actualDurationMinutes?: number;
  triggeredRuleId?: string;
  isDeferred?: boolean;
  notes?: string;
}

export interface StudySessionLog {
  id: string;
  subjectId: string;
  subjectName: string;
  topic: string;
  startTime: string; // ISO
  endTime: string; // ISO
  durationMinutes: number;
  qualityRating?: number; // 1-5
  notes?: string;
}

export interface ForwardChainingStep {
  stepNumber: number;
  stepName: string;
  description: string;
  activeFacts: WorkingMemoryFact[];
  rulesBeingEvaluated: {
    ruleId: string;
    ruleName: string;
    matched: boolean;
    reason: string;
  }[];
  conflictSet: {
    ruleId: string;
    ruleName: string;
    priority: number;
  }[];
  selectedRule?: {
    ruleId: string;
    ruleName: string;
    priority: number;
  };
  newDerivedConclusions: string[];
}

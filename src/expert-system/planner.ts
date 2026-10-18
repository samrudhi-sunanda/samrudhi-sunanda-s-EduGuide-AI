/**
 * EduGuide AI - Personalized Study Plan Generator
 * Generates daily and weekly study schedules respecting:
 * 1. Available daily hours limit (never overloads)
 * 2. Zero overlapping study blocks
 * 3. Subject priority rankings
 * 4. Breaks and cognitive intervals
 * 5. Preferred circadian time slots
 * 6. Explicit deferred tasks handling when time is constrained
 */

import type {
  StudentProfile,
  Subject,
  StudyTask,
  TaskType,
  PreferredTimeSlot,
} from './types.ts';
import { rankSubjectsByPriority } from './priority.ts';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

interface TimeSlotTemplate {
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

/**
 * Generates discrete non-overlapping time slot blocks based on preferred time slot
 * and available study hours.
 */
function generateDailySlotTemplates(
  availableHours: number,
  preferredSlot: PreferredTimeSlot
): { studySlots: TimeSlotTemplate[]; breakSlots: TimeSlotTemplate[] } {
  const totalStudyMinutes = Math.min(600, Math.max(30, Math.round(availableHours * 60)));

  // Choose base start hour based on circadian preference
  let startHour = 8; // default Morning
  let startMinute = 0;

  if (preferredSlot === 'Morning') {
    startHour = 7;
    startMinute = 0;
  } else if (preferredSlot === 'Afternoon') {
    startHour = 14;
    startMinute = 0;
  } else if (preferredSlot === 'Evening') {
    startHour = 17;
    startMinute = 30;
  } else if (preferredSlot === 'Night') {
    startHour = 20;
    startMinute = 0;
  }

  // Determine standard session length: 45 to 60 minutes
  let sessionLength = 50;
  if (totalStudyMinutes <= 90) {
    sessionLength = Math.floor(totalStudyMinutes / Math.max(1, Math.floor(totalStudyMinutes / 45)));
  } else if (totalStudyMinutes <= 180) {
    sessionLength = 45;
  } else {
    sessionLength = 60;
  }

  const breakLength = 10;
  const studySlots: TimeSlotTemplate[] = [];
  const breakSlots: TimeSlotTemplate[] = [];

  let minutesAllocated = 0;
  let currentHour = startHour;
  let currentMin = startMinute;

  while (minutesAllocated < totalStudyMinutes) {
    const thisSession = Math.min(sessionLength, totalStudyMinutes - minutesAllocated);
    if (thisSession < 25 && studySlots.length > 0) {
      // Add remainder to previous slot to prevent tiny 10-minute fragments
      const last = studySlots[studySlots.length - 1];
      last.durationMinutes += thisSession;
      const endTotal = currentHour * 60 + currentMin + thisSession;
      const endH = Math.floor(endTotal / 60) % 24;
      const endM = endTotal % 60;
      last.endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
      break;
    }

    const startTotal = currentHour * 60 + currentMin;
    const endTotal = startTotal + thisSession;
    const sH = Math.floor(startTotal / 60) % 24;
    const sM = startTotal % 60;
    const eH = Math.floor(endTotal / 60) % 24;
    const eM = endTotal % 60;

    studySlots.push({
      startTime: `${String(sH).padStart(2, '0')}:${String(sM).padStart(2, '0')}`,
      endTime: `${String(eH).padStart(2, '0')}:${String(eM).padStart(2, '0')}`,
      durationMinutes: thisSession,
    });

    minutesAllocated += thisSession;

    // Advance clock past study session
    currentHour = eH;
    currentMin = eM;

    // If more study minutes remain, insert break
    if (minutesAllocated < totalStudyMinutes) {
      const bStartTotal = currentHour * 60 + currentMin;
      const bEndTotal = bStartTotal + breakLength;
      const bsH = Math.floor(bStartTotal / 60) % 24;
      const bsM = bStartTotal % 60;
      const beH = Math.floor(bEndTotal / 60) % 24;
      const beM = bEndTotal % 60;

      breakSlots.push({
        startTime: `${String(bsH).padStart(2, '0')}:${String(bsM).padStart(2, '0')}`,
        endTime: `${String(beH).padStart(2, '0')}:${String(beM).padStart(2, '0')}`,
        durationMinutes: breakLength,
      });

      currentHour = beH;
      currentMin = beM;
    }
  }

  return { studySlots, breakSlots };
}

/**
 * Generate full 7-day weekly schedule based on prioritized subjects
 */
export function generateWeeklyStudyPlan(
  profile: StudentProfile,
  referenceDate: Date = new Date()
): {
  weeklyTasks: StudyTask[];
  deferredTasks: { subjectName: string; reason: string }[];
  dailyAllocatedMinutes: number;
} {
  if (!profile.subjects || profile.subjects.length === 0) {
    return { weeklyTasks: [], deferredTasks: [], dailyAllocatedMinutes: 0 };
  }

  // 1. Analyze priority for all subjects
  const rankedAnalyses = rankSubjectsByPriority(profile.subjects, referenceDate);
  const subjectMap = new Map<string, Subject>(profile.subjects.map((s) => [s.id, s]));

  // 2. Generate daily slot layout
  const { studySlots } = generateDailySlotTemplates(
    profile.availableHoursPerDay,
    profile.preferredTimeSlot
  );

  const dailyAllocatedMinutes = studySlots.reduce((acc, slot) => acc + slot.durationMinutes, 0);

  // 3. Subject topic generation based on subject state and difficulty tag
  const getSubjectTopic = (s: Subject, slotIndex: number, dayIndex: number): { topic: string; type: TaskType } => {
    const diff = s.difficulty || (s.isDifficult ? 'Difficult' : 'Moderate');

    if (diff === 'Difficult') {
      if (slotIndex === 0) {
        return { topic: 'Difficult Topic Deep-Dive: Core Lecture Breakdowns & Proofs', type: 'Concept Study' };
      }
      return { topic: 'Complex Problem-Solving: Solved Numericals & Algorithm Variations', type: 'Practice Questions' };
    }

    if (diff === 'Easy') {
      return { topic: 'Rapid Concept Recap & 30-Minute Maintenance Review', type: 'Active Recall & Revision' };
    }

    if (s.preparationLevel === 'Low') {
      if (slotIndex === 0) return { topic: 'Core Concept Lecture Notes & Summary Outline', type: 'Concept Study' };
      return { topic: 'Textbook Solved Numerical & Foundational Exercises', type: 'Practice Questions' };
    }
    if (s.confidenceLevel <= 2) {
      if (dayIndex % 2 === 0) return { topic: 'Active Recall & Key Formulas Flashcard Review', type: 'Active Recall & Revision' };
      return { topic: 'Graded Topic Practice Problems & Step Check', type: 'Practice Questions' };
    }
    if (s.syllabusCompletion >= 85) {
      if (dayIndex === 5 || dayIndex === 6) return { topic: 'Full Mock Test & Timed Paper Analysis', type: 'Mock Test & Analysis' };
      return { topic: 'Past Exam Question Drills & High-Yield Derivations', type: 'Practice Questions' };
    }
    return { topic: 'Curriculum Module Coverage & Solved Problem Sets', type: 'Concept Study' };
  };

  const weeklyTasks: StudyTask[] = [];
  const deferredSubjects = new Set<string>();

  // Determine current week's Monday date
  const now = new Date(referenceDate);
  const currentDayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday ...
  const distanceToMonday = (currentDayOfWeek + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - distanceToMonday);

  // Distribute subjects across 7 days
  // High-priority subjects get daily or frequent slots. Low priority subjects are scheduled rotationally.
  const slotsPerDay = studySlots.length;
  let subjectPointer = 0;

  for (let d = 0; d < 7; d++) {
    const dayName = DAYS_OF_WEEK[d];
    const taskDate = new Date(monday);
    taskDate.setDate(monday.getDate() + d);
    const dateStr = taskDate.toISOString().split('T')[0];

    // For each available study slot on this day
    for (let sIdx = 0; sIdx < slotsPerDay; sIdx++) {
      const slot = studySlots[sIdx];

      // Pick subject: prioritizes top ranked subjects
      let selectedSubjectAnalysis = rankedAnalyses[0];
      if (rankedAnalyses.length === 1) {
        selectedSubjectAnalysis = rankedAnalyses[0];
      } else if (rankedAnalyses.length === 2) {
        // Alternate between top 2
        selectedSubjectAnalysis = (sIdx + d) % 2 === 0 ? rankedAnalyses[0] : rankedAnalyses[1];
      } else {
        // High priority subject gets slot 0
        if (sIdx === 0) {
          selectedSubjectAnalysis = rankedAnalyses[0];
        } else if (sIdx === 1 && rankedAnalyses.length > 1) {
          selectedSubjectAnalysis = rankedAnalyses[1];
        } else {
          // Rotate remaining subjects
          const offset = (subjectPointer++) % (rankedAnalyses.length - 2);
          selectedSubjectAnalysis = rankedAnalyses[2 + offset] || rankedAnalyses[0];
        }
      }

      const originalSub = subjectMap.get(selectedSubjectAnalysis.subjectId)!;
      const { topic, type } = getSubjectTopic(originalSub, sIdx, d);

      const taskId = `task_${d}_${sIdx}_${originalSub.id}`;
      const subDiff = originalSub.difficulty || (originalSub.isDifficult ? 'Difficult' : 'Moderate');

      let triggeredRule = 'R18';
      if (subDiff === 'Difficult') {
        triggeredRule = 'R19';
      } else if (subDiff === 'Easy') {
        triggeredRule = 'R20';
      } else if (selectedSubjectAnalysis.tier === 'High Priority') {
        triggeredRule = 'R01';
      }

      weeklyTasks.push({
        id: taskId,
        dayIndex: d,
        dayName,
        dateStr,
        startTime: slot.startTime,
        endTime: slot.endTime,
        durationMinutes: slot.durationMinutes,
        subjectId: originalSub.id,
        subjectName: originalSub.name,
        topic,
        type,
        priority: selectedSubjectAnalysis.tier === 'High Priority' ? 'High' : selectedSubjectAnalysis.tier === 'Medium Priority' ? 'Medium' : 'Low',
        completed: false,
        triggeredRuleId: triggeredRule,
        isDeferred: false,
      });
    }
  }

  // Check if any subject was squeezed out due to extreme time constraints (e.g. available study hours <= 1.5h and 4+ subjects)
  const scheduledSubjectIds = new Set(weeklyTasks.map((t) => t.subjectId));
  const deferredTasks: { subjectName: string; reason: string }[] = [];

  for (const analysis of rankedAnalyses) {
    if (!scheduledSubjectIds.has(analysis.subjectId)) {
      deferredTasks.push({
        subjectName: analysis.subjectName,
        reason: `Deferred under Rule R05 (Limited Daily Study Budget). With only ${profile.availableHoursPerDay}h/day, higher priority subjects (${rankedAnalyses
          .slice(0, 2)
          .map((a) => a.subjectName)
          .join(', ')}) were prioritized to guarantee baseline pass readiness.`,
      });
    }
  }

  return {
    weeklyTasks,
    deferredTasks,
    dailyAllocatedMinutes,
  };
}

/**
 * Filter today's tasks from the weekly schedule
 */
export function getTodaysTasks(weeklyTasks: StudyTask[], referenceDate: Date = new Date()): StudyTask[] {
  const currentDayOfWeek = referenceDate.getDay(); // 0 = Sun, 1 = Mon ...
  const dayIndex = (currentDayOfWeek + 6) % 7; // Convert to 0=Mon ... 6=Sun
  return weeklyTasks.filter((t) => t.dayIndex === dayIndex);
}

/**
 * Reschedules missed/incomplete tasks into upcoming uncompleted slots or weekend buffer slots
 */
export function rescheduleMissedTasks(
  currentTasks: StudyTask[],
  missedTaskIds: string[]
): StudyTask[] {
  const updatedTasks = [...currentTasks];
  const missedSet = new Set(missedTaskIds);

  for (const taskId of missedSet) {
    const taskIndex = updatedTasks.findIndex((t) => t.id === taskId);
    if (taskIndex !== -1) {
      const task = updatedTasks[taskIndex];
      // Mark as rescheduled to a buffer slot on Saturday or Sunday
      task.topic = `[Rescheduled] ${task.topic}`;
      task.notes = 'Rescheduled automatically via Rule R09 (Missed Session Buffer)';
      // Push day to Sunday if during the week
      if (task.dayIndex < 6) {
        task.dayIndex = 6;
        task.dayName = 'Sunday';
      }
    }
  }

  return updatedTasks;
}

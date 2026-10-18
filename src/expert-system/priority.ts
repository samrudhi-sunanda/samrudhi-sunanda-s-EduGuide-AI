/**
 * EduGuide AI - Subject Priority Analyzer
 * Implements a transparent, deterministic mathematical scoring formula
 * to evaluate subject urgency for planning purposes.
 */

import type { Subject, SubjectPriorityAnalysis, PriorityScoreBreakdown, PriorityTier, SubjectDifficulty } from './types.ts';

export function calculateDaysToExam(examDateStr?: string, referenceDate: Date = new Date()): number | null {
  if (!examDateStr) return null;
  const exam = new Date(examDateStr);
  if (isNaN(exam.getTime())) return null;

  // Compare at day boundary (midnight)
  const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const examDay = new Date(exam.getFullYear(), exam.getMonth(), exam.getDate());
  const diffTime = examDay.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function analyzeSubjectPriority(
  subject: Subject,
  referenceDate: Date = new Date()
): SubjectPriorityAnalysis {
  const breakdown: PriorityScoreBreakdown[] = [];
  let rawScore = 0;

  // 1. Preparation Level Factor (Max 30 pts)
  let prepPts = 0;
  let prepReason = '';
  if (subject.preparationLevel === 'Low') {
    prepPts = 30;
    prepReason = 'Preparation is Low (+30 pts): Requires intensive foundational time';
  } else if (subject.preparationLevel === 'Medium') {
    prepPts = 15;
    prepReason = 'Preparation is Medium (+15 pts): Moderate revision and topic reinforcement needed';
  } else {
    prepPts = 0;
    prepReason = 'Preparation is High (0 pts): Core concepts well understood';
  }
  breakdown.push({
    factor: 'Preparation Level',
    points: prepPts,
    maxPoints: 30,
    reason: prepReason,
  });
  rawScore += prepPts;

  // 2. Confidence Level Factor (Max 25 pts)
  let confPts = 0;
  let confReason = '';
  if (subject.confidenceLevel === 1) {
    confPts = 25;
    confReason = 'Critical low confidence (1/5) (+25 pts): High risk of exam anxiety';
  } else if (subject.confidenceLevel === 2) {
    confPts = 18;
    confReason = 'Low confidence (2/5) (+18 pts): Requires guided practice and formula mastery';
  } else if (subject.confidenceLevel === 3) {
    confPts = 10;
    confReason = 'Moderate confidence (3/5) (+10 pts): Satisfactory with occasional doubts';
  } else if (subject.confidenceLevel === 4) {
    confPts = 4;
    confReason = 'Good confidence (4/5) (+4 pts): Solid command';
  } else {
    confPts = 0;
    confReason = 'Peak confidence (5/5) (0 pts): Thorough self-assurance';
  }
  breakdown.push({
    factor: 'Confidence Rating',
    points: confPts,
    maxPoints: 25,
    reason: confReason,
  });
  rawScore += confPts;

  // 3. Syllabus Completion Factor (Max 25 pts)
  let syllPts = 0;
  let syllReason = '';
  const completion = Math.max(0, Math.min(100, subject.syllabusCompletion));
  if (completion < 50) {
    syllPts = 25;
    syllReason = `Syllabus only ${completion}% complete (+25 pts): Heavy unfinished curriculum`;
  } else if (completion < 75) {
    syllPts = 15;
    syllReason = `Syllabus ${completion}% complete (+15 pts): Intermediate progress; key chapters pending`;
  } else if (completion < 90) {
    syllPts = 5;
    syllReason = `Syllabus ${completion}% complete (+5 pts): Near completion; finish last unit`;
  } else {
    syllPts = 0;
    syllReason = `Syllabus ${completion}% complete (0 pts): Curriculum covered; ready for mock tests`;
  }
  breakdown.push({
    factor: 'Syllabus Deficit',
    points: syllPts,
    maxPoints: 25,
    reason: syllReason,
  });
  rawScore += syllPts;

  // 4. Examination Proximity Factor (Max 35 pts)
  const daysToExam = calculateDaysToExam(subject.examDate, referenceDate);
  let examPts = 0;
  let examReason = '';
  if (daysToExam !== null) {
    if (daysToExam <= 1) {
      examPts = 35;
      examReason = `Exam in ${daysToExam === 0 ? 'today' : '1 day'} (+35 pts): Critical immediate priority`;
    } else if (daysToExam <= 3) {
      examPts = 30;
      examReason = `Exam in ${daysToExam} days (+30 pts): High urgency countdown phase`;
    } else if (daysToExam <= 7) {
      examPts = 22;
      examReason = `Exam in ${daysToExam} days (+22 pts): Weekly revision window`;
    } else if (daysToExam <= 14) {
      examPts = 12;
      examReason = `Exam in ${daysToExam} days (+12 pts): Fortnight prep horizon`;
    } else if (daysToExam > 14) {
      examPts = 4;
      examReason = `Exam in ${daysToExam} days (+4 pts): Long-range buffer`;
    } else {
      // Exam has already passed
      examPts = 0;
      examReason = `Exam date was in past (${Math.abs(daysToExam)} days ago)`;
    }
  } else {
    examPts = 5;
    examReason = 'Exam date not specified (+5 pts baseline): General semester tracking';
  }
  breakdown.push({
    factor: 'Exam Proximity',
    points: examPts,
    maxPoints: 35,
    reason: examReason,
  });
  rawScore += examPts;

  // 5. Explicit Subject Difficulty Factor (Difficult: +15 pts, Easy: -10 pts, Moderate: 0 pts)
  const effectiveDifficulty: SubjectDifficulty =
    subject.difficulty || (subject.isDifficult ? 'Difficult' : 'Moderate');
  let diffPts = 0;
  let diffReason = '';

  if (effectiveDifficulty === 'Difficult') {
    diffPts = 15;
    diffReason = 'Explicitly marked as Difficult (+15 pts): Demands additional cognitive reserve & primary study slots';
  } else if (effectiveDifficulty === 'Easy') {
    diffPts = -10;
    diffReason = 'Explicitly marked as Easy (-10 pts): High student grasp; study duration can be compressed to aid difficult subjects';
  } else {
    diffPts = 0;
    diffReason = 'Moderate standard difficulty (0 pts): Standard time allocation';
  }

  breakdown.push({
    factor: 'Subject Difficulty Flag',
    points: diffPts,
    maxPoints: 15,
    reason: diffReason,
  });
  rawScore += diffPts;

  // 6. Previous Marks Factor (Max 20 pts)
  // IMPORTANT: Missing marks are NOT treated as zero.
  const hasMissingMarks = subject.previousMarks === undefined || subject.previousMarks === null || isNaN(subject.previousMarks);
  let marksPts = 0;
  let marksReason = '';

  if (hasMissingMarks) {
    marksPts = 0;
    marksReason = 'Marks omitted by student (0 pts): No penalty applied (strictly not treated as zero)';
  } else {
    const marks = subject.previousMarks!;
    if (marks < 40) {
      marksPts = 20;
      marksReason = `Previous marks below passing threshold (${marks}%) (+20 pts): High academic vulnerability`;
    } else if (marks < 60) {
      marksPts = 12;
      marksReason = `Previous marks average (${marks}%) (+12 pts): Needs improvement`;
    } else if (marks < 75) {
      marksPts = 5;
      marksReason = `Previous marks satisfactory (${marks}%) (+5 pts): Consistent performance`;
    } else {
      marksPts = 0;
      marksReason = `Previous marks strong (${marks}%) (0 pts): High conceptual base`;
    }
  }
  breakdown.push({
    factor: 'Historical Marks',
    points: marksPts,
    maxPoints: 20,
    reason: marksReason,
  });
  rawScore += marksPts;

  // Normalize score on a 0-100 scale (max possible points is 30+25+25+35+15+20 = 150)
  // Scaled proportionally: max(0, min(100, (rawScore / 150) * 100))
  const normalizedScore = Math.max(0, Math.min(100, Math.round((rawScore / 150) * 100)));

  let tier: PriorityTier = 'Low Priority';
  if (normalizedScore >= 60) {
    tier = 'High Priority';
  } else if (normalizedScore >= 35) {
    tier = 'Medium Priority';
  } else {
    tier = 'Low Priority';
  }

  // Generate clear explanation
  let explanation = '';
  if (tier === 'High Priority') {
    explanation = `${subject.name} has reached High Priority (${normalizedScore}/100) due to ${
      effectiveDifficulty === 'Difficult' ? 'explicit difficulty tag, ' : ''
    }${subject.preparationLevel === 'Low' ? 'low preparation, ' : ''}${
      subject.confidenceLevel <= 2 ? 'low confidence rating, ' : ''
    }${completion < 50 ? 'incomplete syllabus, ' : ''}${
      daysToExam !== null && daysToExam <= 7 ? 'and impending examination countdown.' : 'and academic urgency.'
    }`;
  } else if (tier === 'Medium Priority') {
    explanation = `${subject.name} has moderate urgency (${normalizedScore}/100). Steady daily revision and regular practice problem solving are recommended to prevent backlog.`;
  } else {
    explanation = `${subject.name} is in a stable state (${normalizedScore}/100)${
      effectiveDifficulty === 'Easy' ? ' and marked Easy' : ''
    }. Allocated study time is compressed to create schedule headroom for harder subjects.`;
  }

  // Recommended action
  let recommendedAction = '';
  if (effectiveDifficulty === 'Difficult') {
    recommendedAction = 'Allocate primary deep-focus study blocks (60-90m) and schedule high-frequency revision sessions.';
  } else if (effectiveDifficulty === 'Easy') {
    recommendedAction = 'Compress study blocks to 30-minute rapid review intervals; reallocate saved time to difficult subjects.';
  } else if (daysToExam !== null && daysToExam <= 3) {
    recommendedAction = 'Immediate revision of high-weightage formulas, previous year question papers, and active recall.';
  } else if (subject.preparationLevel === 'Low') {
    recommendedAction = 'Allocate primary daily study block to core chapter concepts before attempting mock exams.';
  } else {
    recommendedAction = 'Perform weekly timed practice tests and error logging.';
  }

  return {
    subjectId: subject.id,
    subjectName: subject.name,
    totalScore: normalizedScore,
    tier,
    difficulty: effectiveDifficulty,
    breakdown,
    daysToExam,
    hasMissingMarks,
    explanation,
    recommendedAction,
  };
}

export function rankSubjectsByPriority(
  subjects: Subject[],
  referenceDate: Date = new Date()
): SubjectPriorityAnalysis[] {
  return subjects
    .map((s) => analyzeSubjectPriority(s, referenceDate))
    .sort((a, b) => b.totalScore - a.totalScore);
}

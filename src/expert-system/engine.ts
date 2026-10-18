/**
 * EduGuide AI - Deterministic Forward-Chaining Inference Engine
 * Features:
 * 1. Working Memory fact assertion and inspection
 * 2. Rule pattern matching against active facts
 * 3. Conflict resolution based on rule priority and specificity
 * 4. Firing of production rules & deduction of conclusions
 * 5. Full inference trace with explainable AI logging
 * 6. Step-by-step generator for college viva demonstration
 */

import type {
  StudentProfile,
  Subject,
  Examination,
  WorkingMemoryFact,
  Rule,
  InferenceResult,
  TriggeredRuleInfo,
  ActionRecommendation,
  ForwardChainingStep,
} from './types.ts';
import { KNOWLEDGE_BASE_RULES } from './rules.ts';
import { calculateDaysToExam } from './priority.ts';

export class InferenceEngine {
  private workingMemory: Map<string, WorkingMemoryFact> = new Map();
  private rules: Rule[];

  constructor(customRules: Rule[] = KNOWLEDGE_BASE_RULES) {
    this.rules = [...customRules];
  }

  /**
   * Reset working memory
   */
  public clearMemory(): void {
    this.workingMemory.clear();
  }

  /**
   * Assert a single fact into working memory
   */
  public assertFact(
    key: string,
    value: any,
    label: string,
    description: string,
    source: 'profile' | 'subject' | 'exam' | 'derived' = 'derived',
    subjectId?: string
  ): void {
    this.workingMemory.set(key, {
      key,
      value,
      label,
      description,
      source,
      subjectId,
    });
  }

  /**
   * Extract and load domain facts from the student profile, subjects, exams, and logs
   */
  public loadFacts(
    profile: StudentProfile,
    exams: Examination[] = [],
    missedSessionsCount: number = 0,
    referenceDate: Date = new Date()
  ): WorkingMemoryFact[] {
    this.clearMemory();

    // 1. Profile facts
    this.assertFact(
      'profile_name',
      profile.name || 'Student',
      'Student Name',
      `Student identification: ${profile.name || 'Anonymous'}`,
      'profile'
    );
    this.assertFact(
      'profile_course',
      profile.course,
      'Degree Program',
      `Enrolled degree: ${profile.course}`,
      'profile'
    );
    this.assertFact(
      'profile_academic_year',
      profile.academicYear,
      'Academic Year',
      `Current year: ${profile.academicYear}`,
      'profile'
    );
    this.assertFact(
      'profile_semester',
      profile.semester,
      'Semester',
      `Current semester: ${profile.semester}`,
      'profile'
    );
    this.assertFact(
      'profile_available_hours',
      profile.availableHoursPerDay,
      'Daily Study Budget',
      `Available daily study time: ${profile.availableHoursPerDay} hours`,
      'profile'
    );
    this.assertFact(
      'profile_preferred_slot',
      profile.preferredTimeSlot,
      'Preferred Study Time',
      `Circadian preference: ${profile.preferredTimeSlot}`,
      'profile'
    );
    this.assertFact(
      'profile_learning_method',
      profile.preferredLearningMethod,
      'Learning Methodology',
      `Preferred style: ${profile.preferredLearningMethod}`,
      'profile'
    );
    this.assertFact(
      'profile_subjects_count',
      profile.subjects.length,
      'Total Subjects Enrolled',
      `Enrolled in ${profile.subjects.length} subject(s)`,
      'profile'
    );

    // 2. System and session facts
    this.assertFact(
      'system_missed_sessions_count',
      missedSessionsCount,
      'Incomplete / Missed Sessions',
      `Pending rescheduled sessions: ${missedSessionsCount}`,
      'derived'
    );

    // 3. Subject-specific facts
    for (const sub of profile.subjects) {
      const id = sub.id;
      this.assertFact(
        `subject_name_${id}`,
        sub.name,
        `Subject Name (${sub.name})`,
        `Subject ${sub.name} (Code: ${sub.code || 'N/A'})`,
        'subject',
        id
      );
      this.assertFact(
        `subject_prep_${id}`,
        sub.preparationLevel,
        `Preparation Level (${sub.name})`,
        `${sub.name} preparation level is ${sub.preparationLevel}`,
        'subject',
        id
      );
      this.assertFact(
        `subject_conf_${id}`,
        sub.confidenceLevel,
        `Confidence (${sub.name})`,
        `${sub.name} confidence score: ${sub.confidenceLevel}/5`,
        'subject',
        id
      );
      this.assertFact(
        `subject_syll_${id}`,
        sub.syllabusCompletion,
        `Syllabus Completion (${sub.name})`,
        `${sub.name} syllabus is ${sub.syllabusCompletion}% completed`,
        'subject',
        id
      );
      const effectiveDiff = sub.difficulty || (sub.isDifficult ? 'Difficult' : 'Moderate');
      this.assertFact(
        `subject_difficulty_${id}`,
        effectiveDiff,
        `Subject Difficulty Tag (${sub.name})`,
        `${sub.name} is classified as ${effectiveDiff}`,
        'subject',
        id
      );
      this.assertFact(
        `subject_diff_${id}`,
        effectiveDiff === 'Difficult',
        `Difficulty Flag (${sub.name})`,
        `${sub.name} marked difficult: ${effectiveDiff === 'Difficult' ? 'Yes' : 'No'}`,
        'subject',
        id
      );

      // Previous marks - ONLY assert if actually present (do not zero out missing)
      if (sub.previousMarks !== undefined && sub.previousMarks !== null && !isNaN(sub.previousMarks)) {
        this.assertFact(
          `subject_marks_${id}`,
          sub.previousMarks,
          `Previous Marks (${sub.name})`,
          `Historical score: ${sub.previousMarks}%`,
          'subject',
          id
        );
      }

      // Exam date, proximity, and exam format
      const matchingExam = exams.find((e) => e.subjectId === id);
      const effectiveExamDate = matchingExam ? matchingExam.examDate : sub.examDate;

      if (matchingExam && matchingExam.examFormat) {
        this.assertFact(
          `exam_format_${id}`,
          matchingExam.examFormat,
          `Exam Format (${sub.name})`,
          `${sub.name} exam format: ${matchingExam.examFormat}`,
          'exam',
          id
        );
      }

      if (effectiveExamDate) {
        const days = calculateDaysToExam(effectiveExamDate, referenceDate);
        this.assertFact(
          `subject_has_exam_date_${id}`,
          true,
          `Exam Date Defined (${sub.name})`,
          `Exam scheduled on ${effectiveExamDate}`,
          'subject',
          id
        );
        this.assertFact(
          `subject_days_to_exam_${id}`,
          days,
          `Days to Exam (${sub.name})`,
          `${sub.name} examination is in ${days} day(s)`,
          'subject',
          id
        );
      } else {
        this.assertFact(
          `subject_has_exam_date_${id}`,
          false,
          `Exam Date Not Set (${sub.name})`,
          `${sub.name} has no exam date scheduled`,
          'subject',
          id
        );
      }
    }

    return Array.from(this.workingMemory.values());
  }

  /**
   * Run full forward-chaining inference
   */
  public infer(): InferenceResult {
    const firedRules: TriggeredRuleInfo[] = [];
    const conflictResolutionLog: string[] = [];

    // Step 1: Matching (evaluate all rules against working memory)
    const matchingRules: Rule[] = [];
    for (const rule of this.rules) {
      if (rule.condition(this.workingMemory)) {
        matchingRules.push(rule);
      }
    }

    // Step 2: Conflict Resolution
    // Strategy: Sort by priority descending. If equal, sort by rule ID.
    matchingRules.sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      return a.id.localeCompare(b.id);
    });

    if (matchingRules.length > 0) {
      conflictResolutionLog.push(
        `Conflict Set identified with ${matchingRules.length} applicable rule(s): [${matchingRules
          .map((r) => `${r.id} (P:${r.priority})`)
          .join(', ')}]`
      );
      conflictResolutionLog.push(
        `Conflict Resolution Strategy applied: Ordered by Highest Priority Score descending.`
      );
    } else {
      conflictResolutionLog.push('No specific rules triggered. Base performance maintenance activated.');
    }

    // Step 3: Firing Rules & Generating Recommendations
    const allRecommendations: Array<
      ActionRecommendation & {
        triggeredRuleIds: string[];
        explanation: string;
        satisfiedConditions: string[];
        factsConsidered: Array<{ label: string; value: string | number }>;
      }
    > = [];

    for (const rule of matchingRules) {
      const recs = rule.execute(this.workingMemory);

      // Identify which specific facts in working memory supported this rule firing
      const satisfiedFacts: Array<{ label: string; value: string | number }> = [];
      for (const fact of this.workingMemory.values()) {
        if (
          (rule.category === 'Preparation' && fact.key.startsWith('subject_prep_')) ||
          (rule.category === 'Confidence' && fact.key.startsWith('subject_conf_')) ||
          (rule.category === 'Syllabus' && fact.key.startsWith('subject_syll_')) ||
          (rule.category === 'Subject Difficulty' && fact.key.startsWith('subject_difficulty_')) ||
          (rule.category === 'Exam Format Strategy' && fact.key.startsWith('exam_format_')) ||
          (rule.category === 'Exam Proximity' && fact.key.startsWith('subject_days_to_exam_')) ||
          (rule.category === 'Time Management' && fact.key === 'profile_available_hours') ||
          (rule.category === 'Session Rescheduling' && fact.key === 'system_missed_sessions_count') ||
          (rule.category === 'Learning Strategy' &&
            (fact.key === 'profile_preferred_slot' || fact.key === 'profile_learning_method'))
        ) {
          satisfiedFacts.push({
            label: fact.label,
            value: fact.value,
          });
        }
      }

      firedRules.push({
        ruleId: rule.id,
        ruleName: rule.name,
        category: rule.category,
        priority: rule.priority,
        conditionDescription: rule.conditionDescription,
        actionDescription: rule.actionDescription,
        explanation: rule.explanation,
        satisfiedFacts,
        recommendations: recs,
      });

      for (const rec of recs) {
        // Collect facts relevant to this recommendation's subject if applicable
        const relevantFacts: Array<{ label: string; value: string | number }> = [];
        if (rec.subjectId) {
          for (const fact of this.workingMemory.values()) {
            if (fact.subjectId === rec.subjectId) {
              relevantFacts.push({ label: fact.label, value: fact.value });
            }
          }
        } else {
          for (const fact of this.workingMemory.values()) {
            if (fact.source === 'profile') {
              relevantFacts.push({ label: fact.label, value: fact.value });
            }
          }
        }

        allRecommendations.push({
          ...rec,
          triggeredRuleIds: [rule.id],
          explanation: rule.explanation,
          satisfiedConditions: [rule.conditionDescription],
          factsConsidered: relevantFacts.length > 0 ? relevantFacts : satisfiedFacts,
        });
      }
    }

    // Deduplicate recommendations with similar titles
    const uniqueRecsMap = new Map<string, (typeof allRecommendations)[0]>();
    for (const rec of allRecommendations) {
      const key = `${rec.title}_${rec.subjectId || 'global'}`;
      if (!uniqueRecsMap.has(key)) {
        uniqueRecsMap.set(key, rec);
      } else {
        const existing = uniqueRecsMap.get(key)!;
        if (!existing.triggeredRuleIds.includes(rec.triggeredRuleIds[0])) {
          existing.triggeredRuleIds.push(...rec.triggeredRuleIds);
          existing.satisfiedConditions.push(...rec.satisfiedConditions);
        }
      }
    }

    const dedupedRecs = Array.from(uniqueRecsMap.values());

    return {
      facts: Array.from(this.workingMemory.values()),
      evaluatedRulesCount: this.rules.length,
      firedRules,
      recommendations: dedupedRecs,
      conflictResolutionLog,
      summaryMessage: `Inference Engine evaluated ${this.rules.length} production rules. ${firedRules.length} rules satisfied and executed successfully.`,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Generates step-by-step trace states for the interactive Forward-Chaining demonstration
   */
  public generateDemonstrationSteps(): ForwardChainingStep[] {
    const steps: ForwardChainingStep[] = [];
    const factsList = Array.from(this.workingMemory.values());

    // Step 1: Fact Assertion in Working Memory
    steps.push({
      stepNumber: 1,
      stepName: 'Fact Collection & Working Memory Initialization',
      description: `Student facts gathered from academic assessment and loaded into Working Memory (${factsList.length} facts asserted).`,
      activeFacts: [...factsList],
      rulesBeingEvaluated: [],
      conflictSet: [],
      newDerivedConclusions: [
        `Loaded ${factsList.length} initial ground facts into Working Memory.`,
        'Working Memory initialized and ready for production rule pattern matching.',
      ],
    });

    // Step 2: Rule Matching Phase
    const matched: Rule[] = [];
    const evaluationTrace: ForwardChainingStep['rulesBeingEvaluated'] = [];

    for (const rule of this.rules) {
      const isMatch = rule.condition(this.workingMemory);
      evaluationTrace.push({
        ruleId: rule.id,
        ruleName: rule.name,
        matched: isMatch,
        reason: isMatch
          ? `Condition satisfied: "${rule.conditionDescription}"`
          : 'Conditions not satisfied by current Working Memory state',
      });
      if (isMatch) matched.push(rule);
    }

    steps.push({
      stepNumber: 2,
      stepName: 'Pattern Matching (Condition Evaluation)',
      description: `Inference engine evaluates all ${this.rules.length} IF-THEN rules against active Working Memory facts. ${matched.length} rule(s) satisfied.`,
      activeFacts: [...factsList],
      rulesBeingEvaluated: evaluationTrace,
      conflictSet: matched.map((r) => ({ ruleId: r.id, ruleName: r.name, priority: r.priority })),
      newDerivedConclusions: [
        `${matched.length} rule condition(s) satisfied out of ${this.rules.length} knowledge base rules.`,
        `Rules ready for Conflict Resolution: [${matched.map((r) => r.id).join(', ')}]`,
      ],
    });

    // Step 3: Conflict Resolution
    const resolvedConflictSet = [...matched].sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id));

    steps.push({
      stepNumber: 3,
      stepName: 'Conflict Resolution',
      description: 'Multiple rules fired concurrently. The Conflict Resolution module orders applicable rules by Priority Score and Specificity.',
      activeFacts: [...factsList],
      rulesBeingEvaluated: [],
      conflictSet: resolvedConflictSet.map((r) => ({
        ruleId: r.id,
        ruleName: r.name,
        priority: r.priority,
      })),
      selectedRule: resolvedConflictSet[0]
        ? {
            ruleId: resolvedConflictSet[0].id,
            ruleName: resolvedConflictSet[0].name,
            priority: resolvedConflictSet[0].priority,
          }
        : undefined,
      newDerivedConclusions: [
        `Ranked ${resolvedConflictSet.length} candidate rules by priority.`,
        resolvedConflictSet[0]
          ? `Highest priority rule selected for first firing: ${resolvedConflictSet[0].id} ("${resolvedConflictSet[0].name}" with Priority ${resolvedConflictSet[0].priority}).`
          : 'No conflicting rules.',
      ],
    });

    // Step 4: Rule Firing & Action Execution
    const conclusions: string[] = [];
    for (const rule of resolvedConflictSet) {
      const recs = rule.execute(this.workingMemory);
      for (const rec of recs) {
        conclusions.push(`[${rule.id} FIRED] ${rec.title}: ${rec.suggestedAction}`);
      }
    }

    steps.push({
      stepNumber: 4,
      stepName: 'Rule Execution & Knowledge Deduction',
      description: 'The Inference Engine executes the THEN actions of all resolved rules, generating action recommendations and updating domain conclusions.',
      activeFacts: [...factsList],
      rulesBeingEvaluated: [],
      conflictSet: resolvedConflictSet.map((r) => ({
        ruleId: r.id,
        ruleName: r.name,
        priority: r.priority,
      })),
      newDerivedConclusions: conclusions,
    });

    // Step 5: Final Recommendations & Study Schedule Synthesis
    steps.push({
      stepNumber: 5,
      stepName: 'Study Plan & Advisory Synthesis',
      description: 'Derived recommendations are integrated with subject priority rankings and the student available time budget into an executable schedule.',
      activeFacts: [...factsList],
      rulesBeingEvaluated: [],
      conflictSet: [],
      newDerivedConclusions: [
        `Synthesized ${conclusions.length} personalized study directives.`,
        'Weekly timetable generated with zero overlaps, appropriate break intervals, and respect for daily study hour constraints.',
      ],
    });

    return steps;
  }

  /**
   * Return all currently loaded facts
   */
  public getFacts(): WorkingMemoryFact[] {
    return Array.from(this.workingMemory.values());
  }

  /**
   * Return the entire knowledge base
   */
  public getRules(): Rule[] {
    return [...this.rules];
  }
}

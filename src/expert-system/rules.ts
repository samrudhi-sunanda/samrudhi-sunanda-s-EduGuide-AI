/**
 * EduGuide AI - Authoritative Knowledge Base of Production Rules
 * Contains structured, executable IF-THEN rules with conflict resolution priorities.
 * Includes subject difficulty optimization and exam-format-specific strategies.
 */

import type { Rule, ActionRecommendation, WorkingMemoryFact } from './types.ts';

export const KNOWLEDGE_BASE_RULES: Rule[] = [
  // RULE R12: Exam Tomorrow (Priority 100 - Highest Urgency)
  {
    id: 'R12',
    name: 'Exam Tomorrow / Last 24 Hours',
    category: 'Exam Proximity',
    priority: 100,
    conditionDescription: 'IF any subject examination is scheduled within 1 day (tomorrow or today)',
    actionDescription: 'THEN activate high-urgency rapid review, protect 7-8 hours of sleep, and strictly avoid new syllabus topics.',
    explanation: 'Cognitive research shows cramming new material in the final 24 hours causes interference and exam panic. High-yield summary cards and restful sleep maximize memory consolidation.',
    condition: (facts) => {
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('subject_days_to_exam_') && fact.value !== null && Number(fact.value) <= 1 && Number(fact.value) >= 0) {
          return true;
        }
      }
      return false;
    },
    execute: (facts) => {
      const recs: ActionRecommendation[] = [];
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('subject_days_to_exam_') && fact.value !== null && Number(fact.value) <= 1 && Number(fact.value) >= 0) {
          const subjectName = facts.get(`subject_name_${fact.subjectId}`)?.value || 'Subject';
          recs.push({
            type: 'CRITICAL_EXAM_EVE',
            title: `Final 24-Hour Review for ${subjectName}`,
            description: `The exam for ${subjectName} is in ${Number(fact.value) === 0 ? 'today' : '1 day'}. Switch strictly to formula cheat sheets, error logs, and high-yield key definitions.`,
            subjectId: fact.subjectId,
            subjectName,
            suggestedAction: 'Dedicate no more than 2-3 focused hours to light review; ensure minimum 7.5 hours sleep tonight to optimize cognitive retrieval.',
            urgency: 'High',
          });
        }
      }
      return recs;
    },
  },

  // RULE R11: Critical Exam Proximity <= 3 days (Priority 98)
  {
    id: 'R11',
    name: 'Critical Exam Window (<= 3 Days)',
    category: 'Exam Proximity',
    priority: 98,
    conditionDescription: 'IF an examination is within 2 to 3 days',
    actionDescription: 'THEN transition 70% of study time to past question papers, active recall, and formula drills.',
    explanation: 'Within 72 hours of an exam, active retrieval practice produces 2.5x higher retention than passive re-reading.',
    condition: (facts) => {
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('subject_days_to_exam_') && fact.value !== null && Number(fact.value) > 1 && Number(fact.value) <= 3) {
          return true;
        }
      }
      return false;
    },
    execute: (facts) => {
      const recs: ActionRecommendation[] = [];
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('subject_days_to_exam_') && fact.value !== null && Number(fact.value) > 1 && Number(fact.value) <= 3) {
          const subjectName = facts.get(`subject_name_${fact.subjectId}`)?.value || 'Subject';
          recs.push({
            type: 'EXAM_COUNTDOWN_3DAYS',
            title: `3-Day Intensive Exam Protocol: ${subjectName}`,
            description: `Exam is in ${fact.value} days. Cease exploratory reading and shift to solving previous 3 years University question papers under timed conditions.`,
            subjectId: fact.subjectId,
            subjectName,
            suggestedAction: 'Solve 2 full sample question sets and review the marking scheme thoroughly.',
            urgency: 'High',
          });
        }
      }
      return recs;
    },
  },

  // RULE R25: Technical Problem-Solving Countdown (<= 3 Days) (Priority 96)
  {
    id: 'R25',
    name: 'Technical / Numerical Exam Sprint (<= 3 Days)',
    category: 'Exam Format Strategy',
    priority: 96,
    conditionDescription: 'IF exam format is Problem-Solving / Technical AND exam is within 3 days',
    actionDescription: 'THEN enforce blank-sheet formula derivation drills and timed step-by-step numerical solving.',
    explanation: 'Technical examinations award partial step-marking. Practicing step-by-step layout under tight time constraints prevents calculation panic and careless algebraic errors.',
    condition: (facts) => {
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('exam_format_') && (fact.value === 'Problem-Solving / Technical' || fact.value === 'Mixed (Theory + Numericals)')) {
          const subId = fact.subjectId;
          const daysFact = facts.get(`subject_days_to_exam_${subId}`);
          if (daysFact && Number(daysFact.value) <= 3 && Number(daysFact.value) >= 0) {
            return true;
          }
        }
      }
      return false;
    },
    execute: (facts) => {
      const recs: ActionRecommendation[] = [];
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('exam_format_') && (fact.value === 'Problem-Solving / Technical' || fact.value === 'Mixed (Theory + Numericals)')) {
          const subId = fact.subjectId;
          const daysFact = facts.get(`subject_days_to_exam_${subId}`);
          if (daysFact && Number(daysFact.value) <= 3 && Number(daysFact.value) >= 0) {
            const subjectName = facts.get(`subject_name_${subId}`)?.value || 'Technical Subject';
            recs.push({
              type: 'TECHNICAL_COUNTDOWN_DRILL',
              title: `Technical Numerical Drill: ${subjectName}`,
              description: `Your ${fact.value} exam is in ${daysFact.value} day(s). Replicate derivations from blank memory and verify unit dimensions.`,
              subjectId: subId,
              subjectName,
              suggestedAction: 'Write all formulas on a blank paper without references. Solve 5 standard numerical variations and check final units.',
              urgency: 'High',
            });
          }
        }
      }
      return recs;
    },
  },

  // RULE R04: Exam Approaching <= 7 days (Priority 95)
  {
    id: 'R04',
    name: 'Exam Approaching (<= 7 Days)',
    category: 'Exam Proximity',
    priority: 95,
    conditionDescription: 'IF an examination is within 4 to 7 days',
    actionDescription: 'THEN recommend a revision-focused study plan with practice questions and review of high-weightage topics.',
    explanation: 'With 4-7 days remaining, syllabus completion must be balanced with spaced repetition to transfer concepts into stable working memory.',
    condition: (facts) => {
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('subject_days_to_exam_') && fact.value !== null && Number(fact.value) >= 4 && Number(fact.value) <= 7) {
          return true;
        }
      }
      return false;
    },
    execute: (facts) => {
      const recs: ActionRecommendation[] = [];
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('subject_days_to_exam_') && fact.value !== null && Number(fact.value) >= 4 && Number(fact.value) <= 7) {
          const subjectName = facts.get(`subject_name_${fact.subjectId}`)?.value || 'Subject';
          recs.push({
            type: 'EXAM_REVISION_WEEK',
            title: `Spaced Revision Plan for ${subjectName}`,
            description: `Examination is ${fact.value} days away. Build a concentrated 7-day revision cycle targeting top weightage units and recurring problem types.`,
            subjectId: fact.subjectId,
            subjectName,
            suggestedAction: 'Allocate at least 60% of daily study slots to this subject; revise derivation steps and core algorithms.',
            urgency: 'High',
          });
        }
      }
      return recs;
    },
  },

  // RULE R24: Multiple Choice (MCQ) Countdown (<= 3 Days) (Priority 94)
  {
    id: 'R24',
    name: 'MCQ Elimination Speed Sprint (<= 3 Days)',
    category: 'Exam Format Strategy',
    priority: 94,
    conditionDescription: 'IF exam format is Multiple Choice (MCQ) AND exam is within 3 days',
    actionDescription: 'THEN focus on rapid option elimination, conceptual traps, and negative marking penalty management.',
    explanation: 'Objective examinations test discriminating fine conceptual boundaries. Training with timed batches reduces second-guessing and careless misreading.',
    condition: (facts) => {
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('exam_format_') && fact.value === 'Multiple Choice (MCQ)') {
          const subId = fact.subjectId;
          const daysFact = facts.get(`subject_days_to_exam_${subId}`);
          if (daysFact && Number(daysFact.value) <= 3 && Number(daysFact.value) >= 0) {
            return true;
          }
        }
      }
      return false;
    },
    execute: (facts) => {
      const recs: ActionRecommendation[] = [];
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('exam_format_') && fact.value === 'Multiple Choice (MCQ)') {
          const subId = fact.subjectId;
          const daysFact = facts.get(`subject_days_to_exam_${subId}`);
          if (daysFact && Number(daysFact.value) <= 3 && Number(daysFact.value) >= 0) {
            const subjectName = facts.get(`subject_name_${subId}`)?.value || 'MCQ Subject';
            recs.push({
              type: 'MCQ_ELIMINATION_DRILL',
              title: `MCQ Speed Drill: ${subjectName}`,
              description: `Objective test in ${daysFact.value} days. Practice identifying common distractor patterns and fine conceptual edge cases.`,
              subjectId: subId,
              subjectName,
              suggestedAction: 'Complete two 50-question mock tests at 1 minute per question. Practice the 50/50 elimination rule on doubtful questions.',
              urgency: 'High',
            });
          }
        }
      }
      return recs;
    },
  },

  // RULE R01: Low Preparation (Priority 90)
  {
    id: 'R01',
    name: 'Low Preparation Level Alert',
    category: 'Preparation',
    priority: 90,
    conditionDescription: 'IF a subject preparation level is Low',
    actionDescription: 'THEN recommend assigning additional dedicated study time (minimum 60-90 min daily) and foundational concept breakdown.',
    explanation: 'Subjects with low preparation create compounding anxiety and high failure risk. Front-loading core concepts stabilizes comprehension before exam pressure builds.',
    condition: (facts) => {
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('subject_prep_') && fact.value === 'Low') {
          return true;
        }
      }
      return false;
    },
    execute: (facts) => {
      const recs: ActionRecommendation[] = [];
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('subject_prep_') && fact.value === 'Low') {
          const subjectName = facts.get(`subject_name_${fact.subjectId}`)?.value || 'Subject';
          recs.push({
            type: 'LOW_PREPARATION_REINFORCEMENT',
            title: `Priority Foundational Study: ${subjectName}`,
            description: `${subjectName} currently has Low preparation. The inference engine allocates primary daily study blocks to break down difficult chapters.`,
            subjectId: fact.subjectId,
            subjectName,
            suggestedAction: 'Start with Unit 1 & Unit 2 core lecture notes, create one-page chapter outlines, and complete basic textbook examples.',
            urgency: 'High',
          });
        }
      }
      return recs;
    },
  },

  // RULE R05: Limited Daily Study Time <= 2 hrs (Priority 88)
  {
    id: 'R05',
    name: 'Constrained Daily Study Budget (<= 2 Hours)',
    category: 'Time Management',
    priority: 88,
    conditionDescription: 'IF student available study time is 2 hours or less per day',
    actionDescription: 'THEN create a realistic, limited schedule prioritizing high-impact tasks and deferring low-priority topics to prevent burnout.',
    explanation: 'Overburdening a constrained schedule causes frustration and skipped tasks. A lean, focused 90-minute schedule with high compliance beats an unrealizable 4-hour plan.',
    condition: (facts) => {
      const hoursFact = facts.get('profile_available_hours');
      return hoursFact !== undefined && Number(hoursFact.value) <= 2;
    },
    execute: (facts) => {
      const hours = facts.get('profile_available_hours')?.value || 2;
      return [
        {
          type: 'TIME_CONSTRAINED_OPTIMIZATION',
          title: 'High-Yield Micro-Study Strategy',
          description: `Daily study availability is ${hours} hour(s). The engine prioritizes top-ranked subjects exclusively and trims non-essential review blocks.`,
          suggestedAction: 'Use two 45-minute high-focus Pomodoro sessions daily. Defer exploratory topics until exam-critical units are mastered.',
          urgency: 'High',
        },
      ];
    },
  },

  // RULE R21: Technical Problem-Solving General Strategy (Priority 86)
  {
    id: 'R21',
    name: 'Technical / Analytical Exam Methodology',
    category: 'Exam Format Strategy',
    priority: 86,
    conditionDescription: 'IF upcoming exam format is Problem-Solving / Technical',
    actionDescription: 'THEN shift schedule balance to 70% active problem solving and numerical drills, minimizing passive theory reading.',
    explanation: 'Engineering and mathematical subjects cannot be mastered through passive note reading. Active calculation builds muscle memory for exam conditions.',
    condition: (facts) => {
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('exam_format_') && fact.value === 'Problem-Solving / Technical') {
          return true;
        }
      }
      return false;
    },
    execute: (facts) => {
      const recs: ActionRecommendation[] = [];
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('exam_format_') && fact.value === 'Problem-Solving / Technical') {
          const subjectName = facts.get(`subject_name_${fact.subjectId}`)?.value || 'Technical Subject';
          recs.push({
            type: 'TECHNICAL_PROBLEM_METHOD',
            title: `Analytical Problem Strategy: ${subjectName}`,
            description: `This exam is structured as Problem-Solving / Technical. Focus on algorithm execution steps, mathematical proofs, and solved university problems.`,
            subjectId: fact.subjectId,
            subjectName,
            suggestedAction: 'Solve 10 varied numerical problems daily. Re-derive critical theorem equations without checking reference notes.',
            urgency: 'Medium',
          });
        }
      }
      return recs;
    },
  },

  // RULE R02: Low Confidence (Priority 85)
  {
    id: 'R02',
    name: 'Low Confidence Remediation',
    category: 'Confidence',
    priority: 85,
    conditionDescription: 'IF student confidence level for a subject is 1 or 2 out of 5',
    actionDescription: 'THEN recommend step-by-step concept revision, flashcards, and progressively graded practice questions.',
    explanation: 'Low self-efficacy leads to cognitive avoidance. Starting with easy solved problems builds self-reinforcing mastery momentum.',
    condition: (facts) => {
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('subject_conf_') && Number(fact.value) <= 2) {
          return true;
        }
      }
      return false;
    },
    execute: (facts) => {
      const recs: ActionRecommendation[] = [];
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('subject_conf_') && Number(fact.value) <= 2) {
          const subjectName = facts.get(`subject_name_${fact.subjectId}`)?.value || 'Subject';
          recs.push({
            type: 'CONFIDENCE_BUILDING',
            title: `Confidence Rebuilding in ${subjectName}`,
            description: `Student self-confidence is rated at ${fact.value}/5. Systematic scaffolding is required before tackling complex question variations.`,
            subjectId: fact.subjectId,
            subjectName,
            suggestedAction: 'Work through 5 textbook solved numericals with solutions in hand, then replicate without looking. Track correct attempts.',
            urgency: 'Medium',
          });
        }
      }
      return recs;
    },
  },

  // RULE R22: Essay & Descriptive Exam Strategy (<= 7 Days) (Priority 84)
  {
    id: 'R22',
    name: 'Essay & Descriptive Structural Preparation (<= 7 Days)',
    category: 'Exam Format Strategy',
    priority: 84,
    conditionDescription: 'IF exam format is Essay & Descriptive AND examination is within 7 days',
    actionDescription: 'THEN practice speed outline drafting, labeled block diagrams, and structured paragraph presentation.',
    explanation: 'Examiners in descriptive subjects award marks based on clear subheadings, labeled diagrams, and introductory thesis points under strict time limits.',
    condition: (facts) => {
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('exam_format_') && fact.value === 'Essay & Descriptive') {
          const subId = fact.subjectId;
          const daysFact = facts.get(`subject_days_to_exam_${subId}`);
          if (daysFact && Number(daysFact.value) <= 7 && Number(daysFact.value) >= 0) {
            return true;
          }
        }
      }
      return false;
    },
    execute: (facts) => {
      const recs: ActionRecommendation[] = [];
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('exam_format_') && fact.value === 'Essay & Descriptive') {
          const subId = fact.subjectId;
          const daysFact = facts.get(`subject_days_to_exam_${subId}`);
          if (daysFact && Number(daysFact.value) <= 7 && Number(daysFact.value) >= 0) {
            const subjectName = facts.get(`subject_name_${subId}`)?.value || 'Descriptive Subject';
            recs.push({
              type: 'ESSAY_STRUCTURE_DRILL',
              title: `Essay & Structural Answer Drill: ${subjectName}`,
              description: `Descriptive exam in ${daysFact.value} days. Practice sketching architecture diagrams and 5-point structured answers in 8-minute blocks.`,
              subjectId: subId,
              subjectName,
              suggestedAction: 'Draft point-form outlines for 4 major 10-mark recurring questions. Practice drawing neat block diagrams from memory.',
              urgency: 'Medium',
            });
          }
        }
      }
      return recs;
    },
  },

  // RULE R23: Multiple Choice (MCQ) General Strategy (Priority 83)
  {
    id: 'R23',
    name: 'Objective / Multiple Choice (MCQ) Conceptual Strategy',
    category: 'Exam Format Strategy',
    priority: 83,
    conditionDescription: 'IF upcoming exam format is Multiple Choice (MCQ)',
    actionDescription: 'THEN focus on rapid option elimination, conceptual definition edge-cases, and speed test drills.',
    explanation: 'MCQs frequently include subtle distractor choices. Systematic elimination of impossible answers boosts accuracy significantly.',
    condition: (facts) => {
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('exam_format_') && fact.value === 'Multiple Choice (MCQ)') {
          return true;
        }
      }
      return false;
    },
    execute: (facts) => {
      const recs: ActionRecommendation[] = [];
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('exam_format_') && fact.value === 'Multiple Choice (MCQ)') {
          const subjectName = facts.get(`subject_name_${fact.subjectId}`)?.value || 'MCQ Subject';
          recs.push({
            type: 'MCQ_CONCEPTUAL_STRATEGY',
            title: `MCQ Conceptual Precision: ${subjectName}`,
            description: `Objective exam format detected. Train on precise property definitions, boundary values, and rapid elimination.`,
            subjectId: fact.subjectId,
            subjectName,
            suggestedAction: 'Review concise summary tables comparing system properties, protocols, and time complexities.',
            urgency: 'Medium',
          });
        }
      }
      return recs;
    },
  },

  // RULE R10: Revision Needed (Priority 82)
  {
    id: 'R10',
    name: 'Revision & Active Recall Needed',
    category: 'Learning Strategy',
    priority: 82,
    conditionDescription: 'IF a subject syllabus completion is high (>= 70%) but confidence is low (<= 2)',
    actionDescription: 'THEN recommend active recall, flashcards, and self-testing instead of passive re-reading or learning new topics.',
    explanation: 'Completing syllabus reading without testing creates an "illusion of competence". Active quizzing exposes real knowledge gaps without false comfort.',
    condition: (facts) => {
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('subject_syll_') && Number(fact.value) >= 70) {
          const confFact = facts.get(`subject_conf_${fact.subjectId}`);
          if (confFact && Number(confFact.value) <= 2) {
            return true;
          }
        }
      }
      return false;
    },
    execute: (facts) => {
      const recs: ActionRecommendation[] = [];
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('subject_syll_') && Number(fact.value) >= 70) {
          const confFact = facts.get(`subject_conf_${fact.subjectId}`);
          if (confFact && Number(confFact.value) <= 2) {
            const subjectName = facts.get(`subject_name_${fact.subjectId}`)?.value || 'Subject';
            recs.push({
              type: 'ACTIVE_RECALL_MANDATE',
              title: `Active Recall Protocol: ${subjectName}`,
              description: `Although ${fact.value}% syllabus has been covered, confidence remains low (${confFact.value}/5). Re-reading notes will produce minimal gains.`,
              subjectId: fact.subjectId,
              subjectName,
              suggestedAction: 'Use the Feynman technique: Explain key algorithms/formulas on a blank whiteboard without references. Answer end-of-chapter review questions.',
              urgency: 'High',
            });
          }
        }
      }
      return recs;
    },
  },

  // RULE R03: Incomplete Syllabus (Priority 80)
  {
    id: 'R03',
    name: 'Incomplete Syllabus Warning (< 50%)',
    category: 'Syllabus',
    priority: 80,
    conditionDescription: 'IF syllabus completion for a subject is below 50%',
    actionDescription: 'THEN prioritize finishing high-scoring fundamental syllabus modules before attempting full-length mock examinations.',
    explanation: 'Mock exams taken with less than 50% syllabus coverage lead to demoralization and skewed diagnostic metrics. First build adequate syllabus mass.',
    condition: (facts) => {
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('subject_syll_') && Number(fact.value) < 50) {
          return true;
        }
      }
      return false;
    },
    execute: (facts) => {
      const recs: ActionRecommendation[] = [];
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('subject_syll_') && Number(fact.value) < 50) {
          const subjectName = facts.get(`subject_name_${fact.subjectId}`)?.value || 'Subject';
          recs.push({
            type: 'SYLLABUS_ACCELERATION',
            title: `Syllabus Acceleration in ${subjectName}`,
            description: `Only ${fact.value}% of the syllabus is completed. Target completing at least 70% of high-weightage chapters over the next 10 days.`,
            subjectId: fact.subjectId,
            subjectName,
            suggestedAction: 'Map the syllabus into 3 difficulty tiers; dedicate daily 45-min sprints to Tier-1 high-scoring units.',
            urgency: 'High',
          });
        }
      }
      return recs;
    },
  },

  // RULE R19: Difficult Subject Priority Allocation (Priority 78)
  {
    id: 'R19',
    name: 'Explicit Difficult Subject Extra Allocation',
    category: 'Subject Difficulty',
    priority: 78,
    conditionDescription: 'IF a subject is explicitly flagged as Difficult by the student',
    actionDescription: 'THEN allocate extra study duration (+25-30% more time) and schedule during fresh mental windows with high-frequency review.',
    explanation: 'Challenging subjects require multiple spaced exposures and higher cognitive load tolerance. Scheduling them early prevents avoidance.',
    condition: (facts) => {
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('subject_difficulty_') && fact.value === 'Difficult') {
          return true;
        }
      }
      return false;
    },
    execute: (facts) => {
      const recs: ActionRecommendation[] = [];
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('subject_difficulty_') && fact.value === 'Difficult') {
          const subjectName = facts.get(`subject_name_${fact.subjectId}`)?.value || 'Difficult Subject';
          recs.push({
            type: 'DIFFICULT_SUBJECT_EXPANSION',
            title: `Reinforced Allocation for Difficult Subject: ${subjectName}`,
            description: `You have tagged ${subjectName} as Difficult. The expert system increases study slot frequency and assigns prime cognitive time.`,
            subjectId: fact.subjectId,
            subjectName,
            suggestedAction: 'Dedicate 60-90 minute deep-focus blocks. Follow every study session with 10 minutes of active self-explanation.',
            urgency: 'High',
          });
        }
      }
      return recs;
    },
  },

  // RULE R07: Multiple Difficult Subjects (Priority 75)
  {
    id: 'R07',
    name: 'Multiple Difficult Subjects Interleaving',
    category: 'Time Management',
    priority: 75,
    conditionDescription: 'IF two or more subjects have Low preparation or are marked difficult',
    actionDescription: 'THEN distribute study sessions across subjects using interleaved scheduling rather than allocating all time to a single subject.',
    explanation: 'Focusing exclusively on one difficult subject causes mental fatigue and allows other critical subjects to decay. Interleaving optimizes cross-domain neural retention.',
    condition: (facts) => {
      let lowCount = 0;
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('subject_prep_') && (fact.value === 'Low' || fact.value === 'Medium')) {
          const diffFact = facts.get(`subject_difficulty_${fact.subjectId}`);
          if (fact.value === 'Low' || (diffFact && diffFact.value === 'Difficult')) {
            lowCount++;
          }
        }
      }
      return lowCount >= 2;
    },
    execute: () => {
      return [
        {
          type: 'INTERLEAVED_SCHEDULE',
          title: 'Interleaved Multi-Subject Balancing',
          description: 'Two or more subjects require significant academic catch-up. The engine avoids single-subject burnout by rotating subjects in alternating slots.',
          suggestedAction: 'Study Subject A for 60 mins, take a 10 min break, then transition to Subject B. Never spend an entire day on only one subject.',
          urgency: 'Medium',
        },
      ];
    },
  },

  // RULE R09: Missed Study Session Rescheduling (Priority 70)
  {
    id: 'R09',
    name: 'Missed Session Buffer Rescheduling',
    category: 'Session Rescheduling',
    priority: 70,
    conditionDescription: 'IF a planned study session is marked incomplete or missed',
    actionDescription: 'THEN reschedule the task into an upcoming open buffer slot without overloading the student daily timetable.',
    explanation: 'Rigid timetables collapse upon the first missed session. Adaptive scheduling absorbs disruptions into planned weekend or evening buffer slots.',
    condition: (facts) => {
      const missedFact = facts.get('system_missed_sessions_count');
      return missedFact !== undefined && Number(missedFact.value) > 0;
    },
    execute: (facts) => {
      const missedCount = facts.get('system_missed_sessions_count')?.value || 1;
      return [
        {
          type: 'RESCHEDULE_BUFFER',
          title: `Adaptive Rescheduling (${missedCount} Missed Session${missedCount > 1 ? 's' : ''})`,
          description: `You have ${missedCount} incomplete study session(s). The expert system redistributes these topics into dedicated catch-up slots.`,
          suggestedAction: 'Click "Reschedule Missed Sessions" on the Study Planner to insert them into your next available review block.',
          urgency: 'Medium',
        },
      ];
    },
  },

  // RULE R13: High Confidence But Low Syllabus (Priority 65)
  {
    id: 'R13',
    name: 'Overconfidence Gap Warning',
    category: 'Confidence',
    priority: 65,
    conditionDescription: 'IF student confidence is High (>= 4/5) but syllabus completion is Low (< 50%)',
    actionDescription: 'THEN issue an overconfidence caution; verify actual mastery through a rapid diagnostic quiz before proceeding.',
    explanation: 'Students frequently mistake familiarity with foundational topics for overall syllabus mastery, leaving unstudied units vulnerable.',
    condition: (facts) => {
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('subject_conf_') && Number(fact.value) >= 4) {
          const syllFact = facts.get(`subject_syll_${fact.subjectId}`);
          if (syllFact && Number(syllFact.value) < 50) {
            return true;
          }
        }
      }
      return false;
    },
    execute: (facts) => {
      const recs: ActionRecommendation[] = [];
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('subject_conf_') && Number(fact.value) >= 4) {
          const syllFact = facts.get(`subject_syll_${fact.subjectId}`);
          if (syllFact && Number(syllFact.value) < 50) {
            const subjectName = facts.get(`subject_name_${fact.subjectId}`)?.value || 'Subject';
            recs.push({
              type: 'OVERCONFIDENCE_CHECK',
              title: `Mastery Verification in ${subjectName}`,
              description: `Confidence is high (${fact.value}/5) while only ${syllFact.value}% of syllabus has been covered. Guard against blind spots in unstudied modules.`,
              subjectId: fact.subjectId,
              subjectName,
              suggestedAction: 'Attempt an unassisted 30-minute past question paper segment to objectively validate your current grasp.',
              urgency: 'Medium',
            });
          }
        }
      }
      return recs;
    },
  },

  // RULE R06: High Preparation (Priority 60)
  {
    id: 'R06',
    name: 'High Preparation & Mastery Protocol',
    category: 'Preparation',
    priority: 60,
    conditionDescription: 'IF preparation is High AND syllabus completion is at least 85%',
    actionDescription: 'THEN recommend full-length timed mock tests, advanced challenging problems, and detailed error analysis.',
    explanation: 'When foundational knowledge is secure, additional passive review gives diminishing returns. Rigorous simulated testing sharpens exam speed and precision.',
    condition: (facts) => {
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('subject_prep_') && fact.value === 'High') {
          const syllFact = facts.get(`subject_syll_${fact.subjectId}`);
          if (syllFact && Number(syllFact.value) >= 85) {
            return true;
          }
        }
      }
      return false;
    },
    execute: (facts) => {
      const recs: ActionRecommendation[] = [];
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('subject_prep_') && fact.value === 'High') {
          const syllFact = facts.get(`subject_syll_${fact.subjectId}`);
          if (syllFact && Number(syllFact.value) >= 85) {
            const subjectName = facts.get(`subject_name_${fact.subjectId}`)?.value || 'Subject';
            recs.push({
              type: 'ADVANCED_MASTERY',
              title: `Advanced Performance Testing: ${subjectName}`,
              description: `${subjectName} is in an advanced state (${syllFact.value}% syllabus, High prep). Shift focus from basic learning to competitive mock exams.`,
              subjectId: fact.subjectId,
              subjectName,
              suggestedAction: 'Take a 3-hour timed mock test, log every calculation mistake in an Error Journal, and review question phrasing tricks.',
              urgency: 'Low',
            });
          }
        }
      }
      return recs;
    },
  },

  // RULE R17: Practice-Heavy Learning Preference (Priority 55)
  {
    id: 'R17',
    name: 'Problem-Solving / Practice Alignment',
    category: 'Learning Strategy',
    priority: 55,
    conditionDescription: 'IF student preferred learning method emphasizes practice or problem solving',
    actionDescription: 'THEN adjust schedule composition to 65% problem-solving & numerical drills, 35% theory reading.',
    explanation: 'Aligning timetable session types with personal cognitive preference increases compliance and study flow.',
    condition: (facts) => {
      const methodFact = facts.get('profile_learning_method');
      return methodFact !== undefined && typeof methodFact.value === 'string' &&
        (methodFact.value.toLowerCase().includes('practice') || methodFact.value.toLowerCase().includes('problem') || methodFact.value.toLowerCase().includes('recall'));
    },
    execute: () => {
      return [
        {
          type: 'PRACTICE_ORIENTED_PLAN',
          title: 'Practical Application Study Blocks',
          description: 'Your study plan is customized for high-yield practical problem solving and active recall sessions.',
          suggestedAction: 'Structure each study block as 15 minutes theory recap followed by 45 minutes coding / numerical problem solving.',
          urgency: 'Medium',
        },
      ];
    },
  },

  // RULE R14: Long Daily Study Capacity >= 5 hrs (Priority 50)
  {
    id: 'R14',
    name: 'High Study Volume / Fatigue Protection (>= 5 Hours)',
    category: 'Time Management',
    priority: 50,
    conditionDescription: 'IF student available study time is 5 or more hours per day',
    actionDescription: 'THEN enforce 15-minute breaks between blocks and mandatory physical relaxation to prevent cognitive burnout.',
    explanation: 'Studying over 5 hours without structured breaks leads to severe attention decay and negative cognitive returns.',
    condition: (facts) => {
      const hoursFact = facts.get('profile_available_hours');
      return hoursFact !== undefined && Number(hoursFact.value) >= 5;
    },
    execute: (facts) => {
      const hours = facts.get('profile_available_hours')?.value || 5;
      return [
        {
          type: 'FATIGUE_PREVENTION',
          title: 'High-Volume Study Protocol (5+ Hours)',
          description: `You have ${hours} hours allocated daily. To sustain high retention, the engine inserts mandatory 10-15 minute rest intervals between sessions.`,
          suggestedAction: 'Follow a 50-minute study / 10-minute break rhythm. Do not exceed 3 hours of continuous study without a meal/walk break.',
          urgency: 'Medium',
        },
      ];
    },
  },

  // RULE R15: Morning Study Slot Preference (Priority 45)
  {
    id: 'R15',
    name: 'Morning Prime Time Allocation',
    category: 'Learning Strategy',
    priority: 45,
    conditionDescription: 'IF student preferred study time is Morning',
    actionDescription: 'THEN place highest-priority and mathematically intensive subjects during early morning hours.',
    explanation: 'Cortisol and executive function are highest during early circadian windows, making them ideal for heavy analytical workloads.',
    condition: (facts) => {
      const slotFact = facts.get('profile_preferred_slot');
      return slotFact !== undefined && slotFact.value === 'Morning';
    },
    execute: () => {
      return [
        {
          type: 'CIRCADIAN_MORNING',
          title: 'Morning Deep-Work Optimization',
          description: 'The schedule places your hardest and highest-priority subjects into the morning window (06:00 - 10:00).',
          suggestedAction: 'Tackle the most difficult analytical subject first thing in the morning when mental fatigue is at zero.',
          urgency: 'Low',
        },
      ];
    },
  },

  // RULE R16: Night / Evening Study Preference (Priority 45)
  {
    id: 'R16',
    name: 'Evening & Night Peak Optimization',
    category: 'Learning Strategy',
    priority: 45,
    conditionDescription: 'IF student preferred study time is Evening or Night',
    actionDescription: 'THEN schedule deep conceptual work in late hours and conclude with light summary flashcard review before sleep.',
    explanation: 'Studying before sleep enhances slow-wave sleep memory consolidation, provided high-caffeine stimulants are avoided.',
    condition: (facts) => {
      const slotFact = facts.get('profile_preferred_slot');
      return slotFact !== undefined && (slotFact.value === 'Night' || slotFact.value === 'Evening');
    },
    execute: (facts) => {
      const slot = facts.get('profile_preferred_slot')?.value || 'Evening';
      return [
        {
          type: 'CIRCADIAN_EVENING',
          title: `${slot} Deep-Focus Scheduling`,
          description: `Your peak study blocks are assigned to the ${slot.toLowerCase()} hours with quiet uninterrupted time.`,
          suggestedAction: 'Wrap up your night session with 15 minutes of formula/key term review before sleep to trigger sleep consolidation.',
          urgency: 'Low',
        },
      ];
    },
  },

  // RULE R20: Easy Subject Time Compression (Priority 42)
  {
    id: 'R20',
    name: 'Easy Subject Study Time Compression',
    category: 'Subject Difficulty',
    priority: 42,
    conditionDescription: 'IF a subject is explicitly flagged as Easy and other subjects require catch-up',
    actionDescription: 'THEN compress study sessions to maintenance intervals (30-40 mins) to liberate schedule headroom for harder subjects.',
    explanation: 'Over-allocating study time to easy subjects yields diminishing cognitive returns while starving difficult courses of critical preparation.',
    condition: (facts) => {
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('subject_difficulty_') && fact.value === 'Easy') {
          return true;
        }
      }
      return false;
    },
    execute: (facts) => {
      const recs: ActionRecommendation[] = [];
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('subject_difficulty_') && fact.value === 'Easy') {
          const subjectName = facts.get(`subject_name_${fact.subjectId}`)?.value || 'Easy Subject';
          recs.push({
            type: 'EASY_SUBJECT_COMPRESSION',
            title: `Optimized Maintenance for ${subjectName}`,
            description: `${subjectName} is marked Easy. Its timetable blocks are compressed to efficient 30-minute maintenance check-ins, reserving main hours for challenging subjects.`,
            subjectId: fact.subjectId,
            subjectName,
            suggestedAction: 'Use short 30-minute flashcard reviews; reallocate any saved study time to your highest priority courses.',
            urgency: 'Low',
          });
        }
      }
      return recs;
    },
  },

  // RULE R08: No Exam Date (Priority 40)
  {
    id: 'R08',
    name: 'Unscheduled Exam Milestone Strategy',
    category: 'Exam Proximity',
    priority: 40,
    conditionDescription: 'IF any subject has no examination date defined',
    actionDescription: 'THEN generate a general weekly milestone schedule and notify the student to update dates once published.',
    explanation: 'In the absence of a fixed deadline, students succumb to Parkinson\'s law. Setting artificial weekly milestones prevents procrastination.',
    condition: (facts) => {
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('subject_has_exam_date_') && fact.value === false) {
          return true;
        }
      }
      return false;
    },
    execute: (facts) => {
      const recs: ActionRecommendation[] = [];
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('subject_has_exam_date_') && fact.value === false) {
          const subjectName = facts.get(`subject_name_${fact.subjectId}`)?.value || 'Subject';
          recs.push({
            type: 'MILESTONE_PACING',
            title: `Steady Progress Milestones: ${subjectName}`,
            description: `No exam date is set for ${subjectName}. The engine generates a steady 1-chapter-per-week milestone plan.`,
            subjectId: fact.subjectId,
            subjectName,
            suggestedAction: 'Check your department academic calendar and input the tentative exam date as soon as declared.',
            urgency: 'Low',
          });
        }
      }
      return recs;
    },
  },

  // RULE R18: Balanced Academic Status (Priority 30 - Baseline)
  {
    id: 'R18',
    name: 'Balanced Performance Maintenance',
    category: 'Learning Strategy',
    priority: 30,
    conditionDescription: 'IF all subjects maintain Medium or High preparation without critical exam deadlines',
    actionDescription: 'THEN maintain a balanced cyclical revision schedule to preserve long-term retention and avoid decay.',
    explanation: 'Even well-prepared concepts decay if not revisited within 14-21 days according to the Ebbinghaus forgetting curve.',
    condition: (facts) => {
      let hasLow = false;
      let subjectCount = 0;
      for (const [key, fact] of facts.entries()) {
        if (key.startsWith('subject_prep_')) {
          subjectCount++;
          if (fact.value === 'Low') {
            hasLow = true;
          }
        }
      }
      return subjectCount > 0 && !hasLow;
    },
    execute: () => {
      return [
        {
          type: 'MAINTENANCE_REVISION',
          title: 'Cyclical Retention Protocol',
          description: 'All enrolled subjects currently show stable preparation levels. Maintain weekly rotational review to prevent concept erosion.',
          suggestedAction: 'Spend 30 minutes every weekend summarizing one previous chapter per subject using mind maps.',
          urgency: 'Low',
        },
      ];
    },
  },
];

import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeSubjectPriority, rankSubjectsByPriority } from './priority.ts';
import { InferenceEngine } from './engine.ts';
import { generateWeeklyStudyPlan, getTodaysTasks, rescheduleMissedTasks } from './planner.ts';
import type { Subject, StudentProfile, Examination } from './types.ts';

// Mock sample student for testing
const mockStudent: StudentProfile = {
  name: 'Samruddhi',
  course: 'B.E. Computer Engineering',
  academicYear: 'Third Year (TE)',
  semester: 'Semester VI',
  availableHoursPerDay: 3,
  preferredTimeSlot: 'Morning',
  preferredLearningMethod: 'Active Recall & Practice',
  personalGoals: 'Target Distinction & Clear Concepts',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  subjects: [
    {
      id: 'sub-dbms',
      name: 'Database Management Systems',
      code: 'CS301',
      preparationLevel: 'Low',
      confidenceLevel: 2,
      syllabusCompletion: 40,
      previousMarks: undefined, // Missing marks test
      examDate: '2026-10-23', // 5 days away from 2026-10-18
      difficulty: 'Difficult',
      isDifficult: true,
    },
    {
      id: 'sub-os',
      name: 'Operating Systems',
      code: 'CS302',
      preparationLevel: 'Medium',
      confidenceLevel: 3,
      syllabusCompletion: 70,
      previousMarks: 65,
      examDate: '2026-10-30', // 12 days away
      difficulty: 'Moderate',
      isDifficult: false,
    },
    {
      id: 'sub-sepm',
      name: 'Software Engineering & Project Management',
      code: 'CS303',
      preparationLevel: 'High',
      confidenceLevel: 5,
      syllabusCompletion: 92,
      previousMarks: 82,
      difficulty: 'Easy',
      isDifficult: false,
    },
  ],
};

const mockExams: Examination[] = [
  {
    id: 'exam-1',
    subjectId: 'sub-dbms',
    subjectName: 'Database Management Systems',
    examDate: '2026-10-21', // 3 days away to test R25 sprint
    examFormat: 'Problem-Solving / Technical',
    syllabusRemaining: 60,
    confidenceLevel: 2,
  },
];

const referenceDate = new Date('2026-10-18T10:00:00Z');

test('Subject Priority: calculates transparent score and never treats missing marks as zero', () => {
  const dbmsSubject = mockStudent.subjects[0];
  const analysis = analyzeSubjectPriority(dbmsSubject, referenceDate);

  // Assert missing marks are flagged
  assert.equal(analysis.hasMissingMarks, true, 'Should detect missing previous marks');

  // Find historical marks breakdown
  const marksBreakdown = analysis.breakdown.find((b) => b.factor === 'Historical Marks');
  assert.ok(marksBreakdown, 'Should include historical marks factor in breakdown');
  assert.equal(marksBreakdown?.points, 0, 'Missing marks should contribute 0 points (no penalty)');
  assert.match(marksBreakdown?.reason || '', /strictly not treated as zero/i);

  // DBMS has: Low prep (+30), Conf 2 (+18), Syll 40% (+25), Difficult (+15)
  assert.ok(analysis.totalScore >= 65, `Expected High Priority score (>=65), got ${analysis.totalScore}`);
  assert.equal(analysis.tier, 'High Priority');
});

test('Subject Priority: incorporates explicit Difficult and Easy weights', () => {
  const difficultSub = mockStudent.subjects[0]; // DBMS
  const easySub = mockStudent.subjects[2]; // SEPM

  const diffAnalysis = analyzeSubjectPriority(difficultSub, referenceDate);
  const easyAnalysis = analyzeSubjectPriority(easySub, referenceDate);

  const diffFactor = diffAnalysis.breakdown.find((b) => b.factor === 'Subject Difficulty Flag');
  const easyFactor = easyAnalysis.breakdown.find((b) => b.factor === 'Subject Difficulty Flag');

  assert.equal(diffFactor?.points, 15, 'Difficult subject should receive +15 points');
  assert.equal(easyFactor?.points, -10, 'Easy subject should receive -10 points');
  assert.equal(easyAnalysis.tier, 'Low Priority', 'Easy subject with high prep should be Low Priority');
});

test('Subject Priority: ranking orders subjects correctly by urgency', () => {
  const ranked = rankSubjectsByPriority(mockStudent.subjects, referenceDate);
  assert.equal(ranked.length, 3);
  assert.equal(ranked[0].subjectName, 'Database Management Systems', 'DBMS with low prep, difficult tag, and upcoming exam should rank #1');
  assert.ok(ranked[0].totalScore > ranked[1].totalScore, 'Rank 1 score should exceed Rank 2');
  assert.ok(ranked[1].totalScore > ranked[2].totalScore, 'Rank 2 score should exceed Rank 3');
});

test('Inference Engine: loads domain facts and fires rules deterministically including Difficulty and Exam Format rules', () => {
  const engine = new InferenceEngine();
  const facts = engine.loadFacts(mockStudent, mockExams, 1, referenceDate);

  assert.ok(facts.length > 10, 'Should load multiple facts into working memory');

  const result = engine.infer();
  assert.ok(result.firedRules.length >= 4, `Expected at least 4 rules to fire, got ${result.firedRules.length}`);

  const firedIds = result.firedRules.map((r) => r.ruleId);

  // R01 (Low Preparation)
  assert.ok(firedIds.includes('R01'), 'Rule R01 (Low Preparation) should fire for DBMS');

  // R19 (Difficult Subject Priority Allocation)
  assert.ok(firedIds.includes('R19'), 'Rule R19 (Difficult Subject) should fire for DBMS');

  // R20 (Easy Subject Time Compression)
  assert.ok(firedIds.includes('R20'), 'Rule R20 (Easy Subject Compression) should fire for SEPM');

  // R25 (Technical Problem-Solving <= 3 Days) or R21
  assert.ok(firedIds.includes('R25') || firedIds.includes('R21'), 'Technical exam rules (R25/R21) should fire for DBMS');

  // R09 (Missed Session)
  assert.ok(firedIds.includes('R09'), 'Rule R09 (Missed Session) should fire');

  // Verify each recommendation has explainable AI properties
  for (const rec of result.recommendations) {
    assert.ok(rec.triggeredRuleIds.length > 0, 'Recommendation must specify triggered rule IDs');
    assert.ok(rec.explanation.length > 0, 'Recommendation must provide explainable reason');
    assert.ok(rec.factsConsidered.length > 0, 'Recommendation must list facts considered');
  }
});

test('Forward Chaining Simulation: generates complete 5-step demonstration trace', () => {
  const engine = new InferenceEngine();
  engine.loadFacts(mockStudent, mockExams, 0, referenceDate);
  const steps = engine.generateDemonstrationSteps();

  assert.equal(steps.length, 5, 'Should generate exactly 5 steps for forward chaining viva demo');
  assert.equal(steps[0].stepNumber, 1, 'Step 1 should be Fact Collection');
  assert.equal(steps[1].stepNumber, 2, 'Step 2 should be Rule Matching');
  assert.equal(steps[2].stepNumber, 3, 'Step 3 should be Conflict Resolution');
  assert.equal(steps[3].stepNumber, 4, 'Step 4 should be Rule Execution');
  assert.equal(steps[4].stepNumber, 5, 'Step 5 should be Final Synthesis');
});

test('Study Planner: generates non-overlapping schedule respecting daily available hours', () => {
  const { weeklyTasks, dailyAllocatedMinutes } = generateWeeklyStudyPlan(mockStudent, referenceDate);

  assert.ok(weeklyTasks.length > 0, 'Weekly tasks should be generated');

  // Check daily limit constraint: 3 hours available -> max 180 study minutes
  assert.ok(
    dailyAllocatedMinutes <= mockStudent.availableHoursPerDay * 60,
    `Allocated daily study minutes (${dailyAllocatedMinutes}) must not exceed available (${mockStudent.availableHoursPerDay * 60})`
  );

  // Group tasks by day and verify NO overlaps
  const tasksByDay = new Map<number, typeof weeklyTasks>();
  for (const task of weeklyTasks) {
    const list = tasksByDay.get(task.dayIndex) || [];
    list.push(task);
    tasksByDay.set(task.dayIndex, list);
  }

  for (const [day, dayTasks] of tasksByDay.entries()) {
    // Sort by startTime
    dayTasks.sort((a, b) => a.startTime.localeCompare(b.startTime));
    for (let i = 0; i < dayTasks.length - 1; i++) {
      const current = dayTasks[i];
      const next = dayTasks[i + 1];
      assert.ok(
        current.endTime <= next.startTime,
        `Day ${day}: Overlapping tasks detected between ${current.subjectName} (${current.startTime}-${current.endTime}) and ${next.startTime}`
      );
    }
  }

  // Today's tasks helper
  const todays = getTodaysTasks(weeklyTasks, referenceDate);
  assert.ok(Array.isArray(todays), "Today's tasks should return an array");
});

test('Study Planner: rescheduleMissedTasks adapts incomplete tasks into weekend buffer', () => {
  const { weeklyTasks } = generateWeeklyStudyPlan(mockStudent, referenceDate);
  const firstTask = weeklyTasks[0];
  const rescheduled = rescheduleMissedTasks(weeklyTasks, [firstTask.id]);

  const target = rescheduled.find((t) => t.id === firstTask.id);
  assert.ok(target, 'Rescheduled task must exist');
  assert.match(target?.topic || '', /Rescheduled/i, 'Task topic should indicate rescheduled status');
  assert.equal(target?.dayName, 'Sunday', 'Missed task during week should be rescheduled to buffer day');
});

test('UCI ML Model: trains Linear Regression via Gradient Descent on student-mat.csv dataset', async () => {
  const { getUciBenchmarkDataset } = await import('../ml-model/uci-dataset.ts');
  const { trainUciStudentModel } = await import('../ml-model/uci-trainer.ts');

  const mathData = getUciBenchmarkDataset('Math');
  assert.equal(mathData.length, 395, 'Math cohort should have 395 instances');

  const model = trainUciStudentModel(mathData, {
    modelType: 'linear_regression',
    learningRate: 0.08,
    epochs: 50,
    trainSplitRatio: 0.8,
  });

  assert.ok(model.metrics.testR2 > 0.7, 'Test R^2 score should exceed 0.70');
  assert.ok(model.metrics.testMae < 3.5, 'Test MAE should be under 3.5 marks');

  // Test prediction on high-performing student
  const highInputs = [1, 0, 16 / 20, 17 / 20, 0, 1, 1, 1, 0, 1];
  const highPred = model.predictG3(highInputs);
  assert.ok(highPred.predictedGrade >= 12, 'High performer should have predicted grade >= 12');
  assert.equal(highPred.isAtRisk, false, 'High performer should not be at risk');

  // Test prediction on struggling student with failures
  const lowInputs = [0, 1, 6 / 20, 6 / 20, 0.6, 0.2, 0, 0, 0.5, 0.5];
  const lowPred = model.predictG3(lowInputs);
  assert.ok(lowPred.predictedGrade < 11, 'Struggling student should have low predicted grade');
});

test('UCI ML Model: trains Neural Network with Backpropagation on student-por.csv dataset', async () => {
  const { getUciBenchmarkDataset } = await import('../ml-model/uci-dataset.ts');
  const { trainUciStudentModel } = await import('../ml-model/uci-trainer.ts');

  const porData = getUciBenchmarkDataset('Portuguese');
  assert.equal(porData.length, 649, 'Portuguese cohort should have 649 instances');

  const model = trainUciStudentModel(porData, {
    modelType: 'neural_network',
    learningRate: 0.06,
    epochs: 40,
    trainSplitRatio: 0.8,
  });

  assert.ok(model.history.length === 40, 'History should log all 40 epochs');
  assert.ok(model.metrics.testMse > 0, 'Test MSE must be positive');
  assert.ok(typeof model.predictG3 === 'function', 'Model must export predictG3 function');
});

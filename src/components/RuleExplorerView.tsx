import React, { useState } from 'react';
import {
  BookOpenCheck,
  Search,
  Filter,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Tag,
} from 'lucide-react';
import { KNOWLEDGE_BASE_RULES } from '../expert-system/rules.ts';
import { InferenceEngine } from '../expert-system/engine.ts';
import type { StudentProfile, RuleCategory } from '../expert-system/types.ts';

export const RuleExplorerView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);

  // Scenario Sandbox State
  const [selectedScenario, setSelectedScenario] = useState<string>('scenario_critical_exam');
  const [sandboxResult, setSandboxResult] = useState<any | null>(null);

  const categories: Array<RuleCategory | 'all'> = [
    'all',
    'Exam Proximity',
    'Preparation',
    'Confidence',
    'Syllabus',
    'Time Management',
    'Learning Strategy',
    'Session Rescheduling',
  ];

  const filteredRules = KNOWLEDGE_BASE_RULES.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.conditionDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.actionDescription.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedCategory === 'all') return true;
    return r.category === selectedCategory;
  });

  const runScenarioSimulation = (scenarioKey: string) => {
    setSelectedScenario(scenarioKey);
    const engine = new InferenceEngine();

    let mockProfile: StudentProfile;

    if (scenarioKey === 'scenario_critical_exam') {
      // Exam in 2 days + Low prep + 2.5h available
      mockProfile = {
        name: 'Scenario 1 Student',
        course: 'B.E. Computer Engineering',
        academicYear: 'Third Year (TE)',
        semester: 'Sem VI',
        availableHoursPerDay: 2.5,
        preferredTimeSlot: 'Morning',
        preferredLearningMethod: 'Active Recall & Practice',
        personalGoals: 'Pass imminent exam',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subjects: [
          {
            id: 'scen-sub-1',
            name: 'Database Management Systems',
            preparationLevel: 'Low',
            confidenceLevel: 1,
            syllabusCompletion: 45,
            examDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], // 2 days away
            difficulty: 'Difficult',
            isDifficult: true,
          },
        ],
      };
      engine.loadFacts(mockProfile, [], 0);
    } else if (scenarioKey === 'scenario_constrained_time') {
      // 1.5h daily study budget + 3 difficult subjects
      mockProfile = {
        name: 'Scenario 2 Student',
        course: 'B.E. Computer Engineering',
        academicYear: 'Third Year (TE)',
        semester: 'Sem VI',
        availableHoursPerDay: 1.5,
        preferredTimeSlot: 'Night',
        preferredLearningMethod: 'Concept Outlines',
        personalGoals: 'Balance workload',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subjects: [
          {
            id: 'scen-sub-1',
            name: 'Theory of Computation',
            preparationLevel: 'Low',
            confidenceLevel: 2,
            syllabusCompletion: 30,
            difficulty: 'Difficult',
            isDifficult: true,
          },
          {
            id: 'scen-sub-2',
            name: 'Distributed Systems',
            preparationLevel: 'Low',
            confidenceLevel: 2,
            syllabusCompletion: 35,
            difficulty: 'Difficult',
            isDifficult: true,
          },
        ],
      };
      engine.loadFacts(mockProfile, [], 2); // 2 missed sessions
    } else if (scenarioKey === 'scenario_anxiety_gap') {
      // High syllabus (80%) but Low Confidence (2/5) -> R10 triggers
      mockProfile = {
        name: 'Scenario 3 Student',
        course: 'B.E. Computer Engineering',
        academicYear: 'Third Year (TE)',
        semester: 'Sem VI',
        availableHoursPerDay: 4,
        preferredTimeSlot: 'Evening',
        preferredLearningMethod: 'Active Recall',
        personalGoals: 'Mastery without anxiety',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subjects: [
          {
            id: 'scen-sub-1',
            name: 'Computer Networks',
            preparationLevel: 'Medium',
            confidenceLevel: 2,
            syllabusCompletion: 82,
            difficulty: 'Moderate',
            isDifficult: false,
          },
        ],
      };
      engine.loadFacts(mockProfile, [], 0);
    } else {
      // Mastery student (High prep, 95% syllabus) -> R06 triggers
      mockProfile = {
        name: 'Scenario 4 Student',
        course: 'B.E. Computer Engineering',
        academicYear: 'Third Year (TE)',
        semester: 'Sem VI',
        availableHoursPerDay: 5,
        preferredTimeSlot: 'Morning',
        preferredLearningMethod: 'Problem Solving & Mock Tests',
        personalGoals: 'University Rank 1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subjects: [
          {
            id: 'scen-sub-1',
            name: 'Operating Systems',
            preparationLevel: 'High',
            confidenceLevel: 5,
            syllabusCompletion: 95,
            difficulty: 'Easy',
            isDifficult: false,
          },
        ],
      };
      engine.loadFacts(mockProfile, [], 0);
    }

    const res = engine.infer();
    setSandboxResult(res);
  };

  const toggleExpand = (id: string) => {
    setExpandedRuleId(expandedRuleId === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <BookOpenCheck className="w-4 h-4" />
          <span>Complete Knowledge Base Inspection</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Production Rule Explorer & Scenario Sandbox
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Inspect all {KNOWLEDGE_BASE_RULES.length} declarative IF–THEN production rules encoded in the expert system. You can test preset scenarios to observe live pattern matching and conflict resolution firing orders.
        </p>
      </div>

      {/* Scenario Sandbox Component */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white border border-indigo-800/50 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Interactive Scenario Sandbox</span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              Simulate How Rules Fire Under Custom Student Conditions
            </h3>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedScenario}
              onChange={(e) => runScenarioSimulation(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
            >
              <option value="scenario_critical_exam">Scenario 1: Critical Exam in 2 Days + Low Prep</option>
              <option value="scenario_constrained_time">Scenario 2: Constrained 1.5h Day + Multiple Difficult Subjects</option>
              <option value="scenario_anxiety_gap">Scenario 3: High Syllabus (82%) But Low Confidence (2/5)</option>
              <option value="scenario_mastery">Scenario 4: High Preparation (95%) & 5h Budget</option>
            </select>

            <button
              onClick={() => runScenarioSimulation(selectedScenario)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Run Inference</span>
            </button>
          </div>
        </div>

        {sandboxResult && (
          <div className="p-4 rounded-xl bg-slate-950/70 border border-indigo-900/60 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold border-b border-indigo-900/60 pb-2">
              <span>Fired Rules ({sandboxResult.firedRules.length} Rules Executed):</span>
              <span className="font-mono text-amber-400">
                Firing Sequence: [ {sandboxResult.firedRules.map((r: any) => r.ruleId).join(' &rarr; ')} ]
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {sandboxResult.firedRules.map((r: any) => (
                <div
                  key={r.ruleId}
                  className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-800/40 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-400">
                      {r.ruleId} (Priority: {r.priority})
                    </span>
                    <span className="text-[10px] text-indigo-300">{r.category}</span>
                  </div>
                  <div className="font-bold text-white text-xs">{r.ruleName}</div>
                  <p className="text-[11px] text-slate-300">{r.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search rules, IF / THEN clauses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Rules Table / Catalog */}
      <div className="space-y-3">
        {filteredRules.map((rule) => {
          const isExpanded = expandedRuleId === rule.id;

          return (
            <div
              key={rule.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-9 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-mono font-bold text-xs flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                    {rule.id}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {rule.name}
                      </h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {rule.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
                    Priority: <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{rule.priority}</span>
                  </span>
                  <button
                    onClick={() => toggleExpand(rule.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    aria-label="Toggle rule details"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* IF - THEN Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">
                    IF Condition (Precondition)
                  </span>
                  <p className="text-slate-800 dark:text-slate-200">
                    {rule.conditionDescription}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                    THEN Action (Postcondition)
                  </span>
                  <p className="text-slate-800 dark:text-slate-200">
                    {rule.actionDescription}
                  </p>
                </div>
              </div>

              {/* Expanded Explanation */}
              {isExpanded && (
                <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50 text-xs space-y-1 animate-in fade-in duration-200">
                  <span className="font-bold text-indigo-900 dark:text-indigo-300">
                    Cognitive & Educational Rationale:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {rule.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

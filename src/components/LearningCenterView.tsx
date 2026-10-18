import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Cpu,
  Database,
  GitBranch,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const LearningCenterView: React.FC = () => {
  const [activeVivaQuestion, setActiveVivaQuestion] = useState<number | null>(null);

  const vivaQuestions = [
    {
      q: '1. What is an Expert System and how does it differ from traditional software?',
      a: 'An Expert System is a domain-specific AI program that emulates the decision-making ability of a human expert. Unlike traditional procedural software where logic and data are tightly coupled in code, an expert system strictly decouples the Knowledge Base (IF–THEN production rules) from the Inference Engine (the domain-independent reasoning mechanism).',
    },
    {
      q: '2. What is the difference between Forward Chaining and Backward Chaining?',
      a: 'Forward Chaining is data-driven reasoning: it starts from known facts in Working Memory, tests rule preconditions, and moves forward to infer new conclusions (used in planning, synthesis, and EduGuide AI). Backward Chaining is goal-driven reasoning: it starts with a hypothesis or goal state and works backward to see if supporting evidence exists in Working Memory (used in medical and fault diagnosis).',
    },
    {
      q: '3. What is Conflict Resolution and why is it needed?',
      a: 'In forward chaining, multiple rules often have their IF preconditions satisfied simultaneously (forming the "Conflict Set"). Conflict Resolution is the strategy used to determine which rule executes first. Common strategies include Priority Ranking (highest priority score first, as used in EduGuide AI), Specificity (most specific condition fires first), and Recency (rules matching newest facts fire first).',
    },
    {
      q: '4. What is Working Memory in an Expert System?',
      a: 'Working Memory is the short-term volatile knowledge store representing the current state of the domain. It holds asserted ground facts (e.g., student course, subject preparation level, exam proximity) and intermediate derived conclusions. The inference engine matches rule preconditions against Working Memory.',
    },
    {
      q: '5. Why are missing marks NOT treated as zero in EduGuide AI?',
      a: 'In academic assessment, an omitted or missing past mark represents "missing information", not a score of 0%. Treating missing values as zero would severely penalize students and distort priority rankings. EduGuide AI explicitly preserves missing values without penalty, fulfilling the project\'s deterministic integrity requirement.',
    },
    {
      q: '6. What are the advantages of Rule-Based AI over Deep Learning for academic advising?',
      a: '1) 100% Explainability (white-box reasoning): every advice item maps to exact rules. 2) Determinism: identical student inputs always produce identical schedules. 3) Zero Training Data requirement: does not suffer from data bias or hallucinatory output. 4) Zero Cloud API Dependency: runs safely client-side in the browser.',
    },
    {
      q: '7. What are the limitations of Rule-Based Expert Systems?',
      a: '1) Knowledge Acquisition Bottleneck: rules must be manually engineered by human experts. 2) Brittleness: struggles outside predefined conditions without fuzzy logic. 3) Scalability limits: managing thousands of interacting rules can lead to combinatorial explosion.',
    },
    {
      q: '8. What is Explainable AI (XAI) and how does EduGuide AI achieve it?',
      a: 'Explainable AI refers to AI systems whose decisions can be easily inspected, traced, and understood by humans. EduGuide AI achieves complete explainability via an Inference Trace that records the exact working memory facts evaluated, triggered rule IDs (e.g. R01, R04), conditions satisfied, and plain-English deduction justifications.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <GraduationCap className="w-4 h-4" />
          <span>Computer Engineering Mini-Project Curriculum</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Rule-Based AI & Expert Systems Learning Center
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Comprehensive theoretical foundation for Third-Year Computer Engineering presentations, viva voce examinations, and academic demonstrations.
        </p>
      </div>

      {/* Key Concepts Grid (10 Core Concepts) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. AI */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <Cpu className="w-4 h-4" />
            <span>1. Artificial Intelligence (Symbolic vs Sub-Symbolic)</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            AI is divided into <strong>Symbolic AI</strong> (classical rule-based logic, expert systems, ontologies) and <strong>Sub-symbolic AI</strong> (neural networks, statistical learning). Symbolic AI operates on explicit, human-readable symbols and deterministic logic rules.
          </p>
        </div>

        {/* 2. Rule-Based AI */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <BookOpen className="w-4 h-4" />
            <span>2. Rule-Based Systems</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            A system whose intelligence is encoded as a collection of declarative <code>IF &lt;preconditions&gt; THEN &lt;actions&gt;</code> statements. It operates without probabilistic guesswork or iterative gradient descent.
          </p>
        </div>

        {/* 3. Expert System Components */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <Layers className="w-4 h-4" />
            <span>3. Classic Expert System Architecture</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Consists of five distinct components: 1) User Interface, 2) Working Memory, 3) Knowledge Base, 4) Inference Engine, and 5) Explanation Facility (Explainable AI module).
          </p>
        </div>

        {/* 4. Knowledge Base */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <Database className="w-4 h-4" />
            <span>4. Knowledge Base (Long-Term Storage)</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            The authoritative repository of domain rules elicited from pedagogical experts (e.g. "If exam is in &le; 3 days, switch to timed past papers"). In EduGuide AI, 18 executable rules form the knowledge base.
          </p>
        </div>

        {/* 5. Working Memory */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <Cpu className="w-4 h-4" />
            <span>5. Working Memory (Short-Term Store)</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Contains dynamic facts asserted during a session (e.g., student available hours = 3.5, DBMS preparation = Low, exam in 5 days). The inference engine reads and writes to working memory dynamically.
          </p>
        </div>

        {/* 6. Forward Chaining */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <GitBranch className="w-4 h-4" />
            <span>6. Forward Chaining (Data-Driven)</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            A bottom-up reasoning strategy: begins with given facts in Working Memory, executes matching rules, adds derived facts to memory, and repeats until goal recommendations are synthesized.
          </p>
        </div>
      </div>

      {/* Comparison Table: Rule-Based Systems vs Machine Learning (Viva Favorite) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Comparison: Rule-Based Expert Systems vs. Machine Learning
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            A standard Third-Year Computer Engineering viva evaluation comparison
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold">
                <th className="p-3">Evaluation Parameter</th>
                <th className="p-3 text-indigo-600 dark:text-indigo-400">Rule-Based Expert System</th>
                <th className="p-3 text-purple-600 dark:text-purple-400">Machine Learning (ML / LLM)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
              <tr>
                <td className="p-3 font-semibold">1. Reasoning Paradigm</td>
                <td className="p-3">Deterministic symbolic deduction (IF-THEN)</td>
                <td className="p-3">Statistical pattern recognition / probability</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">2. Transparency & Explainability</td>
                <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">
                  100% White-Box (exact rules traceable)
                </td>
                <td className="p-3 text-rose-600 dark:text-rose-400">
                  Black-Box / Hallucination Risk
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">3. Training Data Requirement</td>
                <td className="p-3">Zero datasets needed; encodes domain heuristics</td>
                <td className="p-3">Requires thousands of labeled training samples</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">4. Execution Determinism</td>
                <td className="p-3">Guaranteed identical output for identical inputs</td>
                <td className="p-3">Probabilistic; varies with temperature/seed</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">5. Offline & Privacy Constraints</td>
                <td className="p-3">Runs 100% client-side without cloud APIs</td>
                <td className="p-3">Usually requires cloud GPU inference endpoints</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">6. Suitability for Academic Plans</td>
                <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">
                  Ideal for rigid scheduling & verified constraints
                </td>
                <td className="p-3">Ideal for creative writing & free-form dialogue</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* College Viva Q&A Accordion (8 Essential Questions) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>College Mini-Project Viva Q&A Preparation Guide</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Top questions frequently asked by external examiners during Third-Year AI project evaluations
          </p>
        </div>

        <div className="space-y-2.5">
          {vivaQuestions.map((item, idx) => {
            const isOpen = activeVivaQuestion === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 overflow-hidden"
              >
                <button
                  onClick={() => setActiveVivaQuestion(isOpen ? null : idx)}
                  className="w-full p-3.5 text-left text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <span>{item.q}</span>
                  <span className="text-indigo-600 font-mono">{isOpen ? '▲' : '▼'}</span>
                </button>
                {isOpen && (
                  <div className="p-3.5 pt-0 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-800">
                    <p className="mt-2">{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

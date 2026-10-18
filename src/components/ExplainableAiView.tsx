import React, { useState } from 'react';
import {
  HelpCircle,
  Brain,
  CheckCircle2,
  ArrowRight,
  Database,
  GitBranch,
  ShieldAlert,
  Search,
} from 'lucide-react';
import type { InferenceResult } from '../expert-system/types.ts';

interface ExplainableAiViewProps {
  inferenceResult: InferenceResult | null;
}

export const ExplainableAiView: React.FC<ExplainableAiViewProps> = ({
  inferenceResult,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (!inferenceResult) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <p className="text-slate-500">No active inference trace. Save a profile to run inference.</p>
      </div>
    );
  }

  const { recommendations, firedRules, conflictResolutionLog, facts } = inferenceResult;

  const filteredRecs = recommendations.filter((rec) => {
    const matchesSearch =
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.triggeredRuleIds.some((id) => id.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;
    if (selectedCategory === 'all') return true;
    return rec.urgency === selectedCategory;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Transparent Rule Audit & XAI Proofs</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Explainable AI (XAI) Recommendation Inspector
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Unlike "black-box" machine learning algorithms, this Rule-Based Expert System produces completely verifiable, transparent inference paths. Every recommendation below maps directly to asserted Working Memory facts and fired production rules.
        </p>
      </div>

      {/* Inference Audit Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500 block mb-1">Working Memory Facts</span>
          <span className="text-xl font-mono font-bold text-slate-900 dark:text-white">
            {facts.length}
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500 block mb-1">Knowledge Base Rules</span>
          <span className="text-xl font-mono font-bold text-slate-900 dark:text-white">
            {inferenceResult.evaluatedRulesCount}
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500 block mb-1">Rules Fired</span>
          <span className="text-xl font-mono font-bold text-indigo-600 dark:text-indigo-400">
            {firedRules.length}
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500 block mb-1">Directives Deduced</span>
          <span className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {recommendations.length}
          </span>
        </div>
      </div>

      {/* Conflict Resolution Audit Log */}
      <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 space-y-1.5 text-xs">
        <span className="font-bold text-indigo-900 dark:text-indigo-300 block">
          Inference Engine Conflict Resolution Trace:
        </span>
        {conflictResolutionLog.map((log, idx) => (
          <p key={idx} className="font-mono text-[11px] text-indigo-800 dark:text-indigo-300">
            &gt; {log}
          </p>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search rules, subjects, or actions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-center">
          {['all', 'High', 'Medium', 'Low'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat === 'all' ? 'All Urgencies' : `${cat} Urgency`}
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Recommendation Proof Cards */}
      <div className="space-y-4">
        {filteredRecs.map((rec, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Conclusion #{index + 1}
                  </span>
                  {rec.triggeredRuleIds.map((rId) => (
                    <span
                      key={rId}
                      className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                    >
                      Rule {rId} Fired
                    </span>
                  ))}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rec.urgency === 'High'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        : rec.urgency === 'Medium'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}
                  >
                    {rec.urgency} Urgency
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {rec.title}
                </h3>
              </div>
            </div>

            {/* Facts Considered Ledger */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Working Memory Facts Evaluated:
              </span>
              <div className="flex flex-wrap gap-2">
                {rec.factsConsidered.map((fact, fIdx) => (
                  <div
                    key={fIdx}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                  >
                    <span className="text-slate-500 dark:text-slate-400">{fact.label}:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {String(fact.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Conditions Satisfied */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Knowledge Base Preconditions Satisfied:
              </span>
              <div className="space-y-1">
                {rec.satisfiedConditions.map((cond, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300"
                  >
                    {cond}
                  </div>
                ))}
              </div>
            </div>

            {/* Natural Deduction Reasoning */}
            <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 space-y-1 text-xs">
              <span className="font-bold text-indigo-900 dark:text-indigo-300 block">
                Rule Justification & Theoretical Explanation:
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {rec.explanation}
              </p>
            </div>

            {/* Concrete Actionable Directive */}
            <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Suggested Actionable Next Step:</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {rec.suggestedAction}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

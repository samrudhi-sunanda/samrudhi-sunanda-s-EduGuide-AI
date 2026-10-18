import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  RotateCcw,
  Bot,
  User,
  Zap,
  Brain,
  HelpCircle,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';
import type { StudentProfile } from '../expert-system/types.ts';

interface Message {
  id: string;
  sender: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface GeminiMentorViewProps {
  profile: StudentProfile | null;
}

export const GeminiMentorView: React.FC<GeminiMentorViewProps> = ({ profile }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome_1',
      sender: 'model',
      text: `Hello ${
        profile?.name || 'Engineer'
      }! I am your **EduGuide AI Academic Mentor & Viva Coach**.\n\nI can help you review your study plan, explain Expert System concepts (Forward Chaining, Conflict Resolution, Working Memory), or conduct a mock viva examination for your mini-project. How can I assist your study preparation today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'standard' | 'fast' | 'thinking'>('standard');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const promptChips = [
    'Simulate a tough college viva question on Conflict Resolution',
    'How do Rules R19 & R20 rebalance study time for Difficult vs Easy subjects?',
    'Review my exam strategies for technical vs essay-type examinations',
    'Explain the role of Working Memory in Forward Chaining',
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputPrompt('');
    setIsLoading(true);

    try {
      // Build context system prompt incorporating student's current profile
      const systemPrompt = `You are the EduGuide AI Academic Mentor and External Viva Examiner for a Third-Year Computer Engineering student named ${
        profile?.name || 'Student'
      } studying ${profile?.course || 'Computer Engineering'} (${profile?.semester || 'Semester VI'}).
The student has ${profile?.subjects.length || 0} enrolled subjects: ${profile?.subjects
        .map((s) => `${s.name} (${s.preparationLevel} prep, ${s.difficulty || 'Moderate'} difficulty)`)
        .join(', ')}.
Available daily study time: ${profile?.availableHoursPerDay || 3} hours.
Preferred study slot: ${profile?.preferredTimeSlot || 'Morning'}.
You are an expert in Artificial Intelligence, Expert Systems (Knowledge Base, Inference Engine, Forward Chaining, Conflict Resolution, XAI).
Provide technically rigorous, encouraging, structured answers with markdown formatting.`;

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: newHistory.map((m) => ({ role: m.sender, text: m.text })),
          mode,
          systemPrompt,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const botMessage: Message = {
        id: `msg_bot_${Date.now()}`,
        sender: 'model',
        text: data.reply || 'No response returned from mentor.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: unknown) {
      console.error('Chat error:', err);
      const errMsg = err instanceof Error ? err.message : 'Connection failed';
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          sender: 'model',
          text: `[Advisor Notice] EduGuide Expert System is operating locally. Note: ${errMsg}. Remember that all rule evaluations, subject priority scores, and timetable allocations run 100% deterministically in your browser without requiring external server calls!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome_new',
        sender: 'model',
        text: 'Conversation reset. What AI or academic topic would you like to explore next?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Gemini AI Academic Mentor & Viva Coach
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                Multi-Turn
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive AI companion for academic timetable advice and mini-project viva prep
            </p>
          </div>
        </div>

        {/* Mode Selector & Reset */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 text-xs font-semibold">
            <button
              onClick={() => setMode('standard')}
              className={`px-2.5 py-1 rounded-lg transition ${
                mode === 'standard'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
              title="gemini-3.8-flash"
            >
              Mentor
            </button>
            <button
              onClick={() => setMode('fast')}
              className={`px-2.5 py-1 rounded-lg transition ${
                mode === 'fast'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
              title="gemini-3.1-flash-lite"
            >
              Fast
            </button>
            <button
              onClick={() => setMode('thinking')}
              className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                mode === 'thinking'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
              title="Deep Thinking Viva Examiner"
            >
              <Brain className="w-3 h-3 text-purple-500" />
              <span>Thinking</span>
            </button>
          </div>

          <button
            onClick={handleClearHistory}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Thread Container */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs h-[520px] flex flex-col justify-between">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'model' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs text-xs mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-xs shadow-sm shadow-indigo-600/20'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 rounded-bl-xs border border-slate-200/80 dark:border-slate-700/80'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`text-[10px] mt-2 font-mono text-right ${
                    msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 text-xs mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs text-xs mt-0.5 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-slate-500 rounded-bl-xs border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                <span>EduGuide Mentor is analyzing your prompt...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Bottom Input Area */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          {/* Suggestion Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {promptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-600 dark:text-slate-300 hover:text-indigo-600 text-[11px] whitespace-nowrap transition border border-slate-200 dark:border-slate-700 shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask mentor about study planning, exam strategies, or viva questions..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

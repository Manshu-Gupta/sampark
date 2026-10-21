import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileText,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: string[];
  mode?: string;
  model?: string;
}

export const ComplianceCopilot: React.FC = () => {
  const { applications, currentUser, selectedApplicationId, setSelectedApplicationId, setActiveTab } =
    useApp();

  const [activeAppId, setActiveAppId] = useState<string>(
    selectedApplicationId || applications[0]?.id || 'AICTE-DEMO-2026-001'
  );

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: `Hello, ${currentUser.name}! I am the **AICTE Compliance Copilot**, your grounded decision-support assistant for Approval Process Handbook (APH 2026-27) regulations.\n\nI can explain why applications are returned, list pending documents, summarize case history, and break down statutory norms.\n\n*Note: AI assistance provides advisory explanations only. All statutory approval decisions remain with authorized AICTE officials.*`,
      timestamp: 'Just now',
      citations: ['AICTE Approval Process Handbook (APH) 2026-27'],
      mode: 'grounded-assistant',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeApp = applications.find((a) => a.id === activeAppId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const presetQueries = [
    'Why was this application returned by scrutiny?',
    'What documents are still pending or expiring?',
    'Why is this application flagged with delay risk?',
    'Summarise the application history and key events.',
    'Which administrative action is required next?',
    'Explain Land and Building Norms under APH Chapter II.',
  ];

  const handleSendMessage = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim() || loading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          applicationContext: activeApp
            ? {
                id: activeApp.id,
                institutionId: activeApp.institutionId,
                institutionName: activeApp.institutionName,
                type: activeApp.type,
                currentStage: activeApp.currentStage,
                submissionDate: activeApp.submissionDate,
                stageDeadline: activeApp.stageDeadline,
                daysInCurrentStage: activeApp.daysInCurrentStage,
                assignedOfficerName: activeApp.assignedOfficerName,
                delayRisk: activeApp.delayRisk,
                observations: activeApp.scrutinyObservations,
                complianceObligations: [],
                timelineEvents: activeApp.timelineEvents,
              }
            : null,
          userRole: currentUser.role,
        }),
      });

      const data = await response.json();

      const botMsg: Message = {
        id: `msg-resp-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'No response returned from the compliance assistant.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: data.citations || ['AICTE Approval Process Handbook (APH) 2026-27'],
        mode: data.mode,
        model: data.model,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'assistant',
          text: `Service connectivity error. Grounded fallback: Applications under scrutiny follow Approval Process Handbook Chapter II guidelines. Please verify system connection.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citations: ['AICTE Approval Process Handbook (APH) 2026-27'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-teal-600" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              AICTE Compliance Copilot
            </h2>
            <span className="text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded">
              Gemini 3.8-Flash RAG Grounded
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Grounded AI decision-support assistant for Approval Process Handbook regulations, deficiencies, and audit summaries
          </p>
        </div>

        {/* Context Selector */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500">Target Application:</span>
          <select
            value={activeAppId}
            onChange={(e) => setActiveAppId(e.target.value)}
            className="text-xs font-mono font-bold text-blue-700 bg-transparent border-none focus:outline-none cursor-pointer"
          >
            {applications.map((app) => (
              <option key={app.id} value={app.id}>
                {app.id} - {app.institutionName.slice(0, 24)}... ({app.currentStage})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Chat Layout */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
        {/* Context Bar */}
        {activeApp && (
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-blue-700">{activeApp.id}</span>
              <span className="text-slate-400">·</span>
              <span className="font-medium text-slate-800">{activeApp.institutionName}</span>
              <span className="text-slate-400">·</span>
              <span className="text-[11px] bg-slate-200 px-1.5 py-0.2 rounded font-semibold text-slate-700">
                {activeApp.currentStage.replace(/_/g, ' ')}
              </span>
            </div>

            <button
              onClick={() => {
                setSelectedApplicationId(activeApp.id);
                setActiveTab('application_detail');
              }}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              Open Full Case File
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-teal-600 text-white shadow-2xs'
                  }`}
                >
                  {isUser ? 'You' : <Sparkles className="w-4 h-4" />}
                </div>

                <div
                  className={`rounded-2xl p-4 text-xs leading-relaxed space-y-2 shadow-2xs ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                  {!isUser && msg.citations && msg.citations.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/80 text-[10px] text-slate-500 space-y-0.5">
                      <span className="font-bold uppercase tracking-wider block text-slate-400">
                        Statutory Citations:
                      </span>
                      {msg.citations.map((c, i) => (
                        <div key={i} className="flex items-center gap-1 text-slate-600">
                          <BookOpen className="w-3 h-3 text-teal-600" />
                          <span>{c}</span>
                        </div>
                      ))}
                      {msg.model && (
                        <span className="text-[9px] text-slate-400 font-mono block mt-1">
                          Engine: {msg.model} ({msg.mode || 'grounded'})
                        </span>
                      )}
                    </div>
                  )}

                  <div
                    className={`text-[9px] font-mono mt-1 ${
                      isUser ? 'text-blue-100 text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 pl-11">
              <RefreshCw className="w-4 h-4 text-teal-600 animate-spin" />
              <span>AICTE Compliance Copilot is querying statutory norms &amp; case audit trail...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Preset Questions Chips */}
        <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 overflow-x-auto flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">
            Suggested Queries:
          </span>
          {presetQueries.map((pq, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(pq)}
              disabled={loading}
              className="text-[11px] font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full shrink-0 transition-colors"
            >
              {pq}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask Copilot about approval status, APH land norms, faculty ratios, or scrutiny findings..."
            disabled={loading}
            className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !inputQuery.trim()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

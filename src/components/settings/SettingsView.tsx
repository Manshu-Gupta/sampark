import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  RotateCcw,
  ShieldCheck,
  Server,
  Key,
  Database,
  CheckCircle,
  HelpCircle,
  FileText,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { resetDemoData, currentUser } = useApp();
  const [resetDone, setResetDone] = useState(false);

  const handleReset = () => {
    resetDemoData();
    setResetDone(true);
    setTimeout(() => setResetDone(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          System Configuration &amp; Demonstration Preferences
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          AICTE SAMPARK prototype runtime settings, persistence options, and regulatory safeguards
        </p>
      </div>

      {/* Demonstration Reset Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-slate-600" />
              Reset Demonstration State
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 max-w-lg">
              Restore initial synthetic demo dataset (8 institutions, 20 applications, 12 documents, and audit logs) back to pristine factory state.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Demo Data
          </button>
        </div>

        {resetDone && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Demonstration database restored to initial seed successfully.
          </div>
        )}
      </div>

      {/* Regulatory Safeguards Notice */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          Regulatory Integrity &amp; AI Oversight Policy
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          AICTE SAMPARK adheres strictly to the core principle of <strong>preserving human administrative oversight</strong>. AI models (Gemini 3.8-Flash) assist officials by explaining regulations, summarizing audit milestones, and triaging visual document discrepancies, but <strong>never independently make statutory approval decisions</strong>.
        </p>
        <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
          <li>Statutory approvals and rejections require the authorized signature of the Member Secretary / Council.</li>
          <li>Document anomalies flagged by Gemini Vision are marked for physical or API verification with the issuing municipal authority.</li>
          <li>Every state transition creates an immutable entry in the write-only statutory audit trail.</li>
        </ul>
      </div>

      {/* Technical Architecture Notes */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Server className="w-4 h-4 text-slate-600" />
          Technical Stack &amp; Backend Runtime
        </h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Frontend Stack</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">React 19 + TypeScript + Tailwind CSS</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Server Runtime</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">Node.js Express Full-Stack on Port 3000</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">AI Integration</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">Server-Side @google/genai (Gemini 3.8-Flash)</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Persistence</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">Persistent Local Storage &amp; In-Memory Store</span>
          </div>
        </div>
      </div>
    </div>
  );
};

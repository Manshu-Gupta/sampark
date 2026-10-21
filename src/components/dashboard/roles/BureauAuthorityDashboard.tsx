import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Clock,
  CheckCircle2,
  Award,
  FileText,
  Stamp,
  Layers,
  BarChart3,
  Check,
  X,
  Crown,
  ShieldAlert,
} from 'lucide-react';
import { Application } from '../../../types';

export const BureauAuthorityDashboard: React.FC = () => {
  const {
    applications,
    institutions,
    notifications,
    setActiveTab,
    setSelectedApplicationId,
    recordFinalDecision,
  } = useApp();

  const [decisionModalApp, setDecisionModalApp] = useState<Application | null>(null);
  const [decisionType, setDecisionType] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [decisionRemarks, setDecisionRemarks] = useState<string>('');

  // Critical metrics
  const decisionPendingApps = applications.filter((a) => a.currentStage === 'DECISION_PENDING');
  const totalApproved = applications.filter((a) => a.currentStage === 'APPROVED').length;
  const criticalLevel3Escalations = notifications.filter(
    (n) => n.escalationLevel === 3 || n.severity === 'CRITICAL'
  );

  // Route breakdown stats
  const routeComplexApps = applications.filter((a) => a.route === 'SCRUTINY_EVC_COMMITTEE' || a.route === 'EVC_COMMITTEE');
  const routeStandardApps = applications.filter((a) => a.route === 'SCRUTINY_EVC');
  const routeFastApps = applications.filter((a) => a.route === 'SCRUTINY_ONLY');

  const handleExecuteDecision = () => {
    if (!decisionModalApp) return;
    recordFinalDecision(
      decisionModalApp.id,
      decisionType,
      decisionRemarks ||
        (decisionType === 'APPROVED'
          ? 'Approved by Competent Authority under Section 10 of AICTE Act. Letter of Approval (LoA) issued.'
          : 'Rejected due to unresolved critical deficiencies.')
    );
    setDecisionModalApp(null);
    setDecisionRemarks('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - White & Blue/Violet/Gold Gradient Identity */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-[#E5EAF3] text-[#172033] p-6 md:p-8 shadow-xs">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-violet-600 to-amber-500" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold mb-3 shadow-2xs">
              <div className="w-5 h-5 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white">
                <Crown className="w-3 h-3 text-white" />
              </div>
              <span>Competent Authority Directorate</span>
              <span className="text-amber-800 font-mono font-bold">• Central Executive</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#172033]">
              National Approval & Executive Sanctions Command
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl font-medium">
              High-level statutory governance, Letter of Approval (LoA) digital authorization, Level 3 emergency escalations, and multi-route SLA bottleneck monitoring.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('reports')}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#E5EAF3] text-slate-700 font-bold text-xs transition-all flex items-center gap-2 shadow-2xs"
            >
              <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center">
                <BarChart3 className="w-3 h-3 text-white" />
              </div>
              <span>Macro Analytics</span>
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-sm shadow-blue-500/20"
            >
              <Stamp className="w-4 h-4" />
              <span>Statutory Audit Logs</span>
            </button>
          </div>
        </div>

        {/* Highlights Bar */}
        <div className="mt-6 pt-5 border-t border-[#E5EAF3] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Total Pan-India Applications</span>
            <span className="font-extrabold text-[#172033] text-sm">{applications.length} Applications</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Awaiting Council Decision</span>
            <span className="font-extrabold text-amber-600 text-sm">{decisionPendingApps.length} Files</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Sanctioned Approvals (AY 2026)</span>
            <span className="font-extrabold text-emerald-600 text-sm">{totalApproved} Letters Issued</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Level 3 Statutory Escalations</span>
            <span className="font-extrabold text-rose-600 text-sm">{criticalLevel3Escalations.length} Immediate</span>
          </div>
        </div>
      </div>

      {/* KPI Cards - White with Vibrant Gradient Icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E5EAF3] shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Awaiting Decision</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs">
              <Stamp className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-amber-700">{decisionPendingApps.length}</span>
            <span className="text-xs text-amber-700 ml-2 font-bold">Ready for Sign-off</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">Scrutiny & EVC cleared</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5EAF3] shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Approved This Cycle</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-xs">
              <Award className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-emerald-600">{totalApproved}</span>
            <span className="text-xs text-emerald-700 ml-2 font-bold">Official LoA Issued</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">Valid for AY 2026-27</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5EAF3] shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Level 3 Escalations</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-rose-600">{criticalLevel3Escalations.length}</span>
            <span className="text-xs text-rose-600 ml-2 font-bold">Council Attention</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">Critical SLA breaches</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5EAF3] shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">SLA Adherence</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-white flex items-center justify-center shadow-xs">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-blue-600">89.4%</span>
            <span className="text-xs text-blue-700 ml-2 font-bold">Within Timelines</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">Targeting &gt;95% velocity</p>
        </div>
      </div>

      {/* Main Section: Final Decision Sign-off Queue & Multi-route Bottlenecks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Final Sign-off Docket */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5EAF3] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#E5EAF3] flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-[#172033]">Executive Decision & Sign-Off Worklist</h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Grant formal Letter of Approval (LoA) or Letter of Rejection (LoR)
              </p>
            </div>
            <span className="text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full shadow-2xs">
              {decisionPendingApps.length} Awaiting Council Sign
            </span>
          </div>

          <div className="divide-y divide-[#E5EAF3]">
            {decisionPendingApps.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                <p className="font-bold text-[#172033]">All Council decisions are up to date!</p>
                <p className="text-xs text-slate-400 mt-1">No applications currently pending executive sanction.</p>
              </div>
            ) : (
              decisionPendingApps.map((app) => {
                const inst = institutions.find((i) => i.id === app.institutionId);
                return (
                  <div
                    key={app.id}
                    className="p-5 hover:bg-[#F8FAFF]/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                          {app.id}
                        </span>
                        <span className="text-xs font-bold text-[#172033]">
                          {inst?.name || 'Institution'}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">({inst?.region.replace(/_/g, ' ')} Region)</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span>Route: {app.route.replace(/_/g, ' ')}</span>
                        <span>•</span>
                        <span>Type: <strong className="text-[#172033]">{app.type.replace(/_/g, ' ')}</strong></span>
                        <span>•</span>
                        <span>Stage Aging: <strong>{app.daysInCurrentStage} days</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setSelectedApplicationId(app.id);
                          setActiveTab('application_detail');
                        }}
                        className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-[#E5EAF3] text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>Dossier</span>
                      </button>

                      <button
                        onClick={() => {
                          setDecisionModalApp(app);
                          setDecisionType('APPROVED');
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Sign Approval (LoA)</span>
                      </button>

                      <button
                        onClick={() => {
                          setDecisionModalApp(app);
                          setDecisionType('REJECTED');
                        }}
                        className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Col: Multi-Route Workflow Bottleneck Radar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5EAF3] shadow-xs p-5">
            <h2 className="text-sm font-extrabold text-[#172033] flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white">
                <Layers className="w-3.5 h-3.5 text-white" />
              </div>
              Route-Level Velocity & Bottlenecks
            </h2>
            <p className="text-xs text-slate-500 mb-4 font-medium">
              Real-time processing efficiency compared across configurable workflow routes:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-[#F8FAFF] rounded-xl border border-[#E5EAF3]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#172033]">Complex Route (EVC + Committee)</span>
                  <span className="font-mono text-slate-500 font-bold">{routeComplexApps.length} files</span>
                </div>
                <p className="text-[11px] text-slate-500 mb-2">Mandatory physical EVC + Committee scrutiny</p>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full" style={{ width: '65%' }} />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Avg cycle: 28 days (SLA: 45)</span>
              </div>

              <div className="p-3.5 bg-[#F8FAFF] rounded-xl border border-[#E5EAF3]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#172033]">Standard Route (Scrutiny + EVC)</span>
                  <span className="font-mono text-slate-500 font-bold">{routeStandardApps.length} files</span>
                </div>
                <p className="text-[11px] text-slate-500 mb-2">Desk Scrutiny + Standard EVC inspection</p>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full" style={{ width: '82%' }} />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Avg cycle: 14 days (SLA: 25)</span>
              </div>

              <div className="p-3.5 bg-[#F8FAFF] rounded-xl border border-[#E5EAF3]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#172033]">Fast-Track Route (Scrutiny Only)</span>
                  <span className="font-mono text-slate-500 font-bold">{routeFastApps.length} files</span>
                </div>
                <p className="text-[11px] text-slate-500 mb-2">Zero EVC requirement. Direct validation.</p>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full" style={{ width: '95%' }} />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Avg cycle: 4 days (SLA: 7)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Modal */}
      {decisionModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E5EAF3] space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs ${
                  decisionType === 'APPROVED' ? 'bg-gradient-to-br from-emerald-500 to-teal-500' : 'bg-gradient-to-br from-rose-500 to-pink-500'
                }`}
              >
                <Stamp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#172033]">
                  {decisionType === 'APPROVED' ? 'Issue Letter of Approval (LoA)' : 'Issue Rejection Order'}
                </h3>
                <p className="text-xs text-slate-500 font-mono font-bold">
                  {decisionModalApp.id} • {decisionModalApp.type.replace(/_/g, ' ')}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {decisionType === 'APPROVED'
                ? 'This action will generate a digital statutory approval certificate and dispatch notification to the institution and affiliating university.'
                : 'This action will formalize statutory rejection with specified grounds and activate the 15-day appellate window.'}
            </p>

            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1">
                Executive Order Remarks / Sanction Note *
              </label>
              <textarea
                value={decisionRemarks}
                onChange={(e) => setDecisionRemarks(e.target.value)}
                placeholder="Enter remarks for the official order..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-[#E5EAF3] focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans text-[#172033]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setDecisionModalApp(null);
                  setDecisionRemarks('');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteDecision}
                className={`px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-sm ${
                  decisionType === 'APPROVED'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                    : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700'
                }`}
              >
                <Stamp className="w-3.5 h-3.5" />
                <span>Affix Statutory Seal & Execute</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  FileCheck2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  Send,
  FileSearch,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { ApprovalStage } from '../../../types';

export const ScrutinyDashboard: React.FC = () => {
  const {
    currentUser,
    applications,
    institutions,
    setActiveTab,
    setSelectedApplicationId,
    advanceApplicationStage,
    returnForClarification,
  } = useApp();

  const [filterType, setFilterType] = useState<'ALL_SCRUTINY' | 'NEW_SUBMISSIONS' | 'RE_SCRUTINY' | 'OVERDUE' | 'NEW_INSTITUTION'>('ALL_SCRUTINY');
  const [selectedAppForAction, setSelectedAppForAction] = useState<string | null>(null);
  const [deficiencyReason, setDeficiencyReason] = useState<string>('');
  const [showDeficiencyModal, setShowDeficiencyModal] = useState<boolean>(false);

  // Filter scrutiny cases (including newly submitted applications pending scrutiny)
  const scrutinyApps = applications.filter((app) =>
    ['SUBMITTED', 'PRELIMINARY_CHECK', 'SCRUTINY', 'RE_SCRUTINY'].includes(app.currentStage)
  );

  const newSubmissionsCount = applications.filter((app) => app.currentStage === 'SUBMITTED').length;
  const reScrutinyCount = applications.filter((app) => app.currentStage === 'RE_SCRUTINY').length;
  const overdueScrutiny = scrutinyApps.filter((app) => app.daysInCurrentStage > app.stageSlaDays);

  const displayedApps = scrutinyApps.filter((app) => {
    if (filterType === 'NEW_SUBMISSIONS') return app.currentStage === 'SUBMITTED';
    if (filterType === 'NEW_INSTITUTION') return app.type === 'NEW_INSTITUTION';
    if (filterType === 'RE_SCRUTINY') return app.currentStage === 'RE_SCRUTINY';
    if (filterType === 'OVERDUE') return app.daysInCurrentStage > app.stageSlaDays;
    return true;
  });

  const handleStartScrutiny = (appId: string) => {
    advanceApplicationStage(
      appId,
      'SCRUTINY',
      `Application taken up for technical scrutiny by Scrutiny Officer ${currentUser.name}.`
    );
  };

  const handlePassScrutiny = (appId: string) => {
    const app = applications.find((a) => a.id === appId);
    if (!app) return;

    let nextStage: ApprovalStage = 'COMMITTEE_PROCESSING';
    if (app.route === 'SCRUTINY_EVC' || app.route === 'SCRUTINY_EVC_COMMITTEE' || app.route === 'EVC_COMMITTEE') {
      nextStage = 'EVC_PENDING';
    } else if (app.route === 'SCRUTINY_ONLY') {
      nextStage = 'DECISION_PENDING';
    }

    advanceApplicationStage(
      appId,
      nextStage,
      `Primary technical scrutiny completed and verified compliant under AICTE Norms by ${currentUser.name}. Forwarded to ${nextStage.replace(/_/g, ' ')}.`
    );
  };

  const handleReturnDeficiency = () => {
    if (!selectedAppForAction || !deficiencyReason.trim()) return;
    returnForClarification(selectedAppForAction, deficiencyReason);
    setShowDeficiencyModal(false);
    setSelectedAppForAction(null);
    setDeficiencyReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - Clean White with Soft Lavender/Indigo Accent */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-[#E5EAF3] text-[#172033] p-6 md:p-8 shadow-xs">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400/50 via-purple-300/40 to-blue-400/50" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-800 text-xs font-bold mb-3 shadow-2xs">
              <div className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <FileCheck2 className="w-3 h-3" />
              </div>
              <span>AICTE Scrutiny Directorate</span>
              <span className="text-indigo-900 font-mono font-bold">• ID: {currentUser.id}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              Document Verification &amp; Scrutiny Worklist
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl font-medium">
              Inspect statutory clearances, verify cadastral land deeds, evaluate faculty cadre ratios, and issue time-bound deficiency notices.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('anomaly')}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-indigo-700 text-xs font-bold transition-all flex items-center gap-2 shadow-2xs"
            >
              <div className="w-5 h-5 rounded bg-purple-50 border border-purple-100 text-purple-700 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-purple-700" />
              </div>
              <span>Document Anomaly AI</span>
            </button>
            <button
              onClick={() => setActiveTab('workflow')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-xs"
            >
              <FileSearch className="w-3.5 h-3.5" />
              <span>Configure Route Rules</span>
            </button>
          </div>
        </div>

        {/* Highlight Stats Bar */}
        <div className="mt-6 pt-5 border-t border-[#E5EAF3] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Target SLA Window</span>
            <span className="font-extrabold text-[#172033] text-sm">7 Working Days</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Pending in Scrutiny</span>
            <span className="font-extrabold text-amber-600 text-sm">{scrutinyApps.length} Files</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Re-Scrutiny Submissions</span>
            <span className="font-extrabold text-indigo-700 text-sm">{reScrutinyCount} Responded</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">SLA Breached Cases</span>
            <span className="font-extrabold text-rose-600 text-sm">{overdueScrutiny.length} Immediate Action</span>
          </div>
        </div>
      </div>

      {/* KPI Cards - Clean Pastel Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E5EAF3] shadow-xs hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scrutiny Workload</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center shadow-2xs">
              <FileCheck2 className="w-4 h-4 text-indigo-700" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-[#172033]">{scrutinyApps.length}</span>
            <span className="text-xs text-indigo-700 ml-2 font-bold">Assigned files</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">Technical review docket</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5EAF3] shadow-xs hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">At-Risk SLA</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 flex items-center justify-center shadow-2xs">
              <Clock className="w-4 h-4 text-rose-700" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-rose-600">{overdueScrutiny.length}</span>
            <span className="text-xs text-rose-600 ml-2 font-bold">&gt;7 days aging</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">Subject to escalation</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5EAF3] shadow-xs hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Re-Scrutiny Queue</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 text-purple-700 flex items-center justify-center shadow-2xs">
              <RotateCcw className="w-4 h-4 text-purple-700" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-[#172033]">{reScrutinyCount}</span>
            <span className="text-xs text-purple-700 ml-2 font-bold">Clarifications in</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">Colleges replied with documents</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5EAF3] shadow-xs hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Pre-Clearance</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center shadow-2xs">
              <Sparkles className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-emerald-600">92%</span>
            <span className="text-xs text-emerald-700 ml-2 font-bold">Vault Clear</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">Zero discrepancies detected</p>
        </div>
      </div>

      {/* Main Scrutiny Task Worklist */}
      <div className="bg-white rounded-2xl border border-[#E5EAF3] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E5EAF3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-[#172033]">Official Scrutiny Case Docket</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Review attached affidavits, land ownership deeds, and statutory approvals
            </p>
          </div>

          {/* Quick Filter */}
          <div className="flex items-center gap-1 bg-[#F8FAFF] p-1 rounded-xl border border-[#E5EAF3] text-xs font-semibold text-slate-600 overflow-x-auto">
            {(
              [
                { id: 'ALL_SCRUTINY', label: `All Active (${scrutinyApps.length})` },
                { id: 'NEW_SUBMISSIONS', label: `New Submissions (${newSubmissionsCount})` },
                { id: 'OVERDUE', label: `Overdue SLA (${overdueScrutiny.length})` },
                { id: 'RE_SCRUTINY', label: `Re-Scrutiny (${reScrutinyCount})` },
                { id: 'NEW_INSTITUTION', label: 'New Inst.' },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  filterType === f.id
                    ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                    : 'hover:text-[#172033]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* List of Applications in Scrutiny */}
        <div className="divide-y divide-[#E5EAF3]">
          {displayedApps.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
              <p className="font-bold text-[#172033]">Scrutiny queue is clear!</p>
              <p className="text-xs text-slate-400 mt-1">No applications pending scrutiny under selected criteria.</p>
            </div>
          ) : (
            displayedApps.map((app) => {
              const inst = institutions.find((i) => i.id === app.institutionId);
              const isOverdue = app.daysInCurrentStage > app.stageSlaDays;
              const isSubmitted = app.currentStage === 'SUBMITTED';

              return (
                <div
                  key={app.id}
                  className="p-5 hover:bg-[#F8FAFF]/80 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                        {app.id}
                      </span>
                      {isSubmitted ? (
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-pulse" />
                          Submitted – Pending Scrutiny
                        </span>
                      ) : (
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            app.currentStage === 'RE_SCRUTINY'
                              ? 'bg-violet-50 text-violet-700 border border-violet-200'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}
                        >
                          {app.currentStage.replace(/_/g, ' ')}
                        </span>
                      )}
                      {app.formData && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                          AICTE Form Attached ({app.formData.courses?.length || 0} Courses)
                        </span>
                      )}
                      {app.paymentStatus === 'PAID' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Fee Paid: ₹{app.feeAmount?.toLocaleString('en-IN') || 'Paid'}
                        </span>
                      )}
                      <span className="text-xs font-bold text-[#172033] truncate">
                        {inst?.name || app.formData?.institutionName || 'Institution'}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        ({inst?.city || app.formData?.city || 'City'}, {inst?.region.replace(/_/g, ' ') || 'Region'})
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                      <span>Type: <strong className="text-[#172033]">{app.type.replace(/_/g, ' ')}</strong></span>
                      <span>•</span>
                      <span>Route: <strong className="text-indigo-700">{app.route.replace(/_/g, ' ')}</strong></span>
                      <span>•</span>
                      <span>Attached Docs: <strong className="text-[#172033]">{app.attachedDocumentIds.length}</strong></span>
                      <span>•</span>
                      <span>Reused from Vault: <strong className="text-emerald-700 font-bold">{app.reusedDocumentIds.length}</strong></span>
                      {app.permanentId && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-[11px] text-slate-600">PID: {app.permanentId}</span>
                        </>
                      )}
                    </div>

                    {/* SLA Progress */}
                    <div className="flex items-center gap-3 text-xs">
                      <span
                        className={`inline-flex items-center gap-1 font-bold ${
                          isOverdue ? 'text-rose-600' : 'text-slate-600'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        Aging: {app.daysInCurrentStage} of {app.stageSlaDays} days
                      </span>
                      {isOverdue && (
                        <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.2 rounded-md">
                          SLA Breached
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedApplicationId(app.id);
                        setActiveTab('application_detail');
                      }}
                      className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-[#E5EAF3] text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <FileSearch className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Inspect Form & Docs</span>
                    </button>

                    {isSubmitted ? (
                      <button
                        onClick={() => handleStartScrutiny(app.id)}
                        className="px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm shadow-cyan-500/20"
                      >
                        <FileCheck2 className="w-3.5 h-3.5 text-white" />
                        <span>Start Scrutiny</span>
                      </button>
                    ) : null}

                    <button
                      onClick={() => {
                        setSelectedAppForAction(app.id);
                        setShowDeficiencyModal(true);
                      }}
                      className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100/80 text-amber-800 border border-amber-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Issue Deficiency</span>
                    </button>

                    <button
                      onClick={() => handlePassScrutiny(app.id)}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm shadow-indigo-500/20"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>Pass &amp; Forward</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Deficiency Modal - Clean White */}
      {showDeficiencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E5EAF3] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-xs">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#172033]">Return for Clarification / Deficiency</h3>
                <p className="text-xs text-slate-500 font-medium">Formal communication to Institution Administrator</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Specify the exact statutory non-compliance or missing documentation. The application will transition to{' '}
              <strong className="text-amber-700 font-bold">CLARIFICATION_REQUIRED</strong>, halting approval timers until the college responds.
            </p>

            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1">
                Deficiency Findings & Instructions *
              </label>
              <textarea
                value={deficiencyReason}
                onChange={(e) => setDeficiencyReason(e.target.value)}
                placeholder="e.g. Registered Land Lease deed has expired on 15-Mar-2026. Please upload certified renewed lease registered with Sub-Registrar within 15 days."
                rows={4}
                className="w-full text-xs p-3 rounded-xl border border-[#E5EAF3] focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans text-[#172033]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setShowDeficiencyModal(false);
                  setDeficiencyReason('');
                  setSelectedAppForAction(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleReturnDeficiency}
                disabled={!deficiencyReason.trim()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Issue Official Notice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

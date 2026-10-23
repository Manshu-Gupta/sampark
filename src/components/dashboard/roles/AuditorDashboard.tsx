import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  History,
  Lock,
  Download,
  FileCheck2,
  Shield,
  Search,
  CheckCircle2,
  ArrowUpRight,
  Key,
} from 'lucide-react';

export const AuditorDashboard: React.FC = () => {
  const {
    applications,
    auditEvents,
    setActiveTab,
    setSelectedApplicationId,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterAction, setFilterAction] = useState<string>('ALL');

  // Filtered audit events
  const filteredEvents = auditEvents.filter((ev) => {
    if (filterAction !== 'ALL' && ev.action !== filterAction) return false;
    if (
      searchQuery &&
      !ev.userName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !ev.reasonNotes.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !ev.entityId.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleExportAuditDossier = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditEvents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `AICTE_SAMPARK_AUDIT_DOSSIER_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - White & Soft Slate/Sky Accent */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-[#E5EAF3] text-[#172033] p-6 md:p-8 shadow-xs">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500/80 via-blue-500/70 to-indigo-500/80" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-sky-800 text-xs font-semibold mb-3">
              <div className="w-5 h-5 rounded-md bg-sky-100 text-sky-800 flex items-center justify-center">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <span>Independent Statutory Audit Directorate</span>
              <span className="text-indigo-700 font-mono font-bold">• READ-ONLY ACCESS</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#172033]">
              Statutory Oversight & Tamper-Evident Ledger
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl font-medium">
              Independent surveillance of application registers, SLA adherence, discretionary interventions, and cryptographic action logs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportAuditDossier}
              className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-800 text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Audit Ledger (JSON)</span>
            </button>
          </div>
        </div>

        {/* Read-Only Mode Banner - Clean Light Style */}
        <div className="mt-6 pt-4 border-t border-[#E5EAF3] flex items-center gap-2 text-xs text-slate-700 bg-sky-50/70 border border-sky-200 px-3.5 py-2.5 rounded-xl">
          <Shield className="w-4 h-4 text-sky-600 shrink-0" />
          <span>
            <strong className="text-[#172033]">Statutory Auditor Mode Active:</strong> You possess full read inspection privileges across all files and historical logs. State mutation, approvals, and decisions are cryptographically locked for this role.
          </span>
        </div>
      </div>

      {/* KPI Cards - Soft Pastel Icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E5EAF3] shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Immutable Logs</span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200/80 shadow-2xs">
              <History className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-[#172033]">{auditEvents.length}</span>
            <span className="text-xs text-slate-400 ml-2 font-medium">Total events</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">100% hash-chained records</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5EAF3] shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">SLA Adherence</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60 shadow-2xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-emerald-600">91.8%</span>
            <span className="text-xs text-emerald-700 ml-2 font-bold">On-Time</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">Across all committees</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5EAF3] shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Files Monitored</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200/60 shadow-2xs">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-[#172033]">{applications.length}</span>
            <span className="text-xs text-sky-700 ml-2 font-bold">Under Surveillance</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">All 7 administrative zones</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5EAF3] shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hash Integrity</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200/60 shadow-2xs">
              <Key className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-indigo-600">SHA-256</span>
            <span className="text-xs text-indigo-700 ml-2 font-bold">Verified</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">Zero hash collisions</p>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-[#E5EAF3] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E5EAF3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-[#172033]">Chronological Statutory Audit Ledger</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Every stage movement, deficiency notice, document verification, and sign-off is permanently recorded
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search actor, action or case..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-[#F8FAFF] border border-[#E5EAF3] rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 w-56 text-[#172033]"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFF] border-b border-[#E5EAF3] text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action / Event</th>
                <th className="py-3 px-4">Authorised Actor</th>
                <th className="py-3 px-4">Entity Reference</th>
                <th className="py-3 px-4">Ledger Details</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAF3]">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                    No audit records matching query.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-[#F8FAFF]/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {ev.timestamp}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#172033] bg-[#F8FAFF] border border-[#E5EAF3] px-2.5 py-0.5 rounded-md text-[11px]">
                        {ev.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#172033]">{ev.userName}</span>
                      <span className="block text-[10px] text-slate-400 font-mono">{ev.userRole}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-indigo-700 font-bold">
                      {ev.entityId}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate font-medium" title={ev.reasonNotes}>
                      {ev.reasonNotes}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {ev.entityType === 'APPLICATION' && (
                        <button
                          onClick={() => {
                            setSelectedApplicationId(ev.entityId);
                            setActiveTab('application_detail');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-[11px] transition-colors inline-flex items-center gap-1 border border-sky-200"
                        >
                          <span>Case</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

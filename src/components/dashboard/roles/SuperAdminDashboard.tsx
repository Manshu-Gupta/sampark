import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Settings,
  ShieldCheck,
  Users,
  Activity,
  Sliders,
  RotateCcw,
  CheckCircle2,
  Database,
  Cpu,
  GitBranch,
} from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const {
    currentUser,
    users,
    workflowDefinitions,
    applications,
    documents,
    resetDemoData,
    switchRole,
    setActiveTab,
  } = useApp();

  const [slaSettings, setSlaSettings] = useState({
    routeAScrutiny: 7,
    routeAEVC: 15,
    routeACommittee: 10,
    routeBScrutiny: 5,
    routeBCommittee: 7,
    routeCDecision: 3,
  });

  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleSaveSla = () => {
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - White Card with Soft Cobalt & Sky Accent */}
      <div className="relative overflow-hidden rounded-2xl bg-white text-[#172033] p-6 md:p-8 shadow-xs border border-[#E5EAF3]">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/80 via-indigo-500/70 to-cyan-500/80" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-3">
              <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span>National System Administrator Console</span>
              <span className="text-blue-700 font-mono text-[11px] bg-blue-100/60 px-1.5 py-0.5 rounded font-bold">ROOT PRIVILEGES</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#172033]">
              Platform Architecture & SLA Policy Engine
            </h1>
            <p className="text-sm text-[#64748B] mt-1 max-w-2xl font-medium">
              Configure regulatory route SLA thresholds, manage 8-tier role matrix permissions, monitor cluster health, and orchestrate simulation environments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={resetDemoData}
              className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              title="Reset state to initial seed demonstration data"
            >
              <RotateCcw className="w-4 h-4 text-rose-600" />
              <span>Reset Demo State</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              <span>All Settings & Profiles</span>
            </button>
          </div>
        </div>

        {/* Highlights Bar */}
        <div className="mt-6 pt-6 border-t border-[#E5EAF3] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-[#F8FAFF] border border-[#E5EAF3]">
            <span className="text-[#64748B] block text-[11px] font-medium">System Operational State</span>
            <span className="font-bold text-emerald-600 text-sm flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              100% HEALTHY
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#F8FAFF] border border-[#E5EAF3]">
            <span className="text-[#64748B] block text-[11px] font-medium">Configured System Roles</span>
            <span className="font-bold text-blue-600 text-sm block mt-0.5">{users.length} Verified Personas</span>
          </div>
          <div className="p-3 rounded-xl bg-[#F8FAFF] border border-[#E5EAF3]">
            <span className="text-[#64748B] block text-[11px] font-medium">Active Workflow Routes</span>
            <span className="font-bold text-[#172033] text-sm block mt-0.5">{Object.keys(workflowDefinitions).length} Statutory Routes</span>
          </div>
          <div className="p-3 rounded-xl bg-[#F8FAFF] border border-[#E5EAF3]">
            <span className="text-[#64748B] block text-[11px] font-medium">Document Vault Storage</span>
            <span className="font-bold text-cyan-600 text-sm block mt-0.5">{documents.length} Cryptographic Proofs</span>
          </div>
        </div>
      </div>

      {/* KPI Cards - Soft Pastel Accents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[#E5EAF3] shadow-xs hover:border-blue-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">System Workload</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60 shadow-2xs">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-[#172033]">{applications.length}</span>
            <span className="text-xs text-blue-600 ml-2 font-semibold">In Pipeline</span>
          </div>
          <p className="mt-2 text-xs text-[#64748B] font-medium">Active state machine instances</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E5EAF3] shadow-xs hover:border-emerald-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Security & RBAC</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60 shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-emerald-600">Strict RBAC</span>
            <span className="text-xs text-emerald-700 ml-2 font-semibold">Enforced</span>
          </div>
          <p className="mt-2 text-xs text-[#64748B] font-medium">Zero privilege escalation paths</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E5EAF3] shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Database Microservice</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-200/60 shadow-2xs">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-[#172033]">Online</span>
            <span className="text-xs text-emerald-600 ml-2 font-semibold">1.8ms latency</span>
          </div>
          <p className="mt-2 text-xs text-[#64748B] font-medium">In-memory state synced to storage</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E5EAF3] shadow-xs hover:border-violet-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Statutory AI Services</span>
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-200/60 shadow-2xs">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-violet-600">Gemini 2.5</span>
            <span className="text-xs text-violet-700 ml-2 font-semibold">Active</span>
          </div>
          <p className="mt-2 text-xs text-[#64748B] font-medium">APH 2026-27 embeddings online</p>
        </div>
      </div>

      {/* Main Section: Interactive Route SLA Engine & Role Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: SLA Parameter Customizer */}
        <div className="bg-white rounded-xl border border-[#E5EAF3] shadow-xs p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#172033] flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60">
                  <Sliders className="w-3.5 h-3.5" />
                </div>
                Statutory SLA Threshold Engine
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Adjust statutory processing windows (days) per stage for Route A, B, and C
              </p>
            </div>
            {isSavedNotice && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 animate-in fade-in">
                Thresholds Applied!
              </span>
            )}
          </div>

          <div className="space-y-4 text-xs">
            {/* Route A */}
            <div className="p-4 bg-[#F8FAFF] rounded-xl border border-[#E5EAF3] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#172033] flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center">
                    <GitBranch className="w-3 h-3" />
                  </div>
                  Complex Route (SCRUTINY_EVC_COMMITTEE)
                </span>
                <span className="text-[10px] bg-blue-100/80 text-blue-800 font-bold px-2 py-0.5 rounded border border-blue-200">
                  Full Inspection Path
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-[#64748B] block mb-1 font-medium">Scrutiny SLA (Days)</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={slaSettings.routeAScrutiny}
                    onChange={(e) => setSlaSettings({ ...slaSettings, routeAScrutiny: Number(e.target.value) })}
                    className="w-full text-xs p-2 rounded-lg border border-[#E5EAF3] bg-white text-[#172033] font-mono font-bold focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#64748B] block mb-1 font-medium">EVC Visit SLA (Days)</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={slaSettings.routeAEVC}
                    onChange={(e) => setSlaSettings({ ...slaSettings, routeAEVC: Number(e.target.value) })}
                    className="w-full text-xs p-2 rounded-lg border border-[#E5EAF3] bg-white text-[#172033] font-mono font-bold focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#64748B] block mb-1 font-medium">Committee SLA (Days)</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={slaSettings.routeACommittee}
                    onChange={(e) => setSlaSettings({ ...slaSettings, routeACommittee: Number(e.target.value) })}
                    className="w-full text-xs p-2 rounded-lg border border-[#E5EAF3] bg-white text-[#172033] font-mono font-bold focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Route B */}
            <div className="p-4 bg-[#F8FAFF] rounded-xl border border-[#E5EAF3] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#172033] flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <GitBranch className="w-3 h-3" />
                  </div>
                  Standard Extension (SCRUTINY_EVC)
                </span>
                <span className="text-[10px] bg-indigo-100/80 text-indigo-800 font-bold px-2 py-0.5 rounded border border-indigo-200">
                  Standard Path
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[#64748B] block mb-1 font-medium">Scrutiny SLA (Days)</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={slaSettings.routeBScrutiny}
                    onChange={(e) => setSlaSettings({ ...slaSettings, routeBScrutiny: Number(e.target.value) })}
                    className="w-full text-xs p-2 rounded-lg border border-[#E5EAF3] bg-white text-[#172033] font-mono font-bold focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#64748B] block mb-1 font-medium">Committee SLA (Days)</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={slaSettings.routeBCommittee}
                    onChange={(e) => setSlaSettings({ ...slaSettings, routeBCommittee: Number(e.target.value) })}
                    className="w-full text-xs p-2 rounded-lg border border-[#E5EAF3] bg-white text-[#172033] font-mono font-bold focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Route C */}
            <div className="p-4 bg-[#F8FAFF] rounded-xl border border-[#E5EAF3] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#172033] flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <GitBranch className="w-3 h-3" />
                  </div>
                  Fast-Track Route (SCRUTINY_ONLY)
                </span>
                <span className="text-[10px] bg-emerald-100/80 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                  Autonomous / NBA
                </span>
              </div>
              <div>
                <label className="text-[11px] text-[#64748B] block mb-1 font-medium">Council Auto-Sanction SLA (Days)</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={slaSettings.routeCDecision}
                  onChange={(e) => setSlaSettings({ ...slaSettings, routeCDecision: Number(e.target.value) })}
                  className="w-full text-xs p-2 rounded-lg border border-[#E5EAF3] bg-white text-[#172033] font-mono font-bold max-w-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleSaveSla}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Publish SLA Policy Rules</span>
            </button>
          </div>
        </div>

        {/* Right: User Roles Matrix */}
        <div className="bg-white rounded-xl border border-[#E5EAF3] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#172033] flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-200/60">
                <Users className="w-3.5 h-3.5" />
              </div>
              8-Tier Role Permissions Matrix
            </h2>
            <span className="text-xs text-[#64748B]">{users.length} Pre-configured Personas</span>
          </div>
          <p className="text-xs text-[#64748B]">
            Strict separation of statutory duties ensures complete accountability with zero self-approved workflows:
          </p>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1 text-xs">
            {users.map((u) => {
              const isActive = u.role === currentUser.role;
              return (
                <div
                  key={u.id}
                  className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-300'
                      : 'bg-[#F8FAFF] border-[#E5EAF3] hover:bg-slate-50'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#172033] truncate">{u.name}</span>
                      {isActive && (
                        <span className="text-[10px] bg-blue-600 text-white font-semibold px-2 py-0.5 rounded shadow-2xs">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#64748B] truncate">{u.designation} • {u.department}</p>
                    <span className="text-[10px] font-mono text-blue-700 bg-white px-1.5 py-0.5 rounded border border-[#E5EAF3] mt-1 inline-block font-semibold">
                      Role: {u.role}
                    </span>
                  </div>

                  <button
                    onClick={() => switchRole(u.role)}
                    className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-[#E5EAF3] hover:border-blue-300 text-[#172033] hover:text-[#3867F5] font-semibold text-[11px] rounded-lg transition-colors shrink-0 shadow-xs cursor-pointer"
                  >
                    Switch
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

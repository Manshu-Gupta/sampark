import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ShieldAlert,
  Building2,
  MapPin,
  Flame,
} from 'lucide-react';
import { RegionalZone } from '../../../types';

export const RegionalDashboard: React.FC = () => {
  const {
    applications,
    institutions,
    notifications,
    setActiveTab,
    setSelectedApplicationId,
  } = useApp();

  const [selectedRegion, setSelectedRegion] = useState<RegionalZone>('NORTH_WESTERN');
  const [selectedAgingBucket, setSelectedAgingBucket] = useState<string | null>(null);

  // Filter regional applications
  const regionalApps = applications.filter((app) => app.region === selectedRegion);
  const regionalInstitutions = institutions.filter((inst) => inst.region === selectedRegion);

  // Level 2 Escalations
  const regionalEscalations = notifications.filter(
    (n) => n.escalationLevel === 2 || (n.severity === 'CRITICAL' && n.escalationLevel >= 1)
  );

  // 4 Aging Buckets Breakdown: 0-7, 8-15, 16-30, >30 days
  const bucket0to7 = regionalApps.filter((a) => a.daysInCurrentStage <= 7);
  const bucket8to15 = regionalApps.filter((a) => a.daysInCurrentStage >= 8 && a.daysInCurrentStage <= 15);
  const bucket16to30 = regionalApps.filter((a) => a.daysInCurrentStage >= 16 && a.daysInCurrentStage <= 30);
  const bucketOver30 = regionalApps.filter((a) => a.daysInCurrentStage > 30);

  const displayedApps = selectedAgingBucket === '0-7'
    ? bucket0to7
    : selectedAgingBucket === '8-15'
    ? bucket8to15
    : selectedAgingBucket === '16-30'
    ? bucket16to30
    : selectedAgingBucket === '>30'
    ? bucketOver30
    : regionalApps;

  return (
    <div className="space-y-6">
      {/* Header Banner - White & Soft Teal/Mint Accent */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-[#E5EAF3] text-[#172033] p-6 md:p-8 shadow-xs">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500/80 via-emerald-400/80 to-teal-500/80" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold mb-3">
              <div className="w-5 h-5 rounded-md bg-teal-100 text-teal-700 flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span>Regional Directorate Oversight</span>
              <span className="text-teal-700 font-mono font-bold">• {selectedRegion.replace(/_/g, ' ')}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#172033]">
              Regional Pendency & Regulatory Command
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl font-medium">
              Monitor processing turnaround times across state jurisdictions, resolve Level 2 administrative escalations, and manage scrutiny workload.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value as RegionalZone)}
              className="bg-white border border-[#E5EAF3] hover:border-teal-300 rounded-xl px-4 py-2.5 text-xs font-bold text-[#172033] focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
            >
              <option value="NORTH_WESTERN">North-Western (Delhi, Haryana, Punjab)</option>
              <option value="NORTHERN">Northern (UP, Uttarakhand)</option>
              <option value="WESTERN">Western (Maharashtra, Goa)</option>
              <option value="SOUTHERN">Southern (Karnataka, AP, Telangana)</option>
              <option value="SOUTH_WESTERN">South-Western (Kerala, TN)</option>
              <option value="EASTERN">Eastern (WB, Bihar, Odisha)</option>
              <option value="CENTRAL">Central (MP, Chhattisgarh)</option>
            </select>
          </div>
        </div>

        {/* Highlights Bar */}
        <div className="mt-6 pt-5 border-t border-[#E5EAF3] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Active Institutions</span>
            <span className="font-extrabold text-[#172033] text-sm">{regionalInstitutions.length} Colleges</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Total Pendency</span>
            <span className="font-extrabold text-teal-700 text-sm">
              {regionalApps.filter((a) => !['APPROVED', 'REJECTED'].includes(a.currentStage)).length} Cases
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Level 2 Escalations</span>
            <span className="font-extrabold text-rose-600 text-sm">{regionalEscalations.length} Active</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Avg Regional Turnaround</span>
            <span className="font-extrabold text-emerald-600 text-sm">11.4 Days</span>
          </div>
        </div>
      </div>

      {/* 4 Aging Buckets Interactive Cards with White Theme and Gradient Accents */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#172033] flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600" />
            Statutory Pendency Aging Distribution (Days in Current Stage)
          </h2>
          {selectedAgingBucket && (
            <button
              onClick={() => setSelectedAgingBucket(null)}
              className="text-xs font-bold text-teal-700 hover:text-teal-800"
            >
              Clear Aging Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Bucket 1: 0-7 Days */}
          <div
            onClick={() => setSelectedAgingBucket(selectedAgingBucket === '0-7' ? null : '0-7')}
            className={`cursor-pointer rounded-2xl p-5 border transition-all shadow-xs ${
              selectedAgingBucket === '0-7'
                ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-400 shadow-sm'
                : 'bg-white border-[#E5EAF3] hover:border-emerald-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                0 – 7 Days
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-[#172033]">{bucket0to7.length}</span>
              <span className="text-xs text-slate-500 ml-2 font-medium">Within SLA</span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500 font-medium">Normal processing velocity</p>
          </div>

          {/* Bucket 2: 8-15 Days */}
          <div
            onClick={() => setSelectedAgingBucket(selectedAgingBucket === '8-15' ? null : '8-15')}
            className={`cursor-pointer rounded-2xl p-5 border transition-all shadow-xs ${
              selectedAgingBucket === '8-15'
                ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-400 shadow-sm'
                : 'bg-white border-[#E5EAF3] hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                8 – 15 Days
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-[#172033]">{bucket8to15.length}</span>
              <span className="text-xs text-slate-500 ml-2 font-medium">Attention Required</span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500 font-medium">Approaching scrutiny / EVC SLA</p>
          </div>

          {/* Bucket 3: 16-30 Days */}
          <div
            onClick={() => setSelectedAgingBucket(selectedAgingBucket === '16-30' ? null : '16-30')}
            className={`cursor-pointer rounded-2xl p-5 border transition-all shadow-xs ${
              selectedAgingBucket === '16-30'
                ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-400 shadow-sm'
                : 'bg-white border-[#E5EAF3] hover:border-amber-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                16 – 30 Days
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-amber-600">{bucket16to30.length}</span>
              <span className="text-xs text-amber-700 ml-2 font-bold">SLA Breached</span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500 font-medium">Triggered Level 1 alert</p>
          </div>

          {/* Bucket 4: >30 Days */}
          <div
            onClick={() => setSelectedAgingBucket(selectedAgingBucket === '>30' ? null : '>30')}
            className={`cursor-pointer rounded-2xl p-5 border transition-all shadow-xs ${
              selectedAgingBucket === '>30'
                ? 'bg-rose-50/70 border-rose-400 ring-2 ring-rose-400 shadow-sm'
                : 'bg-white border-[#E5EAF3] hover:border-rose-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                &gt; 30 Days
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200/60">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-rose-600">{bucketOver30.length}</span>
              <span className="text-xs text-rose-600 ml-2 font-bold">Critical Overdue</span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500 font-medium">Level 2 Escalation active</p>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Regional Escalations & Applications Registry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Regional Case Registry */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5EAF3] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#E5EAF3] flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-[#172033]">
                Regional Application Docket
                {selectedAgingBucket && (
                  <span className="text-xs font-normal text-teal-700 ml-2">
                    (Filtered: {selectedAgingBucket} Days)
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Cases pending within {selectedRegion.replace(/_/g, ' ')} Regional Office jurisdiction
              </p>
            </div>
          </div>

          <div className="divide-y divide-[#E5EAF3]">
            {displayedApps.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No applications in this category.
              </div>
            ) : (
              displayedApps.map((app) => {
                const inst = institutions.find((i) => i.id === app.institutionId);
                return (
                  <div
                    key={app.id}
                    className="p-5 hover:bg-[#F8FAFF]/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                          {app.id}
                        </span>
                        <span className="text-xs font-bold text-[#172033]">
                          {inst?.name || 'Institution'}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          • {app.type.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>Route: {app.route.replace(/_/g, ' ')}</span>
                        <span>•</span>
                        <span>Current Stage: <strong className="text-[#172033]">{app.currentStage.replace(/_/g, ' ')}</strong></span>
                        <span>•</span>
                        <span className={app.daysInCurrentStage > app.stageSlaDays ? 'text-rose-600 font-bold' : ''}>
                          Aging: {app.daysInCurrentStage} days
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedApplicationId(app.id);
                        setActiveTab('application_detail');
                      }}
                      className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 self-end sm:self-center border border-teal-200"
                    >
                      <span>Review File</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Col: Level 2 Regional Escalations & Institutions Watchlist */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5EAF3] shadow-xs p-5">
            <h2 className="text-sm font-extrabold text-[#172033] flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center">
                <ShieldAlert className="w-3.5 h-3.5" />
              </div>
              Level 2 Regional Escalations
            </h2>
            <p className="text-xs text-slate-500 mb-3 font-medium">
              Matters requiring immediate Regional Officer administrative intervention:
            </p>

            <div className="space-y-3">
              {regionalEscalations.length === 0 ? (
                <div className="p-4 bg-emerald-50 rounded-xl text-xs text-emerald-800 flex items-center gap-2 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">No Level 2 escalations currently active.</span>
                </div>
              ) : (
                regionalEscalations.slice(0, 3).map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3.5 bg-rose-50/50 border border-rose-200 rounded-xl text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-900">{notif.title}</span>
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-mono px-2 py-0.5 rounded-md font-bold border border-rose-200">
                        L{notif.escalationLevel || 2}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] line-clamp-2">{notif.message}</p>
                    <button
                      onClick={() => setActiveTab('alerts')}
                      className="text-rose-700 font-bold hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      <span>Take Escalation Action</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5EAF3] shadow-xs p-5">
            <h2 className="text-sm font-extrabold text-[#172033] flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-teal-100 text-teal-700 flex items-center justify-center">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              Institutions Under Watch
            </h2>
            <div className="space-y-2">
              {regionalInstitutions.map((inst) => (
                <div
                  key={inst.id}
                  className="p-3 rounded-xl border border-[#E5EAF3] bg-[#F8FAFF] hover:bg-teal-50/30 transition-colors flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#172033] truncate">{inst.name}</p>
                    <p className="text-[10px] text-slate-500">{inst.code} • {inst.city}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      inst.complianceScore >= 90
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : inst.complianceScore >= 75
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {inst.complianceScore}% Score
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

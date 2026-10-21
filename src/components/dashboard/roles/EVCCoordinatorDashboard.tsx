import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  Users,
  Video,
  Camera,
  Calendar,
  ArrowUpRight,
  Send,
  FileCheck2,
} from 'lucide-react';

export const EVCCoordinatorDashboard: React.FC = () => {
  const {
    applications,
    evcRecords,
    institutions,
    setActiveTab,
    recordEVCCompletion,
  } = useApp();

  const [activeTabFilter, setActiveTabFilter] = useState<'ALL' | 'PENDING_SCHEDULE' | 'SCHEDULED' | 'REPORT_PENDING'>('ALL');
  const [selectedEvcForReport, setSelectedEvcForReport] = useState<string | null>(null);
  const [reportSummary, setReportSummary] = useState<string>('');
  const [deficiencyCount, setDeficiencyCount] = useState<number>(0);

  // EVC Pipeline
  const pendingScheduling = evcRecords.filter((e) => e.schedulingStatus === 'AWAITING_PROPOSAL' || e.schedulingStatus === 'PROPOSED');
  const scheduledVisits = evcRecords.filter((e) => e.schedulingStatus === 'CONFIRMED' || e.completionStatus === 'IN_PROGRESS');
  const completedVisits = evcRecords.filter((e) => e.completionStatus === 'VISIT_CONCLUDED' || e.reportSubmissionStatus === 'FINAL_SUBMITTED');

  // Filtered list
  const displayedEVCs = evcRecords.filter((evc) => {
    if (activeTabFilter === 'PENDING_SCHEDULE') return evc.schedulingStatus === 'AWAITING_PROPOSAL' || evc.schedulingStatus === 'PROPOSED';
    if (activeTabFilter === 'SCHEDULED') return evc.schedulingStatus === 'CONFIRMED' || evc.completionStatus === 'IN_PROGRESS';
    if (activeTabFilter === 'REPORT_PENDING') return evc.reportSubmissionStatus === 'NOT_SUBMITTED' || evc.reportSubmissionStatus === 'DRAFT_REPORT';
    return true;
  });

  const handleCompleteReport = () => {
    if (!selectedEvcForReport || !reportSummary.trim()) return;
    recordEVCCompletion(selectedEvcForReport, reportSummary, deficiencyCount);
    setSelectedEvcForReport(null);
    setReportSummary('');
    setDeficiencyCount(0);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - White & Violet/Pink Gradient Identity */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-[#E5EAF3] text-[#172033] p-6 md:p-8 shadow-xs">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-600 via-pink-500 to-violet-600" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-200/80 text-violet-700 text-xs font-bold mb-3 shadow-2xs">
              <div className="w-5 h-5 rounded-md bg-gradient-to-r from-violet-600 to-pink-500 flex items-center justify-center text-white">
                <CalendarCheck className="w-3 h-3 text-white" />
              </div>
              <span>Expert Visit Committee Directorate</span>
              <span className="text-pink-700 font-mono font-bold">• EVC Operations</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#172033]">
              EVC Inspection & Peer Review Command
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl font-medium">
              Coordinate 3-member statutory peer review panels, schedule hybrid/physical campus inspections, and upload geo-tagged physical infrastructure findings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('evc')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-sm shadow-violet-500/20"
            >
              <Users className="w-4 h-4" />
              <span>Full EVC Management Console</span>
            </button>
          </div>
        </div>

        {/* Highlights Bar */}
        <div className="mt-6 pt-5 border-t border-[#E5EAF3] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Statutory Panel Size</span>
            <span className="font-extrabold text-[#172033] text-sm">3 Experts (Standard)</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Awaiting Expert Mobilization</span>
            <span className="font-extrabold text-amber-600 text-sm">{pendingScheduling.length} Inspections</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Visits Scheduled This Week</span>
            <span className="font-extrabold text-violet-700 text-sm">{scheduledVisits.length} Confirmed</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">EVC Completed AY 2026</span>
            <span className="font-extrabold text-emerald-600 text-sm">{completedVisits.length} Reports Filed</span>
          </div>
        </div>
      </div>

      {/* KPI Cards - White with Violet/Pink Gradient Icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E5EAF3] shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Scheduling</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-[#172033]">{pendingScheduling.length}</span>
            <span className="text-xs text-violet-700 ml-2 font-bold">Cases in queue</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">New Inst. & Major Variations</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5EAF3] shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scheduled Visits</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-xs">
              <CalendarCheck className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-[#172033]">{scheduledVisits.length}</span>
            <span className="text-xs text-pink-600 ml-2 font-bold">Panels mobilized</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">Campus inspection visits</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5EAF3] shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Geo-tagged Evidence</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center shadow-xs">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-blue-600">100%</span>
            <span className="text-xs text-emerald-600 ml-2 font-bold">GPS Verified</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">Anti-tamper campus metadata</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5EAF3] shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Reports</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-emerald-600">{completedVisits.length}</span>
            <span className="text-xs text-emerald-700 ml-2 font-bold">Signed & sealed</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">Passed to Council Authority</p>
        </div>
      </div>

      {/* Main EVC Schedule & Active Committee Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: EVC Inspections Docket */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5EAF3] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#E5EAF3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-[#172033]">EVC Inspection Operations</h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Panel appointments, confirmed visit dates, and evaluation status
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#F8FAFF] p-1 rounded-xl border border-[#E5EAF3] text-xs font-semibold text-slate-600">
              {(
                [
                  { id: 'ALL', label: 'All EVCs' },
                  { id: 'PENDING_SCHEDULE', label: 'Needs Scheduling' },
                  { id: 'SCHEDULED', label: 'Scheduled' },
                  { id: 'REPORT_PENDING', label: 'Findings Pending' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveTabFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTabFilter === f.id
                      ? 'bg-white text-violet-700 font-bold shadow-2xs'
                      : 'hover:text-[#172033]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-[#E5EAF3]">
            {displayedEVCs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No EVC records under current filter.
              </div>
            ) : (
              displayedEVCs.map((evc) => {
                const app = applications.find((a) => a.id === evc.applicationId);
                const inst = institutions.find((i) => i.id === app?.institutionId);

                return (
                  <div
                    key={evc.id}
                    className="p-5 hover:bg-[#F8FAFF]/80 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-md border border-violet-200">
                          {evc.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            evc.completionStatus === 'VISIT_CONCLUDED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : evc.schedulingStatus === 'CONFIRMED'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {evc.schedulingStatus.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs font-bold text-[#172033] truncate">
                          {inst?.name || evc.institutionName || 'Technical Institute'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span>Application: <strong className="text-[#172033]">{app?.id || evc.applicationId}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Visit Date: <strong className="text-[#172033]">{evc.confirmedVisitDate || evc.proposedVisitDate || 'TBD'}</strong>
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-violet-600" />
                        <span>Experts: {evc.expertPanel?.chairman}, {evc.expertPanel?.subjectExpert}</span>
                      </div>

                      {evc.reportSummary && (
                        <p className="text-xs text-slate-600 bg-[#F8FAFF] p-2.5 rounded-xl border border-[#E5EAF3] mt-2 line-clamp-2">
                          <strong className="text-[#172033]">Report Findings:</strong> {evc.reportSummary}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end lg:self-center">
                      {evc.completionStatus !== 'VISIT_CONCLUDED' && (
                        <button
                          onClick={() => setSelectedEvcForReport(evc.id)}
                          className="px-3.5 py-2 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm shadow-violet-500/20"
                        >
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>Submit Report</span>
                        </button>
                      )}
                      <button
                        onClick={() => setActiveTab('evc')}
                        className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-[#E5EAF3] text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>Manage EVC</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Col: 3-Member Statutory Panel Protocol - Clean Light Style */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5EAF3] shadow-xs p-5">
            <h2 className="text-sm font-extrabold text-[#172033] flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center text-white">
                <Users className="w-3.5 h-3.5 text-white" />
              </div>
              Statutory 3-Member EVC Matrix
            </h2>
            <p className="text-xs text-slate-500 mb-4 font-medium">
              AICTE mandates complete diversity of inspection committee members to eliminate conflict of interest:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-violet-50/50 rounded-xl border border-violet-100">
                <span className="font-bold text-violet-900 block">1. Committee Chairperson</span>
                <p className="text-slate-600 mt-0.5">Senior Professor / Dean from National Institute (IIT/NIT/Central University).</p>
              </div>
              <div className="p-3.5 bg-violet-50/50 rounded-xl border border-violet-100">
                <span className="font-bold text-violet-900 block">2. Subject Matter Expert</span>
                <p className="text-slate-600 mt-0.5">Discipline expert evaluating laboratories, computing facilities, and curriculum.</p>
              </div>
              <div className="p-3.5 bg-violet-50/50 rounded-xl border border-violet-100">
                <span className="font-bold text-violet-900 block">3. Architect / Regional Nominee</span>
                <p className="text-slate-600 mt-0.5">Physical infrastructure, barrier-free accessibility, fire safety, and built-up area auditor.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-50 via-purple-50/50 to-pink-50/40 border border-violet-200/80 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-2 text-violet-700 font-bold text-xs">
              <Video className="w-4 h-4 text-violet-600" />
              Geo-Tagged Digital Evidence Rules
            </div>
            <h3 className="text-sm font-extrabold text-[#172033] mb-1">Mandatory Anti-Fraud Uploads</h3>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed font-medium">
              Every EVC inspection report must be accompanied by live geotagged photographs with embedded coordinates and timestamp watermarking.
            </p>
            <div className="text-[11px] text-violet-900 font-mono bg-white p-3 rounded-xl border border-violet-200 space-y-1">
              ✓ Latitude/Longitude EXIF Match<br />
              ✓ Digital Signatures of 3 Members<br />
              ✓ Timestamp Verified with AICTE Clock
            </div>
          </div>
        </div>
      </div>

      {/* Submit Report Modal */}
      {selectedEvcForReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E5EAF3] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center text-white shadow-xs">
                <FileCheck2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#172033]">Record EVC Findings & Inspection Report</h3>
                <p className="text-xs text-slate-500 font-medium">Official statutory peer review record</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1">
                Executive Inspection Summary & Observations *
              </label>
              <textarea
                value={reportSummary}
                onChange={(e) => setReportSummary(e.target.value)}
                placeholder="e.g. Physical campus verified. Computer center equipped with 120 i7 terminals. Chemistry lab meets AICTE APH specifications. Barrier-free ramps verified."
                rows={4}
                className="w-full text-xs p-3 rounded-xl border border-[#E5EAF3] focus:outline-none focus:ring-2 focus:ring-violet-500 font-sans text-[#172033]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1">
                Physical Deficiencies Identified (0 if fully compliant)
              </label>
              <input
                type="number"
                min={0}
                max={20}
                value={deficiencyCount}
                onChange={(e) => setDeficiencyCount(Number(e.target.value))}
                className="w-24 text-xs p-2 rounded-xl border border-[#E5EAF3] focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono font-bold"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedEvcForReport(null);
                  setReportSummary('');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteReport}
                disabled={!reportSummary.trim()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Signed Inspection Report</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

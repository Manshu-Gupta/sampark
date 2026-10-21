import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EVCRecord } from '../../types';
import {
  CalendarCheck,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Building2,
  FileText,
  MapPin,
  List,
  LayoutGrid,
} from 'lucide-react';

export const EVCManagement: React.FC = () => {
  const { evcRecords, currentUser, scheduleEVCVisit, recordEVCCompletion, currentSimulatedDate } =
    useApp();

  const [viewMode, setViewMode] = useState<'TABLE' | 'CALENDAR'>('TABLE');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Schedule Modal
  const [selectedEvc, setSelectedEvc] = useState<EVCRecord | null>(null);
  const [proposedDate, setProposedDate] = useState('2026-10-28');
  const [confirmedDate, setConfirmedDate] = useState('');
  const [scheduleNotes, setScheduleNotes] = useState('');

  // Report Modal
  const [reportingEvc, setReportingEvc] = useState<EVCRecord | null>(null);
  const [reportSummary, setReportSummary] = useState(
    'Infrastructure and laboratory physical assets verified. Faculty attendance registers cross-checked.'
  );
  const [deficiencyCount, setDeficiencyCount] = useState<number>(0);

  const filteredRecords = evcRecords.filter((rec) => {
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'CONFIRMED' && rec.schedulingStatus !== 'CONFIRMED') return false;
      if (statusFilter === 'PROPOSED' && rec.schedulingStatus !== 'PROPOSED') return false;
      if (statusFilter === 'AWAITING' && rec.schedulingStatus !== 'AWAITING_PROPOSAL') return false;
      if (statusFilter === 'CONCLUDED' && rec.completionStatus !== 'VISIT_CONCLUDED') return false;
    }
    return true;
  });

  const getStatusBadge = (rec: EVCRecord) => {
    if (rec.completionStatus === 'VISIT_CONCLUDED') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
          <CheckCircle2 className="w-3 h-3 text-purple-600" />
          Visit Concluded
        </span>
      );
    }
    if (rec.schedulingStatus === 'CONFIRMED') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Confirmed ({rec.confirmedVisitDate})
        </span>
      );
    }
    if (rec.schedulingStatus === 'PROPOSED') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
          <Clock className="w-3 h-3 text-blue-600" />
          Date Proposed ({rec.proposedVisitDate})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
        <AlertTriangle className="w-3 h-3 text-amber-600" />
        Awaiting Scheduling
      </span>
    );
  };

  const isCoordinator = ['EVC_COORDINATOR', 'REGIONAL_ADMIN', 'SENIOR_AUTHORITY'].includes(
    currentUser.role
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Expert Visit Committee (EVC) Operations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Physical on-site inspection roster, panel dispatching, and digital report compilation under APH 2026-27
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('TABLE')}
              className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'TABLE' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Table View
            </button>
            <button
              onClick={() => setViewMode('CALENDAR')}
              className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'CALENDAR' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Calendar View
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Visits In Roster</span>
          <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">{evcRecords.length}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Mandatory on-site inspections</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[10px] font-bold uppercase text-amber-700">Awaiting Proposal</span>
          <div className="text-xl font-bold text-amber-800 font-mono mt-0.5">
            {evcRecords.filter((r) => r.schedulingStatus === 'AWAITING_PROPOSAL').length}
          </div>
          <p className="text-[10px] text-amber-600 mt-0.5">Pending coordinator action</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[10px] font-bold uppercase text-emerald-700">Visits Confirmed</span>
          <div className="text-xl font-bold text-emerald-800 font-mono mt-0.5">
            {evcRecords.filter((r) => r.schedulingStatus === 'CONFIRMED').length}
          </div>
          <p className="text-[10px] text-emerald-600 mt-0.5">Expert panels mobilized</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[10px] font-bold uppercase text-purple-700">Reports In Review</span>
          <div className="text-xl font-bold text-purple-800 font-mono mt-0.5">
            {evcRecords.filter((r) => r.reportSubmissionStatus === 'DRAFT_REPORT' || r.reportSubmissionStatus === 'FINAL_SUBMITTED').length}
          </div>
          <p className="text-[10px] text-purple-600 mt-0.5">Regional committee review</p>
        </div>
      </div>

      {/* Main View */}
      {viewMode === 'TABLE' ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Expert Visit Roster Cases</h3>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="ALL">All Roster States</option>
              <option value="CONFIRMED">Confirmed Visits</option>
              <option value="PROPOSED">Proposed Dates</option>
              <option value="AWAITING">Awaiting Scheduling</option>
              <option value="CONCLUDED">Concluded Visits</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                <tr>
                  <th className="px-4 py-3">EVC Record ID</th>
                  <th className="px-4 py-3">Technical Institution</th>
                  <th className="px-4 py-3">Inspection Panel</th>
                  <th className="px-4 py-3">Scheduling Status</th>
                  <th className="px-4 py-3">Proposed / Confirmed Date</th>
                  <th className="px-4 py-3">Report Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-blue-700">
                      {rec.id}
                      <span className="block text-[10px] text-slate-400 font-sans">
                        Case: {rec.applicationId}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{rec.institutionName}</div>
                      <span className="text-[10px] text-slate-400">{rec.notes}</span>
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      <div className="font-medium text-slate-800">{rec.expertPanel.chairman}</div>
                      <div className="text-[10px] text-slate-400">
                        {rec.expertPanel.subjectExpert} · {rec.expertPanel.regionalNominee}
                      </div>
                    </td>

                    <td className="px-4 py-3">{getStatusBadge(rec)}</td>

                    <td className="px-4 py-3 font-mono">
                      {rec.confirmedVisitDate ? (
                        <span className="font-bold text-emerald-700">{rec.confirmedVisitDate}</span>
                      ) : rec.proposedVisitDate ? (
                        <span className="text-slate-700">{rec.proposedVisitDate} (Proposed)</span>
                      ) : (
                        <span className="text-amber-600 font-medium">To be scheduled</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">
                      {rec.reportSubmissionStatus.replace(/_/g, ' ')}
                      {rec.reportDeficiencyCount !== undefined && (
                        <span className="block text-[10px] text-slate-400 font-sans">
                          Deficiencies: {rec.reportDeficiencyCount}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right space-x-2">
                      {isCoordinator && rec.completionStatus !== 'VISIT_CONCLUDED' && (
                        <button
                          onClick={() => {
                            setSelectedEvc(rec);
                            setProposedDate(rec.proposedVisitDate || '2026-10-28');
                            setConfirmedDate(rec.confirmedVisitDate || '');
                            setScheduleNotes(rec.notes || '');
                          }}
                          className="px-2.5 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-xs transition-colors"
                        >
                          {rec.schedulingStatus === 'CONFIRMED' ? 'Reschedule' : 'Schedule Visit'}
                        </button>
                      )}

                      {isCoordinator &&
                        rec.schedulingStatus === 'CONFIRMED' &&
                        rec.completionStatus !== 'VISIT_CONCLUDED' && (
                          <button
                            onClick={() => {
                              setReportingEvc(rec);
                              setReportSummary(
                                'Physical facilities inspected. Computer labs, library volumes, and faculty cadre verified.'
                              );
                              setDeficiencyCount(0);
                            }}
                            className="px-2.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow-xs transition-colors"
                          >
                            Record Report
                          </button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Calendar View */
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              Inspection Calendar · October - November 2026
            </h3>
            <span className="text-xs font-mono text-slate-500">
              Today: {currentSimulatedDate.toLocaleDateString()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {evcRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-slate-400 text-[10px]">{rec.id}</span>
                  {getStatusBadge(rec)}
                </div>
                <h4 className="font-bold text-slate-900 line-clamp-1">{rec.institutionName}</h4>
                <div className="flex items-center gap-1.5 text-slate-600 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>
                    {rec.confirmedVisitDate
                      ? `Confirmed: ${rec.confirmedVisitDate}`
                      : rec.proposedVisitDate
                      ? `Proposed: ${rec.proposedVisitDate}`
                      : 'Date Pending'}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                  <div>Chairman: {rec.expertPanel.chairman}</div>
                  <div>Subject Expert: {rec.expertPanel.subjectExpert}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Schedule Visit */}
      {selectedEvc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-blue-600" />
              Schedule Expert Visit Committee (EVC)
            </h3>
            <p className="text-xs text-slate-500">
              Institution: <strong>{selectedEvc.institutionName}</strong>
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Proposed Visit Date
                </label>
                <input
                  type="date"
                  value={proposedDate}
                  onChange={(e) => setProposedDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirmed Date (Optional)
                </label>
                <input
                  type="date"
                  value={confirmedDate}
                  onChange={(e) => setConfirmedDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Coordinator Logistics Notes
              </label>
              <textarea
                rows={2}
                value={scheduleNotes}
                onChange={(e) => setScheduleNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedEvc(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  scheduleEVCVisit(selectedEvc.id, proposedDate, confirmedDate || undefined, scheduleNotes);
                  setSelectedEvc(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Record EVC Completion Report */}
      {reportingEvc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Record EVC Inspection Findings &amp; Report
            </h3>
            <p className="text-xs text-slate-500">
              Enter findings from Chairman <strong>{reportingEvc.expertPanel.chairman}</strong>.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Deficiency Count Found on Site
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={deficiencyCount}
                onChange={(e) => setDeficiencyCount(parseInt(e.target.value, 10) || 0)}
                className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Executive Inspection Summary
              </label>
              <textarea
                rows={3}
                value={reportSummary}
                onChange={(e) => setReportSummary(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setReportingEvc(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  recordEVCCompletion(reportingEvc.id, reportSummary, deficiencyCount);
                  setReportingEvc(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Submit Inspection Report &amp; Conclude
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

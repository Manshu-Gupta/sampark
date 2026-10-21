import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Download,
  Filter,
  FileSpreadsheet,
  Calendar,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const ReportsView: React.FC = () => {
  const { applications, institutions, documents, complianceObligations, evcRecords, auditEvents } =
    useApp();

  const [activeReportId, setActiveReportId] = useState<string>('PENDENCY');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');

  const reportTypes = [
    { id: 'PENDENCY', name: '1. Application Pendency Report' },
    { id: 'REGION_WISE', name: '2. Region-Wise Processing Report' },
    { id: 'STAGE_WISE', name: '3. Stage-Wise Processing Report' },
    { id: 'EVC_STATUS', name: '4. EVC Status Report' },
    { id: 'COMPLIANCE', name: '5. Undertaking Compliance Report' },
    { id: 'DOC_EXPIRY', name: '6. Document Expiry Report' },
    { id: 'OVERDUE', name: '7. Overdue Cases Report' },
    { id: 'ESCALATION', name: '8. Escalation Report' },
    { id: 'WORKLOAD', name: '9. Official Workload Report' },
    { id: 'AUDIT', name: '10. Application Audit History Report' },
  ];

  // CSV Generator function
  const exportToCSV = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];

    switch (activeReportId) {
      case 'PENDENCY':
      case 'OVERDUE':
        headers = ['Application ID', 'Institution', 'Type', 'Current Stage', 'Days in Stage', 'SLA Days', 'Deadline', 'Officer', 'Priority'];
        rows = applications.map((a) => [
          a.id,
          a.institutionName,
          a.type,
          a.currentStage,
          a.daysInCurrentStage,
          a.stageSlaDays,
          a.stageDeadline,
          a.assignedOfficerName,
          a.priority,
        ]);
        break;

      case 'DOC_EXPIRY':
        headers = ['Document ID', 'Document Title', 'Institution ID', 'Type', 'Expiry Date', 'Status', 'Verified By'];
        rows = documents.map((d) => [
          d.id,
          d.name,
          d.institutionId,
          d.type,
          d.expiryDate || 'Perpetual',
          d.verificationStatus,
          d.verifiedBy || 'Pending',
        ]);
        break;

      case 'COMPLIANCE':
        headers = ['Obligation ID', 'Requirement Description', 'Institution', 'Source Rule', 'Due Date', 'Status', 'Reviewer'];
        rows = complianceObligations.map((c) => [
          c.id,
          c.requirementDescription,
          c.institutionName,
          c.sourceRuleRef,
          c.dueDate,
          c.status,
          c.assignedReviewer,
        ]);
        break;

      case 'EVC_STATUS':
        headers = ['EVC ID', 'Application ID', 'Institution', 'Proposed Date', 'Confirmed Date', 'Scheduling Status', 'Report Status'];
        rows = evcRecords.map((e) => [
          e.id,
          e.applicationId,
          e.institutionName,
          e.proposedVisitDate || 'Pending',
          e.confirmedVisitDate || 'Pending',
          e.schedulingStatus,
          e.reportSubmissionStatus,
        ]);
        break;

      case 'AUDIT':
        headers = ['Audit Event ID', 'Timestamp', 'User', 'Role', 'Action', 'Entity Type', 'Entity ID', 'Reason Notes'];
        rows = auditEvents.map((ev) => [
          ev.id,
          ev.timestamp,
          ev.userName,
          ev.userRole,
          ev.action,
          ev.entityType,
          ev.entityId,
          ev.reasonNotes,
        ]);
        break;

      default:
        headers = ['Application ID', 'Institution', 'Region', 'Stage', 'Days', 'SLA'];
        rows = applications.map((a) => [
          a.id,
          a.institutionName,
          a.region,
          a.currentStage,
          a.daysInCurrentStage,
          a.stageSlaDays,
        ]);
    }

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AICTE_SAMPARK_${activeReportId}_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Report Specific Chart Data
  const chartData = useMemo(() => {
    if (activeReportId === 'REGION_WISE') {
      const counts: Record<string, number> = {};
      applications.forEach((a) => {
        counts[a.region] = (counts[a.region] || 0) + 1;
      });
      return Object.entries(counts).map(([name, count]) => ({ name: name.replace('_', ' '), count }));
    }
    if (activeReportId === 'STAGE_WISE') {
      const counts: Record<string, number> = {};
      applications.forEach((a) => {
        counts[a.currentStage] = (counts[a.currentStage] || 0) + 1;
      });
      return Object.entries(counts).map(([name, count]) => ({ name: name.replace(/_/g, ' '), count }));
    }
    return [];
  }, [applications, activeReportId]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Statutory Reports &amp; Processing Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            10 standard regulatory reports with live data synchronization and authorized CSV export
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download CSV Report
          </button>
        </div>
      </div>

      {/* Report Selector Pills */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 overflow-x-auto flex items-center gap-1.5">
        {reportTypes.map((rep) => {
          const isSelected = activeReportId === rep.id;
          return (
            <button
              key={rep.id}
              onClick={() => setActiveReportId(rep.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                isSelected
                  ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {rep.name}
            </button>
          );
        })}
      </div>

      {/* Visual Chart if applicable */}
      {chartData.length > 0 && (
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Visual Distribution Trend</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Main Report Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            {reportTypes.find((r) => r.id === activeReportId)?.name}
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Generated: {new Date().toLocaleDateString()}
          </span>
        </div>

        <div className="overflow-x-auto">
          {/* Dynamic table content based on active report */}
          {activeReportId === 'DOC_EXPIRY' ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                <tr>
                  <th className="px-4 py-3">Doc ID</th>
                  <th className="px-4 py-3">Document Title</th>
                  <th className="px-4 py-3">Institution ID</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Expiry Date</th>
                  <th className="px-4 py-3">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-mono font-bold text-blue-700">{d.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{d.name}</td>
                    <td className="px-4 py-3 text-slate-600 font-mono">{d.institutionId}</td>
                    <td className="px-4 py-3 text-slate-600">{d.type}</td>
                    <td className="px-4 py-3 font-mono text-slate-700">{d.expiryDate || 'Perpetual'}</td>
                    <td className="px-4 py-3 font-semibold">{d.verificationStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : activeReportId === 'COMPLIANCE' ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                <tr>
                  <th className="px-4 py-3">Obligation ID</th>
                  <th className="px-4 py-3">Requirement</th>
                  <th className="px-4 py-3">Institution</th>
                  <th className="px-4 py-3">Rule Reference</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complianceObligations.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-mono font-bold text-blue-700">{c.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{c.requirementDescription}</td>
                    <td className="px-4 py-3 text-slate-600">{c.institutionName}</td>
                    <td className="px-4 py-3 font-mono text-slate-500">{c.sourceRuleRef}</td>
                    <td className="px-4 py-3 font-mono text-slate-700">{c.dueDate}</td>
                    <td className="px-4 py-3 font-semibold">{c.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                <tr>
                  <th className="px-4 py-3">Application ID</th>
                  <th className="px-4 py-3">Technical Institution</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Current Stage</th>
                  <th className="px-4 py-3">Days in Stage</th>
                  <th className="px-4 py-3">Stage SLA</th>
                  <th className="px-4 py-3">Assigned Officer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-mono font-bold text-blue-700">{a.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{a.institutionName}</td>
                    <td className="px-4 py-3 text-slate-600">{a.type.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3 font-semibold">{a.currentStage.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3 font-mono text-slate-700">{a.daysInCurrentStage} days</td>
                    <td className="px-4 py-3 font-mono text-slate-500">{a.stageSlaDays} days</td>
                    <td className="px-4 py-3 text-slate-600">{a.assignedOfficerName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

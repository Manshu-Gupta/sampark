import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  History,
  Search,
  Filter,
  ShieldCheck,
  Calendar,
  Lock,
  ArrowRight,
} from 'lucide-react';

export const AuditTrailView: React.FC = () => {
  const { auditEvents } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState('ALL');

  const filteredEvents = auditEvents.filter((ev) => {
    if (entityFilter !== 'ALL' && ev.entityType !== entityFilter) return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        ev.id.toLowerCase().includes(q) ||
        ev.userName.toLowerCase().includes(q) ||
        ev.action.toLowerCase().includes(q) ||
        ev.entityId.toLowerCase().includes(q) ||
        ev.reasonNotes.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-slate-800" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Statutory Audit Trail &amp; Immutable System Ledger
            </h2>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-500" />
              Write-Only Cryptographic Log
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Every administrative action, scrutiny observation, workflow transition, and document reuse event is irreversibly recorded with correlation timestamps
          </p>
        </div>

        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
          {auditEvents.length} Recorded Ledger Events
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit trail by Entity ID, Officer Name, Action, or Reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
          >
            <option value="ALL">All Entity Types</option>
            <option value="APPLICATION">Applications</option>
            <option value="DOCUMENT">Documents &amp; Vault</option>
            <option value="COMPLIANCE">Compliance Undertakings</option>
            <option value="EVC">EVC Operations</option>
            <option value="WORKFLOW">Workflow Engine</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
              <tr>
                <th className="px-4 py-3">Event ID</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Authorised Official</th>
                <th className="px-4 py-3">Action Type</th>
                <th className="px-4 py-3">Target Entity</th>
                <th className="px-4 py-3">State Transition (Diff)</th>
                <th className="px-4 py-3">Reason / Administrative Notes</th>
                <th className="px-4 py-3">Correlation ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-blue-700">{ev.id}</td>

                  <td className="px-4 py-3 font-mono text-slate-500 whitespace-nowrap">
                    {ev.timestamp}
                  </td>

                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-800">{ev.userName}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{ev.userRole}</span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="inline-block px-1.5 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      {ev.action}
                    </span>
                  </td>

                  <td className="px-4 py-3 font-mono">
                    <span className="text-slate-800 font-semibold">{ev.entityId}</span>
                    <span className="block text-[10px] text-slate-400">{ev.entityType}</span>
                  </td>

                  <td className="px-4 py-3 font-mono text-[11px]">
                    {ev.previousValue || ev.newValue ? (
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <span className="text-slate-400 line-through">
                          {ev.previousValue || 'INITIAL'}
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="font-bold text-blue-700">{ev.newValue}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-slate-700 max-w-xs">{ev.reasonNotes}</td>

                  <td className="px-4 py-3 font-mono text-slate-400 text-[10px]">
                    {ev.correlationId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

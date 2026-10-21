import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NotificationRecord } from '../../types';
import {
  AlertOctagon,
  Bell,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FastForward,
  RotateCcw,
  ShieldAlert,
  Send,
  Filter,
} from 'lucide-react';

export const AlertsCenter: React.FC = () => {
  const {
    notifications,
    currentUser,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    acknowledgeNotification,
    advanceSimulatedDays,
    currentSimulatedDate,
    setSelectedApplicationId,
    setActiveTab,
  } = useApp();

  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterEscalation, setFilterEscalation] = useState<string>('ALL');

  const filteredNotifs = notifications.filter((n) => {
    if (filterSeverity !== 'ALL' && n.severity !== filterSeverity) return false;
    if (filterEscalation !== 'ALL') {
      if (filterEscalation === 'ESCALATED' && n.escalationLevel === 0) return false;
      if (filterEscalation === 'STANDARD' && n.escalationLevel > 0) return false;
    }
    return true;
  });

  const criticalCount = notifications.filter((n) => n.severity === 'CRITICAL').length;
  const warningCount = notifications.filter((n) => n.severity === 'WARNING').length;
  const escalatedCount = notifications.filter((n) => n.escalationLevel > 0).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Alerts, Deadline Reminders &amp; Statutory Escalations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time deadline tracking engine enforcing 14-day scrutiny SLAs, 30-day document renewals, and tiered administrative escalations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllNotificationsAsRead}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg transition-colors"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {/* Time-Travel Simulator Panel - Elegant White Theme with Blue Accent */}
      <div className="bg-white text-[#172033] p-5 rounded-2xl border border-[#E5EAF3] shadow-xs space-y-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 text-[#3867F5] border border-blue-200 rounded-full text-[10px] font-bold uppercase mb-1">
              <FastForward className="w-3 h-3 text-[#3867F5]" />
              SLA Time-Travel Simulation Sandbox
            </div>
            <h3 className="text-sm font-bold text-[#172033]">
              Demonstrate Aging, Reminder Intervals &amp; Escalation Triggers
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Simulated Date:{' '}
              <span className="font-mono text-[#3867F5] font-bold">
                {currentSimulatedDate.toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => advanceSimulatedDays(7)}
              className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FastForward className="w-3.5 h-3.5" />
              Advance +7 Days
            </button>
            <button
              onClick={() => advanceSimulatedDays(15)}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FastForward className="w-3.5 h-3.5" />
              Advance +15 Days
            </button>
            <button
              onClick={() => advanceSimulatedDays(30)}
              className="px-3 py-1.5 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FastForward className="w-3.5 h-3.5" />
              Advance +30 Days
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-rose-200/80 shadow-xs hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between text-rose-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">Critical SLA Breaches</span>
            <div className="w-8 h-8 rounded-lg gradient-icon-rose flex items-center justify-center shadow-xs">
              <AlertOctagon className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#EF4444] font-mono mt-2">{criticalCount}</div>
          <p className="text-[11px] text-[#64748B] mt-1">Mandatory administrative response required</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200/80 shadow-xs hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Approaching Deadlines</span>
            <div className="w-8 h-8 rounded-lg gradient-icon-orange flex items-center justify-center shadow-xs">
              <Clock className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 font-mono mt-2">{warningCount}</div>
          <p className="text-[11px] text-[#64748B] mt-1">&lt; 3 days before stage expiration</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-purple-200/80 shadow-xs hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between text-purple-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Level 1 &amp; 2 Escalations</span>
            <div className="w-8 h-8 rounded-lg gradient-icon-violet flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#8B5CF6] font-mono mt-2">{escalatedCount}</div>
          <p className="text-[11px] text-[#64748B] mt-1">Forwarded to Regional Head / Bureau</p>
        </div>
      </div>

      {/* Notification Center Stream */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Notification &amp; Escalation Stream ({filteredNotifs.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical Breaches</option>
              <option value="WARNING">Warnings</option>
              <option value="INFO">Informational</option>
            </select>

            <select
              value={filterEscalation}
              onChange={(e) => setFilterEscalation(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="ALL">All Cases</option>
              <option value="ESCALATED">Escalated Only (L1/L2)</option>
              <option value="STANDARD">Standard Alerts</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                !notif.isRead ? 'bg-blue-50/30' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                {notif.severity === 'CRITICAL' ? (
                  <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                ) : notif.severity === 'WARNING' ? (
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{notif.title}</h4>
                    {notif.escalationLevel > 0 && (
                      <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.2 rounded border border-purple-200">
                        Level {notif.escalationLevel} Escalation
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-slate-400">{notif.createdAt}</span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-2">
                    <span>
                      Target: <strong>{notif.recipientRole.replace(/_/g, ' ')}</strong>
                    </span>
                    <span>·</span>
                    <span>Entity: {notif.relatedEntityId}</span>
                    {notif.deadline && (
                      <>
                        <span>·</span>
                        <span className="font-mono text-rose-700 font-semibold">
                          Deadline: {notif.deadline}
                        </span>
                      </>
                    )}
                    {notif.isAcknowledged && (
                      <>
                        <span>·</span>
                        <span className="text-emerald-700 font-medium">
                          ✓ Acknowledged at {notif.acknowledgedAt}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {notif.relatedEntityType === 'APPLICATION' && (
                  <button
                    onClick={() => {
                      setSelectedApplicationId(notif.relatedEntityId);
                      setActiveTab('application_detail');
                    }}
                    className="px-2.5 py-1 text-xs bg-white hover:bg-slate-100 text-blue-700 border border-blue-200 font-medium rounded-md transition-colors"
                  >
                    Open Case
                  </button>
                )}

                {!notif.isAcknowledged ? (
                  <button
                    onClick={() => acknowledgeNotification(notif.id)}
                    className="px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-md shadow-2xs transition-colors"
                  >
                    Acknowledge
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-400 font-mono">Recorded</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ApplicationRoute, ApprovalStage } from '../../types';
import {
  GitBranch,
  ShieldAlert,
  Clock,
  ArrowRight,
  CheckCircle,
  Settings,
  Users,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export const WorkflowManagement: React.FC = () => {
  const { workflowDefinitions, currentUser } = useApp();

  const [selectedRoute, setSelectedRoute] = useState<ApplicationRoute>('SCRUTINY_EVC');
  const [editingSlas, setEditingSlas] = useState<Partial<Record<ApprovalStage, number>>>(
    workflowDefinitions[selectedRoute].stageSlas
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  const activeDef = workflowDefinitions[selectedRoute];

  const handleRouteChange = (route: ApplicationRoute) => {
    setSelectedRoute(route);
    setEditingSlas(workflowDefinitions[route].stageSlas);
    setSaveSuccess(false);
  };

  const handleSlaChange = (stage: ApprovalStage, days: number) => {
    setEditingSlas((prev) => ({
      ...prev,
      [stage]: days,
    }));
    setSaveSuccess(false);
  };

  const handleSaveConfig = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            AICTE Approval Workflow Engine &amp; Route Configuration
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Define mandatory approval stages, SLA turnaround thresholds, allowed transitions, and escalation triggers according to APH norms
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Workflow Rules Saved
            </span>
          )}
          <button
            onClick={handleSaveConfig}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            Save Route Configuration
          </button>
        </div>
      </div>

      {/* Route Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {(Object.keys(workflowDefinitions) as ApplicationRoute[]).map((r) => {
          const def = workflowDefinitions[r];
          const isSelected = selectedRoute === r;
          return (
            <div
              key={r}
              onClick={() => handleRouteChange(r)}
              className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                isSelected
                  ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
                <span>{def.routeName.split(':')[0]}</span>
                {isSelected && (
                  <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-semibold">
                    Active Route
                  </span>
                )}
              </div>
              <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">{def.routeName.split(':')[1]}</h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{def.description}</p>
              <div className="mt-2 pt-2 border-t border-slate-200/60 text-[10px] text-slate-400 font-mono">
                {def.stages.length} Sequential Stages
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Workflow Stage Progression */}
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-blue-600" />
              Configured Stage Pipeline &amp; Transition Graph
            </h3>
            <p className="text-xs text-slate-500">{activeDef.description}</p>
          </div>
          <span className="text-xs font-mono text-slate-500">Route ID: {activeDef.route}</span>
        </div>

        {/* Visual Pipeline Bar */}
        <div className="flex flex-wrap items-center gap-2 py-4 px-2 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto">
          {activeDef.stages.map((stage, idx) => (
            <React.Fragment key={stage}>
              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs min-w-[130px] shrink-0">
                <span className="text-[10px] font-mono text-slate-400 block font-semibold">
                  Step 0{idx + 1}
                </span>
                <span className="text-xs font-bold text-slate-900 block mt-0.5">
                  {stage.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] text-blue-700 font-mono block mt-1 font-semibold">
                  SLA: {editingSlas[stage] || 14} Days
                </span>
              </div>
              {idx < activeDef.stages.length - 1 && (
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Stage SLA & Escalation Rules Editor Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-600" />
            Stage SLA Limits, Responsible Roles &amp; Preconditions
          </h3>
          <span className="text-xs text-slate-500">Authorized: Regional Directorate / Bureau Head</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
              <tr>
                <th className="px-4 py-3">Stage Name</th>
                <th className="px-4 py-3">Authorized Role</th>
                <th className="px-4 py-3">Prescribed SLA (Days)</th>
                <th className="px-4 py-3">Permitted Next Transitions</th>
                <th className="px-4 py-3">Reminder Schedule</th>
                <th className="px-4 py-3">Escalation Trigger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeDef.stages.map((stage) => {
                const nextTransitions = activeDef.allowedTransitions[stage] || [];
                const roles = activeDef.requiredRoles[stage] || ['OFFICER'];

                return (
                  <tr key={stage} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {stage.replace(/_/g, ' ')}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      <div className="flex flex-wrap gap-1">
                        {roles.map((r) => (
                          <span
                            key={r}
                            className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.2 rounded font-medium border border-slate-200"
                          >
                            {r.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-4 py-3 font-mono">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max="60"
                          value={editingSlas[stage] || 14}
                          onChange={(e) => handleSlaChange(stage, parseInt(e.target.value, 10) || 1)}
                          className="w-16 px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-bold text-slate-900"
                        />
                        <span className="text-slate-400 text-xs">days</span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {nextTransitions.length === 0 ? (
                          <span className="text-slate-400 text-[10px]">Terminal State</span>
                        ) : (
                          nextTransitions.map((t) => (
                            <span
                              key={t}
                              className="bg-blue-50 text-blue-700 text-[10px] px-1.5 py-0.2 rounded font-medium border border-blue-200"
                            >
                              → {t.replace(/_/g, ' ')}
                            </span>
                          ))
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                      T-7d, T-3d, T-1d
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded font-bold">
                        Auto L1 at T+1d · L2 at T+3d
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Application, ApprovalStage, ApplicationType } from '../../types';
import {
  Search,
  Filter,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle,
  Building2,
  Calendar,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { NewApplicationModal } from './NewApplicationModal';

export const ApplicationList: React.FC = () => {
  const {
    applications,
    currentUser,
    setSelectedApplicationId,
    setActiveTab,
    applicationFilter,
    setApplicationFilter,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>(applicationFilter.stage || 'ALL');
  const [selectedRegion, setSelectedRegion] = useState<string>(applicationFilter.region || 'ALL');
  const [selectedType, setSelectedType] = useState<string>(applicationFilter.type || 'ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [showNewModal, setShowNewModal] = useState(false);

  // Sync incoming filter from context if provided
  React.useEffect(() => {
    if (applicationFilter.stage) setSelectedStage(applicationFilter.stage);
    if (applicationFilter.region) setSelectedRegion(applicationFilter.region);
    if (applicationFilter.type) setSelectedType(applicationFilter.type);
    if (applicationFilter.quickStatus === 'OVERDUE') setSelectedRisk('HIGH_RISK');
  }, [applicationFilter]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Role scope filter
      if (currentUser.role === 'INSTITUTION_ADMIN' && currentUser.institutionId) {
        if (app.institutionId !== currentUser.institutionId) return false;
      }

      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matches =
          app.id.toLowerCase().includes(query) ||
          app.institutionName.toLowerCase().includes(query) ||
          app.type.toLowerCase().includes(query) ||
          app.assignedOfficerName.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // Stage
      if (selectedStage !== 'ALL' && app.currentStage !== selectedStage) return false;

      // Region
      if (selectedRegion !== 'ALL' && app.region !== selectedRegion) return false;

      // Type
      if (selectedType !== 'ALL' && app.type !== selectedType) return false;

      // Delay Risk
      if (selectedRisk !== 'ALL' && app.delayRisk !== selectedRisk) return false;

      // Quick status filter from context
      if (applicationFilter.quickStatus === 'OVERDUE') {
        if (app.daysInCurrentStage <= app.stageSlaDays) return false;
      }

      return true;
    });
  }, [
    applications,
    currentUser,
    searchTerm,
    selectedStage,
    selectedRegion,
    selectedType,
    selectedRisk,
    applicationFilter,
  ]);

  const getStageBadgeStyle = (stage: ApprovalStage) => {
    switch (stage) {
      case 'DRAFT':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'SUBMITTED':
      case 'PRELIMINARY_CHECK':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'SCRUTINY':
      case 'RE_SCRUTINY':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'CLARIFICATION_REQUIRED':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'EVC_PENDING':
      case 'EVC_SCHEDULED':
      case 'EVC_COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'COMMITTEE_PROCESSING':
      case 'FURTHER_VERIFICATION':
      case 'DECISION_PENDING':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'APPROVED':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'REJECTED':
      case 'WITHDRAWN':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getRiskBadge = (risk: 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK') => {
    switch (risk) {
      case 'HIGH_RISK':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            High Risk
          </span>
        );
      case 'MEDIUM_RISK':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
            <Clock className="w-3 h-3 text-amber-600" />
            Medium
          </span>
        );
      case 'LOW_RISK':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            On Track
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            AICTE Approval Applications Registry
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage institutional approval lifecycles, scrutiny queues, and committee evaluations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Submit New Application
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Application ID, Institution Name, or Officer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Stage filter */}
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none"
            >
              <option value="ALL">All Stages</option>
              <option value="DRAFT">Draft</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="SCRUTINY">Under Scrutiny</option>
              <option value="CLARIFICATION_REQUIRED">Clarification Required</option>
              <option value="RE_SCRUTINY">Re-Scrutiny</option>
              <option value="EVC_PENDING">EVC Pending</option>
              <option value="EVC_SCHEDULED">EVC Scheduled</option>
              <option value="COMMITTEE_PROCESSING">Committee Stage</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>

            {/* Region filter */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none"
            >
              <option value="ALL">All Regions</option>
              <option value="WESTERN">Western</option>
              <option value="NORTHERN">Northern</option>
              <option value="SOUTHERN">Southern</option>
              <option value="EASTERN">Eastern</option>
              <option value="CENTRAL">Central</option>
              <option value="NORTH_WESTERN">North-Western</option>
            </select>

            {/* Delay Risk filter */}
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none"
            >
              <option value="ALL">All Delay Risks</option>
              <option value="HIGH_RISK">High Risk (Overdue)</option>
              <option value="MEDIUM_RISK">Medium Risk (&gt;75% SLA)</option>
              <option value="LOW_RISK">Low Risk (On Track)</option>
            </select>

            {/* Clear Filter button */}
            {(selectedStage !== 'ALL' || selectedRegion !== 'ALL' || selectedType !== 'ALL' || selectedRisk !== 'ALL' || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedStage('ALL');
                  setSelectedRegion('ALL');
                  setSelectedType('ALL');
                  setSelectedRisk('ALL');
                  setSearchTerm('');
                  setApplicationFilter({});
                }}
                className="px-2.5 py-2 text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
              <tr>
                <th className="px-4 py-3">Application ID</th>
                <th className="px-4 py-3">Institution & Region</th>
                <th className="px-4 py-3">Type & Route</th>
                <th className="px-4 py-3">Current Stage</th>
                <th className="px-4 py-3">Assigned Officer</th>
                <th className="px-4 py-3">Stage SLA Aging</th>
                <th className="px-4 py-3">Delay Risk</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    <Building2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No applications match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => {
                  const isOverdue = app.daysInCurrentStage > app.stageSlaDays;
                  const isClarification = app.currentStage === 'CLARIFICATION_REQUIRED';

                  return (
                    <tr
                      key={app.id}
                      onClick={() => {
                        setSelectedApplicationId(app.id);
                        setActiveTab('application_detail');
                      }}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      {/* Application ID */}
                      <td className="px-4 py-3">
                        <div className="font-mono font-bold text-blue-700 flex items-center gap-1.5">
                          {app.id}
                          {app.reusedDocumentIds.length > 0 && (
                            <span
                              className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1 rounded font-sans"
                              title={`${app.reusedDocumentIds.length} verified documents reused`}
                            >
                              USP Reused
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Submitted: {app.submissionDate}
                        </span>
                      </td>

                      {/* Institution */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800 line-clamp-1">
                          {app.institutionName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {app.region} Region · Code: {app.institutionId}
                        </div>
                      </td>

                      {/* Type & Route */}
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-700">
                          {app.type.replace(/_/g, ' ')}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {app.route.replace(/_/g, ' ')}
                        </div>
                      </td>

                      {/* Current Stage */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${getStageBadgeStyle(
                            app.currentStage
                          )}`}
                        >
                          {app.currentStage.replace(/_/g, ' ')}
                        </span>
                        {isClarification && (
                          <div className="text-[10px] text-amber-600 font-medium mt-0.5">
                            Deficiency response awaited
                          </div>
                        )}
                      </td>

                      {/* Assigned Officer */}
                      <td className="px-4 py-3 text-slate-600">
                        {app.assignedOfficerName}
                      </td>

                      {/* Stage SLA Aging */}
                      <td className="px-4 py-3 font-mono">
                        <div
                          className={`font-semibold ${
                            isOverdue ? 'text-rose-600 font-bold' : 'text-slate-800'
                          }`}
                        >
                          {app.daysInCurrentStage}d / {app.stageSlaDays}d SLA
                        </div>
                        <span className="text-[10px] text-slate-400">
                          Due: {app.stageDeadline}
                        </span>
                      </td>

                      {/* Delay Risk */}
                      <td className="px-4 py-3">{getRiskBadge(app.delayRisk)}</td>

                      {/* Action */}
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedApplicationId(app.id);
                            setActiveTab('application_detail');
                          }}
                          className="px-2.5 py-1 text-xs bg-white hover:bg-slate-100 text-blue-700 border border-blue-200 font-medium rounded-md transition-colors"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Application Modal */}
      {showNewModal && <NewApplicationModal onClose={() => setShowNewModal(false)} />}
    </div>
  );
};

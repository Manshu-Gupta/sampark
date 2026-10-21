import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ApprovalStage, UserRole } from '../../types';
import {
  ArrowLeft,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  UserCheck,
  ShieldCheck,
  Building2,
  FolderArchive,
  History,
  Bot,
  MessageSquare,
  AlertOctagon,
  ChevronRight,
  Send,
  Sparkles,
  FileSearch,
  ExternalLink,
} from 'lucide-react';

export const ApplicationDetail: React.FC = () => {
  const {
    selectedApplicationId,
    setSelectedApplicationId,
    applications,
    documents,
    currentUser,
    advanceApplicationStage,
    recordScrutinyDeficiency,
    returnForClarification,
    respondToClarification,
    recordFinalDecision,
    setActiveTab,
    auditEvents,
    notifications,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<
    | 'overview'
    | 'timeline'
    | 'documents'
    | 'observations'
    | 'compliance'
    | 'evc'
    | 'notifications'
    | 'ai_summary'
    | 'audit'
  >('overview');

  // Action dialog states
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [returnCategory, setReturnCategory] = useState<
    'INFRASTRUCTURE' | 'DOCUMENTATION' | 'FACULTY_CADRE' | 'FINANCIAL' | 'STATUTORY_NOC'
  >('STATUTORY_NOC');

  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseText, setResponseText] = useState('');

  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decisionOutcome, setDecisionOutcome] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [decisionRemarks, setDecisionRemarks] = useState('');

  const [showAddObsModal, setShowAddObsModal] = useState(false);
  const [obsRemarks, setObsRemarks] = useState('');
  const [obsCategory, setObsCategory] = useState<any>('DOCUMENTATION');
  const [obsSeverity, setObsSeverity] = useState<any>('CRITICAL_DEFICIENCY');

  const application = useMemo(() => {
    return applications.find((a) => a.id === selectedApplicationId);
  }, [applications, selectedApplicationId]);

  if (!application) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200 max-w-xl mx-auto my-12">
        <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">No Application Selected</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          Please select an application from the registry to view its approval workflow details.
        </p>
        <button
          onClick={() => setActiveTab('applications')}
          className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-sm"
        >
          Go to Applications List
        </button>
      </div>
    );
  }

  // Attached & Reused Documents
  const attachedDocs = documents.filter((d) =>
    application.attachedDocumentIds.includes(d.id)
  );

  // Application Audit Events
  const appAuditEvents = auditEvents.filter(
    (ev) => ev.entityId === application.id || ev.entityId.includes(application.id)
  );

  // Application Notifications
  const appNotifications = notifications.filter(
    (n) => n.relatedEntityId === application.id
  );

  // Permission Checks based on Role
  const canPerformScrutiny =
    ['SCRUTINY_OFFICER', 'REGIONAL_ADMIN', 'SENIOR_AUTHORITY'].includes(currentUser.role) &&
    (application.currentStage === 'SCRUTINY' ||
      application.currentStage === 'PRELIMINARY_CHECK' ||
      application.currentStage === 'RE_SCRUTINY');

  const canRespondToDeficiency =
    ['INSTITUTION_ADMIN'].includes(currentUser.role) &&
    application.currentStage === 'CLARIFICATION_REQUIRED';

  const canAdvanceStage =
    ['SCRUTINY_OFFICER', 'REGIONAL_ADMIN', 'SENIOR_AUTHORITY', 'EVC_COORDINATOR'].includes(
      currentUser.role
    ) &&
    !['APPROVED', 'REJECTED', 'WITHDRAWN', 'CLARIFICATION_REQUIRED'].includes(
      application.currentStage
    );

  const canMakeDecision =
    ['SENIOR_AUTHORITY', 'REGIONAL_ADMIN'].includes(currentUser.role) &&
    (application.currentStage === 'COMMITTEE_PROCESSING' ||
      application.currentStage === 'DECISION_PENDING' ||
      application.currentStage === 'EVC_COMPLETED');

  // Next required administrative action helper
  const getNextActionText = () => {
    switch (application.currentStage) {
      case 'DRAFT':
        return 'Institution Administrator must review statutory undertakings and submit online.';
      case 'SUBMITTED':
        return 'Scrutiny Officer must verify form completeness and fee payment in Preliminary Check.';
      case 'PRELIMINARY_CHECK':
        return 'Scrutiny Officer to open application documents and initiate detailed Scrutiny.';
      case 'SCRUTINY':
        return 'Scrutiny Officer must record observations or approve application for EVC Roster.';
      case 'CLARIFICATION_REQUIRED':
        return 'Institution must submit clarification notes and upload renewed statutory certificates.';
      case 'RE_SCRUTINY':
        return 'Scrutiny Officer to verify institutional clarification and resolve recorded deficiencies.';
      case 'EVC_PENDING':
        return 'EVC Coordinator to configure 3-member inspection panel and propose visit dates.';
      case 'EVC_SCHEDULED':
        return 'Expert Committee to conduct on-site physical inspection and compile report.';
      case 'EVC_COMPLETED':
        return 'Regional Administrator / Committee to evaluate inspection findings.';
      case 'COMMITTEE_PROCESSING':
        return 'Regional Committee to review agenda and forward recommendation to Executive Council.';
      case 'DECISION_PENDING':
        return 'Senior Authority (Member Secretary) to record final statutory approval/rejection decision.';
      case 'APPROVED':
        return 'Approval granted. Institution may download official Approval Letter for AY 2026-27.';
      case 'REJECTED':
        return 'Application rejected. Appellate Committee window open for 15 days.';
      default:
        return 'Routine processing underway.';
    }
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Breadcrumb & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedApplicationId(null);
              setActiveTab('applications');
            }}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-slate-900">
                {application.id}
              </span>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium border border-slate-200">
                {application.type.replace(/_/g, ' ')}
              </span>
              <span className="text-xs font-mono text-slate-500">
                AY {application.academicYear}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {application.institutionName} · {application.region} Region
            </p>
          </div>
        </div>

        {/* Action Toolbar for Current Role */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Institution: Respond to deficiency */}
          {canRespondToDeficiency && (
            <button
              onClick={() => setShowResponseModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              Respond to Deficiencies
            </button>
          )}

          {/* Scrutiny: Record Observation */}
          {canPerformScrutiny && (
            <>
              <button
                onClick={() => setShowAddObsModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                Record Deficiency
              </button>

              <button
                onClick={() => setShowReturnModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                Return for Clarification
              </button>
            </>
          )}

          {/* Advance Stage button */}
          {canAdvanceStage && application.currentStage === 'SCRUTINY' && (
            <button
              onClick={() =>
                advanceApplicationStage(
                  application.id,
                  'EVC_PENDING',
                  'Scrutiny Cleared by Officer',
                  'All preliminary documents verified. Recommended for on-site Expert Visit.'
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mark Scrutiny Complete → Enqueue EVC
            </button>
          )}

          {/* Advance Re-Scrutiny to EVC */}
          {canAdvanceStage && application.currentStage === 'RE_SCRUTINY' && (
            <button
              onClick={() =>
                advanceApplicationStage(
                  application.id,
                  'EVC_PENDING',
                  'Re-Scrutiny Cleared',
                  'Deficiencies rectified by institution. Case advanced to EVC queue.'
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Accept Clarification → Enqueue EVC
            </button>
          )}

          {/* Senior Authority: Record Approval / Rejection */}
          {canMakeDecision && (
            <button
              onClick={() => setShowDecisionModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Record Council Decision
            </button>
          )}

          {/* Ask AI Copilot button */}
          <button
            onClick={() => setActiveTab('copilot')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Ask Copilot
          </button>
        </div>
      </div>

      {/* 9 Tab Navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto text-xs font-medium space-x-6">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'timeline', label: 'Workflow Timeline', count: application.timelineEvents.length },
          { id: 'documents', label: 'Documents & Reuse', count: attachedDocs.length },
          {
            id: 'observations',
            label: 'Scrutiny Observations',
            count: application.scrutinyObservations.length,
          },
          { id: 'compliance', label: 'Compliance & Undertakings' },
          { id: 'evc', label: 'EVC Status' },
          { id: 'notifications', label: 'Alerts', count: appNotifications.length },
          { id: 'ai_summary', label: 'AI Case Analysis' },
          { id: 'audit', label: 'Audit History', count: appAuditEvents.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubTab === tab.id
                ? 'border-blue-600 text-blue-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeSubTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeSubTab === 'overview' && (
        <div className="space-y-5">
          {/* Required Next Step Banner */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                Current Stage & Next Required Action
              </h4>
              <p className="text-xs font-semibold text-slate-800 mt-1">
                Current Stage: {application.currentStage.replace(/_/g, ' ')}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">{getNextActionText()}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Stage SLA</span>
              <span
                className={`text-xs font-mono font-bold tabular-nums ${
                  application.daysInCurrentStage > application.stageSlaDays
                    ? 'text-rose-600'
                    : 'text-slate-800'
                }`}
              >
                {application.daysInCurrentStage} / {application.stageSlaDays} Days
              </span>
            </div>
          </div>

          {/* Overview Key Value Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Box 1: Institutional Profile */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-500" />
                Institutional Particulars
              </h4>
              <div className="text-xs space-y-1.5 pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Institution:</span>
                  <span className="font-semibold text-slate-800">{application.institutionName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Code:</span>
                  <span className="font-mono text-slate-800">{application.institutionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Region:</span>
                  <span className="text-slate-800">{application.region} Regional Office</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Submission Date:</span>
                  <span className="font-mono text-slate-800">{application.submissionDate}</span>
                </div>
              </div>
            </div>

            {/* Box 2: Administrative Ownership */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-slate-500" />
                Administrative Jurisdiction
              </h4>
              <div className="text-xs space-y-1.5 pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Officer:</span>
                  <span className="font-semibold text-slate-800">{application.assignedOfficerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Workflow Route:</span>
                  <span className="font-mono text-slate-800">{application.route}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Applicable Deadline:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {application.stageDeadline}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Priority:</span>
                  <span
                    className={`font-semibold ${
                      application.priority === 'URGENT'
                        ? 'text-rose-600'
                        : application.priority === 'HIGH'
                        ? 'text-amber-600'
                        : 'text-slate-700'
                    }`}
                  >
                    {application.priority}
                  </span>
                </div>
              </div>
            </div>

            {/* Box 3: Delay Risk & AI Assessment */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Delay Risk Intelligence
              </h4>
              <div className="text-xs space-y-1.5 pt-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Risk Level:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      application.delayRisk === 'HIGH_RISK'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : application.delayRisk === 'MEDIUM_RISK'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {application.delayRisk.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="pt-1">
                  <span className="text-[11px] text-slate-400 block mb-1">Identified Risk Factors:</span>
                  {application.delayRiskFactors.length === 0 ? (
                    <span className="text-slate-500 text-xs">No active delay bottlenecks.</span>
                  ) : (
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-600">
                      {application.delayRiskFactors.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reused Documents Spotlight (USP Showcase) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FolderArchive className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-slate-900">
                  Compliance Reuse Profile (USP: {application.reusedDocumentIds.length} Verified Documents Reused)
                </h4>
              </div>
              <button
                onClick={() => setActiveSubTab('documents')}
                className="text-xs text-blue-600 hover:underline"
              >
                Inspect Registry Documents →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {attachedDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[10px] text-slate-400">{doc.id}</span>
                    <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1 rounded font-bold">
                      Verified
                    </span>
                  </div>
                  <p className="font-semibold text-slate-800 line-clamp-1 mt-1">{doc.name}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {doc.expiryDate ? `Valid until: ${doc.expiryDate}` : 'Perpetual Land Title'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Workflow Timeline */}
      {activeSubTab === 'timeline' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 mb-6">Visual Application Approval Lifecycle</h3>
          <div className="relative border-l-2 border-slate-200 ml-4 space-y-6">
            {application.timelineEvents.map((event, idx) => (
              <div key={event.id} className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white" />
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">{event.actionTaken}</span>
                    <span className="text-[11px] font-mono text-slate-400">{event.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                    <span className="text-slate-400">From:</span>
                    <span className="font-mono bg-slate-200 px-1 py-0.2 rounded text-[10px]">
                      {event.previousStage}
                    </span>
                    <span className="text-slate-400">→ To:</span>
                    <span className="font-mono bg-blue-100 text-blue-800 px-1 py-0.2 rounded text-[10px] font-bold">
                      {event.newStage}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-2">{event.reasonOrObservation}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-200">
                    <span>Authorized Official: {event.responsibleUserName}</span>
                    <span>·</span>
                    <span>Role: {event.responsibleRole}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Documents */}
      {activeSubTab === 'documents' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Statutory Document Registry & Verified Reuse
              </h3>
              <p className="text-xs text-slate-500">
                Documents linked to this application. Reused documents are verified against the institutional vault.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('anomaly')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              <FileSearch className="w-3.5 h-3.5" />
              Run Multimodal Anomaly Check
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                <tr>
                  <th className="px-4 py-3">Doc ID</th>
                  <th className="px-4 py-3">Document Title</th>
                  <th className="px-4 py-3">Validity</th>
                  <th className="px-4 py-3">Verification Status</th>
                  <th className="px-4 py-3">Verified By</th>
                  <th className="px-4 py-3">Reuse Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attachedDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-mono text-blue-700 font-bold">{doc.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{doc.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{doc.fileSize} · v{doc.versionNumber}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600">
                      {doc.expiryDate || 'Perpetual Title'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          doc.verificationStatus === 'VERIFIED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {doc.verificationStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{doc.verifiedBy || 'Pending'}</td>
                    <td className="px-4 py-3">
                      {application.reusedDocumentIds.includes(doc.id) ? (
                        <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold border border-blue-200">
                          Reused from Vault
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Fresh Submission</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setActiveTab('anomaly')}
                        className="text-xs text-blue-600 font-medium hover:underline"
                      >
                        Verify Visuals →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Scrutiny Observations */}
      {activeSubTab === 'observations' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Scrutiny Observations & Recorded Deficiencies
              </h3>
              <p className="text-xs text-slate-500">
                Recorded during preliminary scrutiny under APH 2026-27 norms.
              </p>
            </div>
            {canPerformScrutiny && (
              <button
                onClick={() => setShowAddObsModal(true)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                + Add Observation
              </button>
            )}
          </div>

          <div className="space-y-3">
            {application.scrutinyObservations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No deficiencies or adverse observations recorded yet.
              </div>
            ) : (
              application.scrutinyObservations.map((obs) => (
                <div
                  key={obs.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        obs.severity === 'CRITICAL_DEFICIENCY'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {obs.severity.replace(/_/g, ' ')}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">{obs.timestamp}</span>
                  </div>
                  <p className="text-slate-800 font-medium leading-relaxed">{obs.remarks}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[10px] text-slate-400">
                    <span>Recorded by: {obs.officerName}</span>
                    <span>Category: {obs.category}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Compliance Obligations */}
      {activeSubTab === 'compliance' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Statutory Undertakings & Compliance Obligations
            </h3>
            <button
              onClick={() => setActiveTab('compliance')}
              className="text-xs text-blue-600 hover:underline"
            >
              Open Full Compliance Tracker →
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Post-approval undertakings such as Anti-Ragging committee constitution, ICC notification, and Grievance Redressal.
          </p>
        </div>
      )}

      {/* Tab 6: EVC Status */}
      {activeSubTab === 'evc' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Expert Visit Committee (EVC) Inspection Roster
            </h3>
            <button
              onClick={() => setActiveTab('evc')}
              className="text-xs text-blue-600 hover:underline"
            >
              Open EVC Management →
            </button>
          </div>
          <p className="text-xs text-slate-500">
            For applications requiring physical infrastructure and lab readiness verification under Route B or Route C.
          </p>
        </div>
      )}

      {/* Tab 7: Alerts */}
      {activeSubTab === 'notifications' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Related Alerts & SLA Notifications</h3>
          {appNotifications.length === 0 ? (
            <p className="text-xs text-slate-400">No active alerts for this case.</p>
          ) : (
            appNotifications.map((n) => (
              <div key={n.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{n.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{n.createdAt}</span>
                </div>
                <p className="text-slate-600 mt-1">{n.message}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 8: AI Case Summary */}
      {activeSubTab === 'ai_summary' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">
              AI-Generated Case Summary & Regulatory Grounding
            </h3>
          </div>
          <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-200 text-xs text-slate-800 space-y-2.5 leading-relaxed">
            <p>
              <strong>Case Status:</strong> Application <strong>{application.id}</strong> submitted by{' '}
              <strong>{application.institutionName}</strong> is currently at{' '}
              <strong>{application.currentStage.replace(/_/g, ' ')}</strong> stage under{' '}
              <strong>{application.route}</strong>.
            </p>
            <p>
              <strong>Compliance Reuse Highlights:</strong> The institution successfully reused{' '}
              <strong>{application.reusedDocumentIds.length}</strong> previously verified documents
              (Perpetual Lease Title, PMC Occupancy Certificate), saving administrative re-verification time.
            </p>
            <p>
              <strong>Pending Deficiencies:</strong>{' '}
              {application.scrutinyObservations.length > 0
                ? application.scrutinyObservations.map((o) => o.remarks).join(' ')
                : 'No adverse observations pending.'}
            </p>
            <p className="text-[11px] text-teal-900 border-t border-teal-200 pt-2 font-medium">
              ⚖️ Human Oversight Preserved: Generated by AICTE Compliance Copilot based on Approval Process Handbook 2026-27 norms. Council approval decisions remain the exclusive statutory prerogative of authorised officials.
            </p>
          </div>
        </div>
      )}

      {/* Tab 9: Audit History */}
      {activeSubTab === 'audit' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Statutory Audit Trail for Case</h3>
          <div className="space-y-2">
            {appAuditEvents.map((ev) => (
              <div key={ev.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-blue-700">{ev.action}</span>
                  <span className="font-mono text-[10px] text-slate-400">{ev.timestamp}</span>
                </div>
                <p className="text-slate-700 mt-1">{ev.reasonNotes}</p>
                <div className="text-[10px] text-slate-400 mt-1">
                  By {ev.userName} ({ev.userRole}) · Ref: {ev.correlationId}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Return for Clarification */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-rose-600" />
              Return Application for Clarification
            </h3>
            <p className="text-xs text-slate-500">
              Under APH Chapter II, recording a mandatory deficiency reason is required. The institution will have 15 days to respond.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Deficiency Category
              </label>
              <select
                value={returnCategory}
                onChange={(e) => setReturnCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                <option value="STATUTORY_NOC">Statutory NOC (Fire Safety / Pollution / Land)</option>
                <option value="FACULTY_CADRE">Faculty Cadre Ratio / Qualifications</option>
                <option value="INFRASTRUCTURE">Building / Laboratory / Equipment Shortfall</option>
                <option value="DOCUMENTATION">Document Validity / Notary Endorsement</option>
                <option value="FINANCIAL">Corpus Fund / Balance Sheet Clarification</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mandatory Clarification Reason & Detailed Deficiency
              </label>
              <textarea
                rows={3}
                placeholder="Specify the exact statutory clause and required rectifying document..."
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowReturnModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                disabled={!returnReason.trim()}
                onClick={() => {
                  recordScrutinyDeficiency(
                    application.id,
                    returnCategory,
                    'CRITICAL_DEFICIENCY',
                    returnReason
                  );
                  returnForClarification(application.id, returnReason);
                  setShowReturnModal(false);
                  setReturnReason('');
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Confirm Return to Institution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Institution Clarification Response */}
      {showResponseModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-600" />
              Submit Institutional Clarification Response
            </h3>
            <p className="text-xs text-slate-500">
              Provide formal explanation and reference any updated or renewed statutory certificates.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Clarification Notes & Compliance Undertaking
              </label>
              <textarea
                rows={4}
                placeholder="We have attached the renewed Fire NOC issued on 20-Oct-2026 by PMRDA Fire Services..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowResponseModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                disabled={!responseText.trim()}
                onClick={() => {
                  respondToClarification(application.id, responseText);
                  setShowResponseModal(false);
                  setResponseText('');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Submit Response → Re-Scrutiny
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Record Council Decision */}
      {showDecisionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-slate-900" />
              Record Official Council Approval Decision
            </h3>
            <p className="text-xs text-slate-500">
              Statutory decision by Senior Authority. This action finalizes the approval cycle.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Outcome</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold text-emerald-800 cursor-pointer">
                  <input
                    type="radio"
                    name="outcome"
                    value="APPROVED"
                    checked={decisionOutcome === 'APPROVED'}
                    onChange={() => setDecisionOutcome('APPROVED')}
                  />
                  Grant Approval (Approved)
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-rose-800 cursor-pointer">
                  <input
                    type="radio"
                    name="outcome"
                    value="REJECTED"
                    checked={decisionOutcome === 'REJECTED'}
                    onChange={() => setDecisionOutcome('REJECTED')}
                  />
                  Refuse Approval (Rejected)
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Proceedings & Remarks
              </label>
              <textarea
                rows={3}
                placeholder="Approved as per recommendations of Scrutiny and EVC with sanctioned intake of 180 seats..."
                value={decisionRemarks}
                onChange={(e) => setDecisionRemarks(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowDecisionModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                disabled={!decisionRemarks.trim()}
                onClick={() => {
                  recordFinalDecision(application.id, decisionOutcome, decisionRemarks);
                  setShowDecisionModal(false);
                }}
                className={`px-4 py-2 text-white text-xs font-semibold rounded-lg shadow-sm ${
                  decisionOutcome === 'APPROVED'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Sign & Issue Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Scrutiny Observation */}
      {showAddObsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Record Scrutiny Observation / Deficiency
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={obsCategory}
                  onChange={(e) => setObsCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="STATUTORY_NOC">Statutory NOC</option>
                  <option value="DOCUMENTATION">Documentation</option>
                  <option value="FACULTY_CADRE">Faculty Cadre</option>
                  <option value="INFRASTRUCTURE">Infrastructure</option>
                  <option value="FINANCIAL">Financial</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Severity</label>
                <select
                  value={obsSeverity}
                  onChange={(e) => setObsSeverity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="CRITICAL_DEFICIENCY">Critical Deficiency</option>
                  <option value="MINOR_DEFICIENCY">Minor Deficiency</option>
                  <option value="OBSERVATION">General Observation</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Observation Remarks
              </label>
              <textarea
                rows={3}
                placeholder="Enter statutory inspection remarks..."
                value={obsRemarks}
                onChange={(e) => setObsRemarks(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowAddObsModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                disabled={!obsRemarks.trim()}
                onClick={() => {
                  recordScrutinyDeficiency(application.id, obsCategory, obsSeverity, obsRemarks);
                  setShowAddObsModal(false);
                  setObsRemarks('');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Save Observation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Building2,
  FileText,
  Clock,
  AlertTriangle,
  FolderArchive,
  ArrowUpRight,
  UploadCloud,
  Send,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  FileEdit,
  FilePenLine,
  FileCheck2,
} from 'lucide-react';

export const InstitutionDashboard: React.FC = () => {
  const {
    currentUser,
    applications,
    documents,
    complianceObligations,
    institutions,
    setActiveTab,
    setSelectedApplicationId,
    openNewApplicationModal,
  } = useApp();

  const [activeTabFilter, setActiveTabFilter] = useState<'ALL' | 'ACTION_REQUIRED' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');

  // Find user's institution
  const institution = institutions.find((inst) => inst.id === currentUser.institutionId) || institutions[0];

  // Applications for this institution
  const myApplications = applications.filter(
    (app) => app.institutionId === institution.id || app.institutionId === currentUser.institutionId
  );

  // Documents for this institution
  const myDocuments = documents.filter(
    (doc) => doc.institutionId === institution.id || doc.institutionId === currentUser.institutionId
  );

  // Compliance obligations for this institution
  const myObligations = complianceObligations.filter(
    (ob) => ob.institutionId === institution.id || ob.institutionId === currentUser.institutionId
  );

  // KPIs
  const pendingClarifications = myApplications.filter((a) => a.currentStage === 'CLARIFICATION_REQUIRED');
  const validDocsCount = myDocuments.filter((d) => d.verificationStatus === 'VERIFIED').length;
  const expiringDocs = myDocuments.filter(
    (d) => d.verificationStatus === 'EXPIRING_SOON' || d.verificationStatus === 'EXPIRED'
  );
  const pendingObligations = myObligations.filter((o) => o.status !== 'VERIFIED');

  const filteredApps = myApplications.filter((app) => {
    if (activeTabFilter === 'ACTION_REQUIRED') {
      return app.currentStage === 'CLARIFICATION_REQUIRED';
    }
    if (activeTabFilter === 'IN_PROGRESS') {
      return !['APPROVED', 'REJECTED', 'WITHDRAWN', 'CLARIFICATION_REQUIRED'].includes(app.currentStage);
    }
    if (activeTabFilter === 'COMPLETED') {
      return ['APPROVED', 'REJECTED'].includes(app.currentStage);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner - Clean White with Subtle Pastel Accent */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-[#E5EAF3] text-[#172033] p-6 md:p-8 shadow-xs">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/50 via-teal-400/40 to-indigo-400/50" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-800 text-xs font-bold mb-3 shadow-2xs">
              <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center">
                <Building2 className="w-3 h-3" />
              </div>
              <span>Institution Portal</span>
              <span className="text-blue-900 font-mono font-bold">• Code: {institution.code}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              {institution.name}
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl font-medium">
              {institution.type.replace(/_/g, ' ')} • {institution.city}, {institution.state} • Principal: {institution.principalName}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openNewApplicationModal()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all flex items-center gap-2 shadow-xs cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center text-white">
                <FileEdit className="w-3.5 h-3.5" />
              </div>
              <span>New Approval Application</span>
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#E5EAF3] text-slate-700 hover:text-blue-700 text-xs font-bold transition-all flex items-center gap-2 shadow-2xs"
            >
              <div className="w-5 h-5 rounded bg-blue-50 text-blue-700 flex items-center justify-center">
                <FolderArchive className="w-3 h-3" />
              </div>
              <span>Compliance Reuse Vault</span>
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Undertaking Evidence</span>
            </button>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-6 pt-5 border-t border-[#E5EAF3] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Approval Cycle</span>
            <span className="font-extrabold text-[#172033] text-sm">AY 2026-2027</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Overall Compliance</span>
            <span className="font-extrabold text-emerald-600 text-sm">{institution.complianceScore}% Verified</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Sanctioned Intake</span>
            <span className="font-extrabold text-blue-600 text-sm">{institution.sanctionedIntake} Seats</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Region Office</span>
            <span className="font-extrabold text-[#172033] text-sm">{institution.region.replace(/_/g, ' ')}</span>
          </div>
        </div>
      </div>

      {/* Urgent Action Alerts */}
      {(pendingClarifications.length > 0 || expiringDocs.length > 0 || pendingObligations.length > 0) && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#172033] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            Urgent Attention & Deficiencies Requiring Action
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingClarifications.map((app) => (
              <div
                key={app.id}
                className="bg-white border border-amber-200 border-l-4 border-l-amber-500 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-800 mb-2">
                    <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Deficiency Notice Issued
                    </span>
                    <span className="font-mono text-[11px] text-amber-700 font-bold">{app.id}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#172033] mb-1">{app.type.replace(/_/g, ' ')}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {app.clarificationHistory?.[0]?.reason || 'AICTE Scrutiny Officer flagged missing statutory document or clarification required.'}
                  </p>
                  <div className="mt-3 text-[11px] text-amber-800 flex items-center gap-1.5 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Days in Stage: {app.daysInCurrentStage} / {app.stageSlaDays} days SLA</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedApplicationId(app.id);
                    setActiveTab('application_detail');
                  }}
                  className="mt-4 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                >
                  <span>Respond to Clarification</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {expiringDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-rose-200 border-l-4 border-l-rose-500 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-rose-800 mb-2">
                    <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-800 px-2.5 py-0.5 rounded-full border border-rose-200">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Certificate Expiring Soon
                    </span>
                    <span className="font-mono text-[11px] text-rose-700 font-bold">{doc.type}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#172033] mb-1">{doc.name}</h3>
                  <p className="text-xs text-slate-600">
                    Validity expiry: <span className="font-bold text-rose-600">{doc.expiryDate || 'Immediate'}</span>. Renew to preserve auto-reuse status.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('documents')}
                  className="mt-4 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload Renewed Certificate</span>
                </button>
              </div>
            ))}

            {pendingObligations.slice(0, 1).map((ob) => (
              <div
                key={ob.id}
                className="bg-white border border-blue-200 border-l-4 border-l-blue-500 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-blue-800 mb-2">
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      Time-Bound Undertaking
                    </span>
                    <span className="text-[11px] text-blue-700 font-mono font-bold">Due: {ob.dueDate}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#172033] mb-1">{ob.sourceRuleRef}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{ob.requirementDescription}</p>
                </div>
                <button
                  onClick={() => setActiveTab('compliance')}
                  className="mt-4 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                >
                  <span>Submit Proof of Fulfilment</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4 Clean KPI Cards with Soft Pastel Tones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E5EAF3] shadow-xs hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Applications</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center shadow-2xs">
              <FileText className="w-4 h-4 text-blue-700" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-[#172033]">{myApplications.length}</span>
            <span className="text-xs text-slate-400 ml-2 font-medium">Total cycles</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span className="text-blue-700 font-bold">{myApplications.filter((a) => !['APPROVED', 'REJECTED'].includes(a.currentStage)).length} currently active</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5EAF3] shadow-xs hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deficiencies</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 flex items-center justify-center shadow-2xs">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-[#172033]">{pendingClarifications.length}</span>
            <span className="text-xs text-amber-700 ml-2 font-bold">Pending Reply</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {pendingClarifications.length === 0 ? 'No open deficiencies' : 'Action needed before SLA cutoff'}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5EAF3] shadow-xs hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Document Vault</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center shadow-2xs">
              <FolderArchive className="w-4 h-4 text-teal-700" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-[#172033]">{validDocsCount} / {myDocuments.length}</span>
            <span className="text-xs text-teal-700 ml-2 font-bold">Verified Valid</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {myDocuments.filter((d) => d.isEligibleForReuse).length} pre-approved for auto reuse
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5EAF3] shadow-xs hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Undertakings</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-[#172033]">{pendingObligations.length}</span>
            <span className="text-xs text-emerald-600 ml-2 font-bold">Under Monitoring</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Next due:{' '}
            <span className="font-bold text-[#172033]">
              {myObligations[0]?.dueDate || 'None pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Section: Application Tracker & Document Vault Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Submitted Applications Registry */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5EAF3] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#E5EAF3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-[#172033]">Application Approvals Track & Trace</h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Real-time progress, SLA countdowns, and official decision notices
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => openNewApplicationModal()}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <FilePenLine className="w-3.5 h-3.5 text-white" />
                <span>New AICTE Form</span>
              </button>
              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-[#F8FAFF] p-1 rounded-xl border border-[#E5EAF3] text-xs font-semibold text-slate-600">
                {(['ALL', 'ACTION_REQUIRED', 'IN_PROGRESS', 'COMPLETED'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveTabFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      activeTabFilter === filter
                        ? 'bg-white text-blue-700 font-bold shadow-2xs'
                        : 'hover:text-[#172033]'
                    }`}
                  >
                    {filter.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="divide-y divide-[#E5EAF3]">
            {filteredApps.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No applications matching this filter.
              </div>
            ) : (
              filteredApps.map((app) => {
                const isOverdue = app.daysInCurrentStage > app.stageSlaDays;
                const isDraft = app.currentStage === 'DRAFT';
                const isSubmitted = app.currentStage === 'SUBMITTED';

                return (
                  <div
                    key={app.id}
                    className="p-5 hover:bg-[#F8FAFF]/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                          {app.id}
                        </span>
                        <span className="text-xs font-bold text-[#172033]">
                          {app.type.replace(/_/g, ' ')}
                        </span>
                        {isDraft && (
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                            Draft (Unsubmitted)
                          </span>
                        )}
                        {isSubmitted && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-pulse" />
                            Submitted – Pending Scrutiny
                          </span>
                        )}
                        {app.formData && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                            AICTE Form Complete
                          </span>
                        )}
                        {app.paymentStatus === 'PAID' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Fee Paid: ₹{app.feeAmount?.toLocaleString('en-IN') || 'Paid'}
                          </span>
                        )}
                        <span className="text-[11px] font-medium text-slate-500">
                          Route: {app.route.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span>AY: {app.academicYear}</span>
                        <span>•</span>
                        <span>Date: {app.submissionDate}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Stage: <strong className="text-[#172033]">{isSubmitted ? 'Submitted – Pending Scrutiny' : app.currentStage.replace(/_/g, ' ')}</strong>
                        </span>
                        {app.paymentReference && (
                          <>
                            <span>•</span>
                            <span className="font-mono text-[11px] text-slate-500">Ref: {app.paymentReference}</span>
                          </>
                        )}
                      </div>

                      {/* Progress SLA bar */}
                      <div className="w-full max-w-md pt-1">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className={isOverdue ? 'text-rose-600 font-bold' : 'text-slate-500 font-medium'}>
                            Stage SLA: {app.daysInCurrentStage} of {app.stageSlaDays} days elapsed
                          </span>
                          <span className="font-bold text-[#172033]">
                            {Math.round((app.daysInCurrentStage / app.stageSlaDays) * 100)}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isOverdue
                                ? 'bg-rose-500'
                                : app.daysInCurrentStage / app.stageSlaDays > 0.75
                                ? 'bg-amber-500'
                                : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                            }`}
                            style={{
                              width: `${Math.min(100, (app.daysInCurrentStage / app.stageSlaDays) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {isDraft ? (
                        <button
                          onClick={() => openNewApplicationModal(app.id)}
                          className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-2xs hover:scale-102"
                        >
                          <FilePenLine className="w-3.5 h-3.5" />
                          <span>Resume Draft</span>
                        </button>
                      ) : null}
                      <button
                        onClick={() => {
                          setSelectedApplicationId(app.id);
                          setActiveTab('application_detail');
                        }}
                        className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100/80 text-blue-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 border border-blue-200"
                      >
                        <span>Inspect Case</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Col: Compliance Reuse Profile Vault Snapshot */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5EAF3] shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-extrabold text-[#172033] flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center">
                  <FolderArchive className="w-3.5 h-3.5 text-teal-700" />
                </div>
                Compliance Document Vault
              </h2>
              <button
                onClick={() => setActiveTab('documents')}
                className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-0.5"
              >
                <span>Full Vault</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4 font-medium leading-relaxed">
              AICTE SAMPARK eliminates repetitive annual re-submissions. Valid documents are automatically re-usable across approval cycles.
            </p>

            <div className="space-y-3">
              {myDocuments.slice(0, 4).map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-xl border border-[#E5EAF3] bg-[#F8FAFF] hover:bg-blue-50/40 transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#172033] truncate">{doc.name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Expires: {doc.expiryDate || 'Perpetual'} • {doc.isEligibleForReuse ? 'Reusable' : 'One-time'}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                      doc.verificationStatus === 'VERIFIED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : doc.verificationStatus === 'EXPIRING_SOON'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {doc.verificationStatus.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-[#E5EAF3] flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Auto-carry-forward rate:</span>
              <span className="font-bold text-[#172033]">
                {Math.round((validDocsCount / Math.max(1, myDocuments.length)) * 100)}%
              </span>
            </div>
          </div>

          {/* Quick AI Assistant Card - Soft Light Blue Pastel */}
          <div className="bg-gradient-to-br from-blue-50/70 via-slate-50/60 to-white border border-blue-100 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-2 text-blue-700 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-blue-600" />
              AICTE Compliance Copilot
            </div>
            <h3 className="text-sm font-extrabold text-[#172033] mb-1">Unsure about approval norms?</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed font-medium">
              Ask our statutory AI assistant regarding faculty cadre ratios, land requirements, or required undertaking formats for AY 2026-27.
            </p>
            <button
              onClick={() => setActiveTab('copilot')}
              className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Launch Compliance Copilot</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

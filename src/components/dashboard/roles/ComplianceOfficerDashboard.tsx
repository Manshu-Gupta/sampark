import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  ClipboardCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  FolderArchive,
} from 'lucide-react';

export const ComplianceOfficerDashboard: React.FC = () => {
  const {
    complianceObligations,
    documents,
    institutions,
    setActiveTab,
    verifyCompliance,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'SUBMITTED' | 'DUE_SOON' | 'OVERDUE' | 'VERIFIED'>('ALL');
  const [selectedObligationForReview, setSelectedObligationForReview] = useState<string | null>(null);
  const [verificationNotes, setVerificationNotes] = useState<string>('');

  // Critical obligations and documents
  const submittedForVerification = complianceObligations.filter((c) => c.status === 'SUBMITTED');
  const overdueObligations = complianceObligations.filter((c) => c.status === 'OVERDUE');
  const dueSoonObligations = complianceObligations.filter((c) => c.status === 'DUE_SOON');
  const verifiedCount = complianceObligations.filter((c) => c.status === 'VERIFIED').length;

  // Documents expiring soon (<60 days) or expired
  const expiringDocs = documents.filter(
    (d) => d.verificationStatus === 'EXPIRING_SOON' || d.verificationStatus === 'EXPIRED'
  );

  const displayedObligations = complianceObligations.filter((ob) => {
    if (activeFilter === 'SUBMITTED') return ob.status === 'SUBMITTED';
    if (activeFilter === 'DUE_SOON') return ob.status === 'DUE_SOON';
    if (activeFilter === 'OVERDUE') return ob.status === 'OVERDUE';
    if (activeFilter === 'VERIFIED') return ob.status === 'VERIFIED';
    return true;
  });

  const handleVerify = (status: 'VERIFIED' | 'CLARIFICATION_REQUIRED') => {
    if (!selectedObligationForReview) return;
    verifyCompliance(
      selectedObligationForReview,
      status,
      verificationNotes || (status === 'VERIFIED' ? 'Evidence verified compliant with AICTE statutory undertaking norms.' : 'Evidence insufficient. Clarification required.')
    );
    setSelectedObligationForReview(null);
    setVerificationNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - White & Soft Mint/Emerald Accent */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-[#E5EAF3] text-[#172033] p-6 md:p-8 shadow-xs">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/80 via-teal-400/80 to-cyan-500/80" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold mb-3">
              <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ClipboardCheck className="w-3.5 h-3.5" />
              </div>
              <span>National Compliance Monitoring Bureau</span>
              <span className="text-teal-700 font-mono font-bold">• Enforcement Wing</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#172033]">
              Undertaking Fulfilment & Lease Expiry Radar
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl font-medium">
              Track conditional time-bound undertakings, verify submitted evidence documents, monitor land lease expiries, and prevent compliance defaults.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('compliance')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Comprehensive Obligation Registry</span>
            </button>
          </div>
        </div>

        {/* Highlights Bar */}
        <div className="mt-6 pt-5 border-t border-[#E5EAF3] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Total Undertakings Tracked</span>
            <span className="font-extrabold text-[#172033] text-sm">{complianceObligations.length} Records</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Evidences Awaiting Review</span>
            <span className="font-extrabold text-teal-700 text-sm">{submittedForVerification.length} Submissions</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Critical Overdue</span>
            <span className="font-extrabold text-rose-600 text-sm">{overdueObligations.length} Default Risk</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Expiring Statutory Deeds</span>
            <span className="font-extrabold text-amber-600 text-sm">{expiringDocs.length} Certificates</span>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards - Soft Pastel Icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E5EAF3] shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Evidences In Review</span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-200/60 shadow-2xs">
              <ClipboardCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-[#172033]">{submittedForVerification.length}</span>
            <span className="text-xs text-teal-700 ml-2 font-bold">Pending decision</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">Colleges uploaded proofs</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5EAF3] shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Approaching Deadlines</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60 shadow-2xs">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-amber-600">{dueSoonObligations.length}</span>
            <span className="text-xs text-amber-700 ml-2 font-bold">&lt;30 days remaining</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">Auto warning notices dispatched</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5EAF3] shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overdue Defaults</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200/60 shadow-2xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-rose-600">{overdueObligations.length}</span>
            <span className="text-xs text-rose-600 ml-2 font-bold">Escalated</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">Subject to approval suspension</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5EAF3] shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified & Clear</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60 shadow-2xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-emerald-600">{verifiedCount}</span>
            <span className="text-xs text-emerald-700 ml-2 font-bold">Clearances granted</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">Fulfilled undertakings</p>
        </div>
      </div>

      {/* Main Section: Verification Worklist & Expiry Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Undertaking Verification Docket */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5EAF3] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#E5EAF3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-[#172033]">Statutory Undertaking Verification Queue</h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Inspect proof of faculty cadre recruitment, building expansion, and fire safety renewal
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#F8FAFF] p-1 rounded-xl border border-[#E5EAF3] text-xs font-semibold text-slate-600">
              {(
                [
                  { id: 'ALL', label: 'All' },
                  { id: 'SUBMITTED', label: 'Submitted Proof' },
                  { id: 'DUE_SOON', label: 'Due Soon' },
                  { id: 'OVERDUE', label: 'Overdue' },
                  { id: 'VERIFIED', label: 'Verified' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeFilter === f.id
                      ? 'bg-white text-emerald-700 font-bold shadow-2xs'
                      : 'hover:text-[#172033]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-[#E5EAF3]">
            {displayedObligations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No compliance obligations matching this filter.
              </div>
            ) : (
              displayedObligations.map((ob) => {
                const inst = institutions.find((i) => i.id === ob.institutionId);
                return (
                  <div
                    key={ob.id}
                    className="p-5 hover:bg-[#F8FAFF]/80 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                          {ob.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            ob.status === 'VERIFIED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : ob.status === 'SUBMITTED'
                              ? 'bg-teal-50 text-teal-700 border border-teal-200'
                              : ob.status === 'DUE_SOON'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {ob.status.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs font-bold text-[#172033] truncate">
                          {inst?.name || ob.institutionName || 'Institution'}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-[#172033]">{ob.sourceRuleRef}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2">{ob.requirementDescription}</p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1 font-medium">
                        <span>Due Date: <strong className="text-[#172033]">{ob.dueDate}</strong></span>
                        {ob.submissionEvidence?.submittedAt && (
                          <>
                            <span>•</span>
                            <span className="text-teal-700 font-bold">Evidence submitted on {ob.submissionEvidence.submittedAt}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end lg:self-center">
                      {ob.status === 'SUBMITTED' ? (
                        <button
                          onClick={() => setSelectedObligationForReview(ob.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verify Evidence</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setActiveTab('compliance')}
                          className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-[#E5EAF3] text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                        >
                          <span>View Detail</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Col: Statutory Document Expiry Radar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5EAF3] shadow-xs p-5">
            <h2 className="text-sm font-extrabold text-[#172033] flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <FolderArchive className="w-3.5 h-3.5" />
              </div>
              Document Expiry & Validity Radar
            </h2>
            <p className="text-xs text-slate-500 mb-3 font-medium">
              Monitors critical certificates to prevent invalid approvals:
            </p>

            <div className="space-y-2.5">
              {expiringDocs.length === 0 ? (
                <div className="p-4 bg-emerald-50 rounded-xl text-xs text-emerald-800 border border-emerald-200">
                  All monitored certificates are currently valid and active.
                </div>
              ) : (
                expiringDocs.map((doc) => {
                  const inst = institutions.find((i) => i.id === doc.institutionId);
                  return (
                    <div
                      key={doc.id}
                      className="p-3.5 bg-[#F8FAFF] rounded-xl border border-[#E5EAF3] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#172033] truncate max-w-[180px]">{doc.name}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            doc.verificationStatus === 'EXPIRED'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {doc.verificationStatus.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{inst?.name || 'Institution'}</p>
                      <p className="text-[11px] text-slate-600 font-medium">
                        Validity Date: <strong className="text-rose-600">{doc.expiryDate || 'Immediate'}</strong>
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Verify Modal */}
      {selectedObligationForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E5EAF3] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#172033]">Verify Undertaking Evidence</h3>
                <p className="text-xs text-slate-500 font-medium">Statutory clearance decision</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1">
                Officer Verification Remarks *
              </label>
              <textarea
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="e.g. Scanned copy of revised building completion certificate inspected. Fire NOC valid through 2028. Approved."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-[#E5EAF3] focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans text-[#172033]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedObligationForReview(null);
                  setVerificationNotes('');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerify('CLARIFICATION_REQUIRED')}
                className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs"
              >
                Reject / Require Clarification
              </button>
              <button
                onClick={() => handleVerify('VERIFIED')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Compliant & Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

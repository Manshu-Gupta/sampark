import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ComplianceObligation, ComplianceStatus } from '../../types';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Upload,
  ShieldCheck,
  Search,
  Filter,
  FileText,
  AlertOctagon,
  Calendar,
} from 'lucide-react';

export const ComplianceMonitoring: React.FC = () => {
  const {
    complianceObligations,
    currentUser,
    submitComplianceEvidence,
    verifyCompliance,
    currentSimulatedDate,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Submit Evidence Modal
  const [activeEvidenceModal, setActiveEvidenceModal] = useState<ComplianceObligation | null>(null);
  const [evidenceNotes, setEvidenceNotes] = useState('');

  // Review Modal
  const [activeReviewModal, setActiveReviewModal] = useState<ComplianceObligation | null>(null);
  const [reviewVerdict, setReviewVerdict] = useState<'VERIFIED' | 'CLARIFICATION_REQUIRED'>('VERIFIED');
  const [reviewRemarks, setReviewRemarks] = useState('');

  const filteredObligations = complianceObligations.filter((ob) => {
    // Role filter
    if (currentUser.role === 'INSTITUTION_ADMIN' && currentUser.institutionId) {
      if (ob.institutionId !== currentUser.institutionId) return false;
    }

    if (statusFilter !== 'ALL' && ob.status !== statusFilter) return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        ob.id.toLowerCase().includes(q) ||
        ob.institutionName.toLowerCase().includes(q) ||
        ob.requirementDescription.toLowerCase().includes(q) ||
        ob.sourceRuleRef.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const getStatusBadge = (status: ComplianceStatus) => {
    switch (status) {
      case 'CLOSED':
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Verified &amp; Closed
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
            <AlertOctagon className="w-3 h-3 text-rose-600" />
            Overdue
          </span>
        );
      case 'DUE_SOON':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
            <Clock className="w-3 h-3 text-amber-600" />
            Due Soon
          </span>
        );
      case 'UNDER_VERIFICATION':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
            Under Review
          </span>
        );
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
            Evidence Uploaded
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
            {status.replace(/_/g, ' ')}
          </span>
        );
    }
  };

  const isOfficer = ['SCRUTINY_OFFICER', 'REGIONAL_ADMIN', 'SENIOR_AUTHORITY'].includes(
    currentUser.role
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Undertaking &amp; Statutory Compliance Monitoring
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track post-approval statutory undertakings: Anti-Ragging Committees, ICC Constitution, SGRC Ombudsman, and Faculty Cadre Ratios
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            Compliance SLA: Strict Non-Waivable
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by obligation description, institution name, or rule reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="DUE_SOON">Due Soon</option>
            <option value="OVERDUE">Overdue</option>
            <option value="UNDER_VERIFICATION">Under Review</option>
            <option value="CLOSED">Verified &amp; Closed</option>
          </select>
        </div>
      </div>

      {/* Obligations List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
              <tr>
                <th className="px-4 py-3">Obligation ID</th>
                <th className="px-4 py-3">Statutory Requirement</th>
                <th className="px-4 py-3">Institution</th>
                <th className="px-4 py-3">Source Rule Ref</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Compliance Status</th>
                <th className="px-4 py-3">Reviewer</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredObligations.map((ob) => {
                const isOverdue =
                  ob.status === 'OVERDUE' ||
                  (ob.dueDate && new Date(ob.dueDate) < currentSimulatedDate && ob.status !== 'CLOSED');

                return (
                  <tr key={ob.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-blue-700">{ob.id}</td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800 line-clamp-1">
                        {ob.requirementDescription}
                      </div>
                      {ob.submissionEvidence && (
                        <div className="text-[10px] text-blue-600 mt-0.5">
                          Evidence: {ob.submissionEvidence.evidenceNotes}
                        </div>
                      )}
                      {ob.closureRemarks && (
                        <div className="text-[10px] text-emerald-700 mt-0.5 font-medium">
                          Verification Endorsement: {ob.closureRemarks}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-slate-700">
                      <div className="font-medium">{ob.institutionName}</div>
                      <span className="text-[10px] text-slate-400 font-mono">{ob.institutionId}</span>
                    </td>

                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">{ob.sourceRuleRef}</td>

                    <td className="px-4 py-3 font-mono">
                      <span className={isOverdue ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                        {ob.dueDate}
                      </span>
                    </td>

                    <td className="px-4 py-3">{getStatusBadge(ob.status)}</td>

                    <td className="px-4 py-3 text-slate-600">{ob.assignedReviewer}</td>

                    <td className="px-4 py-3 text-right space-x-2">
                      {/* Institution action: Submit proof */}
                      {currentUser.role === 'INSTITUTION_ADMIN' &&
                        (ob.status === 'DUE_SOON' || ob.status === 'OVERDUE' || ob.status === 'CLARIFICATION_REQUIRED') && (
                          <button
                            onClick={() => {
                              setActiveEvidenceModal(ob);
                              setEvidenceNotes('');
                            }}
                            className="px-2.5 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-xs transition-colors"
                          >
                            Submit Proof
                          </button>
                        )}

                      {/* Officer action: Verify evidence */}
                      {isOfficer &&
                        (ob.status === 'UNDER_VERIFICATION' || ob.status === 'SUBMITTED') && (
                          <button
                            onClick={() => {
                              setActiveReviewModal(ob);
                              setReviewVerdict('VERIFIED');
                              setReviewRemarks(`Statutory compliance verified under ${ob.sourceRuleRef}.`);
                            }}
                            className="px-2.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow-xs transition-colors"
                          >
                            Verify &amp; Close
                          </button>
                        )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Institution Submits Evidence */}
      {activeEvidenceModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              Submit Evidence of Compliance
            </h3>
            <p className="text-xs text-slate-500">
              Obligation: <strong>{activeEvidenceModal.requirementDescription}</strong>
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Evidence Details / Resolution Notes
              </label>
              <textarea
                rows={3}
                placeholder="Details of committee constitution notification order, gazette publication reference, or portal integration..."
                value={evidenceNotes}
                onChange={(e) => setEvidenceNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center bg-slate-50">
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <p className="text-xs font-semibold text-slate-700">signed_statutory_order_2026.pdf</p>
              <p className="text-[10px] text-slate-400">Attached from Institutional Vault</p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setActiveEvidenceModal(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                disabled={!evidenceNotes.trim()}
                onClick={() => {
                  submitComplianceEvidence(activeEvidenceModal.id, evidenceNotes);
                  setActiveEvidenceModal(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Submit Evidence for Verification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Officer Verifies Compliance */}
      {activeReviewModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Statutory Verification of Compliance Evidence
            </h3>
            <p className="text-xs text-slate-500">
              Preserving Human Oversight: Obligation cannot be automatically cleared by document upload alone. Authorized scrutiny verification is required.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Verdict</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold text-emerald-800 cursor-pointer">
                  <input
                    type="radio"
                    name="verdict"
                    value="VERIFIED"
                    checked={reviewVerdict === 'VERIFIED'}
                    onChange={() => setReviewVerdict('VERIFIED')}
                  />
                  Verify &amp; Close Obligation
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-amber-800 cursor-pointer">
                  <input
                    type="radio"
                    name="verdict"
                    value="CLARIFICATION_REQUIRED"
                    checked={reviewVerdict === 'CLARIFICATION_REQUIRED'}
                    onChange={() => setReviewVerdict('CLARIFICATION_REQUIRED')}
                  />
                  Request Further Evidence
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Verification Remarks &amp; Official Finding
              </label>
              <textarea
                rows={3}
                value={reviewRemarks}
                onChange={(e) => setReviewRemarks(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setActiveReviewModal(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  verifyCompliance(activeReviewModal.id, reviewVerdict, reviewRemarks);
                  setActiveReviewModal(null);
                }}
                className={`px-4 py-2 text-white text-xs font-semibold rounded-lg shadow-sm ${
                  reviewVerdict === 'VERIFIED'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                Endorse &amp; Record in Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

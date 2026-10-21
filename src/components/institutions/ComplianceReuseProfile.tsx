import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentRecord, DocumentType } from '../../types';
import {
  FolderArchive,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Upload,
  RefreshCw,
  ShieldCheck,
  Building2,
  FileCheck,
  FileText,
  Calendar,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const ComplianceReuseProfile: React.FC = () => {
  const {
    institutions,
    documents,
    currentUser,
    uploadRenewedDocument,
    verifyDocument,
    currentSimulatedDate,
    setActiveTab,
  } = useApp();

  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>(
    currentUser.institutionId || institutions[0]?.id || 'INST-2024-001'
  );

  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Renewal Modal
  const [renewingDoc, setRenewingDoc] = useState<DocumentRecord | null>(null);
  const [newExpiryDate, setNewExpiryDate] = useState('2027-10-31');
  const [newDocName, setNewDocName] = useState('');

  // Selected Institution
  const currentInstitution = institutions.find((i) => i.id === selectedInstitutionId);

  // Institution's documents
  const instDocuments = documents.filter((d) => d.institutionId === selectedInstitutionId);

  const filteredDocs = instDocuments.filter((d) => {
    if (filterStatus === 'ALL') return true;
    return d.verificationStatus === filterStatus;
  });

  // Expiry Timeline Stats
  const verifiedCount = instDocuments.filter((d) => d.verificationStatus === 'VERIFIED').length;
  const expiringSoonCount = instDocuments.filter((d) => d.verificationStatus === 'EXPIRING_SOON').length;
  const expiredCount = instDocuments.filter((d) => d.verificationStatus === 'EXPIRED').length;
  const pendingCount = instDocuments.filter((d) => d.verificationStatus === 'PENDING_VERIFICATION').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Verified &amp; Reusable
          </span>
        );
      case 'EXPIRING_SOON':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
            <Clock className="w-3 h-3 text-amber-600" />
            Expiring Soon (&lt; 30d)
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            Expired / Renewal Due
          </span>
        );
      case 'PENDING_VERIFICATION':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
            <RefreshCw className="w-3 h-3 text-blue-600 animate-spin" />
            Renewal Submitted
          </span>
        );
      case 'REVERIFICATION_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
            Reverification Required
          </span>
        );
      default:
        return <span className="text-[10px] text-slate-500">{status}</span>;
    }
  };

  const handleOpenRenewal = (doc: DocumentRecord) => {
    setRenewingDoc(doc);
    setNewDocName(`${doc.name} (Renewed Endorsement)`);
    setNewExpiryDate(
      new Date(currentSimulatedDate.getTime() + 365 * 86400000).toISOString().substring(0, 10)
    );
  };

  const handleConfirmRenewal = () => {
    if (!renewingDoc) return;
    uploadRenewedDocument(renewingDoc.id, newExpiryDate, newDocName, '3.4 MB');
    setRenewingDoc(null);
  };

  const isScrutinyOfficer = ['SCRUTINY_OFFICER', 'REGIONAL_ADMIN', 'SENIOR_AUTHORITY'].includes(
    currentUser.role
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner explaining USP */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-500/30 border border-blue-400/40 rounded text-[11px] font-bold text-blue-200 mb-2">
            <Sparkles className="w-3 h-3 text-blue-300" />
            AICTE SAMPARK INNOVATION: COMPLIANCE REUSE PROFILE
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Institutional Digital Compliance Vault &amp; Lifetime Document Reuse
          </h2>
          <p className="text-xs text-blue-100/90 leading-relaxed mt-1">
            Eliminating repetitive document re-submissions. Perpetual land titles, municipal occupancy certificates, and verified campus plans remain permanently valid in the institutional profile, saving hundreds of administrative hours across approval cycles.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {currentUser.role !== 'INSTITUTION_ADMIN' && (
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
              <label className="block text-[10px] font-semibold text-blue-200 uppercase tracking-wider mb-1">
                Select Institution Vault
              </label>
              <select
                value={selectedInstitutionId}
                onChange={(e) => setSelectedInstitutionId(e.target.value)}
                className="bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20 focus:outline-none"
              >
                {institutions.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name} ({inst.city})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Institutional Metadata & Expiry Timeline Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Profile Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 lg:col-span-1 space-y-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800">Vault Particulars</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{currentInstitution?.name}</h4>
          <p className="text-xs text-slate-500">{currentInstitution?.address}</p>
          <div className="text-xs space-y-1 pt-2 border-t border-slate-100 font-mono text-slate-600">
            <div>AICTE Permanent ID: {currentInstitution?.code}</div>
            <div>Principal: {currentInstitution?.principalName}</div>
            <div>Sanctioned Intake: {currentInstitution?.sanctionedIntake} seats</div>
          </div>
        </div>

        {/* Expiry Timeline Stats */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 lg:col-span-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              Document Validity Status &amp; Expiry Countdown
            </h4>
            <span className="text-xs text-slate-400 font-mono">
              Evaluated as of {currentSimulatedDate.toLocaleDateString()}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
              <span className="text-[10px] font-bold uppercase text-emerald-700">Verified &amp; Active</span>
              <div className="text-xl font-bold text-emerald-800 font-mono mt-0.5">{verifiedCount}</div>
              <p className="text-[10px] text-emerald-600 mt-0.5">Eligible for instant reuse</p>
            </div>

            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200">
              <span className="text-[10px] font-bold uppercase text-amber-700">Expiring Soon</span>
              <div className="text-xl font-bold text-amber-800 font-mono mt-0.5">{expiringSoonCount}</div>
              <p className="text-[10px] text-amber-600 mt-0.5">&lt; 30 days remaining</p>
            </div>

            <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200">
              <span className="text-[10px] font-bold uppercase text-rose-700">Expired</span>
              <div className="text-xl font-bold text-rose-800 font-mono mt-0.5">{expiredCount}</div>
              <p className="text-[10px] text-rose-600 mt-0.5">Mandatory renewal needed</p>
            </div>

            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200">
              <span className="text-[10px] font-bold uppercase text-blue-700">Renewal In Review</span>
              <div className="text-xl font-bold text-blue-800 font-mono mt-0.5">{pendingCount}</div>
              <p className="text-[10px] text-blue-600 mt-0.5">Scrutiny queue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Document Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FolderArchive className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Statutory Document Registry ({filteredDocs.length} Documents)
              </h3>
              <p className="text-xs text-slate-400">
                Perpetual and multi-year statutory certificates tracked across all annual approval cycles
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">Verified Only</option>
              <option value="EXPIRED">Expired Only</option>
              <option value="PENDING_VERIFICATION">In Review</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
              <tr>
                <th className="px-4 py-3">Document ID</th>
                <th className="px-4 py-3">Document Title &amp; Category</th>
                <th className="px-4 py-3">Issuance Date</th>
                <th className="px-4 py-3">Validity / Expiry</th>
                <th className="px-4 py-3">Verification Badge</th>
                <th className="px-4 py-3">Verified Official</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => {
                const isExpired =
                  doc.verificationStatus === 'EXPIRED' ||
                  (doc.expiryDate && new Date(doc.expiryDate) < currentSimulatedDate);
                const isPendingReview = doc.verificationStatus === 'PENDING_VERIFICATION';

                return (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-blue-700">
                      {doc.id}
                      <span className="block text-[10px] text-slate-400 font-sans">
                        v{doc.versionNumber} · {doc.fileSize}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800 line-clamp-1">{doc.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {doc.type.replace(/_/g, ' ')}
                      </div>
                      {doc.notes && (
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{doc.notes}</p>
                      )}
                    </td>

                    <td className="px-4 py-3 font-mono text-slate-600">{doc.issueDate}</td>

                    <td className="px-4 py-3 font-mono">
                      <span
                        className={
                          isExpired
                            ? 'text-rose-600 font-bold'
                            : doc.verificationStatus === 'EXPIRING_SOON'
                            ? 'text-amber-600 font-semibold'
                            : 'text-slate-800'
                        }
                      >
                        {doc.expiryDate || 'Perpetual Title'}
                      </span>
                    </td>

                    <td className="px-4 py-3">{getStatusBadge(doc.verificationStatus)}</td>

                    <td className="px-4 py-3 text-slate-600">
                      <div>{doc.verifiedBy || 'Pending Scrutiny'}</div>
                      {doc.verificationDate && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          {doc.verificationDate}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right space-x-2">
                      {/* Institution action: Upload renewal if expired */}
                      {isExpired && (
                        <button
                          onClick={() => handleOpenRenewal(doc)}
                          className="px-2.5 py-1 text-xs bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-md shadow-xs transition-colors"
                        >
                          Upload Renewal
                        </button>
                      )}

                      {/* Scrutiny Officer action: Verify renewed document */}
                      {isPendingReview && isScrutinyOfficer && (
                        <button
                          onClick={() =>
                            verifyDocument(
                              doc.id,
                              true,
                              `Verified by ${currentUser.name} against municipal municipal portal.`
                            )
                          }
                          className="px-2.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow-xs transition-colors"
                        >
                          Approve Renewal
                        </button>
                      )}

                      <button
                        onClick={() => setActiveTab('anomaly')}
                        className="px-2 py-1 text-xs text-blue-600 hover:underline font-medium"
                      >
                        Forensic AI Check
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Upload Renewed Document */}
      {renewingDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              Upload Renewed Statutory Certificate
            </h3>
            <p className="text-xs text-slate-500">
              Submit renewed certificate for <strong>{renewingDoc.name}</strong>. Upon submission, it enters the Scrutiny Officer verification queue.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Document Title
              </label>
              <input
                type="text"
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                New Extended Expiry Date
              </label>
              <input
                type="date"
                value={newExpiryDate}
                onChange={(e) => setNewExpiryDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center bg-slate-50">
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <p className="text-xs font-semibold text-slate-700">fire_safety_noc_renewal_2026.pdf</p>
              <p className="text-[10px] text-slate-400">3.4 MB · Digital Signature verified</p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setRenewingDoc(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRenewal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Submit Renewal for Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

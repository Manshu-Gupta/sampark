import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ApplicationType, ApplicationRoute } from '../../types';
import {
  X,
  CheckCircle,
  AlertTriangle,
  FolderArchive,
  ArrowRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const NewApplicationModal: React.FC<Props> = ({ onClose }) => {
  const {
    institutions,
    documents,
    currentUser,
    submitNewApplication,
    setSelectedApplicationId,
    setActiveTab,
  } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [institutionId, setInstitutionId] = useState<string>(
    currentUser.institutionId || institutions[0]?.id || 'INST-2024-001'
  );
  const [appType, setAppType] = useState<ApplicationType>('INTAKE_VARIATION');
  const [route, setRoute] = useState<ApplicationRoute>('SCRUTINY_EVC');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [notes, setNotes] = useState('Application for Intake Expansion in Technical Computing Programs');
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);

  // Eligible documents for this institution
  const instDocuments = documents.filter((d) => d.institutionId === institutionId);

  // Auto-select verified and eligible documents on step 2 load
  const handleProceedToDocs = () => {
    const verifiedDocIds = instDocuments
      .filter((d) => d.verificationStatus === 'VERIFIED')
      .map((d) => d.id);
    setSelectedDocIds(verifiedDocIds);
    setStep(2);
  };

  const toggleDocSelection = (docId: string) => {
    setSelectedDocIds((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newApp = submitNewApplication({
      institutionId,
      type: appType,
      route,
      academicYear,
      attachedDocumentIds: selectedDocIds,
      reusedDocumentIds: selectedDocIds,
      notes,
    });

    onClose();
    setSelectedApplicationId(newApp.id);
    setActiveTab('application_detail');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Submit Statutory Approval Application
            </h3>
            <p className="text-xs text-slate-500">
              Step {step} of 2: {step === 1 ? 'Application Details & Route' : 'Compliance Document Reuse (USP)'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        {step === 1 ? (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Technical Institution
              </label>
              <select
                value={institutionId}
                onChange={(e) => setInstitutionId(e.target.value)}
                disabled={currentUser.role === 'INSTITUTION_ADMIN' && !!currentUser.institutionId}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {institutions.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name} ({inst.city}, {inst.state}) - {inst.id}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Application Type
                </label>
                <select
                  value={appType}
                  onChange={(e) => {
                    const val = e.target.value as ApplicationType;
                    setAppType(val);
                    if (val === 'EXTENSION_OF_APPROVAL') setRoute('SCRUTINY_ONLY');
                    else if (val === 'NEW_INSTITUTION' || val === 'CHANGE_OF_SITE')
                      setRoute('SCRUTINY_EVC_COMMITTEE');
                    else setRoute('SCRUTINY_EVC');
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="INTAKE_VARIATION">Intake Variation / Expansion</option>
                  <option value="EXTENSION_OF_APPROVAL">Extension of Approval (EoA)</option>
                  <option value="NEW_PROGRAM">Introduction of New Program</option>
                  <option value="NEW_INSTITUTION">New Technical Institution Setup</option>
                  <option value="CHANGE_OF_SITE">Change of Site / Location</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Academic Approval Year
                </label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Approval Workflow Route (Configurable under APH)
              </label>
              <select
                value={route}
                onChange={(e) => setRoute(e.target.value as ApplicationRoute)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="SCRUTINY_EVC">Route B: Scrutiny followed by EVC Inspection</option>
                <option value="SCRUTINY_ONLY">Route A: Fast-Track Scrutiny Only</option>
                <option value="SCRUTINY_EVC_COMMITTEE">
                  Route C: Scrutiny, EVC & Council Committee Review
                </option>
                <option value="EVC_COMMITTEE">Route D: EVC & Committee Special Review</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Application Subject / Administrative Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProceedToDocs}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Next: Compliance Reuse Profile
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-emerald-900">
                  Compliance Reuse Profile (AICTE Digital Vault)
                </h4>
                <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                  Select previously verified statutory documents that remain valid. You avoid re-uploading
                  and repeated physical verification for perpetual or multi-year certificates.
                </p>
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {instDocuments.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No existing records in Compliance Reuse Profile for this institution.
                </div>
              ) : (
                instDocuments.map((doc) => {
                  const isVerified = doc.verificationStatus === 'VERIFIED';
                  const isSelected = selectedDocIds.includes(doc.id);

                  return (
                    <div
                      key={doc.id}
                      onClick={() => isVerified && toggleDocSelection(doc.id)}
                      className={`p-3 rounded-lg border transition-all flex items-start justify-between gap-3 ${
                        !isVerified
                          ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                          : isSelected
                          ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-300 cursor-pointer'
                          : 'bg-white border-slate-200 hover:border-slate-300 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={!isVerified}
                          onChange={() => {}}
                          className="mt-1 rounded text-blue-600 focus:ring-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">{doc.name}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                            <span className="font-mono">{doc.id}</span>
                            <span>·</span>
                            <span>
                              {doc.expiryDate ? `Expires: ${doc.expiryDate}` : 'Perpetual Validity'}
                            </span>
                            <span>·</span>
                            <span>v{doc.versionNumber}</span>
                          </div>
                          {doc.notes && (
                            <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{doc.notes}</p>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {isVerified ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Eligible for Reuse
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            {doc.verificationStatus.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                ← Back to Details
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Confirm & Submit Application ({selectedDocIds.length} Docs Reused)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

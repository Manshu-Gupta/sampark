import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileSearch,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Upload,
  RefreshCw,
  FileText,
  Building2,
  ExternalLink,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface SyntheticDocSample {
  id: string;
  name: string;
  type: string;
  institution: string;
  description: string;
  expectedOutcome: 'NO_ANOMALY' | 'POTENTIAL_INCONSISTENCY';
}

export const DocumentAnomalyDetector: React.FC = () => {
  const { documents, currentUser, currentSimulatedDate, setActiveTab } = useApp();

  const syntheticSamples: SyntheticDocSample[] = [
    {
      id: 'DOC-2026-004',
      name: 'Fire & Emergency Services Clearance Certificate (NOC)',
      type: 'FIRE_SAFETY_NOC',
      institution: 'Sunrise Institute of Technology',
      description: 'Expiring annual safety certificate with subtle font baseline divergence on issuance serial.',
      expectedOutcome: 'POTENTIAL_INCONSISTENCY',
    },
    {
      id: 'DOC-2026-001',
      name: 'Registered Perpetual Land Lease Deed (7.5 Acres)',
      type: 'LEASE_AGREEMENT',
      institution: 'Sunrise Institute of Technology',
      description: 'Perpetual 50-year lease deed registered at SRO Haveli. Standard certified copy.',
      expectedOutcome: 'NO_ANOMALY',
    },
    {
      id: 'DOC-2026-002',
      name: 'Occupancy & Building Completion Certificate (BCC)',
      type: 'BUILDING_COMPLETION',
      institution: 'Sunrise Institute of Technology',
      description: 'Pune Municipal Corporation certified occupancy for 18,450 sq.m built-up area.',
      expectedOutcome: 'NO_ANOMALY',
    },
    {
      id: 'DOC-2026-006',
      name: 'Joint Fixed Deposit Receipt (₹ 50,00,000/- Corpus)',
      type: 'CORPUS_FD_RECEIPT',
      institution: 'Sunrise Institute of Technology',
      description: 'State Bank of India Joint Corpus FD with AICTE official lien endorsement.',
      expectedOutcome: 'NO_ANOMALY',
    },
  ];

  const [selectedSample, setSelectedSample] = useState<SyntheticDocSample>(syntheticSamples[0]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [endorsed, setEndorsed] = useState(false);

  const runAnalysis = async (sample: SyntheticDocSample) => {
    setSelectedSample(sample);
    setAnalyzing(true);
    setAnalysisResult(null);
    setEndorsed(false);

    try {
      const response = await fetch('/api/ai/document-anomaly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: sample.id,
          documentName: sample.name,
          documentType: sample.type,
          extractedMeta: {
            institution: sample.institution,
            documentCategory: sample.type,
          },
        }),
      });

      const data = await response.json();
      setAnalysisResult(data.result);
    } catch (err: any) {
      console.error('Document analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Multimodal Document Anomaly Detection
            </h2>
            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded">
              Gemini Vision Assisted
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-verifies visual certificate layouts, stamp seals, registration numbers, and dates against extracted institutional metadata
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            Preserving Human Oversight
          </span>
        </div>
      </div>

      {/* Synthetic Document Selector Carousel */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Select Synthetic Document for Forensic Verification
          </h3>
          <span className="text-xs text-slate-400">Choose a test document or run full scan</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {syntheticSamples.map((sample) => {
            const isSelected = selectedSample.id === sample.id;
            return (
              <div
                key={sample.id}
                onClick={() => setSelectedSample(sample)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="font-bold text-blue-700">{sample.id}</span>
                  {sample.expectedOutcome === 'POTENTIAL_INCONSISTENCY' ? (
                    <span className="text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-bold">
                      Contains Inconsistency
                    </span>
                  ) : (
                    <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-bold">
                      Standard Doc
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{sample.name}</h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{sample.description}</p>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => runAnalysis(selectedSample)}
            disabled={analyzing}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Analyzing Document Visuals...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Run Multimodal Anomaly Scan
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results View */}
      {analysisResult && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in space-y-6 p-6">
          {/* Status Verdict Banner */}
          <div
            className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
              analysisResult.category === 'POTENTIAL_INCONSISTENCY'
                ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
            }`}
          >
            <div className="flex items-start gap-3">
              {analysisResult.category === 'POTENTIAL_INCONSISTENCY' ? (
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block">
                  Forensic Vision Triage Verdict
                </span>
                <h3 className="text-base font-bold">
                  {analysisResult.category === 'POTENTIAL_INCONSISTENCY'
                    ? 'Potential Inconsistencies Detected for Human Review'
                    : 'No Visual Anomalies Detected'}
                </h3>
                <p className="text-xs mt-0.5 opacity-90">
                  Document ID: <strong>{analysisResult.documentId}</strong> · Category:{' '}
                  <strong>{analysisResult.documentType}</strong>
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold block opacity-70">
                AI Confidence Score
              </span>
              <span className="text-xl font-bold font-mono">{analysisResult.confidenceScore}%</span>
            </div>
          </div>

          {/* Extracted Fields Comparison Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Extracted Fields Cross-Referenced Against Visual Layout
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(analysisResult.extractedFields).map(([k, v]: [string, any]) => (
                <div key={k} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                    {k.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="font-bold text-slate-800 font-mono mt-0.5 block">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Anomalies List (if any) */}
          {analysisResult.potentialAnomalies && analysisResult.potentialAnomalies.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Flagged Visual &amp; Metadata Discrepancies
              </h4>
              <div className="space-y-2">
                {analysisResult.potentialAnomalies.map((anom: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 bg-rose-50/60 rounded-lg border border-rose-200 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-800">{anom.field}</span>
                      <span className="text-[10px] font-mono text-rose-600 font-bold bg-rose-100 px-1.5 py-0.2 rounded">
                        Severity: {anom.severity}
                      </span>
                    </div>
                    <p className="text-slate-700">{anom.issue}</p>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Ref: {anom.pageReference}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Human Verification Steps */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Recommended Statutory Verification Steps
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
              {analysisResult.recommendedVerificationSteps.map((step: string, i: number) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>

          {/* Regulatory Safeguard Notice */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-800 block mb-0.5">Mandatory Council Safeguard:</span>
            {analysisResult.regulatoryNotice}
          </div>

          {/* Scrutiny Officer Sign-Off & Audit Logging */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Sign-off by Authorized Officer: <strong>{currentUser.name}</strong> ({currentUser.role})
            </span>

            <div className="flex items-center gap-2">
              {endorsed ? (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Forensic Review Signed &amp; Logged to Audit Trail
                </span>
              ) : (
                <button
                  onClick={() => setEndorsed(true)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Endorse Findings &amp; Record in Case File
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

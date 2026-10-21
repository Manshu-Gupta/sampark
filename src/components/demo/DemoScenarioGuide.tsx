import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  UserCheck,
  Building2,
  FolderArchive,
  FileSearch,
  Bot,
  CalendarCheck,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const DemoScenarioGuide: React.FC = () => {
  const {
    switchRole,
    currentUser,
    setSelectedApplicationId,
    setActiveTab,
    resetDemoData,
    applications,
    documents,
    returnForClarification,
    respondToClarification,
    advanceApplicationStage,
    scheduleEVCVisit,
  } = useApp();

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const scenarioSteps = [
    {
      step: 1,
      title: 'Institution Administrator Logs In',
      role: 'INSTITUTION_ADMIN' as const,
      roleName: 'Dr. Rajesh K. Sharma (Sunrise Institute)',
      description: 'Switch to Institution Administrator role to access the institutional dashboard and applications.',
      actionLabel: 'Switch to Institution Admin',
      execute: () => {
        switchRole('INSTITUTION_ADMIN');
        setActiveTab('overview');
      },
    },
    {
      step: 2,
      title: 'Open Compliance Reuse Profile (USP)',
      role: 'INSTITUTION_ADMIN' as const,
      roleName: 'Dr. Rajesh K. Sharma',
      description:
        'Inspect Sunrise Institute’s persistent digital vault. Notice previously verified Perpetual Lease Deed and Building Completion Certificate ready for lifetime reuse.',
      actionLabel: 'Open Compliance Reuse Profile',
      execute: () => {
        switchRole('INSTITUTION_ADMIN');
        setActiveTab('documents');
      },
    },
    {
      step: 3,
      title: 'Select Verified Lease Document for Reuse',
      role: 'INSTITUTION_ADMIN' as const,
      roleName: 'Dr. Rajesh K. Sharma',
      description:
        'Verify document validity check. The 50-year perpetual lease deed is active and pre-verified by AICTE scrutiny officers.',
      actionLabel: 'Inspect Lease Document in Vault',
      execute: () => {
        setActiveTab('documents');
      },
    },
    {
      step: 4,
      title: 'View Target Application (AICTE-DEMO-2026-001)',
      role: 'INSTITUTION_ADMIN' as const,
      roleName: 'Dr. Rajesh K. Sharma',
      description:
        'Open Sunrise Institute’s intake variation application configured for Scrutiny followed by EVC.',
      actionLabel: 'Open Application AICTE-DEMO-2026-001',
      execute: () => {
        setSelectedApplicationId('AICTE-DEMO-2026-001');
        setActiveTab('application_detail');
      },
    },
    {
      step: 5,
      title: 'Switch to Scrutiny Officer Dashboard',
      role: 'SCRUTINY_OFFICER' as const,
      roleName: 'P. V. Ramanathan (Senior Scrutiny Officer)',
      description:
        'Switch persona to Scrutiny Officer. Case AICTE-DEMO-2026-001 appears at the top of the Scrutiny queue with 11 days elapsed against the 14-day SLA.',
      actionLabel: 'Switch to Scrutiny Officer',
      execute: () => {
        switchRole('SCRUTINY_OFFICER');
        setSelectedApplicationId('AICTE-DEMO-2026-001');
        setActiveTab('application_detail');
      },
    },
    {
      step: 6,
      title: 'Officer Returns Application with Mandatory Reason',
      role: 'SCRUTINY_OFFICER' as const,
      roleName: 'P. V. Ramanathan',
      description:
        'Officer flags the expired Fire Safety NOC (DOC-2026-004) and returns the application to Sunrise Institute under APH Chapter II regulations.',
      actionLabel: 'Execute Return for Clarification',
      execute: () => {
        switchRole('SCRUTINY_OFFICER');
        returnForClarification(
          'AICTE-DEMO-2026-001',
          'Fire Safety NOC (DOC-2026-004) expired on 13-Jan-2026. Please upload renewed NOC or proof of renewal application with municipal inspection receipt.'
        );
        setSelectedApplicationId('AICTE-DEMO-2026-001');
        setActiveTab('application_detail');
      },
    },
    {
      step: 7,
      title: 'Institution Receives Deficiency Alert',
      role: 'INSTITUTION_ADMIN' as const,
      roleName: 'Dr. Rajesh K. Sharma',
      description:
        'Switch back to Institution Administrator. Check Notifications to observe the deficiency notice with an open 15-day rectification window.',
      actionLabel: 'View Deficiency Notification',
      execute: () => {
        switchRole('INSTITUTION_ADMIN');
        setActiveTab('alerts');
      },
    },
    {
      step: 8,
      title: 'Institution Submits Clarification Response',
      role: 'INSTITUTION_ADMIN' as const,
      roleName: 'Dr. Rajesh K. Sharma',
      description:
        'Institution submits official response stating renewed PMRDA Fire Services endorsement is underway.',
      actionLabel: 'Submit Clarification Response',
      execute: () => {
        switchRole('INSTITUTION_ADMIN');
        respondToClarification(
          'AICTE-DEMO-2026-001',
          'We have obtained provisional Fire Safety Renewal Inspection Endorsement dated 20-Oct-2026 from PMRDA Fire Department. Final copy attached.'
        );
        setSelectedApplicationId('AICTE-DEMO-2026-001');
        setActiveTab('application_detail');
      },
    },
    {
      step: 9,
      title: 'Application Enters Re-Scrutiny & Recommended for EVC',
      role: 'SCRUTINY_OFFICER' as const,
      roleName: 'P. V. Ramanathan',
      description:
        'Scrutiny Officer accepts clarification response and marks scrutiny complete. Case automatically advances to EVC queue!',
      actionLabel: 'Clear Scrutiny → Enqueue EVC',
      execute: () => {
        switchRole('SCRUTINY_OFFICER');
        advanceApplicationStage(
          'AICTE-DEMO-2026-001',
          'EVC_PENDING',
          'Clarification Accepted by Scrutiny Officer',
          'Provisional Fire endorsement reviewed. Application recommended for Expert Visit Committee inspection.'
        );
        setSelectedApplicationId('AICTE-DEMO-2026-001');
        setActiveTab('application_detail');
      },
    },
    {
      step: 10,
      title: 'EVC Coordinator Schedules On-Site Inspection',
      role: 'EVC_COORDINATOR' as const,
      roleName: 'Prof. Anil K. Tiwari',
      description:
        'Switch to EVC Coordinator. Propose and confirm inspection date with the 3-member expert panel.',
      actionLabel: 'Schedule EVC Visit for 28-Oct-2026',
      execute: () => {
        switchRole('EVC_COORDINATOR');
        scheduleEVCVisit(
          'EVC-2026-006',
          '2026-10-28',
          '2026-10-28',
          'Panel dispatched: Prof. K. B. Deshpande (Chairman), Dr. Vidya Shirke, Er. S. T. Shinde'
        );
        setActiveTab('evc');
      },
    },
    {
      step: 11,
      title: 'Check Upcoming Compliance Deadlines',
      role: 'INSTITUTION_ADMIN' as const,
      roleName: 'Dr. Rajesh K. Sharma',
      description:
        'Institution checks statutory compliance deadlines, observing Anti-Ragging Committee submission due on 30-Oct-2026.',
      actionLabel: 'Open Compliance Tracker',
      execute: () => {
        switchRole('INSTITUTION_ADMIN');
        setActiveTab('compliance');
      },
    },
    {
      step: 12,
      title: 'Consult AICTE Compliance Copilot',
      role: 'INSTITUTION_ADMIN' as const,
      roleName: 'Dr. Rajesh K. Sharma',
      description:
        'Ask the grounded AI Copilot to explain the application history, deficiency reasons, and next administrative actions.',
      actionLabel: 'Launch AI Compliance Copilot',
      execute: () => {
        setSelectedApplicationId('AICTE-DEMO-2026-001');
        setActiveTab('copilot');
      },
    },
    {
      step: 13,
      title: 'Multimodal Forensic Document Anomaly Check',
      role: 'SCRUTINY_OFFICER' as const,
      roleName: 'P. V. Ramanathan',
      description:
        'Officer runs Gemini Vision document anomaly analysis on the synthetic Fire Safety NOC to examine expiration dates and font baseline consistency.',
      actionLabel: 'Run Forensic Vision Scan',
      execute: () => {
        switchRole('SCRUTINY_OFFICER');
        setActiveTab('anomaly');
      },
    },
    {
      step: 14,
      title: 'Inspect Complete Immutable Audit Trail',
      role: 'SENIOR_AUTHORITY' as const,
      roleName: 'Dr. Arvind C. Patil (Member Secretary)',
      description:
        'Senior Authority reviews the complete cryptographic audit trail documenting every submission, scrutiny return, clarification, EVC schedule, and AI inquiry.',
      actionLabel: 'Inspect Statutory Audit Ledger',
      execute: () => {
        switchRole('SENIOR_AUTHORITY');
        setActiveTab('audit');
      },
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded text-[10px] font-bold uppercase mb-2">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            Hackathon Demonstration Script (Section 20)
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Repeatable End-to-End Walkthrough Guide
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Follow the exact 14-step official demonstration scenario for{' '}
            <strong>Sunrise Institute of Technology (AICTE-DEMO-2026-001)</strong>. You can execute each step with 1 click to watch live role switching, document reuse, scrutiny return, clarification, EVC scheduling, AI Copilot, and audit trail updates!
          </p>
        </div>

        <button
          onClick={resetDemoData}
          className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold rounded-xl flex items-center gap-2 self-start md:self-center transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Demo to Initial State
        </button>
      </div>

      {/* Stepper Timeline */}
      <div className="space-y-3">
        {scenarioSteps.map((step, idx) => {
          const isCurrent = activeStepIndex === idx;
          const isDone = activeStepIndex > idx;

          return (
            <div
              key={step.step}
              className={`p-4 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                  : isDone
                  ? 'bg-white border-slate-200'
                  : 'bg-slate-50 border-slate-200 opacity-80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-2 ring-blue-200'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : step.step}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                        {step.roleName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{step.description}</p>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => {
                      step.execute();
                      setActiveStepIndex(idx + 1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs ${
                      isCurrent
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>{step.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

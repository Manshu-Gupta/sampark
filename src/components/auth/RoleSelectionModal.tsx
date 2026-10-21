import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  X,
  Building2,
  FileCheck2,
  MapPin,
  CalendarCheck,
  ClipboardCheck,
  Scale,
  Eye,
  Settings,
  ArrowRight,
  ShieldCheck,
  Lock,
  Sparkles,
  Info,
} from 'lucide-react';

interface RoleOption {
  role: UserRole;
  title: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  personaName: string;
  personaDesignation: string;
  gradientClass: string;
  accentBadge: string;
  dashboardPreview: string;
}

export const RoleSelectionModal: React.FC = () => {
  const { isSignInModalOpen, setIsSignInModalOpen, loginAsRole } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('INSTITUTION_ADMIN');

  if (!isSignInModalOpen) return null;

  const roleOptions: RoleOption[] = [
    {
      role: 'INSTITUTION_ADMIN',
      title: '1. Institution Administrator',
      category: 'Applicant Institute',
      icon: Building2,
      description: 'Manage college applications, access Compliance Reuse Profile vault, respond to deficiencies, and upload renewals.',
      personaName: 'Dr. Rajesh K. Sharma',
      personaDesignation: 'Principal, Sunrise Institute of Technology',
      gradientClass: 'gradient-icon-blue',
      accentBadge: 'bg-blue-50 text-[#3867F5] border-blue-200',
      dashboardPreview: 'Application tracker, document expiry countdown, deficiency resubmission panel',
    },
    {
      role: 'SCRUTINY_OFFICER',
      title: '2. AICTE Scrutiny Officer',
      category: 'Regional Scrutiny',
      icon: FileCheck2,
      description: 'Examine submitted applications, inspect document metadata, record observations, return for clarification, or recommend for EVC.',
      personaName: 'P. V. Ramanathan',
      personaDesignation: 'Senior Scrutiny Officer, Western Regional Office',
      gradientClass: 'gradient-icon-indigo',
      accentBadge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      dashboardPreview: '14-day SLA countdown, re-scrutiny queue, deficiency recording actions',
    },
    {
      role: 'REGIONAL_ADMIN',
      title: '3. Regional Officer',
      category: 'Regional Directorate',
      icon: MapPin,
      description: 'Monitor regional application pendency, officer workload distribution, 0–30+ day aging buckets, and review Level 2 escalations.',
      personaName: 'Dr. Sunita Deshmukh',
      personaDesignation: 'Regional Officer & Bureau Head, Western Region',
      gradientClass: 'gradient-icon-teal',
      accentBadge: 'bg-teal-50 text-teal-700 border-teal-200',
      dashboardPreview: 'Regional SLA adherence, officer caseload balancer, Level 2 escalation queue',
    },
    {
      role: 'EVC_COORDINATOR',
      title: '4. EVC Coordinator / Committee Member',
      category: 'Expert Visit Bureau',
      icon: CalendarCheck,
      description: 'Schedule on-site Expert Visit Committee inspections, mobilize 3-member panels, track proposed/confirmed dates, and file visit reports.',
      personaName: 'Prof. Anil K. Tiwari',
      personaDesignation: 'Chief EVC Coordinator, Approval Bureau',
      gradientClass: 'gradient-icon-rose',
      accentBadge: 'bg-pink-50 text-pink-700 border-pink-200',
      dashboardPreview: 'Inspection calendar, 3-member panel mobilizer, digital deficiency report compiler',
    },
    {
      role: 'COMPLIANCE_OFFICER',
      title: '5. Compliance Verification Officer',
      category: 'Regulatory Compliance Cell',
      icon: ClipboardCheck,
      description: 'Track statutory undertakings, verify evidence for Anti-Ragging and ICC notifications, and oversee lease document expiry timelines.',
      personaName: 'Smt. Kalyani Sundaram',
      personaDesignation: 'Compliance Verification Officer, Regulatory Cell',
      gradientClass: 'gradient-icon-emerald',
      accentBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dashboardPreview: 'Statutory undertaking queue, lease expiry monitor, evidence verification action',
    },
    {
      role: 'BUREAU_OFFICER',
      title: '6. Bureau Officer / Competent Authority',
      category: 'Council Leadership',
      icon: Scale,
      description: 'Consolidated national pendency oversight, regional bottleneck review, critical escalations, and statutory approval/rejection orders.',
      personaName: 'Dr. Arvind C. Patil',
      personaDesignation: 'Advisor & Member Secretary (Approval Bureau)',
      gradientClass: 'gradient-icon-orange',
      accentBadge: 'bg-amber-50 text-amber-700 border-amber-200',
      dashboardPreview: 'National command console, bottleneck heatmaps, official council decision sign-off',
    },
    {
      role: 'AUDITOR',
      title: '7. Read-Only Auditor / Monitoring Officer',
      category: 'Transparency & Vigilance',
      icon: Eye,
      description: 'Independent audit oversight with strictly read-only access to application registers, cryptographic audit ledgers, and exportable reports.',
      personaName: 'Shri Vikramaditya Sen',
      personaDesignation: 'Statutory Audit & Vigilance Monitoring Officer',
      gradientClass: 'gradient-icon-sky',
      accentBadge: 'bg-sky-50 text-sky-700 border-sky-200',
      dashboardPreview: 'Read-only ledger inspector, immutable state diffs, zero edit/override powers',
    },
    {
      role: 'SUPER_ADMIN',
      title: '8. Super Administrator',
      category: 'Platform Operations',
      icon: Settings,
      description: 'System configuration, role & permission mapping, workflow route SLA definitions, document type registry, and operational health logs.',
      personaName: 'Er. Devendra Nath',
      personaDesignation: 'Chief System Architect & Super Administrator',
      gradientClass: 'gradient-icon-violet',
      accentBadge: 'bg-violet-50 text-violet-700 border-violet-200',
      dashboardPreview: 'Workflow route rules engine, user permission matrix, system audit logs',
    },
  ];

  const handleSelectAndLogin = (role: UserRole) => {
    loginAsRole(role);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#172033]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white border border-[#E5EAF3] rounded-3xl max-w-5xl w-full my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E5EAF3] flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg gradient-icon-blue flex items-center justify-center font-bold text-white text-sm shadow-xs">
                स
              </div>
              <h2 className="text-lg font-bold text-[#172033]">
                Select Authorised Persona &amp; Enter Dashboard
              </h2>
            </div>
            <p className="text-xs text-[#64748B] mt-1">
              Select one of the 8 distinct regulatory roles to test the genuine, tailored dashboard and operational permissions.
            </p>
          </div>

          <button
            onClick={() => setIsSignInModalOpen(false)}
            className="p-2 text-[#64748B] hover:text-[#172033] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security & Prototype Architecture Notice */}
        <div className="px-6 py-2.5 bg-blue-50/70 border-b border-blue-100 text-[11px] text-[#3867F5] flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0 text-[#3867F5]" />
          <span>
            <strong>Prototype Authentication Adapter:</strong> In production, role assignment is verified server-side through SSO or enterprise credentials. This demonstration adapter provides predefined test accounts with real role-scoped permissions.
          </span>
        </div>

        {/* 8 Role Cards Grid */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F8FAFF]">
          {roleOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedRole === opt.role;

            return (
              <div
                key={opt.role}
                onClick={() => setSelectedRole(opt.role)}
                className={`p-4 rounded-2xl border transition-all text-left cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-[#3867F5] ring-2 ring-blue-500/20 shadow-sm'
                    : 'bg-white border-[#E5EAF3] hover:border-blue-300 hover:shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl ${opt.gradientClass} text-white flex items-center justify-center shadow-xs shrink-0`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${opt.accentBadge}`}>
                          {opt.category}
                        </span>
                        <h4 className="text-sm font-bold text-[#172033] mt-0.5">{opt.title}</h4>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#64748B] leading-relaxed">{opt.description}</p>

                  <div className="p-2.5 rounded-xl bg-[#F8FAFF] border border-[#E5EAF3] text-[11px] space-y-0.5">
                    <div className="text-[#64748B]">
                      Demo Account: <strong className="text-[#172033]">{opt.personaName}</strong>
                    </div>
                    <div className="text-[#64748B] truncate text-[10px]">{opt.personaDesignation}</div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-[#E5EAF3] flex items-center justify-between">
                  <span className="text-[10px] text-[#64748B] truncate max-w-[240px]">
                    {opt.dashboardPreview}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectAndLogin(opt.role);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shrink-0 shadow-xs cursor-pointer ${
                      isSelected
                        ? 'bg-[#3867F5] hover:bg-blue-600 text-white'
                        : 'bg-slate-100 hover:bg-blue-50 text-[#172033] hover:text-[#3867F5]'
                    }`}
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-[#E5EAF3] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-[#64748B]">
            Selected Persona: <strong className="text-[#172033]">{selectedRole}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSignInModalOpen(false)}
              className="px-4 py-2 text-[#64748B] hover:text-[#172033] rounded-xl transition-colors font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSelectAndLogin(selectedRole)}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Launch Dashboard as {roleOptions.find((r) => r.role === selectedRole)?.personaName}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

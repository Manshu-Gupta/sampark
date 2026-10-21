import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  ArrowRight,
  GitBranch,
  CalendarCheck,
  ClipboardCheck,
  FolderArchive,
  AlertOctagon,
  BarChart3,
  Lock,
  Sparkles,
  Bot,
  CheckCircle2,
  Clock,
  Building2,
  FileText,
  Search,
  Scale,
  Compass,
  ChevronRight,
  Eye,
  Layers,
  ArrowUpRight,
  Check,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setIsSignInModalOpen, loginAsRole, setCurrentView } = useApp();
  const [activeWorkflowRoute, setActiveWorkflowRoute] = useState<'A' | 'B' | 'C'>('B');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-[#172033] font-sans selection:bg-[#3867F5] selection:text-white">
      {/* Background Decorative Mesh & Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5EAF3_1px,transparent_1px),linear-gradient(to_bottom,#E5EAF3_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40" />
      </div>

      {/* 1. TOP NAVIGATION */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E5EAF3] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-icon-blue flex items-center justify-center font-black text-white text-lg shadow-sm">
              स
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#172033] text-base tracking-tight">AICTE SAMPARK</span>
                <span className="text-[10px] bg-blue-50 text-[#3867F5] font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                  National Prototype
                </span>
              </div>
              <p className="text-[10px] text-[#64748B] font-medium tracking-wide uppercase">
                Approval Automation &amp; Compliance Monitoring
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#64748B]">
            <button onClick={() => scrollToSection('hero')} className="hover:text-[#3867F5] transition-colors cursor-pointer">
              Home
            </button>
            <button onClick={() => scrollToSection('capabilities')} className="hover:text-[#3867F5] transition-colors cursor-pointer">
              Platform Features
            </button>
            <button onClick={() => scrollToSection('workflow')} className="hover:text-[#3867F5] transition-colors cursor-pointer">
              Configurable Routes
            </button>
            <button onClick={() => scrollToSection('compliance')} className="hover:text-[#3867F5] transition-colors cursor-pointer">
              Compliance &amp; Reuse
            </button>
            <button onClick={() => scrollToSection('security')} className="hover:text-[#3867F5] transition-colors cursor-pointer">
              Security &amp; Oversight
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSignInModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-[#172033] hover:text-[#3867F5] bg-white hover:bg-slate-50 rounded-xl border border-[#E5EAF3] shadow-xs transition-colors cursor-pointer"
            >
              Select Role
            </button>
            <button
              onClick={() => setIsSignInModalOpen(true)}
              className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section id="hero" className="relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#3867F5] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#3867F5]" />
            <span>Problem Statement ID 26262 · Smart India / AICTE Regulatory Initiative</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#172033] tracking-tight leading-tight sm:leading-none">
            Intelligent Approval Workflows.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">
              Proactive Compliance.
            </span>{' '}
            Complete Accountability.
          </h1>

          <p className="text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto leading-relaxed">
            Centralized regulatory administration connecting technical institutions, scrutiny officers, regional administrators, and expert visit committees. Automates time-bound approvals, prevents redundant document re-verification, and alerts stakeholders before statutory deadlines elapse.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setIsSignInModalOpen(true)}
              className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Access Your Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => scrollToSection('capabilities')}
              className="px-6 py-3.5 bg-white hover:bg-slate-50 text-[#172033] hover:text-[#3867F5] text-sm font-semibold rounded-xl border border-[#E5EAF3] shadow-xs transition-all cursor-pointer"
            >
              Explore the Platform
            </button>
          </div>

          {/* Quick Highlight Pills */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-xl bg-white border border-[#E5EAF3] shadow-xs hover:border-blue-300 transition-all">
              <div className="w-8 h-8 rounded-lg gradient-icon-blue flex items-center justify-center mb-2 shadow-xs">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div className="text-xs font-bold text-[#172033]">SLA Enforcement</div>
              <div className="text-[11px] text-[#64748B]">14-day statutory limits</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E5EAF3] shadow-xs hover:border-teal-300 transition-all">
              <div className="w-8 h-8 rounded-lg gradient-icon-teal flex items-center justify-center mb-2 shadow-xs">
                <FolderArchive className="w-4 h-4 text-white" />
              </div>
              <div className="text-xs font-bold text-[#172033]">Document Reuse Vault</div>
              <div className="text-[11px] text-[#64748B]">Zero duplicate uploads</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E5EAF3] shadow-xs hover:border-indigo-300 transition-all">
              <div className="w-8 h-8 rounded-lg gradient-icon-indigo flex items-center justify-center mb-2 shadow-xs">
                <CalendarCheck className="w-4 h-4 text-white" />
              </div>
              <div className="text-xs font-bold text-[#172033]">EVC Coordination</div>
              <div className="text-[11px] text-[#64748B]">On-site visit scheduling</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E5EAF3] shadow-xs hover:border-violet-300 transition-all">
              <div className="w-8 h-8 rounded-lg gradient-icon-violet flex items-center justify-center mb-2 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <div className="text-xs font-bold text-[#172033]">Human Oversight</div>
              <div className="text-[11px] text-[#64748B]">Preserved statutory rules</div>
            </div>
          </div>
        </div>

        {/* Interactive Platform Visualization Mockup */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl p-1 bg-gradient-to-b from-blue-500/20 via-indigo-500/10 to-transparent border border-[#E5EAF3] shadow-sm overflow-hidden">
          <div className="bg-white rounded-xl p-5 sm:p-6 space-y-4">
            {/* Mock Header */}
            <div className="flex items-center justify-between border-b border-[#E5EAF3] pb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="text-[#64748B] font-mono text-[11px] ml-2">
                  aicte-sampark.gov.in/command-centre
                </span>
              </div>
              <span className="text-[10px] font-mono bg-blue-50 text-[#3867F5] px-2.5 py-0.5 rounded-full border border-blue-200 font-semibold">
                Live Simulation Roster
              </span>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="p-3.5 bg-[#F8FAFF] rounded-xl border border-[#E5EAF3]">
                <span className="text-[10px] uppercase font-bold text-[#64748B]">Active Applications</span>
                <div className="text-xl font-bold text-[#172033] font-mono mt-0.5">20 Cases</div>
                <span className="text-[10px] text-[#3867F5] font-medium">8 Regions mapped</span>
              </div>
              <div className="p-3.5 bg-[#F8FAFF] rounded-xl border border-[#E5EAF3]">
                <span className="text-[10px] uppercase font-bold text-[#64748B]">Under Scrutiny</span>
                <div className="text-xl font-bold text-indigo-600 font-mono mt-0.5">7 In Progress</div>
                <span className="text-[10px] text-[#64748B]">14-day SLA countdown</span>
              </div>
              <div className="p-3.5 bg-[#F8FAFF] rounded-xl border border-[#E5EAF3]">
                <span className="text-[10px] uppercase font-bold text-[#64748B]">EVC Visits</span>
                <div className="text-xl font-bold text-[#8B5CF6] font-mono mt-0.5">6 Mobilized</div>
                <span className="text-[10px] text-[#64748B]">3-member expert panels</span>
              </div>
              <div className="p-3.5 bg-[#F8FAFF] rounded-xl border border-[#E5EAF3]">
                <span className="text-[10px] uppercase font-bold text-[#64748B]">Reused Documents</span>
                <div className="text-xl font-bold text-[#10B981] font-mono mt-0.5">12 Vault Docs</div>
                <span className="text-[10px] text-emerald-600 font-medium">100% verified validity</span>
              </div>
            </div>

            {/* Simulated Case Row */}
            <div className="p-4 bg-[#F8FAFF] rounded-xl border border-[#E5EAF3] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl gradient-icon-blue text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#3867F5] text-xs">AICTE-DEMO-2026-001</span>
                    <span className="text-[10px] bg-white border border-[#E5EAF3] text-[#64748B] px-1.5 py-0.2 rounded font-mono">
                      Intake Variation
                    </span>
                  </div>
                  <p className="text-xs text-[#172033] font-semibold">Sunrise Institute of Technology, Pune</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-md">
                  Clarification Required: Fire NOC
                </span>
                <button
                  onClick={() => {
                    loginAsRole('INSTITUTION_ADMIN');
                  }}
                  className="px-3 py-1.5 bg-[#3867F5] hover:bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Inspect Case</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PLATFORM CAPABILITY CARDS */}
      <section id="capabilities" className="relative z-10 py-20 bg-white border-t border-b border-[#E5EAF3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase font-bold text-[#3867F5] tracking-wider">
              Comprehensive Regulatory System
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
              Eight Core Pillars of Approval Automation &amp; Governance
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Engineered according to the AICTE Approval Process Handbook (APH) rules to eliminate regulatory delays, prevent document forgery, and provide end-to-end transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1 */}
            <div className="p-5 rounded-2xl bg-white border border-[#E5EAF3] hover:border-blue-300 hover:shadow-xs transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl gradient-icon-blue text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                <GitBranch className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-[#172033]">Approval Workflow Automation</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Stage-wise automated progression with configurable routes: Fast-Track Scrutiny, EVC On-Site Inspection, and Regional Committee sign-offs.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-5 rounded-2xl bg-white border border-[#E5EAF3] hover:border-indigo-300 hover:shadow-xs transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl gradient-icon-indigo text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-[#172033]">Application Pendency Monitoring</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Granular aging buckets (0–7, 8–15, 16–30, and &gt;30 days) and automated calculation of SLA consumption across regional directorates.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-5 rounded-2xl bg-white border border-[#E5EAF3] hover:border-purple-300 hover:shadow-xs transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl gradient-icon-violet text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                <CalendarCheck className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-[#172033]">EVC Scheduling &amp; Tracking</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Mobilize 3-member inspection panels (Chairman, Subject Expert, Regional Nominee), track proposed and confirmed dates, and file digital deficiency reports.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-5 rounded-2xl bg-white border border-[#E5EAF3] hover:border-teal-300 hover:shadow-xs transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl gradient-icon-teal text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                <ClipboardCheck className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-[#172033]">Time-Bound Undertaking Management</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Mandatory tracking of Anti-Ragging committees, Internal Complaints Committee (ICC), student grievances, and faculty cadre compliance.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-5 rounded-2xl bg-white border border-[#E5EAF3] hover:border-emerald-300 hover:shadow-xs transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl gradient-icon-emerald text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                <FolderArchive className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-[#172033]">Compliance Reuse Profile (USP)</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Persistent digital vault storing perpetual land titles and multi-year building completion certificates, eliminating duplicate submissions.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-5 rounded-2xl bg-white border border-[#E5EAF3] hover:border-rose-300 hover:shadow-xs transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl gradient-icon-rose text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                <AlertOctagon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-[#172033]">Automated Alerts &amp; Escalations</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Configurable reminder intervals (T-7d, T-3d, T-1d) and tiered auto-escalations: Level 1 (Officer), Level 2 (Regional Head), Level 3 (Council).
              </p>
            </div>

            {/* Card 7 */}
            <div className="p-5 rounded-2xl bg-white border border-[#E5EAF3] hover:border-cyan-300 hover:shadow-xs transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl gradient-icon-sky text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-[#172033]">Analytics &amp; Immutable Audit Trail</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Ten statutory regulatory reports with live CSV downloads and a write-only cryptographic ledger tracking every submission and decision.
              </p>
            </div>

            {/* Card 8 */}
            <div className="p-5 rounded-2xl bg-white border border-[#E5EAF3] hover:border-violet-300 hover:shadow-xs transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl gradient-icon-violet text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-[#172033]">Secure Role-Based Access</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Eight distinct role architectures with granular permissions, preventing unauthorized actions or self-approval by applicants.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (6 Clear Stages) */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase font-bold text-[#3867F5] tracking-wider">
            Operational Lifecycle
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
            How Applications Flow Through AICTE SAMPARK
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B]">
            A transparent 6-stage administrative pipeline enforcing statutory compliance with human-in-the-loop accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-[#E5EAF3] shadow-xs space-y-2.5">
            <span className="text-xs font-mono font-bold text-[#3867F5] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">STAGE 01</span>
            <h4 className="text-sm font-bold text-[#172033]">1. Application Submission &amp; Reuse</h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Institution selects application type and links previously verified perpetual documents from its digital vault, avoiding re-upload delays.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E5EAF3] shadow-xs space-y-2.5">
            <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">STAGE 02</span>
            <h4 className="text-sm font-bold text-[#172033]">2. Scrutiny &amp; Verification</h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Scrutiny Officer verifies document metadata. If deficiencies exist, officer records mandatory reasons and returns the case with a 15-day window.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E5EAF3] shadow-xs space-y-2.5">
            <span className="text-xs font-mono font-bold text-[#8B5CF6] bg-violet-50 px-2 py-0.5 rounded border border-violet-200">STAGE 03</span>
            <h4 className="text-sm font-bold text-[#172033]">3. EVC &amp; Committee Processing</h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              For intake variations or new programs, an Expert Visit Committee is dispatched to inspect physical laboratories and compile digital findings.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E5EAF3] shadow-xs space-y-2.5">
            <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">STAGE 04</span>
            <h4 className="text-sm font-bold text-[#172033]">4. Authorised Statutory Decision</h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Senior Authorities (Member Secretary / Regional Directorate) record the official approval or rejection proceedings order with electronic sign-off.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E5EAF3] shadow-xs space-y-2.5">
            <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">STAGE 05</span>
            <h4 className="text-sm font-bold text-[#172033]">5. Post-Approval Compliance</h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Institutions track mandatory undertakings (Anti-Ragging Squad, ICC, Green Campus) and submit certified compliance evidence online.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E5EAF3] shadow-xs space-y-2.5">
            <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">STAGE 06</span>
            <h4 className="text-sm font-bold text-[#172033]">6. Proactive Deadline Escalations</h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Automated scheduler monitors SLA clocks. Overdue milestones trigger multi-tier notifications to officers, regional heads, and council leaders.
            </p>
          </div>
        </div>
      </section>

      {/* 5. WORKFLOW VISUALIZATION (Configurable Routes) */}
      <section id="workflow" className="relative z-10 py-20 bg-white border-t border-b border-[#E5EAF3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase font-bold text-[#3867F5] tracking-wider">
              Dynamic Regulatory Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
              Configurable Workflow Paths According to APH Norms
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Not every application requires the same stages. AICTE SAMPARK supports configurable routes tailored to the specific application category.
            </p>
          </div>

          {/* Route Switcher Buttons */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveWorkflowRoute('A')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeWorkflowRoute === 'A'
                  ? 'bg-[#3867F5] text-white shadow-xs'
                  : 'bg-white text-[#64748B] hover:text-[#172033] border border-[#E5EAF3]'
              }`}
            >
              Route A: Scrutiny Only (Fast-Track EoA)
            </button>
            <button
              onClick={() => setActiveWorkflowRoute('B')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeWorkflowRoute === 'B'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-[#64748B] hover:text-[#172033] border border-[#E5EAF3]'
              }`}
            >
              Route B: Scrutiny followed by EVC (Intake Expansion)
            </button>
            <button
              onClick={() => setActiveWorkflowRoute('C')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeWorkflowRoute === 'C'
                  ? 'bg-[#8B5CF6] text-white shadow-xs'
                  : 'bg-white text-[#64748B] hover:text-[#172033] border border-[#E5EAF3]'
              }`}
            >
              Route C: Scrutiny, EVC &amp; Council Committee
            </button>
          </div>

          {/* Visual Route Flow */}
          <div className="p-6 md:p-8 rounded-2xl bg-[#F8FAFF] border border-[#E5EAF3] max-w-5xl mx-auto shadow-xs">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="px-4 py-3 rounded-xl bg-white border border-[#E5EAF3] text-center min-w-[130px] shadow-xs">
                <span className="text-[10px] font-mono text-[#64748B] block">Step 1</span>
                <span className="text-xs font-bold text-[#172033]">Submission</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#64748B]" />

              <div className="px-4 py-3 rounded-xl bg-white border border-blue-200 text-center min-w-[130px] shadow-xs">
                <span className="text-[10px] font-mono text-[#3867F5] block">Step 2</span>
                <span className="text-xs font-bold text-[#3867F5]">Scrutiny</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#64748B]" />

              {activeWorkflowRoute !== 'A' && (
                <>
                  <div className="px-4 py-3 rounded-xl bg-white border border-violet-200 text-center min-w-[130px] shadow-xs">
                    <span className="text-[10px] font-mono text-[#8B5CF6] block">Step 3</span>
                    <span className="text-xs font-bold text-[#8B5CF6]">EVC On-Site</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#64748B]" />
                </>
              )}

              {activeWorkflowRoute === 'C' && (
                <>
                  <div className="px-4 py-3 rounded-xl bg-white border border-amber-200 text-center min-w-[130px] shadow-xs">
                    <span className="text-[10px] font-mono text-amber-600 block">Step 4</span>
                    <span className="text-xs font-bold text-amber-700">Committee</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#64748B]" />
                </>
              )}

              <div className="px-4 py-3 rounded-xl bg-white border border-emerald-200 text-center min-w-[130px] shadow-xs">
                <span className="text-[10px] font-mono text-emerald-600 block">Final Step</span>
                <span className="text-xs font-bold text-emerald-700">Council Order</span>
              </div>
            </div>

            <p className="text-center text-xs text-[#64748B] pt-6 border-t border-[#E5EAF3] mt-6 max-w-xl mx-auto leading-relaxed">
              {activeWorkflowRoute === 'A'
                ? 'Route A is reserved for routine Extension of Approval (EoA) and minor administrative changes without intake increase. EVC is omitted.'
                : activeWorkflowRoute === 'B'
                ? 'Route B requires Scrutiny verification followed by on-site physical inspection by an Expert Visit Committee before decision sign-off.'
                : 'Route C represents comprehensive scrutiny, physical inspection, and Regional Council committee evaluation for new institutions.'}
            </p>
          </div>
        </div>
      </section>

      {/* 6. COMPLIANCE & REUSE PROFILE SHOWCASE */}
      <section id="compliance" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-xs uppercase font-bold text-emerald-600 tracking-wider">
              Core Platform USP
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
              Compliance Reuse Profile: Lifetime Document Vault
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Every technical institution maintains an immutable digital compliance profile. Perpetual registered land lease deeds, municipal occupancy certificates, and certified master plans are permanently retained and auto-validated for new applications.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#172033]">Zero Duplicate Uploads</h4>
                  <p className="text-[11px] text-[#64748B]">
                    Eliminates annual resubmission of permanent documents. Only expiring certificates (e.g. Fire Safety NOC) require renewal.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#172033]">Automated Expiry Timelines</h4>
                  <p className="text-[11px] text-[#64748B]">
                    Visual countdown badges: Verified &amp; Reusable, Expiring Soon (&lt;30d), and Expired / Renewal Due.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#172033]">Full Cryptographic Audit History</h4>
                  <p className="text-[11px] text-[#64748B]">
                    Every reused document is explicitly stamped into the new application’s immutable audit trail.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Profile Vault Preview */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5EAF3] space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E5EAF3] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-icon-blue flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-bold text-[#172033]">Sunrise Institute of Technology</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold">
                Compliance: 92%
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 bg-[#F8FAFF] rounded-xl border border-[#E5EAF3] flex items-center justify-between text-xs">
                <div className="min-w-0 pr-2">
                  <div className="font-semibold text-[#172033] truncate">
                    Registered Perpetual Land Lease Deed (7.5 Acres)
                  </div>
                  <span className="text-[10px] text-[#64748B] font-mono">DOC-2026-001 · Valid for 50 yrs</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                  Verified &amp; Reusable
                </span>
              </div>

              <div className="p-3 bg-[#F8FAFF] rounded-xl border border-[#E5EAF3] flex items-center justify-between text-xs">
                <div className="min-w-0 pr-2">
                  <div className="font-semibold text-[#172033] truncate">
                    Occupancy &amp; Building Completion Certificate (BCC)
                  </div>
                  <span className="text-[10px] text-[#64748B] font-mono">DOC-2026-002 · PMC Certified</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                  Verified &amp; Reusable
                </span>
              </div>

              <div className="p-3 bg-[#F8FAFF] rounded-xl border border-[#E5EAF3] flex items-center justify-between text-xs">
                <div className="min-w-0 pr-2">
                  <div className="font-semibold text-[#172033] truncate">
                    Fire &amp; Emergency Services Clearance Certificate
                  </div>
                  <span className="text-[10px] text-[#EF4444] font-mono">DOC-2026-004 · Expired 13-Jan-2026</span>
                </div>
                <span className="text-[10px] font-bold text-[#EF4444] bg-rose-50 px-2 py-0.5 rounded border border-rose-200 shrink-0">
                  Renewal Due
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SECURITY & ACCOUNTABILITY SECTION */}
      <section id="security" className="relative z-10 py-20 bg-white border-t border-b border-[#E5EAF3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase font-bold text-[#8B5CF6] tracking-wider">
              Governance Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
              Preserving Human Oversight with Strict Authorization
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              AICTE SAMPARK is built around regulatory safeguards: AI models explain, summarize, and flag potential anomalies, but statutory approvals remain the exclusive prerogative of authorized officials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#E5EAF3] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl gradient-icon-violet text-white flex items-center justify-center shadow-xs">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-[#172033]">No Autonomous AI Decisions</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Neither approval nor rejection is ever decided autonomously by an AI model. All administrative actions require human official authorization.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E5EAF3] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl gradient-icon-blue text-white flex items-center justify-center shadow-xs">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-[#172033]">Cryptographic Audit Trail</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Immutable, append-only ledger tracking all submissions, observations, returns, document reuses, and committee reports with correlation IDs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E5EAF3] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl gradient-icon-teal text-white flex items-center justify-center shadow-xs">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-[#172033]">Read-Only Monitoring Officer</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Dedicated independent auditor role providing total auditability, exportable governance reports, and inspection timeline verification without data mutation powers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E5EAF3] text-xs text-[#64748B]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded gradient-icon-blue flex items-center justify-center font-bold text-white text-xs">
                स
              </div>
              <span className="font-bold text-[#172033] text-sm">AICTE SAMPARK</span>
            </div>
            <p className="text-xs text-[#64748B] max-w-md leading-relaxed">
              Integrated AICTE Approval Workflow Automation, Compliance Monitoring and Alert Management System. Developed for Problem Statement ID 26262.
            </p>
            <div className="text-[11px] text-amber-800 font-medium bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg inline-block">
              Notice: This web platform is an engineering demonstration prototype developed for evaluation purposes.
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[#172033] uppercase text-[10px] tracking-wider mb-3">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs text-[#64748B]">
              <li>
                <button onClick={() => setIsSignInModalOpen(true)} className="hover:text-[#3867F5] transition-colors cursor-pointer">
                  Role-Based Login
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('workflow')} className="hover:text-[#3867F5] transition-colors cursor-pointer">
                  Approval Workflow Engine
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('compliance')} className="hover:text-[#3867F5] transition-colors cursor-pointer">
                  Compliance Reuse Profile
                </button>
              </li>
              <li>
                <button onClick={() => setIsSignInModalOpen(true)} className="hover:text-[#3867F5] transition-colors cursor-pointer">
                  Expert Visit Committee (EVC)
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#172033] uppercase text-[10px] tracking-wider mb-3">
              Governance &amp; Policy
            </h4>
            <ul className="space-y-2 text-xs text-[#64748B]">
              <li>AICTE Approval Process Handbook (APH 2026-27)</li>
              <li>Statutory Human Oversight Directives</li>
              <li>National Higher Education Quality Framework</li>
              <li>Privacy &amp; Controlled Access Model</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[#E5EAF3] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#64748B] text-[11px]">
          <div>
            © 2026 AICTE SAMPARK Prototype. All rights reserved. Problem Statement ID 26262.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                loginAsRole('INSTITUTION_ADMIN');
              }}
              className="hover:text-[#3867F5] transition-colors cursor-pointer"
            >
              Enter Institutional Demo
            </button>
            <span>·</span>
            <button
              onClick={() => {
                loginAsRole('SUPER_ADMIN');
              }}
              className="hover:text-[#3867F5] transition-colors cursor-pointer"
            >
              Super Admin Console
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

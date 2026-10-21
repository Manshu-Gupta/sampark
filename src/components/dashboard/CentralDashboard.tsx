import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Search,
  Clock,
  AlertTriangle,
  Building2,
  CalendarCheck,
  FileCheck2,
  ArrowUpRight,
  TrendingUp,
  Filter,
  CheckCircle,
  AlertOctagon,
  Users,
  ShieldAlert,
  ShieldCheck,
  BarChart3,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { InstitutionDashboard } from './roles/InstitutionDashboard';
import { ScrutinyDashboard } from './roles/ScrutinyDashboard';
import { RegionalDashboard } from './roles/RegionalDashboard';
import { EVCCoordinatorDashboard } from './roles/EVCCoordinatorDashboard';
import { ComplianceOfficerDashboard } from './roles/ComplianceOfficerDashboard';
import { BureauAuthorityDashboard } from './roles/BureauAuthorityDashboard';
import { AuditorDashboard } from './roles/AuditorDashboard';
import { SuperAdminDashboard } from './roles/SuperAdminDashboard';

export const CentralDashboard: React.FC = () => {
  const {
    applications,
    documents,
    complianceObligations,
    notifications,
    currentUser,
    setActiveTab,
    setSelectedApplicationId,
    setApplicationFilter,
    currentSimulatedDate,
  } = useApp();

  // Toggle between Role-Tailored Dashboard and Consolidated Command Overview
  const [dashboardMode, setDashboardMode] = useState<'ROLE_VIEW' | 'CONSOLIDATED'>('ROLE_VIEW');

  // Dashboard Filters
  const [regionFilter, setRegionFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL'); // ALL, PENDING, OVERDUE

  const renderRoleDashboard = () => {
    switch (currentUser.role) {
      case 'INSTITUTION_ADMIN':
        return <InstitutionDashboard />;
      case 'SCRUTINY_OFFICER':
        return <ScrutinyDashboard />;
      case 'REGIONAL_ADMIN':
        return <RegionalDashboard />;
      case 'EVC_COORDINATOR':
        return <EVCCoordinatorDashboard />;
      case 'COMPLIANCE_OFFICER':
        return <ComplianceOfficerDashboard />;
      case 'BUREAU_OFFICER':
      case 'SENIOR_AUTHORITY':
        return <BureauAuthorityDashboard />;
      case 'AUDITOR':
        return <AuditorDashboard />;
      case 'SUPER_ADMIN':
        return <SuperAdminDashboard />;
      default:
        return <InstitutionDashboard />;
    }
  };

  // Filtered applications list
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      // Role scope filter
      if (currentUser.role === 'INSTITUTION_ADMIN' && currentUser.institutionId) {
        if (app.institutionId !== currentUser.institutionId) return false;
      }
      if (regionFilter !== 'ALL' && app.region !== regionFilter) return false;
      if (typeFilter !== 'ALL' && app.type !== typeFilter) return false;
      if (stageFilter !== 'ALL' && app.currentStage !== stageFilter) return false;
      if (statusFilter === 'OVERDUE') {
        return app.daysInCurrentStage > app.stageSlaDays;
      }
      if (statusFilter === 'PENDING') {
        return !['APPROVED', 'REJECTED', 'WITHDRAWN'].includes(app.currentStage);
      }
      return true;
    });
  }, [applications, currentUser, regionFilter, typeFilter, stageFilter, statusFilter]);

  // Summary Metrics
  const totalAppsCount = filteredApps.length;
  const underScrutinyCount = filteredApps.filter(
    (a) => a.currentStage === 'SCRUTINY' || a.currentStage === 'RE_SCRUTINY'
  ).length;
  const awaitingClarificationCount = filteredApps.filter(
    (a) => a.currentStage === 'CLARIFICATION_REQUIRED'
  ).length;
  const awaitingEVCCount = filteredApps.filter(
    (a) => a.currentStage === 'EVC_PENDING' || a.currentStage === 'EVC_SCHEDULED'
  ).length;
  const committeeStageCount = filteredApps.filter(
    (a) => a.currentStage === 'COMMITTEE_PROCESSING' || a.currentStage === 'DECISION_PENDING'
  ).length;
  const complianceDueSoonCount = complianceObligations.filter(
    (c) => c.status === 'DUE_SOON' || c.status === 'OVERDUE'
  ).length;
  const expiringDocsCount = documents.filter(
    (d) => d.verificationStatus === 'EXPIRING_SOON' || d.verificationStatus === 'EXPIRED'
  ).length;
  const overdueAppsCount = filteredApps.filter(
    (a) => a.daysInCurrentStage > a.stageSlaDays && !['APPROVED', 'REJECTED', 'WITHDRAWN'].includes(a.currentStage)
  ).length;
  const escalatedCount = notifications.filter((n) => n.escalationLevel > 0).length;

  // Navigation Helper when clicking summary card
  const navigateToFilteredApps = (filterType: string, filterVal: string) => {
    if (filterType === 'stage') {
      setApplicationFilter({ stage: filterVal });
    } else if (filterType === 'quickStatus') {
      setApplicationFilter({ quickStatus: filterVal });
    }
    setActiveTab('applications');
  };

  // Stage Breakdown Chart Data
  const stageChartData = useMemo(() => {
    const stageCounts: Record<string, number> = {
      Submitted: 0,
      'Under Scrutiny': 0,
      Clarification: 0,
      'EVC Queue': 0,
      Committee: 0,
      Approved: 0,
      Rejected: 0,
    };

    filteredApps.forEach((a) => {
      if (a.currentStage === 'SUBMITTED' || a.currentStage === 'PRELIMINARY_CHECK') {
        stageCounts['Submitted']++;
      } else if (a.currentStage === 'SCRUTINY' || a.currentStage === 'RE_SCRUTINY') {
        stageCounts['Under Scrutiny']++;
      } else if (a.currentStage === 'CLARIFICATION_REQUIRED') {
        stageCounts['Clarification']++;
      } else if (
        a.currentStage === 'EVC_PENDING' ||
        a.currentStage === 'EVC_SCHEDULED' ||
        a.currentStage === 'EVC_COMPLETED'
      ) {
        stageCounts['EVC Queue']++;
      } else if (
        a.currentStage === 'COMMITTEE_PROCESSING' ||
        a.currentStage === 'FURTHER_VERIFICATION' ||
        a.currentStage === 'DECISION_PENDING'
      ) {
        stageCounts['Committee']++;
      } else if (a.currentStage === 'APPROVED') {
        stageCounts['Approved']++;
      } else if (a.currentStage === 'REJECTED') {
        stageCounts['Rejected']++;
      }
    });

    return Object.entries(stageCounts).map(([name, count]) => ({ name, count }));
  }, [filteredApps]);

  // Region Pendency Chart Data
  const regionChartData = useMemo(() => {
    const regions: Record<string, { pending: number; overdue: number }> = {
      WESTERN: { pending: 0, overdue: 0 },
      NORTHERN: { pending: 0, overdue: 0 },
      SOUTHERN: { pending: 0, overdue: 0 },
      EASTERN: { pending: 0, overdue: 0 },
      CENTRAL: { pending: 0, overdue: 0 },
      NORTH_WESTERN: { pending: 0, overdue: 0 },
    };

    filteredApps.forEach((a) => {
      if (!['APPROVED', 'REJECTED', 'WITHDRAWN'].includes(a.currentStage)) {
        const reg = a.region || 'WESTERN';
        if (regions[reg]) {
          regions[reg].pending++;
          if (a.daysInCurrentStage > a.stageSlaDays) {
            regions[reg].overdue++;
          }
        }
      }
    });

    return Object.entries(regions).map(([name, val]) => ({
      region: name.replace('_', ' '),
      Pending: val.pending,
      Overdue: val.overdue,
    }));
  }, [filteredApps]);

  // Workload Distribution
  const workloadData = useMemo(() => {
    const officers: Record<string, number> = {};
    filteredApps.forEach((a) => {
      if (!['APPROVED', 'REJECTED', 'WITHDRAWN'].includes(a.currentStage)) {
        const name = a.assignedOfficerName || 'Unassigned';
        officers[name] = (officers[name] || 0) + 1;
      }
    });
    return Object.entries(officers).map(([name, cases]) => ({
      name: name.split(' ')[0] + ' ' + (name.split(' ')[1]?.[0] || ''),
      cases,
    }));
  }, [filteredApps]);

  // SLA Trend Data (Synthesized consistent historical curve)
  const slaTrendData = [
    { week: 'W1 Sep', onTimePercent: 94, avgDays: 9 },
    { week: 'W2 Sep', onTimePercent: 91, avgDays: 10 },
    { week: 'W3 Sep', onTimePercent: 88, avgDays: 11 },
    { week: 'W4 Sep', onTimePercent: 86, avgDays: 12 },
    { week: 'W1 Oct', onTimePercent: 83, avgDays: 13 },
    { week: 'W2 Oct', onTimePercent: 85, avgDays: 12 },
    { week: 'W3 Oct (Current)', onTimePercent: 82, avgDays: 14 },
  ];

  // Priority Cases
  const priorityCases = useMemo(() => {
    return [...filteredApps]
      .filter((a) => !['APPROVED', 'REJECTED', 'WITHDRAWN'].includes(a.currentStage))
      .sort((a, b) => {
        // Priority weight
        const prioWeight = { URGENT: 3, HIGH: 2, NORMAL: 1 };
        const diff = prioWeight[b.priority] - prioWeight[a.priority];
        if (diff !== 0) return diff;
        return b.daysInCurrentStage - a.daysInCurrentStage;
      })
      .slice(0, 5);
  }, [filteredApps]);

  // Colors for charts
  const STAGE_COLORS = ['#3B82F6', '#6366F1', '#F59E0B', '#10B981', '#8B5CF6', '#059669', '#EF4444'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* View Switcher: Dedicated Role Workspace vs Consolidated Command */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-[#E5EAF3] shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDashboardMode('ROLE_VIEW')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              dashboardMode === 'ROLE_VIEW'
                ? 'bg-[#3867F5] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#172033] hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Dedicated Role Workspace</span>
          </button>
          <button
            onClick={() => setDashboardMode('CONSOLIDATED')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              dashboardMode === 'CONSOLIDATED'
                ? 'bg-[#3867F5] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#172033] hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Consolidated National Command</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#64748B] hidden md:inline">Active Persona:</span>
          <span className="font-semibold text-[#172033] bg-[#F8FAFF] border border-[#E5EAF3] px-2.5 py-1 rounded-lg text-[11px]">
            {currentUser.name} ({currentUser.role.replace(/_/g, ' ')})
          </span>
        </div>
      </div>

      {dashboardMode === 'ROLE_VIEW' ? (
        renderRoleDashboard()
      ) : (
        <>
          {/* Page Header and Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E5EAF3]">
            <div>
              <h2 className="text-xl font-bold text-[#172033] tracking-tight">
                AICTE Regulatory Command Centre
              </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Real-time approval workflow velocity, compliance monitoring, and SLA tracking · Academic Year 2026-27
          </p>
        </div>

        {/* Global Dashboard Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white border border-[#E5EAF3] rounded-lg px-2.5 py-1.5 text-xs shadow-xs">
            <Filter className="w-3.5 h-3.5 text-[#64748B]" />
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="bg-transparent border-none text-[#172033] font-medium focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Regions</option>
              <option value="WESTERN">Western Region</option>
              <option value="NORTHERN">Northern Region</option>
              <option value="SOUTHERN">Southern Region</option>
              <option value="EASTERN">Eastern Region</option>
              <option value="CENTRAL">Central Region</option>
              <option value="NORTH_WESTERN">North-Western</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-[#E5EAF3] rounded-lg px-2.5 py-1.5 text-xs shadow-xs">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent border-none text-[#172033] font-medium focus:outline-none cursor-pointer"
            >
              <option value="ALL">All App Types</option>
              <option value="EXTENSION_OF_APPROVAL">EoA</option>
              <option value="INTAKE_VARIATION">Intake Variation</option>
              <option value="NEW_PROGRAM">New Program</option>
              <option value="CHANGE_OF_SITE">Change of Site</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-[#E5EAF3] rounded-lg px-2.5 py-1.5 text-xs shadow-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none text-[#172033] font-medium focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Cases</option>
              <option value="PENDING">Active Pending</option>
              <option value="OVERDUE">Overdue SLA Cases</option>
            </select>
          </div>
        </div>
      </div>

      {/* 9 Section-Mandated Summary Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Total Applications */}
        <div
          onClick={() => navigateToFilteredApps('quickStatus', 'ALL')}
          className="bg-white p-4 rounded-xl border border-[#E5EAF3] hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#64748B] mb-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">Total Applications</span>
            <div className="w-8 h-8 rounded-lg gradient-icon-blue flex items-center justify-center shadow-xs">
              <FileText className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#172033] font-mono tabular-nums">{totalAppsCount}</div>
          <p className="text-[10px] text-[#64748B] mt-1.5 flex items-center justify-between">
            <span>AY 2026-27</span>
            <span className="text-[#3867F5] font-semibold group-hover:underline">View all →</span>
          </p>
        </div>

        {/* Card 2: Applications Under Scrutiny */}
        <div
          onClick={() => navigateToFilteredApps('stage', 'SCRUTINY')}
          className="bg-white p-4 rounded-xl border border-[#E5EAF3] hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#64748B] mb-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">Under Scrutiny</span>
            <div className="w-8 h-8 rounded-lg gradient-icon-indigo flex items-center justify-center shadow-xs">
              <Search className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-indigo-600 font-mono tabular-nums">{underScrutinyCount}</div>
          <p className="text-[10px] text-[#64748B] mt-1.5 flex items-center justify-between">
            <span>Primary verification</span>
            <span className="text-indigo-600 font-semibold group-hover:underline">Filter →</span>
          </p>
        </div>

        {/* Card 3: Awaiting Clarification */}
        <div
          onClick={() => navigateToFilteredApps('stage', 'CLARIFICATION_REQUIRED')}
          className="bg-white p-4 rounded-xl border border-[#E5EAF3] hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#64748B] mb-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">Clarification Req.</span>
            <div className="w-8 h-8 rounded-lg gradient-icon-orange flex items-center justify-center shadow-xs">
              <Clock className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 font-mono tabular-nums">{awaitingClarificationCount}</div>
          <p className="text-[10px] text-[#64748B] mt-1.5 flex items-center justify-between">
            <span>Deficiency returned</span>
            <span className="text-amber-600 font-semibold group-hover:underline">Filter →</span>
          </p>
        </div>

        {/* Card 4: Awaiting EVC */}
        <div
          onClick={() => navigateToFilteredApps('stage', 'EVC_PENDING')}
          className="bg-white p-4 rounded-xl border border-[#E5EAF3] hover:border-emerald-400 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#64748B] mb-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">Awaiting EVC</span>
            <div className="w-8 h-8 rounded-lg gradient-icon-emerald flex items-center justify-center shadow-xs">
              <CalendarCheck className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 font-mono tabular-nums">{awaitingEVCCount}</div>
          <p className="text-[10px] text-[#64748B] mt-1.5 flex items-center justify-between">
            <span>Expert visit roster</span>
            <span className="text-emerald-600 font-semibold group-hover:underline">Manage →</span>
          </p>
        </div>

        {/* Card 5: Committee Stage */}
        <div
          onClick={() => navigateToFilteredApps('stage', 'COMMITTEE_PROCESSING')}
          className="bg-white p-4 rounded-xl border border-[#E5EAF3] hover:border-purple-400 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#64748B] mb-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">Committee Stage</span>
            <div className="w-8 h-8 rounded-lg gradient-icon-violet flex items-center justify-center shadow-xs">
              <Building2 className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#8B5CF6] font-mono tabular-nums">{committeeStageCount}</div>
          <p className="text-[10px] text-[#64748B] mt-1.5 flex items-center justify-between">
            <span>Regional / Council</span>
            <span className="text-[#8B5CF6] font-semibold group-hover:underline">Filter →</span>
          </p>
        </div>

        {/* Card 6: Compliance Actions Due Soon */}
        <div
          onClick={() => setActiveTab('compliance')}
          className="bg-white p-4 rounded-xl border border-[#E5EAF3] hover:border-teal-400 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#64748B] mb-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">Compliance Due Soon</span>
            <div className="w-8 h-8 rounded-lg gradient-icon-teal flex items-center justify-center shadow-xs">
              <FileCheck2 className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#172033] font-mono tabular-nums">{complianceDueSoonCount}</div>
          <p className="text-[10px] text-[#64748B] mt-1.5 flex items-center justify-between">
            <span>Statutory undertakings</span>
            <span className="text-teal-600 font-semibold group-hover:underline">Monitor →</span>
          </p>
        </div>

        {/* Card 7: Expiring Documents */}
        <div
          onClick={() => setActiveTab('documents')}
          className="bg-white p-4 rounded-xl border border-[#E5EAF3] hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#64748B] mb-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">Expiring Documents</span>
            <div className="w-8 h-8 rounded-lg gradient-icon-orange flex items-center justify-center shadow-xs">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 font-mono tabular-nums">{expiringDocsCount}</div>
          <p className="text-[10px] text-[#64748B] mt-1.5 flex items-center justify-between">
            <span>Validity &lt; 30d</span>
            <span className="text-amber-600 font-semibold group-hover:underline">Vault →</span>
          </p>
        </div>

        {/* Card 8: Overdue Applications */}
        <div
          onClick={() => navigateToFilteredApps('quickStatus', 'OVERDUE')}
          className="bg-white p-4 rounded-xl border border-rose-200/80 hover:border-rose-400 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#64748B] mb-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-600">Overdue Cases</span>
            <div className="w-8 h-8 rounded-lg gradient-icon-rose flex items-center justify-center shadow-xs">
              <AlertOctagon className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#EF4444] font-mono tabular-nums">{overdueAppsCount}</div>
          <p className="text-[10px] text-rose-500 mt-1.5 flex items-center justify-between">
            <span>SLA breached</span>
            <span className="text-rose-600 font-bold group-hover:underline">Inspect →</span>
          </p>
        </div>

        {/* Card 9: Escalated Cases */}
        <div
          onClick={() => setActiveTab('alerts')}
          className="bg-white p-4 rounded-xl border border-[#E5EAF3] hover:border-rose-400 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#64748B] mb-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">Escalated Cases</span>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-xs text-white">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#172033] font-mono tabular-nums">{escalatedCount}</div>
          <p className="text-[10px] text-[#64748B] mt-1.5 flex items-center justify-between">
            <span>L1 / L2 Escalations</span>
            <span className="text-[#3867F5] font-semibold group-hover:underline">Review →</span>
          </p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Stage-Wise Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-[#E5EAF3] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#172033]">Stage-Wise Application Pipeline</h3>
              <p className="text-xs text-[#64748B]">Distribution across active approval stages</p>
            </div>
            <span className="text-xs font-mono text-[#3867F5] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">Live Roster</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5EAF3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    color: '#172033',
                    fontSize: '12px',
                    border: '1px solid #E5EAF3',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stageChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={STAGE_COLORS[index % STAGE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Region-Wise Pendency vs Overdue */}
        <div className="bg-white p-5 rounded-xl border border-[#E5EAF3] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#172033]">Regional Pendency & SLA Breaches</h3>
              <p className="text-xs text-[#64748B]">Active vs overdue cases across regional directorates</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-blue-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Active
              </span>
              <span className="flex items-center gap-1.5 text-rose-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] inline-block" /> Overdue
              </span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5EAF3" />
                <XAxis dataKey="region" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    color: '#172033',
                    fontSize: '12px',
                    border: '1px solid #E5EAF3',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}
                />
                <Bar dataKey="Pending" fill="#3867F5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Overdue" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: SLA Turnaround Trend */}
        <div className="bg-white p-5 rounded-xl border border-[#E5EAF3] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#172033]">SLA Adherence Velocity Trend</h3>
              <p className="text-xs text-[#64748B]">Weekly % cases processed within prescribed timelines</p>
            </div>
            <span className="text-xs font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Goal: &gt; 90%</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={slaTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5EAF3" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: '#64748B' }} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    color: '#172033',
                    fontSize: '12px',
                    border: '1px solid #E5EAF3',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="onTimePercent"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#10B981' }}
                  name="On-Time %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Officer Workload Distribution */}
        <div className="bg-white p-5 rounded-xl border border-[#E5EAF3] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#172033]">Workload Distribution by Assigned Official</h3>
              <p className="text-xs text-[#64748B]">Active caseload allocated per scrutiny officer</p>
            </div>
            <span className="text-xs text-[#64748B] font-medium">Capacity Index</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5EAF3" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    color: '#172033',
                    fontSize: '12px',
                    border: '1px solid #E5EAF3',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}
                />
                <Bar dataKey="cases" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Priority Cases Interactive Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600 inline-block animate-pulse" />
              Priority Cases Requiring Immediate Administrative Action
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked by statutory urgency, SLA consumption, and recorded deficiency severity
            </p>
          </div>
          <button
            onClick={() => setActiveTab('applications')}
            className="text-xs text-blue-600 font-medium hover:underline self-start sm:self-auto"
          >
            View all {applications.length} applications →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
              <tr>
                <th className="px-4 py-3">Application ID</th>
                <th className="px-4 py-3">Technical Institution</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Current Stage</th>
                <th className="px-4 py-3">Assigned Official</th>
                <th className="px-4 py-3 text-right">Days in Stage</th>
                <th className="px-4 py-3">Deadline</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {priorityCases.map((app) => {
                const isOverdue = app.daysInCurrentStage > app.stageSlaDays;
                return (
                  <tr
                    key={app.id}
                    onClick={() => {
                      setSelectedApplicationId(app.id);
                      setActiveTab('application_detail');
                    }}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-bold text-blue-700">
                      {app.id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{app.institutionName}</div>
                      <div className="text-[11px] text-slate-400">{app.region} Region</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {app.type.replace(/_/g, ' ')}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                        {app.currentStage.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {app.assignedOfficerName}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums font-semibold">
                      <span className={isOverdue ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                        {app.daysInCurrentStage}d / {app.stageSlaDays}d
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600 tabular-nums">
                      {app.stageDeadline}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          app.priority === 'URGENT'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : app.priority === 'HIGH'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {app.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedApplicationId(app.id);
                          setActiveTab('application_detail');
                        }}
                        className="px-2.5 py-1 text-xs bg-white hover:bg-slate-100 text-blue-700 border border-blue-200 font-medium rounded-md transition-colors"
                      >
                        Open Case
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Split Section: Recent Activity & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Activity */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Recent Statutory Activity Feed</h3>
            <button
              onClick={() => setActiveTab('audit')}
              className="text-xs text-blue-600 hover:underline"
            >
              Full Audit Trail →
            </button>
          </div>
          <div className="space-y-3.5">
            {applications
              .flatMap((a) => a.timelineEvents)
              .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))
              .slice(0, 4)
              .map((event) => (
                <div key={event.id} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800">{event.actionTaken}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{event.reasonOrObservation}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span>{event.responsibleUserName}</span>
                      <span>·</span>
                      <span className="font-mono">{event.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Upcoming Statutory Deadlines */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Critical Upcoming Deadlines</h3>
            <span className="text-xs text-slate-400 font-mono">APH Timetable</span>
          </div>
          <div className="space-y-3">
            {complianceObligations
              .filter((c) => c.status === 'DUE_SOON' || c.status === 'OVERDUE')
              .slice(0, 4)
              .map((comp) => {
                const isOverdue = comp.status === 'OVERDUE';
                return (
                  <div
                    key={comp.id}
                    onClick={() => setActiveTab('compliance')}
                    className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {comp.requirementDescription}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{comp.institutionName}</p>
                      <span className="text-[10px] text-slate-400">{comp.sourceRuleRef}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isOverdue
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {isOverdue ? 'Overdue' : 'Due Soon'}
                      </span>
                      <p className="text-[11px] font-mono font-medium text-slate-700 mt-1">
                        {comp.dueDate}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

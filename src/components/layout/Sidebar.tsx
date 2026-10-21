import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  LayoutDashboard,
  FileText,
  GitBranch,
  CalendarCheck,
  Building2,
  ClipboardCheck,
  FolderArchive,
  AlertOctagon,
  Bot,
  FileSearch,
  BarChart3,
  History,
  Settings,
  Sparkles,
  ShieldCheck,
  Compass,
  Globe,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles: UserRole[];
  badge?: string;
  isAi?: boolean;
}

export const Sidebar: React.FC = () => {
  const { currentUser, activeTab, setActiveTab, unreadNotificationCount, setSelectedApplicationId, setCurrentView } = useApp();

  const allRoles: UserRole[] = [
    'INSTITUTION_ADMIN',
    'SCRUTINY_OFFICER',
    'REGIONAL_ADMIN',
    'EVC_COORDINATOR',
    'COMPLIANCE_OFFICER',
    'BUREAU_OFFICER',
    'SENIOR_AUTHORITY',
    'AUDITOR',
    'SUPER_ADMIN',
  ];

  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      allowedRoles: allRoles,
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: FileText,
      allowedRoles: allRoles,
    },
    {
      id: 'workflow',
      label: 'Workflow Engine',
      icon: GitBranch,
      allowedRoles: ['SCRUTINY_OFFICER', 'REGIONAL_ADMIN', 'BUREAU_OFFICER', 'SENIOR_AUTHORITY', 'AUDITOR', 'SUPER_ADMIN'],
    },
    {
      id: 'evc',
      label: 'EVC Management',
      icon: CalendarCheck,
      allowedRoles: ['EVC_COORDINATOR', 'REGIONAL_ADMIN', 'BUREAU_OFFICER', 'SENIOR_AUTHORITY', 'AUDITOR', 'SUPER_ADMIN'],
    },
    {
      id: 'institutions',
      label: 'Institutions',
      icon: Building2,
      allowedRoles: ['REGIONAL_ADMIN', 'BUREAU_OFFICER', 'SENIOR_AUTHORITY', 'INSTITUTION_ADMIN', 'COMPLIANCE_OFFICER', 'AUDITOR', 'SUPER_ADMIN'],
    },
    {
      id: 'compliance',
      label: 'Compliance Monitoring',
      icon: ClipboardCheck,
      allowedRoles: ['INSTITUTION_ADMIN', 'SCRUTINY_OFFICER', 'REGIONAL_ADMIN', 'COMPLIANCE_OFFICER', 'BUREAU_OFFICER', 'SENIOR_AUTHORITY', 'AUDITOR', 'SUPER_ADMIN'],
    },
    {
      id: 'documents',
      label: 'Compliance Reuse Profile',
      icon: FolderArchive,
      badge: 'USP',
      allowedRoles: ['INSTITUTION_ADMIN', 'SCRUTINY_OFFICER', 'REGIONAL_ADMIN', 'COMPLIANCE_OFFICER', 'BUREAU_OFFICER', 'SENIOR_AUTHORITY', 'AUDITOR', 'SUPER_ADMIN'],
    },
    {
      id: 'alerts',
      label: 'Alerts & Escalations',
      icon: AlertOctagon,
      badge: unreadNotificationCount > 0 ? String(unreadNotificationCount) : undefined,
      allowedRoles: allRoles,
    },
    {
      id: 'copilot',
      label: 'Compliance Copilot',
      icon: Bot,
      isAi: true,
      allowedRoles: allRoles,
    },
    {
      id: 'anomaly',
      label: 'Document Anomaly AI',
      icon: FileSearch,
      isAi: true,
      allowedRoles: ['SCRUTINY_OFFICER', 'REGIONAL_ADMIN', 'COMPLIANCE_OFFICER', 'BUREAU_OFFICER', 'SENIOR_AUTHORITY', 'AUDITOR', 'SUPER_ADMIN'],
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
      allowedRoles: ['REGIONAL_ADMIN', 'BUREAU_OFFICER', 'SENIOR_AUTHORITY', 'EVC_COORDINATOR', 'COMPLIANCE_OFFICER', 'AUDITOR', 'SUPER_ADMIN'],
    },
    {
      id: 'audit',
      label: 'Statutory Audit Trail',
      icon: History,
      allowedRoles: ['SCRUTINY_OFFICER', 'REGIONAL_ADMIN', 'EVC_COORDINATOR', 'COMPLIANCE_OFFICER', 'BUREAU_OFFICER', 'SENIOR_AUTHORITY', 'AUDITOR', 'SUPER_ADMIN'],
    },
    {
      id: 'demo_guide',
      label: 'Demo Scenario Guide',
      icon: Compass,
      badge: 'Scenario',
      allowedRoles: allRoles,
    },
    {
      id: 'settings',
      label: 'Settings & Config',
      icon: Settings,
      allowedRoles: allRoles,
    },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.allowedRoles.includes(currentUser.role)
  );

  const itemGradients: Record<string, string> = {
    overview: 'from-blue-600 to-cyan-500',
    applications: 'from-indigo-600 to-blue-500',
    workflow: 'from-purple-600 to-indigo-500',
    evc: 'from-violet-600 to-pink-500',
    institutions: 'from-blue-600 to-teal-500',
    compliance: 'from-emerald-600 to-teal-500',
    documents: 'from-cyan-600 to-emerald-500',
    alerts: 'from-amber-500 to-orange-500',
    copilot: 'from-purple-600 to-fuchsia-500',
    anomaly: 'from-pink-600 to-purple-500',
    reports: 'from-blue-600 to-violet-500',
    audit: 'from-sky-600 to-indigo-600',
    demo_guide: 'from-amber-500 to-rose-500',
    settings: 'from-slate-600 to-blue-600',
  };

  return (
    <aside className="w-64 bg-white text-[#172033] flex flex-col shrink-0 min-h-screen border-r border-[#E5EAF3] shadow-xs">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#E5EAF3] flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center font-black text-white text-base shadow-sm shadow-blue-500/25">
          स
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-[#172033] text-sm tracking-tight">AICTE SAMPARK</span>
          </div>
          <p className="text-[10px] text-[#64748B] font-semibold tracking-wide uppercase">
            Approval & Compliance System
          </p>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Main Navigation
        </div>
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (activeTab === 'application_detail' && item.id === 'applications');
          const gradient = itemGradients[item.id] || 'from-blue-600 to-cyan-500';

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'applications') {
                  setSelectedApplicationId(null);
                }
                setActiveTab(item.id);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all group ${
                isActive
                  ? 'bg-blue-50/90 text-[#3867F5] font-bold shadow-2xs border-l-3 border-[#3867F5]'
                  : 'text-slate-700 hover:text-[#172033] hover:bg-slate-50/80 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <div
                  className={`w-7 h-7 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white shrink-0 shadow-2xs transition-transform group-hover:scale-105`}
                >
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    item.badge === 'USP'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : item.badge === 'Scenario'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* User Persona Profile Footer */}
      <div className="p-3 border-t border-[#E5EAF3] bg-[#F8FAFF]">
        <div className="p-2.5 rounded-xl bg-white border border-[#E5EAF3] shadow-2xs">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
              <ShieldCheck className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Active Persona
            </span>
          </div>
          <p className="text-xs font-bold text-[#172033] truncate">{currentUser.name}</p>
          <p className="text-[10px] text-slate-500 truncate">{currentUser.designation}</p>
          {currentUser.department && (
            <p className="text-[10px] text-slate-400 truncate mt-0.5">{currentUser.department}</p>
          )}
        </div>

        <button
          onClick={() => setCurrentView('LANDING')}
          className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white hover:bg-blue-50 text-slate-700 hover:text-[#3867F5] rounded-lg text-[11px] font-semibold border border-[#E5EAF3] hover:border-blue-200 shadow-2xs transition-all"
        >
          <Globe className="w-3.5 h-3.5 text-blue-600" />
          <span>Exit to Public Portal</span>
        </button>
      </div>
    </aside>
  );
};

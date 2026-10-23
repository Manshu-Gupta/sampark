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
  X,
  FileEdit,
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
  const {
    currentUser,
    activeTab,
    setActiveTab,
    unreadNotificationCount,
    setSelectedApplicationId,
    setCurrentView,
    isSidebarOpen,
    closeSidebar,
    openNewApplicationModal,
  } = useApp();

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

  const itemStyles: Record<string, { bg: string; iconColor: string }> = {
    overview: { bg: 'bg-blue-50/90 text-blue-700 border-blue-200/60', iconColor: 'text-blue-700' },
    applications: { bg: 'bg-indigo-50/90 text-indigo-700 border-indigo-200/60', iconColor: 'text-indigo-700' },
    workflow: { bg: 'bg-purple-50/90 text-purple-700 border-purple-200/60', iconColor: 'text-purple-700' },
    evc: { bg: 'bg-violet-50/90 text-violet-700 border-violet-200/60', iconColor: 'text-violet-700' },
    institutions: { bg: 'bg-teal-50/90 text-teal-700 border-teal-200/60', iconColor: 'text-teal-700' },
    compliance: { bg: 'bg-emerald-50/90 text-emerald-700 border-emerald-200/60', iconColor: 'text-emerald-700' },
    documents: { bg: 'bg-cyan-50/90 text-cyan-800 border-cyan-200/60', iconColor: 'text-cyan-800' },
    alerts: { bg: 'bg-amber-50/90 text-amber-800 border-amber-200/60', iconColor: 'text-amber-800' },
    copilot: { bg: 'bg-indigo-50/90 text-indigo-700 border-indigo-200/60', iconColor: 'text-indigo-700' },
    anomaly: { bg: 'bg-rose-50/90 text-rose-700 border-rose-200/60', iconColor: 'text-rose-700' },
    reports: { bg: 'bg-sky-50/90 text-sky-700 border-sky-200/60', iconColor: 'text-sky-700' },
    audit: { bg: 'bg-slate-100 text-slate-700 border-slate-200', iconColor: 'text-slate-700' },
    demo_guide: { bg: 'bg-amber-50/90 text-amber-700 border-amber-200/60', iconColor: 'text-amber-700' },
    settings: { bg: 'bg-slate-100 text-slate-600 border-slate-200', iconColor: 'text-slate-600' },
  };

  return (
    <>
      {/* Subtle Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-slate-900/25 backdrop-blur-[2px] transition-opacity duration-300 animate-in fade-in cursor-pointer"
          aria-hidden="true"
        />
      )}

      {/* Sliding Collapsible Sidebar Drawer (Hidden by default, slides in smoothly when opened) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-white text-[#172033] flex flex-col h-full border-r border-[#E5EAF3] shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Main Navigation Drawer"
      >
        {/* Brand Header & Close Button */}
        <div className="p-4 sm:p-5 border-b border-[#E5EAF3] flex items-center justify-between bg-gradient-to-r from-blue-50/40 via-slate-50/30 to-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-base shadow-xs">
              स
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[#172033] text-sm tracking-tight">AICTE SAMPARK</span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase">
                Approval &amp; Compliance System
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeSidebar}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close navigation sidebar"
            title="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Institution Administrator: Shortcut to New Approval Application */}
        {currentUser.role === 'INSTITUTION_ADMIN' && (
          <div className="px-3 pt-3">
            <button
              type="button"
              onClick={() => {
                closeSidebar();
                openNewApplicationModal();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                <FileEdit className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="truncate">New Approval Application</span>
            </button>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="flex-1 py-3 px-3 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Main Navigation
          </div>
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeTab === item.id ||
              (activeTab === 'application_detail' && item.id === 'applications');
            const styling = itemStyles[item.id] || {
              bg: 'bg-blue-50/90 text-blue-700 border-blue-200/60',
              iconColor: 'text-blue-700',
            };

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  closeSidebar();
                  if (item.id === 'applications') {
                    setSelectedApplicationId(null);
                  }
                  setActiveTab(item.id);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-blue-50/90 text-blue-700 font-bold shadow-2xs border-l-3 border-blue-600'
                    : 'text-slate-700 hover:text-[#172033] hover:bg-slate-50 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-105 ${styling.bg}`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${styling.iconColor}`} />
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
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
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
              <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                <ShieldCheck className="w-2.5 h-2.5 text-blue-700" />
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
            type="button"
            onClick={() => {
              closeSidebar();
              setCurrentView('LANDING');
            }}
            className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-700 rounded-lg text-[11px] font-semibold border border-[#E5EAF3] hover:border-blue-200 shadow-2xs transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Exit to Public Portal</span>
          </button>
        </div>
      </aside>
    </>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  Shield,
  UserCheck,
  RotateCcw,
  FastForward,
  AlertTriangle,
  Globe,
  LogOut,
  KeyRound,
  Menu,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    switchRole,
    users,
    currentSimulatedDate,
    advanceSimulatedDays,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    activeTab,
    setActiveTab,
    setSelectedApplicationId,
    resetDemoData,
    setCurrentView,
    setIsSignInModalOpen,
    logout,
    isSidebarOpen,
    toggleSidebar,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Central Executive Command Dashboard';
      case 'applications':
        return 'Approval Applications Registry';
      case 'application_detail':
        return 'Application Case Management';
      case 'workflow':
        return 'Approval Workflow Route Configuration';
      case 'evc':
        return 'Expert Visit Committee (EVC) Operations';
      case 'institutions':
        return 'Technical Institution Profiles';
      case 'compliance':
        return 'Undertaking & Compliance Monitoring';
      case 'documents':
        return 'Compliance Reuse Profile & Document Vault';
      case 'alerts':
        return 'Alerts, Deadlines & Escalation Centre';
      case 'copilot':
        return 'AICTE Compliance Copilot (AI Assistant)';
      case 'anomaly':
        return 'Multimodal Document Anomaly Detection';
      case 'reports':
        return 'Reports & Processing Analytics';
      case 'audit':
        return 'Statutory Audit Trail & Accountability';
      case 'settings':
        return 'System Preferences & Demonstration Mode';
      default:
        return 'Portal';
    }
  };

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'INSTITUTION_ADMIN':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'SCRUTINY_OFFICER':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'REGIONAL_ADMIN':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'EVC_COORDINATOR':
        return 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200';
      case 'COMPLIANCE_OFFICER':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'BUREAU_OFFICER':
      case 'SENIOR_AUTHORITY':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'AUDITOR':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'SUPER_ADMIN':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const roleLabels: Record<UserRole, string> = {
    INSTITUTION_ADMIN: 'Institution Administrator',
    SCRUTINY_OFFICER: 'Scrutiny Officer',
    REGIONAL_ADMIN: 'Regional Administrator',
    EVC_COORDINATOR: 'EVC Coordinator',
    COMPLIANCE_OFFICER: 'Compliance Officer',
    BUREAU_OFFICER: 'Bureau Officer',
    SENIOR_AUTHORITY: 'Senior Authority',
    AUDITOR: 'Statutory Auditor',
    SUPER_ADMIN: 'Super Administrator',
  };

  return (
    <header className="h-16 bg-white/95 backdrop-blur-xs border-b border-[#E5EAF3] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 select-none shadow-2xs">
      {/* Zone 1: Hamburger Menu, Breadcrumb and title */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={toggleSidebar}
          className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
            isSidebarOpen
              ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-2xs'
              : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-700 border-[#E5EAF3] shadow-2xs hover:border-blue-200'
          }`}
          aria-label={isSidebarOpen ? 'Close navigation sidebar' : 'Open navigation sidebar'}
          title={isSidebarOpen ? 'Close navigation sidebar' : 'Open navigation sidebar'}
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-blue-700 font-bold tracking-wide uppercase shrink-0">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          AICTE SAMPARK
        </div>
        <span className="hidden sm:inline text-slate-300">/</span>
        <h1 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight truncate max-w-[200px] sm:max-w-xs md:max-w-md">
          {getBreadcrumbTitle()}
        </h1>
      </div>

      {/* Zone 2: Time Simulation & Status */}
      <div className="hidden lg:flex items-center gap-3 bg-[#F8FAFF] border border-[#E5EAF3] px-3.5 py-1.5 rounded-xl text-xs shadow-2xs">
        <div className="flex items-center gap-1.5 text-[#172033] font-semibold">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-mono tabular-nums text-slate-700">
            {currentSimulatedDate.toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
        <span className="text-slate-300">|</span>
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <span>Clock:</span>
          <button
            onClick={() => advanceSimulatedDays(7)}
            className="px-2 py-0.5 bg-white border border-[#E5EAF3] rounded-md text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all flex items-center gap-1 font-bold shadow-2xs"
            title="Advance simulated clock by 7 days to test SLA aging"
          >
            <FastForward className="w-3 h-3 text-blue-600" />
            +7d
          </button>
          <button
            onClick={() => advanceSimulatedDays(15)}
            className="px-2 py-0.5 bg-white border border-[#E5EAF3] rounded-md text-slate-700 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-all flex items-center gap-1 font-bold shadow-2xs"
            title="Advance simulated clock by 15 days to trigger overdue alerts"
          >
            <FastForward className="w-3 h-3 text-amber-600" />
            +15d
          </button>
        </div>
      </div>

      {/* Zone 3: Role Switcher & Notifications */}
      <div className="flex items-center gap-2.5">
        {/* Public Portal Button */}
        <button
          onClick={() => setCurrentView('LANDING')}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg transition-all shadow-2xs"
          title="Return to Public Landing Page"
        >
          <Globe className="w-3.5 h-3.5 text-blue-600" />
          <span>Public Portal</span>
        </button>

        {/* Reset Demo Quick Button */}
        <button
          onClick={resetDemoData}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          title="Reset Demo Data to Initial State"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-colors"
            title="Notifications & Escalation Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-600 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900">Notifications & Alerts</span>
                  {unreadNotificationCount > 0 && (
                    <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded-full">
                      {unreadNotificationCount} unread
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No active notifications
                  </div>
                ) : (
                  notifications.slice(0, 6).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationAsRead(notif.id);
                        if (notif.relatedEntityType === 'APPLICATION') {
                          setSelectedApplicationId(notif.relatedEntityId);
                          setActiveTab('application_detail');
                          setShowNotifications(false);
                        } else if (notif.relatedEntityType === 'EVC') {
                          setActiveTab('evc');
                          setShowNotifications(false);
                        }
                      }}
                      className={`p-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                        !notif.isRead ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {notif.severity === 'CRITICAL' ? (
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        ) : notif.severity === 'WARNING' ? (
                          <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 leading-tight">
                            {notif.title}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                            {notif.createdAt}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 text-center">
                <button
                  onClick={() => {
                    setActiveTab('alerts');
                    setShowNotifications(false);
                  }}
                  className="text-xs font-medium text-slate-700 hover:text-slate-900"
                >
                  View All Escalations & Notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Role Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleSelector(!showRoleSelector)}
            className="flex items-center gap-2.5 px-3 py-1.5 bg-[#F8FAFF] hover:bg-blue-50/60 border border-[#E5EAF3] hover:border-blue-200 rounded-xl text-left transition-all shadow-2xs"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-[#172033] flex items-center gap-1.5 leading-none">
                {currentUser.name}
              </div>
              <span
                className={`text-[10px] font-bold border px-1.5 py-0.2 rounded-md mt-1 inline-block ${getRoleBadgeStyle(
                  currentUser.role
                )}`}
              >
                {roleLabels[currentUser.role]}
              </span>
            </div>
          </button>

          {showRoleSelector && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                  Switch Demonstration Persona
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Simulate different AICTE approval roles
                </p>
              </div>
              <div className="p-1 space-y-1">
                {users.map((u) => {
                  const isActive = u.role === currentUser.role;
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchRole(u.role);
                        setShowRoleSelector(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-start gap-2.5 ${
                        isActive ? 'bg-blue-50/70 border border-blue-200' : 'hover:bg-slate-50'
                      }`}
                    >
                      <UserCheck
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          isActive ? 'text-blue-600' : 'text-slate-400'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-900 flex items-center justify-between">
                          <span>{roleLabels[u.role]}</span>
                          {isActive && (
                            <span className="text-[10px] text-blue-700 font-bold">Active</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 truncate">{u.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{u.department}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-2 border-t border-slate-100 bg-slate-50 space-y-1">
                <button
                  onClick={() => {
                    setIsSignInModalOpen(true);
                    setShowRoleSelector(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded text-xs font-semibold text-blue-700 hover:bg-blue-100/60 transition-colors flex items-center gap-2"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Choose from 8 Role Cards</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setShowRoleSelector(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out to Landing Page</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

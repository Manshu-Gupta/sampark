import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { CentralDashboard } from './components/dashboard/CentralDashboard';
import { ApplicationList } from './components/applications/ApplicationList';
import { ApplicationDetail } from './components/applications/ApplicationDetail';
import { WorkflowManagement } from './components/workflow/WorkflowManagement';
import { EVCManagement } from './components/evc/EVCManagement';
import { InstitutionProfiles } from './components/institutions/InstitutionProfiles';
import { ComplianceMonitoring } from './components/compliance/ComplianceMonitoring';
import { ComplianceReuseProfile } from './components/institutions/ComplianceReuseProfile';
import { AlertsCenter } from './components/alerts/AlertsCenter';
import { ComplianceCopilot } from './components/ai/ComplianceCopilot';
import { DocumentAnomalyDetector } from './components/ai/DocumentAnomalyDetector';
import { ReportsView } from './components/reports/ReportsView';
import { AuditTrailView } from './components/audit/AuditTrailView';
import { DemoScenarioGuide } from './components/demo/DemoScenarioGuide';
import { SettingsView } from './components/settings/SettingsView';
import { LandingPage } from './components/landing/LandingPage';
import { RoleSelectionModal } from './components/auth/RoleSelectionModal';
import { CollegeApprovalFormModal } from './components/applications/CollegeApprovalFormModal';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <CentralDashboard />;
      case 'applications':
        return <ApplicationList />;
      case 'application_detail':
        return <ApplicationDetail />;
      case 'workflow':
        return <WorkflowManagement />;
      case 'evc':
        return <EVCManagement />;
      case 'institutions':
        return <InstitutionProfiles />;
      case 'compliance':
        return <ComplianceMonitoring />;
      case 'documents':
        return <ComplianceReuseProfile />;
      case 'alerts':
        return <AlertsCenter />;
      case 'copilot':
        return <ComplianceCopilot />;
      case 'anomaly':
        return <DocumentAnomalyDetector />;
      case 'reports':
        return <ReportsView />;
      case 'audit':
        return <AuditTrailView />;
      case 'demo_guide':
        return <DemoScenarioGuide />;
      case 'settings':
        return <SettingsView />;
      default:
        return <CentralDashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFF] font-sans text-[#172033] antialiased overflow-hidden relative">
      {/* Collapsible Sidebar Drawer (Hidden by default, slides out on menu click) */}
      <Sidebar />

      {/* Main Content Area - Full Available Viewport */}
      <div className="flex-1 w-full flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar with Hamburger Icon */}
        <Navbar />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <>
      {currentView === 'LANDING' ? <LandingPage /> : <MainLayout />}
      <RoleSelectionModal />
      <CollegeApprovalFormModal />
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

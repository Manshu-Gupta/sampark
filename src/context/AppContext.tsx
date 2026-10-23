import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  User,
  UserRole,
  Institution,
  Application,
  DocumentRecord,
  ComplianceObligation,
  EVCRecord,
  NotificationRecord,
  AuditEvent,
  ApprovalStage,
  ApplicationType,
  ApplicationRoute,
  WorkflowDefinition,
  CollegeApprovalFormData,
  CollegeApprovalPayment,
} from '../types';
import {
  DEMO_USERS,
  DEMO_INSTITUTIONS,
  DEMO_APPLICATIONS,
  DEMO_DOCUMENTS,
  DEMO_COMPLIANCE_OBLIGATIONS,
  DEMO_EVC_RECORDS,
  DEMO_NOTIFICATIONS,
  DEMO_AUDIT_EVENTS,
  WORKFLOW_DEFINITIONS,
} from '../data/mockData';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  users: User[];

  // Entities
  institutions: Institution[];
  applications: Application[];
  documents: DocumentRecord[];
  complianceObligations: ComplianceObligation[];
  evcRecords: EVCRecord[];
  notifications: NotificationRecord[];
  auditEvents: AuditEvent[];
  workflowDefinitions: Record<string, WorkflowDefinition>;

  // Simulation & time travel
  simulatedDaysOffset: number;
  advanceSimulatedDays: (days: number) => void;
  currentSimulatedDate: Date;

  // Navigation & Filtering
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedApplicationId: string | null;
  setSelectedApplicationId: (id: string | null) => void;
  applicationFilter: {
    stage?: string;
    region?: string;
    type?: string;
    priority?: string;
    search?: string;
    quickStatus?: string;
  };
  setApplicationFilter: React.Dispatch<
    React.SetStateAction<{
      stage?: string;
      region?: string;
      type?: string;
      priority?: string;
      search?: string;
      quickStatus?: string;
    }>
  >;

  // Public Landing vs Authenticated Portal
  currentView: 'LANDING' | 'AUTH_PORTAL';
  setCurrentView: (view: 'LANDING' | 'AUTH_PORTAL') => void;
  isSignInModalOpen: boolean;
  setIsSignInModalOpen: (open: boolean) => void;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;

  // Collapsible Sidebar State
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  closeSidebar: () => void;

  // New College Approval Form & Cross-Dashboard Workflow
  isNewAppModalOpen: boolean;
  setIsNewAppModalOpen: (open: boolean) => void;
  editingDraftAppId: string | null;
  setEditingDraftAppId: (id: string | null) => void;
  openNewApplicationModal: (draftId?: string) => void;
  closeNewApplicationModal: () => void;
  saveApplicationDraft: (formData: CollegeApprovalFormData, existingId?: string) => Application;
  submitCollegeApprovalApplication: (
    formData: CollegeApprovalFormData,
    payment: CollegeApprovalPayment,
    existingDraftId?: string
  ) => Application;
  forwardApplicationWithRemarks: (
    applicationId: string,
    newStage: ApprovalStage,
    remarks: string,
    notes?: string
  ) => boolean;

  // Core Workflow Operations
  submitNewApplication: (data: {
    institutionId: string;
    type: ApplicationType;
    route: ApplicationRoute;
    academicYear: string;
    attachedDocumentIds: string[];
    reusedDocumentIds: string[];
    notes?: string;
  }) => Application;

  advanceApplicationStage: (
    applicationId: string,
    newStage: ApprovalStage,
    reason: string,
    notes?: string
  ) => boolean;

  recordScrutinyDeficiency: (
    applicationId: string,
    category: 'INFRASTRUCTURE' | 'DOCUMENTATION' | 'FACULTY_CADRE' | 'FINANCIAL' | 'STATUTORY_NOC',
    severity: 'CRITICAL_DEFICIENCY' | 'MINOR_DEFICIENCY' | 'OBSERVATION',
    remarks: string
  ) => void;

  returnForClarification: (applicationId: string, reason: string) => void;

  respondToClarification: (
    applicationId: string,
    responseNotes: string,
    attachedDocIds?: string[]
  ) => void;

  recordFinalDecision: (
    applicationId: string,
    outcome: 'APPROVED' | 'REJECTED',
    remarks: string
  ) => void;

  // Document Operations
  reuseDocument: (documentId: string, applicationId: string) => boolean;
  uploadRenewedDocument: (
    documentId: string,
    newExpiryDate: string,
    newDocName: string,
    fileSize: string
  ) => void;
  verifyDocument: (documentId: string, isApproved: boolean, notes: string) => void;

  // Compliance Operations
  submitComplianceEvidence: (
    obligationId: string,
    notes: string,
    fileRef?: string
  ) => void;
  verifyCompliance: (
    obligationId: string,
    status: 'VERIFIED' | 'CLARIFICATION_REQUIRED',
    remarks: string
  ) => void;

  // EVC Operations
  scheduleEVCVisit: (
    evcId: string,
    proposedDate: string,
    confirmedDate?: string,
    notes?: string
  ) => void;
  recordEVCCompletion: (
    evcId: string,
    reportSummary: string,
    deficiencyCount: number
  ) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  acknowledgeNotification: (id: string) => void;
  unreadNotificationCount: number;

  // Reset
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'aicte_sampark_';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load or initialize state
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}user`);
    return saved ? JSON.parse(saved) : DEMO_USERS[0]; // Dr. Sharma (Institution Admin) by default
  });

  const [institutions, setInstitutions] = useState<Institution[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}institutions`);
    return saved ? JSON.parse(saved) : DEMO_INSTITUTIONS;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}applications`);
    return saved ? JSON.parse(saved) : DEMO_APPLICATIONS;
  });

  const [documents, setDocuments] = useState<DocumentRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}documents`);
    return saved ? JSON.parse(saved) : DEMO_DOCUMENTS;
  });

  const [complianceObligations, setComplianceObligations] = useState<ComplianceObligation[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}compliance`);
    return saved ? JSON.parse(saved) : DEMO_COMPLIANCE_OBLIGATIONS;
  });

  const [evcRecords, setEvcRecords] = useState<EVCRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}evc`);
    return saved ? JSON.parse(saved) : DEMO_EVC_RECORDS;
  });

  const [notifications, setNotifications] = useState<NotificationRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}notifications`);
    return saved ? JSON.parse(saved) : DEMO_NOTIFICATIONS;
  });

  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}audit`);
    return saved ? JSON.parse(saved) : DEMO_AUDIT_EVENTS;
  });

  const [workflowDefinitions] = useState(WORKFLOW_DEFINITIONS);

  const [simulatedDaysOffset, setSimulatedDaysOffset] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'LANDING' | 'AUTH_PORTAL'>('LANDING');
  const [isSignInModalOpen, setIsSignInModalOpen] = useState<boolean>(false);
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState<boolean>(false);
  const [editingDraftAppId, setEditingDraftAppId] = useState<string | null>(null);

  // Collapsible Sidebar (Hidden by default as per requirement)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  const openNewApplicationModal = (draftId?: string) => {
    setEditingDraftAppId(draftId || null);
    setIsNewAppModalOpen(true);
  };

  const closeNewApplicationModal = () => {
    setIsNewAppModalOpen(false);
    setEditingDraftAppId(null);
  };

  const [applicationFilter, setApplicationFilter] = useState<{
    stage?: string;
    region?: string;
    type?: string;
    priority?: string;
    search?: string;
    quickStatus?: string;
  }>({});

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}user`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}institutions`, JSON.stringify(institutions));
  }, [institutions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}applications`, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}documents`, JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}compliance`, JSON.stringify(complianceObligations));
  }, [complianceObligations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}evc`, JSON.stringify(evcRecords));
  }, [evcRecords]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}audit`, JSON.stringify(auditEvents));
  }, [auditEvents]);

  // Current simulated date
  const currentSimulatedDate = useMemo(() => {
    const base = new Date('2026-10-21T09:42:00');
    base.setDate(base.getDate() + simulatedDaysOffset);
    return base;
  }, [simulatedDaysOffset]);

  const advanceSimulatedDays = (days: number) => {
    const nextOffset = simulatedDaysOffset + days;
    setSimulatedDaysOffset(nextOffset);

    // Dynamic SLA calculation and alert triggering
    const updatedApps = applications.map((app) => {
      if (['APPROVED', 'REJECTED', 'WITHDRAWN'].includes(app.currentStage)) {
        return app;
      }
      const newDaysInStage = app.daysInCurrentStage + days;
      const isOverdue = newDaysInStage > app.stageSlaDays;
      const consumedRatio = newDaysInStage / app.stageSlaDays;

      let delayRisk: 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK' = 'LOW_RISK';
      const factors: string[] = [];

      if (isOverdue) {
        delayRisk = 'HIGH_RISK';
        factors.push(`Stage SLA breached by ${newDaysInStage - app.stageSlaDays} days`);
      } else if (consumedRatio >= 0.75) {
        delayRisk = 'MEDIUM_RISK';
        factors.push(`Stage SLA consumed ${Math.round(consumedRatio * 100)}%`);
      }

      return {
        ...app,
        daysInCurrentStage: newDaysInStage,
        delayRisk,
        delayRiskFactors: factors,
      };
    });

    setApplications(updatedApps);

    // Append simulated alert if days advanced
    if (days > 0) {
      const newNotif: NotificationRecord = {
        id: `NOTIF-SIM-${Date.now()}`,
        recipientRole: currentUser.role,
        relatedEntityId: 'SIMULATION',
        relatedEntityType: 'APPLICATION',
        category: 'SLA_DEADLINE',
        severity: 'WARNING',
        title: `Time-Travel Simulation: +${days} Days Advanced`,
        message: `System simulated advance to ${currentSimulatedDate.toLocaleDateString()}. Application SLAs, aging metrics, and reminders updated dynamically.`,
        createdAt: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
        isRead: false,
        isAcknowledged: false,
        escalationLevel: 0,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const switchRole = (role: UserRole) => {
    const targetUser = DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[0];
    setCurrentUser(targetUser);
  };

  const loginAsRole = (role: UserRole) => {
    const targetUser = DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[0];
    setCurrentUser(targetUser);
    setCurrentView('AUTH_PORTAL');
    setIsSignInModalOpen(false);
    setActiveTab('overview');
    setSelectedApplicationId(null);
  };

  const logout = () => {
    setCurrentView('LANDING');
    setIsSignInModalOpen(false);
  };

  const logAuditEvent = (
    action: string,
    entityType: 'APPLICATION' | 'DOCUMENT' | 'COMPLIANCE' | 'EVC' | 'WORKFLOW' | 'SYSTEM',
    entityId: string,
    previousValue: string | undefined,
    newValue: string | undefined,
    reasonNotes: string
  ) => {
    const newEvent: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 19),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      entityType,
      entityId,
      previousValue,
      newValue,
      reasonNotes,
      correlationId: `CORR-${Math.floor(100000 + Math.random() * 900000)}`,
    };
    setAuditEvents((prev) => [newEvent, ...prev]);
  };

  // Submit new application
  const submitNewApplication = (data: {
    institutionId: string;
    type: ApplicationType;
    route: ApplicationRoute;
    academicYear: string;
    attachedDocumentIds: string[];
    reusedDocumentIds: string[];
    notes?: string;
  }): Application => {
    const inst = institutions.find((i) => i.id === data.institutionId);
    const instName = inst ? inst.name : 'Unknown Technical Institution';
    const newId = `AICTE-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newApp: Application = {
      id: newId,
      institutionId: data.institutionId,
      institutionName: instName,
      type: data.type,
      academicYear: data.academicYear,
      route: data.route,
      currentStage: 'SUBMITTED',
      submissionDate: currentSimulatedDate.toISOString().substring(0, 10),
      stageDeadline: new Date(currentSimulatedDate.getTime() + 14 * 86400000).toISOString().substring(0, 10),
      daysInCurrentStage: 0,
      stageSlaDays: 14,
      assignedOfficerId: 'USR-SCRUT-002',
      assignedOfficerName: 'P. V. Ramanathan',
      region: inst ? inst.region : 'WESTERN',
      priority: 'NORMAL',
      delayRisk: 'LOW_RISK',
      delayRiskFactors: [],
      attachedDocumentIds: data.attachedDocumentIds,
      reusedDocumentIds: data.reusedDocumentIds,
      scrutinyObservations: [],
      clarificationHistory: [],
      timelineEvents: [
        {
          id: `TLE-${Date.now()}`,
          timestamp: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
          previousStage: 'DRAFT',
          newStage: 'SUBMITTED',
          responsibleUserId: currentUser.id,
          responsibleUserName: currentUser.name,
          responsibleRole: currentUser.role,
          actionTaken: 'Application Submitted Online',
          reasonOrObservation: data.notes || 'Formal submission under Approval Process Handbook 2026-27.',
          relevantDocumentRefs: data.reusedDocumentIds,
        },
      ],
    };

    setApplications((prev) => [newApp, ...prev]);

    logAuditEvent(
      'APPLICATION_SUBMITTED',
      'APPLICATION',
      newId,
      'DRAFT',
      'SUBMITTED',
      `Application submitted for ${data.type} with ${data.reusedDocumentIds.length} reused documents.`
    );

    // Notify Scrutiny Officers
    const notif: NotificationRecord = {
      id: `NOTIF-${Date.now()}`,
      recipientRole: 'SCRUTINY_OFFICER',
      relatedEntityId: newId,
      relatedEntityType: 'APPLICATION',
      category: 'SLA_DEADLINE',
      severity: 'INFO',
      title: `New Application Submitted: ${instName}`,
      message: `Application ${newId} submitted for ${data.type.replace(/_/g, ' ')}. Preliminary completeness check pending.`,
      createdAt: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
      deadline: newApp.stageDeadline,
      isRead: false,
      isAcknowledged: false,
      escalationLevel: 0,
    };
    setNotifications((prev) => [notif, ...prev]);

    return newApp;
  };

  // Save Application Draft
  const saveApplicationDraft = (formData: CollegeApprovalFormData, existingId?: string): Application => {
    const inst = institutions.find((i) => i.id === currentUser.institutionId) || institutions[0];
    const targetId = existingId || `DRAFT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    let appType: ApplicationType = 'INTAKE_VARIATION';
    let route: ApplicationRoute = 'SCRUTINY_EVC';
    const cat = formData.feeBreakdown?.applicationCategory || '';
    if (cat.includes('Extension of Approval')) {
      appType = 'EXTENSION_OF_APPROVAL';
      route = 'SCRUTINY_ONLY';
    } else if (cat.includes('New Program')) {
      appType = 'NEW_PROGRAM';
      route = 'SCRUTINY_EVC';
    } else if (cat.includes('New Institution')) {
      appType = 'NEW_INSTITUTION';
      route = 'SCRUTINY_EVC_COMMITTEE';
    } else if (cat.includes('Change of Site')) {
      appType = 'CHANGE_OF_SITE';
      route = 'SCRUTINY_EVC_COMMITTEE';
    }

    const draftApp: Application = {
      id: targetId,
      institutionId: inst.id,
      institutionName: inst.name,
      permanentId: formData.permanentId || inst.code,
      type: appType,
      academicYear: '2026-2027',
      route,
      currentStage: 'DRAFT',
      submissionDate: currentSimulatedDate.toISOString().substring(0, 10),
      stageDeadline: new Date(currentSimulatedDate.getTime() + 30 * 86400000).toISOString().substring(0, 10),
      daysInCurrentStage: 0,
      stageSlaDays: 30,
      assignedOfficerId: 'USR-SCRUT-002',
      assignedOfficerName: 'P. V. Ramanathan',
      region: inst.region,
      priority: 'NORMAL',
      delayRisk: 'LOW_RISK',
      delayRiskFactors: [],
      attachedDocumentIds: [],
      reusedDocumentIds: [],
      scrutinyObservations: [],
      clarificationHistory: [],
      timelineEvents: [
        {
          id: `TLE-${Date.now()}`,
          timestamp: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
          previousStage: 'DRAFT',
          newStage: 'DRAFT',
          responsibleUserId: currentUser.id,
          responsibleUserName: currentUser.name,
          responsibleRole: currentUser.role,
          actionTaken: 'Draft Application Saved',
          reasonOrObservation: 'Draft saved by Institution Administrator. Can be resumed and edited anytime.',
        },
      ],
      paymentStatus: formData.paymentDetails?.paymentStatus === 'PAID' ? 'PAID' : 'PENDING',
      paymentReference: formData.paymentDetails?.transactionId,
      feeAmount: formData.feeBreakdown?.totalPayable,
      formData: {
        ...formData,
        isDraft: true,
        lastSavedAt: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
      },
    };

    setApplications((prev) => {
      const exists = prev.some((a) => a.id === targetId);
      if (exists) {
        return prev.map((a) => (a.id === targetId ? draftApp : a));
      }
      return [draftApp, ...prev];
    });

    logAuditEvent(
      'DRAFT_SAVED',
      'APPLICATION',
      targetId,
      'NONE',
      'DRAFT',
      `Draft approval application saved for ${inst.name}.`
    );

    return draftApp;
  };

  // Submit College Approval Application
  const submitCollegeApprovalApplication = (
    formData: CollegeApprovalFormData,
    payment: CollegeApprovalPayment,
    existingDraftId?: string
  ): Application => {
    const inst = institutions.find((i) => i.id === currentUser.institutionId) || institutions[0];
    const officialId =
      existingDraftId && !existingDraftId.startsWith('DRAFT-')
        ? existingDraftId
        : `AICTE-APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    let appType: ApplicationType = 'INTAKE_VARIATION';
    let route: ApplicationRoute = 'SCRUTINY_EVC';
    const cat = formData.feeBreakdown?.applicationCategory || '';
    if (cat.includes('Extension of Approval')) {
      appType = 'EXTENSION_OF_APPROVAL';
      route = 'SCRUTINY_ONLY';
    } else if (cat.includes('New Program')) {
      appType = 'NEW_PROGRAM';
      route = 'SCRUTINY_EVC';
    } else if (cat.includes('New Institution')) {
      appType = 'NEW_INSTITUTION';
      route = 'SCRUTINY_EVC_COMMITTEE';
    } else if (cat.includes('Change of Site')) {
      appType = 'CHANGE_OF_SITE';
      route = 'SCRUTINY_EVC_COMMITTEE';
    }

    const instDocs = documents.filter((d) => d.institutionId === inst.id);
    const reusedDocIds = instDocs.filter((d) => d.verificationStatus === 'VERIFIED').map((d) => d.id);
    const attachedDocIds = instDocs.map((d) => d.id);

    const submittedApp: Application = {
      id: officialId,
      institutionId: inst.id,
      institutionName: inst.name,
      permanentId: formData.permanentId || inst.code,
      type: appType,
      academicYear: '2026-2027',
      route,
      currentStage: 'SUBMITTED', // UI displays as "Submitted – Pending Scrutiny"
      submissionDate: currentSimulatedDate.toISOString().substring(0, 10),
      stageDeadline: new Date(currentSimulatedDate.getTime() + 14 * 86400000).toISOString().substring(0, 10),
      daysInCurrentStage: 0,
      stageSlaDays: 14,
      assignedOfficerId: 'USR-SCRUT-002',
      assignedOfficerName: 'P. V. Ramanathan',
      region: inst.region,
      priority: 'NORMAL',
      delayRisk: 'LOW_RISK',
      delayRiskFactors: [],
      attachedDocumentIds: attachedDocIds,
      reusedDocumentIds: reusedDocIds,
      scrutinyObservations: [],
      clarificationHistory: [],
      timelineEvents: [
        {
          id: `TLE-${Date.now()}`,
          timestamp: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
          previousStage: 'DRAFT',
          newStage: 'SUBMITTED',
          responsibleUserId: currentUser.id,
          responsibleUserName: currentUser.name,
          responsibleRole: currentUser.role,
          actionTaken: 'Application Submitted Online with Fee Receipt',
          reasonOrObservation: `Formal AICTE approval submission for ${appType.replace(/_/g, ' ')}. Fee paid: ₹${payment.amountPaid.toLocaleString('en-IN')} (Ref: ${payment.transactionId}).`,
          relevantDocumentRefs: reusedDocIds,
        },
      ],
      paymentStatus: 'PAID',
      paymentReference: payment.transactionId,
      feeAmount: payment.amountPaid,
      formData: {
        ...formData,
        isDraft: false,
        paymentDetails: payment,
        lastSavedAt: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
      },
    };

    setApplications((prev) => {
      const filtered = existingDraftId ? prev.filter((a) => a.id !== existingDraftId) : prev;
      return [submittedApp, ...filtered];
    });

    logAuditEvent(
      'APPLICATION_SUBMITTED',
      'APPLICATION',
      officialId,
      'DRAFT',
      'SUBMITTED',
      `Official approval application submitted by ${inst.name} (${officialId}) with Payment Ref: ${payment.transactionId}.`
    );

    // Notify Scrutiny Officers
    const scrutinyNotif: NotificationRecord = {
      id: `NOTIF-${Date.now()}-SCRUT`,
      recipientRole: 'SCRUTINY_OFFICER',
      relatedEntityId: officialId,
      relatedEntityType: 'APPLICATION',
      category: 'SLA_DEADLINE',
      severity: 'INFO',
      title: `New College Application Submitted: ${inst.name}`,
      message: `Application ${officialId} submitted for ${appType.replace(/_/g, ' ')}. Status: Submitted – Pending Scrutiny. Fee verified paid (₹${payment.amountPaid.toLocaleString('en-IN')}).`,
      createdAt: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
      deadline: submittedApp.stageDeadline,
      isRead: false,
      isAcknowledged: false,
      escalationLevel: 0,
    };

    // Notify Institution Admin with submission confirmation
    const instNotif: NotificationRecord = {
      id: `NOTIF-${Date.now()}-INST`,
      recipientRole: 'INSTITUTION_ADMIN',
      recipientId: currentUser.id,
      relatedEntityId: officialId,
      relatedEntityType: 'APPLICATION',
      category: 'SLA_DEADLINE',
      severity: 'INFO',
      title: `AICTE Application Submitted Successfully: ${officialId}`,
      message: `Your approval application has been successfully submitted and forwarded for Scrutiny. Payment Reference: ${payment.transactionId}.`,
      createdAt: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
      isRead: false,
      isAcknowledged: false,
      escalationLevel: 0,
    };

    setNotifications((prev) => [scrutinyNotif, instNotif, ...prev]);

    return submittedApp;
  };

  // Advance stage & forward with cross-role synchronization
  const advanceApplicationStage = (
    applicationId: string,
    newStage: ApprovalStage,
    reason: string,
    notes?: string
  ): boolean => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return false;

    const oldStage = app.currentStage;
    const timelineItem = {
      id: `TLE-${Date.now()}`,
      timestamp: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
      previousStage: oldStage,
      newStage,
      responsibleUserId: currentUser.id,
      responsibleUserName: currentUser.name,
      responsibleRole: currentUser.role,
      actionTaken: reason,
      reasonOrObservation: notes || reason,
    };

    const updatedApp: Application = {
      ...app,
      currentStage: newStage,
      daysInCurrentStage: 0,
      stageDeadline: new Date(currentSimulatedDate.getTime() + 14 * 86400000).toISOString().substring(0, 10),
      timelineEvents: [...app.timelineEvents, timelineItem],
    };

    setApplications((prev) => prev.map((a) => (a.id === applicationId ? updatedApp : a)));

    logAuditEvent(
      'STAGE_TRANSITION',
      'APPLICATION',
      applicationId,
      oldStage,
      newStage,
      `${reason}. ${notes || ''}`
    );

    // If moved to EVC_PENDING, ensure EVC record exists and notify Coordinator + College
    if (newStage === 'EVC_PENDING') {
      const existingEVC = evcRecords.find((e) => e.applicationId === applicationId);
      if (!existingEVC) {
        const newEVC: EVCRecord = {
          id: `EVC-${Date.now().toString().slice(-6)}`,
          applicationId,
          institutionId: app.institutionId,
          institutionName: app.institutionName,
          assignedCoordinatorId: 'USR-EVC-004',
          assignedCoordinatorName: 'Prof. Anil K. Tiwari',
          expertPanel: {
            chairman: 'Prof. K. B. Deshpande (COEP Pune)',
            subjectExpert: 'Dr. Vidya Shirke (VJTI Mumbai)',
            regionalNominee: 'Er. S. T. Shinde (DTE Maharashtra)',
          },
          schedulingStatus: 'AWAITING_PROPOSAL',
          completionStatus: 'PENDING',
          reportSubmissionStatus: 'NOT_SUBMITTED',
          notes: notes || 'Auto-enqueued into EVC Scheduling Roster following successful Scrutiny sign-off.',
          deadlineDate: new Date(currentSimulatedDate.getTime() + 10 * 86400000).toISOString().substring(0, 10),
          timeline: [
            {
              timestamp: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
              action: 'Enqueued into EVC Roster',
              author: currentUser.name,
            },
          ],
        };
        setEvcRecords((prev) => [newEVC, ...prev]);
      }

      // Notify EVC Coordinator & College
      setNotifications((prev) => [
        {
          id: `NOTIF-${Date.now()}-EVC`,
          recipientRole: 'EVC_COORDINATOR',
          relatedEntityId: applicationId,
          relatedEntityType: 'EVC',
          category: 'EVC_REMINDER',
          severity: 'INFO',
          title: `EVC Visit Planning Required: ${app.institutionName}`,
          message: `Application ${applicationId} forwarded from Scrutiny. Please propose visit dates and assign expert committee. Forwarded by: ${currentUser.name} (${currentUser.role}).`,
          createdAt: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
          isRead: false,
          isAcknowledged: false,
          escalationLevel: 0,
        },
        {
          id: `NOTIF-${Date.now()}-INST-EVC`,
          recipientRole: 'INSTITUTION_ADMIN',
          relatedEntityId: applicationId,
          relatedEntityType: 'APPLICATION',
          category: 'SLA_DEADLINE',
          severity: 'INFO',
          title: `Application Forwarded to EVC Inspection: ${applicationId}`,
          message: `Your application has been verified by Scrutiny and forwarded for Expert Visit Committee (EVC) peer review inspection.`,
          createdAt: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
          isRead: false,
          isAcknowledged: false,
          escalationLevel: 0,
        },
        ...prev,
      ]);
    }

    // If moved to COMMITTEE_PROCESSING or DECISION_PENDING, notify Bureau / Competent Authority + College
    if (newStage === 'COMMITTEE_PROCESSING' || newStage === 'DECISION_PENDING') {
      setNotifications((prev) => [
        {
          id: `NOTIF-${Date.now()}-BUREAU`,
          recipientRole: 'BUREAU_OFFICER',
          relatedEntityId: applicationId,
          relatedEntityType: 'APPLICATION',
          category: 'SLA_DEADLINE',
          severity: 'INFO',
          title: `Application Awaiting Competent Authority Decision: ${app.institutionName}`,
          message: `Application ${applicationId} is ready for official Council review and sanction decision. Forwarded by: ${currentUser.name} (${currentUser.role}).`,
          createdAt: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
          isRead: false,
          isAcknowledged: false,
          escalationLevel: 0,
        },
        {
          id: `NOTIF-${Date.now()}-INST-COMMITTEE`,
          recipientRole: 'INSTITUTION_ADMIN',
          relatedEntityId: applicationId,
          relatedEntityType: 'APPLICATION',
          category: 'SLA_DEADLINE',
          severity: 'INFO',
          title: `Application Under Council Review: ${applicationId}`,
          message: `Your application has progressed to Council / Committee evaluation for statutory determination.`,
          createdAt: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
          isRead: false,
          isAcknowledged: false,
          escalationLevel: 0,
        },
        ...prev,
      ]);
    }

    // If moved to FURTHER_VERIFICATION, notify Compliance Verification Officer + College
    if (newStage === 'FURTHER_VERIFICATION') {
      setNotifications((prev) => [
        {
          id: `NOTIF-${Date.now()}-COMPL`,
          recipientRole: 'COMPLIANCE_OFFICER',
          relatedEntityId: applicationId,
          relatedEntityType: 'APPLICATION',
          category: 'SLA_DEADLINE',
          severity: 'INFO',
          title: `Compliance Verification Required: ${app.institutionName}`,
          message: `Application ${applicationId} assigned for post-inspection compliance and document verification. Forwarded by: ${currentUser.name}.`,
          createdAt: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
          isRead: false,
          isAcknowledged: false,
          escalationLevel: 0,
        },
        ...prev,
      ]);
    }

    return true;
  };

  const forwardApplicationWithRemarks = (
    applicationId: string,
    newStage: ApprovalStage,
    remarks: string,
    notes?: string
  ): boolean => {
    return advanceApplicationStage(applicationId, newStage, remarks, notes);
  };

  // Record Scrutiny Deficiency
  const recordScrutinyDeficiency = (
    applicationId: string,
    category: 'INFRASTRUCTURE' | 'DOCUMENTATION' | 'FACULTY_CADRE' | 'FINANCIAL' | 'STATUTORY_NOC',
    severity: 'CRITICAL_DEFICIENCY' | 'MINOR_DEFICIENCY' | 'OBSERVATION',
    remarks: string
  ) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return;

    const newObs = {
      id: `OBS-${Date.now().toString().slice(-4)}`,
      officerId: currentUser.id,
      officerName: currentUser.name,
      timestamp: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
      category,
      severity,
      remarks,
      isResolved: false,
    };

    const updatedApp = {
      ...app,
      scrutinyObservations: [...app.scrutinyObservations, newObs],
    };

    setApplications((prev) => prev.map((a) => (a.id === applicationId ? updatedApp : a)));

    logAuditEvent(
      'OBSERVATION_RECORDED',
      'APPLICATION',
      applicationId,
      undefined,
      category,
      `Deficiency recorded: ${remarks}`
    );
  };

  // Return for clarification
  const returnForClarification = (applicationId: string, reason: string) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return;

    const newClarification = {
      id: `CLR-${Date.now().toString().slice(-4)}`,
      requestedAt: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
      requestedBy: currentUser.name,
      reason,
      status: 'AWAITING_INSTITUTION' as const,
    };

    const updatedApp: Application = {
      ...app,
      currentStage: 'CLARIFICATION_REQUIRED',
      daysInCurrentStage: 0,
      stageDeadline: new Date(currentSimulatedDate.getTime() + 15 * 86400000).toISOString().substring(0, 10),
      clarificationHistory: [...app.clarificationHistory, newClarification],
      timelineEvents: [
        ...app.timelineEvents,
        {
          id: `TLE-${Date.now()}`,
          timestamp: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
          previousStage: app.currentStage,
          newStage: 'CLARIFICATION_REQUIRED',
          responsibleUserId: currentUser.id,
          responsibleUserName: currentUser.name,
          responsibleRole: currentUser.role,
          actionTaken: 'Returned for Clarification',
          reasonOrObservation: reason,
        },
      ],
    };

    setApplications((prev) => prev.map((a) => (a.id === applicationId ? updatedApp : a)));

    logAuditEvent(
      'STAGE_TRANSITION',
      'APPLICATION',
      applicationId,
      app.currentStage,
      'CLARIFICATION_REQUIRED',
      `Returned for clarification: ${reason}`
    );

    // Notify Institution Admin
    setNotifications((prev) => [
      {
        id: `NOTIF-${Date.now()}-CLR`,
        recipientRole: 'INSTITUTION_ADMIN',
        relatedEntityId: applicationId,
        relatedEntityType: 'APPLICATION',
        category: 'DEFICIENCY_NOTICE',
        severity: 'CRITICAL',
        title: `Clarification Required: Application ${applicationId}`,
        message: `Scrutiny Officer has returned your application with mandatory observations: "${reason}". 15-day rectification window open.`,
        createdAt: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
        deadline: updatedApp.stageDeadline,
        isRead: false,
        isAcknowledged: false,
        escalationLevel: 0,
      },
      ...prev,
    ]);
  };

  // Institution Responds to Clarification
  const respondToClarification = (
    applicationId: string,
    responseNotes: string,
    attachedDocIds?: string[]
  ) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return;

    const updatedClarifications = app.clarificationHistory.map((c, i) =>
      i === app.clarificationHistory.length - 1
        ? {
            ...c,
            respondedAt: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
            responseNotes,
            attachedDocIds,
            status: 'SUBMITTED' as const,
          }
        : c
    );

    const updatedApp: Application = {
      ...app,
      currentStage: 'RE_SCRUTINY',
      daysInCurrentStage: 0,
      stageDeadline: new Date(currentSimulatedDate.getTime() + 7 * 86400000).toISOString().substring(0, 10),
      clarificationHistory: updatedClarifications,
      timelineEvents: [
        ...app.timelineEvents,
        {
          id: `TLE-${Date.now()}`,
          timestamp: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
          previousStage: 'CLARIFICATION_REQUIRED',
          newStage: 'RE_SCRUTINY',
          responsibleUserId: currentUser.id,
          responsibleUserName: currentUser.name,
          responsibleRole: currentUser.role,
          actionTaken: 'Clarification Submitted by Institution',
          reasonOrObservation: responseNotes,
          relevantDocumentRefs: attachedDocIds,
        },
      ],
    };

    setApplications((prev) => prev.map((a) => (a.id === applicationId ? updatedApp : a)));

    logAuditEvent(
      'STAGE_TRANSITION',
      'APPLICATION',
      applicationId,
      'CLARIFICATION_REQUIRED',
      'RE_SCRUTINY',
      `Institution submitted clarification: ${responseNotes}`
    );

    // Notify Scrutiny Officer
    setNotifications((prev) => [
      {
        id: `NOTIF-${Date.now()}-RESCRUT`,
        recipientRole: 'SCRUTINY_OFFICER',
        relatedEntityId: applicationId,
        relatedEntityType: 'APPLICATION',
        category: 'SLA_DEADLINE',
        severity: 'INFO',
        title: `Clarification Responded: ${app.institutionName}`,
        message: `Institution responded to deficiencies for ${applicationId}. Ready for Re-Scrutiny verification.`,
        createdAt: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
        isRead: false,
        isAcknowledged: false,
        escalationLevel: 0,
      },
      ...prev,
    ]);
  };

  // Record Final Statutory Decision
  const recordFinalDecision = (
    applicationId: string,
    outcome: 'APPROVED' | 'REJECTED',
    remarks: string
  ) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return;

    const targetStage: ApprovalStage = outcome === 'APPROVED' ? 'APPROVED' : 'REJECTED';

    const updatedApp: Application = {
      ...app,
      currentStage: targetStage,
      finalDecision: {
        outcome,
        date: currentSimulatedDate.toISOString().substring(0, 10),
        decidedBy: `${currentUser.name} (${currentUser.designation})`,
        remarks,
      },
      timelineEvents: [
        ...app.timelineEvents,
        {
          id: `TLE-${Date.now()}`,
          timestamp: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
          previousStage: app.currentStage,
          newStage: targetStage,
          responsibleUserId: currentUser.id,
          responsibleUserName: currentUser.name,
          responsibleRole: currentUser.role,
          actionTaken: `Statutory Decision Recorded: ${outcome}`,
          reasonOrObservation: remarks,
        },
      ],
    };

    setApplications((prev) => prev.map((a) => (a.id === applicationId ? updatedApp : a)));

    logAuditEvent(
      'STATUTORY_DECISION',
      'APPLICATION',
      applicationId,
      app.currentStage,
      targetStage,
      `Official Council decision: ${outcome}. ${remarks}`
    );

    // Notify Institution
    setNotifications((prev) => [
      {
        id: `NOTIF-${Date.now()}-DEC`,
        recipientRole: 'INSTITUTION_ADMIN',
        relatedEntityId: applicationId,
        relatedEntityType: 'APPLICATION',
        category: 'SLA_DEADLINE',
        severity: outcome === 'APPROVED' ? 'INFO' : 'CRITICAL',
        title: `AICTE Decision Order Issued: ${outcome}`,
        message: `Application ${applicationId} has been ${outcome.toLowerCase()} by AICTE Senior Authority. View official proceedings order in detail.`,
        createdAt: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
        isRead: false,
        isAcknowledged: false,
        escalationLevel: 0,
      },
      ...prev,
    ]);
  };

  // Reuse Document in Application
  const reuseDocument = (documentId: string, applicationId: string): boolean => {
    const doc = documents.find((d) => d.id === documentId);
    const app = applications.find((a) => a.id === applicationId);

    if (!doc || !app) return false;

    // Validation checks for document reuse
    if (doc.verificationStatus !== 'VERIFIED') {
      return false; // Cannot reuse unverified or expired documents
    }

    if (doc.expiryDate && new Date(doc.expiryDate) < currentSimulatedDate) {
      return false; // Expired
    }

    // Link document
    if (!app.attachedDocumentIds.includes(documentId)) {
      const updatedApp = {
        ...app,
        attachedDocumentIds: [...app.attachedDocumentIds, documentId],
        reusedDocumentIds: [...app.reusedDocumentIds, documentId],
      };
      setApplications((prev) => prev.map((a) => (a.id === applicationId ? updatedApp : a)));
    }

    logAuditEvent(
      'DOCUMENT_REUSED',
      'DOCUMENT',
      documentId,
      'VAULT',
      `LINKED_TO_${applicationId}`,
      `Verified document '${doc.name}' reused under Compliance Reuse Profile rules.`
    );

    return true;
  };

  // Upload renewed document
  const uploadRenewedDocument = (
    documentId: string,
    newExpiryDate: string,
    newDocName: string,
    fileSize: string
  ) => {
    const updatedDocs = documents.map((d) => {
      if (d.id === documentId) {
        return {
          ...d,
          name: newDocName || d.name,
          expiryDate: newExpiryDate,
          submissionDate: currentSimulatedDate.toISOString().substring(0, 10),
          verificationStatus: 'PENDING_VERIFICATION' as const,
          renewalStatus: 'RENEWED' as const,
          versionNumber: d.versionNumber + 1,
          fileSize: fileSize || '3.2 MB',
          notes: 'Renewed copy submitted online. Awaiting Scrutiny Officer verification.',
        };
      }
      return d;
    });

    setDocuments(updatedDocs);

    logAuditEvent(
      'DOCUMENT_RENEWAL_SUBMITTED',
      'DOCUMENT',
      documentId,
      'EXPIRED',
      'PENDING_VERIFICATION',
      `Renewed document uploaded with validity up to ${newExpiryDate}.`
    );

    // Notify Scrutiny Officer
    setNotifications((prev) => [
      {
        id: `NOTIF-${Date.now()}-DOCREN`,
        recipientRole: 'SCRUTINY_OFFICER',
        relatedEntityId: documentId,
        relatedEntityType: 'DOCUMENT',
        category: 'DOCUMENT_EXPIRY',
        severity: 'INFO',
        title: `Renewed Document Submitted for Verification: ${newDocName}`,
        message: `Institution uploaded renewal certificate for document ${documentId}. Ready for Scrutiny verification.`,
        createdAt: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
        isRead: false,
        isAcknowledged: false,
        escalationLevel: 0,
      },
      ...prev,
    ]);
  };

  // Verify Document
  const verifyDocument = (documentId: string, isApproved: boolean, notes: string) => {
    const updatedDocs = documents.map((d) => {
      if (d.id === documentId) {
        return {
          ...d,
          verificationStatus: (isApproved ? 'VERIFIED' : 'REVERIFICATION_REQUIRED') as any,
          verifiedBy: currentUser.name,
          verificationDate: currentSimulatedDate.toISOString().substring(0, 10),
          renewalStatus: (isApproved ? 'NOT_REQUIRED' : 'RENEWAL_DUE') as any,
          isEligibleForReuse: isApproved,
          notes: notes || d.notes,
        };
      }
      return d;
    });

    setDocuments(updatedDocs);

    logAuditEvent(
      isApproved ? 'DOCUMENT_VERIFIED' : 'DOCUMENT_REVERIFICATION_REQUIRED',
      'DOCUMENT',
      documentId,
      'PENDING_VERIFICATION',
      isApproved ? 'VERIFIED' : 'REVERIFICATION_REQUIRED',
      notes || 'Scrutiny Officer completed validation.'
    );
  };

  // Compliance operations
  const submitComplianceEvidence = (obligationId: string, notes: string, fileRef?: string) => {
    const updated = complianceObligations.map((o) => {
      if (o.id === obligationId) {
        return {
          ...o,
          status: 'UNDER_VERIFICATION' as const,
          submissionEvidence: {
            submittedAt: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
            evidenceNotes: notes,
            fileRef: fileRef || 'vault://compliance/uploaded_evidence.pdf',
          },
        };
      }
      return o;
    });

    setComplianceObligations(updated);

    logAuditEvent(
      'COMPLIANCE_EVIDENCE_SUBMITTED',
      'COMPLIANCE',
      obligationId,
      'DUE_SOON',
      'UNDER_VERIFICATION',
      `Evidence submitted: ${notes}`
    );
  };

  const verifyCompliance = (
    obligationId: string,
    status: 'VERIFIED' | 'CLARIFICATION_REQUIRED',
    remarks: string
  ) => {
    const updated = complianceObligations.map((o) => {
      if (o.id === obligationId) {
        return {
          ...o,
          status: (status === 'VERIFIED' ? 'CLOSED' : 'CLARIFICATION_REQUIRED') as any,
          closureDate: status === 'VERIFIED' ? currentSimulatedDate.toISOString().substring(0, 10) : undefined,
          closureRemarks: remarks,
        };
      }
      return o;
    });

    setComplianceObligations(updated);

    logAuditEvent(
      'COMPLIANCE_VERIFIED',
      'COMPLIANCE',
      obligationId,
      'UNDER_VERIFICATION',
      status === 'VERIFIED' ? 'CLOSED' : 'CLARIFICATION_REQUIRED',
      remarks
    );
  };

  // EVC operations
  const scheduleEVCVisit = (
    evcId: string,
    proposedDate: string,
    confirmedDate?: string,
    notes?: string
  ) => {
    const updated = evcRecords.map((e) => {
      if (e.id === evcId) {
        const isConfirmed = !!confirmedDate;
        return {
          ...e,
          proposedVisitDate: proposedDate,
          confirmedVisitDate: confirmedDate || e.confirmedVisitDate,
          schedulingStatus: (isConfirmed ? 'CONFIRMED' : 'PROPOSED') as any,
          notes: notes || e.notes,
          timeline: [
            ...e.timeline,
            {
              timestamp: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
              action: isConfirmed ? `Visit Confirmed for ${confirmedDate}` : `Proposed Date: ${proposedDate}`,
              author: currentUser.name,
            },
          ],
        };
      }
      return e;
    });

    setEvcRecords(updated);

    // If confirmed, update related application stage to EVC_SCHEDULED
    const targetEVC = evcRecords.find((e) => e.id === evcId);
    if (targetEVC && confirmedDate) {
      advanceApplicationStage(
        targetEVC.applicationId,
        'EVC_SCHEDULED',
        `EVC Inspection Confirmed for ${confirmedDate}`,
        notes
      );
    }

    logAuditEvent(
      'EVC_SCHEDULED',
      'EVC',
      evcId,
      'AWAITING_PROPOSAL',
      confirmedDate ? 'CONFIRMED' : 'PROPOSED',
      `EVC scheduling updated: ${confirmedDate || proposedDate}. ${notes || ''}`
    );
  };

  const recordEVCCompletion = (
    evcId: string,
    reportSummary: string,
    deficiencyCount: number
  ) => {
    const targetEVC = evcRecords.find((e) => e.id === evcId);
    if (!targetEVC) return;

    const updated = evcRecords.map((e) => {
      if (e.id === evcId) {
        return {
          ...e,
          completionStatus: 'VISIT_CONCLUDED' as const,
          reportSubmissionStatus: 'FINAL_SUBMITTED' as const,
          reportSummary,
          reportDeficiencyCount: deficiencyCount,
          timeline: [
            ...e.timeline,
            {
              timestamp: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
              action: `Visit Concluded. Deficiencies noted: ${deficiencyCount}`,
              author: currentUser.name,
            },
          ],
        };
      }
      return e;
    });

    setEvcRecords(updated);

    // Move application to EVC_COMPLETED
    advanceApplicationStage(
      targetEVC.applicationId,
      'EVC_COMPLETED',
      'Expert Visit Committee Concluded Inspection',
      `Inspection report submitted with ${deficiencyCount} deficiency observation(s). Summary: ${reportSummary}`
    );

    logAuditEvent(
      'EVC_COMPLETED',
      'EVC',
      evcId,
      'IN_PROGRESS',
      'VISIT_CONCLUDED',
      `EVC inspection concluded. Deficiency count: ${deficiencyCount}. Summary: ${reportSummary}`
    );
  };

  // Notification read / ack
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const acknowledgeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              isRead: true,
              isAcknowledged: true,
              acknowledgedAt: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
            }
          : n
      )
    );
  };

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter(
      (n) =>
        !n.isRead &&
        (n.recipientRole === currentUser.role || n.recipientRole === 'SENIOR_AUTHORITY')
    ).length;
  }, [notifications, currentUser.role]);

  // Reset to original demo seed
  const resetDemoData = () => {
    localStorage.clear();
    setInstitutions(DEMO_INSTITUTIONS);
    setApplications(DEMO_APPLICATIONS);
    setDocuments(DEMO_DOCUMENTS);
    setComplianceObligations(DEMO_COMPLIANCE_OBLIGATIONS);
    setEvcRecords(DEMO_EVC_RECORDS);
    setNotifications(DEMO_NOTIFICATIONS);
    setAuditEvents(DEMO_AUDIT_EVENTS);
    setSimulatedDaysOffset(0);
    setCurrentUser(DEMO_USERS[0]);
    setSelectedApplicationId(null);
    setApplicationFilter({});
    setActiveTab('overview');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        users: DEMO_USERS,
        institutions,
        applications,
        documents,
        complianceObligations,
        evcRecords,
        notifications,
        auditEvents,
        workflowDefinitions,
        simulatedDaysOffset,
        advanceSimulatedDays,
        currentSimulatedDate,
        activeTab,
        setActiveTab,
        selectedApplicationId,
        setSelectedApplicationId,
        applicationFilter,
        setApplicationFilter,
        currentView,
        setCurrentView,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        closeSidebar,
        isSignInModalOpen,
        setIsSignInModalOpen,
        isNewAppModalOpen,
        setIsNewAppModalOpen,
        editingDraftAppId,
        setEditingDraftAppId,
        openNewApplicationModal,
        closeNewApplicationModal,
        saveApplicationDraft,
        submitCollegeApprovalApplication,
        forwardApplicationWithRemarks,
        loginAsRole,
        logout,
        submitNewApplication,
        advanceApplicationStage,
        recordScrutinyDeficiency,
        returnForClarification,
        respondToClarification,
        recordFinalDecision,
        reuseDocument,
        uploadRenewedDocument,
        verifyDocument,
        submitComplianceEvidence,
        verifyCompliance,
        scheduleEVCVisit,
        recordEVCCompletion,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        acknowledgeNotification,
        unreadNotificationCount,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

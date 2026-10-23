export type UserRole =
  | 'INSTITUTION_ADMIN'
  | 'SCRUTINY_OFFICER'
  | 'REGIONAL_ADMIN'
  | 'EVC_COORDINATOR'
  | 'COMPLIANCE_OFFICER'
  | 'BUREAU_OFFICER'
  | 'SENIOR_AUTHORITY'
  | 'AUDITOR'
  | 'SUPER_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  institutionId?: string;
  region?: string;
  department: string;
  avatar?: string;
}

export type InstitutionType =
  | 'ENGINEERING_AND_TECH'
  | 'MANAGEMENT'
  | 'PHARMACY'
  | 'ARCHITECTURE'
  | 'POLYTECHNIC';

export type RegionalZone =
  | 'WESTERN'
  | 'NORTHERN'
  | 'SOUTHERN'
  | 'EASTERN'
  | 'CENTRAL'
  | 'SOUTH_WESTERN'
  | 'NORTH_WESTERN';

export interface Institution {
  id: string;
  name: string;
  code: string;
  type: InstitutionType;
  region: RegionalZone;
  state: string;
  city: string;
  address: string;
  principalName: string;
  email: string;
  phone: string;
  establishedYear: number;
  totalPrograms: number;
  sanctionedIntake: number;
  complianceScore: number;
  status: 'ACTIVE' | 'DEFICIENT' | 'ACTION_REQUIRED';
}

export type ApprovalStage =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'PRELIMINARY_CHECK'
  | 'SCRUTINY'
  | 'CLARIFICATION_REQUIRED'
  | 'RE_SCRUTINY'
  | 'EVC_PENDING'
  | 'EVC_SCHEDULED'
  | 'EVC_COMPLETED'
  | 'COMMITTEE_PROCESSING'
  | 'FURTHER_VERIFICATION'
  | 'DECISION_PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'WITHDRAWN';

export type ApplicationRoute =
  | 'SCRUTINY_ONLY'
  | 'SCRUTINY_EVC'
  | 'EVC_COMMITTEE'
  | 'SCRUTINY_EVC_COMMITTEE';

export type ApplicationType =
  | 'EXTENSION_OF_APPROVAL'
  | 'INTAKE_VARIATION'
  | 'NEW_PROGRAM'
  | 'NEW_INSTITUTION'
  | 'CHANGE_OF_SITE';

export interface ScrutinyObservation {
  id: string;
  officerId: string;
  officerName: string;
  timestamp: string;
  category: 'INFRASTRUCTURE' | 'DOCUMENTATION' | 'FACULTY_CADRE' | 'FINANCIAL' | 'STATUTORY_NOC';
  severity: 'CRITICAL_DEFICIENCY' | 'MINOR_DEFICIENCY' | 'OBSERVATION';
  remarks: string;
  isResolved: boolean;
  resolutionNotes?: string;
  resolvedAt?: string;
}

export interface ClarificationRecord {
  id: string;
  requestedAt: string;
  requestedBy: string;
  reason: string;
  respondedAt?: string;
  responseNotes?: string;
  attachedDocIds?: string[];
  status: 'AWAITING_INSTITUTION' | 'SUBMITTED' | 'ACCEPTED' | 'REJECTED';
}

export interface WorkflowTimelineEvent {
  id: string;
  timestamp: string;
  previousStage: ApprovalStage;
  newStage: ApprovalStage;
  responsibleUserId: string;
  responsibleUserName: string;
  responsibleRole: UserRole;
  actionTaken: string;
  reasonOrObservation: string;
  relevantDocumentRefs?: string[];
}

export interface CollegeApprovalCourse {
  id: string;
  program: string;
  courseName: string;
  level: 'UG' | 'PG' | 'DIPLOMA';
  currentIntake: number;
  proposedIntake: number;
  accreditationStatus: 'NBA_ACCREDITED' | 'APPLIED' | 'NOT_ACCREDITED';
  affiliatingUniversity: string;
}

export interface CollegeApprovalFeeBreakdown {
  applicationCategory: string;
  baseRegulatoryFee: number;
  inspectionFee: number;
  gstAmount: number;
  totalPayable: number;
}

export interface CollegeApprovalPayment {
  paymentMode: 'NET_BANKING' | 'NEFT_RTGS' | 'UPI' | 'TREASURY_CHALLAN';
  transactionId: string;
  paymentDate: string;
  amountPaid: number;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  bankReference: string;
  receiptNumber: string;
}

export interface CollegeApprovalFormData {
  // Institutional Registration
  permanentId?: string;
  institutionName: string;
  institutionType: InstitutionType;
  establishmentYear: number;
  societyTrustName: string;
  societyRegNo: string;
  headOfInstitutionName: string;
  headDesignation: string;
  headEmail: string;
  headPhone: string;

  // Location & Address
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  landCategory: 'RURAL' | 'URBAN' | 'MEGA_CITY';
  landAreaAcres: number;
  builtUpAreaSqM: number;

  // Course & Intake Details
  courses: CollegeApprovalCourse[];

  // Faculty & Academic Infrastructure
  facultyCount: number;
  cadreRatioCompliant: boolean;
  studentFacultyRatio: string;
  principalQualified: boolean;
  classroomsCount: number;
  tutorialRoomsCount: number;
  laboratoriesCount: number;
  seminarHallsCount: number;
  libraryBooksCount: number;
  libraryJournalSubscriptions: number;
  computersCount: number;
  bandwidthMbps: number;

  // Facilities & Compliance
  barrierFreeCampus: boolean;
  fireSafetyNOCValid: boolean;
  antiRaggingCommitteeConstituted: boolean;
  internalComplaintsCommitteeConstituted: boolean;
  grievanceRedressalEstablished: boolean;
  scStCommitteeEstablished: boolean;

  // Statutory Declarations
  declarationAgreed: boolean;
  signatoryName: string;
  signatoryDesignation: string;
  signatureDate: string;

  // Fee & Payment
  feeBreakdown: CollegeApprovalFeeBreakdown;
  paymentDetails?: CollegeApprovalPayment;

  // Status flags
  isDraft: boolean;
  lastSavedAt: string;
}

export interface Application {
  id: string;
  institutionId: string;
  institutionName: string;
  permanentId?: string;
  type: ApplicationType;
  academicYear: string;
  route: ApplicationRoute;
  currentStage: ApprovalStage;
  submissionDate: string;
  stageDeadline: string;
  daysInCurrentStage: number;
  stageSlaDays: number;
  assignedOfficerId: string;
  assignedOfficerName: string;
  region: RegionalZone;
  priority: 'URGENT' | 'HIGH' | 'NORMAL';
  delayRisk: 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK';
  delayRiskFactors: string[];
  attachedDocumentIds: string[];
  reusedDocumentIds: string[];
  scrutinyObservations: ScrutinyObservation[];
  clarificationHistory: ClarificationRecord[];
  timelineEvents: WorkflowTimelineEvent[];
  paymentStatus?: 'PAID' | 'PENDING' | 'NOT_APPLICABLE';
  paymentReference?: string;
  feeAmount?: number;
  formData?: CollegeApprovalFormData;
  finalDecision?: {
    outcome: 'APPROVED' | 'REJECTED';
    date: string;
    decidedBy: string;
    remarks: string;
  };
}

export type DocumentType =
  | 'LEASE_AGREEMENT'
  | 'BUILDING_COMPLETION'
  | 'FIRE_SAFETY_NOC'
  | 'BARRIER_FREE_AUDIT'
  | 'APPROVED_MASTER_PLAN'
  | 'CORPUS_FD_RECEIPT'
  | 'FACULTY_CADRE_AUDIT';

export type DocumentVerificationStatus =
  | 'VERIFIED'
  | 'PENDING_VERIFICATION'
  | 'EXPIRING_SOON'
  | 'EXPIRED'
  | 'RENEWAL_SUBMITTED'
  | 'REVERIFICATION_REQUIRED';

export interface DocumentRecord {
  id: string;
  institutionId: string;
  type: DocumentType;
  name: string;
  issueDate: string;
  expiryDate: string | null; // null for perpetual
  submissionDate: string;
  verificationStatus: DocumentVerificationStatus;
  verifiedBy?: string;
  verificationDate?: string;
  versionNumber: number;
  applicability: ApplicationType[];
  renewalStatus: 'NOT_REQUIRED' | 'RENEWAL_DUE' | 'RENEWAL_UNDER_REVIEW' | 'RENEWED';
  secureStorageRef: string;
  fileSize: string;
  notes?: string;
  isEligibleForReuse?: boolean;
}

export type ComplianceStatus =
  | 'NOT_YET_DUE'
  | 'DUE_SOON'
  | 'SUBMITTED'
  | 'UNDER_VERIFICATION'
  | 'CLARIFICATION_REQUIRED'
  | 'VERIFIED'
  | 'OVERDUE'
  | 'CLOSED';

export interface ComplianceObligation {
  id: string;
  institutionId: string;
  institutionName: string;
  relatedApplicationId?: string;
  requirementDescription: string;
  sourceRuleRef: string;
  issueDate: string;
  dueDate: string;
  status: ComplianceStatus;
  submissionEvidence?: {
    submittedAt: string;
    evidenceNotes: string;
    fileRef: string;
  };
  assignedReviewer: string;
  escalationStatus: 'NONE' | 'L1_OFFICER' | 'L2_REGIONAL' | 'L3_COUNCIL';
  closureDate?: string;
  closureRemarks?: string;
}

export interface EVCRecord {
  id: string;
  applicationId: string;
  institutionId: string;
  institutionName: string;
  assignedCoordinatorId: string;
  assignedCoordinatorName: string;
  expertPanel: {
    chairman: string;
    subjectExpert: string;
    regionalNominee: string;
  };
  proposedVisitDate?: string;
  confirmedVisitDate?: string;
  schedulingStatus: 'AWAITING_PROPOSAL' | 'PROPOSED' | 'CONFIRMED' | 'RESCHEDULED' | 'CANCELLED';
  completionStatus: 'PENDING' | 'IN_PROGRESS' | 'VISIT_CONCLUDED';
  reportSubmissionStatus: 'NOT_SUBMITTED' | 'DRAFT_REPORT' | 'FINAL_SUBMITTED' | 'ACCEPTED';
  reportDeficiencyCount?: number;
  reportSummary?: string;
  notes: string;
  deadlineDate: string;
  timeline: {
    timestamp: string;
    action: string;
    author: string;
  }[];
}

export interface NotificationRecord {
  id: string;
  recipientRole: UserRole;
  recipientId?: string;
  relatedEntityId: string;
  relatedEntityType: 'APPLICATION' | 'DOCUMENT' | 'COMPLIANCE' | 'EVC';
  category: 'SLA_DEADLINE' | 'STAGE_OVERDUE' | 'DOCUMENT_EXPIRY' | 'DEFICIENCY_NOTICE' | 'EVC_REMINDER' | 'ESCALATION';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  title: string;
  message: string;
  createdAt: string;
  deadline?: string;
  isRead: boolean;
  isAcknowledged: boolean;
  acknowledgedAt?: string;
  escalationLevel: 0 | 1 | 2 | 3;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entityType: 'APPLICATION' | 'DOCUMENT' | 'COMPLIANCE' | 'EVC' | 'WORKFLOW' | 'SYSTEM';
  entityId: string;
  previousValue?: string;
  newValue?: string;
  reasonNotes: string;
  correlationId: string;
}

export interface WorkflowDefinition {
  route: ApplicationRoute;
  routeName: string;
  description: string;
  stages: ApprovalStage[];
  stageSlas: Partial<Record<ApprovalStage, number>>;
  allowedTransitions: Partial<Record<ApprovalStage, ApprovalStage[]>>;
  requiredRoles: Partial<Record<ApprovalStage, UserRole[]>>;
}

export interface DelayRiskThresholds {
  slaConsumedMediumPercent: number;
  slaConsumedHighPercent: number;
  maxDaysWithoutAction: number;
  maxPendingClarifications: number;
}

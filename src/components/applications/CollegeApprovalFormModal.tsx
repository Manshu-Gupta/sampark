import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CollegeApprovalFormData,
  CollegeApprovalCourse,
  CollegeApprovalPayment,
  ApplicationType,
} from '../../types';
import { AICTE_FEE_SCHEDULE, calculateApplicationFee } from '../../data/feeSchedule';
import {
  X,
  Building2,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Save,
  CreditCard,
  ShieldCheck,
  FolderArchive,
  Plus,
  Trash2,
  Lock,
  Sparkles,
  Info,
  Calendar,
  Layers,
  BookOpen,
  Cpu,
  Check,
  FileCheck2,
  QrCode,
  Building,
  Landmark,
} from 'lucide-react';

export const CollegeApprovalFormModal: React.FC = () => {
  const {
    isNewAppModalOpen,
    closeNewApplicationModal,
    editingDraftAppId,
    applications,
    institutions,
    documents,
    currentUser,
    currentSimulatedDate,
    saveApplicationDraft,
    submitCollegeApprovalApplication,
    setSelectedApplicationId,
    setActiveTab,
  } = useApp();

  if (!isNewAppModalOpen) return null;

  // Selected or user's institution
  const institution =
    institutions.find((i) => i.id === currentUser.institutionId) ||
    institutions[0] || {
      id: 'INST-2024-001',
      name: 'Sunrise Institute of Technology',
      code: '1-3329048101',
      type: 'ENGINEERING_AND_TECH',
      region: 'WESTERN',
      state: 'Maharashtra',
      city: 'Pune',
      address: 'Survey No. 44/2A, Hinjawadi Phase-1, Pune - 411057',
      principalName: 'Dr. Rajesh K. Sharma',
      email: 'principal@sunrise-tech.edu.in',
      phone: '+91 20 2899 4400',
      establishedYear: 2008,
      totalPrograms: 7,
      sanctionedIntake: 540,
    };

  // Find existing draft if editing
  const existingApp = editingDraftAppId
    ? applications.find((a) => a.id === editingDraftAppId)
    : null;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [saveDraftFeedback, setSaveDraftFeedback] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(
    existingApp?.paymentStatus === 'PAID'
  );
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<
    'NET_BANKING' | 'NEFT_RTGS' | 'UPI' | 'TREASURY_CHALLAN'
  >('NET_BANKING');
  const [selectedBank, setSelectedBank] = useState<string>('State Bank of India (SBI)');

  // Form State
  const [appCategory, setAppCategory] = useState<ApplicationType>(
    existingApp ? existingApp.type : 'INTAKE_VARIATION'
  );

  const [formData, setFormData] = useState<CollegeApprovalFormData>(() => {
    if (existingApp?.formData) {
      return existingApp.formData;
    }
    const defaultFee = calculateApplicationFee('INTAKE_VARIATION');
    return {
      permanentId: institution.code || '1-3329048101',
      institutionName: institution.name,
      institutionType: (institution.type as any) || 'ENGINEERING_AND_TECH',
      establishmentYear: institution.establishedYear || 2008,
      societyTrustName: 'Sunrise Education & Research Foundation',
      societyRegNo: 'MAH/PUN/F-18920/2007',
      headOfInstitutionName: institution.principalName || 'Dr. Rajesh K. Sharma',
      headDesignation: 'Principal & Professor',
      headEmail: institution.email || 'principal@sunrise-tech.edu.in',
      headPhone: institution.phone || '+91 98220 14820',

      addressLine1: institution.address || 'Survey No. 44/2A, Hinjawadi Phase-1',
      addressLine2: 'Taluka Mulshi',
      city: institution.city || 'Pune',
      district: 'Pune',
      state: institution.state || 'Maharashtra',
      pincode: '411057',
      landCategory: 'URBAN',
      landAreaAcres: 7.5,
      builtUpAreaSqM: 19850,

      courses: [
        {
          id: 'CRS-01',
          program: 'Engineering & Technology',
          courseName: 'Computer Science & Engineering',
          level: 'UG',
          currentIntake: 180,
          proposedIntake: 240,
          accreditationStatus: 'NBA_ACCREDITED',
          affiliatingUniversity: 'Savitribai Phule Pune University',
        },
        {
          id: 'CRS-02',
          program: 'Engineering & Technology',
          courseName: 'Artificial Intelligence & Machine Learning',
          level: 'UG',
          currentIntake: 60,
          proposedIntake: 120,
          accreditationStatus: 'APPLIED',
          affiliatingUniversity: 'Savitribai Phule Pune University',
        },
        {
          id: 'CRS-03',
          program: 'Engineering & Technology',
          courseName: 'Electronics & Telecommunication Engineering',
          level: 'UG',
          currentIntake: 120,
          proposedIntake: 120,
          accreditationStatus: 'NBA_ACCREDITED',
          affiliatingUniversity: 'Savitribai Phule Pune University',
        },
        {
          id: 'CRS-04',
          program: 'Engineering & Technology',
          courseName: 'Mechanical Engineering',
          level: 'UG',
          currentIntake: 60,
          proposedIntake: 60,
          accreditationStatus: 'NOT_ACCREDITED',
          affiliatingUniversity: 'Savitribai Phule Pune University',
        },
      ],

      facultyCount: 52,
      cadreRatioCompliant: true,
      studentFacultyRatio: '1:15',
      principalQualified: true,
      classroomsCount: 28,
      tutorialRoomsCount: 8,
      laboratoriesCount: 34,
      seminarHallsCount: 4,
      libraryBooksCount: 28400,
      libraryJournalSubscriptions: 54,
      computersCount: 520,
      bandwidthMbps: 1000,

      barrierFreeCampus: true,
      fireSafetyNOCValid: true,
      antiRaggingCommitteeConstituted: true,
      internalComplaintsCommitteeConstituted: true,
      grievanceRedressalEstablished: true,
      scStCommitteeEstablished: true,

      declarationAgreed: false,
      signatoryName: institution.principalName || 'Dr. Rajesh K. Sharma',
      signatoryDesignation: 'Principal & Authorized Signatory',
      signatureDate: currentSimulatedDate.toISOString().substring(0, 10),

      feeBreakdown: defaultFee,
      paymentDetails: undefined,
      isDraft: true,
      lastSavedAt: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
    };
  });

  // Re-calculate fee whenever category changes
  useEffect(() => {
    const fee = calculateApplicationFee(appCategory);
    setFormData((prev) => ({
      ...prev,
      feeBreakdown: fee,
    }));
  }, [appCategory]);

  // Compute total intake stats
  const totalCurrentIntake = formData.courses.reduce((sum, c) => sum + (Number(c.currentIntake) || 0), 0);
  const totalProposedIntake = formData.courses.reduce((sum, c) => sum + (Number(c.proposedIntake) || 0), 0);
  const intakeDelta = totalProposedIntake - totalCurrentIntake;

  // Course handlers
  const handleAddCourse = () => {
    const newCourse: CollegeApprovalCourse = {
      id: `CRS-${Date.now().toString().slice(-4)}`,
      program: 'Engineering & Technology',
      courseName: 'Robotics & Automation',
      level: 'UG',
      currentIntake: 0,
      proposedIntake: 60,
      accreditationStatus: 'APPLIED',
      affiliatingUniversity: 'Savitribai Phule Pune University',
    };
    setFormData((prev) => ({
      ...prev,
      courses: [...prev.courses, newCourse],
    }));
  };

  const handleRemoveCourse = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      courses: prev.courses.filter((c) => c.id !== id),
    }));
  };

  const handleCourseChange = (id: string, field: keyof CollegeApprovalCourse, value: any) => {
    setFormData((prev) => ({
      ...prev,
      courses: prev.courses.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    }));
  };

  // Save Draft Action
  const handleSaveDraft = () => {
    const saved = saveApplicationDraft(formData, editingDraftAppId || undefined);
    setSaveDraftFeedback(`Draft saved successfully (ID: ${saved.id})`);
    setTimeout(() => setSaveDraftFeedback(null), 3000);
  };

  // Simulated Payment Handler
  const handleSimulatePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      const payment: CollegeApprovalPayment = {
        paymentMode: selectedPaymentMode,
        transactionId: `TXN-AICTE-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        paymentDate: currentSimulatedDate.toISOString().replace('T', ' ').substring(0, 16),
        amountPaid: formData.feeBreakdown.totalPayable,
        paymentStatus: 'PAID',
        bankReference: `BANK-REF-${selectedBank.slice(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
        receiptNumber: `AICTE-RCP-${Date.now().toString().slice(-6)}`,
      };
      setFormData((prev) => ({
        ...prev,
        paymentDetails: payment,
      }));
      setPaymentSuccess(true);
      setIsProcessingPayment(false);
    }, 1200);
  };

  // Final Submit Handler
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.declarationAgreed) {
      alert('Please check and accept the mandatory statutory declaration undertaking before submitting.');
      return;
    }
    if (!formData.paymentDetails || formData.paymentDetails.paymentStatus !== 'PAID') {
      alert('Application fee payment is mandatory prior to official statutory submission.');
      return;
    }

    const submitted = submitCollegeApprovalApplication(
      formData,
      formData.paymentDetails,
      editingDraftAppId || undefined
    );

    closeNewApplicationModal();
    setSelectedApplicationId(submitted.id);
    setActiveTab('application_detail');
  };

  // Step validation
  const canGoNext = () => {
    if (currentStep === 1) {
      return !!formData.institutionName && !!formData.headOfInstitutionName && !!formData.headEmail;
    }
    if (currentStep === 2) {
      return formData.courses.length > 0;
    }
    if (currentStep === 6) {
      return formData.declarationAgreed && !!formData.signatoryName;
    }
    return true;
  };

  const stepsList = [
    { num: 1, title: 'Institution Info', subtitle: 'Registration & Address' },
    { num: 2, title: 'Courses & Intake', subtitle: 'Approved vs Proposed' },
    { num: 3, title: 'Faculty & Infra', subtitle: 'Cadre ratio & facilities' },
    { num: 4, title: 'Compliance & Labs', subtitle: 'Committees & Fire NOC' },
    { num: 5, title: 'Document Vault', subtitle: 'Perpetual Reuse Links' },
    { num: 6, title: 'Declarations', subtitle: 'Statutory Undertaking' },
    { num: 7, title: 'Fee & Payment', subtitle: 'Final Submission' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#172033]/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white border border-[#E5EAF3] rounded-3xl max-w-5xl w-full my-6 overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E5EAF3] flex items-center justify-between bg-white relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center font-black text-lg shadow-sm">
              स
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-[#172033]">
                  AICTE Integrated College Approval Application Form
                </h2>
                <span className="text-[10px] font-bold bg-blue-50 text-[#3867F5] border border-blue-200 px-2 py-0.5 rounded-full">
                  AY 2026-2027
                </span>
                {editingDraftAppId && (
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                    Resumed Draft: {editingDraftAppId}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Official statutory workflow application under Approval Process Handbook (APH 2026-27)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {saveDraftFeedback && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg animate-in fade-in">
                {saveDraftFeedback}
              </span>
            )}
            <button
              onClick={handleSaveDraft}
              className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-[#E5EAF3] text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Save current progress as a draft"
            >
              <Save className="w-3.5 h-3.5 text-blue-600" />
              <span>Save Draft</span>
            </button>
            <button
              onClick={closeNewApplicationModal}
              className="p-1.5 text-[#64748B] hover:text-[#172033] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Steps Progress Bar */}
        <div className="px-6 py-3 bg-[#F8FAFF] border-b border-[#E5EAF3] overflow-x-auto">
          <div className="flex items-center justify-between min-w-[720px] gap-2">
            {stepsList.map((st) => {
              const isActive = currentStep === st.num;
              const isPast = currentStep > st.num;
              return (
                <button
                  key={st.num}
                  onClick={() => setCurrentStep(st.num)}
                  className={`flex items-center gap-2 py-1 px-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white border border-[#3867F5] shadow-xs text-[#3867F5]'
                      : isPast
                      ? 'text-emerald-700 hover:bg-white'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                      isActive
                        ? 'bg-[#3867F5] text-white shadow-2xs'
                        : isPast
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isPast ? <Check className="w-3.5 h-3.5" /> : st.num}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold leading-tight truncate">{st.title}</div>
                    <div className="text-[9px] text-[#64748B] truncate">{st.subtitle}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Body - Scrollable */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: INSTITUTIONAL REGISTRATION & DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-start gap-3">
                <Info className="w-5 h-5 text-[#3867F5] shrink-0 mt-0.5" />
                <div className="text-xs text-[#172033] leading-relaxed">
                  <strong>Section 1: Institutional Identity & Governance.</strong> Enter or verify your official
                  Permanent AICTE Institute ID, registered society or trust information, and campus territorial jurisdiction.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    Permanent AICTE Institute ID *
                  </label>
                  <input
                    type="text"
                    value={formData.permanentId || ''}
                    onChange={(e) => setFormData({ ...formData, permanentId: e.target.value })}
                    className="w-full text-xs font-mono font-bold p-2.5 rounded-xl border border-[#E5EAF3] bg-[#F8FAFF] text-blue-700 focus:bg-white focus:border-[#3867F5] focus:outline-none"
                    placeholder="e.g. 1-3329048101"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    Application Category *
                  </label>
                  <select
                    value={appCategory}
                    onChange={(e) => setAppCategory(e.target.value as ApplicationType)}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-[#E5EAF3] bg-white text-[#172033] focus:border-[#3867F5] focus:outline-none cursor-pointer"
                  >
                    <option value="INTAKE_VARIATION">Increase in Intake / Variation in Existing Courses</option>
                    <option value="EXTENSION_OF_APPROVAL">Extension of Approval (EoA) - Annual Renewal</option>
                    <option value="NEW_PROGRAM">Introduction of New Program / Division</option>
                    <option value="NEW_INSTITUTION">Setting up New Technical Institution</option>
                    <option value="CHANGE_OF_SITE">Change of Site / Location of Technical Campus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    Institution Discipline Type
                  </label>
                  <select
                    value={formData.institutionType}
                    onChange={(e) => setFormData({ ...formData, institutionType: e.target.value as any })}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-[#E5EAF3] bg-white text-[#172033] focus:border-[#3867F5] focus:outline-none cursor-pointer"
                  >
                    <option value="ENGINEERING_AND_TECH">Engineering & Technology</option>
                    <option value="MANAGEMENT">Management (MBA / PGDM)</option>
                    <option value="PHARMACY">Pharmacy (B.Pharm / M.Pharm)</option>
                    <option value="ARCHITECTURE">Architecture & Town Planning</option>
                    <option value="POLYTECHNIC">Polytechnic / Applied Arts</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    Legal Name of Technical Institution *
                  </label>
                  <input
                    type="text"
                    value={formData.institutionName}
                    onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-[#E5EAF3] bg-white text-[#172033] focus:border-[#3867F5] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    Registered Society / Trust Name *
                  </label>
                  <input
                    type="text"
                    value={formData.societyTrustName}
                    onChange={(e) => setFormData({ ...formData, societyTrustName: e.target.value })}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-[#E5EAF3] bg-white text-[#172033] focus:border-[#3867F5] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    Society / Trust Reg. Number
                  </label>
                  <input
                    type="text"
                    value={formData.societyRegNo}
                    onChange={(e) => setFormData({ ...formData, societyRegNo: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#E5EAF3] bg-white text-[#172033] focus:border-[#3867F5] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    Year of Establishment
                  </label>
                  <input
                    type="number"
                    value={formData.establishmentYear}
                    onChange={(e) => setFormData({ ...formData, establishmentYear: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#E5EAF3] bg-white text-[#172033] focus:border-[#3867F5] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    Land Category &amp; Location
                  </label>
                  <select
                    value={formData.landCategory}
                    onChange={(e) => setFormData({ ...formData, landCategory: e.target.value as any })}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-[#E5EAF3] bg-white text-[#172033] focus:border-[#3867F5] focus:outline-none cursor-pointer"
                  >
                    <option value="URBAN">Urban Area (Corporation / Municipal limits)</option>
                    <option value="RURAL">Rural Area (Gram Panchayat / Taluka)</option>
                    <option value="MEGA_CITY">Mega City (National Capital / Metro)</option>
                  </select>
                </div>
              </div>

              {/* Head of Institution Details */}
              <div className="pt-3 border-t border-[#E5EAF3]">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#172033] mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#3867F5]" />
                  Head of Institution (Principal / Director) Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#172033] mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={formData.headOfInstitutionName}
                      onChange={(e) => setFormData({ ...formData, headOfInstitutionName: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E5EAF3] bg-white text-[#172033] focus:border-[#3867F5] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#172033] mb-1">Designation</label>
                    <input
                      type="text"
                      value={formData.headDesignation}
                      onChange={(e) => setFormData({ ...formData, headDesignation: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E5EAF3] bg-white text-[#172033] focus:border-[#3867F5] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#172033] mb-1">Official Email *</label>
                    <input
                      type="email"
                      value={formData.headEmail}
                      onChange={(e) => setFormData({ ...formData, headEmail: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E5EAF3] bg-white text-[#172033] focus:border-[#3867F5] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#172033] mb-1">Mobile Contact</label>
                    <input
                      type="tel"
                      value={formData.headPhone}
                      onChange={(e) => setFormData({ ...formData, headPhone: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E5EAF3] bg-white text-[#172033] focus:border-[#3867F5] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Campus Address & Land Details */}
              <div className="pt-3 border-t border-[#E5EAF3]">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#172033] mb-3 flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-emerald-600" />
                  Campus Location & Physical Land Dimensions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-[#172033] mb-1">Address Line 1</label>
                    <input
                      type="text"
                      value={formData.addressLine1}
                      onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E5EAF3] bg-white text-[#172033] focus:border-[#3867F5] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#172033] mb-1">City / Town</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E5EAF3] bg-white text-[#172033] focus:border-[#3867F5] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                  <div>
                    <label className="block text-xs font-bold text-[#172033] mb-1">State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E5EAF3] bg-white text-[#172033] focus:border-[#3867F5] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#172033] mb-1">Pincode</label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full text-xs font-mono p-2.5 rounded-xl border border-[#E5EAF3] bg-white text-[#172033] focus:border-[#3867F5] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#172033] mb-1">Total Land Area (Acres)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.landAreaAcres}
                      onChange={(e) => setFormData({ ...formData, landAreaAcres: Number(e.target.value) })}
                      className="w-full text-xs font-bold p-2.5 rounded-xl border border-[#E5EAF3] bg-white text-emerald-700 focus:border-[#3867F5] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#172033] mb-1">Total Built-Up Area (Sq. M.)</label>
                    <input
                      type="number"
                      value={formData.builtUpAreaSqM}
                      onChange={(e) => setFormData({ ...formData, builtUpAreaSqM: Number(e.target.value) })}
                      className="w-full text-xs font-bold p-2.5 rounded-xl border border-[#E5EAF3] bg-white text-blue-700 focus:border-[#3867F5] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: COURSE DETAILS & INTAKE */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#F8FAFF] rounded-2xl border border-[#E5EAF3]">
                <div>
                  <h3 className="text-sm font-extrabold text-[#172033]">
                    Programmes, Existing Approved Intake &amp; Proposed Variations
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Configure department-wise sanctioned seats and expansion requests for AY 2026-27.
                  </p>
                </div>
                <button
                  onClick={handleAddCourse}
                  className="px-3.5 py-2 rounded-xl bg-[#3867F5] hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Course / Division</span>
                </button>
              </div>

              {/* Live Summary Bar */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3.5 bg-white rounded-xl border border-[#E5EAF3] shadow-xs text-center">
                  <span className="text-[11px] font-bold text-slate-500 block uppercase">Current Approved</span>
                  <span className="text-xl font-extrabold text-[#172033] font-mono">{totalCurrentIntake} Seats</span>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-[#E5EAF3] shadow-xs text-center">
                  <span className="text-[11px] font-bold text-[#3867F5] block uppercase">Proposed Intake</span>
                  <span className="text-xl font-extrabold text-[#3867F5] font-mono">{totalProposedIntake} Seats</span>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-[#E5EAF3] shadow-xs text-center">
                  <span className="text-[11px] font-bold text-emerald-600 block uppercase">Net Intake Variation</span>
                  <span className="text-xl font-extrabold text-emerald-600 font-mono">
                    {intakeDelta >= 0 ? `+${intakeDelta}` : intakeDelta} Seats
                  </span>
                </div>
              </div>

              {/* Courses Table */}
              <div className="border border-[#E5EAF3] rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFF] border-b border-[#E5EAF3] text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Course / Discipline</th>
                      <th className="px-3 py-3">Level</th>
                      <th className="px-3 py-3 w-28 text-center">Approved Intake</th>
                      <th className="px-3 py-3 w-28 text-center">Proposed Intake</th>
                      <th className="px-3 py-3">NBA Accreditation</th>
                      <th className="px-3 py-3">Affiliating University</th>
                      <th className="px-3 py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5EAF3]">
                    {formData.courses.map((course) => (
                      <tr key={course.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={course.courseName}
                            onChange={(e) => handleCourseChange(course.id, 'courseName', e.target.value)}
                            className="w-full text-xs font-bold text-[#172033] p-1.5 rounded-lg border border-[#E5EAF3] bg-white focus:border-[#3867F5] focus:outline-none"
                          />
                        </td>
                        <td className="px-3 py-3">
                          <select
                            value={course.level}
                            onChange={(e) => handleCourseChange(course.id, 'level', e.target.value)}
                            className="text-xs p-1.5 rounded-lg border border-[#E5EAF3] bg-white font-medium"
                          >
                            <option value="UG">UG (B.Tech / B.E.)</option>
                            <option value="PG">PG (M.Tech / MBA)</option>
                            <option value="DIPLOMA">Diploma</option>
                          </select>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <input
                            type="number"
                            value={course.currentIntake}
                            onChange={(e) => handleCourseChange(course.id, 'currentIntake', Number(e.target.value))}
                            className="w-20 text-xs font-mono font-bold text-center p-1.5 rounded-lg border border-[#E5EAF3] bg-white text-slate-800"
                          />
                        </td>
                        <td className="px-3 py-3 text-center">
                          <input
                            type="number"
                            value={course.proposedIntake}
                            onChange={(e) => handleCourseChange(course.id, 'proposedIntake', Number(e.target.value))}
                            className="w-20 text-xs font-mono font-bold text-center p-1.5 rounded-lg border border-blue-300 bg-blue-50/50 text-[#3867F5]"
                          />
                        </td>
                        <td className="px-3 py-3">
                          <select
                            value={course.accreditationStatus}
                            onChange={(e) => handleCourseChange(course.id, 'accreditationStatus', e.target.value)}
                            className="text-[11px] p-1.5 rounded-lg border border-[#E5EAF3] bg-white font-semibold"
                          >
                            <option value="NBA_ACCREDITED">NBA Accredited</option>
                            <option value="APPLIED">Applied for NBA</option>
                            <option value="NOT_ACCREDITED">Not Accredited</option>
                          </select>
                        </td>
                        <td className="px-3 py-3">
                          <input
                            type="text"
                            value={course.affiliatingUniversity}
                            onChange={(e) => handleCourseChange(course.id, 'affiliatingUniversity', e.target.value)}
                            className="w-full text-xs p-1.5 rounded-lg border border-[#E5EAF3] bg-white text-slate-600 truncate"
                          />
                        </td>
                        <td className="px-3 py-3 text-center">
                          {formData.courses.length > 1 && (
                            <button
                              onClick={() => handleRemoveCourse(course.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                              title="Delete Course"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STEP 3: FACULTY & ACADEMIC INFRASTRUCTURE */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-[#172033] leading-relaxed">
                  <strong>Section 3: Academic Personnel & Instructional Infrastructure.</strong> AICTE APH Chapter VII
                  enforces mandatory faculty cadre ratios (1:2:6), instructional spaces, library cataloging, and computing terminals.
                </div>
              </div>

              {/* Faculty & Staff Matrix */}
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#172033] mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#3867F5]" />
                  Teaching Faculty & Cadre Compliance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#172033] mb-1">
                      Total Full-Time Faculty Count
                    </label>
                    <input
                      type="number"
                      value={formData.facultyCount}
                      onChange={(e) => setFormData({ ...formData, facultyCount: Number(e.target.value) })}
                      className="w-full text-xs font-bold p-2.5 rounded-xl border border-[#E5EAF3] bg-white text-[#172033]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#172033] mb-1">
                      Student-to-Faculty Ratio (SFR)
                    </label>
                    <input
                      type="text"
                      value={formData.studentFacultyRatio}
                      onChange={(e) => setFormData({ ...formData, studentFacultyRatio: e.target.value })}
                      className="w-full text-xs font-mono font-bold p-2.5 rounded-xl border border-[#E5EAF3] bg-white text-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#172033] mb-1">
                      Cadre Ratio (1:2:6) Compliant
                    </label>
                    <select
                      value={formData.cadreRatioCompliant ? 'YES' : 'NO'}
                      onChange={(e) => setFormData({ ...formData, cadreRatioCompliant: e.target.value === 'YES' })}
                      className="w-full text-xs font-bold p-2.5 rounded-xl border border-[#E5EAF3] bg-white text-[#172033]"
                    >
                      <option value="YES">Yes, Compliant (Prof:Assoc:Asst)</option>
                      <option value="NO">No, Deficient in Senior Cadre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#172033] mb-1">
                      Principal Qualified per APH
                    </label>
                    <select
                      value={formData.principalQualified ? 'YES' : 'NO'}
                      onChange={(e) => setFormData({ ...formData, principalQualified: e.target.value === 'YES' })}
                      className="w-full text-xs font-bold p-2.5 rounded-xl border border-[#E5EAF3] bg-white text-[#172033]"
                    >
                      <option value="YES">Yes, Ph.D. with &gt;15y Exp</option>
                      <option value="NO">No, Ad-hoc / In-charge</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Instructional Rooms */}
              <div className="pt-3 border-t border-[#E5EAF3]">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#172033] mb-3 flex items-center gap-2">
                  <Building className="w-4 h-4 text-indigo-600" />
                  Instructional Area (Classrooms, Labs & Workshop)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#172033] mb-1">Classrooms Available</label>
                    <input
                      type="number"
                      value={formData.classroomsCount}
                      onChange={(e) => setFormData({ ...formData, classroomsCount: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E5EAF3] bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#172033] mb-1">Tutorial Rooms</label>
                    <input
                      type="number"
                      value={formData.tutorialRoomsCount}
                      onChange={(e) => setFormData({ ...formData, tutorialRoomsCount: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E5EAF3] bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#172033] mb-1">Laboratories &amp; Workshops</label>
                    <input
                      type="number"
                      value={formData.laboratoriesCount}
                      onChange={(e) => setFormData({ ...formData, laboratoriesCount: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E5EAF3] bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#172033] mb-1">Seminar Halls</label>
                    <input
                      type="number"
                      value={formData.seminarHallsCount}
                      onChange={(e) => setFormData({ ...formData, seminarHallsCount: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E5EAF3] bg-white font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Library & Computing */}
              <div className="pt-3 border-t border-[#E5EAF3]">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#172033] mb-3 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-600" />
                  Library Holdings &amp; Computing Infrastructure
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#172033] mb-1">Library Titles</label>
                    <input
                      type="number"
                      value={formData.libraryBooksCount}
                      onChange={(e) => setFormData({ ...formData, libraryBooksCount: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E5EAF3] bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#172033] mb-1">Journal Subscriptions</label>
                    <input
                      type="number"
                      value={formData.libraryJournalSubscriptions}
                      onChange={(e) => setFormData({ ...formData, libraryJournalSubscriptions: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E5EAF3] bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#172033] mb-1">Student Computers</label>
                    <input
                      type="number"
                      value={formData.computersCount}
                      onChange={(e) => setFormData({ ...formData, computersCount: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E5EAF3] bg-white font-bold text-blue-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#172033] mb-1">Internet Bandwidth (Mbps)</label>
                    <input
                      type="number"
                      value={formData.bandwidthMbps}
                      onChange={(e) => setFormData({ ...formData, bandwidthMbps: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E5EAF3] bg-white font-bold text-emerald-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: COMPLIANCE, COMMITTEES & FIRE SAFETY */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-4 bg-violet-50/60 rounded-2xl border border-violet-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
                <div className="text-xs text-[#172033] leading-relaxed">
                  <strong>Section 4: Mandatory Statutory Bodies & Environmental Health Clearances.</strong> Verify that
                  anti-ragging committees, ICC, grievance cells, barrier-free access, and fire clearance certificates are fully valid.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-[#E5EAF3] bg-[#F8FAFF] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#172033]">Barrier-Free Disabled Campus (Divyangjan)</div>
                    <div className="text-[11px] text-slate-500">Lifts, wheel-chair ramps, and accessible restrooms</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.barrierFreeCampus}
                    onChange={(e) => setFormData({ ...formData, barrierFreeCampus: e.target.checked })}
                    className="w-5 h-5 text-[#3867F5] rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-2xl border border-[#E5EAF3] bg-[#F8FAFF] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#172033]">Valid Fire Safety NOC from State Authority</div>
                    <div className="text-[11px] text-slate-500">Certified by Chief Fire Officer / Municipal Department</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.fireSafetyNOCValid}
                    onChange={(e) => setFormData({ ...formData, fireSafetyNOCValid: e.target.checked })}
                    className="w-5 h-5 text-[#3867F5] rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-2xl border border-[#E5EAF3] bg-[#F8FAFF] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#172033]">Anti-Ragging Committee &amp; Squad Constituted</div>
                    <div className="text-[11px] text-slate-500">Notified under Supreme Court and AICTE Regulations 2009</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.antiRaggingCommitteeConstituted}
                    onChange={(e) => setFormData({ ...formData, antiRaggingCommitteeConstituted: e.target.checked })}
                    className="w-5 h-5 text-[#3867F5] rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-2xl border border-[#E5EAF3] bg-[#F8FAFF] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#172033]">Internal Complaints Committee (ICC) Established</div>
                    <div className="text-[11px] text-slate-500">POSH Act compliance with external NGO representation</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.internalComplaintsCommitteeConstituted}
                    onChange={(e) => setFormData({ ...formData, internalComplaintsCommitteeConstituted: e.target.checked })}
                    className="w-5 h-5 text-[#3867F5] rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-2xl border border-[#E5EAF3] bg-[#F8FAFF] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#172033]">Student Grievance Redressal Committee (SGRC)</div>
                    <div className="text-[11px] text-slate-500">Independent Ombudsperson appointment confirmed</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.grievanceRedressalEstablished}
                    onChange={(e) => setFormData({ ...formData, grievanceRedressalEstablished: e.target.checked })}
                    className="w-5 h-5 text-[#3867F5] rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-2xl border border-[#E5EAF3] bg-[#F8FAFF] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#172033]">SC / ST Prevention of Atrocities Committee</div>
                    <div className="text-[11px] text-slate-500">Notified under Scheduled Castes Welfare Directives</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.scStCommitteeEstablished}
                    onChange={(e) => setFormData({ ...formData, scStCommitteeEstablished: e.target.checked })}
                    className="w-5 h-5 text-[#3867F5] rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: SUPPORTING DOCUMENTS & VAULT REUSE (USP) */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-100 flex items-start gap-3">
                <FolderArchive className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div className="text-xs text-[#172033] leading-relaxed">
                  <strong>Section 5: Compliance Reuse Profile (USP).</strong> Perpetual registered land titles, building
                  completion certificates, and approved master plans are pre-validated from your institutional digital vault.
                  Zero duplicate submissions required.
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#172033] flex items-center justify-between">
                  <span>Linked Documents from Institutional Vault</span>
                  <span className="text-emerald-600 font-bold font-mono">100% Pre-Validated</span>
                </h3>

                <div className="space-y-2.5">
                  {documents
                    .filter((d) => d.institutionId === institution.id)
                    .map((doc) => {
                      const isPerpetual = !doc.expiryDate;
                      return (
                        <div
                          key={doc.id}
                          className="p-3.5 bg-white rounded-xl border border-[#E5EAF3] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#3867F5] flex items-center justify-center font-bold text-xs shrink-0">
                              <FileText className="w-4 h-4 text-[#3867F5]" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-[#172033]">{doc.name}</span>
                                {isPerpetual && (
                                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                                    Perpetual Lifetime Proof
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-[#64748B] font-mono">
                                ID: {doc.id} • Size: {doc.fileSize} • Issue: {doc.issueDate}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-md">
                              Linked for Auto-Reuse
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: STATUTORY DECLARATIONS & AUTHORIZED SIGNATORY */}
          {currentStep === 6 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-[#172033] leading-relaxed">
                  <strong>Section 6: Statutory Undertaking & Legal Declaration.</strong> In accordance with the AICTE Act
                  1987, any false statement or concealed information shall result in immediate withdrawal of approval and
                  forfeiture of the security deposit.
                </div>
              </div>

              {/* Declaration Checkboxes */}
              <div className="p-5 rounded-2xl border border-[#E5EAF3] bg-[#F8FAFF] space-y-4 text-xs text-[#172033]">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.declarationAgreed}
                    onChange={(e) => setFormData({ ...formData, declarationAgreed: e.target.checked })}
                    className="w-5 h-5 text-[#3867F5] rounded border-slate-300 focus:ring-blue-500 mt-0.5 cursor-pointer shrink-0"
                  />
                  <span className="leading-relaxed font-medium">
                    I, on behalf of the sponsoring Society / Trust, solemnly declare that all statements, land dimensions,
                    faculty rosters, and laboratory equipment details furnished herein are authentic and strictly true to
                    the provisions of the AICTE Approval Process Handbook (APH 2026-27).
                  </span>
                </label>

                <div className="pt-3 border-t border-[#E5EAF3] grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#172033] mb-1">
                      Authorized Signatory Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.signatoryName}
                      onChange={(e) => setFormData({ ...formData, signatoryName: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E5EAF3] bg-white font-bold text-[#172033]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#172033] mb-1">
                      Signatory Designation *
                    </label>
                    <input
                      type="text"
                      value={formData.signatoryDesignation}
                      onChange={(e) => setFormData({ ...formData, signatoryDesignation: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E5EAF3] bg-white font-medium text-[#172033]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#172033] mb-1">
                      Digital Execution Date
                    </label>
                    <input
                      type="text"
                      disabled
                      value={formData.signatureDate}
                      className="w-full text-xs font-mono font-bold p-2.5 rounded-xl border border-[#E5EAF3] bg-slate-100 text-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: APPLICATION SUMMARY, CONFIGURABLE FEE & PAYMENT */}
          {currentStep === 7 && (
            <div className="space-y-6 animate-in fade-in">
              {/* Fee Schedule Card */}
              <div className="bg-white rounded-2xl border border-[#E5EAF3] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E5EAF3] pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#3867F5]">
                      Official Tariff Schedule
                    </span>
                    <h3 className="text-sm font-extrabold text-[#172033]">
                      Statutory Regulatory Application Fee Schedule
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    APH Clause Ref: 2.3.2
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-[#F8FAFF] rounded-xl border border-[#E5EAF3]">
                    <span className="text-slate-500 block text-[11px]">Base Processing Fee</span>
                    <span className="text-base font-extrabold text-[#172033] font-mono mt-0.5 block">
                      ₹{formData.feeBreakdown.baseRegulatoryFee.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-3 bg-[#F8FAFF] rounded-xl border border-[#E5EAF3]">
                    <span className="text-slate-500 block text-[11px]">Inspection / EVC Fee</span>
                    <span className="text-base font-extrabold text-[#172033] font-mono mt-0.5 block">
                      ₹{formData.feeBreakdown.inspectionFee.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-3 bg-[#F8FAFF] rounded-xl border border-[#E5EAF3]">
                    <span className="text-slate-500 block text-[11px]">Goods &amp; Services Tax (18%)</span>
                    <span className="text-base font-extrabold text-slate-700 font-mono mt-0.5 block">
                      ₹{formData.feeBreakdown.gstAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200">
                    <span className="text-blue-800 font-bold block text-[11px]">Total Amount Payable</span>
                    <span className="text-xl font-black text-[#3867F5] font-mono mt-0.5 block">
                      ₹{formData.feeBreakdown.totalPayable.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-[#64748B]">
                  * Prototype fee schedule configured based on verified AICTE APH tariff benchmarks for technical category:
                  <strong> {formData.feeBreakdown.applicationCategory}</strong>.
                </p>
              </div>

              {/* Payment Processing Section */}
              <div className="bg-white rounded-2xl border border-[#E5EAF3] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E5EAF3] pb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#3867F5]" />
                    <h3 className="text-sm font-extrabold text-[#172033]">
                      Payment Gateway Integration (Simulated)
                    </h3>
                  </div>
                  {paymentSuccess ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Payment Verified (PAID)
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                      Payment Pending
                    </span>
                  )}
                </div>

                {!paymentSuccess ? (
                  <div className="space-y-4">
                    {/* Mode Selector */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      {[
                        { id: 'NET_BANKING', label: 'Net Banking (SBI / HDFC)' },
                        { id: 'NEFT_RTGS', label: 'Corporate NEFT / RTGS' },
                        { id: 'UPI', label: 'UPI / Bharat QR' },
                        { id: 'TREASURY_CHALLAN', label: 'State Treasury Challan' },
                      ].map((mode) => (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setSelectedPaymentMode(mode.id as any)}
                          className={`p-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                            selectedPaymentMode === mode.id
                              ? 'bg-blue-50 border-[#3867F5] text-[#3867F5] shadow-xs'
                              : 'bg-white border-[#E5EAF3] text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#F8FAFF] rounded-2xl border border-[#E5EAF3]">
                      <div className="text-xs text-slate-600">
                        Payable amount: <strong className="text-base text-[#172033] font-mono">₹{formData.feeBreakdown.totalPayable.toLocaleString('en-IN')}</strong> via {selectedPaymentMode.replace(/_/g, ' ')}.
                      </div>

                      <button
                        type="button"
                        onClick={handleSimulatePayment}
                        disabled={isProcessingPayment}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        {isProcessingPayment ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Processing Simulated Payment...</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4" />
                            <span>Pay Application Fee (₹{formData.feeBreakdown.totalPayable.toLocaleString('en-IN')})</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs text-[#172033] space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-extrabold text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Electronic Payment Acknowledged
                      </span>
                      <span className="font-mono text-emerald-700 font-bold">
                        Receipt No: {formData.paymentDetails?.receiptNumber}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1 font-mono">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Transaction ID</span>
                        <span className="font-bold text-[#172033]">{formData.paymentDetails?.transactionId}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Amount Credited</span>
                        <span className="font-bold text-emerald-700">₹{formData.paymentDetails?.amountPaid.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Bank Timestamp</span>
                        <span className="text-slate-700 text-[11px]">{formData.paymentDetails?.paymentDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Payment Mode</span>
                        <span className="text-slate-700">{formData.paymentDetails?.paymentMode}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-white border-t border-[#E5EAF3] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#64748B]">Step {currentStep} of 7:</span>
            <span className="font-bold text-[#172033]">{stepsList[currentStep - 1].title}</span>
          </div>

          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-[#E5EAF3] hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            {currentStep < 7 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                disabled={!canGoNext()}
                className="px-5 py-2 text-xs font-extrabold rounded-xl bg-[#3867F5] hover:bg-blue-600 disabled:opacity-40 text-white transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Save &amp; Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={!paymentSuccess || !formData.declarationAgreed}
                className="px-6 py-2.5 text-xs font-extrabold rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 disabled:opacity-40 text-white transition-all flex items-center gap-2 shadow-md cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Final Submit to AICTE (Pending Scrutiny)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

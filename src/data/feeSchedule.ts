import { ApplicationType, CollegeApprovalFeeBreakdown } from '../types';

export interface FeeScheduleItem {
  type: ApplicationType;
  categoryLabel: string;
  baseRegulatoryFee: number;
  inspectionFee: number;
  gstRatePercent: number;
  referenceClause: string;
  description: string;
}

export const AICTE_FEE_SCHEDULE: Record<ApplicationType, FeeScheduleItem> = {
  EXTENSION_OF_APPROVAL: {
    type: 'EXTENSION_OF_APPROVAL',
    categoryLabel: 'Extension of Approval (EoA) - Annual Renewal',
    baseRegulatoryFee: 100000,
    inspectionFee: 0,
    gstRatePercent: 18,
    referenceClause: 'AICTE APH 2026-27 Chapter I, Clause 1.4.1 (Annual Regulatory Processing Fee)',
    description: 'Statutory scrutiny fee for continuation of existing approved technical courses without intake expansion.',
  },
  INTAKE_VARIATION: {
    type: 'INTAKE_VARIATION',
    categoryLabel: 'Increase in Intake / Variation in Existing Courses',
    baseRegulatoryFee: 200000,
    inspectionFee: 25000,
    gstRatePercent: 18,
    referenceClause: 'AICTE APH 2026-27 Chapter II, Clause 2.3.2 (Course Augmentation & EVC Roster Fee)',
    description: 'Processing and technical verification fee for increasing sanctioned seats in accredited/eligible departments.',
  },
  NEW_PROGRAM: {
    type: 'NEW_PROGRAM',
    categoryLabel: 'Introduction of New Technical Program / Division',
    baseRegulatoryFee: 300000,
    inspectionFee: 35000,
    gstRatePercent: 18,
    referenceClause: 'AICTE APH 2026-27 Chapter II, Clause 2.5 (New Discipline Inception & Scrutiny Fee)',
    description: 'Statutory fee for establishing a new discipline (e.g. Artificial Intelligence, Data Science, Robotics).',
  },
  NEW_INSTITUTION: {
    type: 'NEW_INSTITUTION',
    categoryLabel: 'Establishment of New Technical Institution',
    baseRegulatoryFee: 500000,
    inspectionFee: 50000,
    gstRatePercent: 18,
    referenceClause: 'AICTE APH 2026-27 Chapter I, Clause 1.1 (Greenfield Institution Approval & EVC Fee)',
    description: 'Comprehensive regulatory processing, master plan validation, and physical inspection panel fee.',
  },
  CHANGE_OF_SITE: {
    type: 'CHANGE_OF_SITE',
    categoryLabel: 'Change of Site / Location of Technical Campus',
    baseRegulatoryFee: 250000,
    inspectionFee: 25000,
    gstRatePercent: 18,
    referenceClause: 'AICTE APH 2026-27 Chapter II, Clause 2.8 (Campus Relocation Scrutiny Fee)',
    description: 'Fee for land title verification, municipal clearances, and campus relocation inspection.',
  },
};

export function calculateApplicationFee(type: ApplicationType): CollegeApprovalFeeBreakdown {
  const item = AICTE_FEE_SCHEDULE[type] || AICTE_FEE_SCHEDULE.INTAKE_VARIATION;
  const taxableAmount = item.baseRegulatoryFee + item.inspectionFee;
  const gstAmount = Math.round((taxableAmount * item.gstRatePercent) / 100);
  const totalPayable = taxableAmount + gstAmount;

  return {
    applicationCategory: item.categoryLabel,
    baseRegulatoryFee: item.baseRegulatoryFee,
    inspectionFee: item.inspectionFee,
    gstAmount,
    totalPayable,
  };
}

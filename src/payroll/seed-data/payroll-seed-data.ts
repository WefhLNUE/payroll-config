/**
 * Payroll configuration seed data (Milestone 1 integration demo)
 */

// PayType ---------------------------------------------------------------
export interface PayTypeSeed {
  _id: string;
  name: string;
  description?: string;
  type: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'contract-based';
  contractStartDate?: string | null;
  contractEndDate?: string | null;
  createdBy: string;
  approvedBy?: string | null;
  approvalDate?: string | null;
  status: 'draft' | 'approved' | 'rejected';
  rejectionReason?: string | null;
  notes?: string | null;
}

/** Sample pay type records */
export const payTypeSeedData: PayTypeSeed[] = [
  {
    _id: 'payt-001',
    name: 'Monthly Full-Time',
    description: 'Standard monthly salary for Cairo HQ employees',
    type: 'monthly',
    contractStartDate: null,
    contractEndDate: null,
    createdBy: 'user-payroll-spec-001',
    approvedBy: 'user-payroll-mgr-001',
    approvalDate: '2025-01-10T09:00:00.000Z',
    status: 'approved',
    notes: 'Default pay type for headcount roles'
  },
  {
    _id: 'payt-002',
    name: 'Hourly Retail Staff',
    description: 'Hourly compensation for weekend retail shifts',
    type: 'hourly',
    contractStartDate: null,
    contractEndDate: null,
    createdBy: 'user-payroll-spec-001',
    approvedBy: null,
    approvalDate: null,
    status: 'draft',
    notes: 'Awaiting payroll manager sign-off'
  },
  {
    _id: 'payt-003',
    name: 'Project Contractor',
    description: 'Fixed-term contract for Alexandria data center build',
    type: 'contract-based',
    contractStartDate: '2025-02-01T00:00:00.000Z',
    contractEndDate: '2025-11-30T23:59:59.000Z',
    createdBy: 'user-payroll-spec-002',
    approvedBy: 'user-payroll-mgr-001',
    approvalDate: '2025-01-25T12:00:00.000Z',
    status: 'approved',
    notes: '11-month EPC contract'
  }
];

// Tax -------------------------------------------------------------------
export interface TaxBracketSeed {
  minIncome: number;
  maxIncome: number | null;
  rate: number;
  fixedAmount: number;
}

export interface TaxSeed {
  _id: string;
  taxYear: number;
  country: string;
  effectiveFrom: string;
  effectiveTo?: string | null;
  taxType: 'income_tax' | 'social_insurance' | 'stamp_duty' | 'health_insurance';
  brackets: TaxBracketSeed[];
  personalExemption: number;
  dependentExemption: number;
  standardDeduction: number;
  maxAnnualTax?: number | null;
  minTaxableIncome: number;
  configuredBy: string;
  approvedBy?: string | null;
  approvalDate?: string | null;
  status: 'draft' | 'approved' | 'rejected';
  rejectionReason?: string | null;
  isActive: boolean;
  notes?: string | null;
}

/** Sample tax configurations */
export const taxSeedData: TaxSeed[] = [
  {
    _id: 'tax-001',
    taxYear: 2025,
    country: 'Egypt',
    effectiveFrom: '2025-01-01T00:00:00.000Z',
    effectiveTo: null,
    taxType: 'income_tax',
    brackets: [
      { minIncome: 0, maxIncome: 15000, rate: 0, fixedAmount: 0 },
      { minIncome: 15000, maxIncome: 30000, rate: 2.5, fixedAmount: 0 },
      { minIncome: 30000, maxIncome: 45000, rate: 10, fixedAmount: 375 },
      { minIncome: 45000, maxIncome: 200000, rate: 15, fixedAmount: 1875 },
      { minIncome: 200000, maxIncome: null, rate: 22.5, fixedAmount: 25000 }
    ],
    personalExemption: 9000,
    dependentExemption: 4500,
    standardDeduction: 7000,
    maxAnnualTax: null,
    minTaxableIncome: 15000,
    configuredBy: 'user-legal-admin-001',
    approvedBy: 'user-payroll-mgr-001',
    approvalDate: '2024-12-18T10:00:00.000Z',
    status: 'approved',
    rejectionReason: null,
    isActive: true,
    notes: 'Aligned with Egyptian Income Tax Law 2025'
  },
  {
    _id: 'tax-002',
    taxYear: 2025,
    country: 'Egypt',
    effectiveFrom: '2025-01-01T00:00:00.000Z',
    effectiveTo: null,
    taxType: 'social_insurance',
    brackets: [
      { minIncome: 0, maxIncome: 10000, rate: 11, fixedAmount: 0 },
      { minIncome: 10000, maxIncome: 40000, rate: 14, fixedAmount: 1100 },
      { minIncome: 40000, maxIncome: null, rate: 18, fixedAmount: 5300 }
    ],
    personalExemption: 0,
    dependentExemption: 0,
    standardDeduction: 0,
    maxAnnualTax: 60000,
    minTaxableIncome: 1000,
    configuredBy: 'user-legal-admin-002',
    approvedBy: 'user-payroll-mgr-002',
    approvalDate: '2025-01-05T09:00:00.000Z',
    status: 'approved',
    rejectionReason: null,
    isActive: false,
    notes: 'Awaiting Ministry of Manpower circular'
  }
];

// InsuranceBracket ------------------------------------------------------
export interface InsuranceBracketSeed {
  _id: string;
  insuranceType: 'health' | 'social' | 'pension' | 'unemployment';
  name: string;
  description?: string;
  salaryRangeMin: number;
  salaryRangeMax?: number | null;
  employeeContributionPercentage: number;
  employerContributionPercentage: number;
  effectiveFrom: string;
  effectiveTo?: string | null;
  createdBy: string;
  approvedBy?: string | null;
  approvalDate?: string | null;
  status: 'draft' | 'approved' | 'rejected';
  rejectionReason?: string | null;
  isActive: boolean;
  notes?: string | null;
}

/** Sample insurance bracket data */
export const insuranceBracketSeedData: InsuranceBracketSeed[] = [
  {
    _id: 'ins-001',
    insuranceType: 'social',
    name: 'Social Bracket A',
    description: 'Employees earning up to 10,000 EGP',
    salaryRangeMin: 0,
    salaryRangeMax: 10000,
    employeeContributionPercentage: 11,
    employerContributionPercentage: 18.75,
    effectiveFrom: '2025-01-01T00:00:00.000Z',
    effectiveTo: null,
    createdBy: 'user-payroll-spec-001',
    approvedBy: 'user-hr-mgr-001',
    approvalDate: '2024-12-22T09:00:00.000Z',
    status: 'approved',
    rejectionReason: null,
    isActive: true,
    notes: 'Default social insurance bracket'
  },
  {
    _id: 'ins-002',
    insuranceType: 'health',
    name: 'Health Universal',
    description: 'Health coverage for all salary bands',
    salaryRangeMin: 0,
    salaryRangeMax: null,
    employeeContributionPercentage: 1,
    employerContributionPercentage: 4,
    effectiveFrom: '2025-01-01T00:00:00.000Z',
    effectiveTo: null,
    createdBy: 'user-payroll-spec-001',
    approvedBy: null,
    approvalDate: null,
    status: 'draft',
    rejectionReason: null,
    isActive: false,
    notes: 'Pending HR policy approval'
  },
  {
    _id: 'ins-003',
    insuranceType: 'pension',
    name: 'Pension Tier B',
    description: 'Employees earning above 40,000 EGP',
    salaryRangeMin: 40000,
    salaryRangeMax: null,
    employeeContributionPercentage: 12,
    employerContributionPercentage: 18,
    effectiveFrom: '2025-03-01T00:00:00.000Z',
    effectiveTo: null,
    createdBy: 'user-payroll-spec-002',
    approvedBy: 'user-hr-mgr-002',
    approvalDate: '2025-02-15T10:00:00.000Z',
    status: 'approved',
    rejectionReason: null,
    isActive: true,
    notes: 'Applies to executive payroll'
  }
];

// SigningBonus ----------------------------------------------------------
export interface SigningBonusSeed {
  _id: string;
  employeeId: string;
  contractId: string;
  amount: number;
  approvedAmount?: number | null;
  bonusType: 'one-time' | 'split';
  paymentTerms?: string | null;
  createdBy: string;
  reviewedBy?: string | null;
  reviewedDate?: string | null;
  approvedBy?: string | null;
  approvedDate?: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  paymentDate?: string | null;
  payrollCycleId?: string | null;
  rejectionReason?: string | null;
  editHistory: {
    editedBy: string;
    editedDate: string;
    previousAmount: number;
    newAmount: number;
    reason: string;
  }[];
  notes?: string | null;
}

/** Sample signing bonus data */
export const signingBonusSeedData: SigningBonusSeed[] = [
  {
    _id: 'sign-001',
    employeeId: 'emp-001',
    contractId: 'contract-001',
    amount: 50000,
    approvedAmount: 50000,
    bonusType: 'one-time',
    paymentTerms: '100% upon joining',
    createdBy: 'user-hr-001',
    reviewedBy: 'user-payroll-spec-001',
    reviewedDate: '2025-01-05T09:00:00.000Z',
    approvedBy: 'user-payroll-mgr-001',
    approvedDate: '2025-01-06T09:30:00.000Z',
    status: 'paid',
    paymentDate: '2025-01-10T00:00:00.000Z',
    payrollCycleId: 'cycle-2025-01',
    rejectionReason: null,
    editHistory: [],
    notes: 'Senior engineer joining bonus'
  },
  {
    _id: 'sign-002',
    employeeId: 'emp-002',
    contractId: 'contract-002',
    amount: 30000,
    approvedAmount: null,
    bonusType: 'split',
    paymentTerms: '50% after probation, 50% after 6 months',
    createdBy: 'user-hr-001',
    reviewedBy: null,
    reviewedDate: null,
    approvedBy: null,
    approvedDate: null,
    status: 'pending',
    paymentDate: null,
    payrollCycleId: null,
    rejectionReason: null,
    editHistory: [],
    notes: 'Marketing manager pending approval'
  },
  {
    _id: 'sign-003',
    employeeId: 'emp-004',
    contractId: 'contract-004',
    amount: 20000,
    approvedAmount: 18000,
    bonusType: 'one-time',
    paymentTerms: 'Adjusted after negotiation',
    createdBy: 'user-hr-002',
    reviewedBy: 'user-payroll-spec-002',
    reviewedDate: '2025-02-01T12:00:00.000Z',
    approvedBy: 'user-payroll-mgr-001',
    approvedDate: '2025-02-02T08:00:00.000Z',
    status: 'approved',
    paymentDate: null,
    payrollCycleId: null,
    rejectionReason: null,
    editHistory: [
      {
        editedBy: 'user-payroll-spec-002',
        editedDate: '2025-02-01T12:00:00.000Z',
        previousAmount: 20000,
        newAmount: 18000,
        reason: 'Budget alignment with hiring manager'
      }
    ],
    notes: 'For contract analyst role'
  }
];

// TerminationBenefit ----------------------------------------------------
export interface TerminationBenefitSeed {
  _id: string;
  employeeId: string;
  offboardingId: string;
  terminationType: 'voluntary_resignation' | 'involuntary_termination' | 'mutual_agreement' | 'end_of_contract';
  terminationDate: string;
  yearsOfService: number;
  lastBaseSalary: number;
  severancePay: number;
  endOfServiceGratuity: number;
  pendingAllowances: number;
  unusedLeaveEncashment: number;
  noticePeriodPay: number;
  totalBenefitAmount: number;
  approvedBenefitAmount?: number | null;
  calculationNotes?: string | null;
  createdBy: string;
  reviewedBy?: string | null;
  reviewedDate?: string | null;
  approvedBy?: string | null;
  approvedDate?: string | null;
  hrClearanceStatus: 'pending' | 'cleared' | 'blocked';
  hrClearanceDate?: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  paymentDate?: string | null;
  payrollCycleId?: string | null;
  rejectionReason?: string | null;
  editHistory: {
    editedBy: string;
    editedDate: string;
    previousAmount: number;
    newAmount: number;
    reason: string;
  }[];
  notes?: string | null;
}

/** Sample termination benefits */
export const terminationBenefitSeedData: TerminationBenefitSeed[] = [
  {
    _id: 'term-001',
    employeeId: 'emp-003',
    offboardingId: 'offboard-001',
    terminationType: 'voluntary_resignation',
    terminationDate: '2025-01-31T00:00:00.000Z',
    yearsOfService: 5.5,
    lastBaseSalary: 25000,
    severancePay: 0,
    endOfServiceGratuity: 68750,
    pendingAllowances: 5000,
    unusedLeaveEncashment: 12000,
    noticePeriodPay: 25000,
    totalBenefitAmount: 110750,
    approvedBenefitAmount: 110750,
    calculationNotes: 'Gratuity 5.5 yrs × 25k × 0.5 + outstanding items',
    createdBy: 'user-hr-001',
    reviewedBy: 'user-payroll-spec-001',
    reviewedDate: '2025-01-25T10:00:00.000Z',
    approvedBy: 'user-payroll-mgr-001',
    approvedDate: '2025-01-26T11:00:00.000Z',
    hrClearanceStatus: 'cleared',
    hrClearanceDate: '2025-01-24T14:00:00.000Z',
    status: 'approved',
    paymentDate: null,
    payrollCycleId: 'cycle-2025-02',
    rejectionReason: null,
    editHistory: [],
    notes: 'Finalize with Feb payroll run'
  },
  {
    _id: 'term-002',
    employeeId: 'emp-005',
    offboardingId: 'offboard-002',
    terminationType: 'involuntary_termination',
    terminationDate: '2025-02-15T00:00:00.000Z',
    yearsOfService: 2,
    lastBaseSalary: 18000,
    severancePay: 36000,
    endOfServiceGratuity: 0,
    pendingAllowances: 0,
    unusedLeaveEncashment: 3000,
    noticePeriodPay: 0,
    totalBenefitAmount: 39000,
    approvedBenefitAmount: null,
    calculationNotes: 'Severance = 2 months base pay per policy',
    createdBy: 'user-hr-002',
    reviewedBy: null,
    reviewedDate: null,
    approvedBy: null,
    approvedDate: null,
    hrClearanceStatus: 'pending',
    hrClearanceDate: null,
    status: 'pending',
    paymentDate: null,
    payrollCycleId: null,
    rejectionReason: null,
    editHistory: [],
    notes: 'Requires HR clearance before processing'
  },
  {
    _id: 'term-003',
    employeeId: 'emp-006',
    offboardingId: 'offboard-003',
    terminationType: 'end_of_contract',
    terminationDate: '2025-12-31T23:59:59.000Z',
    yearsOfService: 3,
    lastBaseSalary: 30000,
    severancePay: 0,
    endOfServiceGratuity: 45000,
    pendingAllowances: 10000,
    unusedLeaveEncashment: 4800,
    noticePeriodPay: 0,
    totalBenefitAmount: 59800,
    approvedBenefitAmount: 59800,
    calculationNotes: 'Contract completion gratuity plus allowances',
    createdBy: 'user-hr-003',
    reviewedBy: 'user-payroll-spec-003',
    reviewedDate: '2025-12-20T09:00:00.000Z',
    approvedBy: 'user-payroll-mgr-002',
    approvedDate: '2025-12-21T10:00:00.000Z',
    hrClearanceStatus: 'cleared',
    hrClearanceDate: '2025-12-20T10:00:00.000Z',
    status: 'paid',
    paymentDate: '2026-01-05T00:00:00.000Z',
    payrollCycleId: 'cycle-2026-01',
    rejectionReason: null,
    editHistory: [],
    notes: 'Paid with January 2026 payroll'
  }
];

// RoleAccessControl -----------------------------------------------------
export interface RoleAccessControlSeed {
  _id: string;
  roleName: 'payroll_specialist' | 'payroll_manager' | 'hr_manager' | 'finance_staff' | 'legal_admin' | 'system_admin' | 'employee';
  moduleAccess: {
    payrollConfiguration: boolean;
    payrollExecution: boolean;
    payrollTracking: boolean;
    employeeProfile: boolean;
    leaves: boolean;
    timeManagement: boolean;
    organizationalStructure: boolean;
    recruitment: boolean;
    onboarding: boolean;
    offboarding: boolean;
    performance: boolean;
  };
  permissions: {
    canCreate: boolean;
    canView: boolean;
    canEdit: boolean;
    canApprove: boolean;
    canReject: boolean;
    canDelete: boolean;
    canFreeze: boolean;
    canUnfreeze: boolean;
    canGenerateReports: boolean;
  };
  specificEntities: string[];
  dataScope: 'all' | 'department' | 'self';
  isActive: boolean;
  createdBy: string;
  notes?: string | null;
}

/** Sample role access configurations */
export const roleAccessControlSeedData: RoleAccessControlSeed[] = [
  {
    _id: 'role-ps-001',
    roleName: 'payroll_specialist',
    moduleAccess: {
      payrollConfiguration: true,
      payrollExecution: true,
      payrollTracking: true,
      employeeProfile: true,
      leaves: false,
      timeManagement: false,
      organizationalStructure: false,
      recruitment: false,
      onboarding: true,
      offboarding: true,
      performance: false
    },
    permissions: {
      canCreate: true,
      canView: true,
      canEdit: true,
      canApprove: false,
      canReject: false,
      canDelete: false,
      canFreeze: false,
      canUnfreeze: false,
      canGenerateReports: true
    },
    specificEntities: ['PayType', 'InsuranceBracket', 'SigningBonus', 'TerminationBenefit', 'Payslip'],
    dataScope: 'all',
    isActive: true,
    createdBy: 'user-system-admin-001',
    notes: 'Operational payroll configuration access'
  },
  {
    _id: 'role-pm-001',
    roleName: 'payroll_manager',
    moduleAccess: {
      payrollConfiguration: true,
      payrollExecution: true,
      payrollTracking: true,
      employeeProfile: true,
      leaves: true,
      timeManagement: true,
      organizationalStructure: true,
      recruitment: false,
      onboarding: true,
      offboarding: true,
      performance: false
    },
    permissions: {
      canCreate: true,
      canView: true,
      canEdit: true,
      canApprove: true,
      canReject: true,
      canDelete: false,
      canFreeze: true,
      canUnfreeze: true,
      canGenerateReports: true
    },
    specificEntities: ['PayType', 'Tax', 'InsuranceBracket', 'SigningBonus', 'TerminationBenefit', 'Payslip'],
    dataScope: 'all',
    isActive: true,
    createdBy: 'user-system-admin-001',
    notes: 'Decision authority for approvals'
  },
  {
    _id: 'role-emp-001',
    roleName: 'employee',
    moduleAccess: {
      payrollConfiguration: false,
      payrollExecution: false,
      payrollTracking: true,
      employeeProfile: true,
      leaves: true,
      timeManagement: true,
      organizationalStructure: false,
      recruitment: false,
      onboarding: false,
      offboarding: false,
      performance: false
    },
    permissions: {
      canCreate: false,
      canView: true,
      canEdit: false,
      canApprove: false,
      canReject: false,
      canDelete: false,
      canFreeze: false,
      canUnfreeze: false,
      canGenerateReports: false
    },
    specificEntities: ['Payslip'],
    dataScope: 'self',
    isActive: true,
    createdBy: 'user-system-admin-001',
    notes: 'View-only access for employees'
  }
];

// Payslip --------------------------------------------------------------
export interface PayslipSeed {
  _id: string;
  employeeId: string;
  payrollCycleId: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  payPeriodMonth: number;
  payPeriodYear: number;
  generatedDate: string;
  payDate: string;
  baseSalary: number;
  allowances: string[];
  totalAllowances: number;
  signingBonusId?: string | null;
  signingBonusAmount: number;
  resignationBenefitId?: string | null;
  resignationBenefitAmount: number;
  terminationBenefitId?: string | null;
  terminationBenefitAmount: number;
  leaveCompensation: number;
  grossSalary: number;
  deductions: string[];
  totalDeductions: number;
  taxBracketId: string;
  taxDeduction: number;
  insuranceBracketId: string;
  insuranceDeduction: number;
  penalties: {
    unpaidDays: number;
    missingHours: number;
    misconductPenalties: number;
    totalPenalties: number;
  };
  breakdown: {
    grossSalary: number;
    totalAllowances: number;
    totalBonuses: number;
    leaveCompensation: number;
    totalBenefits: number;
    totalEarnings: number;
    taxDeduction: number;
    insuranceDeduction: number;
    otherDeductions: number;
    totalPenalties: number;
    totalDeductions: number;
    netSalary: number;
  };
  netSalary: number;
  status: 'draft' | 'under_review' | 'approved' | 'locked' | 'paid' | 'rejected';
  downloadUrl?: string | null;
  notes?: string | null;
}

/** Sample payslip data */
export const payslipSeedData: PayslipSeed[] = [
  {
    _id: 'payslip-001',
    employeeId: 'emp-001',
    payrollCycleId: 'cycle-2025-01',
    payPeriodStart: '2025-01-01T00:00:00.000Z',
    payPeriodEnd: '2025-01-31T23:59:59.000Z',
    payPeriodMonth: 1,
    payPeriodYear: 2025,
    generatedDate: '2025-02-01T08:00:00.000Z',
    payDate: '2025-02-05T00:00:00.000Z',
    baseSalary: 35000,
    allowances: ['allowance-001', 'allowance-002'],
    totalAllowances: 5000,
    signingBonusId: 'sign-001',
    signingBonusAmount: 50000,
    resignationBenefitId: null,
    resignationBenefitAmount: 0,
    terminationBenefitId: null,
    terminationBenefitAmount: 0,
    leaveCompensation: 0,
    grossSalary: 90000,
    deductions: ['deduction-001'],
    totalDeductions: 2000,
    taxBracketId: 'tax-001',
    taxDeduction: 11250,
    insuranceBracketId: 'ins-001',
    insuranceDeduction: 3850,
    penalties: { unpaidDays: 0, missingHours: 0, misconductPenalties: 0, totalPenalties: 0 },
    breakdown: {
      grossSalary: 35000,
      totalAllowances: 5000,
      totalBonuses: 50000,
      leaveCompensation: 0,
      totalBenefits: 0,
      totalEarnings: 90000,
      taxDeduction: 11250,
      insuranceDeduction: 3850,
      otherDeductions: 2000,
      totalPenalties: 0,
      totalDeductions: 17100,
      netSalary: 72900
    },
    netSalary: 72900,
    status: 'paid',
    downloadUrl: 'https://payroll.example.com/payslips/cycle-2025-01/emp-001.pdf',
    notes: 'Includes signing bonus payout'
  },
  {
    _id: 'payslip-002',
    employeeId: 'emp-002',
    payrollCycleId: 'cycle-2025-02',
    payPeriodStart: '2025-02-01T00:00:00.000Z',
    payPeriodEnd: '2025-02-28T23:59:59.000Z',
    payPeriodMonth: 2,
    payPeriodYear: 2025,
    generatedDate: '2025-03-01T07:00:00.000Z',
    payDate: '2025-03-05T00:00:00.000Z',
    baseSalary: 28000,
    allowances: ['allowance-003'],
    totalAllowances: 2000,
    signingBonusId: 'sign-002',
    signingBonusAmount: 0,
    resignationBenefitId: null,
    resignationBenefitAmount: 0,
    terminationBenefitId: null,
    terminationBenefitAmount: 0,
    leaveCompensation: 0,
    grossSalary: 30000,
    deductions: ['deduction-002'],
    totalDeductions: 1000,
    taxBracketId: 'tax-001',
    taxDeduction: 2500,
    insuranceBracketId: 'ins-001',
    insuranceDeduction: 3300,
    penalties: { unpaidDays: 2, missingHours: 4, misconductPenalties: 0, totalPenalties: 2545.45 },
    breakdown: {
      grossSalary: 28000,
      totalAllowances: 2000,
      totalBonuses: 0,
      leaveCompensation: 0,
      totalBenefits: 0,
      totalEarnings: 30000,
      taxDeduction: 2500,
      insuranceDeduction: 3300,
      otherDeductions: 1000,
      totalPenalties: 2545.45,
      totalDeductions: 9345.45,
      netSalary: 20654.55
    },
    netSalary: 20654.55,
    status: 'approved',
    downloadUrl: null,
    notes: 'Attendance penalties applied'
  },
  {
    _id: 'payslip-003',
    employeeId: 'emp-003',
    payrollCycleId: 'cycle-2025-01',
    payPeriodStart: '2025-01-01T00:00:00.000Z',
    payPeriodEnd: '2025-01-31T23:59:59.000Z',
    payPeriodMonth: 1,
    payPeriodYear: 2025,
    generatedDate: '2025-02-02T10:00:00.000Z',
    payDate: '2025-02-10T00:00:00.000Z',
    baseSalary: 25000,
    allowances: ['allowance-004'],
    totalAllowances: 2000,
    signingBonusId: null,
    signingBonusAmount: 0,
    resignationBenefitId: null,
    resignationBenefitAmount: 0,
    terminationBenefitId: 'term-001',
    terminationBenefitAmount: 110750,
    leaveCompensation: 12000,
    grossSalary: 149750,
    deductions: ['deduction-003'],
    totalDeductions: 5000,
    taxBracketId: 'tax-001',
    taxDeduction: 21000,
    insuranceBracketId: 'ins-001',
    insuranceDeduction: 4125,
    penalties: { unpaidDays: 7, missingHours: 12, misconductPenalties: 500, totalPenalties: 8454.55 },
    breakdown: {
      grossSalary: 25000,
      totalAllowances: 2000,
      totalBonuses: 0,
      leaveCompensation: 12000,
      totalBenefits: 110750,
      totalEarnings: 149750,
      taxDeduction: 21000,
      insuranceDeduction: 4125,
      otherDeductions: 5000,
      totalPenalties: 8454.55,
      totalDeductions: 38579.55,
      netSalary: 111170.45
    },
    netSalary: 111170.45,
    status: 'locked',
    downloadUrl: null,
    notes: 'Termination payout pending finance review'
  }
];

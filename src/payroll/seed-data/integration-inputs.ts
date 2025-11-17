/**
 * Dummy integration inputs received by the Payroll Configuration subsystem
 */

// Employee Profile -----------------------------------------------------
export interface EmployeeProfileInput {
  employeeId: string;
  fullName: string;
  nationalId: string;
  department: string;
  position: string;
  baseSalary: number;
  hireDate: string;
  employmentStatus: 'active' | 'terminated' | 'on_leave';
  payTypeId: string;
  bankAccountNumber: string;
  bankName: string;
  taxId: string;
  socialInsuranceNumber: string;
  notes?: string;
}

/** Employee records received from Employee Profile service */
export const employeeProfileInputs: EmployeeProfileInput[] = [
  {
    employeeId: 'emp-001',
    fullName: 'Ahmed Mohamed Hassan',
    nationalId: '29805123456789',
    department: 'Engineering',
    position: 'Senior Software Developer',
    baseSalary: 35000,
    hireDate: '2025-01-01T00:00:00.000Z',
    employmentStatus: 'active',
    payTypeId: 'payt-001',
    bankAccountNumber: '1234567890123456',
    bankName: 'National Bank of Egypt',
    taxId: '123-456-789',
    socialInsuranceNumber: 'EG-987654321',
    notes: 'Eligible for signing bonus'
  },
  {
    employeeId: 'emp-002',
    fullName: 'Sara Ali Ibrahim',
    nationalId: '29905234567890',
    department: 'Marketing',
    position: 'Marketing Manager',
    baseSalary: 28000,
    hireDate: '2025-01-15T00:00:00.000Z',
    employmentStatus: 'active',
    payTypeId: 'payt-001',
    bankAccountNumber: '2345678901234567',
    bankName: 'Commercial International Bank',
    taxId: '234-567-890',
    socialInsuranceNumber: 'EG-876543210',
    notes: 'Probation ends 15 Apr 2025'
  },
  {
    employeeId: 'emp-003',
    fullName: 'Mohamed Tarek Farid',
    nationalId: '29705012345678',
    department: 'Sales',
    position: 'Sales Manager',
    baseSalary: 25000,
    hireDate: '2019-07-01T00:00:00.000Z',
    employmentStatus: 'terminated',
    payTypeId: 'payt-001',
    bankAccountNumber: '3456789012345678',
    bankName: 'Banque Misr',
    taxId: '345-678-901',
    socialInsuranceNumber: 'EG-765432109',
    notes: 'Resigned effective 31 Jan 2025'
  }
];

// Onboarding -----------------------------------------------------------
export interface OnboardingInput {
  contractId: string;
  employeeId: string;
  contractType: string;
  contractStartDate: string;
  contractEndDate?: string | null;
  probationEndDate?: string | null;
  baseSalary: number;
  signingBonusEligible: boolean;
  signingBonusAmount: number;
  signingBonusType: 'one-time' | 'split' | null;
  signingBonusPaymentTerms?: string | null;
  createdBy: string;
  contractStatus: 'pending' | 'active' | 'suspended';
  notes?: string;
}

/** Onboarding data used for signing bonus and pay type setup */
export const onboardingInputs: OnboardingInput[] = [
  {
    contractId: 'contract-001',
    employeeId: 'emp-001',
    contractType: 'full-time',
    contractStartDate: '2025-01-01T00:00:00.000Z',
    contractEndDate: null,
    probationEndDate: '2025-04-01T00:00:00.000Z',
    baseSalary: 35000,
    signingBonusEligible: true,
    signingBonusAmount: 50000,
    signingBonusType: 'one-time',
    signingBonusPaymentTerms: '100% upon joining',
    createdBy: 'user-hr-001',
    contractStatus: 'active',
    notes: 'Senior engineer offer approved by CTO'
  },
  {
    contractId: 'contract-002',
    employeeId: 'emp-002',
    contractType: 'full-time',
    contractStartDate: '2025-01-15T00:00:00.000Z',
    contractEndDate: null,
    probationEndDate: '2025-04-15T00:00:00.000Z',
    baseSalary: 28000,
    signingBonusEligible: true,
    signingBonusAmount: 30000,
    signingBonusType: 'split',
    signingBonusPaymentTerms: '50% after probation, 50% after 6 months',
    createdBy: 'user-hr-001',
    contractStatus: 'active',
    notes: 'Marketing manager for Luxor branch'
  },
  {
    contractId: 'contract-003',
    employeeId: 'emp-004',
    contractType: 'contract-based',
    contractStartDate: '2025-02-01T00:00:00.000Z',
    contractEndDate: '2025-11-30T23:59:59.000Z',
    probationEndDate: null,
    baseSalary: 20000,
    signingBonusEligible: false,
    signingBonusAmount: 0,
    signingBonusType: null,
    signingBonusPaymentTerms: null,
    createdBy: 'user-hr-002',
    contractStatus: 'pending',
    notes: 'Project controls analyst'
  }
];

// Offboarding ----------------------------------------------------------
export interface OffboardingInput {
  offboardingId: string;
  employeeId: string;
  terminationType: 'voluntary_resignation' | 'involuntary_termination' | 'mutual_agreement' | 'end_of_contract';
  terminationDate: string;
  lastWorkingDay: string;
  noticePeriodDays: number;
  hrClearanceStatus: 'pending' | 'cleared' | 'blocked';
  hrClearanceDate?: string | null;
  assetsReturned: boolean;
  exitInterviewCompleted: boolean;
  finalSettlementRequired: boolean;
  createdBy: string;
  notes?: string;
}

/** Offboarding records for termination benefits */
export const offboardingInputs: OffboardingInput[] = [
  {
    offboardingId: 'offboard-001',
    employeeId: 'emp-003',
    terminationType: 'voluntary_resignation',
    terminationDate: '2025-01-31T00:00:00.000Z',
    lastWorkingDay: '2025-01-31T00:00:00.000Z',
    noticePeriodDays: 30,
    hrClearanceStatus: 'cleared',
    hrClearanceDate: '2025-01-24T14:00:00.000Z',
    assetsReturned: true,
    exitInterviewCompleted: true,
    finalSettlementRequired: true,
    createdBy: 'user-hr-001',
    notes: 'All assets returned'
  },
  {
    offboardingId: 'offboard-002',
    employeeId: 'emp-005',
    terminationType: 'involuntary_termination',
    terminationDate: '2025-02-15T00:00:00.000Z',
    lastWorkingDay: '2025-02-15T00:00:00.000Z',
    noticePeriodDays: 0,
    hrClearanceStatus: 'pending',
    hrClearanceDate: null,
    assetsReturned: false,
    exitInterviewCompleted: false,
    finalSettlementRequired: true,
    createdBy: 'user-hr-002',
    notes: 'Awaiting IT clearance and laptop return'
  },
  {
    offboardingId: 'offboard-003',
    employeeId: 'emp-006',
    terminationType: 'end_of_contract',
    terminationDate: '2025-12-31T23:59:59.000Z',
    lastWorkingDay: '2025-12-31T23:59:59.000Z',
    noticePeriodDays: 0,
    hrClearanceStatus: 'cleared',
    hrClearanceDate: '2025-12-20T10:00:00.000Z',
    assetsReturned: true,
    exitInterviewCompleted: true,
    finalSettlementRequired: true,
    createdBy: 'user-hr-003',
    notes: 'Contract finished successfully'
  }
];

// Organizational Structure --------------------------------------------
export interface OrgStructureInput {
  employeeId: string;
  positionId: string;
  positionName: string;
  jobGrade: string;
  jobGradeLevel: number;
  departmentId: string;
  departmentName: string;
  minSalary: number;
  maxSalary: number;
  allowances: {
    allowanceId: string;
    allowanceName: string;
    amount: number;
    type: 'FIXED' | 'PERCENTAGE';
    percentage?: number;
  }[];
  effectiveDate: string;
  notes?: string;
}

/** Job grade information consumed for payroll setup */
export const orgStructureInputs: OrgStructureInput[] = [
  {
    employeeId: 'emp-001',
    positionId: 'pos-ENG-005',
    positionName: 'Senior Software Developer',
    jobGrade: 'JG-05',
    jobGradeLevel: 5,
    departmentId: 'dept-ENG',
    departmentName: 'Engineering',
    minSalary: 30000,
    maxSalary: 50000,
    allowances: [
      { allowanceId: 'allowance-001', allowanceName: 'Transportation', amount: 2000, type: 'FIXED' },
      { allowanceId: 'allowance-002', allowanceName: 'Communication', amount: 3000, type: 'FIXED' }
    ],
    effectiveDate: '2025-01-01T00:00:00.000Z',
    notes: 'Hybrid work allowance included'
  },
  {
    employeeId: 'emp-002',
    positionId: 'pos-MKT-006',
    positionName: 'Marketing Manager',
    jobGrade: 'JG-06',
    jobGradeLevel: 6,
    departmentId: 'dept-MKT',
    departmentName: 'Marketing',
    minSalary: 25000,
    maxSalary: 40000,
    allowances: [
      { allowanceId: 'allowance-003', allowanceName: 'Transportation', amount: 2000, type: 'FIXED' }
    ],
    effectiveDate: '2025-01-15T00:00:00.000Z',
    notes: 'Eligible for quarterly bonus'
  },
  {
    employeeId: 'emp-003',
    positionId: 'pos-SLS-006',
    positionName: 'Sales Manager',
    jobGrade: 'JG-06',
    jobGradeLevel: 6,
    departmentId: 'dept-SLS',
    departmentName: 'Sales',
    minSalary: 25000,
    maxSalary: 40000,
    allowances: [
      { allowanceId: 'allowance-004', allowanceName: 'Transportation', amount: 2000, type: 'FIXED' },
      { allowanceId: 'allowance-005', allowanceName: 'Sales Commission', amount: 0, type: 'PERCENTAGE', percentage: 5 }
    ],
    effectiveDate: '2019-07-01T00:00:00.000Z',
    notes: 'Commission percentage varies by region'
  }
];

// Time Management ------------------------------------------------------
export interface TimeManagementInput {
  employeeId: string;
  payPeriodMonth: number;
  payPeriodYear: number;
  totalWorkingDays: number;
  presentDays: number;
  absentDays: number;
  unpaidDays: number;
  missingHours: number;
  overtimeHours: number;
  overtimeAmount: number;
  penalties: {
    unpaidDays: number;
    missingHours: number;
    misconductPenalties: number;
    totalPenalties: number;
  };
  attendanceRate: number;
  notes?: string;
}

/** Attendance and penalty data from Time Management */
export const timeManagementInputs: TimeManagementInput[] = [
  {
    employeeId: 'emp-001',
    payPeriodMonth: 1,
    payPeriodYear: 2025,
    totalWorkingDays: 22,
    presentDays: 22,
    absentDays: 0,
    unpaidDays: 0,
    missingHours: 0,
    overtimeHours: 8,
    overtimeAmount: 4000,
    penalties: { unpaidDays: 0, missingHours: 0, misconductPenalties: 0, totalPenalties: 0 },
    attendanceRate: 100,
    notes: 'Perfect attendance'
  },
  {
    employeeId: 'emp-002',
    payPeriodMonth: 2,
    payPeriodYear: 2025,
    totalWorkingDays: 20,
    presentDays: 18,
    absentDays: 2,
    unpaidDays: 2,
    missingHours: 4,
    overtimeHours: 0,
    overtimeAmount: 0,
    penalties: { unpaidDays: 2, missingHours: 4, misconductPenalties: 0, totalPenalties: 2545.45 },
    attendanceRate: 90,
    notes: 'Two unpaid absences'
  },
  {
    employeeId: 'emp-003',
    payPeriodMonth: 1,
    payPeriodYear: 2025,
    totalWorkingDays: 22,
    presentDays: 15,
    absentDays: 7,
    unpaidDays: 7,
    missingHours: 12,
    overtimeHours: 0,
    overtimeAmount: 0,
    penalties: { unpaidDays: 7, missingHours: 12, misconductPenalties: 500, totalPenalties: 8454.55 },
    attendanceRate: 68,
    notes: 'Resignation month with many absences'
  }
];

// Leaves ---------------------------------------------------------------
export interface LeavesInput {
  employeeId: string;
  leaveYear: number;
  totalAnnualLeaveDays: number;
  usedLeaveDays: number;
  unusedLeaveDays: number;
  leaveEncashmentEligible: boolean;
  dailySalaryRate: number;
  leaveEncashmentAmount: number;
  calculationMethod: string;
  lastUpdated: string;
  notes?: string;
}

/** Leave encashment data received from Leaves subsystem */
export const leavesInputs: LeavesInput[] = [
  {
    employeeId: 'emp-003',
    leaveYear: 2025,
    totalAnnualLeaveDays: 21,
    usedLeaveDays: 1,
    unusedLeaveDays: 20,
    leaveEncashmentEligible: true,
    dailySalaryRate: 600,
    leaveEncashmentAmount: 12000,
    calculationMethod: 'daily rate × unused days',
    lastUpdated: '2025-01-31T00:00:00.000Z',
    notes: 'Included in termination benefits'
  },
  {
    employeeId: 'emp-001',
    leaveYear: 2025,
    totalAnnualLeaveDays: 21,
    usedLeaveDays: 0,
    unusedLeaveDays: 21,
    leaveEncashmentEligible: false,
    dailySalaryRate: 1166.67,
    leaveEncashmentAmount: 0,
    calculationMethod: 'Not eligible (active employee)',
    lastUpdated: '2025-01-31T00:00:00.000Z',
    notes: 'New hire'
  },
  {
    employeeId: 'emp-007',
    leaveYear: 2025,
    totalAnnualLeaveDays: 21,
    usedLeaveDays: 15,
    unusedLeaveDays: 6,
    leaveEncashmentEligible: true,
    dailySalaryRate: 800,
    leaveEncashmentAmount: 4800,
    calculationMethod: 'daily rate × unused days',
    lastUpdated: '2025-02-15T00:00:00.000Z',
    notes: 'Contract ending in March'
  }
];

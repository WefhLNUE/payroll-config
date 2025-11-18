/**
 * Dummy integration inputs received by the Payroll Configuration subsystem
 */

// Employee Profile -----------------------------------------------------
export interface EmployeeProfileRecord {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  contractType: 'full-time' | 'contract';
  baseSalary: number;
  departmentId: string;
  positionId: string;
  hireDate: string;
  status: 'active' | 'resigned';
}

/** Data pulled from Employee Profile to seed payroll employees */
export const fromEmployeeProfile: EmployeeProfileRecord[] = [
  {
    _id: 'emp-001',
    firstName: 'Ahmed',
    lastName: 'Hassan',
    email: 'ahmed.hassan@company.com',
    contractType: 'full-time',
    baseSalary: 35000,
    departmentId: 'dept-ENG',
    positionId: 'pos-ENG-005',
    hireDate: '2025-01-01T00:00:00.000Z',
    status: 'active'
  },
  {
    _id: 'emp-002',
    firstName: 'Sara',
    lastName: 'Ibrahim',
    email: 'sara.ibrahim@company.com',
    contractType: 'full-time',
    baseSalary: 28000,
    departmentId: 'dept-MKT',
    positionId: 'pos-MKT-006',
    hireDate: '2025-01-15T00:00:00.000Z',
    status: 'active'
  },
  {
    _id: 'emp-003',
    firstName: 'Mohamed',
    lastName: 'Farid',
    email: 'mohamed.farid@company.com',
    contractType: 'full-time',
    baseSalary: 25000,
    departmentId: 'dept-SLS',
    positionId: 'pos-SLS-006',
    hireDate: '2019-07-01T00:00:00.000Z',
    status: 'resigned'
  },
  {
    _id: 'emp-004',
    firstName: 'Laila',
    lastName: 'Mostafa',
    email: 'laila.mostafa@company.com',
    contractType: 'contract',
    baseSalary: 20000,
    departmentId: 'dept-PMO',
    positionId: 'pos-PMO-003',
    hireDate: '2025-02-01T00:00:00.000Z',
    status: 'active'
  },
  {
    _id: 'emp-005',
    firstName: 'Karim',
    lastName: 'Saad',
    email: 'karim.saad@company.com',
    contractType: 'full-time',
    baseSalary: 18000,
    departmentId: 'dept-SRV',
    positionId: 'pos-SRV-002',
    hireDate: '2023-03-15T00:00:00.000Z',
    status: 'resigned'
  },
  {
    _id: 'emp-006',
    firstName: 'Nora',
    lastName: 'Gamal',
    email: 'nora.gamal@company.com',
    contractType: 'contract',
    baseSalary: 30000,
    departmentId: 'dept-PMO',
    positionId: 'pos-PMO-004',
    hireDate: '2022-01-10T00:00:00.000Z',
    status: 'resigned'
  },
  {
    _id: 'emp-007',
    firstName: 'Rami',
    lastName: 'Khattab',
    email: 'rami.khattab@company.com',
    contractType: 'contract',
    baseSalary: 24000,
    departmentId: 'dept-OPE',
    positionId: 'pos-OPE-003',
    hireDate: '2024-06-01T00:00:00.000Z',
    status: 'active'
  }
];

// Onboarding -----------------------------------------------------------
export interface OnboardingContractRecord {
  _id: string;
  employeeId: string;
  contractType: 'full-time' | 'contract';
  startDate: string;
  baseSalary: number;
  signingBonus: number;
  bonusEligible: boolean;
  signedDate: string;
  status: 'pending' | 'active';
}

/** Contracts received from Onboarding (REQ-PY-19) */
export const fromOnboarding: OnboardingContractRecord[] = [
  {
    _id: 'contract-001',
    employeeId: 'emp-001',
    contractType: 'full-time',
    startDate: '2025-01-01T00:00:00.000Z',
    baseSalary: 35000,
    signingBonus: 50000,
    bonusEligible: true,
    signedDate: '2024-12-20T00:00:00.000Z',
    status: 'active'
  },
  {
    _id: 'contract-002',
    employeeId: 'emp-002',
    contractType: 'full-time',
    startDate: '2025-01-15T00:00:00.000Z',
    baseSalary: 28000,
    signingBonus: 30000,
    bonusEligible: true,
    signedDate: '2025-01-05T00:00:00.000Z',
    status: 'active'
  },
  {
    _id: 'contract-004',
    employeeId: 'emp-004',
    contractType: 'contract',
    startDate: '2025-02-01T00:00:00.000Z',
    baseSalary: 20000,
    signingBonus: 20000,
    bonusEligible: true,
    signedDate: '2025-01-28T00:00:00.000Z',
    status: 'pending'
  }
];

// Offboarding ----------------------------------------------------------
export interface OffboardingRecord {
  _id: string;
  employeeId: string;
  offboardingType: 'voluntary_resignation' | 'involuntary_termination' | 'end_of_contract';
  resignationDate: string;
  lastWorkingDay: string;
  yearsOfService: number;
  finalSalary: number;
  clearanceStatus: 'pending' | 'cleared' | 'blocked';
  clearanceDate: string | null;
  reason: string;
}

/** Offboarding packets (REQ-PY-20) consumed for termination calculations */
export const fromOffboarding: OffboardingRecord[] = [
  {
    _id: 'offboard-001',
    employeeId: 'emp-003',
    offboardingType: 'voluntary_resignation',
    resignationDate: '2025-01-01T00:00:00.000Z',
    lastWorkingDay: '2025-01-31T00:00:00.000Z',
    yearsOfService: 5.5,
    finalSalary: 25000,
    clearanceStatus: 'cleared',
    clearanceDate: '2025-01-24T14:00:00.000Z',
    reason: 'Pursuing overseas offer'
  },
  {
    _id: 'offboard-002',
    employeeId: 'emp-005',
    offboardingType: 'involuntary_termination',
    resignationDate: '2025-02-10T00:00:00.000Z',
    lastWorkingDay: '2025-02-15T00:00:00.000Z',
    yearsOfService: 2,
    finalSalary: 18000,
    clearanceStatus: 'pending',
    clearanceDate: null,
    reason: 'Policy violation under investigation'
  },
  {
    _id: 'offboard-003',
    employeeId: 'emp-006',
    offboardingType: 'end_of_contract',
    resignationDate: '2025-12-01T00:00:00.000Z',
    lastWorkingDay: '2025-12-31T23:59:59.000Z',
    yearsOfService: 3,
    finalSalary: 30000,
    clearanceStatus: 'cleared',
    clearanceDate: '2025-12-20T10:00:00.000Z',
    reason: 'Project completion'
  }
];

// Organizational Structure --------------------------------------------
export interface OrgStructureRecord {
  _id: string;
  positionTitle: string;
  departmentId: string;
  payGrade: string;
  baseSalary: number;
  status: 'active' | 'draft';
}

/** Job-grade feed from Organizational Structure (REQ-PY-2) */
export const fromOrganizationalStructure: OrgStructureRecord[] = [
  {
    _id: 'pos-ENG-005',
    positionTitle: 'Senior Software Developer',
    departmentId: 'dept-ENG',
    payGrade: 'JG-05',
    baseSalary: 35000,
    status: 'active'
  },
  {
    _id: 'pos-MKT-006',
    positionTitle: 'Marketing Manager',
    departmentId: 'dept-MKT',
    payGrade: 'JG-06',
    baseSalary: 28000,
    status: 'active'
  },
  {
    _id: 'pos-PMO-003',
    positionTitle: 'Project Controls Analyst',
    departmentId: 'dept-PMO',
    payGrade: 'JG-04',
    baseSalary: 20000,
    status: 'draft'
  }
];

// Time Management ------------------------------------------------------
export interface TimeManagementRecord {
  employeeId: string;
  period: string; // e.g., '2025-01'
  totalWorkingDays: number;
  absentDays: number;
  lateDays: number;
  overtimeHours: number;
  penalties: {
    unpaidDays: number;
    lateDeductions: number;
  };
}

/** Attendance + penalty data from Time Management (BR-31, BR-35) */
export const fromTimeManagement: TimeManagementRecord[] = [
  {
    employeeId: 'emp-001',
    period: '2025-01',
    totalWorkingDays: 22,
    absentDays: 0,
    lateDays: 0,
    overtimeHours: 8,
    penalties: { unpaidDays: 0, lateDeductions: 0 }
  },
  {
    employeeId: 'emp-002',
    period: '2025-02',
    totalWorkingDays: 20,
    absentDays: 2,
    lateDays: 3,
    overtimeHours: 0,
    penalties: { unpaidDays: 2000, lateDeductions: 545.45 }
  },
  {
    employeeId: 'emp-003',
    period: '2025-01',
    totalWorkingDays: 22,
    absentDays: 7,
    lateDays: 5,
    overtimeHours: 0,
    penalties: { unpaidDays: 7000, lateDeductions: 1454.55 }
  }
];

// Leaves ---------------------------------------------------------------
export interface LeaveRecord {
  employeeId: string;
  period: string;
  unusedLeaveDays: number;
  encashmentEligible: boolean;
  encashmentAmount: number;
}

/** Leave encashment feed from the Leaves subsystem */
export const fromLeaves: LeaveRecord[] = [
  {
    employeeId: 'emp-003',
    period: '2025',
    unusedLeaveDays: 20,
    encashmentEligible: true,
    encashmentAmount: 12000
  },
  {
    employeeId: 'emp-001',
    period: '2025',
    unusedLeaveDays: 21,
    encashmentEligible: false,
    encashmentAmount: 0
  },
  {
    employeeId: 'emp-007',
    period: '2025',
    unusedLeaveDays: 6,
    encashmentEligible: true,
    encashmentAmount: 4800
  }
];

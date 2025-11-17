/**
 * Dummy integration outputs published by the Payroll Configuration subsystem
 */

// Payroll Execution ----------------------------------------------------
export interface PayrollExecutionConfigOutput {
  payrollCycleId: string;
  readyConfigurations: {
    payTypes: string[];
    taxIds: string[];
    insuranceBracketIds: string[];
    signingBonusIds: string[];
    terminationBenefitIds: string[];
  };
  pendingItems: {
    payTypes: string[];
    insuranceBracketIds: string[];
    signingBonusIds: string[];
    terminationBenefitIds: string[];
  };
  notes: string;
  generatedAt: string;
}

/** Configuration summary sent to Payroll Execution before each run */
export const payrollExecutionOutput: PayrollExecutionConfigOutput = {
  payrollCycleId: 'cycle-2025-02',
  readyConfigurations: {
    payTypes: ['payt-001', 'payt-003'],
    taxIds: ['tax-001'],
    insuranceBracketIds: ['ins-001', 'ins-003'],
    signingBonusIds: ['sign-001', 'sign-003'],
    terminationBenefitIds: ['term-001']
  },
  pendingItems: {
    payTypes: ['payt-002'],
    insuranceBracketIds: ['ins-002'],
    signingBonusIds: ['sign-002'],
    terminationBenefitIds: ['term-002']
  },
  notes: 'Cycle 2025-02 is executable once pending approvals clear.',
  generatedAt: '2025-02-25T12:00:00.000Z'
};

// Employee Profile -----------------------------------------------------
export interface EmployeePayslipLink {
  employeeId: string;
  payslipId: string;
  payPeriod: string;
  netSalary: number;
  status: 'paid' | 'approved' | 'locked';
  downloadUrl: string;
  publishedAt: string;
}

/** Payslip metadata delivered to Employee Profile for self-service portals */
export const employeePayslipOutputs: EmployeePayslipLink[] = [
  {
    employeeId: 'emp-001',
    payslipId: 'payslip-001',
    payPeriod: 'Jan-2025',
    netSalary: 72900,
    status: 'paid',
    downloadUrl: 'https://payroll.example.com/payslips/cycle-2025-01/emp-001.pdf',
    publishedAt: '2025-02-05T06:00:00.000Z'
  },
  {
    employeeId: 'emp-002',
    payslipId: 'payslip-002',
    payPeriod: 'Feb-2025',
    netSalary: 20654.55,
    status: 'approved',
    downloadUrl: 'https://payroll.example.com/payslips/cycle-2025-02/emp-002.pdf',
    publishedAt: '2025-03-05T06:00:00.000Z'
  },
  {
    employeeId: 'emp-003',
    payslipId: 'payslip-003',
    payPeriod: 'Jan-2025',
    netSalary: 111170.45,
    status: 'locked',
    downloadUrl: 'https://payroll.example.com/payslips/cycle-2025-01/emp-003.pdf',
    publishedAt: '2025-02-10T06:00:00.000Z'
  }
];

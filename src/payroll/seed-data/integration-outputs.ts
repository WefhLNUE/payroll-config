/**
 * Dummy integration outputs published by the Payroll Configuration subsystem
 */

// Payroll Execution ----------------------------------------------------
export interface PayrollExecutionSummary {
  note: string;
  availableConfigs: {
    payTypes: number;
    taxBrackets: number;
    insuranceBrackets: number;
    signingBonuses: number;
    terminationBenefits: number;
  };
}

/** Aggregated configuration counts sent to Payroll Execution */
export const toPayrollExecution: PayrollExecutionSummary = {
  note:
    'Payroll Configuration has finalized the February 2025 run: counts reflect APPROVED or PAID artifacts ready for ingestion by Payroll Execution (Milestone 1 demo).',
  availableConfigs: {
    payTypes: 2, // payt-001, payt-003
    taxBrackets: 2, // tax-001, tax-002
    insuranceBrackets: 2, // ins-001, ins-003
    signingBonuses: 2, // sign-001 (paid), sign-003 (approved)
    terminationBenefits: 2 // term-001 (approved), term-003 (paid)
  }
};

// Employee Profile -----------------------------------------------------
export interface EmployeeProfilePayslipSample {
  note: string;
  samplePayslip: {
    employeeId: string;
    period: string;
    grossSalary: number;
    netSalary: number;
    status: 'draft' | 'under_review' | 'approved' | 'locked' | 'paid' | 'rejected';
    downloadUrl: string | null;
  };
}

/** Payslip metadata pushed to Employee Profile for the self-service portal */
export const toEmployeeProfile: EmployeeProfilePayslipSample = {
  note:
    'After Finance approval, Payroll Configuration publishes each payslip reference so Employee Profile can surface downloadable PDFs to staff.',
  samplePayslip: {
    employeeId: 'emp-001',
    period: 'Jan-2025',
    grossSalary: 90000,
    netSalary: 72900,
    status: 'paid',
    downloadUrl: 'https://payroll.example.com/payslips/cycle-2025-01/emp-001.pdf'
  }
};

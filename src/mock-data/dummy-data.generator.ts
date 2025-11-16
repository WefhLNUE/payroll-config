import { Types } from 'mongoose';
import type { DummyContext } from './DummyContext';
import type { PayGradeDTO } from '../common/dto/paygrade.dto';
import type { InsuranceBracketDTO } from '../common/dto/insurance-bracket.dto';
import type { DeductionDTO } from '../common/dto/deduction.dto';
import type { ExpenseClaimDTO } from '../common/dto/expense-claim.dto';

export class DummyDataGenerator {
  static generatePayGradeData(context: DummyContext, count = 5): PayGradeDTO[] {
    const payGrades: PayGradeDTO[] = [];
    const names = [
      'Senior Developer Grade',
      'Junior Developer Grade',
      'Manager Grade',
      'Director Grade',
      'Executive Grade',
    ];

    for (let i = 0; i < count; i++) {
      const basePay = 40000 + i * 12000;

      payGrades.push({
        _id: new Types.ObjectId(),
        name: names[i] || `Pay Grade ${i + 1}`,

        // Shared context references
        position: context.positions[i % context.positions.length],
        department: context.departments[i % context.departments.length],

        minSalary: basePay * 0.8,
        maxSalary: basePay * 1.5,
        basePay,
        allowances: [new Types.ObjectId(), new Types.ObjectId()],
        grossSalary: basePay * 1.2,

        description: `Pay grade for ${names[i]}`,
        status: i % 2 === 0 ? 'approved' : 'draft',

        createdBy: context.users[0],
        updatedBy: context.users[0],
        approvedBy: i % 2 === 0 ? context.approvers[0] : undefined,
        approvedAt: i % 2 === 0 ? new Date() : undefined,
        isActive: true,
        version: 1,
      });
    }

    return payGrades;
  }

  static generateInsuranceBracketData(context: DummyContext, count = 5): InsuranceBracketDTO[] {
    const brackets: InsuranceBracketDTO[] = [];

    const salaryRanges = [
      { min: 0, max: 25000 },
      { min: 25001, max: 50000 },
      { min: 50001, max: 75000 },
      { min: 75001, max: 100000 },
      { min: 100001, max: 200000 },
    ];

    for (let i = 0; i < count; i++) {
      brackets.push({
        _id: new Types.ObjectId(),
        name: `Bracket ${i + 1}`,
        minSalary: salaryRanges[i].min,
        maxSalary: salaryRanges[i].max,
        employeeContributionRate: 2 + i,
        employerContributionRate: 4 + i,

        description: `Insurance bracket for salary ${salaryRanges[i].min}-${salaryRanges[i].max}`,
        status: i % 2 === 0 ? 'approved' : 'pending',
        effectiveFrom: new Date(2024, 0, 1),
        effectiveTo: new Date(2024, 11, 31),

        createdBy: context.users[1],
        updatedBy: context.users[1],
        approvedBy: i % 2 === 0 ? context.approvers[1] : undefined,
        approvedAt: i % 2 === 0 ? new Date() : undefined,

        isActive: true,
        version: 1,
      });
    }

    return brackets;
  }

  static generateDeductionData(context: DummyContext, count = 8): DeductionDTO[] {
    const deductions: DeductionDTO[] = [];
    const deductionTypes = [
      { type: 'tax', name: 'Income Tax', method: 'percentage', rate: 15 },
      { type: 'tax', name: 'Social Security', method: 'percentage', rate: 6 },
      { type: 'loan', name: 'Employee Loan', method: 'fixed', amount: 500 },
      { type: 'advance', name: 'Advance Salary', method: 'fixed', amount: 1000 },
      { type: 'penalty', name: 'Late Penalty', method: 'fixed', amount: 50 },
      { type: 'penalty', name: 'Absence Penalty', method: 'fixed', amount: 200 },
      { type: 'insurance', name: 'Health Insurance', method: 'percentage', rate: 3 },
      { type: 'other', name: 'Union Dues', method: 'fixed', amount: 25 },
    ];

    for (let i = 0; i < count; i++) {
      const d = deductionTypes[i];

      deductions.push({
        _id: new Types.ObjectId(),
        type: d.type,
        name: d.name,
        calculationMethod: d.method,
        amount: d.method === 'fixed' ? d.amount : undefined,
        rate: d.method === 'percentage' ? d.rate : undefined,

        description: `${d.name} deduction`,

        applicableConditions: JSON.stringify({ employees: context.employees }),

        status: i % 3 === 0 ? 'approved' : 'pending',
        effectiveFrom: new Date(2024, 0, 1),
        effectiveTo: new Date(2024, 11, 31),

        createdBy: context.users[2],
        updatedBy: context.users[2],
        approvedBy: i % 3 === 0 ? context.approvers[0] : undefined,
        approvedAt: i % 3 === 0 ? new Date() : undefined,

        isActive: true,
        version: 1,
      });
    }

    return deductions;
  }

  static generateExpenseClaimData(context: DummyContext, count = 10): ExpenseClaimDTO[] {
    const claims: ExpenseClaimDTO[] = [];
    const types = ['travel', 'meal', 'accommodation', 'transportation', 'other'];
    const statuses = ['pending', 'approved', 'rejected'];

    for (let i = 0; i < count; i++) {
      const status = statuses[i % statuses.length];

      claims.push({
        _id: new Types.ObjectId(),

        // Employee comes from shared context!
        employeeId: context.employees[i % context.employees.length],

        amount: 100 + i * 50,
        type: types[i % types.length],
        description: `Expense claim (${types[i % types.length]})`,
        receipts: [`https://example.com/receipt-${i}.pdf`],
        status,

        approvedBy: status === 'approved' ? context.approvers[0] : undefined,
        rejectedBy: status === 'rejected' ? context.approvers[1] : undefined,
        approvedAt: status === 'approved' ? new Date() : undefined,
        rejectedAt: status === 'rejected' ? new Date() : undefined,
        approvalComments: status === 'approved' ? 'Approved' : undefined,
        rejectionReason: status === 'rejected' ? 'Invalid receipt' : undefined,

        expenseDate: new Date(2024, i % 12, (i % 28) + 1),
        claimDate: new Date(),
      });
    }

    return claims;
  }

  static generateAll(context: DummyContext) {
    return {
      payGrades: this.generatePayGradeData(context),
      insuranceBrackets: this.generateInsuranceBracketData(context),
      deductions: this.generateDeductionData(context),
      expenseClaims: this.generateExpenseClaimData(context),
    };
  }
}

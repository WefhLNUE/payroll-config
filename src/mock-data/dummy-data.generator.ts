import { Types } from 'mongoose';
import type { DummyContext } from './DummyContext';
import type { PayGradeDTO } from '../common/dto/paygrade.dto';
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

  static generateLegalRuleData(context: DummyContext, count = 6): any[] {
    const rules: any[] = [];
    const ruleTypes = ['tax', 'labor_law', 'social_security', 'health_insurance', 'unemployment', 'other'];
    const ruleNames = [
      'Income Tax Regulation 2024',
      'Minimum Wage Law',
      'Social Security Act',
      'Health Insurance Mandate',
      'Unemployment Benefits',
      'General Labor Law',
    ];

    for (let i = 0; i < count; i++) {
      const ruleType = ruleTypes[i];
      const isApproved = i % 2 === 0;

      rules.push({
        _id: new Types.ObjectId(),
        name: ruleNames[i] || `Legal Rule ${i + 1}`,
        ruleType,
        description: `Legal rule for ${ruleType}: ${ruleNames[i]}`,
        legalReference: `Law ${2020 + i}-${i + 1}`,
        legalDocumentUrl: `https://example.com/legal-docs/rule-${i + 1}.pdf`,
        ruleConfiguration: {
          applicableTo: 'all_employees',
          enforcementLevel: 'mandatory',
          complianceRequired: true,
        },
        taxBrackets: ruleType === 'tax' ? [
          { minAmount: 0, maxAmount: 25000, rate: 10 },
          { minAmount: 25001, maxAmount: 50000, rate: 15 },
          { minAmount: 50001, maxAmount: undefined, rate: 20 },
        ] : undefined,
        effectiveFrom: new Date(2024, 0, 1),
        effectiveTo: i % 3 === 0 ? new Date(2024, 11, 31) : undefined,
        status: isApproved ? 'approved' : i % 3 === 1 ? 'pending' : 'draft',
        createdBy: context.users[0],
        updatedBy: context.users[0],
        approvedBy: isApproved ? context.approvers[0] : undefined,
        approvedAt: isApproved ? new Date() : undefined,
        approvalComments: isApproved ? 'Approved by legal team' : undefined,
        lastLegalUpdate: new Date(2024, i % 12, 1),
        legalUpdateNotes: `Last updated in ${2024 + (i % 2)}`,
        legalUpdateBy: context.users[0],
        isActive: true,
        version: 1 + (i % 3),
      });
    }

    return rules;
  }

  static generatePayrollRunConfigurationData(context: DummyContext, count = 1): any[] {
    const configs: any[] = [];
    const roundingRules = ['nearest', 'up', 'down'];

    for (let i = 0; i < count; i++) {
      configs.push({
        _id: new Types.ObjectId(),
        allowRetroactiveAdjustments: i % 2 === 0,
        autoGeneratePaySlips: i % 2 === 1,
        gracePeriodDays: 3 + (i % 5),
        roundingRule: roundingRules[i % roundingRules.length],
      });
    }

    return configs;
  }

  static generatePayrollScheduleData(context: DummyContext, count = 3): any[] {
    const schedules: any[] = [];
    const frequencies = ['MONTHLY', 'BIWEEKLY', 'WEEKLY'];
    const scheduleConfigs = [
      { frequency: 'MONTHLY', cutoffDay: 25, payoutDay: 28 },
      { frequency: 'BIWEEKLY', cutoffDay: 14, payoutDay: 16 },
      { frequency: 'WEEKLY', cutoffDay: 5, payoutDay: 7 },
    ];

    for (let i = 0; i < count; i++) {
      const config = scheduleConfigs[i] || {
        frequency: frequencies[i % frequencies.length],
        cutoffDay: 20 + i,
        payoutDay: 25 + i,
      };

      schedules.push({
        _id: new Types.ObjectId(),
        frequency: config.frequency,
        cutoffDay: config.cutoffDay,
        payoutDay: config.payoutDay,
      });
    }

    return schedules;
  }

  static generateOvertimeRuleData(context: DummyContext, count = 4): any[] {
    const rules: any[] = [];
    const ruleNames = [
      'Standard Overtime',
      'Weekend Overtime',
      'Holiday Overtime',
      'Night Shift Overtime',
    ];
    const multipliers = [1.25, 1.5, 2.0, 1.75];
    const maxHours = [40, 50, 60, 45];

    for (let i = 0; i < count; i++) {
      rules.push({
        _id: new Types.ObjectId(),
        name: ruleNames[i] || `Overtime Rule ${i + 1}`,
        multiplier: multipliers[i],
        maxHoursPerMonth: maxHours[i],
      });
    }

    return rules;
  }

  static generateMisconductRuleData(context: DummyContext, count = 5): any[] {
    const rules: any[] = [];
    const descriptions = [
      'Late arrival to work more than 3 times in a month',
      'Unauthorized absence without notice',
      'Violation of company code of conduct',
      'Insubordination to supervisor',
      'Misuse of company resources',
    ];
    const penaltyTypes = ['WARNING', 'DEDUCTION', 'SUSPENSION'];
    const penaltyAmounts = [0, 200, 500, 1000, 0];

    for (let i = 0; i < count; i++) {
      const penaltyType = penaltyTypes[i % penaltyTypes.length];
      const amount = penaltyType === 'WARNING' ? 0 : penaltyAmounts[i];

      rules.push({
        _id: new Types.ObjectId(),
        description: descriptions[i] || `Misconduct rule ${i + 1}`,
        penaltyAmount: amount,
        penaltyType,
      });
    }

    return rules;
  }

  static generateLaborLawPolicyData(context: DummyContext, count = 5): any[] {
    const policies: any[] = [];
    const lawNames = [
      'Minimum Wage Act 2024',
      'Working Hours Regulation',
      'Employee Benefits Act',
      'Occupational Safety Law',
      'Equal Employment Opportunity',
    ];
    const descriptions = [
      'Establishes minimum wage standards for all employees',
      'Regulates maximum working hours and rest periods',
      'Mandates employee benefits including health insurance',
      'Ensures workplace safety standards and compliance',
      'Prohibits discrimination in employment practices',
    ];

    for (let i = 0; i < count; i++) {
      policies.push({
        _id: new Types.ObjectId(),
        lawName: lawNames[i] || `Labor Law Policy ${i + 1}`,
        description: descriptions[i] || `Description for ${lawNames[i]}`,
        active: i % 2 === 0,
      });
    }

    return policies;
  }

  static generateLeavePolicyData(context: DummyContext, count = 4): any[] {
    const policies: any[] = [];
    const policyNames = [
      'Paid Annual Leave',
      'Sick Leave',
      'Unpaid Leave',
      'Maternity/Paternity Leave',
    ];
    const types = ['PAID', 'PAID', 'UNPAID', 'PAID'];
    const maxDays = [20, 10, 30, 90];
    const requiresApproval = [true, false, true, true];

    for (let i = 0; i < count; i++) {
      policies.push({
        _id: new Types.ObjectId(),
        name: policyNames[i] || `Leave Policy ${i + 1}`,
        type: types[i],
        maxDaysPerYear: maxDays[i],
        requiresApproval: requiresApproval[i],
      });
    }

    return policies;
  }

  static generateAll(context: DummyContext) {
    return {
      payGrades: this.generatePayGradeData(context),
      deductions: this.generateDeductionData(context),
      expenseClaims: this.generateExpenseClaimData(context),
      legalRules: this.generateLegalRuleData(context),
      payrollRunConfigurations: this.generatePayrollRunConfigurationData(context),
      payrollSchedules: this.generatePayrollScheduleData(context),
      overtimeRules: this.generateOvertimeRuleData(context),
      misconductRules: this.generateMisconductRuleData(context),
      laborLawPolicies: this.generateLaborLawPolicyData(context),
      leavePolicies: this.generateLeavePolicyData(context),
    };
  }
}

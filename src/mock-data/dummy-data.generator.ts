import type { PayGradeDTO } from '../common/dto/paygrade.dto';
import type { DeductionDTO } from '../common/dto/deduction.dto';
import type { ExpenseClaimDTO } from '../common/dto/expense-claim.dto';

export class DummyDataGenerator {
  static generatePayGrades(): PayGradeDTO[] {
    return [
      {
        name: 'Junior Developer',
        baseSalary: 3000,
        currency: 'USD',
        description: 'Entry-level developer position',
        isActive: true,
      },
      {
        name: 'Senior Developer',
        baseSalary: 6000,
        currency: 'USD',
        description: 'Senior developer position',
        isActive: true,
      },
    ];
  }

  static generateDeductions(): DeductionDTO[] {
    return [
      {
        name: 'Income Tax',
        deductionType: 'tax',
        percentage: 15,
        description: 'Annual income tax deduction',
        isActive: true,
      },
      {
        name: 'Health Insurance',
        deductionType: 'insurance',
        fixedAmount: 200,
        description: 'Monthly health insurance',
        isActive: true,
      },
    ];
  }

  static generateExpenseClaims(): ExpenseClaimDTO[] {
    return [
      {
        employeeId: 'emp001',
        amount: 150,
        category: 'travel',
        description: 'Client meeting transportation',
        status: 'pending',
      },
      {
        employeeId: 'emp002',
        amount: 75,
        category: 'meals',
        description: 'Team lunch during conference',
        status: 'approved',
        approvedAmount: 75,
      },
    ];
  }
}

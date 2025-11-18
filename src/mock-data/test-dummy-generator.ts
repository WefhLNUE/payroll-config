/**
 * Dummy Data Generator Test Script
 * Tests that all generator methods work correctly and generate valid data
 */

import 'reflect-metadata';
import { DummyDataGenerator } from './dummy-data.generator';
import { DummyContext } from './DummyContext';

console.log('🧪 Testing Dummy Data Generator...\n');
console.log('='.repeat(60));

let allPassed = true;
const errors: string[] = [];
const warnings: string[] = [];

// Initialize context
const context = DummyContext.initialize();
console.log('✅ DummyContext initialized');
console.log(`   - Users: ${context.users.length}`);
console.log(`   - Employees: ${context.employees.length}`);
console.log(`   - Approvers: ${context.approvers.length}`);
console.log(`   - Departments: ${context.departments.length}`);
console.log(`   - Positions: ${context.positions.length}\n`);

// Test individual generators
console.log('📊 Testing Individual Generators:\n');

// Test PayGrade Generator
try {
  const payGrades = DummyDataGenerator.generatePayGradeData(context, 3);
  if (payGrades.length !== 3) {
    throw new Error(`Expected 3 pay grades, got ${payGrades.length}`);
  }
  if (!payGrades[0]._id || !payGrades[0].name || !payGrades[0].basePay) {
    throw new Error('PayGrade data structure is invalid');
  }
  console.log(`✅ PayGrade: Generated ${payGrades.length} items`);
  console.log(`   Sample: ${payGrades[0].name} - Base Pay: $${payGrades[0].basePay}`);
} catch (error: any) {
  console.error(`❌ PayGrade: ${error.message}`);
  errors.push(`PayGrade: ${error.message}`);
  allPassed = false;
}

// Test Deduction Generator
try {
  const deductions = DummyDataGenerator.generateDeductionData(context, 5);
  if (deductions.length !== 5) {
    throw new Error(`Expected 5 deductions, got ${deductions.length}`);
  }
  if (!deductions[0]._id || !deductions[0].name || !deductions[0].type) {
    throw new Error('Deduction data structure is invalid');
  }
  console.log(`✅ Deduction: Generated ${deductions.length} items`);
  console.log(`   Sample: ${deductions[0].name} (${deductions[0].type})`);
} catch (error: any) {
  console.error(`❌ Deduction: ${error.message}`);
  errors.push(`Deduction: ${error.message}`);
  allPassed = false;
}

// Test ExpenseClaim Generator
try {
  const expenseClaims = DummyDataGenerator.generateExpenseClaimData(context, 5);
  if (expenseClaims.length !== 5) {
    throw new Error(`Expected 5 expense claims, got ${expenseClaims.length}`);
  }
  if (!expenseClaims[0]._id || !expenseClaims[0].employeeId || !expenseClaims[0].amount) {
    throw new Error('ExpenseClaim data structure is invalid');
  }
  console.log(`✅ ExpenseClaim: Generated ${expenseClaims.length} items`);
  console.log(`   Sample: ${expenseClaims[0].type} - $${expenseClaims[0].amount}`);
} catch (error: any) {
  console.error(`❌ ExpenseClaim: ${error.message}`);
  errors.push(`ExpenseClaim: ${error.message}`);
  allPassed = false;
}

// Test LegalRule Generator
try {
  const legalRules = DummyDataGenerator.generateLegalRuleData(context, 3);
  if (legalRules.length !== 3) {
    throw new Error(`Expected 3 legal rules, got ${legalRules.length}`);
  }
  if (!legalRules[0]._id || !legalRules[0].name || !legalRules[0].ruleType) {
    throw new Error('LegalRule data structure is invalid');
  }
  console.log(`✅ LegalRule: Generated ${legalRules.length} items`);
  console.log(`   Sample: ${legalRules[0].name} (${legalRules[0].ruleType})`);
} catch (error: any) {
  console.error(`❌ LegalRule: ${error.message}`);
  errors.push(`LegalRule: ${error.message}`);
  allPassed = false;
}

// Test PayrollRunConfiguration Generator
try {
  const configs = DummyDataGenerator.generatePayrollRunConfigurationData(context);
  if (configs.length === 0) {
    throw new Error('Expected at least 1 configuration, got 0');
  }
  if (!configs[0]._id || configs[0].gracePeriodDays === undefined) {
    throw new Error('PayrollRunConfiguration data structure is invalid');
  }
  console.log(`✅ PayrollRunConfiguration: Generated ${configs.length} item(s)`);
  console.log(`   Sample: Grace Period: ${configs[0].gracePeriodDays} days`);
} catch (error: any) {
  console.error(`❌ PayrollRunConfiguration: ${error.message}`);
  errors.push(`PayrollRunConfiguration: ${error.message}`);
  allPassed = false;
}

// Test PayrollSchedule Generator
try {
  const schedules = DummyDataGenerator.generatePayrollScheduleData(context, 2);
  if (schedules.length !== 2) {
    throw new Error(`Expected 2 schedules, got ${schedules.length}`);
  }
  if (!schedules[0]._id || !schedules[0].frequency || !schedules[0].cutoffDay) {
    throw new Error('PayrollSchedule data structure is invalid');
  }
  console.log(`✅ PayrollSchedule: Generated ${schedules.length} items`);
  console.log(`   Sample: ${schedules[0].frequency} - Cutoff: Day ${schedules[0].cutoffDay}`);
} catch (error: any) {
  console.error(`❌ PayrollSchedule: ${error.message}`);
  errors.push(`PayrollSchedule: ${error.message}`);
  allPassed = false;
}

// Test OvertimeRule Generator
try {
  const overtimeRules = DummyDataGenerator.generateOvertimeRuleData(context, 3);
  if (overtimeRules.length !== 3) {
    throw new Error(`Expected 3 overtime rules, got ${overtimeRules.length}`);
  }
  if (!overtimeRules[0]._id || !overtimeRules[0].name || !overtimeRules[0].multiplier) {
    throw new Error('OvertimeRule data structure is invalid');
  }
  console.log(`✅ OvertimeRule: Generated ${overtimeRules.length} items`);
  console.log(`   Sample: ${overtimeRules[0].name} - ${overtimeRules[0].multiplier}x multiplier`);
} catch (error: any) {
  console.error(`❌ OvertimeRule: ${error.message}`);
  errors.push(`OvertimeRule: ${error.message}`);
  allPassed = false;
}

// Test MisconductRule Generator
try {
  const misconductRules = DummyDataGenerator.generateMisconductRuleData(context, 3);
  if (misconductRules.length !== 3) {
    throw new Error(`Expected 3 misconduct rules, got ${misconductRules.length}`);
  }
  if (!misconductRules[0]._id || !misconductRules[0].description || !misconductRules[0].penaltyType) {
    throw new Error('MisconductRule data structure is invalid');
  }
  console.log(`✅ MisconductRule: Generated ${misconductRules.length} items`);
  console.log(`   Sample: ${misconductRules[0].penaltyType} - $${misconductRules[0].penaltyAmount}`);
} catch (error: any) {
  console.error(`❌ MisconductRule: ${error.message}`);
  errors.push(`MisconductRule: ${error.message}`);
  allPassed = false;
}

// Test LaborLawPolicy Generator
try {
  const laborLawPolicies = DummyDataGenerator.generateLaborLawPolicyData(context, 3);
  if (laborLawPolicies.length !== 3) {
    throw new Error(`Expected 3 labor law policies, got ${laborLawPolicies.length}`);
  }
  if (!laborLawPolicies[0]._id || !laborLawPolicies[0].lawName) {
    throw new Error('LaborLawPolicy data structure is invalid');
  }
  console.log(`✅ LaborLawPolicy: Generated ${laborLawPolicies.length} items`);
  console.log(`   Sample: ${laborLawPolicies[0].lawName}`);
} catch (error: any) {
  console.error(`❌ LaborLawPolicy: ${error.message}`);
  errors.push(`LaborLawPolicy: ${error.message}`);
  allPassed = false;
}

// Test LeavePolicy Generator
try {
  const leavePolicies = DummyDataGenerator.generateLeavePolicyData(context, 3);
  if (leavePolicies.length !== 3) {
    throw new Error(`Expected 3 leave policies, got ${leavePolicies.length}`);
  }
  if (!leavePolicies[0]._id || !leavePolicies[0].name || !leavePolicies[0].type) {
    throw new Error('LeavePolicy data structure is invalid');
  }
  console.log(`✅ LeavePolicy: Generated ${leavePolicies.length} items`);
  console.log(`   Sample: ${leavePolicies[0].name} (${leavePolicies[0].type})`);
} catch (error: any) {
  console.error(`❌ LeavePolicy: ${error.message}`);
  errors.push(`LeavePolicy: ${error.message}`);
  allPassed = false;
}

// Test generateAll method
console.log('\n📦 Testing generateAll() method:\n');
try {
  const allData = DummyDataGenerator.generateAll(context);
  
  const expectedKeys = [
    'payGrades',
    'deductions',
    'expenseClaims',
    'legalRules',
    'payrollRunConfigurations',
    'payrollSchedules',
    'overtimeRules',
    'misconductRules',
    'laborLawPolicies',
    'leavePolicies',
  ];

  const missingKeys = expectedKeys.filter(key => !(key in allData));
  if (missingKeys.length > 0) {
    throw new Error(`Missing keys in generateAll(): ${missingKeys.join(', ')}`);
  }

  const emptyKeys = expectedKeys.filter(key => !Array.isArray(allData[key]) || allData[key].length === 0);
  if (emptyKeys.length > 0) {
    warnings.push(`Empty arrays in generateAll(): ${emptyKeys.join(', ')}`);
  }

  console.log('✅ generateAll() returned all expected data types:');
  expectedKeys.forEach(key => {
    const count = Array.isArray(allData[key]) ? allData[key].length : 0;
    console.log(`   - ${key}: ${count} item(s)`);
  });
} catch (error: any) {
  console.error(`❌ generateAll(): ${error.message}`);
  errors.push(`generateAll(): ${error.message}`);
  allPassed = false;
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 TEST SUMMARY');
console.log('='.repeat(60));

if (errors.length > 0) {
  console.log(`\n❌ Errors (${errors.length}):`);
  errors.forEach((error, index) => {
    console.log(`   ${index + 1}. ${error}`);
  });
}

if (warnings.length > 0) {
  console.log(`\n⚠️  Warnings (${warnings.length}):`);
  warnings.forEach((warning, index) => {
    console.log(`   ${index + 1}. ${warning}`);
  });
}

if (allPassed && errors.length === 0) {
  console.log('\n✅ All tests passed! Dummy data generator is working correctly.');
  console.log('='.repeat(60));
  process.exit(0);
} else {
  console.log(`\n❌ Tests failed with ${errors.length} error(s)`);
  console.log('='.repeat(60));
  process.exit(1);
}


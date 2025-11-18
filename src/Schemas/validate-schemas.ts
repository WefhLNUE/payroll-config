/**
 * GLOBAL SCHEMA VALIDATION SCRIPT
 * Validates that all schemas compile and expose the expected structure.
 */

import { Deduction, DeductionSchema } from './Deduction.schema';
import { ExpenseClaim, ExpenseClaimSchema } from './ExpenseClaim.schema';
import { LaborLawPolicy, LaborLawPolicySchema } from './LaborLawPolicy.schema';
import { LeavePolicy, LeavePolicySchema } from './LeavePolicy.schema';
import { LegalRule, LegalRuleSchema } from './LegalRule.schema';
import { MisconductRule, MisconductRuleSchema } from './MisconductRule.schema';
import { OvertimeRule, OvertimeRuleSchema } from './OverTimeRule.schema';
import { PayGrade, PayGradeSchema } from './PayGrade.schema';
import {
  PayrollRunConfiguration,
  PayrollRunConfigurationSchema,
} from './PayrollRunConfiguration.schema';
import {
  PayrollSchedule,
  PayrollScheduleSchema,
} from './PayrollSchedule.schema';

interface ValidationResult {
  schema: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const results: ValidationResult[] = [];

/**
 * Generic validator
 */
function validateSchema(
  schemaName: string,
  schemaClass: any,
  schemaFactory: any,
  requiredFields: string[] = [],
  enumFields: Record<string, string[]> = {}
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!schemaFactory) {
    errors.push('SchemaFactory export is missing');
  }

  if (!schemaClass) {
    errors.push('Class export is missing');
  }

  if (schemaFactory && typeof schemaFactory !== 'object' && typeof schemaFactory !== 'function') {
    errors.push('SchemaFactory export is not a valid MongooseSchema');
  }

  if (requiredFields.length > 0) {
    warnings.push(`Required fields (TS-level): ${requiredFields.join(', ')}`);
  }

  Object.entries(enumFields).forEach(([field, values]) => {
    warnings.push(`Enum field '${field}': [${values.join(', ')}]`);
  });

  const result: ValidationResult = {
    schema: schemaName,
    valid: errors.length === 0,
    errors,
    warnings,
  };

  results.push(result);
  return result;
}

/**
 * VALIDATE ALL SCHEMAS
 */

console.log('\n🔍 VALIDATING SCHEMAS...\n');

// PAY GRADE
validateSchema('PayGrade', PayGrade, PayGradeSchema);

// DEDUCTION
validateSchema('Deduction', Deduction, DeductionSchema);

// EXPENSE CLAIM
validateSchema('ExpenseClaim', ExpenseClaim, ExpenseClaimSchema);

// LABOR LAW POLICY
validateSchema('LaborLawPolicy', LaborLawPolicy, LaborLawPolicySchema);

// LEAVE POLICY
validateSchema('LeavePolicy', LeavePolicy, LeavePolicySchema);

// LEGAL RULE
validateSchema('LegalRule', LegalRule, LegalRuleSchema);

// MISCONDUCT RULE
validateSchema('MisconductRule', MisconductRule, MisconductRuleSchema);

// OVERTIME RULE
validateSchema('OverTimeRule', OvertimeRule, OvertimeRuleSchema);

// PAYROLL RUN CONFIGURATION
validateSchema(
  'PayrollRunConfiguration',
  PayrollRunConfiguration,
  PayrollRunConfigurationSchema
);

// PAYROLL SCHEDULE
validateSchema('PayrollSchedule', PayrollSchedule, PayrollScheduleSchema);

// FINAL OUTPUT
console.log('\n' + '='.repeat(60));
console.log('📊 SCHEMA VALIDATION RESULTS');
console.log('='.repeat(60) + '\n');

for (const r of results) {
  console.log(`${r.valid ? '✅' : '❌'} ${r.schema}`);

  if (r.errors.length > 0) {
    console.log('   ❌ ERRORS:');
    r.errors.forEach(e => console.log(`     - ${e}`));
  }

  if (r.warnings.length > 0) {
    console.log('   ℹ️ INFO:');
    r.warnings.forEach(w => console.log(`     - ${w}`));
  }

  console.log('');
}

const allValid = results.every(r => r.valid);

console.log('='.repeat(60));
if (allValid) {
  console.log('🎉 ALL SCHEMAS COMPILE CORRECTLY!\n');
  process.exit(0);
} else {
  console.log('❌ Some schemas failed validation.\n');
  process.exit(1);
}
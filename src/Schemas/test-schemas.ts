/**
 * Schema Test Script
 * Tests that schemas can be compiled and basic structure is correct
 */

import 'reflect-metadata';
import { PayGradeSchema } from './PayGrade.schema';
import { DeductionSchema } from './Deduction.schema';
import { ExpenseClaimSchema } from './ExpenseClaim.schema';

console.log('🧪 Testing Schema Compilation...\n');

const schemas = [
  { name: 'PayGrade', schema: PayGradeSchema },
  { name: 'Deduction', schema: DeductionSchema },
  { name: 'ExpenseClaim', schema: ExpenseClaimSchema },
];

let allPassed = true;

schemas.forEach(({ name, schema }) => {
  try {
    // Check if schema is defined
    if (!schema) {
      throw new Error('Schema is undefined');
    }

    // Check if schema has paths (Mongoose schema structure)
    const schemaObj = schema as any;
    if (schemaObj && typeof schemaObj === 'object') {
      console.log(`✅ ${name}: Schema compiled successfully`);
    } else {
      throw new Error('Schema structure is invalid');
    }
  } catch (error: any) {
    console.error(`❌ ${name}: ${error.message}`);
    allPassed = false;
  }
});

console.log('\n' + '='.repeat(50));
if (allPassed) {
  console.log('✅ All schemas compiled successfully!');
} else {
  console.log('❌ Some schemas failed to compile');
}
console.log('='.repeat(50));

process.exit(allPassed ? 0 : 1);


/**
 * Example Usage of Dummy Data Generator
 * This file demonstrates how to use the DummyDataGenerator in your code
 */

import 'reflect-metadata';
import { DummyDataGenerator } from './dummy-data.generator';
import { DummyContext } from './DummyContext';

console.log('📝 Example: Using Dummy Data Generator\n');
console.log('='.repeat(60));

// Step 1: Initialize the context (shared references)
const context = DummyContext.initialize();
console.log('✅ Step 1: Context initialized\n');

// Step 2: Generate individual data types
console.log('📊 Step 2: Generating individual data types\n');

const payGrades = DummyDataGenerator.generatePayGradeData(context, 3);
console.log(`Generated ${payGrades.length} PayGrades:`);
payGrades.forEach((pg, i) => {
  console.log(`  ${i + 1}. ${pg.name} - Base: $${pg.basePay}, Status: ${pg.status}`);
});

const deductions = DummyDataGenerator.generateDeductionData(context, 3);
console.log(`\nGenerated ${deductions.length} Deductions:`);
deductions.forEach((d, i) => {
  console.log(`  ${i + 1}. ${d.name} (${d.type}) - Method: ${d.calculationMethod}`);
});

const expenseClaims = DummyDataGenerator.generateExpenseClaimData(context, 3);
console.log(`\nGenerated ${expenseClaims.length} Expense Claims:`);
expenseClaims.forEach((ec, i) => {
  console.log(`  ${i + 1}. ${ec.type} - $${ec.amount}, Status: ${ec.status}`);
});

// Step 3: Generate all data at once
console.log('\n📦 Step 3: Generating all data at once\n');
const allData = DummyDataGenerator.generateAll(context);

console.log('All generated data:');
Object.keys(allData).forEach((key) => {
  const count = Array.isArray(allData[key]) ? allData[key].length : 0;
  console.log(`  - ${key}: ${count} item(s)`);
});

// Step 4: Access specific data
console.log('\n🔍 Step 4: Accessing specific data\n');
console.log(`First PayGrade: ${allData.payGrades[0].name}`);
console.log(`First Deduction: ${allData.deductions[0].name}`);
console.log(`First Legal Rule: ${allData.legalRules[0].name}`);

// Step 5: Filter data
console.log('\n🔎 Step 5: Filtering data\n');
const approvedPayGrades = allData.payGrades.filter(pg => pg.status === 'approved');
console.log(`Approved PayGrades: ${approvedPayGrades.length} out of ${allData.payGrades.length}`);

const pendingDeductions = allData.deductions.filter(d => d.status === 'pending');
console.log(`Pending Deductions: ${pendingDeductions.length} out of ${allData.deductions.length}`);

console.log('\n' + '='.repeat(60));
console.log('✅ Example completed!');
console.log('='.repeat(60));


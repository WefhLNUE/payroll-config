import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Payslip extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  employeeId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'EmployeePayroll', required: true })
  payrollId: Types.ObjectId;

  @Prop({ required: true })
  payPeriodStart: Date;

  @Prop({ required: true })
  payPeriodEnd: Date;

  @Prop({ required: true })
  grossSalary: number;

  @Prop([{ type: Types.ObjectId, ref: 'Allowance' }])
  allowances: Types.ObjectId[];

  @Prop({ default: 0 })
  totalAllowances: number;

  @Prop([{ type: Types.ObjectId, ref: 'ExpenseClaim' }])
  expenseClaims: Types.ObjectId[];

  @Prop({ type: Number, default: 0 })
  totalExpenseClaims: number;

  @Prop([{ type: Types.ObjectId, ref: 'Deduction' }])
  deductions: Types.ObjectId[];

  @Prop({ default: 0 })
  totalDeductions: number;

  @Prop([{ type: Types.ObjectId, ref: 'InsuranceBracket' }])
  insuranceBracket: Types.ObjectId;

  @Prop({ default: 0 })
  insuranceDeduction: number;

  @Prop({ required: true })
  netSalary: number;

  @Prop({ required: true })
  payDate: Date;

  @Prop({ default: 'pending', enum: ['pending', 'sent', 'rejected'] })
  status: string;
}

export const PayslipSchema = SchemaFactory.createForClass(Payslip);

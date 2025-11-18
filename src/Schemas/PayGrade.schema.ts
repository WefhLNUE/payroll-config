import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class PayGrade extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Position', required: true })
  position: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Department', required: true })
  department: Types.ObjectId;

  @Prop({ required: true })
  minSalary: number;

  @Prop({ required: true })
  maxSalary: number;

  @Prop({ required: true })
  basePay: number; // Base salary

  @Prop([{ type: Types.ObjectId, ref: 'Allowance' }])
  allowances: Types.ObjectId[];

  // Computed field: Gross Salary = basePay + allowances (calculated in application logic)
  @Prop()
  grossSalary: number; // Can be calculated or stored for quick access

  @Prop()
  description: string;

  @Prop({ default: 'draft', enum: ['draft', 'pending', 'approved', 'rejected'] })
  status: string; // Phase 1: Payroll Specialist creates, Phase 4: Payroll Manager approves

  // Audit trail fields - Phase 1: Payroll Specialist
  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId; // Payroll Specialist

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;

  // Phase 4: Payroll Manager approval
  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy: Types.ObjectId; // Payroll Manager

  @Prop({ type: Types.ObjectId, ref: 'User' })
  rejectedBy: Types.ObjectId; // Payroll Manager

  @Prop()
  approvedAt: Date;

  @Prop()
  rejectedAt: Date;

  @Prop()
  rejectionReason: string;

  @Prop()
  approvalComments: string;

  @Prop({ default: true })
  isActive: boolean;

  // Delete tracking - Phase 4: Payroll Manager can delete
  @Prop({ type: Types.ObjectId, ref: 'User' })
  deletedBy: Types.ObjectId; // Payroll Manager

  @Prop()
  deletedAt: Date;

  @Prop()
  deletionReason: string;

  @Prop({ default: false })
  isDeleted: boolean; // Soft delete flag

  // Version tracking for configuration changes
  @Prop({ default: 1 })
  version: number;
}

export const PayGradeSchema = SchemaFactory.createForClass(PayGrade);

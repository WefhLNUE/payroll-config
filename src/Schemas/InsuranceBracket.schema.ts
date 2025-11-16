import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class InsuranceBracket extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  minSalary: number;

  @Prop({ required: true })
  maxSalary: number;

  @Prop({ required: true })
  employeeContributionRate: number; // Percentage or fixed amount

  @Prop({ required: true })
  employerContributionRate: number; // Percentage or fixed amount

  @Prop()
  description: string;

  @Prop({ default: 'draft', enum: ['draft', 'pending', 'approved', 'rejected'] })
  status: string; // Phase 2: Payroll Specialist sets, Phase 5: HR Manager reviews/approves/rejects

  // Effective dates for policy enforcement
  @Prop({ required: true })
  effectiveFrom: Date;

  @Prop()
  effectiveTo: Date; // Optional, for policy expiration

  // Audit trail fields - Phase 2: Payroll Specialist
  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId; // Payroll Specialist

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId; // Payroll Specialist or HR Manager (Phase 5)

  // Phase 5: HR Manager oversight (approve/reject/update/delete)
  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy: Types.ObjectId; // HR Manager

  @Prop({ type: Types.ObjectId, ref: 'User' })
  rejectedBy: Types.ObjectId; // HR Manager

  @Prop()
  approvedAt: Date;

  @Prop()
  rejectedAt: Date;

  @Prop()
  approvalComments: string;

  @Prop()
  rejectionReason: string;

  @Prop({ default: true })
  isActive: boolean;

  // Delete tracking - Phase 5: HR Manager can delete
  @Prop({ type: Types.ObjectId, ref: 'User' })
  deletedBy: Types.ObjectId; // HR Manager

  @Prop()
  deletedAt: Date;

  @Prop()
  deletionReason: string;

  @Prop({ default: false })
  isDeleted: boolean; // Soft delete flag

  // Version tracking for policy changes
  @Prop({ default: 1 })
  version: number;
}

export const InsuranceBracketSchema =
  SchemaFactory.createForClass(InsuranceBracket);

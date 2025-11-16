import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Deduction extends Document {
  @Prop({ required: true, enum: ['tax', 'loan', 'penalty', 'insurance', 'other'] })
  type: string;

  @Prop({ required: true })
  name: string;

  // Can be fixed amount or percentage-based
  @Prop()
  amount: number; // Fixed amount (if applicable)

  @Prop()
  rate: number; // Percentage rate (if applicable)

  @Prop({ required: true, enum: ['fixed', 'percentage', 'calculated'] })
  calculationMethod: string; // How the deduction is calculated

  @Prop()
  description: string;

  // Conditions for applicability
  @Prop()
  applicableConditions: string; // JSON string or description of when this applies

  @Prop({ default: 'draft', enum: ['draft', 'pending', 'approved', 'rejected'] })
  status: string; // Phase 2: Legal Admin/Payroll Specialist creates, Phase 4: Payroll Manager approves

  // Effective dates for deduction rules
  @Prop()
  effectiveFrom: Date;

  @Prop()
  effectiveTo: Date;

  // Audit trail - Phase 2: Legal Admin or Payroll Specialist
  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId; // Legal Admin or Payroll Specialist

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
  approvalComments: string;

  @Prop()
  rejectionReason: string;

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

  // Version tracking
  @Prop({ default: 1 })
  version: number;
}

export const DeductionSchema = SchemaFactory.createForClass(Deduction);

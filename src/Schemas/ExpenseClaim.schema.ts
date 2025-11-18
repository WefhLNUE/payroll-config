import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ExpenseClaim extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  employeeId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: ['travel', 'meal', 'accommodation', 'transportation', 'other'] })
  type: string;

  @Prop()
  description: string;

  @Prop([{ type: String }])
  receipts: string[]; // URLs to uploaded documents/images

  @Prop({ default: 'pending', enum: ['pending', 'approved', 'rejected'] })
  status: string;

  // Approval/Rejection tracking
  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  rejectedBy: Types.ObjectId;

  @Prop()
  approvedAt: Date;

  @Prop()
  rejectedAt: Date;

  @Prop()
  approvalComments: string;

  @Prop()
  rejectionReason: string;

  // Expense period
  @Prop({ required: true })
  expenseDate: Date;

  @Prop()
  claimDate: Date; // When employee submitted the claim
}

export const ExpenseClaimSchema = SchemaFactory.createForClass(ExpenseClaim);

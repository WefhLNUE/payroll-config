import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class LeavePolicy extends Document {
  @Prop({ required: true })
  name: string; // e.g., Paid Leave, Unpaid Leave, Sick Leave
  @Prop({ required: true, enum: ['PAID', 'UNPAID'] })
  type: string;
  maxDaysPerYear: number;
  @Prop({ default: false })
  requiresApproval: boolean;
}
export const LeavePolicySchema = SchemaFactory.createForClass(LeavePolicy);

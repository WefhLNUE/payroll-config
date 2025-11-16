import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ApprovalRequest extends Document {
  @Prop({ required: true })
  configurationType: string; // 'Allowance', 'LeavePolicy', etc.
  @Prop({ type: Types.ObjectId, required: true })
  configurationId: Types.ObjectId;
  @Prop({ enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' })
  status: string;
  @Prop()
  managerComment: string;
}
export const ApprovalRequestSchema =
  SchemaFactory.createForClass(ApprovalRequest);

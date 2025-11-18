import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class PayrollSchedule extends Document {
  @Prop({ enum: ['MONTHLY', 'BIWEEKLY', 'WEEKLY'], required: true })
  frequency: string;
  @Prop({ required: true })
  cutoffDay: number; // e.g., 25th of month
  payoutDay: number; // e.g., 28th of month
}
export const PayrollScheduleSchema =
  SchemaFactory.createForClass(PayrollSchedule);

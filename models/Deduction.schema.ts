import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Deduction extends Document {
  @Prop({ required: true })
  type: string; // tax, loan, penalty

  @Prop({ required: true })
  amount: number;

  @Prop()
  description: string;

  @Prop({ default: 'pending', enum: ['approved', 'pending', 'rejected'] })
  status: string;
}

export const DeductionSchema = SchemaFactory.createForClass(Deduction);

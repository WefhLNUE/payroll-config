import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class DeductionPolicy extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ enum: ['FIXED', 'PERCENTAGE'], required: true })
  type: string;

  @Prop({ required: true })
  amount: number; // fixed amount or percentage
}

export const DeductionPolicySchema =
  SchemaFactory.createForClass(DeductionPolicy);

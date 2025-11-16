import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AllowancePolicy extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ enum: ['FIXED', 'PERCENTAGE'], required: true })
  calculationType: string;

  @Prop({ required: true })
  value: number; // either amount or percent
}

export const AllowancePolicySchema =
  SchemaFactory.createForClass(AllowancePolicy);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class Tax extends Document {
  @Prop({ required: true })
  type: string; // incomeTax, etc.

  @Prop({ required: true })
  incomeTaxRate: number;

  @Prop({ required: true })
  maxTax: number;

  @Prop({ type: Number, default: 0 })
  exemptions: number;

  @Prop({ default: 'pending', enum: ['approved', 'pending', 'rejected'] })
  status: string;
}

export const TaxSchema = SchemaFactory.createForClass(Tax);

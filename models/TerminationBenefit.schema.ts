import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class TerminationBenefit extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  calculationFormula: string; // e.g., 'paygrade.baseSalary * 2'
}

export const TerminationBenefitSchema =
  SchemaFactory.createForClass(TerminationBenefit);

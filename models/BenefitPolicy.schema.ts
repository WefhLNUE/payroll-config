import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class BenefitPolicy extends Document {
  @Prop({ required: true })
  name: string;
  @Prop()
  description: string;
  employerContributionPercent: number;
}
export const BenefitPolicySchema =
  SchemaFactory.createForClass(BenefitPolicy);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class InsuranceBracket extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  minSalary: number;

  @Prop({ required: true })
  maxSalary: number;

  @Prop({ required: true })
  employeeContributionRate: number;

  @Prop({ required: true })
  employerContributionRate: number;

  @Prop({ default: 'pending', enum: ['approved', 'pending', 'rejected'] })
  status: string;
}

export const InsuranceBracketSchema =
  SchemaFactory.createForClass(InsuranceBracket);

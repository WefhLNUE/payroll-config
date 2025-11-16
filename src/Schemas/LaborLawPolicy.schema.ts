import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class LaborLawPolicy extends Document {
  @Prop({ required: true })
  lawName: string;
  description: string;
  @Prop({ default: true })
  active: boolean;
}
export const LaborLawPolicySchema =
  SchemaFactory.createForClass(LaborLawPolicy);

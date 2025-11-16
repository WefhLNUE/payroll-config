import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class MisconductRule extends Document {
  @Prop({ required: true })
  description: string;
  penaltyAmount: number;
  @Prop({ enum: ['WARNING', 'DEDUCTION', 'SUSPENSION'], required: true })
  penaltyType: string;
}
export const MisconductRuleSchema =
  SchemaFactory.createForClass(MisconductRule);
  

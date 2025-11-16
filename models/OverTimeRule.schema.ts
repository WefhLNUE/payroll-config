import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class OvertimeRule extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  multiplier: number; // 1.25, 1.5, 2.0, etc.

  @Prop({ required: true })
  maxHoursPerMonth: number;
}

export const OvertimeRuleSchema =
  SchemaFactory.createForClass(OvertimeRule);

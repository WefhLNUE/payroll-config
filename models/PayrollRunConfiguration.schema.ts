import import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class PayrollRunConfiguration extends Document {
  @Prop({ default: true })
  allowRetroactiveAdjustments: boolean;

  @Prop({ default: false })
  autoGeneratePaySlips: boolean;

  @Prop({ required: true })
  gracePeriodDays: number;

  @Prop()
  roundingRule: string; // 'nearest', 'up', 'down'
}

export const PayrollRunConfigurationSchema =
  SchemaFactory.createForClass(PayrollRunConfiguration);

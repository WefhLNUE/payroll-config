import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class PayType extends Document {
  @Prop({
    required: true,
    enum: ['hourly', 'daily', 'weekly', 'monthly', 'contract-based'],
  })
  type: string;

  @Prop({ required: true })
  contractStartDate: Date;

  @Prop({ required: true })
  contractEndDate: Date;

  @Prop({ default: 'active', enum: ['active', 'inactive'] })
  status: string;
}

export const PayTypeSchema = SchemaFactory.createForClass(PayType);

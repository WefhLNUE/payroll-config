import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class PayGrade extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Position', required: true })
  position: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Department', required: true })
  department: Types.ObjectId;

  @Prop({ required: true })
  minSalary: number;

  @Prop({ required: true })
  maxSalary: number;

  @Prop({ required: true })
  baseSalary: number;

  @Prop([{ type: Types.ObjectId, ref: 'Allowance' }])
  allowances: Types.ObjectId[];

  @Prop({ default: 'pending', enum: ['approved', 'pending', 'rejected'] })
  status: string;
}

export const PaygradeSchema = SchemaFactory.createForClass(PayGrade);

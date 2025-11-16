import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class SigningBonus extends Document {
  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'pending', enum: ['pending', 'approved', 'rejected'] })
  status: string;
}

export const SigningBonusSchema = SchemaFactory.createForClass(SigningBonus);

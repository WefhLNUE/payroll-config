import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class AuditLog extends Document {
  @Prop({ type: Types.ObjectId })
  userId: Types.ObjectId;
  @Prop({ required: true })
  action: string;
  entityType: string;
  entityId: Types.ObjectId;
  @Prop()
  details: string;
}
export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

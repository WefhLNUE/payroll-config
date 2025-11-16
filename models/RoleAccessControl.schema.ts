import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class RoleAccessControl extends Document {
  @Prop({ required: true })
  roleName: string;

  @Prop([String])
  allowedActions: string[]; // ['CONFIGURE_PAYROLL', 'VIEW_SALARY', 'APPROVE_CHANGES']
}

export const RoleAccessControlSchema =
  SchemaFactory.createForClass(RoleAccessControl);

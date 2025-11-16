import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ConfigurationVersion extends Document {
  @Prop({ required: true })
  configurationType: string;
  @Prop({ type: Types.ObjectId, required: true })
  configurationId: Types.ObjectId;
  versionNumber: number;
  changes: string; // textual description of modifications
}
export const ConfigurationVersionSchema =
  SchemaFactory.createForClass(ConfigurationVersion);

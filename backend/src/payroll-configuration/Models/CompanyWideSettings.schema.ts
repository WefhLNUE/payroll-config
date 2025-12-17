import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CompanyWideSettingsDocument=HydratedDocument<CompanyWideSettings>

@Schema({timestamps: true})
export class CompanyWideSettings {
    @Prop({ required: true, })
    payDate: Date; 
    @Prop({ required: true,})
    timeZone: string;
    @Prop({ required: true, default:'EGP' })
    currency: string; //will allow only egp
    @Prop({ required: false })
    backupFrequency?: string; // daily, weekly, monthly
    @Prop({ required: false })
    backupLocation?: string; // local, cloud, etc.
    @Prop({ required: false, min: 0 })
    retentionPeriod?: number; // days
}

export const CompanyWideSettingsSchema = SchemaFactory.createForClass(CompanyWideSettings);
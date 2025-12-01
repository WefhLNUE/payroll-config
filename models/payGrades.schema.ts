// Placeholder - Waiting for content

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ConfigStatus } from '../enums/payroll-configuration-enums';

export type PayGradeDocument = HydratedDocument<PayGrade>;

@Schema({ timestamps: true })
export class PayGrade {
    @Prop({ required: true, unique: true })
    grade: string; // position garde and name like:  Junior TA, Mid TA, Senior TA
    @Prop({ required: true, min: 6000 })
    baseSalary: number
    @Prop({ required: true, min: 6000 })
    grossSalary: number;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Position' })
    positionId?: mongoose.Types.ObjectId;
    @Prop({ required: true, type: String, enum: ConfigStatus,default:ConfigStatus.DRAFT })
    status: ConfigStatus;// draft, approved, rejected

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeProfile' })
    createdBy?: mongoose.Types.ObjectId;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeProfile' })
    approvedBy?: mongoose.Types.ObjectId;
    @Prop({})
    approvedAt?: Date;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeProfile' })
    rejectedBy?: mongoose.Types.ObjectId;
    @Prop({})
    rejectedAt?: Date;
    @Prop({})
    rejectionReason?: string;
}

export const PayGradeSchema = SchemaFactory.createForClass(PayGrade);
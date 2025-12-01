
import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
<<<<<<< HEAD:models/allowance.schema.ts
import mongoose, { HydratedDocument, } from 'mongoose';
import {  EmployeeProfile as Employee} from '../../employee-profile/Models/employee-profile.schema';
=======
import mongoose, { HydratedDocument } from 'mongoose';
// import {  EmployeeProfile as Employee} from '../../employee-profile/Models/employee-profile.schema';
>>>>>>> 37568b1553989015436e4edfb85ad671bc5507ec:Models/SigningBonus.schema.ts
import { ConfigStatus } from '../enums/payroll-configuration-enums';
export type allowanceDocument = HydratedDocument<allowance>




@Schema({ timestamps: true })
export class allowance {
    @Prop({ required: true, unique: true })
    name: string; // allowance name like:  Housing Allowance, Transport Allowance
    @Prop({ required: true, min: 0 })
    amount: number;
   @Prop({ required: true, type: String, enum: ConfigStatus,default:ConfigStatus.DRAFT })
    status: ConfigStatus;// draft, approved, rejected

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'employee-profile' })
    createdBy?: mongoose.Types.ObjectId;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'employee-profile' })
    approvedBy?: mongoose.Types.ObjectId;
    @Prop({})
    approvedAt?: Date


}

export const allowanceSchema = SchemaFactory.createForClass(allowance);

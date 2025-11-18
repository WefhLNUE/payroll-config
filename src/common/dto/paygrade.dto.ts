import { Types } from 'mongoose';

export class PayGradeDTO {
  _id?: Types.ObjectId | string;
  name?: string;
  baseSalary?: number;
  basePay?: number;
  currency?: string;
  description?: string;
  status?: string;
  position?: Types.ObjectId;
  department?: Types.ObjectId;
  minSalary?: number;
  maxSalary?: number;
  allowances?: Types.ObjectId[];
  grossSalary?: number;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  isActive?: boolean;
  version?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

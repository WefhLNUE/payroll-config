import { Types } from 'mongoose';

export class DeductionDTO {
  _id?: Types.ObjectId | string;
  name?: string;
  deductionType?: string;
  type?: string;
  calculationMethod?: string;
  percentage?: number;
  fixedAmount?: number;
  amount?: number;
  rate?: number;
  description?: string;
  applicableConditions?: string;
  status?: string;
  effectiveFrom?: Date;
  effectiveTo?: Date;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  isActive?: boolean;
  version?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

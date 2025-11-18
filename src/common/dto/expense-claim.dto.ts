import { Types } from 'mongoose';

export class ExpenseClaimDTO {
  _id?: Types.ObjectId | string;
  employeeId?: Types.ObjectId | string;
  amount?: number;
  category?: string;
  type?: string;
  description?: string;
  receipts?: string[];
  receiptUrl?: string;
  status?: string;
  approvedAmount?: number;
  approvedBy?: Types.ObjectId | string;
  rejectedBy?: Types.ObjectId | string;
  approvalComments?: string;
  rejectionReason?: string;
  expenseDate?: Date;
  claimDate?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

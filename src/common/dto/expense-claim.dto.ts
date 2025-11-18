export class ExpenseClaimDTO {
  _id?: string;
  employeeId: string;
  amount: number;
  category: string;
  description: string;
  receiptUrl?: string;
  status?: string;
  approvedAmount?: number;
  approvedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

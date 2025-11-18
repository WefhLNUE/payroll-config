export class DeductionDTO {
  _id?: string;
  name: string;
  deductionType: string;
  percentage?: number;
  fixedAmount?: number;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

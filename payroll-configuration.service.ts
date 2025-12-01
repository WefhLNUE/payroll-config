import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model, FilterQuery, Types } from 'mongoose';
  import { payType, payTypeDocument } from './Models/PayType.schema';
  import {
    ConfigStatus,
    PolicyType,
  } from './enums/payroll-configuration-enums';
  import {
    CreatePayTypeDto,
    UpdatePayTypeDto,
  } from './dto/pay-type';
  import {
    CreatePayrollPolicyDto,
    UpdatePayrollPolicyDto,
  } from './dto/payroll-policy';
  import {
    CreatePayGradeDto,
    UpdatePayGradeDto,
  } from './dto/pay-grade';
  import {
    payrollPolicies,
    payrollPoliciesDocument,
  } from './Models/payrollPolicies.schema';
  import { PayGrade, PayGradeDocument } from './Models/payGrades.schema';
  
  @Injectable()
  export class PayrollConfigurationService {
    constructor(
      @InjectModel(payType.name)
      private readonly payTypeModel: Model<payTypeDocument>,
      @InjectModel(payrollPolicies.name)
      private readonly payrollPoliciesModel: Model<payrollPoliciesDocument>,
      @InjectModel(PayGrade.name)
      private readonly payGradeModel: Model<PayGradeDocument>,
    ) {}
  
    // #region Pay Types
  
    async createPayType(
      createDto: CreatePayTypeDto,
    ): Promise<payTypeDocument> {
      const exists = await this.payTypeModel
        .findOne({ type: createDto.type })
        .lean()
        .exec();
      if (exists) {
        throw new ConflictException(
          `Pay type "${createDto.type}" already exists`,
        );
      }
  
      // Validate description: if provided, must be at least 10 characters
      if (createDto.description && createDto.description.length < 10) {
        throw new BadRequestException(
          'Description must be at least 10 characters if provided',
        );
      }
  
      const created = new this.payTypeModel({
        ...createDto,
        status: ConfigStatus.DRAFT,
      });
      return created.save();
    }
  
    async getAllPayTypes(
      status?: ConfigStatus,
    ): Promise<payTypeDocument[]> {
      const filter: FilterQuery<payTypeDocument> = {};
      if (status) {
        filter.status = status;
      }
  
      return this.payTypeModel
        .find(filter)
        .sort({ createdAt: -1 })
        .exec();
    }
  
    async getPayTypeById(id: string): Promise<payTypeDocument> {
      const payTypeDoc = await this.payTypeModel.findById(id).exec();
      if (!payTypeDoc) {
        throw new NotFoundException(`Pay type with id ${id} not found`);
      }
      return payTypeDoc;
    }
  
    async updatePayType(
      id: string,
      updateDto: UpdatePayTypeDto,
    ): Promise<payTypeDocument> {
      const payTypeDoc = await this.getPayTypeById(id);
  
      if (payTypeDoc.status !== ConfigStatus.DRAFT) {
        throw new BadRequestException(
          'Can only edit configurations in DRAFT status',
        );
      }
  
      // Validate description: if provided, must be at least 10 characters
      if (updateDto.description !== undefined) {
        if (updateDto.description && updateDto.description.length < 10) {
          throw new BadRequestException(
            'Description must be at least 10 characters if provided',
          );
        }
      }
  
      Object.assign(payTypeDoc, updateDto);
      return payTypeDoc.save();
    }
  
    async deletePayType(id: string): Promise<void> {
      const payTypeDoc = await this.getPayTypeById(id);
  
      if (payTypeDoc.status !== ConfigStatus.DRAFT) {
        throw new BadRequestException(
          'Can only delete configurations in DRAFT status',
        );
      }
  
      // Validate if pay type can be deleted
      const canDelete = await this.validateDeletion('payType', id);
      if (!canDelete) {
        throw new BadRequestException(
          'Cannot delete pay type: it is being used by employee contracts',
        );
      }
  
      await this.payTypeModel.deleteOne({ _id: id }).exec();
    }
  
    async approvePayType(
      id: string,
      approvedBy: string,
    ): Promise<payTypeDocument> {
      const payTypeDoc = await this.getPayTypeById(id);
  
      if (payTypeDoc.status !== ConfigStatus.DRAFT) {
        throw new BadRequestException(
          'Can only approve configurations in DRAFT status',
        );
      }
  
      payTypeDoc.status = ConfigStatus.APPROVED;
      payTypeDoc.approvedBy = new Types.ObjectId(approvedBy);
      payTypeDoc.approvedAt = new Date();
      payTypeDoc.rejectedBy = undefined;
      payTypeDoc.rejectedAt = undefined;
      payTypeDoc.rejectionReason = undefined;
  
      return payTypeDoc.save();
    }
  
    async rejectPayType(
      id: string,
      rejectedBy: string,
      reason: string,
    ): Promise<payTypeDocument> {
      const payTypeDoc = await this.getPayTypeById(id);
  
      if (payTypeDoc.status !== ConfigStatus.DRAFT) {
        throw new BadRequestException(
          'Can only reject configurations in DRAFT status',
        );
      }
  
      payTypeDoc.status = ConfigStatus.REJECTED;
      payTypeDoc.rejectedBy = new Types.ObjectId(rejectedBy);
      payTypeDoc.rejectedAt = new Date();
      payTypeDoc.rejectionReason = reason;
      payTypeDoc.approvedBy = undefined;
      payTypeDoc.approvedAt = undefined;
  
      return payTypeDoc.save();
    }
  
    // #endregion
  
    // #region Pay Grades
  
    private validateSalaryRules(
      baseSalary: number,
      grossSalary: number,
    ): void {
      // BR-4: Base salary must be at least 6000 EGP (Egyptian minimum wage)
      if (baseSalary < 6000) {
        throw new BadRequestException(
          'Base salary must be at least 6000 EGP to comply with BR-4 (Egyptian minimum wage)',
        );
      }
  
      if (grossSalary < baseSalary) {
        throw new BadRequestException(
          'Gross salary must be greater than or equal to base salary',
        );
      }
  
      // Business rule: grossSalary cannot be more than 10x baseSalary
      if (grossSalary > baseSalary * 10) {
        throw new BadRequestException(
          'Gross salary cannot exceed 10 times the base salary',
        );
      }
    }
  
    async createPayGrade(
      createDto: CreatePayGradeDto,
    ): Promise<PayGradeDocument> {
      const exists = await this.payGradeModel
        .findOne({ grade: createDto.grade })
        .lean()
        .exec();
  
      if (exists) {
        throw new ConflictException(
          `Pay grade "${createDto.grade}" already exists`,
        );
      }
  
      this.validateSalaryRules(createDto.baseSalary, createDto.grossSalary);
  
      const created = new this.payGradeModel({
        ...createDto,
        status: ConfigStatus.DRAFT,
      });
  
      return created.save();
    }
  
    async getAllPayGrades(
      status?: ConfigStatus,
    ): Promise<PayGradeDocument[]> {
      const filter: FilterQuery<PayGradeDocument> = {};
  
      if (status) {
        filter.status = status;
      }
  
      return this.payGradeModel.find(filter).sort({ grade: 1 }).exec();
    }
  
    async getPayGradeById(id: string): Promise<PayGradeDocument> {
      const payGradeDoc = await this.payGradeModel.findById(id).exec();
  
      if (!payGradeDoc) {
        throw new NotFoundException(`Pay grade with id ${id} not found`);
      }
  
      return payGradeDoc;
    }
  
    async updatePayGrade(
      id: string,
      updateDto: UpdatePayGradeDto,
    ): Promise<PayGradeDocument> {
      const payGradeDoc = await this.getPayGradeById(id);
  
      if (payGradeDoc.status !== ConfigStatus.DRAFT) {
        throw new BadRequestException(
          'Can only edit configurations in DRAFT status',
        );
      }
  
      const baseSalary =
        updateDto.baseSalary ?? payGradeDoc.baseSalary;
      const grossSalary =
        updateDto.grossSalary ?? payGradeDoc.grossSalary;
  
      this.validateSalaryRules(baseSalary, grossSalary);
  
      Object.assign(payGradeDoc, updateDto);
      return payGradeDoc.save();
    }
  
    async deletePayGrade(id: string): Promise<void> {
      const payGradeDoc = await this.getPayGradeById(id);
  
      if (payGradeDoc.status !== ConfigStatus.DRAFT) {
        throw new BadRequestException(
          'Can only delete configurations in DRAFT status',
        );
      }
  
      // Validate if pay grade can be deleted
      const canDelete = await this.validateDeletion('payGrade', id);
      if (!canDelete) {
        throw new BadRequestException(
          'Cannot delete pay grade: it is referenced by employees',
        );
      }
  
      await this.payGradeModel.deleteOne({ _id: id }).exec();
    }
  
    async approvePayGrade(
      id: string,
      approvedBy: string,
    ): Promise<PayGradeDocument> {
      const payGradeDoc = await this.getPayGradeById(id);
  
      if (payGradeDoc.status !== ConfigStatus.DRAFT) {
        throw new BadRequestException(
          'Can only approve configurations in DRAFT status',
        );
      }
  
      payGradeDoc.status = ConfigStatus.APPROVED;
      payGradeDoc.approvedBy = new Types.ObjectId(approvedBy);
      payGradeDoc.approvedAt = new Date();
      payGradeDoc.rejectedBy = undefined;
      payGradeDoc.rejectedAt = undefined;
      payGradeDoc.rejectionReason = undefined;
  
      return payGradeDoc.save();
    }
  
    async rejectPayGrade(
      id: string,
      rejectedBy: string,
      reason: string,
    ): Promise<PayGradeDocument> {
      const payGradeDoc = await this.getPayGradeById(id);
  
      if (payGradeDoc.status !== ConfigStatus.DRAFT) {
        throw new BadRequestException(
          'Can only reject configurations in DRAFT status',
        );
      }
  
      payGradeDoc.status = ConfigStatus.REJECTED;
      payGradeDoc.rejectedBy = new Types.ObjectId(rejectedBy);
      payGradeDoc.rejectedAt = new Date();
      payGradeDoc.rejectionReason = reason;
      payGradeDoc.approvedBy = undefined;
      payGradeDoc.approvedAt = undefined;
  
      return payGradeDoc.save();
    }
  
    // #endregion
  
    // #region Payroll Policies
  
    private validateRuleDefinition(
      ruleDefinition: CreatePayrollPolicyDto['ruleDefinition'],
      policyType: PolicyType,
    ): void {
      if (!ruleDefinition) {
        throw new BadRequestException('ruleDefinition is required');
      }
  
      // Validate that at least one field is provided
      const hasPercentage = ruleDefinition.percentage !== undefined && ruleDefinition.percentage !== null;
      const hasFixedAmount = ruleDefinition.fixedAmount !== undefined && ruleDefinition.fixedAmount !== null;
      const hasThreshold = ruleDefinition.threshold !== undefined && ruleDefinition.threshold !== null;
  
      if (!hasPercentage && !hasFixedAmount && !hasThreshold) {
        throw new BadRequestException(
          'ruleDefinition must include at least one value (percentage, fixedAmount, or threshold)',
        );
      }
  
      // Validate percentage range if provided
      if (hasPercentage) {
        const percentage = ruleDefinition.percentage!;
        if (percentage < 0 || percentage > 100) {
          throw new BadRequestException(
            'Percentage must be between 0 and 100',
          );
        }
      }
  
      // Validate fixedAmount and threshold are non-negative if provided
      if (hasFixedAmount) {
        const fixedAmount = ruleDefinition.fixedAmount!;
        if (fixedAmount < 0) {
          throw new BadRequestException(
            'Fixed amount must be greater than or equal to 0',
          );
        }
      }
  
      if (hasThreshold) {
        const threshold = ruleDefinition.threshold!;
        if (threshold < 0) {
          throw new BadRequestException(
            'Threshold must be greater than or equal to 0',
          );
        }
      }
    }
  
    private validateEffectiveDate(effectiveDate: string | Date): void {
      const date = typeof effectiveDate === 'string' ? new Date(effectiveDate) : effectiveDate;
      
      if (isNaN(date.getTime())) {
        throw new BadRequestException('Invalid effective date');
      }
  
      // Effective date should not be too far in the past (more than 1 year)
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      if (date < oneYearAgo) {
        throw new BadRequestException(
          'Effective date cannot be more than 1 year in the past',
        );
      }
  
      // Effective date should not be too far in the future (more than 5 years)
      const fiveYearsFromNow = new Date();
      fiveYearsFromNow.setFullYear(fiveYearsFromNow.getFullYear() + 5);
      
      if (date > fiveYearsFromNow) {
        throw new BadRequestException(
          'Effective date cannot be more than 5 years in the future',
        );
      }
    }
  
    async createPayrollPolicy(
      createDto: CreatePayrollPolicyDto,
    ): Promise<payrollPoliciesDocument> {
      // Prevent duplicate policyName + policyType combination
      const exists = await this.payrollPoliciesModel
        .findOne({
          policyName: createDto.policyName,
          policyType: createDto.policyType,
        })
        .lean()
        .exec();
  
      if (exists) {
        throw new ConflictException(
          `Payroll policy with name "${createDto.policyName}" and type "${createDto.policyType}" already exists`,
        );
      }
  
      // Validate effective date
      this.validateEffectiveDate(createDto.effectiveDate);
  
      // Validate rule definition
      this.validateRuleDefinition(createDto.ruleDefinition, createDto.policyType);
  
      // Convert effectiveDate string to Date object
      const created = new this.payrollPoliciesModel({
        ...createDto,
        effectiveDate: new Date(createDto.effectiveDate),
        status: ConfigStatus.DRAFT,
      });
  
      return created.save();
    }
  
    async getAllPayrollPolicies(
      policyType?: PolicyType,
      status?: ConfigStatus,
    ): Promise<payrollPoliciesDocument[]> {
      const filter: FilterQuery<payrollPoliciesDocument> = {};
  
      if (policyType) {
        filter.policyType = policyType;
      }
  
      if (status) {
        filter.status = status;
      }
  
      return this.payrollPoliciesModel
        .find(filter)
        .sort({ createdAt: -1 })
        .exec();
    }
  
    async getPayrollPolicyById(
      id: string,
    ): Promise<payrollPoliciesDocument> {
      const policy = await this.payrollPoliciesModel.findById(id).exec();
  
      if (!policy) {
        throw new NotFoundException(`Payroll policy with id ${id} not found`);
      }
  
      return policy;
    }
  
    async updatePayrollPolicy(
      id: string,
      updateDto: UpdatePayrollPolicyDto,
    ): Promise<payrollPoliciesDocument> {
      const policy = await this.getPayrollPolicyById(id);
  
      if (policy.status !== ConfigStatus.DRAFT) {
        throw new BadRequestException(
          'Can only edit configurations in DRAFT status',
        );
      }
  
      // Check for duplicate policyName + policyType combination if either is being updated
      if (updateDto.policyName || updateDto.policyType) {
        const newPolicyName = updateDto.policyName ?? policy.policyName;
        const newPolicyType = updateDto.policyType ?? policy.policyType;
  
        const exists = await this.payrollPoliciesModel
          .findOne({
            policyName: newPolicyName,
            policyType: newPolicyType,
            _id: { $ne: id },
          })
          .lean()
          .exec();
  
        if (exists) {
          throw new ConflictException(
            `Payroll policy with name "${newPolicyName}" and type "${newPolicyType}" already exists`,
          );
        }
      }
  
      // Validate effective date if being updated
      if (updateDto.effectiveDate) {
        this.validateEffectiveDate(updateDto.effectiveDate);
        // Convert string to Date if needed
        if (typeof updateDto.effectiveDate === 'string') {
          updateDto.effectiveDate = new Date(updateDto.effectiveDate) as any;
        }
      }
  
      // Validate rule definition if being updated
      if (updateDto.ruleDefinition) {
        const policyType = updateDto.policyType ?? policy.policyType;
        this.validateRuleDefinition(updateDto.ruleDefinition, policyType);
      }
  
      Object.assign(policy, updateDto);
      return policy.save();
    }
  
    async deletePayrollPolicy(id: string): Promise<void> {
      const policy = await this.getPayrollPolicyById(id);
  
      if (policy.status !== ConfigStatus.DRAFT) {
        throw new BadRequestException(
          'Can only delete configurations in DRAFT status',
        );
      }
  
      await this.payrollPoliciesModel.deleteOne({ _id: id }).exec();
    }
  
    async approvePayrollPolicy(
      id: string,
      approvedBy: string,
    ): Promise<payrollPoliciesDocument> {
      const policy = await this.getPayrollPolicyById(id);
  
      if (policy.status !== ConfigStatus.DRAFT) {
        throw new BadRequestException(
          'Can only approve configurations in DRAFT status',
        );
      }
  
      policy.status = ConfigStatus.APPROVED;
      policy.approvedBy = new Types.ObjectId(approvedBy);
      policy.approvedAt = new Date();
      policy.rejectedBy = undefined;
      policy.rejectedAt = undefined;
      policy.rejectionReason = undefined;
  
      return policy.save();
    }
  
    async rejectPayrollPolicy(
      id: string,
      rejectedBy: string,
      reason: string,
    ): Promise<payrollPoliciesDocument> {
      const policy = await this.getPayrollPolicyById(id);
  
      if (policy.status !== ConfigStatus.DRAFT) {
        throw new BadRequestException(
          'Can only reject configurations in DRAFT status',
        );
      }
  
      policy.status = ConfigStatus.REJECTED;
      policy.rejectedBy = new Types.ObjectId(rejectedBy);
      policy.rejectedAt = new Date();
      policy.rejectionReason = reason;
      policy.approvedBy = undefined;
      policy.approvedAt = undefined;
  
      return policy.save();
    }
  
    // #endregion
  
    // #region Validation Methods
  
    /**
     * Validates if a configuration can be deleted.
     * This method will be enhanced later when other modules (Employee, Contracts) are integrated.
     *
     * @param entityType - Type of entity: 'payType', 'payGrade', or 'payrollPolicy'
     * @param id - ID of the entity to validate
     * @returns Promise<boolean> - true if can be deleted, false otherwise
     */
    async validateDeletion(entityType: string, id: string): Promise<boolean> {
      switch (entityType) {
        case 'payType':
          // TODO: Check contract references when Employee module exists
          // For now, allow deletion (return true)
          // When Employee module is integrated, check if any employee contract uses this pay type
          return true;
  
        case 'payGrade':
          // TODO: Check employee references when Employee module exists
          // For now, allow deletion (return true)
          // When Employee module is integrated, check if any employee has this pay grade assigned
          return true;
  
        case 'payrollPolicy':
          // TODO: Check if policy is being used by any employee or payroll calculation
          // For now, allow deletion (return true)
          return true;
  
        default:
          throw new BadRequestException(`Unknown entity type: ${entityType}`);
      }
    }
  
    // #endregion
  }
  
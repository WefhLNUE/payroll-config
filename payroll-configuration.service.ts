import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { ConfigStatus } from './enums/payroll-configuration-enums';

import { signingBonus } from './Models/SigningBonus.schema';
import { taxRules } from './Models/taxRules.schema';
import { terminationAndResignationBenefits } from './Models/terminationAndResignationBenefits';
import { allowance, allowanceDocument } from './Models/allowance.schema';
import {
  CompanyWideSettings,
  CompanyWideSettingsDocument,
} from './Models/CompanyWideSettings.schema';
import {
  insuranceBrackets,
  insuranceBracketsDocument,
} from './Models/insuranceBrackets.schema';

type AllowancePayload = Pick<allowance, 'name' | 'amount'> & {
  createdBy?: string;
};

type InsurancePayload = Pick<
  insuranceBrackets,
  'name' | 'amount' | 'minSalary' | 'maxSalary' | 'employeeRate' | 'employerRate'
> & {
  createdBy?: string;
};

interface UpdateStatusPayload {
  status: ConfigStatus;
  approverId?: string;
}

@Injectable()
export class PayrollConfigurationService {
  constructor(
    @InjectModel(signingBonus.name)
    private signingBonusModel: mongoose.Model<signingBonus>,

    @InjectModel(taxRules.name)
    private taxRulesModel: mongoose.Model<taxRules>,

    @InjectModel(terminationAndResignationBenefits.name)
    private termModel: mongoose.Model<terminationAndResignationBenefits>,

    @InjectModel(allowance.name)
    private readonly allowanceModel: Model<allowanceDocument>,

    @InjectModel(CompanyWideSettings.name)
    private readonly companySettingsModel: Model<CompanyWideSettingsDocument>,

    @InjectModel(insuranceBrackets.name)
    private readonly insuranceModel: Model<insuranceBracketsDocument>,
  ) { }

  // ------- Signing Bonus -------
  async createSigningBonus(dto: any) {
    dto.status = ConfigStatus.DRAFT;
    return this.signingBonusModel.create(dto);
  }

  async updateSigningBonus(id: string, dto: any) {
    const doc = await this.signingBonusModel.findById(id);
    if (!doc) throw new BadRequestException('Not found');
    if (doc.status !== ConfigStatus.DRAFT)
      throw new BadRequestException('Cannot edit non-draft configuration');

    return this.signingBonusModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async getAllSigningBonus() {
    return this.signingBonusModel.find();
  }

  async getOneSigningBonus(id: string) {
    return this.signingBonusModel.findById(id);
  }

  // ------- Tax Rules -------
  async createTaxRule(dto: any) {
    dto.status = ConfigStatus.DRAFT;
    return this.taxRulesModel.create(dto);
  }

  async updateTaxRule(id: string, dto: any) {
    const doc = await this.taxRulesModel.findById(id);
    if (!doc) throw new BadRequestException('Not found');
    if (doc.status !== ConfigStatus.DRAFT)
      throw new BadRequestException('Cannot edit non-draft configuration');

    return this.taxRulesModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async getAllTaxRules() {
    return this.taxRulesModel.find();
  }

  async getOneTaxRule(id: string) {
    return this.taxRulesModel.findById(id);
  }

  // ------- Termination Benefits -------
  async createTerminationBenefit(dto: any) {
    dto.status = ConfigStatus.DRAFT;
    return this.termModel.create(dto);
  }

  async updateTerminationBenefit(id: string, dto: any) {
    const doc = await this.termModel.findById(id);
    if (!doc) throw new BadRequestException('Not found');
    if (doc.status !== ConfigStatus.DRAFT)
      throw new BadRequestException('Cannot edit non-draft configuration');

    return this.termModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async getAllTerminationBenefits() {
    return this.termModel.find();
  }

  async getOneTerminationBenefit(id: string) {
    return this.termModel.findById(id);
  }

  /* -------------------------------------------------------------------------- */
  /*                               Allowances API                               */
  /* -------------------------------------------------------------------------- */

  async createAllowance(payload: AllowancePayload) {
    const created = await this.allowanceModel.create({
      ...payload,
      createdBy: this.toObjectId(payload.createdBy),
      status: ConfigStatus.DRAFT,
    });
    return created.toObject();
  }

  async listAllowances(status?: ConfigStatus) {
    const filter = status ? { status } : {};
    return this.allowanceModel.find(filter).sort({ createdAt: -1 }).lean().exec();
  }

  async getAllowance(id: string) {
    return this.findAllowanceOrFail(id);
  }

  async updateAllowance(id: string, payload: Partial<AllowancePayload>) {
    const record = await this.findAllowanceOrFail(id);
    if (!record) {
      throw new NotFoundException('Allowance not found');
    }
    this.ensureDraft(record.status, 'Allowance');
    if (payload.name !== undefined) record.name = payload.name;
    if (payload.amount !== undefined) record.amount = payload.amount;
    if (payload.createdBy !== undefined) {
      record.createdBy = this.toObjectId(payload.createdBy);
    }
    return record.save();
  }

  async setAllowanceStatus(id: string, payload: UpdateStatusPayload) {
    const record = await this.findAllowanceOrFail(id);
    this.ensureDraft(record.status, 'Allowance status');
    this.applyStatus(record, payload);
    return record.save();
  }

  /* -------------------------------------------------------------------------- */
  /*                          Company-wide settings API                         */
  /* -------------------------------------------------------------------------- */

  async upsertCompanyWideSettings(payload: Partial<CompanyWideSettings>) {
    const existing = await this.companySettingsModel.findOne();
    if (existing) {
      existing.set(payload);
      return existing.save();
    }
    return this.companySettingsModel.create(payload);
  }

  async getCompanyWideSettings() {
    return this.companySettingsModel.findOne().sort({ createdAt: -1 }).lean().exec();
  }

  async updateCompanyWideSettings(id: string, payload: Partial<CompanyWideSettings>) {
    const updated = await this.companySettingsModel
      .findByIdAndUpdate(id, payload, { new: true, runValidators: true })
      .exec();
    if (!updated) {
      throw new NotFoundException('Company wide settings entry not found');
    }
    return updated;
  }

  /* -------------------------------------------------------------------------- */
  /*                           Insurance brackets API                           */
  /* -------------------------------------------------------------------------- */

  async createInsuranceBracket(payload: InsurancePayload) {
    this.ensureSalaryRange(payload.minSalary, payload.maxSalary);
    const created = await this.insuranceModel.create({
      ...payload,
      createdBy: this.toObjectId(payload.createdBy),
      status: ConfigStatus.DRAFT,
    });
    return created.toObject();
  }

  async listInsuranceBrackets(status?: ConfigStatus) {
    const filter = status ? { status } : {};
    return this.insuranceModel.find(filter).sort({ createdAt: -1 }).lean().exec();
  }

  async getInsuranceBracket(id: string) {
    return this.findInsuranceOrFail(id);
  }

  async updateInsuranceBracket(id: string, payload: Partial<InsurancePayload>) {
    const record = await this.findInsuranceOrFail(id);
    this.ensureDraft(record.status, 'Insurance bracket');
    if (payload.minSalary !== undefined || payload.maxSalary !== undefined) {
      this.ensureSalaryRange(
        payload.minSalary ?? record.minSalary,
        payload.maxSalary ?? record.maxSalary,
      );
    }
    record.set({
      ...payload,
      createdBy:
        payload.createdBy !== undefined ? this.toObjectId(payload.createdBy) : record.createdBy,
    });
    return record.save();
  }

  async setInsuranceBracketStatus(id: string, payload: UpdateStatusPayload) {
    const record = await this.findInsuranceOrFail(id);
    this.ensureDraft(record.status, 'Insurance bracket status');
    this.applyStatus(record, payload);
    return record.save();
  }

  async deleteInsuranceBracket(id: string) {
    const result = await this.insuranceModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Insurance bracket not found');
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Helpers                                   */
  /* -------------------------------------------------------------------------- */

  private applyStatus(
    entity: { status: ConfigStatus; approvedAt?: Date; approvedBy?: Types.ObjectId },
    payload: UpdateStatusPayload,
  ) {
    if (payload.status === ConfigStatus.DRAFT) {
      throw new BadRequestException('Approval status cannot revert to draft.');
    }
    entity.status = payload.status;
    if (payload.status === ConfigStatus.APPROVED) {
      entity.approvedAt = new Date();
      entity.approvedBy = this.toObjectId(payload.approverId);
    } else {
      entity.approvedAt = undefined;
      entity.approvedBy = undefined;
    }
  }

  private ensureDraft(status: ConfigStatus, context: string) {
    if (status !== ConfigStatus.DRAFT) {
      throw new BadRequestException(`${context} can only be modified while in draft status.`);
    }
  }

  private ensureSalaryRange(min: number, max: number) {
    if (min >= max) {
      throw new BadRequestException('Minimum salary must be less than maximum salary.');
    }
  }

  private async findAllowanceOrFail(id: string) {
    const record = await this.allowanceModel.findById(id).exec();
    if (!record) {
      throw new NotFoundException('Allowance not found');
    }
    return record;
  }

  private async findInsuranceOrFail(id: string) {
    const record = await this.insuranceModel.findById(id).exec();
    if (!record) {
      throw new NotFoundException('Insurance bracket not found');
    }
    return record;
  }

  private toObjectId(id?: string) {
    return id ? new Types.ObjectId(id) : undefined;
  }
}

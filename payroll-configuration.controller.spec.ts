import { Test } from '@nestjs/testing';
import { Types } from 'mongoose';
import { ConfigStatus } from './enums/payroll-configuration-enums';
import { PayrollConfigurationController } from './payroll-configuration.controller';
import { PayrollConfigurationService } from './payroll-configuration.service';

const mockService = () => ({
  createAllowance: jest.fn(),
  listAllowances: jest.fn(),
  getAllowance: jest.fn(),
  updateAllowance: jest.fn(),
  setAllowanceStatus: jest.fn(),
  upsertCompanyWideSettings: jest.fn(),
  getCompanyWideSettings: jest.fn(),
  updateCompanyWideSettings: jest.fn(),
  createInsuranceBracket: jest.fn(),
  listInsuranceBrackets: jest.fn(),
  getInsuranceBracket: jest.fn(),
  updateInsuranceBracket: jest.fn(),
  setInsuranceBracketStatus: jest.fn(),
  deleteInsuranceBracket: jest.fn(),
});

describe('PayrollConfigurationController', () => {
  let controller: PayrollConfigurationController;
  let service: ReturnType<typeof mockService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [PayrollConfigurationController],
      providers: [{ provide: PayrollConfigurationService, useFactory: mockService }],
    }).compile();

    controller = module.get(PayrollConfigurationController);
    service = module.get(PayrollConfigurationService);
  });

  describe('allowances', () => {
    it('delegates creation to the service', () => {
      const dto = { name: 'Transport', amount: 2500 };
      controller.createAllowance(dto);
      expect(service.createAllowance).toHaveBeenCalledWith(dto);
    });

    it('lists allowances with query status', () => {
      controller.listAllowances(ConfigStatus.DRAFT);
      expect(service.listAllowances).toHaveBeenCalledWith(ConfigStatus.DRAFT);
    });

    it('updates allowance', () => {
      const dto = { amount: 1500 };
      const id = new Types.ObjectId();
      controller.updateAllowance(id, dto);
      expect(service.updateAllowance).toHaveBeenCalledWith(id.toString(), dto);
    });

    it('approves allowance', () => {
      const dto: Parameters<PayrollConfigurationController['approveAllowance']>[1] = {
        status: ConfigStatus.APPROVED,
        approverId: 'manager-1',
      };
      const id = new Types.ObjectId();
      controller.approveAllowance(id, dto);
      expect(service.setAllowanceStatus).toHaveBeenCalledWith(id.toString(), dto);
    });
  });

  describe('company settings', () => {
    it('upserts company settings', () => {
      const dto = { payDate: new Date(), timeZone: 'Africa/Cairo' };
      controller.upsertCompanySettings(dto);
      expect(service.upsertCompanyWideSettings).toHaveBeenCalledWith(dto);
    });

    it('updates company settings', () => {
      const dto = { payDate: new Date('2024-10-01'), timeZone: 'UTC' };
      const id = new Types.ObjectId();
      controller.updateCompanySettings(id, dto);
      expect(service.updateCompanyWideSettings).toHaveBeenCalledWith(id.toString(), dto);
    });
  });

  describe('insurance brackets', () => {
    it('creates insurance bracket', () => {
      const dto = {
        name: 'Tier A',
        amount: 450,
        minSalary: 0,
        maxSalary: 5000,
        employeeRate: 5,
        employerRate: 8,
      };
      controller.createInsurance(dto);
      expect(service.createInsuranceBracket).toHaveBeenCalledWith(dto);
    });

    it('updates insurance bracket', () => {
      const dto = { maxSalary: 6000 };
      const id = new Types.ObjectId();
      controller.updateInsurance(id, dto);
      expect(service.updateInsuranceBracket).toHaveBeenCalledWith(id.toString(), dto);
    });

    it('approves insurance bracket', () => {
      const approvalDto: Parameters<PayrollConfigurationController['approveInsurance']>[1] = {
        status: ConfigStatus.APPROVED,
        approverId: 'hr-1',
      };
      const id = new Types.ObjectId();
      controller.approveInsurance(id, approvalDto);
      expect(service.setInsuranceBracketStatus).toHaveBeenCalledWith(id.toString(), approvalDto);
    });

    it('deletes insurance bracket', () => {
      const id = new Types.ObjectId();
      controller.deleteInsurance(id);
      expect(service.deleteInsuranceBracket).toHaveBeenCalledWith(id.toString());
    });
  });
});

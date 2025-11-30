import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ConfigStatus } from './enums/payroll-configuration-enums';
import { PayrollConfigurationService } from './payroll-configuration.service';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';

interface CreateAllowanceDto {
  name: string;
  amount: number;
  createdBy?: string;
}

interface UpdateAllowanceDto extends Partial<CreateAllowanceDto> {}

interface ApprovalDto {
  status: ConfigStatus.APPROVED | ConfigStatus.REJECTED;
  approverId?: string;
}

interface CompanySettingsDto {
  payDate: Date;
  timeZone: string;
  currency?: string;
}

interface CreateInsuranceDto {
  name: string;
  amount: number;
  minSalary: number;
  maxSalary: number;
  employeeRate: number;
  employerRate: number;
  createdBy?: string;
}

interface UpdateInsuranceDto extends Partial<CreateInsuranceDto> {}

@Controller('payroll-configuration')
export class PayrollConfigurationController {
  constructor(private readonly payrollConfigService: PayrollConfigurationService) {}

  @Get('health')
  healthCheck() {
    return { status: 'ok', message: 'Payroll Configuration API is running' };
  }

  /* -------------------------------------------------------------------------- */
  /*                               Allowances API                               */
  /* -------------------------------------------------------------------------- */

  @Post('allowances')
  createAllowance(@Body() body: CreateAllowanceDto) {
    return this.payrollConfigService.createAllowance(body);
  }

  @Get('allowances')
  listAllowances(@Query('status') status?: ConfigStatus) {
    return this.payrollConfigService.listAllowances(status);
  }

  @Get('allowances/:id')
  getAllowance(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.payrollConfigService.getAllowance(id.toString());
  }

  @Patch('allowances/:id')
  updateAllowance(@Param('id', ParseObjectIdPipe) id: Types.ObjectId, @Body() body: UpdateAllowanceDto) {
    return this.payrollConfigService.updateAllowance(id.toString(), body);
  }

  @Patch('allowances/:id/status')
  approveAllowance(@Param('id', ParseObjectIdPipe) id: Types.ObjectId, @Body() body: ApprovalDto) {
    return this.payrollConfigService.setAllowanceStatus(id.toString(), body);
  }

  /* -------------------------------------------------------------------------- */
  /*                          Company-wide settings API                         */
  /* -------------------------------------------------------------------------- */

  @Post('company-settings')
  upsertCompanySettings(@Body() body: CompanySettingsDto) {
    return this.payrollConfigService.upsertCompanyWideSettings(body);
  }

  @Get('company-settings')
  getCompanySettings() {
    return this.payrollConfigService.getCompanyWideSettings();
  }

  @Patch('company-settings/:id')
  updateCompanySettings(@Param('id', ParseObjectIdPipe) id: Types.ObjectId, @Body() body: CompanySettingsDto) {
    return this.payrollConfigService.updateCompanyWideSettings(id.toString(), body);
  }

  /* -------------------------------------------------------------------------- */
  /*                           Insurance brackets API                           */
  /* -------------------------------------------------------------------------- */

  @Post('insurance-brackets')
  createInsurance(@Body() body: CreateInsuranceDto) {
    return this.payrollConfigService.createInsuranceBracket(body);
  }

  @Get('insurance-brackets')
  listInsurance(@Query('status') status?: ConfigStatus) {
    return this.payrollConfigService.listInsuranceBrackets(status);
  }

  @Get('insurance-brackets/:id')
  getInsurance(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.payrollConfigService.getInsuranceBracket(id.toString());
  }

  @Patch('insurance-brackets/:id')
  updateInsurance(@Param('id', ParseObjectIdPipe) id: Types.ObjectId, @Body() body: UpdateInsuranceDto) {
    return this.payrollConfigService.updateInsuranceBracket(id.toString(), body);
  }

  @Patch('insurance-brackets/:id/status')
  approveInsurance(@Param('id', ParseObjectIdPipe) id: Types.ObjectId, @Body() body: ApprovalDto) {
    return this.payrollConfigService.setInsuranceBracketStatus(id.toString(), body);
  }

  @Delete('insurance-brackets/:id')
  deleteInsurance(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.payrollConfigService.deleteInsuranceBracket(id.toString());
  }
}

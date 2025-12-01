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
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PayrollConfigurationService } from './payroll-configuration.service';
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
  ApproveConfigDto,
  RejectConfigDto,
} from './dto/approval.dto';
import {
  ConfigStatus,
  PolicyType,
} from './enums/payroll-configuration-enums';

@Controller('payroll-configuration')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class PayrollConfigurationController {
  constructor(
    private readonly payrollConfigurationService: PayrollConfigurationService,
  ) {}

  @Post('pay-types')
  async createPayType(@Body() createDto: CreatePayTypeDto) {
    return this.payrollConfigurationService.createPayType(createDto);
  }

  @Get('pay-types')
  async getAllPayTypes(@Query('status') status?: ConfigStatus) {
    return this.payrollConfigurationService.getAllPayTypes(status);
  }

  @Get('pay-types/:id')
  async getPayTypeById(@Param('id') id: string) {
    return this.payrollConfigurationService.getPayTypeById(id);
  }

  @Patch('pay-types/:id')
  async updatePayType(
    @Param('id') id: string,
    @Body() updateDto: UpdatePayTypeDto,
  ) {
    return this.payrollConfigurationService.updatePayType(id, updateDto);
  }

  @Delete('pay-types/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePayType(@Param('id') id: string): Promise<void> {
    await this.payrollConfigurationService.deletePayType(id);
  }

  @Post('pay-types/:id/approve')
  @HttpCode(HttpStatus.OK)
  async approvePayType(
    @Param('id') id: string,
    @Body() approveDto: ApproveConfigDto,
  ) {
    return this.payrollConfigurationService.approvePayType(
      id,
      approveDto.approvedBy,
    );
  }

  @Post('pay-types/:id/reject')
  @HttpCode(HttpStatus.OK)
  async rejectPayType(
    @Param('id') id: string,
    @Body() rejectDto: RejectConfigDto,
  ) {
    return this.payrollConfigurationService.rejectPayType(
      id,
      rejectDto.rejectedBy,
      rejectDto.reason,
    );
  }

  @Post('payroll-policies')
  async createPayrollPolicy(@Body() createDto: CreatePayrollPolicyDto) {
    return this.payrollConfigurationService.createPayrollPolicy(createDto);
  }

  @Get('payroll-policies')
  async getAllPayrollPolicies(
    @Query('policyType') policyType?: PolicyType,
    @Query('status') status?: ConfigStatus,
  ) {
    return this.payrollConfigurationService.getAllPayrollPolicies(
      policyType,
      status,
    );
  }

  @Get('payroll-policies/:id')
  async getPayrollPolicyById(@Param('id') id: string) {
    return this.payrollConfigurationService.getPayrollPolicyById(id);
  }

  @Patch('payroll-policies/:id')
  async updatePayrollPolicy(
    @Param('id') id: string,
    @Body() updateDto: UpdatePayrollPolicyDto,
  ) {
    return this.payrollConfigurationService.updatePayrollPolicy(id, updateDto);
  }

  @Delete('payroll-policies/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePayrollPolicy(@Param('id') id: string): Promise<void> {
    await this.payrollConfigurationService.deletePayrollPolicy(id);
  }

  @Post('payroll-policies/:id/approve')
  @HttpCode(HttpStatus.OK)
  async approvePayrollPolicy(
    @Param('id') id: string,
    @Body() approveDto: ApproveConfigDto,
  ) {
    return this.payrollConfigurationService.approvePayrollPolicy(
      id,
      approveDto.approvedBy,
    );
  }

  @Post('payroll-policies/:id/reject')
  @HttpCode(HttpStatus.OK)
  async rejectPayrollPolicy(
    @Param('id') id: string,
    @Body() rejectDto: RejectConfigDto,
  ) {
    return this.payrollConfigurationService.rejectPayrollPolicy(
      id,
      rejectDto.rejectedBy,
      rejectDto.reason,
    );
  }

  @Post('pay-grades')
  async createPayGrade(@Body() createDto: CreatePayGradeDto) {
    return this.payrollConfigurationService.createPayGrade(createDto);
  }

  @Get('pay-grades')
  async getAllPayGrades(@Query('status') status?: ConfigStatus) {
    return this.payrollConfigurationService.getAllPayGrades(status);
  }

  @Get('pay-grades/:id')
  async getPayGradeById(@Param('id') id: string) {
    return this.payrollConfigurationService.getPayGradeById(id);
  }

  @Patch('pay-grades/:id')
  async updatePayGrade(
    @Param('id') id: string,
    @Body() updateDto: UpdatePayGradeDto,
  ) {
    return this.payrollConfigurationService.updatePayGrade(id, updateDto);
  }

  @Delete('pay-grades/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePayGrade(@Param('id') id: string): Promise<void> {
    await this.payrollConfigurationService.deletePayGrade(id);
  }

  @Post('pay-grades/:id/approve')
  @HttpCode(HttpStatus.OK)
  async approvePayGrade(
    @Param('id') id: string,
    @Body() approveDto: ApproveConfigDto,
  ) {
    return this.payrollConfigurationService.approvePayGrade(
      id,
      approveDto.approvedBy,
    );
  }

  @Post('pay-grades/:id/reject')
  @HttpCode(HttpStatus.OK)
  async rejectPayGrade(
    @Param('id') id: string,
    @Body() rejectDto: RejectConfigDto,
  ) {
    return this.payrollConfigurationService.rejectPayGrade(
      id,
      rejectDto.rejectedBy,
      rejectDto.reason,
    );
  }
}

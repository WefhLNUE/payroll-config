import { Controller, Post, Body, Get, Param, Patch, Query, Delete } from '@nestjs/common';
import { PayrollConfigurationService } from './payroll-configuration.service';
import { ConfigStatus } from './enums/payroll-configuration-enums';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';

interface CreateAllowanceDto {
    name: string;
    amount: number;
    createdBy?: string;
}

interface UpdateAllowanceDto extends Partial<CreateAllowanceDto> { }

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

interface UpdateInsuranceDto extends Partial<CreateInsuranceDto> { }

@Controller('payroll-configuration')
export class PayrollConfigurationController {
    constructor(private readonly service: PayrollConfigurationService) { }

    // ----- Signing Bonus -----
    @Post('signing-bonus')
    createSigningBonus(@Body() dto: any) {
        return this.service.createSigningBonus(dto);
    }

    @Patch('signing-bonus/:id')
    updateSigningBonus(@Param('id') id: string, @Body() dto: any) {
        return this.service.updateSigningBonus(id, dto);
    }

    @Get('signing-bonus')
    getAllSigningBonus() {
        return this.service.getAllSigningBonus();
    }

    @Get('signing-bonus/:id')
    getOneSigningBonus(@Param('id') id: string) {
        return this.service.getOneSigningBonus(id);
    }

    // ----- Tax Rules -----
    @Post('tax-rule')
    createTaxRule(@Body() dto: any) {
        return this.service.createTaxRule(dto);
    }

    @Patch('tax-rule/:id')
    updateTaxRule(@Param('id') id: string, @Body() dto: any) {
        return this.service.updateTaxRule(id, dto);
    }

    @Get('tax-rule')
    getAllTaxRules() {
        return this.service.getAllTaxRules();
    }

    @Get('tax-rule/:id')
    getOneTaxRule(@Param('id') id: string) {
        return this.service.getOneTaxRule(id);
    }

    // ----- Termination Benefits -----
    @Post('termination-benefit')
    createTerminationBenefit(@Body() dto: any) {
        return this.service.createTerminationBenefit(dto);
    }

    @Patch('termination-benefit/:id')
    updateTerminationBenefit(@Param('id') id: string, @Body() dto: any) {
        return this.service.updateTerminationBenefit(id, dto);
    }

    @Get('termination-benefit')
    getAllTerminationBenefits() {
        return this.service.getAllTerminationBenefits();
    }

    @Get('termination-benefit/:id')
    getOneTerminationBenefit(@Param('id') id: string) {
        return this.service.getOneTerminationBenefit(id);
    }

    @Get('health')
    healthCheck() {
        return { status: 'ok', message: 'Payroll Configuration API is running' };
    }

    /* -------------------------------------------------------------------------- */
    /*                               Allowances API                               */
    /* -------------------------------------------------------------------------- */

    @Post('allowances')
    createAllowance(@Body() body: CreateAllowanceDto) {
        return this.service.createAllowance(body);
    }

    @Get('allowances')
    listAllowances(@Query('status') status?: ConfigStatus) {
        return this.service.listAllowances(status);
    }

    @Get('allowances/:id')
    getAllowance(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
        return this.service.getAllowance(id.toString());
    }

    @Patch('allowances/:id')
    updateAllowance(@Param('id', ParseObjectIdPipe) id: Types.ObjectId, @Body() body: UpdateAllowanceDto) {
        return this.service.updateAllowance(id.toString(), body);
    }

    @Patch('allowances/:id/status')
    approveAllowance(@Param('id', ParseObjectIdPipe) id: Types.ObjectId, @Body() body: ApprovalDto) {
        return this.service.setAllowanceStatus(id.toString(), body);
    }

    /* -------------------------------------------------------------------------- */
    /*                          Company-wide settings API                         */
    /* -------------------------------------------------------------------------- */

    @Post('company-settings')
    upsertCompanySettings(@Body() body: CompanySettingsDto) {
        return this.service.upsertCompanyWideSettings(body);
    }

    @Get('company-settings')
    getCompanySettings() {
        return this.service.getCompanyWideSettings();
    }

    @Patch('company-settings/:id')
    updateCompanySettings(@Param('id', ParseObjectIdPipe) id: Types.ObjectId, @Body() body: CompanySettingsDto) {
        return this.service.updateCompanyWideSettings(id.toString(), body);
    }

    /* -------------------------------------------------------------------------- */
    /*                           Insurance brackets API                           */
    /* -------------------------------------------------------------------------- */

    @Post('insurance-brackets')
    createInsurance(@Body() body: CreateInsuranceDto) {
        return this.service.createInsuranceBracket(body);
    }

    @Get('insurance-brackets')
    listInsurance(@Query('status') status?: ConfigStatus) {
        return this.service.listInsuranceBrackets(status);
    }

    @Get('insurance-brackets/:id')
    getInsurance(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
        return this.service.getInsuranceBracket(id.toString());
    }

    @Patch('insurance-brackets/:id')
    updateInsurance(@Param('id', ParseObjectIdPipe) id: Types.ObjectId, @Body() body: UpdateInsuranceDto) {
        return this.service.updateInsuranceBracket(id.toString(), body);
    }

    @Patch('insurance-brackets/:id/status')
    approveInsurance(@Param('id', ParseObjectIdPipe) id: Types.ObjectId, @Body() body: ApprovalDto) {
        return this.service.setInsuranceBracketStatus(id.toString(), body);
    }

    @Delete('insurance-brackets/:id')
    deleteInsurance(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
        return this.service.deleteInsuranceBracket(id.toString());
    }
}

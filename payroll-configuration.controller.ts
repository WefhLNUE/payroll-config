import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { PayrollConfigurationService } from './payroll-configuration.service';

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
}

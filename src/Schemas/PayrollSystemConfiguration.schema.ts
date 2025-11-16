import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * Payroll System Configuration Schema
 * Phase 3: System Admin configures company-wide settings
 * - Pay dates, time zone, currency
 * - Create, Edit, View
 * - Status: draft
 * - Backup data regularly
 */
@Schema({ timestamps: true })
export class PayrollSystemConfiguration extends Document {
  @Prop({ required: true })
  companyName: string;

  // Pay dates configuration
  @Prop({ required: true })
  payDate: number; // Day of month (e.g., 25 for 25th of each month)

  @Prop({ enum: ['monthly', 'biweekly', 'weekly', 'semimonthly'], required: true })
  payFrequency: string;

  @Prop()
  payDayOfWeek: number; // 0-6 (Sunday-Saturday) for weekly/biweekly

  // Time zone configuration
  @Prop({ required: true, default: 'UTC' })
  timeZone: string; // e.g., 'America/New_York', 'UTC'

  // Currency configuration
  @Prop({ required: true, default: 'USD' })
  currency: string; // ISO 4217 currency code (USD, EUR, etc.)

  @Prop({ default: '$' })
  currencySymbol: string;

  @Prop({ default: 2 })
  decimalPlaces: number; // Number of decimal places for currency

  // Backup configuration
  @Prop({ default: true })
  enableAutoBackup: boolean;

  @Prop({ enum: ['daily', 'weekly', 'monthly'], default: 'daily' })
  backupFrequency: string;

  @Prop()
  lastBackupDate: Date;

  @Prop()
  nextBackupDate: Date;

  @Prop()
  backupLocation: string; // Path or URL for backup storage

  // Additional system settings
  @Prop({ default: true })
  allowRetroactiveAdjustments: boolean;

  @Prop({ default: false })
  autoGeneratePaySlips: boolean;

  @Prop({ default: 7 })
  gracePeriodDays: number;

  @Prop({ enum: ['nearest', 'up', 'down'], default: 'nearest' })
  roundingRule: string;

  @Prop()
  description: string;

  @Prop({ default: 'draft', enum: ['draft', 'pending', 'approved', 'rejected'] })
  status: string; // Phase 3: System Admin creates (draft), Phase 4: Payroll Manager approves

  // Audit trail - Phase 3: System Admin
  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId; // System Admin

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId; // System Admin

  // Phase 4: Payroll Manager approval
  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy: Types.ObjectId; // Payroll Manager

  @Prop({ type: Types.ObjectId, ref: 'User' })
  rejectedBy: Types.ObjectId; // Payroll Manager

  @Prop()
  approvedAt: Date;

  @Prop()
  rejectedAt: Date;

  @Prop()
  approvalComments: string;

  @Prop()
  rejectionReason: string;

  @Prop({ default: true })
  isActive: boolean;

  // Version tracking
  @Prop({ default: 1 })
  version: number;
}

export const PayrollSystemConfigurationSchema =
  SchemaFactory.createForClass(PayrollSystemConfiguration);


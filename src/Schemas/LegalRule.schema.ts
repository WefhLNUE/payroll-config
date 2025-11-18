import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * Legal Rule Schema
 * Phase 2: Legal Admin adds tax rules, updates legal changes
 * Phase 5: Legal rules update when laws change (Edit)
 */
@Schema({ timestamps: true })
export class LegalRule extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['tax', 'labor_law', 'social_security', 'health_insurance', 'unemployment', 'other'] })
  ruleType: string;

  @Prop({ required: true })
  description: string;

  // Legal reference
  @Prop()
  legalReference: string; // Reference to labor law or tax code

  @Prop()
  legalDocumentUrl: string; // URL to legal document

  // Rule configuration
  @Prop({ type: Object })
  ruleConfiguration: Record<string, any>; // Flexible JSON structure for different rule types

  // Tax brackets or rates (if applicable)
  @Prop([{
    minAmount: { type: Number },
    maxAmount: { type: Number },
    rate: { type: Number },
    fixedAmount: { type: Number }
  }])
  taxBrackets: Array<{
    minAmount?: number;
    maxAmount?: number;
    rate?: number;
    fixedAmount?: number;
  }>;

  // Effective dates
  @Prop({ required: true })
  effectiveFrom: Date;

  @Prop()
  effectiveTo: Date; // Optional, for rule expiration

  @Prop({ default: 'draft', enum: ['draft', 'pending', 'approved', 'rejected'] })
  status: string; // Phase 2: Legal Admin creates, Phase 4: Payroll Manager approves

  // Audit trail - Phase 2: Legal Admin
  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId; // Legal Admin

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId; // Legal Admin (Phase 5: updates when laws change)

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

  // Track legal change updates - Phase 5
  @Prop()
  lastLegalUpdate: Date; // When law was last updated

  @Prop()
  legalUpdateNotes: string; // Notes about legal changes

  @Prop()
  legalUpdateBy: Types.ObjectId; // Legal Admin who made the update

  @Prop({ default: true })
  isActive: boolean;

  // Version tracking for legal changes
  @Prop({ default: 1 })
  version: number;
}

export const LegalRuleSchema = SchemaFactory.createForClass(LegalRule);


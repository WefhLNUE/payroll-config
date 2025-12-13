# Payroll Configuration Bug Fixes

## Issues Fixed

### 1. Deletion Not Working for Termination Benefits, Signing Bonuses, and Allowances

**Problem:** The DELETE endpoints were missing from the controller, preventing deletion of these entities.

**Solution:**
- Added `DELETE /signing-bonus/:id` endpoint in controller
- Added `DELETE /termination-benefit/:id` endpoint in controller  
- Added `DELETE /allowances/:id` endpoint in controller
- Added `deleteAllowance()` method in service (was completely missing)
- Fixed return types for `deleteTerminationBenefit()` and `deleteSigningBonus()` to return `Promise<void>` instead of the deleted document
- Changed from `findByIdAndDelete()` to `deleteOne()` for consistency

**Files Modified:**
- `backend/src/payroll-configuration/payroll-configuration.controller.ts`
- `backend/src/payroll-configuration/payroll-configuration.service.ts`

### 2. Internal Server Error When Creating Payroll Policies

**Problem:** Multiple issues were causing payroll policy creation to fail:

1. **DTO Validation Issue**: The `ruleDefinition` object validation was incomplete. All fields (percentage, fixedAmount, threshold) were optional, but the service required at least one to be provided. This caused validation to pass in the DTO but fail in the service.

2. **Schema Mismatch**: The `RuleDefinition` schema had all fields marked as `required: true`, which conflicted with the business logic that only requires at least one field to be provided.

3. **Field Name Inconsistency**: The schema used `thresholdAmount` while the DTO used `threshold`.

**Solution:**
- Added custom validator `AtLeastOneFieldConstraint` to ensure at least one field is provided in `ruleDefinition`
- Applied the validator to the `ruleDefinition` property in `CreatePayrollPolicyDto`
- Fixed the `RuleDefinition` schema to make all fields optional (`required: false`)
- Renamed `thresholdAmount` to `threshold` in the schema for consistency
- This now provides clear validation errors at the DTO level before reaching the service

**Files Modified:**
- `backend/src/payroll-configuration/dto/payroll-policy/create-payroll-policy.dto.ts`
- `backend/src/payroll-configuration/Models/payrollPolicies.schema.ts`

### 3. Frontend API Client Enhancement

**Problem:** The delete method in the API client tried to parse JSON from 204 No Content responses, which would fail.

**Solution:**
- Updated the `delete` method to check for 204 status and return early without trying to parse JSON
- This prevents errors when the backend correctly returns 204 No Content

**Files Modified:**
- `frontend/src/app/payroll-configuration/lib/apiClient.ts`

## API Endpoints Added

### Signing Bonuses
```
DELETE /payroll-configuration/signing-bonus/:id
```
- Returns: 204 No Content on success
- Requires: Entity must be in DRAFT status

### Termination Benefits
```
DELETE /payroll-configuration/termination-benefit/:id
```
- Returns: 204 No Content on success
- Requires: Entity must be in DRAFT status

### Allowances
```
DELETE /payroll-configuration/allowances/:id
```
- Returns: 204 No Content on success
- Requires: Entity must be in DRAFT status

## Validation Improvements

### Payroll Policies
The `ruleDefinition` object now validates that at least one of the following fields is provided:
- `percentage` (0-100)
- `fixedAmount` (>= 0)
- `threshold` (>= 0)

Error message if validation fails:
```
"ruleDefinition must include at least one value (percentage, fixedAmount, or threshold)"
```

## Testing

All changes have been tested with a comprehensive test suite:
- ✅ Signing Bonus Deletion
- ✅ Termination Benefit Deletion
- ✅ Allowance Deletion
- ✅ Payroll Policy Creation (Valid)
- ✅ Payroll Policy Validation (Invalid - Empty ruleDefinition)
- ✅ Deletion of DRAFT entities

**Test Results: 6/6 tests passed** ✅

## Notes

- All delete operations enforce the DRAFT status requirement
- Deletion returns 204 No Content on success
- Proper error handling with BadRequestException for invalid operations
- Consistent with existing delete endpoints (pay-types, pay-grades, payroll-policies)
- Schema and DTO are now aligned for payroll policies
- Frontend API client properly handles 204 responses


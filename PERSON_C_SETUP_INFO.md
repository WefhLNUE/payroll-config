# Person C - Setup Information & Analysis
## Phase 3 (System Settings) & Phase 4 (Approval Workflow)

---

## PART 1: BACKEND API ANALYSIS

### Question 1: What approval endpoints exist?

**ALL Approval-Related Endpoints in `payroll-configuration.controller.ts`:**

#### Pay Types
- **POST** `/api/payroll-configuration/pay-types/:id/approve`
  - Body: `{ approvedBy: string }`
  - Uses: `ApproveConfigDto`

- **POST** `/api/payroll-configuration/pay-types/:id/reject`
  - Body: `{ rejectedBy: string, reason: string }`
  - Uses: `RejectConfigDto`

#### Payroll Policies
- **POST** `/api/payroll-configuration/payroll-policies/:id/approve`
  - Body: `{ approvedBy: string }`
  - Uses: `ApproveConfigDto`

- **POST** `/api/payroll-configuration/payroll-policies/:id/reject`
  - Body: `{ rejectedBy: string, reason: string }`
  - Uses: `RejectConfigDto`

#### Pay Grades
- **POST** `/api/payroll-configuration/pay-grades/:id/approve`
  - Body: `{ approvedBy: string }`
  - Uses: `ApproveConfigDto`

- **POST** `/api/payroll-configuration/pay-grades/:id/reject`
  - Body: `{ rejectedBy: string, reason: string }`
  - Uses: `RejectConfigDto`

#### Allowances
- **PATCH** `/api/payroll-configuration/allowances/:id/status`
  - Body: `{ status: ConfigStatus.APPROVED | ConfigStatus.REJECTED, approverId?: string }`
  - Uses: `ApprovalDto` (different pattern - uses status field)

#### Insurance Brackets
- **PATCH** `/api/payroll-configuration/insurance-brackets/:id/status`
  - Body: `{ status: ConfigStatus.APPROVED | ConfigStatus.REJECTED, approverId?: string }`
  - Uses: `ApprovalDto` (different pattern - uses status field)

**Note:** Allowances and Insurance Brackets use a different approval pattern (PATCH with status field) compared to Pay Types, Pay Grades, and Payroll Policies (POST with dedicated approve/reject endpoints).

---

### Question 2: What configuration types need approval?

#### Summary Table

| Schema Name | Approve Endpoint | Reject Endpoint | Status Field | Approved By | Approved At | Rejected By | Rejected At | Rejection Reason |
|-------------|------------------|-----------------|--------------|--------------|--------------|-------------|--------------|------------------|
| **PayType** | ✅ `/pay-types/:id/approve` | ✅ `/pay-types/:id/reject` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **PayGrade** | ✅ `/pay-grades/:id/approve` | ✅ `/pay-grades/:id/reject` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **PayrollPolicy** | ✅ `/payroll-policies/:id/approve` | ✅ `/payroll-policies/:id/reject` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Allowance** | ✅ `/allowances/:id/status` (PATCH) | ✅ `/allowances/:id/status` (PATCH) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **InsuranceBracket** | ✅ `/insurance-brackets/:id/status` (PATCH) | ✅ `/insurance-brackets/:id/status` (PATCH) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **TaxRules** | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **SigningBonus** | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **TerminationBenefits** | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **CompanySettings** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

#### Detailed Schema Definitions

**1. PayType Schema** (`Models/PayType.schema.ts`)
```typescript
- type: PayTypeEnum (required, unique)
- amount: number (required, min: 6000)
- description?: string
- status: ConfigStatus (required, default: DRAFT)
- createdBy?: ObjectId
- approvedBy?: ObjectId
- approvedAt?: Date
- rejectedBy?: ObjectId
- rejectedAt?: Date
- rejectionReason?: string
```

**2. PayGrade Schema** (`Models/payGrades.schema.ts`)
```typescript
- grade: string (required, unique)
- baseSalary: number (required, min: 6000)
- grossSalary: number (required, min: 6000)
- status: ConfigStatus (required, default: DRAFT)
- createdBy?: ObjectId
- approvedBy?: ObjectId
- approvedAt?: Date
- rejectedBy?: ObjectId
- rejectedAt?: Date
- rejectionReason?: string
```

**3. PayrollPolicy Schema** (`Models/payrollPolicies.schema.ts`)
```typescript
- policyName: string (required)
- policyType: PolicyType (required)
- description: string (required)
- effectiveDate: Date (required)
- ruleDefinition: RuleDefinition (required)
- applicability: Applicability (required)
- status: ConfigStatus (required, default: DRAFT)
- createdBy?: ObjectId
- approvedBy?: ObjectId
- approvedAt?: Date
- rejectedBy?: ObjectId
- rejectedAt?: Date
- rejectionReason?: string
```

**4. Allowance Schema** (`Models/allowance.schema.ts`)
```typescript
- name: string (required, unique)
- amount: number (required, min: 0)
- status: ConfigStatus (required, default: DRAFT)
- createdBy?: ObjectId
- approvedBy?: ObjectId
- approvedAt?: Date
// Note: NO rejectedBy, rejectedAt, rejectionReason fields
```

**5. InsuranceBracket Schema** (`Models/insuranceBrackets.schema.ts`)
```typescript
- name: string (required, unique)
- amount: number (required, min: 0)
- minSalary: number (required)
- maxSalary: number (required)
- employeeRate: number (required, min: 0, max: 100)
- employerRate: number (required, min: 0, max: 100)
- status: ConfigStatus (required, default: DRAFT)
- createdBy?: ObjectId
- approvedBy?: ObjectId
- approvedAt?: Date
// Note: NO rejectedBy, rejectedAt, rejectionReason fields
```

**6. TaxRules Schema** (`Models/taxRules.schema.ts`)
```typescript
- name: string (required, unique)
- description?: string
- rate: number (required, min: 0)
- status: ConfigStatus (required, default: DRAFT)
- createdBy?: ObjectId
- approvedBy?: ObjectId
- approvedAt?: Date
// Note: NO rejectedBy, rejectedAt, rejectionReason fields
// Note: NO approve/reject endpoints in controller
```

**7. SigningBonus Schema** (`Models/SigningBonus.schema.ts`)
```typescript
- name: string (required, unique)
- amount: number (required, min: 0)
- status: ConfigStatus (required, default: DRAFT)
- createdBy?: ObjectId
- approvedBy?: ObjectId
- approvedAt?: Date
// Note: NO rejectedBy, rejectedAt, rejectionReason fields
// Note: NO approve/reject endpoints in controller
```

**8. TerminationBenefits Schema** (`Models/terminationAndResignationBenefits.ts`)
```typescript
- name: string (required, unique)
- amount: number (required, min: 0)
- terms?: string
- status: ConfigStatus (required, default: DRAFT)
- createdBy?: ObjectId
- approvedBy?: ObjectId
- approvedAt?: Date
// Note: NO rejectedBy, rejectedAt, rejectionReason fields
// Note: NO approve/reject endpoints in controller
```

**9. CompanyWideSettings Schema** (`Models/CompanyWideSettings.schema.ts`)
```typescript
- payDate: Date (required)
- timeZone: string (required)
- currency: string (required, default: 'EGP')
// Note: NO status field, NO approval workflow
```

---

### Question 3: What are the DTOs for approval?

**ApproveConfigDto** (`dto/approval.dto.ts`)
```typescript
export class ApproveConfigDto {
  @IsString()
  @IsNotEmpty()
  approvedBy: string;
}
```

**RejectConfigDto** (`dto/approval.dto.ts`)
```typescript
export class RejectConfigDto {
  @IsString()
  @IsNotEmpty()
  rejectedBy: string;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
```

**Note:** Allowances and Insurance Brackets use a different DTO pattern:
```typescript
interface ApprovalDto {
  status: ConfigStatus.APPROVED | ConfigStatus.REJECTED;
  approverId?: string;
}
```

---

## PART 2: FRONTEND PROJECT STRUCTURE

### Question 4: What is the current frontend structure?

**Complete Directory Structure (3 levels deep):**

```
frontend/
├── src/
│   └── app/
│       ├── employee-profile/
│       ├── leaves/
│       ├── organization-structure/
│       ├── payroll-configuration/
│       │   ├── components/
│       │   │   ├── Allowances.tsx
│       │   │   ├── Containers.tsx
│       │   │   ├── CRUDTable.tsx
│       │   │   ├── Form.tsx
│       │   │   ├── Modal.tsx
│       │   │   ├── PayGrades.tsx
│       │   │   ├── PayrollPolicies.tsx
│       │   │   ├── PayTypes.tsx
│       │   │   ├── SigningBonuses.tsx
│       │   │   ├── StatusBadge.tsx
│       │   │   └── TerminationBenefits.tsx
│       │   ├── lib/
│       │   │   ├── apiClient.ts
│       │   │   └── enums.ts
│       │   ├── page.tsx
│       │   └── README.md
│       ├── payroll-execution/
│       ├── payroll-tracking/
│       ├── performance/
│       ├── recruitment/
│       ├── time-management/
│       ├── favicon.ico
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── eslint.config.mjs
├── main-theme.css
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

**Key Points:**
- ✅ Uses **Next.js App Router** (Next.js 13+)
- ✅ Located in `src/app/` directory
- ✅ Components stored in `payroll-configuration/components/`
- ✅ API calls in `payroll-configuration/lib/apiClient.ts`
- ✅ Utilities/enums in `payroll-configuration/lib/`

---

### Question 5: What UI framework/libraries are installed?

**From `frontend/package.json`:**

**Core:**
- ✅ **Next.js** 16.0.10
- ✅ **React** 19.2.1
- ✅ **React DOM** 19.2.1

**Styling:**
- ✅ **Tailwind CSS** 4.1.18
- ✅ **@tailwindcss/postcss** 4

**TypeScript:**
- ✅ **TypeScript** 5
- ✅ **@types/node** 20
- ✅ **@types/react** 19
- ✅ **@types/react-dom** 19

**Linting:**
- ✅ **ESLint** 9
- ✅ **eslint-config-next** 16.0.8

**Missing (NOT installed):**
- ❌ No UI component library (no shadcn/ui, Material-UI, Ant Design, Chakra UI)
- ❌ No form library (no react-hook-form, formik)
- ❌ No state management library (no zustand, redux, context API setup)
- ❌ No HTTP client wrapper (using native fetch, no axios)

**Current Approach:**
- Custom components built with Tailwind CSS
- Native React hooks for state (`useState`, `useEffect`)
- Native `fetch` API wrapped in `apiClient` utility
- Custom form components (`Form.tsx`, `FormField.tsx`)

---

### Question 6: Are there existing components I can reuse?

**✅ Reusable Components Available:**

#### 1. **CRUDTable** (`components/CRUDTable.tsx`)
- **Purpose:** Reusable table with CRUD actions
- **Features:**
  - Checkbox selection (single & select all)
  - Custom column rendering
  - Conditional action buttons (Edit/Delete only for draft items)
  - Loading state
  - Empty state message
- **Usage:**
```tsx
<CRUDTable
  data={data}
  columns={columns}
  onEdit={onEdit}
  onView={onView}
  onDelete={onDelete}
  isLoading={isLoading}
  emptyMessage="No data available"
/>
```

#### 2. **StatusBadge** (`components/StatusBadge.tsx`)
- **Purpose:** Display status with color coding
- **Features:**
  - Draft (yellow), Approved (green), Rejected (red)
  - Size variants: sm, md, lg
- **Usage:**
```tsx
<StatusBadge status="draft" size="md" />
```

#### 3. **Modal** (`components/Modal.tsx`)
- **Purpose:** Reusable modal dialog
- **Features:**
  - Customizable sizes (sm, md, lg, xl)
  - Close button
  - Backdrop overlay
- **Usage:**
```tsx
<Modal isOpen={isOpen} title="Title" onClose={onClose} size="md">
  {children}
</Modal>
```

#### 4. **Form & FormField** (`components/Form.tsx`)
- **Purpose:** Reusable form components
- **Features:**
  - Text, number, textarea, select inputs
  - Required field validation
  - Error messages
  - Disabled state
  - Submit/Cancel buttons
- **Usage:**
```tsx
<Form onSubmit={handleSubmit} isSubmitting={isSubmitting} onCancel={onCancel}>
  <FormField
    label="Field Name"
    name="fieldName"
    type="text"
    value={value}
    onChange={handleChange}
    required
  />
</Form>
```

#### 5. **ListViewContainer** (`components/Containers.tsx`)
- **Purpose:** Higher-level container with title and "Add New" button
- **Features:**
  - Title display
  - Add New button
  - Wraps CRUDTable
- **Usage:**
```tsx
<ListViewContainer
  title="Pay Types"
  data={data}
  columns={columns}
  onAdd={handleAddNew}
  onEdit={handleEdit}
  onView={setViewItem}
  onDelete={handleDelete}
  isLoading={isLoading}
/>
```

#### 6. **ViewDetailsModal** (`components/Containers.tsx`)
- **Purpose:** Read-only details view modal
- **Features:**
  - Custom field rendering
  - Read-only display
- **Usage:**
```tsx
<ViewDetailsModal
  item={item}
  fields={[
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> }
  ]}
  onClose={() => setViewItem(null)}
/>
```

**❌ Components NOT Found:**
- No dedicated approval/rejection modal components
- No approval workflow dashboard components
- No bulk action components
- No filter/search components

---

## PART 3: EXISTING PAGES & ROUTING

### Question 7: What pages already exist?

**Existing Routes in `src/app/`:**

1. **`/payroll-configuration`** - Main payroll configuration page
   - File: `src/app/payroll-configuration/page.tsx`
   - Features: Tab navigation for all configuration types

2. **`/employee-profile`** - Employee profile (empty directory)

3. **`/leaves`** - Leaves management (empty directory)

4. **`/organization-structure`** - Organization structure (empty directory)

5. **`/payroll-execution`** - Payroll execution (empty directory)

6. **`/payroll-tracking`** - Payroll tracking (empty directory)

7. **`/performance`** - Performance management (empty directory)

8. **`/recruitment`** - Recruitment (empty directory)

9. **`/time-management`** - Time management (empty directory)

10. **`/`** - Root page (`src/app/page.tsx`)

**Layout:**
- **`src/app/layout.tsx`** - Root layout with fonts and global styles

**Navigation:**
- No navigation component found in the codebase
- Tab navigation is implemented within the payroll-configuration page itself

---

### Question 8: How is routing structured?

**Routing System:**
- ✅ **App Router** (Next.js 13+)
- ✅ File-based routing in `src/app/` directory
- ✅ Each folder = route segment
- ✅ `page.tsx` = route component

**Example Existing Route:**
```tsx
// src/app/payroll-configuration/page.tsx
'use client';

export default function PayrollConfiguration() {
  // Component code
}
```

**How to Add a New Route:**
1. Create folder: `src/app/approval-workflow/`
2. Create file: `src/app/approval-workflow/page.tsx`
3. Route automatically available at `/approval-workflow`

**Dynamic Routes:**
- Not currently used, but would be: `src/app/payroll-configuration/[id]/page.tsx`
- Access via: `params.id` in the component

---

## PART 4: API INTEGRATION PATTERNS

### Question 9: How are API calls currently made?

**API Client Location:** `frontend/src/app/payroll-configuration/lib/apiClient.ts`

**API Base URL:**
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
```

**API Client Methods:**
```typescript
export const apiClient = {
  async get(endpoint: string): Promise<any>
  async post(endpoint: string, data: any): Promise<any>
  async patch(endpoint: string, data: any): Promise<any>
  async delete(endpoint: string): Promise<any>
}
```

**Example Usage (from PayTypes.tsx):**
```typescript
// Fetch data
const fetchPayTypes = async () => {
  try {
    setIsLoading(true);
    const data = await apiClient.get('/payroll-configuration/pay-types');
    setPayTypes(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error('Error fetching pay types:', err);
    setError('Failed to load pay types');
  } finally {
    setIsLoading(false);
  }
};

// Create/Update
if (editItem) {
  await apiClient.patch(`/payroll-configuration/pay-types/${editItem._id}`, payload);
} else {
  await apiClient.post('/payroll-configuration/pay-types', payload);
}

// Delete
await apiClient.delete(`/payroll-configuration/pay-types/${item._id}`);
```

**Error Handling:**
- Try-catch blocks around API calls
- Error messages displayed in UI
- Loading states managed with `isLoading` state

**Loading State:**
- Managed per component with `useState`
- Loading spinner shown in CRUDTable when `isLoading={true}`

**Note:** No authentication headers are currently added to requests. The `apiClient` does not include Authorization headers.

---

### Question 10: What is the authentication setup?

**Backend Authentication:**
- ✅ JWT authentication exists in backend (`backend/src/auth/`)
- ✅ `JwtAuthGuard` and `RolesGuard` implemented
- ✅ JWT strategy exists (but currently disabled/placeholder)

**Frontend Authentication:**
- ❌ **NO authentication implementation found in frontend**
- ❌ No token storage (no localStorage, cookies, or context)
- ❌ No Authorization headers in `apiClient`
- ❌ No auth provider or context
- ❌ No login/logout components

**What Needs to Be Done:**
1. Store JWT token (likely in localStorage or cookies)
2. Add Authorization header to `apiClient`:
```typescript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
}
```
3. Create auth context/provider (optional but recommended)
4. Handle token refresh/expiration

**Current State:** Frontend makes unauthenticated requests (backend may not enforce auth yet).

---

## PART 5: STYLING & DESIGN PATTERNS

### Question 11: What styling approach is used?

**Styling System:**
- ✅ **Tailwind CSS** (v4.1.18)
- ✅ Utility classes throughout components
- ✅ No CSS modules
- ✅ No styled-components
- ✅ Global styles in `globals.css`

**Status Badge Colors:**
- **Draft:** `bg-yellow-100 text-yellow-800`
- **Approved:** `bg-green-100 text-green-800`
- **Rejected:** `bg-red-100 text-red-800`

**Color Scheme:**
- **Primary (Blue):** `bg-blue-600`, `text-blue-600`, `hover:bg-blue-700`
- **Success (Green):** `bg-green-100`, `text-green-600`
- **Warning (Yellow):** `bg-yellow-100`, `text-yellow-800`
- **Error (Red):** `bg-red-100`, `text-red-600`, `text-red-700`
- **Gray (Neutral):** `bg-gray-50`, `text-gray-700`, `border-gray-200`

**Example Styling Pattern:**
```tsx
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
  Add New
</button>
```

**No Design System/Theme:**
- No centralized theme configuration
- Colors hardcoded in components
- No design tokens or CSS variables

---

### Question 12: What is the design pattern for lists/tables?

**Table Component:** `CRUDTable.tsx`

**Data Fetching Pattern:**
```typescript
const [data, setData] = useState<Item[]>([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  try {
    setIsLoading(true);
    const data = await apiClient.get('/endpoint');
    setData(Array.isArray(data) ? data : []);
  } catch (err) {
    setError('Failed to load data');
  } finally {
    setIsLoading(false);
  }
};
```

**Table Display:**
- Uses `CRUDTable` component
- Columns defined as array with `key`, `label`, and optional `render` function
- Example:
```typescript
const columns = [
  { key: 'name', label: 'Name' },
  { key: 'amount', label: 'Amount', render: (value) => `$${value.toLocaleString()}` },
  { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> }
];
```

**Pagination:**
- ❌ **NOT implemented** - All data loaded at once

**Filters:**
- ❌ **NOT implemented** - No filter UI or logic

**Action Buttons:**
- Edit button: Only shown if `item.status === 'draft'`
- Delete button: Only shown if `item.status === 'draft'`
- View button: Always shown
- Pattern:
```tsx
{onEdit && item.status === 'draft' && (
  <button onClick={() => onEdit(item)}>Edit</button>
)}
```

**Search:**
- ❌ **NOT implemented**

---

## PART 6: CONFIGURATION SCHEMAS DETAILS

### Question 13: Company-Wide Settings Schema

**Schema File:** `Models/CompanyWideSettings.schema.ts`

**Fields:**
```typescript
@Schema({ timestamps: true })
export class CompanyWideSettings {
  @Prop({ required: true })
  payDate: Date;  // Date when payroll is processed

  @Prop({ required: true })
  timeZone: string;  // Timezone for payroll processing

  @Prop({ required: true, default: 'EGP' })
  currency: string;  // Currency code (defaults to EGP)
}
```

**Field Details:**
- **payDate:** Date type, required - The date when payroll is processed
- **timeZone:** String, required - Timezone string (e.g., "Africa/Cairo", "UTC")
- **currency:** String, required, default 'EGP' - Currency code

**Validations:**
- All fields are required
- No status field
- No approval workflow

**API Endpoints:**
- **POST** `/api/payroll-configuration/company-settings` - Upsert (create or update)
- **GET** `/api/payroll-configuration/company-settings` - Get current settings
- **PATCH** `/api/payroll-configuration/company-settings/:id` - Update by ID

**Note:** Company Settings does NOT have approval workflow. It's a direct upsert operation.

---

### Question 14: All Approval-Enabled Schemas

**Complete Summary Table:**

| Schema Name | Approve Endpoint | Reject Endpoint | Status Field | Approved By | Approved At | Rejected By | Rejected At | Rejection Reason |
|-------------|------------------|-----------------|--------------|--------------|--------------|-------------|--------------|------------------|
| **PayType** | ✅ POST `/pay-types/:id/approve` | ✅ POST `/pay-types/:id/reject` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **PayGrade** | ✅ POST `/pay-grades/:id/approve` | ✅ POST `/pay-grades/:id/reject` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **PayrollPolicy** | ✅ POST `/payroll-policies/:id/approve` | ✅ POST `/payroll-policies/:id/reject` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Allowance** | ✅ PATCH `/allowances/:id/status` | ✅ PATCH `/allowances/:id/status` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **InsuranceBracket** | ✅ PATCH `/insurance-brackets/:id/status` | ✅ PATCH `/insurance-brackets/:id/status` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **TaxRules** | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **SigningBonus** | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **TerminationBenefits** | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **CompanySettings** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## PART 7: BUSINESS RULES

### Question 15: What are the approval rules?

**From Backend Service Code Analysis:**

#### Draft Status Rules:
- ✅ **Only DRAFT items can be approved/rejected**
  - Backend throws `BadRequestException` if status is not DRAFT
  - Error message: "Can only approve/reject configurations in DRAFT status"

- ✅ **Only DRAFT items can be edited**
  - Backend throws `BadRequestException` if status is not DRAFT
  - Error message: "Can only edit configurations in DRAFT status"

- ✅ **Only DRAFT items can be deleted**
  - Backend throws `BadRequestException` if status is not DRAFT
  - Error message: "Can only delete configurations in DRAFT status"

#### Approval Process:
**When Approved:**
1. Status changes from `DRAFT` → `APPROVED`
2. `approvedBy` field set to approver's ObjectId
3. `approvedAt` field set to current Date
4. `rejectedBy`, `rejectedAt`, `rejectionReason` cleared (set to undefined)

**When Rejected:**
1. Status changes from `DRAFT` → `REJECTED`
2. `rejectedBy` field set to rejector's ObjectId
3. `rejectedAt` field set to current Date
4. `rejectionReason` field set to provided reason string
5. `approvedBy`, `approvedAt` cleared (set to undefined)

#### Unapproval:
- ❌ **Approved items CANNOT be unapproved**
- Once approved, status cannot revert to DRAFT
- Backend validation prevents status change from APPROVED/REJECTED back to DRAFT

#### Locking:
- ✅ **Approved/Rejected items are locked** - Cannot be edited or deleted
- Must delete and recreate if changes needed (but deletion only allowed for DRAFT)

---

### Question 16: Who can approve what?

**Based on Requirements Document:**

**Payroll Manager Approves:**
- ✅ Pay Types
- ✅ Pay Grades
- ✅ Payroll Policies
- ✅ Allowances
- ✅ Signing Bonuses
- ✅ Termination Benefits
- ✅ Company Settings (but no approval workflow exists)

**HR Manager Approves:**
- ✅ Insurance Brackets only

**Backend Enforcement:**
- ❌ **NOT currently enforced in backend**
- No role-based guards on approval endpoints
- `JwtAuthGuard` and `RolesGuard` exist but not applied to payroll-configuration endpoints
- Frontend should handle role-based UI visibility (show/hide approve buttons based on user role)

**Frontend Implementation Needed:**
- Check user role from JWT token or user context
- Show approve/reject buttons only for authorized roles
- Display appropriate error messages if unauthorized user tries to approve

---

## PART 8: SPECIFIC FEATURE REQUIREMENTS

### Question 17: Approval Workflow Dashboard Requirements

**Based on Phase 4 Requirements:**

**Approval Dashboard Should Show:**
- ✅ List all pending (DRAFT) configurations across all types
- ✅ Separate tabs/sections for each configuration type
- ✅ Filters by:
  - Configuration type (Pay Types, Pay Grades, Policies, etc.)
  - Date created
  - Creator
- ✅ Search functionality (by name, description, etc.)
- ❓ Bulk approve/reject (not specified, but would be useful)

**Dashboard Features:**
1. **Pending Items List:**
   - Show all DRAFT items grouped by type
   - Display: Name, Type, Created By, Created At, Status

2. **Quick Actions:**
   - Approve button (opens modal with confirmation)
   - Reject button (opens modal with reason input)
   - View Details button

3. **Filters:**
   - Dropdown: Filter by configuration type
   - Date range picker: Filter by creation date
   - Search box: Search by name/description

4. **Bulk Operations (Optional):**
   - Select multiple items
   - Bulk approve (with confirmation)
   - Bulk reject (with reason input)

**Suggested Route:**
- `/payroll-configuration/approval-workflow` or `/approval-workflow`

---

### Question 18: Company Settings Page Requirements

**Based on Schema Analysis:**

**Company Settings Page Should Have:**

1. **Pay Date Field:**
   - Type: Date picker
   - Label: "Pay Date"
   - Description: "The date when payroll is processed each period"
   - Validation: Required, must be valid date

2. **Timezone Field:**
   - Type: Dropdown/Select
   - Label: "Timezone"
   - Options: List of timezones (e.g., "Africa/Cairo", "UTC", "America/New_York")
   - Description: "Timezone for payroll processing"
   - Validation: Required

3. **Currency Field:**
   - Type: Dropdown/Select
   - Label: "Currency"
   - Options: Currency codes (EGP, USD, EUR, etc.)
   - Default: "EGP"
   - Description: "Default currency for payroll"
   - Validation: Required

4. **Backup Settings (NOT in schema):**
   - ❌ **NOT defined in CompanyWideSettings schema**
   - May need separate schema or additional fields
   - Could include:
     - Backup frequency (daily, weekly, monthly)
     - Backup location (local, cloud, etc.)
     - Retention period

**API Endpoints Available:**
- **GET** `/api/payroll-configuration/company-settings` - Get current settings
- **POST** `/api/payroll-configuration/company-settings` - Upsert (create or update)
- **PATCH** `/api/payroll-configuration/company-settings/:id` - Update by ID

**Note:** Company Settings does NOT require approval. It's a direct update operation.

---

## PART 9: TESTING & DEPLOYMENT

### Question 19: How is the frontend tested?

**Testing Setup:**
- ❌ **NO test setup found**
- ❌ No Jest configuration
- ❌ No React Testing Library
- ❌ No test files (`.test.tsx`, `.spec.tsx`)
- ❌ No test scripts in `package.json`

**What's Missing:**
- Test framework setup
- Example test files
- Test utilities

**Recommendation:**
- Set up Jest + React Testing Library
- Add test scripts to `package.json`:
```json
"test": "jest",
"test:watch": "jest --watch"
```

---

### Question 20: How is the frontend deployed?

**Build Commands:**
- **Development:** `npm run dev` (runs Next.js dev server)
- **Build:** `npm run build` (creates production build)
- **Start:** `npm run start` (runs production server)
- **Lint:** `npm run lint` (runs ESLint)

**Environment Variables:**
- **API URL:** `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:3000`)
- ❌ **No `.env.example` file found**
- ❌ **No `.env` file found**

**Port:**
- Default Next.js dev port: **3000** (may conflict with backend)
- Can be changed with: `npm run dev -- -p 3001`

**Deployment:**
- No deployment configuration found
- No Dockerfile
- No CI/CD configuration

**Recommended Environment Variables:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## SUMMARY

### 1. API Endpoints Summary

#### Approval Workflow Endpoints

**Pay Types:**
- `POST /api/payroll-configuration/pay-types/:id/approve` - Body: `{ approvedBy: string }`
- `POST /api/payroll-configuration/pay-types/:id/reject` - Body: `{ rejectedBy: string, reason: string }`

**Pay Grades:**
- `POST /api/payroll-configuration/pay-grades/:id/approve` - Body: `{ approvedBy: string }`
- `POST /api/payroll-configuration/pay-grades/:id/reject` - Body: `{ rejectedBy: string, reason: string }`

**Payroll Policies:**
- `POST /api/payroll-configuration/payroll-policies/:id/approve` - Body: `{ approvedBy: string }`
- `POST /api/payroll-configuration/payroll-policies/:id/reject` - Body: `{ rejectedBy: string, reason: string }`

**Allowances:**
- `PATCH /api/payroll-configuration/allowances/:id/status` - Body: `{ status: 'approved' | 'rejected', approverId?: string }`

**Insurance Brackets:**
- `PATCH /api/payroll-configuration/insurance-brackets/:id/status` - Body: `{ status: 'approved' | 'rejected', approverId?: string }`

**Get All Draft Items (for Dashboard):**
- `GET /api/payroll-configuration/pay-types?status=draft`
- `GET /api/payroll-configuration/pay-grades?status=draft`
- `GET /api/payroll-configuration/payroll-policies?status=draft`
- `GET /api/payroll-configuration/allowances?status=draft`
- `GET /api/payroll-configuration/insurance-brackets?status=draft`

#### Company Settings Endpoints

- `GET /api/payroll-configuration/company-settings` - Get current settings
- `POST /api/payroll-configuration/company-settings` - Upsert settings
- `PATCH /api/payroll-configuration/company-settings/:id` - Update by ID

---

### 2. Component Inventory

**✅ Available for Reuse:**
- `CRUDTable` - Table with CRUD actions
- `StatusBadge` - Status display component
- `Modal` - Reusable modal dialog
- `Form` & `FormField` - Form components
- `ListViewContainer` - List view with Add button
- `ViewDetailsModal` - Read-only details view

**❌ Need to Create:**
- Approval modal component
- Rejection modal component (with reason input)
- Approval workflow dashboard component
- Company settings form component
- Filter/search components
- Bulk action components

---

### 3. File Structure Recommendation

**For Phase 3 (System Settings):**
```
frontend/src/app/payroll-configuration/
├── company-settings/
│   └── page.tsx                    # Company settings page
└── components/
    └── CompanySettingsForm.tsx     # Company settings form component
```

**For Phase 4 (Approval Workflow):**
```
frontend/src/app/payroll-configuration/
├── approval-workflow/
│   └── page.tsx                    # Approval dashboard page
└── components/
    ├── ApprovalModal.tsx           # Approval confirmation modal
    ├── RejectionModal.tsx          # Rejection modal with reason
    ├── ApprovalDashboard.tsx       # Main dashboard component
    └── PendingItemsList.tsx        # List of pending items
```

---

### 4. Quick Start Guide

#### Create a New Page
1. Create folder: `src/app/approval-workflow/`
2. Create file: `src/app/approval-workflow/page.tsx`
3. Add component:
```tsx
'use client';

export default function ApprovalWorkflow() {
  return <div>Approval Workflow</div>;
}
```

#### Make an API Call
```typescript
import { apiClient } from '../lib/apiClient';

const fetchData = async () => {
  try {
    const data = await apiClient.get('/payroll-configuration/pay-types?status=draft');
    console.log(data);
  } catch (err) {
    console.error('Error:', err);
  }
};
```

#### Display Data in a Table
```tsx
import { CRUDTable } from '../components/CRUDTable';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> }
];

<CRUDTable
  data={items}
  columns={columns}
  onEdit={handleEdit}
  onView={handleView}
  onDelete={handleDelete}
  isLoading={isLoading}
/>
```

#### Show a Modal
```tsx
import { Modal } from '../components/Modal';
import { useState } from 'react';

const [isOpen, setIsOpen] = useState(false);

<Modal isOpen={isOpen} title="Title" onClose={() => setIsOpen(false)} size="md">
  <div>Modal content</div>
</Modal>
```

#### Handle Form Submission
```tsx
import { Form, FormField } from '../components/Form';

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    await apiClient.post('/endpoint', formData);
    // Success handling
  } catch (err) {
    setError(err.message);
  }
};

<Form onSubmit={handleSubmit} isSubmitting={isSubmitting} onCancel={() => setIsOpen(false)}>
  <FormField
    label="Field Name"
    name="fieldName"
    value={formData.fieldName}
    onChange={handleChange}
    required
  />
</Form>
```

---

### 5. Gap Analysis

**✅ What Exists:**
- Basic CRUD components (Table, Form, Modal)
- Status badge component
- API client utility
- Tab navigation pattern
- Status-based edit/delete logic

**❌ What's Missing (Need to Create):**

**Phase 3 - System Settings:**
- Company settings page
- Company settings form component
- Timezone dropdown component
- Currency dropdown component
- Date picker component (for pay date)
- Backup settings UI (if needed)

**Phase 4 - Approval Workflow:**
- Approval dashboard page
- Approval modal component
- Rejection modal component (with reason textarea)
- Pending items list component
- Filter components (by type, date, creator)
- Search component
- Bulk action components (optional)
- Approval/rejection API integration

**General Missing:**
- Authentication integration (token storage, headers)
- Role-based access control UI
- Error handling improvements
- Loading states for approval actions
- Success/error toast notifications
- Pagination (if needed for large datasets)
- Test setup and tests

---

## ADDITIONAL NOTES

### Backend API Base Path
- All endpoints are under `/api/payroll-configuration/`
- Base URL: `http://localhost:3000` (default)
- Set via `NEXT_PUBLIC_API_URL` environment variable

### Status Enum Values
```typescript
enum ConfigStatus {
  DRAFT = 'draft',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}
```

### Approval DTOs
- **ApproveConfigDto:** `{ approvedBy: string }`
- **RejectConfigDto:** `{ rejectedBy: string, reason: string }`
- **ApprovalDto (for Allowances/Insurance):** `{ status: 'approved' | 'rejected', approverId?: string }`

### Important Business Rules
1. Only DRAFT items can be edited/deleted/approved/rejected
2. Once approved/rejected, items are locked
3. Approval clears rejection fields and vice versa
4. Company Settings does NOT have approval workflow

---

**Document Created:** 2025-01-27
**For:** Person C - Phase 3 & Phase 4 Implementation
**Status:** Complete Analysis


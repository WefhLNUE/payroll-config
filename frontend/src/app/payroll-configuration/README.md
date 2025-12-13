# Payroll Configuration - Frontend Implementation

## Overview
This frontend module implements Phase 1 of the Payroll Configuration & Policy Setup subsystem, providing a complete CRUD interface for managing payroll structures, policies, and compensation settings.

## Project Structure

```
payroll-configuration/
├── page.tsx                           # Main page with tab navigation
├── components/
│   ├── StatusBadge.tsx               # Reusable status display component
│   ├── Form.tsx                      # Reusable form field & form wrapper
│   ├── Modal.tsx                     # Reusable modal component
│   ├── CRUDTable.tsx                 # Reusable table with CRUD actions
│   ├── Containers.tsx                # Higher-level UI containers
│   ├── PayrollPolicies.tsx           # Payroll Policies CRUD
│   ├── PayGrades.tsx                 # Pay Grades CRUD
│   ├── PayTypes.tsx                  # Pay Types CRUD
│   ├── Allowances.tsx                # Allowances CRUD
│   ├── SigningBonuses.tsx            # Signing Bonuses CRUD
│   └── TerminationBenefits.tsx       # Termination & Resignation Benefits CRUD
└── lib/
    ├── apiClient.ts                  # API client utilities
    └── enums.ts                      # Enum definitions & options
```

## Key Features

### 1. **Status Management**
- All configurations default to **Draft** status on creation
- Only **Draft** configurations can be edited or deleted
- Status badges provide visual feedback (Draft: Yellow, Approved: Green, Rejected: Red)
- Non-draft items show view-only mode

### 2. **Reusable Components**

#### StatusBadge
Displays configuration status with visual styling
```tsx
<StatusBadge status="draft" size="md" />
```

#### FormField
Flexible input component supporting:
- Text, number, date, textarea inputs
- Select dropdowns with options
- Required field validation
- Error messages

#### CRUDTable
Intelligent table component featuring:
- Checkbox selection
- Conditional action buttons (Edit/Delete only for Draft items)
- Custom column rendering
- Loading states
- Empty state messages

#### Modal
Reusable modal for forms and view details with:
- Customizable sizes
- Close functionality
- Smooth transitions

### 3. **Configuration Modules**

#### Payroll Policies (Create, Edit, View)
- Policy name, type (Deduction, Allowance, Benefit, Misconduct, Leave)
- Applicability (All Employees, Full Time, Part Time, Contractors)
- Rule definitions (percentage, fixed amount, threshold)
- Effective date tracking

#### Pay Grades (Create, Edit, View)
- Grade/Position names
- Base Salary and Gross Salary tracking
- Gross Salary ≥ Base Salary validation

#### Pay Types (Create, Edit, View)
- Type selection (Hourly, Daily, Weekly, Monthly, Contract-based)
- Amount configuration
- Optional descriptions

#### Allowances (Create, Edit, View)
- Unique allowance names (Housing, Transport, etc.)
- Amount per allowance
- Simple, focused interface

#### Signing Bonuses (Create, Edit, View)
- Bonus name
- Amount configuration
- For new hire incentives

#### Termination & Resignation Benefits (Create, Edit, View)
- Benefit names (End of Service Gratuity, etc.)
- Benefit amount
- Terms and conditions documentation

## API Integration

All components use the `apiClient` utility for communication:

```ts
// GET
await apiClient.get('/payroll-configuration/pay-grades');

// POST
await apiClient.post('/payroll-configuration/pay-grades', data);

// PATCH
await apiClient.patch('/payroll-configuration/pay-grades/:id', data);

// DELETE
await apiClient.delete('/payroll-configuration/pay-grades/:id');
```

### Expected Endpoints
- `/payroll-configuration/payroll-policies`
- `/payroll-configuration/pay-grades`
- `/payroll-configuration/pay-types`
- `/payroll-configuration/allowances`
- `/payroll-configuration/signing-bonus`
- `/payroll-configuration/termination-resignation-benefits`

## Usage

### Navigation
The main page features a tabbed interface for easy navigation between different configuration types. Users can:
- View all configurations
- Create new configurations (default status: Draft)
- Edit draft configurations
- Delete draft configurations
- View detailed information for any configuration

### Adding a Configuration
1. Navigate to desired tab
2. Click "Add New" button
3. Fill form fields
4. Submit to create with Draft status

### Editing a Configuration
1. Only available for Draft status items
2. Click "Edit" button
3. Update form fields
4. Submit to update

### Deleting a Configuration
1. Only available for Draft status items
2. Click "Delete" button
3. Confirm deletion

### Viewing Details
- Click "View" button on any configuration
- Opens modal with full details
- Read-only mode

## Styling

Built with **Tailwind CSS** for:
- Responsive design
- Consistent color scheme
- Accessible form elements
- Professional UI components

Color scheme:
- Blue (#3b82f6): Primary actions, active tabs
- Green (#10b981): Success states, Approved status
- Yellow (#f59e0b): Warning, Draft status
- Red (#ef4444): Errors, Rejected status, Dangerous actions

## Environment Configuration

Set API base URL via environment variable:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Default: `http://localhost:3000/api`

## Error Handling

- API errors are caught and displayed to users
- Form submission errors prevent page navigation
- Loading states prevent duplicate submissions
- User confirmations before delete operations

## State Management

Each module manages:
- Data list state
- Form state
- UI visibility states (modals, edit mode)
- Loading and error states
- Selected items for edit/view

Uses React hooks:
- `useState` for state management
- `useEffect` for data fetching
- Event handlers for CRUD operations

## Future Enhancements

- Pagination for large data sets
- Search and filter capabilities
- Bulk operations
- Export/Import functionality
- Approval workflow UI (Phase 4)
- Advanced validation rules
- Audit log viewing
- Field-level permissions

## Notes

- All configurations require explicit creation (no auto-generation)
- Status flow: Draft → (Approved/Rejected) by Payroll Manager
- Once approved, items are immutable (must delete and recreate)
- All timestamps are handled by backend
- User IDs (createdBy, approvedBy) are set by backend

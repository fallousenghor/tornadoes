# TODO - Backend Migration Plan

## Current Status Analysis

### ✅ Already Migrated (Phase 1 - Dashboard)
- Dashboard.tsx - KPIs
- RevenueChart.tsx
- CashFlowChart.tsx
- PerformanceRadar.tsx
- ActivityFeed.tsx
- EmployeesTable.tsx
- ProgramsGrid.tsx

### ✅ Already Migrated (RH Module)
- Employees.tsx - Full CRUD with backend
- Departments.tsx - Full CRUD with backend

### ✅ Services Already Available
- employeeService.ts - Full CRUD
- departmentService.ts - Full CRUD
- leaveService.ts - Leave requests management
- attendanceService.ts - Attendance management
- invoiceService.ts - Invoice management

---

## Phase 2: RH Module Migration

### 1. Presence.tsx - Migrate to Backend
**Current State:** Uses mock data (generateWeeklyPresence function)
**Service Available:** `attendanceService.ts`
**Changes Needed:**
- Replace `generateWeeklyPresence()` with `attendanceService.getWeeklyPresence()`
- Replace `generateDailyPresence()` with `attendanceService.getPresenceStats()`
- Update modal form to call `attendanceService.recordAttendance()`

**File:** `frontend/src/features/rh/Presence.tsx`

### 2. Leaves.tsx - Migrate to Backend
**Current State:** Uses mock data (generateLeaveRequests function)
**Service Available:** `leaveService.ts`
**Changes Needed:**
- Replace `generateLeaveRequests()` with `leaveService.getPendingLeaves()`
- Update stats to use `leaveService.getLeaveStats()`
- Add approve/reject buttons to call `leaveService.approveLeave()` / `leaveService.rejectLeave()`

**File:** `frontend/src/features/rh/Leaves.tsx`

### 3. Performance.tsx - Migrate to Backend
**Current State:** Uses mock data (generatePerformanceReviews, generateObjectives)
**Service Needed:** Create `performanceService.ts` (new)
**Changes Needed:**
- Create new service for performance reviews
- Replace mock data generation with API calls

**File:** `frontend/src/features/rh/Performance.tsx`
**New File:** `frontend/src/services/performanceService.ts`

### 4. LeaveRequestForm.tsx - Migrate to Backend
**Current State:** Uses mock data (employeesData from mockData)
**Changes Needed:**
- Import and use `employeeService.getEmployees()` for employee dropdown
- Update onSubmit to call `leaveService.createLeave()`

**File:** `frontend/src/features/rh/components/LeaveRequestForm.tsx`

---

## Phase 3: Finance Module Migration

### 5. Invoices.tsx - Migrate to Backend
**Current State:** Uses mock data (generateInvoices function)
**Service Available:** `invoiceService.ts`
**Changes Needed:**
- Replace `generateInvoices()` with `invoiceService.getInvoices()`
- Update modal to call `invoiceService.createInvoice()`
- Add payment processing with `invoiceService.processPayment()`

**File:** `frontend/src/features/finance/Invoices.tsx`

### 6. Treasury.tsx - Migrate to Backend
**Current State:** Uses mock data (generateTransactions function)
**Service Needed:** Create/extend service for treasury
**Changes Needed:**
- Check if backend has treasury/transaction endpoints
- Create `treasuryService.ts` if needed
- Replace mock data with API calls

**File:** `frontend/src/features/finance/Treasury.tsx`
**New File:** `frontend/src/services/treasuryService.ts`

### 7. Accounting.tsx - Migrate to Backend
**Current State:** Need to check
**Service Needed:** Create `accountingService.ts` (new)
**Changes Needed:**
- Check existing mock data
- Create service if backend endpoints exist

**File:** `frontend/src/features/finance/Accounting.tsx`
**New File:** `frontend/src/services/accountingService.ts`

---

## Phase 4: Projects & Students Migration

### 8. Projects.tsx - Migrate to Backend
**Current State:** Uses mock data (projectsData)
**Service Available:** `projectService.ts`
**Changes Needed:**
- Check `projectService.ts` exists and has methods
- Replace mock data with API calls
- Add CRUD operations

**File:** `frontend/src/features/projects/Projects.tsx`

### 9. Students.tsx - Migrate to Backend
**Current State:** Uses mock data (mockStudents, mockPrograms)
**Service Available:** `studentService.ts`, `programService.ts`
**Changes Needed:**
- Replace mock data with `studentService.getStudents()`
- Replace programs with `programService.getPrograms()`

**File:** `frontend/src/features/students/Students.tsx`

---

## Implementation Order

1. **Presence.tsx** - Simple migration using existing attendanceService
2. **LeaveRequestForm.tsx** - Easy fix for employee dropdown
3. **Leaves.tsx** - Uses existing leaveService
4. **Invoices.tsx** - Uses existing invoiceService
5. **Students.tsx** - Uses existing studentService
6. **Treasury.tsx** - May need new service
7. **Performance.tsx** - May need new service
8. **Projects.tsx** - Uses existing projectService
9. **Accounting.tsx** - May need new service

---

## Backend Endpoints Needed

Check if following endpoints exist in backend:
- `/v1/attendances` - POST (record attendance)
- `/v1/attendances/stats` - GET (presence stats)
- `/v1/leave-requests` - Full CRUD
- `/v1/leave-requests/{id}/approve`
- `/v1/leave-requests/{id}/reject`
- `/v1/performance-reviews` - CRUD
- `/v1/objectives` - CRUD
- `/v1/transactions` - CRUD (for Treasury)
- `/v1/accounting` - CRUD
- `/v1/projects` - CRUD
- `/v1/students` - CRUD


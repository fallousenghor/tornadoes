# Migration Backend - TODO

## Services Created
- [x] `authService.ts` - Authentication (already exists)
- [x] `employeeService.ts` - Employees (already exists)
- [x] `dashboardService.ts` - Dashboard KPIs
- [x] `invoiceService.ts` - Invoices
- [x] `leaveService.ts` - Leave requests
- [x] `attendanceService.ts` - Attendance tracking
- [x] `stockService.ts` - Inventory/Assets
- [x] `studentService.ts` - Students
- [x] `teacherService.ts` - Teachers
- [x] `projectService.ts` - Projects
- [x] `programService.ts` - Training programs
- [x] `enrollmentService.ts` - Enrollments & grades
- [x] `departmentService.ts` - Departments

## Components to Update

### Layout
- [ ] `AppLayout.tsx` - Navigation from mock data

### Dashboard
- [ ] `Dashboard.tsx` - KPIs from dashboardService
- [ ] `KPICard` - From mock data
- [ ] `RevenueChart.tsx` - Revenue data from API
- [ ] `BudgetByDepartment.tsx` - Departments from departmentService
- [ ] `PresenceChart.tsx` - Attendance from attendanceService
- [ ] `LeavesPieChart.tsx` - Leave from leaveService
- [ ] `PerformanceRadar.tsx` - Performance data
- [ ] `CashFlowChart.tsx` - Finance data from API
- [ ] `InvoicesList.tsx` - From invoiceService
- [ ] `StockChart.tsx` - From stockService
- [ ] `ProjectsList.tsx` - From projectService
- [ ] `ActivityFeed.tsx` - Activity logs
- [ ] `EmployeesTable.tsx` - From employeeService
- [ ] `ProgramsGrid.tsx` - From programService

### RH Module
- [ ] `Employees.tsx` - Already using employeeService ✓
- [ ] `Departments.tsx` - From departmentService
- [ ] `Presence.tsx` - From attendanceService
- [ ] `Leaves.tsx` - From leaveService
- [ ] `Performance.tsx` - Performance reviews

### Finance Module
- [ ] `Treasury.tsx` - Cash flow from API
- [ ] `Invoices.tsx` - From invoiceService
- [ ] `Accounting.tsx` - Journal entries

### Stock Module
- [ ] `Stock.tsx` - From stockService

### Projects Module
- [ ] `Projects.tsx` - From projectService

### Education Module
- [ ] `Students.tsx` - From studentService
- [ ] `Teachers.tsx` - From teacherService
- [ ] `Schedule.tsx` - Schedules
- [ ] `Grades.tsx` - From enrollmentService

## Mock Data to Remove
- [ ] Keep `navSections` for navigation (optional)
- [ ] Remove all other mock data exports from `mockData.ts`

## Progress
- Services: 13/13 (100%)
- Components: 0/30 (0%)


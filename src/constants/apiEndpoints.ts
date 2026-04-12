/**
 * API Endpoints Reference - AEVUM ERP
 * 
 * This file documents all backend endpoints for frontend developers.
 * Base URL: http://localhost:8080/api
 * All endpoints should be prefixed with /v1
 */

// ==================== AUTHENTICATION ====================
export const AUTH_ENDPOINTS = {
  LOGIN: '/v1/auth/login',                    // POST - Login
  REGISTER: '/v1/auth/register',              // POST - Register
  REFRESH: '/v1/auth/refresh',                // POST - Refresh token
  LOGOUT: '/v1/auth/logout',                  // POST - Logout
  USERS: '/v1/users',                         // GET - List users
  USER_BY_ID: (id: string) => `/v1/users/${id}`, // GET - Get user
} as const;

// ==================== DASHBOARD ====================
export const DASHBOARD_ENDPOINTS = {
  SUMMARY: '/v1/dashboard',                   // GET - Global KPIs
  REVENUE: '/v1/dashboard/revenue',           // GET - Revenue chart data
  CASHFLOW: '/v1/dashboard/cashflow',         // GET - Cashflow data
  PERFORMANCE: '/v1/dashboard/performance',   // GET - Performance radar
  ACTIVITY: '/v1/dashboard/activity',         // GET - Recent activity
} as const;

// ==================== EMPLOYEES (HR) ====================
export const EMPLOYEE_ENDPOINTS = {
  LIST: '/v1/employees',                      // GET - List employees
  CREATE: '/v1/employees',                    // POST - Create employee
  CREATE_WITH_PHOTO: '/v1/employees/with-photo', // POST - Create with photo
  GET: (id: string) => `/v1/employees/${id}`, // GET - Get employee
  UPDATE: (id: string) => `/v1/employees/${id}`, // PUT - Update employee
  UPDATE_PHOTO: (id: string) => `/v1/employees/${id}/photo`, // PUT - Update photo
  TERMINATE: (id: string) => `/v1/employees/${id}/terminate`, // POST - Terminate
  DELETE: (id: string) => `/v1/employees/${id}`, // DELETE - Delete
} as const;

// ==================== DEPARTMENTS ====================
export const DEPARTMENT_ENDPOINTS = {
  LIST: '/v1/departments',                    // GET - List departments
  CREATE: '/v1/departments',                  // POST - Create department
  GET: (id: string) => `/v1/departments/${id}`, // GET - Get department
  DETAIL: (id: string) => `/v1/departments/${id}/detail`, // GET - Detailed info
  STATS: (id: string) => `/v1/departments/${id}/stats`, // GET - Department stats
  UPDATE: (id: string) => `/v1/departments/${id}`, // PUT - Update
  UPDATE_BUDGET: (id: string) => `/v1/departments/${id}/budget`, // PATCH - Update budget
  DELETE: (id: string) => `/v1/departments/${id}`, // DELETE - Soft delete
  RESTORE: (id: string) => `/v1/departments/${id}/restore`, // POST - Restore
  ASSIGN_HEAD: (id: string) => `/v1/departments/${id}/head`, // POST - Assign head
} as const;

// ==================== LEAVE REQUESTS ====================
export const LEAVE_ENDPOINTS = {
  LIST: '/v1/leave-requests',                 // GET - List leave requests
  CREATE: '/v1/leave-requests',               // POST - Create request
  PENDING: '/v1/leave-requests/pending',      // GET - Pending approvals
  APPROVE: (id: string) => `/v1/leave-requests/${id}/approve`, // POST - Approve
  REJECT: (id: string) => `/v1/leave-requests/${id}/reject`, // POST - Reject
  STATS_BY_TYPE: '/v1/leave-requests/stats/by-type', // GET - Stats by type
  BALANCES: '/v1/leave-requests/balances',    // GET - All balances
} as const;

// ==================== ATTENDANCE (HR) ====================
export const HR_ATTENDANCE_ENDPOINTS = {
  LIST: '/v1/attendances',                    // GET - List attendance
  CREATE: '/v1/attendances',                  // POST - Record attendance
  UPDATE: (id: string) => `/v1/attendances/${id}`, // PUT - Update
} as const;

// ==================== PERFORMANCE REVIEWS ====================
export const PERFORMANCE_ENDPOINTS = {
  LIST: '/v1/performance-reviews',            // GET - List reviews
  CREATE: '/v1/performance-reviews',          // POST - Create review
  UPDATE: (id: string) => `/v1/performance-reviews/${id}`, // PUT - Update
  OBJECTIVES: '/v1/objectives',               // GET - List objectives
  CREATE_OBJECTIVE: '/v1/objectives',         // POST - Create objective
} as const;

// ==================== INVOICES ====================
export const INVOICE_ENDPOINTS = {
  LIST: '/v1/invoices',                       // GET - List invoices
  CREATE: '/v1/invoices',                     // POST - Create invoice
  GET: (id: string) => `/v1/invoices/${id}`,  // GET - Get invoice
  UPDATE: (id: string) => `/v1/invoices/${id}`, // PUT - Update
  DELETE: (id: string) => `/v1/invoices/${id}`, // DELETE - Delete
  SEND: (id: string) => `/v1/invoices/${id}/send`, // POST - Send to client
  CANCEL: (id: string) => `/v1/invoices/${id}/cancel`, // POST - Cancel
  PROCESS_PAYMENT: (id: string) => `/v1/invoices/${id}/payments`, // POST - Process payment
  SUMMARY: '/v1/invoices/summary',            // GET - Financial summary
} as const;

// ==================== PAYMENTS ====================
export const PAYMENT_ENDPOINTS = {
  GET: (id: string) => `/v1/payments/${id}`,  // GET - Get payment
  BY_INVOICE: (invoiceId: string) => `/v1/payments/invoice/${invoiceId}`, // GET - List by invoice
} as const;

// ==================== EXPENSES ====================
export const EXPENSE_ENDPOINTS = {
  LIST: '/v1/expenses',                       // GET - List expenses
  CREATE: '/v1/expenses',                     // POST - Record expense
  GET: (id: string) => `/v1/expenses/${id}`,  // GET - Get expense
  APPROVE: (id: string) => `/v1/expenses/${id}/approve`, // POST - Approve
  REJECT: (id: string) => `/v1/expenses/${id}/reject`, // POST - Reject
  SUMMARY: '/v1/expenses/summary',            // GET - Expense summary
} as const;

// ==================== ACCOUNTING ====================
export const ACCOUNTING_ENDPOINTS = {
  JOURNAL_ENTRIES: '/v1/accounting/journal-entries', // GET - List entries
  CREATE_ENTRY: '/v1/accounting/journal-entries', // POST - Create entry
  GET_ENTRY: (id: string) => `/v1/accounting/journal-entries/${id}`, // GET - Get entry
  UPDATE_ENTRY: (id: string) => `/v1/accounting/journal-entries/${id}`, // PUT - Update
  DELETE_ENTRY: (id: string) => `/v1/accounting/journal-entries/${id}`, // DELETE - Delete
} as const;

// ==================== ASSETS (INVENTORY) ====================
export const ASSET_ENDPOINTS = {
  LIST: '/v1/assets',                         // GET - List assets
  CREATE: '/v1/assets',                       // POST - Create asset
  CREATE_WITH_MEDIA: '/v1/assets/with-media', // POST - Create with media
  GET: (id: string) => `/v1/assets/${id}`,    // GET - Get asset
  UPDATE: (id: string) => `/v1/assets/${id}`, // PUT - Update
  UPDATE_MEDIA: (id: string) => `/v1/assets/${id}/media`, // PUT - Update media
  ASSIGN: (id: string) => `/v1/assets/${id}/assign`, // POST - Assign to employee
  RETURN: (id: string) => `/v1/assets/${id}/return`, // POST - Return asset
} as const;

// ==================== ASSET ASSIGNMENTS ====================
export const ASSET_ASSIGNMENT_ENDPOINTS = {
  BY_EMPLOYEE: (employeeId: string) => `/v1/asset-assignments/employee/${employeeId}`, // GET - Assignment history
  ACTIVE: (employeeId: string) => `/v1/asset-assignments/employee/${employeeId}/active`, // GET - Active assignments
} as const;

// ==================== STUDENTS ====================
export const STUDENT_ENDPOINTS = {
  LIST: '/v1/students',                       // GET - List students
  CREATE: '/v1/students',                     // POST - Register student
  GET: (id: string) => `/v1/students/${id}`,  // GET - Get student
} as const;

// ==================== TEACHERS ====================
export const TEACHER_ENDPOINTS = {
  LIST: '/v1/teachers',                       // GET - List teachers
  GET: (id: string) => `/v1/teachers/${id}`,  // GET - Get teacher
} as const;

// ==================== PROGRAMS ====================
export const PROGRAM_ENDPOINTS = {
  LIST: '/v1/programs',                       // GET - List programs
  CREATE: '/v1/programs',                     // POST - Create program
  GET: (id: string) => `/v1/programs/${id}`,  // GET - Get program
  UPDATE: (id: string) => `/v1/programs/${id}`, // PUT - Update
} as const;

// ==================== ENROLLMENTS ====================
export const ENROLLMENT_ENDPOINTS = {
  LIST: '/v1/enrollments',                    // GET - List enrollments
  CREATE: '/v1/enrollments',                  // POST - Enroll student
  GET: (id: string) => `/v1/enrollments/${id}`, // GET - Get enrollment
  BY_STUDENT: (studentId: string) => `/v1/enrollments/student/${studentId}`, // GET - Student enrollments
  BY_PROGRAM: (programId: string) => `/v1/enrollments/program/${programId}`, // GET - Program enrollments
  ADD_GRADES: (id: string) => `/v1/enrollments/${id}/grades`, // POST - Record grade
  COMPLETE: (id: string) => `/v1/enrollments/${id}/complete`, // POST - Complete enrollment
} as const;

// ==================== GRADES ====================
export const GRADE_ENDPOINTS = {
  LIST: '/v1/grades',                         // GET - List grades
  CREATE: '/v1/grades',                       // POST - Create grade
  STATS: '/v1/grades/stats',                  // GET - Grade statistics
  STUDENTS_WITH_AVERAGES: '/v1/grades/students', // GET - Students with averages
} as const;

// ==================== SCHEDULE ====================
export const SCHEDULE_ENDPOINTS = {
  LIST: '/v1/schedules',                      // GET - List schedules
  CREATE: '/v1/schedules',                    // POST - Create schedule
  UPDATE: (id: string) => `/v1/schedules/${id}`, // PUT - Update schedule
  DELETE: (id: string) => `/v1/schedules/${id}`, // DELETE - Delete
  ROOMS: '/v1/rooms',                         // GET - List rooms
} as const;

// ==================== DOCUMENTS ====================
export const DOCUMENT_ENDPOINTS = {
  LIST: '/v1/documents',                      // GET - List documents
  CREATE: '/v1/documents',                    // POST - Create document
  GET: (id: string) => `/v1/documents/${id}`, // GET - Get document
  UPDATE: (id: string) => `/v1/documents/${id}`, // PUT - Update
  DELETE: (id: string) => `/v1/documents/${id}`, // DELETE - Delete
  ADD_SIGNATURE: (id: string) => `/v1/documents/${id}/signatures`, // POST - Add signature
  STATS_COUNT: '/v1/documents/stats/count',   // GET - Count by status
} as const;

// ==================== PROJECTS ====================
export const PROJECT_ENDPOINTS = {
  LIST: '/v1/projects',                       // GET - List projects
  CREATE: '/v1/projects',                     // POST - Create project
  GET: (id: string) => `/v1/projects/${id}`,  // GET - Get project
  UPDATE: (id: string) => `/v1/projects/${id}`, // PUT - Update
  DELETE: (id: string) => `/v1/projects/${id}`, // DELETE - Delete
} as const;

// ==================== ATTENDANCE (Daily Presence) ====================
export const ATTENDANCE_ENDPOINTS = {
  LIST: '/v1/attendance',                     // GET - List records
  CREATE: '/v1/attendance',                   // POST - Create record
  GET: (id: string) => `/v1/attendance/${id}`, // GET - Get record
  UPDATE: (id: string) => `/v1/attendance/${id}`, // PUT - Update
  DELETE: (id: string) => `/v1/attendance/${id}`, // DELETE - Delete
  STATS_PRESENCE: '/v1/attendance/stats/presence', // GET - Presence statistics
  STATS_WEEKLY: '/v1/attendance/stats/weekly', // GET - Weekly presence
} as const;

// ==================== ROLES & PERMISSIONS ====================
export const ROLES_ENDPOINTS = {
  LIST: '/v1/roles',                          // GET - List roles
  CREATE: '/v1/roles',                        // POST - Create role
  UPDATE: (id: string) => `/v1/roles/${id}`,  // PUT - Update role
  DELETE: (id: string) => `/v1/roles/${id}`,  // DELETE - Delete role
  PERMISSIONS: '/v1/permissions',             // GET - List permissions
} as const;

// ==================== AUDIT LOGS ====================
export const AUDIT_ENDPOINTS = {
  LIST: '/v1/audit-logs',                     // GET - List logs
  STATS: '/v1/audit-logs/stats',              // GET - Audit statistics
} as const;

// ==================== SETTINGS ====================
export const SETTINGS_ENDPOINTS = {
  GET: '/v1/settings',                        // GET - Get settings
  UPDATE: '/v1/settings',                     // PUT - Update settings
} as const;

// ==================== POSITIONS ====================
export const POSITION_ENDPOINTS = {
  LIST: '/v1/positions',                      // GET - List by department
  CREATE: '/v1/positions',                    // POST - Create position
  GET: (id: string) => `/v1/positions/${id}`, // GET - Get position
} as const;

// Export all endpoints
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  DASHBOARD: DASHBOARD_ENDPOINTS,
  EMPLOYEE: EMPLOYEE_ENDPOINTS,
  DEPARTMENT: DEPARTMENT_ENDPOINTS,
  LEAVE: LEAVE_ENDPOINTS,
  HR_ATTENDANCE: HR_ATTENDANCE_ENDPOINTS,
  PERFORMANCE: PERFORMANCE_ENDPOINTS,
  INVOICE: INVOICE_ENDPOINTS,
  PAYMENT: PAYMENT_ENDPOINTS,
  EXPENSE: EXPENSE_ENDPOINTS,
  ACCOUNTING: ACCOUNTING_ENDPOINTS,
  ASSET: ASSET_ENDPOINTS,
  ASSET_ASSIGNMENT: ASSET_ASSIGNMENT_ENDPOINTS,
  STUDENT: STUDENT_ENDPOINTS,
  TEACHER: TEACHER_ENDPOINTS,
  PROGRAM: PROGRAM_ENDPOINTS,
  ENROLLMENT: ENROLLMENT_ENDPOINTS,
  GRADE: GRADE_ENDPOINTS,
  SCHEDULE: SCHEDULE_ENDPOINTS,
  DOCUMENT: DOCUMENT_ENDPOINTS,
  PROJECT: PROJECT_ENDPOINTS,
  ATTENDANCE: ATTENDANCE_ENDPOINTS,
  ROLES: ROLES_ENDPOINTS,
  AUDIT: AUDIT_ENDPOINTS,
  SETTINGS: SETTINGS_ENDPOINTS,
  POSITION: POSITION_ENDPOINTS,
} as const;

export default API_ENDPOINTS;

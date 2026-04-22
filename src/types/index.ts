// Domain Types - AEVUM Enterprise ERP
// Single Responsibility: Define all TypeScript interfaces for the domain

// ==================== User & Auth ====================
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  departmentId?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export type UserRole = 
  | 'admin' 
  | 'dg' 
  | 'rh' 
  | 'comptable' 
  | 'chef_departement' 
  | 'employe' 
  | 'professeur' 
  | 'apprenant';

export interface Permission {
  id: string;
  name: string;
  module: ModuleType;
  actions: PermissionAction[];
}

export type PermissionAction = 'create' | 'read' | 'update' | 'delete';

export type ModuleType = 
  | 'dashboard'
  | 'employees'
  | 'departments'
  | 'presence'
  | 'conges'
  | 'performance'
  | 'treasury'
  | 'invoices'
  | 'accounting'
  | 'stock'
  | 'projects'
  | 'documents'
  | 'students'
  | 'teachers'
  | 'schedule'
  | 'grades'
  | 'roles'
  | 'audit'
  | 'settings';

// ==================== Organization ====================
export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  budget: number;
  spent: number;
  headId?: string;
  headName?: string;
  parentId?: string;
  objectives?: string[];
  active?: boolean;
  positionCount?: number;
  employeeCount?: number;
  createdAt: Date;
}

export interface DepartmentDetail {
  id: string;
  name: string;
  code: string;
  description?: string;
  active: boolean;
  deleted: boolean;
  deletedAt?: string;
  budget: {
    allocated: number;
    spent: number;
    remaining: number;
    currency: string;
  };
  currentHead?: {
    employeeId: string;
    employeeName: string;
    startDate: string;
  };
  headHistory: Array<{
    employeeId: string;
    employeeName: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
  }>;
  employeeCount: number;
  positionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentStats {
  id: string;
  name: string;
  code: string;
  totalEmployees: number;
  activeEmployees: number;
  positionCount: number;
  openPositions: number;
  budget: number;
  budgetUtilizationPercent: number;
  hasActiveHead: boolean;
  currentHeadName?: string;
}

export interface OrganigrammeNode {
  id: string;
  name: string;
  title: string;
  departmentId: string;
  children?: OrganigrammeNode[];
}

// ==================== Employees ====================
export interface Employee {
  id: string;
  userId: string;
  employeeNumber?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  poste: string;
  departmentId: string;
  contractType: ContractType;
  salary: number;
  startDate: Date;
  status: EmployeeStatus;
  avatar?: string;
  photoUrl?: string;
  qrCodeUrl?: string;
  notes?: string;
}

export type ContractType = 'CDI' | 'CDD' | 'Freelance' | 'Stage' | 'Part_time';

export type EmployeeStatus = 'Actif' | 'Congé' | 'Inactif' | 'Suspendu';

export interface EmployeeDocument {
  id: string;
  employeeId: string;
  type: DocumentType;
  name: string;
  url: string;
  uploadedAt: Date;
}

export type DocumentType = 'contract' | 'cnss' | 'id' | 'diploma' | 'other';

export interface SalaryHistory {
  id: string;
  employeeId: string;
  date: Date;
  baseSalary: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
}

// ==================== Presence & Leave ====================
export interface PresenceRecord {
  id: string;
  employeeId: string;
  employeeName?: string;
  department?: string;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  status: PresenceStatus;
  notes?: string;
}

export type PresenceStatus = 'present' | 'absent' | 'late' | 'leave';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeNumber?: string;
  type: LeaveType;
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: LeaveStatus;
  approvedBy?: string;
  approvedAt?: Date;
}

export type LeaveType = 'annuel' | 'maladie' | 'maternite' | 'sans_solde' | 'exceptionnel';

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveBalance {
  employeeId: string;
  type: LeaveType;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
}

// ==================== Performance ====================
export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  period: string;
  objectives: PerformanceObjective[];
  rating: number;
  feedback?: string;
  createdAt: Date;
}

export interface PerformanceObjective {
  id: string;
  title: string;
  description?: string;
  target: number;
  achieved: number;
  status: 'pending' | 'achieved' | 'exceeded';
}

// ==================== Finance ====================
export interface Invoice {
  id: string;
  reference: string;
  clientId: string;
  clientName: string;
  amount: number;
  date: Date;
  dueDate?: Date;
  status: InvoiceStatus;
  items: InvoiceItem[];
  payments?: Payment[];
}

export type InvoiceStatus = 'paye' | 'en_attente' | 'partiel';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  date: Date;
  method: PaymentMethod;
  reference?: string;
}

export type PaymentMethod = 'cash' | 'bank_transfer' | 'check' | 'card';

export interface Expense {
  id: string;
  title: string;
  description?: string;
  category: string;
  amount: number;
  currency: string;
  expenseDate: Date;
  status: ExpenseStatus;
  submittedByName: string;
  approvedByName?: string;
  departmentId?: string;
  receiptReference?: string;
  createdAt: Date;
}

export type ExpenseStatus = 'en_attente' | 'approuve' | 'paye' | 'rejete';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: Date;
  centerOfCost?: string;
}

export interface CashFlow {
  month: string;
  incomes: number;
  expenses: number;
  balance: number;
}

export interface TreasurySummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  incomeCount: number;
  expenseCount: number;
  recentTransactions: {
    id: string;
    reference: string;
    description: string;
    type: 'INCOME' | 'EXPENSE';
    amount: number;
    currency: string;
    category: string;
    transactionDate: string;
    createdByName: string;
    notes?: string;
  }[];
  incomeByCategory: Record<string, number>;
  expensesByCategory: Record<string, number>;
  monthlyTrend: { month: string; income: number; expenses: number }[];
}

// Accounting Types (Plan Comptable)
export interface AccountingAccount {
  id: string;
  code: string;
  name: string;
  type: 'actif' | 'passif' | 'charge' | 'produit';
  parentCode?: string;
  balance: number;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  date: Date;
  reference: string;
  description: string;
  accounts: JournalEntryLine[];
  totalDebit: number;
  totalCredit: number;
}

export interface JournalEntryLine {
  code: string;
  name: string;
  debit: number;
  credit: number;
}

// ==================== Stock & Equipment ====================
export interface StockItem {
  id: string;
  name: string;
  category: StockCategory;
  quantity: number;
  available: number;
  assigned: number;
  minQuantity?: number;
  unitPrice?: number;
  location?: string;
}

export type StockCategory = 'informatique' | 'mobilier' | 'equipements';

export interface EquipmentAssignment {
  id: string;
  itemId: string;
  employeeId: string;
  assignedAt: Date;
  returnedAt?: Date;
  status: AssignmentStatus;
}

export type AssignmentStatus = 'assigned' | 'returned' | 'maintenance';

export interface MaintenanceAlert {
  id: string;
  itemId: string;
  type: 'preventive' | 'corrective';
  scheduledDate: Date;
  description: string;
  status: 'pending' | 'completed';
}

// ==================== Training (LMS) ====================
export interface Student {
  id: string;
  userId: string;
  studentCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  programId: string;
  status: StudentStatus;  // Utilise le type défini plus bas
  enrollmentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Note: StudentStatus est défini dans la section Education mise à jour (ligne ~830)

export interface Teacher {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  specialties: string[];
  hourlyRate?: number;
}

export interface Program {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  modules: Module[];
  studentsCount: number;
  activeStudents: number;
  completionRate: number;
}

export interface Module {
  id: string;
  programId: string;
  name: string;
  duration: number;
  order: number;
  teacherId?: string;
}

export interface Grade {
  id: string;
  studentId: string;
  moduleId: string;
  value: number;
  date: Date;
  type: 'exam' | 'quiz' | 'project' | 'participation';
}

export interface Schedule {
  id: string;
  programId: string;
  moduleId: string;
  roomId: string;
  teacherId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  equipment?: string[];
}

// ==================== Projects ====================
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  startDate: Date;
  deadline: Date;
  managerId: string;
  members: string[];
}

export type ProjectStatus = 'demarrage' | 'en_cours' | 'finalisation' | 'termine';

export type ProjectPriority = 'basse' | 'moyenne' | 'haute' | 'critique';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  assigneeId?: string;
  status: TaskStatus;
  progress: number;
  dueDate?: Date;
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

// ==================== Documents ====================
// Document management module types (for DocumentService)
export type DocumentTypeEnum = 
  | 'CONTRACT' 
  | 'CNSS' 
  | 'ID' 
  | 'DIPLOMA' 
  | 'INVOICE' 
  | 'REPORT' 
  | 'POLICY' 
  | 'OTHER';

export type DocumentCategoryEnum = 
  | 'RH' 
  | 'FINANCE' 
  | 'JURIDIQUE' 
  | 'TECHNIQUE' 
  | 'COMMERCIAL' 
  | 'GENERAL';

export type DocumentStatusEnum = 
  | 'DRAFT' 
  | 'PENDING_SIGNATURE' 
  | 'SIGNED' 
  | 'EXPIRED';

export interface Document {
  id: string;
  name: string;
  description?: string;
  type: DocumentTypeEnum;
  category: DocumentCategoryEnum;
  version: number;
  status: DocumentStatusEnum;
  uploadedBy: string;
  uploadedAt: Date;
  updatedAt: Date;
  signatureRequired: boolean;
  signedBy?: string[];
  departmentId?: string;
  employeeId?: string;
  expiresAt?: Date;
  fileUrl?: string;
}

// ==================== Dashboard ====================
export interface KPI {
  id: string;
  label: string;
  value: string | number;
  change: number;
  icon: string;
  color: string;
  sparklineData?: number[];
}

export interface DashboardView {
  type: 'dg' | 'rh' | 'finance';
  title: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  timestamp: Date;
  amount?: string;
  avatarInitials: string;
  avatarColor: string;
}

// ==================== Navigation ====================
export interface NavSection {
  label: string;
  items: NavItem[];
}

export interface NavItem {
  icon: string;
  label: string;
  id: string;
  path?: string;
}

// ==================== CRM (Nouveaux) ====================
export type ContactType = 'CLIENT' | 'FOURNISSEUR' | 'PARTENAIRE' | 'PROSPECT';
export type ContactStatus = 'ACTIVE' | 'INACTIVE' | 'BLACKLISTED';
export type ContactPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'VIP';

export interface Contact {
  id: string;
  type: ContactType;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  website?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  industry?: string;
  companySize?: string;
  taxId?: string;
  registrationId?: string;
  status: ContactStatus;
  priority: ContactPriority;
  creditLimit?: number;
  paymentTerms?: string;
  notes?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactFilters {
  type?: ContactType;
  status?: ContactStatus;
  search?: string;
}

export type DealStage = 'PROSPECTION' | 'QUALIFICATION' | 'PROPOSITION' | 'NEGOTIATION' | 'WON' | 'LOST';
export type DealStatus = 'OPEN' | 'WON' | 'LOST' | 'ON_HOLD';

export interface Deal {
  id: string;
  title: string;
  contactId: string;
  contactName: string;
  amount: number;
  currency: string;
  probability: number;
  stage: DealStage;
  source?: string;
  expectedClose?: Date;
  actualClose?: Date;
  description?: string;
  nextAction?: string;
  nextActionDate?: Date;
  ownerId?: string;
  ownerName: string;
  status: DealStatus;
  lossReason?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DealFilters {
  stage?: DealStage;
  status?: DealStatus;
  ownerId?: string;
}

// ==================== Purchases (Nouveaux) ====================
export type PurchaseOrderStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'SENT' | 'PARTIAL' | 'RECEIVED' | 'CANCELLED';

export interface PurchaseOrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  supplierContact?: string;
  supplierEmail?: string;
  supplierPhone?: string;
  orderDate: Date;
  expectedDelivery?: Date;
  actualDelivery?: Date;
  status: PurchaseOrderStatus;
  currency: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount?: number;
  shippingCost?: number;
  total: number;
  items: PurchaseOrderItem[];
  shippingAddress?: string;
  notes?: string;
  terms?: string;
  approvedById?: string;
  approvedByName?: string;
  approvedAt?: Date;
  receiverId?: string;
  receiverName?: string;
  receivedAt?: Date;
  invoiceReference?: string;
  attachmentUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseOrderFilters {
  status?: PurchaseOrderStatus;
  supplierId?: string;
  search?: string;
}

// ==================== Inventory (Mise à jour) ====================
export interface Asset {
  id: string;
  assetCode: string;
  name: string;
  description?: string;
  category: AssetCategory;
  type?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: Date;
  purchasePrice?: number;
  supplierId?: string;
  supplierName?: string;
  warrantyUntil?: Date;
  status: AssetStatus;
  condition: AssetCondition;
  location?: string;
  assignedToId?: string;
  assignedToName?: string;
  departmentId?: string;
  departmentName?: string;
  notes?: string;
  photoUrl?: string;
  qrCodeUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AssetCategory = 'ELECTRONIC' | 'FURNITURE' | 'VEHICLE' | 'SOFTWARE' | 'OTHER';
export type AssetStatus = 'AVAILABLE' | 'ASSIGNED' | 'MAINTENANCE' | 'BROKEN' | 'DISPOSED';
export type AssetCondition = 'NEW' | 'GOOD' | 'FAIR' | 'POOR';

export interface AssetAssignment {
  id: string;
  assetId: string;
  assetName: string;
  assignedToId: string;
  assignedToName: string;
  assignedToType: 'EMPLOYEE' | 'DEPARTMENT';
  departmentId?: string;
  departmentName?: string;
  assignmentDate: Date;
  returnDate?: Date;
  reason?: string;
  conditionAtAssignment?: string;
  conditionAtReturn?: string;
  notes?: string;
  assignedById?: string;
  assignedByName?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Education (Mise à jour) ====================
export interface TrainingProgram {
  id: string;
  title: string;
  description?: string;
  category?: string;
  level: ProgramLevel;
  durationWeeks: number;
  durationHours: number;
  maxStudents?: number;
  startDate?: Date;
  endDate?: Date;
  schedule?: string;
  location?: string;
  price: number;
  currency: string;
  teacherId?: string;
  teacherName?: string;
  modules: ProgramModule[];
  prerequisites?: string;
  certification?: boolean;
  active: boolean;
  passingScore: number;
  enrolledCount?: number;
  completedCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ProgramLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface ProgramModule {
  title: string;
  durationHours: number;
  order: number;
}

export interface Enrollment {
  id: string;
  studentId: string;
  studentName: string;
  studentCode?: string;
  programId: string;
  programName: string;
  enrollmentDate: Date;
  completionDate?: Date;
  status: EnrollmentStatus;
  paymentStatus?: string;
  amountPaid?: number;
  finalAverage?: number;
  finalLetterGrade?: string;
  passed?: boolean;
  grades?: GradeRecord[];
  attendanceRate?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type EnrollmentStatus = 'ACTIVE' | 'COMPLETED' | 'DROPPED_OUT' | 'FAILED';

export interface GradeRecord {
  module: string;
  score: number;
  maxScore: number;
  date: string;
}

export interface Student {
  id: string;
  studentCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthDate?: Date;
  gender?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  photoUrl?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  emergencyRelation?: string;
  educationLevel?: string;
  occupation?: string;
  companyName?: string;
  status: StudentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type StudentStatus = 'ACTIVE' | 'GRADUATED' | 'SUSPENDED' | 'DROPPED_OUT';

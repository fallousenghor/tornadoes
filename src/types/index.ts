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
  parentId?: string;
  objectives?: string[];
  createdAt: Date;
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
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  programId: string;
  status: StudentStatus;
  enrollmentDate: Date;
}

export type StudentStatus = 'inscrit' | 'actif' | 'attente' | 'diplome' | 'abandon';

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
export interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  departmentId?: string;
  url: string;
  version: number;
  uploadedBy: string;
  uploadedAt: Date;
  updatedAt: Date;
  signatureRequired: boolean;
  signedBy?: string[];
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


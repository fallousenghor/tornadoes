// Performance Module Types
// Types for Performance Reviews, Objectives, and Department Performance

// ==================== Performance Reviews ====================

export type ReviewStatus = 'completed' | 'pending' | 'in_progress';

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  period: string;
  rating: number;
  objectivesCompleted: number;
  objectivesTotal: number;
  feedback: string;
  reviewer: string;
  reviewedAt: Date;
  status: ReviewStatus;
}

export interface ReviewFormData {
  employeeId: string;
  period: string;
  rating: number;
  objectivesCompleted: number;
  objectivesTotal: number;
  feedback: string;
}

export interface CreateReviewPayload {
  employeeId: string;
  employeeName: string;
  departmentId: string;
  departmentName: string;
  period: string;
  rating: number;
  objectivesCompleted: number;
  objectivesTotal: number;
  feedback: string;
  reviewerName?: string;
}

export interface UpdateReviewPayload {
  period?: string;
  rating: number;
  objectivesCompleted: number;
  objectivesTotal: number;
  feedback: string;
}

// ==================== Objectives ====================

export type ObjectiveStatus = 'pending' | 'achieved' | 'exceeded' | 'at_risk';

export interface Objective {
  id: string;
  employeeId: string;
  employeeName: string;
  title: string;
  description: string;
  target: number;
  achieved: number;
  status: ObjectiveStatus;
  dueDate: Date;
}

export interface ObjectiveFormData {
  employeeId: string;
  title: string;
  description: string;
  target: number;
  dueDate: string;
}

export interface CreateObjectivePayload {
  employeeId: string;
  employeeName: string;
  title: string;
  description: string;
  target: number;
  dueDate: string;
}

export interface UpdateObjectivePayload {
  title: string;
  description: string;
  target: number;
  dueDate: string;
}

// ==================== Department Performance ====================

export interface DepartmentPerformance {
  departmentId: string;
  departmentName: string;
  avgRating: number;
  employeeCount: number;
}

// ==================== Statistics ====================

export interface PerformanceStats {
  totalReviews: number;
  avgRating: string;
  excellentReviews: number;
  pendingReviews: number;
  totalObjectives: number;
  achievedObjectives: number;
  atRiskObjectives: number;
}

export interface RatingDistributionItem {
  rating: number;
  count: number;
  percentage: number;
}

// ==================== UI State Types ====================

export type CurrentTab = 'reviews' | 'objectives';

export interface DeleteModalState {
  type: 'review' | 'objective';
  id: string;
  name: string;
}

// ==================== Form Options ====================

const currentYear = new Date().getFullYear();

export const PERIOD_OPTIONS = [
  { value: `Q1 ${currentYear}`, label: `Q1 ${currentYear}` },
  { value: `Q4 ${currentYear - 1}`, label: `Q4 ${currentYear - 1}` },
  { value: `Q3 ${currentYear - 1}`, label: `Q3 ${currentYear - 1}` },
  { value: `Q2 ${currentYear - 1}`, label: `Q2 ${currentYear - 1}` },
];

export const RATING_OPTIONS = [1, 2, 3, 4, 5];

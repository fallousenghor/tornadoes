// Performance Service - Tornadoes Job HR Module
// Gestion des évaluations de performance via l'API backend

import api from './api';

// Types backend
interface PerformanceReviewResponse {
  id: string;
  employeeId: string;
  employeeName?: string;
  departmentId?: string;
  departmentName?: string;
  period: string;
  rating: number;
  objectivesCompleted: number;
  objectivesTotal: number;
  feedback: string;
  reviewerId?: string;
  reviewerName?: string;
  reviewedAt: string;
  status: string;
}

interface ObjectiveResponse {
  id: string;
  employeeId: string;
  employeeName?: string;
  title: string;
  description: string;
  target: number;
  achieved: number;
  status: string;
  dueDate: string;
}

interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// Mapper le status backend vers frontend
const mapReviewStatus = (backendStatus: string): 'completed' | 'pending' | 'in_progress' => {
  switch (backendStatus) {
    case 'COMPLETED':
      return 'completed';
    case 'IN_PROGRESS':
      return 'in_progress';
    default:
      return 'pending';
  }
};

// Mapper le status objectif backend vers frontend
const mapObjectiveStatus = (backendStatus: string): 'pending' | 'achieved' | 'exceeded' | 'at_risk' => {
  switch (backendStatus) {
    case 'ACHIEVED':
      return 'achieved';
    case 'EXCEEDED':
      return 'exceeded';
    case 'AT_RISK':
      return 'at_risk';
    default:
      return 'pending';
  }
};

// Mapper la réponse backend vers le format frontend
const mapReview = (response: PerformanceReviewResponse) => ({
  id: response.id,
  employeeId: response.employeeId,
  employeeName: response.employeeName || 'Unknown',
  department: response.departmentName || 'N/A',
  period: response.period,
  rating: response.rating,
  objectivesCompleted: response.objectivesCompleted,
  objectivesTotal: response.objectivesTotal,
  feedback: response.feedback,
  reviewer: response.reviewerName || 'Unknown',
  reviewedAt: new Date(response.reviewedAt),
  status: mapReviewStatus(response.status),
});

const mapObjective = (response: ObjectiveResponse) => ({
  id: response.id,
  employeeId: response.employeeId,
  employeeName: response.employeeName || 'Unknown',
  title: response.title,
  description: response.description,
  target: response.target,
  achieved: response.achieved,
  status: mapObjectiveStatus(response.status),
  dueDate: new Date(response.dueDate),
});

const performanceService = {
  /**
   * Récupérer les évaluations de performance
   */
  async getPerformanceReviews(params?: {
    page?: number;
    pageSize?: number;
    employeeId?: string;
    period?: string;
  }) {
    const backendParams: Record<string, string | number | undefined> = {
      page: params?.page || 0,
      size: params?.pageSize || 20,
    };
    
    if (params?.employeeId) {
      backendParams.employeeId = params.employeeId;
    }
    if (params?.period) {
      backendParams.period = params.period;
    }

    const response = await api.get<PageResponse<PerformanceReviewResponse>>('/v1/performance-reviews', { params: backendParams });
    const pageData = (response.data as any).data || response.data;
    
    return {
      data: pageData.content.map(mapReview),
      total: pageData.totalElements,
      page: pageData.page,
      pageSize: pageData.size,
    };
  },

  /**
   * Récupérer une évaluation par ID
   */
  async getPerformanceReview(id: string) {
    const response = await api.get<PerformanceReviewResponse>(`/v1/performance-reviews/${id}`);
    return mapReview((response.data as any).data || response.data);
  },

  /**
   * Créer une évaluation de performance
   */
  async createPerformanceReview(data: {
    employeeId: string;
    period: string;
    rating: number;
    objectivesCompleted: number;
    objectivesTotal: number;
    feedback: string;
  }) {
    const response = await api.post<PerformanceReviewResponse>('/v1/performance-reviews', data);
    return mapReview((response.data as any).data || response.data);
  },

  /**
   * Récupérer les objectifs
   */
  async getObjectives(params?: {
    page?: number;
    pageSize?: number;
    employeeId?: string;
    status?: string;
  }) {
    const backendParams: Record<string, string | number | undefined> = {
      page: params?.page || 0,
      size: params?.pageSize || 50,
    };
    
    if (params?.employeeId) {
      backendParams.employeeId = params.employeeId;
    }
    if (params?.status) {
      backendParams.status = params.status;
    }

    const response = await api.get<PageResponse<ObjectiveResponse>>('/v1/objectives', { params: backendParams });
    const pageData = (response.data as any).data || response.data;
    
    return {
      data: pageData.content.map(mapObjective),
      total: pageData.totalElements,
      page: pageData.page,
      pageSize: pageData.size,
    };
  },

  /**
   * Créer un objectif
   */
  async createObjective(data: {
    employeeId: string;
    title: string;
    description: string;
    target: number;
    dueDate: string;
  }) {
    const response = await api.post<ObjectiveResponse>('/v1/objectives', data);
    return mapObjective((response.data as any).data || response.data);
  },

  /**
   * Mettre à jour la progression d'un objectif
   */
  async updateObjectiveProgress(id: string, achieved: number) {
    const response = await api.patch<ObjectiveResponse>(`/v1/objectives/${id}/progress`, { achieved });
    return mapObjective((response.data as any).data || response.data);
  },

  /**
   * Récupérer les statistiques de performance par département
   */
  async getDepartmentPerformance() {
    const response = await api.get<Array<{
      departmentId: string;
      departmentName: string;
      avgRating: number;
      employeeCount: number;
    }>>('/v1/performance/departments');
    return (response.data as any).data || response.data;
  },
};

export default performanceService;

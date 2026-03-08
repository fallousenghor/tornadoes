// Performance Service - Tornadoes Job HR Module
// Gestion des évaluations de performance via l'API backend

import api from './api';

// Types backend (après désencapsulation par l'intercepteur)
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
  createdAt?: string;
  updatedAt?: string;
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
  createdAt?: string;
  updatedAt?: string;
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
  // ==================== Performance Reviews - READ ====================

  /**
   * Récupérer les évaluations de performance
   * Note: l'intercepteur api.ts désencapsule déjà ApiResponse → response.data est directement la donnée.
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

    const response = await api.get<PageResponse<PerformanceReviewResponse>>(
      '/v1/performance-reviews',
      { params: backendParams }
    );
    // Interceptor already unwrapped ApiResponse — response.data is PageResponse directly
    const pageData = response.data as unknown as PageResponse<PerformanceReviewResponse>;

    const emptyPage: PageResponse<PerformanceReviewResponse> = {
      content: [],
      page: 0,
      size: 20,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true,
    };

    const page = (pageData && Array.isArray((pageData as unknown as PageResponse<PerformanceReviewResponse>).content))
      ? pageData
      : emptyPage;

    return {
      data: page.content.map(mapReview),
      total: page.totalElements,
      page: page.page,
      pageSize: page.size,
    };
  },

  /**
   * Récupérer une évaluation par ID
   */
  async getPerformanceReview(id: string) {
    const response = await api.get<PerformanceReviewResponse>(`/v1/performance-reviews/${id}`);
    return mapReview(response.data as unknown as PerformanceReviewResponse);
  },

  /**
   * Récupérer les évaluations par employé
   */
  async getPerformanceReviewsByEmployee(employeeId: string, params?: {
    page?: number;
    pageSize?: number;
  }) {
    const response = await api.get<PageResponse<PerformanceReviewResponse>>(
      `/v1/performance-reviews/employee/${employeeId}`,
      { params: { page: params?.page || 0, size: params?.pageSize || 20 } }
    );
    const pageData = response.data as unknown as PageResponse<PerformanceReviewResponse>;
    return {
      data: pageData.content.map(mapReview),
      total: pageData.totalElements,
    };
  },

  // ==================== Performance Reviews - CREATE ====================

  /**
   * Créer une évaluation de performance
   */
  async createPerformanceReview(data: {
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
  }) {
    const response = await api.post<PerformanceReviewResponse>('/v1/performance-reviews', data);
    return mapReview(response.data as unknown as PerformanceReviewResponse);
  },

  // ==================== Performance Reviews - UPDATE ====================

  /**
   * Mettre à jour une évaluation de performance
   */
  async updatePerformanceReview(id: string, data: {
    period?: string;
    rating: number;
    objectivesCompleted: number;
    objectivesTotal: number;
    feedback: string;
  }) {
    const response = await api.put<PerformanceReviewResponse>(`/v1/performance-reviews/${id}`, data);
    return mapReview(response.data as unknown as PerformanceReviewResponse);
  },

  /**
   * Mettre à jour le statut d'une évaluation
   */
  async updatePerformanceReviewStatus(id: string, status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED') {
    const response = await api.patch<PerformanceReviewResponse>(`/v1/performance-reviews/${id}/status`, { status });
    return mapReview(response.data as unknown as PerformanceReviewResponse);
  },

  // ==================== Performance Reviews - DELETE ====================

  /**
   * Supprimer une évaluation de performance
   */
  async deletePerformanceReview(id: string) {
    await api.delete(`/v1/performance-reviews/${id}`);
  },

  // ==================== Objectives - READ ====================

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

    const response = await api.get<PageResponse<ObjectiveResponse>>(
      '/v1/objectives',
      { params: backendParams }
    );
    // Interceptor already unwrapped ApiResponse — response.data is PageResponse directly
    const pageData = response.data as unknown as PageResponse<ObjectiveResponse>;

    const emptyPage: PageResponse<ObjectiveResponse> = {
      content: [],
      page: 0,
      size: 50,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true,
    };

    const page = (pageData && Array.isArray((pageData as unknown as PageResponse<ObjectiveResponse>).content))
      ? pageData
      : emptyPage;

    return {
      data: page.content.map(mapObjective),
      total: page.totalElements,
      page: page.page,
      pageSize: page.size,
    };
  },

  /**
   * Récupérer un objectif par ID
   */
  async getObjective(id: string) {
    const response = await api.get<ObjectiveResponse>(`/v1/objectives/${id}`);
    return mapObjective(response.data as unknown as ObjectiveResponse);
  },

  /**
   * Récupérer les objectifs par employé
   */
  async getObjectivesByEmployee(employeeId: string, params?: {
    page?: number;
    pageSize?: number;
  }) {
    const response = await api.get<PageResponse<ObjectiveResponse>>(
      `/v1/objectives/employee/${employeeId}`,
      { params: { page: params?.page || 0, size: params?.pageSize || 50 } }
    );
    const pageData = response.data as unknown as PageResponse<ObjectiveResponse>;
    return {
      data: pageData.content.map(mapObjective),
      total: pageData.totalElements,
    };
  },

  // ==================== Objectives - CREATE ====================

  /**
   * Créer un objectif
   */
  async createObjective(data: {
    employeeId: string;
    employeeName?: string;
    title: string;
    description: string;
    target: number;
    dueDate: string;
  }) {
    const response = await api.post<ObjectiveResponse>('/v1/objectives', data);
    return mapObjective(response.data as unknown as ObjectiveResponse);
  },

  // ==================== Objectives - UPDATE ====================

  /**
   * Mettre à jour un objectif
   */
  async updateObjective(id: string, data: {
    title: string;
    description: string;
    target: number;
    dueDate: string;
  }) {
    const response = await api.put<ObjectiveResponse>(`/v1/objectives/${id}`, data);
    return mapObjective(response.data as unknown as ObjectiveResponse);
  },

  /**
   * Mettre à jour la progression d'un objectif
   */
  async updateObjectiveProgress(id: string, achieved: number) {
    const response = await api.patch<ObjectiveResponse>(
      `/v1/objectives/${id}/progress`,
      { achieved }
    );
    return mapObjective(response.data as unknown as ObjectiveResponse);
  },

  /**
   * Mettre à jour le statut d'un objectif
   */
  async updateObjectiveStatus(id: string, status: 'PENDING' | 'ACHIEVED' | 'EXCEEDED' | 'AT_RISK') {
    const response = await api.patch<ObjectiveResponse>(`/v1/objectives/${id}/status`, { status });
    return mapObjective(response.data as unknown as ObjectiveResponse);
  },

  // ==================== Objectives - DELETE ====================

  /**
   * Supprimer un objectif
   */
  async deleteObjective(id: string) {
    await api.delete(`/v1/objectives/${id}`);
  },

  // ==================== Statistics ====================

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
    return (response.data as unknown as Array<{
      departmentId: string;
      departmentName: string;
      avgRating: number;
      employeeCount: number;
    }>) || [];
  },
};

export default performanceService;

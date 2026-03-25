// Department Service - Tornadoes Job Organization Module
// Gestion des départements via l'API backend

import api from './api';
import type { Department } from '@/types';

// Types backend
interface DepartmentResponse {
  id: string;
  name: string;
  code: string;
  description?: string;
  active: boolean;
  currentHeadName?: string;
  budget: number;
  positionCount: number;
  createdAt: string;
  updatedAt: string;
}

// Detailed response with head history and budget
interface DepartmentDetailResponse {
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

// Stats response
interface DepartmentStatsResponse {
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

interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// Mapper la réponse backend vers le format frontend
const mapDepartment = (response: DepartmentResponse): Department => ({
  id: response.id,
  name: response.name,
  code: response.code,
  description: response.description,
  budget: response.budget || 0,
  spent: 0,
  headId: undefined,
  parentId: undefined,
  objectives: undefined,
  createdAt: new Date(response.createdAt),
});

const departmentService = {
  /**
   * Récupérer la liste des départements
   */
  async getDepartments(params?: {
    page?: number;
    pageSize?: number;
    active?: boolean;
    name?: string;
    code?: string;
    minBudget?: number;
    maxBudget?: number;
  }): Promise<{ data: Department[]; total: number; page: number; pageSize: number }> {
    const backendParams: Record<string, string | number | boolean | undefined> = {
      page: params?.page || 0,
      size: params?.pageSize || 100,
    };
    
    if (params?.active !== undefined) {
      backendParams.active = params.active;
    }
    if (params?.name) {
      backendParams.name = params.name;
    }
    if (params?.code) {
      backendParams.code = params.code;
    }
    if (params?.minBudget) {
      backendParams.minBudget = params.minBudget;
    }
    if (params?.maxBudget) {
      backendParams.maxBudget = params.maxBudget;
    }

    const response = await api.get<PageResponse<DepartmentResponse>>('/v1/departments', { params: backendParams });
    const pageData = response.data as unknown as PageResponse<DepartmentResponse>;
    
    return {
      data: pageData.content.map(mapDepartment),
      total: pageData.totalElements,
      page: pageData.page,
      pageSize: pageData.size,
    };
  },

  /**
   * Récupérer un département par ID
   */
  async getDepartment(id: string): Promise<Department> {
    const response = await api.get<DepartmentResponse>(`/v1/departments/${id}`);
    return mapDepartment(response.data as unknown as DepartmentResponse);
  },

  /**
   * Récupérer les détails d'un département (avec historique du responsable et budget)
   */
  async getDepartmentDetail(id: string): Promise<DepartmentDetailResponse> {
    const response = await api.get<DepartmentDetailResponse>(`/v1/departments/${id}/detail`);
    return response.data;
  },

  /**
   * Récupérer les statistiques d'un département
   */
  async getDepartmentStats(id: string): Promise<DepartmentStatsResponse> {
    const response = await api.get<DepartmentStatsResponse>(`/v1/departments/${id}/stats`);
    return response.data;
  },

  /**
   * Créer un nouveau département
   */
  async createDepartment(data: {
    name: string;
    code: string;
    description?: string;
    budget?: number;
  }): Promise<Department> {
    const response = await api.post<DepartmentResponse>('/v1/departments', data);
    return mapDepartment(response.data as unknown as DepartmentResponse);
  },

  /**
   * Mettre à jour un département
   */
  async updateDepartment(id: string, data: {
    name?: string;
    description?: string;
    active?: boolean;
    budget?: number;
  }): Promise<Department> {
    const response = await api.put<DepartmentResponse>(`/v1/departments/${id}`, data);
    return mapDepartment(response.data as unknown as DepartmentResponse);
  },

  /**
   * Mettre à jour uniquement le budget d'un département
   */
  async updateDepartmentBudget(id: string, budget: number): Promise<Department> {
    const response = await api.patch<DepartmentResponse>(`/v1/departments/${id}/budget?budget=${budget}`);
    return mapDepartment(response.data as unknown as DepartmentResponse);
  },

  /**
   * Restaurer un département supprimé
   */
  async restoreDepartment(id: string): Promise<Department> {
    const response = await api.post<DepartmentResponse>(`/v1/departments/${id}/restore`);
    return mapDepartment(response.data as unknown as DepartmentResponse);
  },

  /**
   * Attribuer un responsable au département
   */
  async assignHead(id: string, employeeId: string, employeeName: string, startDate: string): Promise<Department> {
    const response = await api.post<DepartmentResponse>(
      `/v1/departments/${id}/head?employeeId=${employeeId}&employeeName=${encodeURIComponent(employeeName)}&startDate=${startDate}`
    );
    return mapDepartment(response.data as unknown as DepartmentResponse);
  },

  /**
   * Supprimer un département (soft delete)
   */
  async deleteDepartment(id: string): Promise<void> {
    await api.delete(`/v1/departments/${id}`);
  },
};

export default departmentService;


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
  positionCount: number;
  createdAt: string;
  updatedAt: string;
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
  budget: 0, // Non disponible dans la réponse backend
  spent: 0,  // Non disponible dans la réponse backend
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
  }): Promise<{ data: Department[]; total: number; page: number; pageSize: number }> {
    const backendParams: Record<string, string | number | boolean | undefined> = {
      page: params?.page || 0,
      size: params?.pageSize || 100,
    };
    
    if (params?.active !== undefined) {
      backendParams.active = params.active;
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
   * Créer un nouveau département
   */
  async createDepartment(data: {
    name: string;
    code: string;
    description?: string;
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
  }): Promise<Department> {
    const response = await api.put<DepartmentResponse>(`/v1/departments/${id}`, data);
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


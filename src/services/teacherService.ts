// Teacher Service - Tornadoes Job Education Module
// Gestion des professeurs via l'API backend

import api from './api';
import type { Teacher } from '@/types';

// Types backend
interface TeacherResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  specialization: string;
  active: boolean;
  employeeId?: string;
  createdAt: string;
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
const mapTeacher = (response: TeacherResponse): Teacher => ({
  id: response.id,
  userId: response.employeeId || response.id,
  firstName: response.firstName,
  lastName: response.lastName,
  email: response.email,
  phone: response.phone,
  specialties: response.specialization ? [response.specialization] : [],
  // Note: hourlyRate n'est pas disponible dans la réponse backend
});

const teacherService = {
  /**
   * Récupérer la liste des professeurs
   */
  async getTeachers(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<{ data: Teacher[]; total: number; page: number; pageSize: number }> {
    const backendParams: Record<string, string | number | undefined> = {
      page: params?.page || 0,
      size: params?.pageSize || 20,
    };
    
    if (params?.search) {
      backendParams.search = params.search;
    }

    const response = await api.get<PageResponse<TeacherResponse>>('/v1/teachers', { params: backendParams });
    const pageData = response.data as unknown as PageResponse<TeacherResponse>;
    
    return {
      data: pageData.content.map(mapTeacher),
      total: pageData.totalElements,
      page: pageData.page,
      pageSize: pageData.size,
    };
  },

  /**
   * Récupérer un professeur par ID
   */
  async getTeacher(id: string): Promise<Teacher> {
    const response = await api.get<TeacherResponse>(`/v1/teachers/${id}`);
    return mapTeacher(response.data as unknown as TeacherResponse);
  },

  /**
   * Créer un nouveau professeur
   */
  async createTeacher(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    specialization: string;
  }): Promise<Teacher> {
    const response = await api.post<TeacherResponse>('/v1/teachers', data);
    return mapTeacher(response.data as unknown as TeacherResponse);
  },

  /**
   * Mettre à jour un professeur
   */
  async updateTeacher(id: string, data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    specialization?: string;
    active?: boolean;
  }): Promise<Teacher> {
    const response = await api.put<TeacherResponse>(`/v1/teachers/${id}`, data);
    return mapTeacher(response.data as unknown as TeacherResponse);
  },

  /**
   * Supprimer un professeur
   */
  async deleteTeacher(id: string): Promise<void> {
    await api.delete(`/v1/teachers/${id}`);
  },
};

export default teacherService;


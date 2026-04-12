// Teacher Salary Service - Education Module
// Gestion des salaires des professeurs

import api from './api';

// Types
interface TeacherSalaryResponse {
  id: string;
  reference: string;
  teacherId: string;
  teacherName: string;
  programId?: string;
  programTitle?: string;
  salaryType: 'MONTHLY' | 'HOURLY' | 'PER_COURSE' | 'BONUS';
  grossAmount: number;
  netAmount?: number;
  currency: string;
  periodStart: string;
  periodEnd: string;
  hoursWorked?: number;
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED';
  paidDate?: string;
  approvedBy?: string;
  description?: string;
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

const teacherSalaryService = {
  /**
   * Créer un salaire professeur
   */
  async create(data: {
    teacherId: string;
    programId?: string;
    salaryType: string;
    grossAmount: number;
    currency?: string;
    periodStart: string;
    periodEnd: string;
    hoursWorked?: number;
    description?: string;
  }): Promise<TeacherSalaryResponse> {
    const response = await api.post('/v1/teacher-salaries', {
      ...data,
      currency: data.currency || 'XOF',
    });
    return response.data.data;
  },

  /**
   * Approuver un salaire
   */
  async approve(id: string): Promise<TeacherSalaryResponse> {
    const response = await api.post(`/v1/teacher-salaries/${id}/approve`);
    return response.data.data;
  },

  /**
   * Marquer comme payé
   */
  async markAsPaid(id: string): Promise<TeacherSalaryResponse> {
    const response = await api.post(`/v1/teacher-salaries/${id}/mark-paid`);
    return response.data.data;
  },

  /**
   * Annuler un salaire
   */
  async cancel(id: string): Promise<void> {
    await api.post(`/v1/teacher-salaries/${id}/cancel`);
  },

  /**
   * Récupérer tous les salaires (paginé)
   */
  async getSalaries(params?: { page?: number; size?: number }): Promise<{ data: TeacherSalaryResponse[]; total: number }> {
    const response = await api.get('/v1/teacher-salaries', {
      params: { page: params?.page || 0, size: params?.size || 20 },
    });
    const pageData = response.data?.data?.content || response.data?.data || [];
    const total = response.data?.data?.totalElements || 0;
    return { data: Array.isArray(pageData) ? pageData : [], total };
  },

  /**
   * Récupérer un salaire par ID
   */
  async getSalary(id: string): Promise<TeacherSalaryResponse> {
    const response = await api.get(`/v1/teacher-salaries/${id}`);
    return response.data.data;
  },

  /**
   * Salaires par professeur
   */
  async getByTeacher(teacherId: string, params?: { page?: number; size?: number }): Promise<{ data: TeacherSalaryResponse[]; total: number }> {
    const response = await api.get(`/v1/teacher-salaries/teacher/${teacherId}`, {
      params: { page: params?.page || 0, size: params?.size || 20 },
    });
    const pageData = response.data?.data?.content || response.data?.data || [];
    const total = response.data?.data?.totalElements || 0;
    return { data: Array.isArray(pageData) ? pageData : [], total };
  },

  /**
   * Salaires par programme
   */
  async getByProgram(programId: string, params?: { page?: number; size?: number }): Promise<{ data: TeacherSalaryResponse[]; total: number }> {
    const response = await api.get(`/v1/teacher-salaries/program/${programId}`, {
      params: { page: params?.page || 0, size: params?.size || 20 },
    });
    const pageData = response.data?.data?.content || response.data?.data || [];
    const total = response.data?.data?.totalElements || 0;
    return { data: Array.isArray(pageData) ? pageData : [], total };
  },

  /**
   * Résumé global des salaires
   */
  async getSummary(): Promise<{ totalPaid: number; byStatus: Record<string, number> }> {
    const response = await api.get('/v1/teacher-salaries/summary');
    return response.data?.data || { totalPaid: 0, byStatus: {} };
  },
};

export default teacherSalaryService;
export type { TeacherSalaryResponse };

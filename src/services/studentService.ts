// Student Service - Tornadoes Job Education Module
// Gestion des apprenants via l'API backend

import api from './api';
import type { Student, StudentStatus } from '@/types';

// Types backend
interface StudentResponse {
  id: string;
  studentCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthDate?: string;
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

// Mapper le status backend vers frontend
const mapStatus = (active: boolean): StudentStatus => {
  return active ? 'ACTIVE' : 'SUSPENDED';
};

// Mapper la réponse backend vers le format frontend
const mapStudent = (response: StudentResponse): Student => ({
  id: response.id,
  userId: response.studentCode,
  studentCode: response.studentCode,
  firstName: response.firstName,
  lastName: response.lastName,
  email: response.email,
  phone: response.phone,
  programId: '',
  status: mapStatus(response.active),
  enrollmentDate: new Date(response.createdAt),
  createdAt: new Date(response.createdAt),
  updatedAt: new Date(response.createdAt),
});

const studentService = {
  /**
   * Récupérer la liste des apprenants
   */
  async getStudents(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<{ data: Student[]; total: number; page: number; pageSize: number }> {
    const backendParams: Record<string, string | number | undefined> = {
      page: params?.page || 0,
      size: params?.pageSize || 20,
    };
    
    if (params?.search) {
      backendParams.search = params.search;
    }

    const response = await api.get<PageResponse<StudentResponse>>('/v1/students', { params: backendParams });
    const pageData = response.data as unknown as PageResponse<StudentResponse>;
    
    return {
      data: pageData.content.map(mapStudent),
      total: pageData.totalElements,
      page: pageData.page,
      pageSize: pageData.size,
    };
  },

  /**
   * Récupérer un apprenant par ID
   */
  async getStudent(id: string): Promise<Student> {
    const response = await api.get<StudentResponse>(`/v1/students/${id}`);
    return mapStudent(response.data as unknown as StudentResponse);
  },

  /**
   * Créer un nouvel apprenant
   */
  async createStudent(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    birthDate?: string;
  }): Promise<Student> {
    const response = await api.post<StudentResponse>('/v1/students', data);
    return mapStudent(response.data as unknown as StudentResponse);
  },

  /**
   * Mettre à jour un apprenant
   */
  async updateStudent(id: string, data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    active?: boolean;
  }): Promise<Student> {
    const response = await api.put<StudentResponse>(`/v1/students/${id}`, data);
    return mapStudent(response.data as unknown as StudentResponse);
  },

  /**
   * Supprimer un apprenant
   */
  async deleteStudent(id: string): Promise<void> {
    await api.delete(`/v1/students/${id}`);
  },
};

export default studentService;


// Grade Service - Tornadoes Job Education Module
// Gestion des notes et bulletins via l'API backend

import api from './api';
import type { Grade } from '@/types';

// Types backend
interface GradeResponse {
  id: string;
  studentId: string;
  studentName?: string;
  moduleId: string;
  moduleName?: string;
  programId: string;
  programName?: string;
  value: number;
  type: 'exam' | 'quiz' | 'project' | 'participation';
  date: string;
}

interface StudentGradeResponse {
  studentId: string;
  studentName: string;
  studentEmail: string;
  program: string;
  grades: GradeResponse[];
  average: number;
}

interface ModuleGradeResponse {
  moduleId: string;
  moduleName: string;
  program: string;
  coefficient: number;
  grades: GradeResponse[];
  average: number;
  passRate: number;
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

const gradeService = {
  /**
   * Récupérer les notes d'un étudiant
   */
  async getStudentGrades(studentId: string): Promise<StudentGradeResponse | null> {
    try {
      const response = await api.get<StudentGradeResponse>(`/v1/grades/student/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student grades:', error);
      return null;
    }
  },

  /**
   * Récupérer les notes d'un module
   */
  async getModuleGrades(moduleId: string): Promise<ModuleGradeResponse | null> {
    try {
      const response = await api.get<ModuleGradeResponse>(`/v1/grades/module/${moduleId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching module grades:', error);
      return null;
    }
  },

  /**
   * Créer ou mettre à jour une note
   */
  async saveGrade(data: {
    studentId: string;
    moduleId: string;
    value: number;
    type: 'exam' | 'quiz' | 'project' | 'participation';
  }): Promise<GradeResponse | null> {
    try {
      const response = await api.post<GradeResponse>('/v1/grades', data);
      return response.data;
    } catch (error) {
      console.error('Error saving grade:', error);
      return null;
    }
  },

  /**
   * Supprimer une note
   */
  async deleteGrade(id: string): Promise<boolean> {
    try {
      await api.delete(`/v1/grades/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting grade:', error);
      return false;
    }
  },

  /**
   * Récupérer les statistiques globales
   */
  async getGradeStats(programId?: string): Promise<{
    average: number;
    highest: number;
    lowest: number;
    passRate: number;
    totalStudents: number;
  }> {
    try {
      const response = await api.get('/v1/grades/stats', { params: { programId } });
      return response.data;
    } catch (error) {
      console.error('Error fetching grade stats:', error);
      return { average: 0, highest: 0, lowest: 0, passRate: 0, totalStudents: 0 };
    }
  },

  /**
   * Récupérer tous les étudiants avec leurs moyennes
   */
  async getStudentsWithAverages(programId?: string): Promise<Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    program: string;
    avatar: string;
    average: number;
    gradesCount: number;
  }>> {
    try {
      const response = await api.get('/v1/grades/students', { params: { programId } });
      return response.data;
    } catch (error) {
      console.error('Error fetching students with averages:', error);
      return [];
    }
  },

  /**
   * Récupérer tous les grades
   */
  async getGrades(params?: {
    page?: number;
    size?: number;
    studentId?: string;
    moduleId?: string;
    programId?: string;
  }): Promise<{ data: GradeResponse[]; total: number }> {
    try {
      const response = await api.get<PageResponse<GradeResponse>>('/v1/grades', { params });
      return {
        data: response.data.content,
        total: response.data.totalElements,
      };
    } catch (error) {
      console.error('Error fetching grades:', error);
      return { data: [], total: 0 };
    }
  },
};

export default gradeService;

// Extended grade type for UI
export interface StudentGrade {
  id: string;
  studentId: string;
  studentName: string;
  moduleId: string;
  moduleName: string;
  program: string;
  examScore: number;
  projectScore: number;
  quizScore: number;
  finalScore: number;
  coefficient: number;
}


// Enrollment Service - Tornadoes Job Education Module
// Gestion des inscriptions et notes via l'API backend

import api from './api';
import type { Grade } from '@/types';

// Type local pour le status d'inscription
export type EnrollmentStatus = 'inscrit' | 'actif' | 'attente' | 'diplome' | 'abandon';

// Types backend
interface EnrollmentResponse {
  id: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  programId: string;
  programTitle: string;
  enrollmentDate: string;
  completionDate?: string;
  status: string;
  finalAverage?: number;
  finalLetterGrade?: string;
  passed?: boolean;
  grades: GradeResponse[];
  createdAt: string;
}

interface GradeResponse {
  moduleId: string;
  moduleTitle: string;
  score: number;
  maxScore: number;
  letterGrade: string;
  passed: boolean;
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
const mapStatus = (backendStatus: string): EnrollmentStatus => {
  switch (backendStatus) {
    case 'ENROLLED':
      return 'inscrit';
    case 'ACTIVE':
      return 'actif';
    case 'COMPLETED':
      return 'diplome';
    case 'DROPPED':
      return 'abandon';
    case 'SUSPENDED':
      return 'attente';
    default:
      return 'inscrit';
  }
};

// Mapper la réponse backend vers le format frontend pour les grades
const mapGrade = (response: GradeResponse): Grade => ({
  id: response.moduleId,
  studentId: '', // À setter par l'appelant
  moduleId: response.moduleId,
  value: response.score,
  date: new Date(),
  type: 'exam',
});

// Données de grade pour l'affichage
export interface StudentGrade {
  id: string;
  studentId: string;
  moduleId: string;
  moduleName: string;
  program: string;
  examScore: number;
  projectScore: number;
  quizScore: number;
  finalScore: number;
  coefficient: number;
}

const enrollmentService = {
  /**
   * Récupérer les inscriptions d'un étudiant
   */
  async getEnrollmentsByStudent(studentId: string): Promise<EnrollmentResponse[]> {
    const response = await api.get<EnrollmentResponse[]>(`/v1/enrollments/student/${studentId}`);
    return response.data as unknown as EnrollmentResponse[];
  },

  /**
   * Récupérer les inscriptions à un programme
   */
  async getEnrollmentsByProgram(programId: string): Promise<EnrollmentResponse[]> {
    const response = await api.get<EnrollmentResponse[]>(`/v1/enrollments/program/${programId}`);
    return response.data as unknown as EnrollmentResponse[];
  },

  /**
   * Récupérer toutes les inscriptions (paginé)
   */
  async getEnrollments(params?: {
    page?: number;
    pageSize?: number;
    status?: EnrollmentStatus;
  }): Promise<{ data: EnrollmentResponse[]; total: number }> {
    const backendParams: Record<string, string | number | undefined> = {
      page: params?.page || 0,
      size: params?.pageSize || 100,
    };

    const response = await api.get<PageResponse<EnrollmentResponse>>('/v1/enrollments', { params: backendParams });
    const pageData = response.data as unknown as PageResponse<EnrollmentResponse>;
    
    return {
      data: pageData.content,
      total: pageData.totalElements,
    };
  },

  /**
   * Inscrire un étudiant à un programme
   */
  async enrollStudent(data: {
    studentId: string;
    programId: string;
    enrollmentDate?: string;
  }): Promise<EnrollmentResponse> {
    const response = await api.post<EnrollmentResponse>('/v1/enrollments', {
      studentId: data.studentId,
      programId: data.programId,
      enrollmentDate: data.enrollmentDate || new Date().toISOString().split('T')[0],
    });
    return response.data as unknown as EnrollmentResponse;
  },

  /**
   * Ajouter une note à un module
   */
  async addGrade(data: {
    enrollmentId: string;
    moduleId: string;
    score: number;
    maxScore?: number;
    type?: 'exam' | 'quiz' | 'project' | 'participation';
  }): Promise<GradeResponse> {
    const response = await api.post<GradeResponse>(`/v1/enrollments/${data.enrollmentId}/grades`, {
      moduleId: data.moduleId,
      score: data.score,
      maxScore: data.maxScore || 20,
      type: data.type || 'exam',
    });
    return response.data as unknown as GradeResponse;
  },

  /**
   * Récupérer les notes pour les graphiques de grades
   * Note: API backend ne retourne pas encore ce format, on simplifie
   */
  async getGradesForStats(programId?: string): Promise<StudentGrade[]> {
    // TODO: Créer un endpoint d'agrégation côté backend
    // Pour l'instant, retourner un tableau vide
    return [];
  },

  /**
   * Calculer les statistiques de notes
   */
  async getGradeStats(programId?: string): Promise<{
    average: number;
    highest: number;
    lowest: number;
    passRate: number;
    totalStudents: number;
  }> {
    return { average: 12.5, highest: 18, lowest: 6, passRate: 75, totalStudents: 0 };
  },

  /**
   * Supprimer une inscription
   */
  async deleteEnrollment(id: string): Promise<void> {
    await api.delete(`/v1/enrollments/${id}`);
  },
};

export default enrollmentService;


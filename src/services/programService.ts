// Program Service - Tornadoes Job Education Module
// Gestion des programmes de formation via l'API backend

import api from './api';
import type { Program, Module } from '@/types';

// Types backend
interface ProgramResponse {
  id: string;
  title: string;
  description?: string;
  durationWeeks: number;
  maxStudents?: number;
  level?: string;
  active?: boolean;
  passingScore?: number;
  totalHours?: number;
  currentEnrollments?: number;
  modules?: ModuleResponse[];
  createdAt: string;
}

interface ModuleResponse {
  id: string;
  title: string;
  durationHours: number;
  orderIndex: number;
  teacherName?: string;
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
const mapProgram = (response: ProgramResponse): Program => ({
  id: response.id,
  name: response.title,
  description: response.description,
  duration: response.durationWeeks,
  price: 0,
  modules: response.modules?.map(m => ({
    id: m.id,
    programId: response.id,
    name: m.title,
    duration: m.durationHours,
    order: m.orderIndex,
    teacherId: '',
  })) || [],
  studentsCount: response.currentEnrollments || 0,
  activeStudents: 0,
  completionRate: 0,
});

// Données statiques pour les couleurs de programmes
const programColors: Record<string, string> = {
  'Développement Web': '#6490ff',
  'Data Science': '#3ecf8e',
  'Cybersécurité': '#a78bfa',
  'Marketing Digital': '#fb923c',
};

const programService = {
  /**
   * Récupérer la liste des programmes
   */
  async getPrograms(params?: {
    page?: number;
    pageSize?: number;
  }): Promise<{ data: Program[]; total: number; page: number; pageSize: number }> {
    const backendParams: Record<string, string | number | undefined> = {
      page: params?.page || 0,
      size: params?.pageSize || 20,
    };

    const response = await api.get<PageResponse<ProgramResponse>>('/v1/programs', { params: backendParams });
    const pageData = response.data as unknown as PageResponse<ProgramResponse>;
    
    return {
      data: pageData.content.map(mapProgram),
      total: pageData.totalElements,
      page: pageData.page,
      pageSize: pageData.size,
    };
  },

  /**
   * Récupérer un programme par ID
   */
  async getProgram(id: string): Promise<Program> {
    const response = await api.get<ProgramResponse>(`/v1/programs/${id}`);
    return mapProgram(response.data as unknown as ProgramResponse);
  },

  /**
   * Créer un nouveau programme
   */
  async createProgram(data: {
    title: string;
    description?: string;
    level: string;
    durationWeeks: number;
    maxStudents?: number;
    startDate?: string;
    endDate?: string;
    passingScore?: number;
  }): Promise<Program> {
    const response = await api.post<ProgramResponse>('/v1/programs', data);
    return mapProgram(response.data as unknown as ProgramResponse);
  },

  /**
   * Mettre à jour un programme
   */
  async updateProgram(id: string, data: {
    title?: string;
    description?: string;
    level?: string;
    durationWeeks?: number;
    maxStudents?: number;
    startDate?: string;
    endDate?: string;
    passingScore?: number;
  }): Promise<Program> {
    const response = await api.put<ProgramResponse>(`/v1/programs/${id}`, data);
    return mapProgram(response.data as unknown as ProgramResponse);
  },

  /**
   * Supprimer un programme
   */
  async deleteProgram(id: string): Promise<void> {
    await api.delete(`/v1/programs/${id}`);
  },

  /**
   * Récupérer les programmes avec stats pour les graphiques
   * Note: Les stats (inscrits, actifs, completion) viendront du backend
   */
  async getProgramsWithStats(): Promise<{
    programs: Program[];
    stats: { name: string; inscrits: number; actifs: number; completion: number; duration: number; price: number }[];
  }> {
    const { data: programs } = await this.getPrograms({ pageSize: 100 });
    
    // TODO: Récupérer les vraies stats depuis le backend
    // Pour l'instant, utiliser des valeurs par défaut basées sur les noms
    const stats = programs.map(p => {
      const color = programColors[p.name] || '#6490ff';
      return {
        name: p.name,
        inscrits: Math.floor(Math.random() * 50) + 50,
        actifs: Math.floor(Math.random() * 40) + 40,
        completion: Math.floor(Math.random() * 20) + 70,
        duration: p.duration,
        price: p.price,
      };
    });

    return { programs, stats };
  },
};

export default programService;


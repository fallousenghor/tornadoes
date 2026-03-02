// Project Service - Tornadoes Job
// Gestion des projets via l'API backend

import api from './api';
import type { Project, ProjectStatus, ProjectPriority } from '@/types';

// Types backend (à ajuster selon la réponse réelle du backend)
interface ProjectResponse {
  id: string;
  name: string;
  description?: string;
  status: string;
  priority: string;
  progress: number;
  startDate: string;
  deadline: string;
  managerId: string;
  memberIds: string[];
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
const mapStatus = (backendStatus: string): ProjectStatus => {
  switch (backendStatus) {
    case 'NOT_STARTED':
      return 'demarrage';
    case 'IN_PROGRESS':
      return 'en_cours';
    case 'COMPLETED':
      return 'termine';
    case 'ON_HOLD':
      return 'en_cours';
    default:
      return 'demarrage';
  }
};

// Mapper le status frontend vers backend
const mapStatusToBackend = (frontendStatus: ProjectStatus): string => {
  switch (frontendStatus) {
    case 'demarrage':
      return 'NOT_STARTED';
    case 'en_cours':
      return 'IN_PROGRESS';
    case 'finalisation':
      return 'COMPLETED';
    case 'termine':
      return 'COMPLETED';
    default:
      return 'NOT_STARTED';
  }
};

// Mapper la priorité backend vers frontend
const mapPriority = (backendPriority: string): ProjectPriority => {
  switch (backendPriority) {
    case 'LOW':
      return 'basse';
    case 'MEDIUM':
      return 'moyenne';
    case 'HIGH':
      return 'haute';
    case 'CRITICAL':
      return 'critique';
    default:
      return 'moyenne';
  }
};

// Mapper la réponse backend vers le format frontend
const mapProject = (response: ProjectResponse): Project => ({
  id: response.id,
  name: response.name,
  description: response.description,
  status: mapStatus(response.status),
  priority: mapPriority(response.priority),
  progress: response.progress,
  startDate: new Date(response.startDate),
  deadline: new Date(response.deadline),
  managerId: response.managerId,
  members: response.memberIds || [],
});

const projectService = {
  /**
   * Récupérer la liste des projets
   */
  async getProjects(params?: {
    page?: number;
    pageSize?: number;
    status?: ProjectStatus;
  }): Promise<{ data: Project[]; total: number; page: number; pageSize: number }> {
    const backendParams: Record<string, string | number | undefined> = {
      page: params?.page || 0,
      size: params?.pageSize || 20,
    };
    
    if (params?.status) {
      backendParams.status = mapStatusToBackend(params.status);
    }

    const response = await api.get<PageResponse<ProjectResponse>>('/v1/projects', { params: backendParams });
    const pageData = response.data as unknown as PageResponse<ProjectResponse>;
    
    return {
      data: pageData.content.map(mapProject),
      total: pageData.totalElements,
      page: pageData.page,
      pageSize: pageData.size,
    };
  },

  /**
   * Récupérer un projet par ID
   */
  async getProject(id: string): Promise<Project> {
    const response = await api.get<ProjectResponse>(`/v1/projects/${id}`);
    return mapProject(response.data as unknown as ProjectResponse);
  },

  /**
   * Créer un nouveau projet
   */
  async createProject(data: {
    name: string;
    description?: string;
    priority: ProjectPriority;
    startDate: string;
    deadline: string;
    managerId: string;
    memberIds?: string[];
  }): Promise<Project> {
    const response = await api.post<ProjectResponse>('/v1/projects', {
      name: data.name,
      description: data.description,
      priority: data.priority.toUpperCase(),
      startDate: data.startDate,
      deadline: data.deadline,
      managerId: data.managerId,
      memberIds: data.memberIds,
    });
    return mapProject(response.data as unknown as ProjectResponse);
  },

  /**
   * Mettre à jour un projet
   */
  async updateProject(id: string, data: {
    name?: string;
    description?: string;
    status?: ProjectStatus;
    priority?: ProjectPriority;
    progress?: number;
    deadline?: string;
  }): Promise<Project> {
    const backendData: Record<string, unknown> = {};
    if (data.name) backendData.name = data.name;
    if (data.description) backendData.description = data.description;
    if (data.status) backendData.status = mapStatusToBackend(data.status);
    if (data.priority) backendData.priority = data.priority.toUpperCase();
    if (data.progress !== undefined) backendData.progress = data.progress;
    if (data.deadline) backendData.deadline = data.deadline;

    const response = await api.put<ProjectResponse>(`/v1/projects/${id}`, backendData);
    return mapProject(response.data as unknown as ProjectResponse);
  },
};

export default projectService;


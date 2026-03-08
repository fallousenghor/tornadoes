// Leave Service - Tornadoes Job RH Module
// Gestion des demandes de congés via l'API backend

import api from './api';
import type { LeaveRequest, LeaveStatus, LeaveType } from '@/types';

// Types backend (après désencapsulation par l'intercepteur)
interface LeaveResponse {
  id: string;
  employeeId: string;
  employeeName?: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

// Page response wrapper from backend
interface PageResponse<T> {
  content: T[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
}

// Types pour les statistiques
interface LeaveStatsResponse {
  ANNUAL: number;
  SICK: number;
  MATERNITY: number;
  UNPAID: number;
  EXCEPTIONAL: number;
}

// Type pour les soldes par employé
interface LeaveBalance {
  employeeId: string;
  employeeName: string;
  department: string;
  annuel: { total: number; used: number; remaining: number };
  maladie: { total: number; used: number; remaining: number };
  maternite: { total: number; used: number; remaining: number };
  sans_solde: { total: number; used: number; remaining: number };
  exceptionnel: { total: number; used: number; remaining: number };
}

// Mapper le type de congés backend vers frontend
const mapLeaveType = (backendType: string): LeaveType => {
  switch (backendType) {
    case 'ANNUAL':
      return 'annuel';
    case 'SICK':
      return 'maladie';
    case 'MATERNITY':
      return 'maternite';
    case 'UNPAID':
      return 'sans_solde';
    case 'EXCEPTIONAL':
      return 'exceptionnel';
    default:
      return 'annuel';
  }
};

// Mapper le type frontend vers backend
const mapLeaveTypeToBackend = (frontendType: LeaveType): string => {
  switch (frontendType) {
    case 'annuel':
      return 'ANNUAL';
    case 'maladie':
      return 'SICK';
    case 'maternite':
      return 'MATERNITY';
    case 'sans_solde':
      return 'UNPAID';
    case 'exceptionnel':
      return 'EXCEPTIONAL';
    default:
      return 'ANNUAL';
  }
};

// Mapper le status backend vers frontend
const mapStatus = (backendStatus: string): LeaveStatus => {
  switch (backendStatus) {
    case 'PENDING':
      return 'pending';
    case 'APPROVED':
      return 'approved';
    case 'REJECTED':
      return 'rejected';
    case 'CANCELLED':
      return 'cancelled';
    default:
      return 'pending';
  }
};

// Mapper la réponse backend vers le format frontend
const mapLeave = (response: LeaveResponse): LeaveRequest => ({
  id: response.id,
  employeeId: response.employeeId,
  type: mapLeaveType(response.leaveType),
  startDate: new Date(response.startDate),
  endDate: new Date(response.endDate),
  days: response.days,
  reason: response.reason,
  status: mapStatus(response.status),
  approvedBy: response.approvedBy,
  approvedAt: response.approvedAt ? new Date(response.approvedAt) : undefined,
});

// Helper to safely extract content from a PageResponse or raw array
const extractContent = <T>(data: unknown): T[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data as T[];
  const page = data as PageResponse<T>;
  if (page && Array.isArray(page.content)) return page.content;
  return [];
};

const leaveService = {
  /**
   * Récupérer toutes les demandes de congés
   * Note: l'intercepteur api.ts désencapsule déjà ApiResponse → response.data est directement la donnée.
   */
  async getAllLeaves(params?: {
    page?: number;
    pageSize?: number;
    status?: LeaveStatus;
  }): Promise<{ data: LeaveRequest[]; total: number; page: number; pageSize: number }> {
    const backendParams: Record<string, string | number | undefined> = {
      page: params?.page || 0,
      size: params?.pageSize || 50,
    };

    if (params?.status) {
      backendParams.status = params.status.toUpperCase();
    }

    const response = await api.get<PageResponse<LeaveResponse>>(
      '/v1/leave-requests',
      { params: backendParams }
    );
    // Interceptor already unwrapped ApiResponse — response.data is PageResponse directly
    const pageData = response.data as unknown as PageResponse<LeaveResponse>;
    const content = extractContent<LeaveResponse>(pageData);

    return {
      data: content.map(mapLeave),
      total: pageData?.totalElements || content.length,
      page: pageData?.page || 0,
      pageSize: pageData?.size || 50,
    };
  },

  /**
   * Récupérer les demandes de congés en attente
   */
  async getPendingLeaves(): Promise<LeaveRequest[]> {
    const response = await api.get<PageResponse<LeaveResponse>>('/v1/leave-requests/pending');
    const pageData = response.data as unknown as PageResponse<LeaveResponse>;
    const content = extractContent<LeaveResponse>(pageData);
    return content.map(mapLeave);
  },

  /**
   * Récupérer les demandes de congés d'un employé
   */
  async getLeavesByEmployee(employeeId: string): Promise<LeaveRequest[]> {
    const response = await api.get<PageResponse<LeaveResponse>>(
      `/v1/leave-requests/employee/${employeeId}`
    );
    const pageData = response.data as unknown as PageResponse<LeaveResponse>;
    const content = extractContent<LeaveResponse>(pageData);
    return content.map(mapLeave);
  },

  /**
   * Soumettre une demande de congés
   */
  async createLeave(data: {
    employeeId: string;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
  }): Promise<LeaveRequest> {
    const response = await api.post<LeaveResponse>(
      `/v1/leave-requests/employee/${data.employeeId}`,
      {
        leaveType: mapLeaveTypeToBackend(data.leaveType),
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
      }
    );
    return mapLeave(response.data as unknown as LeaveResponse);
  },

  /**
   * Approuver une demande de congés
   */
  async approveLeave(id: string): Promise<LeaveRequest> {
    const response = await api.post<LeaveResponse>(`/v1/leave-requests/${id}/approve`);
    return mapLeave(response.data as unknown as LeaveResponse);
  },

  /**
   * Rejeter une demande de congés
   * Backend requiert reason en tant que @RequestParam → doit être passé en query param.
   */
  async rejectLeave(id: string, reason: string = 'Rejeté par le manager'): Promise<LeaveRequest> {
    const response = await api.post<LeaveResponse>(
      `/v1/leave-requests/${id}/reject`,
      null,
      { params: { reason } }
    );
    return mapLeave(response.data as unknown as LeaveResponse);
  },

  /**
   * Récupérer les statistiques de congés par type
   */
  async getLeaveStats(): Promise<LeaveStatsResponse> {
    // Interceptor already unwraps ApiResponse → response.data is the Map directly
    const response = await api.get<LeaveStatsResponse>('/v1/leave-requests/stats/by-type');
    return response.data as LeaveStatsResponse;
  },

  /**
   * Récupérer les soldes de congés par employé
   */
  async getLeaveBalances(): Promise<LeaveBalance[]> {
    // Interceptor already unwraps ApiResponse → response.data is the array directly
    const response = await api.get<LeaveBalance[]>('/v1/leave-requests/balances');
    return response.data || [];
  },
};

export default leaveService;

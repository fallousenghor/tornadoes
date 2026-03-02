// Leave Service - Tornadoes Job RH Module
// Gestion des demandes de congés via l'API backend

import api from './api';
import type { LeaveRequest, LeaveStatus, LeaveType } from '@/types';

// Types backend
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

const leaveService = {
  /**
   * Récupérer toutes les demandes de congés
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

    const response = await api.get<{ content: LeaveResponse[]; totalElements: number; page: number; size: number }>('/v1/leave-requests', { params: backendParams });
    const data = response.data as unknown as { content: LeaveResponse[]; totalElements: number; page: number; size: number };
    
    return {
      data: data.content.map(mapLeave),
      total: data.totalElements,
      page: data.page,
      pageSize: data.size,
    };
  },

  /**
   * Récupérer les demandes de congés en attente
   */
  async getPendingLeaves(): Promise<LeaveRequest[]> {
    const response = await api.get<LeaveResponse[]>('/v1/leave-requests/pending');
    const data = response.data as unknown as LeaveResponse[];
    return data.map(mapLeave);
  },

  /**
   * Récupérer les demandes de congés d'un employé
   */
  async getLeavesByEmployee(employeeId: string): Promise<LeaveRequest[]> {
    const response = await api.get<LeaveResponse[]>(`/v1/leave-requests/employee/${employeeId}`);
    const data = response.data as unknown as LeaveResponse[];
    return data.map(mapLeave);
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
    const response = await api.post<LeaveResponse>(`/v1/leave-requests/employee/${data.employeeId}`, {
      leaveType: mapLeaveTypeToBackend(data.leaveType),
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
    });
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
   */
  async rejectLeave(id: string): Promise<LeaveRequest> {
    const response = await api.post<LeaveResponse>(`/v1/leave-requests/${id}/reject`);
    return mapLeave(response.data as unknown as LeaveResponse);
  },

  /**
   * Récupérer les statistiques de congés par type
   * Pour le graphique de répartition des congés
   */
  async getLeaveStats(): Promise<LeaveStatsResponse> {
    const response = await api.get<LeaveStatsResponse>('/v1/leave-requests/stats/by-type');
    return response.data;
  },

  /**
   * Récupérer les soldes de congés par employé
   * Pour le tableau des soldes par employé
   */
  async getLeaveBalances(): Promise<LeaveBalance[]> {
    const response = await api.get<LeaveBalance[]>('/v1/leave-requests/balances');
    return response.data;
  },
};

export default leaveService;


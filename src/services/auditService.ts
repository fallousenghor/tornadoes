// Audit Service - Tornadoes Job System Module
// Gestion des logs d'audit via l'API backend

import api from './api';

// Types backend
interface AuditLogResponse {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'error';
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

interface AuditStatsResponse {
  totalLogs: number;
  todayLogs: number;
  errors: number;
  warnings: number;
}

const auditService = {
  /**
   * Récupérer les logs d'audit
   */
  async getAuditLogs(params?: {
    page?: number;
    size?: number;
    module?: string;
    action?: string;
    status?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ data: AuditLogResponse[]; total: number; page: number }> {
    try {
      const response = await api.get<PageResponse<AuditLogResponse>>('/v1/audit-logs', { params });
      return {
        data: response.data.content,
        total: response.data.totalElements,
        page: response.data.page,
      };
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      return { data: [], total: 0, page: 0 };
    }
  },

  /**
   * Récupérer un log par ID
   */
  async getAuditLog(id: string): Promise<AuditLogResponse | null> {
    try {
      const response = await api.get<AuditLogResponse>(`/v1/audit-logs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching audit log:', error);
      return null;
    }
  },

  /**
   * Récupérer les statistiques d'audit
   */
  async getAuditStats(): Promise<AuditStatsResponse> {
    try {
      const response = await api.get<AuditStatsResponse>('/v1/audit-logs/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching audit stats:', error);
      return { totalLogs: 0, todayLogs: 0, errors: 0, warnings: 0 };
    }
  },

  /**
   * Exporter les logs
   */
  async exportAuditLogs(params?: {
    format?: 'csv' | 'excel' | 'json';
    module?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Blob | null> {
    try {
      const response = await api.get('/v1/audit-logs/export', {
        params,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting audit logs:', error);
      return null;
    }
  },

  /**
   * Purger les anciens logs
   */
  async purgeOldLogs(beforeDate: string): Promise<boolean> {
    try {
      await api.delete('/v1/audit-logs', { params: { beforeDate } });
      return true;
    } catch (error) {
      console.error('Error purging audit logs:', error);
      return false;
    }
  },
};

export default auditService;


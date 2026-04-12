import api from './api';
import { Deal, DealStage, DealFilters } from '../types';

const BASE_URL = '/v1/deals';

export const dealService = {
  // Récupérer tous les deals
  getAll: async (filters?: DealFilters): Promise<Deal[]> => {
    const params = new URLSearchParams();
    if (filters?.stage) params.append('stage', filters.stage);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.ownerId) params.append('ownerId', filters.ownerId);

    const response = await api.get(`${BASE_URL}?${params.toString()}`);
    // Handle ApiResponse wrapper
    const data = response.data;
    if (data && typeof data === 'object' && 'data' in data) {
      const pageData = data.data;
      return pageData?.content || pageData || [];
    }
    return Array.isArray(data) ? data : [];
  },

  // Récupérer un deal par ID
  getById: async (id: string): Promise<Deal> => {
    const response = await api.get(`${BASE_URL}/${id}`);
    const data = response.data;
    if (data && typeof data === 'object' && 'data' in data) {
      return data.data;
    }
    return data;
  },

  // Créer un deal
  create: async (data: Partial<Deal>): Promise<Deal> => {
    const response = await api.post(BASE_URL, data);
    const resData = response.data;
    if (resData && typeof resData === 'object' && 'data' in resData) {
      return resData.data;
    }
    return resData;
  },

  // Mettre à jour un deal
  update: async (id: string, data: Partial<Deal>): Promise<Deal> => {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    const resData = response.data;
    if (resData && typeof resData === 'object' && 'data' in resData) {
      return resData.data;
    }
    return resData;
  },

  // Supprimer un deal
  delete: async (id: string): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },

  // Mettre à jour le stage d'un deal
  updateStage: async (id: string, stage: DealStage): Promise<Deal> => {
    const response = await api.patch(`${BASE_URL}/${id}/stage`, { stage });
    const resData = response.data;
    if (resData && typeof resData === 'object' && 'data' in resData) {
      return resData.data;
    }
    return resData;
  },

  // Avancer le stage d'un deal
  advanceStage: async (id: string): Promise<Deal> => {
    const response = await api.post(`${BASE_URL}/${id}/advance`);
    const resData = response.data;
    if (resData && typeof resData === 'object' && 'data' in resData) {
      return resData.data;
    }
    return resData;
  },

  // Marquer un deal comme gagné
  markAsWon: async (id: string): Promise<Deal> => {
    const response = await api.post(`${BASE_URL}/${id}/mark-won`);
    const resData = response.data;
    if (resData && typeof resData === 'object' && 'data' in resData) {
      return resData.data;
    }
    return resData;
  },

  // Marquer un deal comme perdu
  markAsLost: async (id: string, reason?: string): Promise<Deal> => {
    const response = await api.post(`${BASE_URL}/${id}/mark-lost`, { reason });
    const resData = response.data;
    if (resData && typeof resData === 'object' && 'data' in resData) {
      return resData.data;
    }
    return resData;
  },

  // Récupérer le pipeline (grouped by stage)
  getPipeline: async (): Promise<any> => {
    const response = await api.get(`${BASE_URL}/pipeline`);
    const resData = response.data;
    if (resData && typeof resData === 'object' && 'data' in resData) {
      return resData.data;
    }
    return resData;
  },
};

export default dealService;

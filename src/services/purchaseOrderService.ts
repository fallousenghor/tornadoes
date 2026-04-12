import api from './api';
import { PurchaseOrder, PurchaseOrderFilters } from '../types';

const BASE_URL = '/v1/purchase-orders';

// Helper to unwrap ApiResponse<T>
const unwrapData = <T>(response: any): T => {
  const data = response.data;
  if (data && typeof data === 'object' && 'data' in data) {
    const inner = data.data;
    // Handle PageResponse
    if (inner && typeof inner === 'object' && 'content' in inner) {
      return inner.content as T;
    }
    return inner as T;
  }
  return data as T;
};

export const purchaseOrderService = {
  getAll: async (filters?: PurchaseOrderFilters): Promise<PurchaseOrder[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.supplierId) params.append('supplierId', filters.supplierId);
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get(`${BASE_URL}?${params.toString()}`);
    const result = unwrapData<PurchaseOrder[]>(response);
    return Array.isArray(result) ? result : [];
  },

  getById: async (id: string): Promise<PurchaseOrder> => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return unwrapData<PurchaseOrder>(response);
  },

  create: async (data: Partial<PurchaseOrder>): Promise<PurchaseOrder> => {
    const response = await api.post(BASE_URL, data);
    return unwrapData<PurchaseOrder>(response);
  },

  update: async (id: string, data: Partial<PurchaseOrder>): Promise<PurchaseOrder> => {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return unwrapData<PurchaseOrder>(response);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },

  approve: async (id: string): Promise<PurchaseOrder> => {
    const response = await api.post(`${BASE_URL}/${id}/approve`);
    return unwrapData<PurchaseOrder>(response);
  },

  receive: async (id: string): Promise<PurchaseOrder> => {
    const response = await api.post(`${BASE_URL}/${id}/deliver`);
    return unwrapData<PurchaseOrder>(response);
  },

  getStats: async (): Promise<any> => {
    const response = await api.get(`${BASE_URL}/stats`);
    return unwrapData<any>(response);
  },
};

export default purchaseOrderService;

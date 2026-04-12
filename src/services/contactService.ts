import api from './api';
import { Contact, ContactType, ContactFilters } from '../types';

const BASE_URL = '/v1/contacts';

// Helper to unwrap ApiResponse<T> or PageResponse
const unwrapData = <T>(response: any): T => {
  const data = response.data;
  console.log('API raw response.data:', data);
  
  // Case 1: ApiResponse<PageResponse<T>> - has nested structure
  if (data && typeof data === 'object' && 'data' in data) {
    const inner = data.data;
    console.log('Unwrapped inner data:', inner);
    
    // Handle PageResponse<T>
    if (inner && typeof inner === 'object' && 'content' in inner) {
      console.log('Returning content array:', inner.content);
      return inner.content as T;
    }
    return inner as T;
  }
  
  // Case 2: PageResponse<T> directly (content array at root)
  if (data && typeof data === 'object' && 'content' in data) {
    console.log('Returning content array (direct):', data.content);
    return data.content as T;
  }
  
  // Case 3: Array directly
  if (Array.isArray(data)) {
    console.log('Returning array directly:', data);
    return data as T;
  }
  
  // Case 4: Single object
  console.log('Returning data as-is:', data);
  return data as T;
};

export const contactService = {
  getAll: async (filters?: ContactFilters): Promise<Contact[]> => {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get(`${BASE_URL}?${params.toString()}`);
    const result = unwrapData<Contact[]>(response);
    return Array.isArray(result) ? result : [];
  },

  getById: async (id: string): Promise<Contact> => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return unwrapData<Contact>(response);
  },

  create: async (data: Partial<Contact>): Promise<Contact> => {
    const response = await api.post(BASE_URL, data);
    return unwrapData<Contact>(response);
  },

  update: async (id: string, data: Partial<Contact>): Promise<Contact> => {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return unwrapData<Contact>(response);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },

  getStats: async (): Promise<any> => {
    const response = await api.get(`${BASE_URL}/stats`);
    return unwrapData<any>(response);
  },
};

export default contactService;

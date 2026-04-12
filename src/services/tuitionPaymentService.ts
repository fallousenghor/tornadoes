// Tuition Payment Service - Education Module
// Gestion des paiements de formation des apprenants

import api from './api';

// Types
interface TuitionPaymentResponse {
  id: string;
  reference: string;
  enrollmentId: string;
  studentName: string;
  programTitle: string;
  paymentType: 'REGISTRATION' | 'MONTHLY' | 'INSTALLMENT' | 'FULL_PAYMENT' | 'REFUND';
  amount: number;
  currency: string;
  dueDate: string;
  paidDate?: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  description?: string;
  receiptNumber?: string;
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

const tuitionPaymentService = {
  /**
   * Créer un paiement de formation
   */
  async create(data: {
    enrollmentId: string;
    paymentType: string;
    amount: number;
    currency?: string;
    dueDate: string;
    description?: string;
  }): Promise<TuitionPaymentResponse> {
    const response = await api.post('/v1/tuition-payments', {
      ...data,
      currency: data.currency || 'XOF',
    });
    return response.data.data;
  },

  /**
   * Confirmer un paiement
   */
  async confirm(id: string, receiptNumber: string, notes?: string): Promise<TuitionPaymentResponse> {
    const response = await api.post(`/v1/tuition-payments/${id}/confirm`, { receiptNumber, notes });
    return response.data.data;
  },

  /**
   * Annuler un paiement
   */
  async cancel(id: string): Promise<void> {
    await api.post(`/v1/tuition-payments/${id}/cancel`);
  },

  /**
   * Récupérer tous les paiements (paginé)
   */
  async getPayments(params?: { page?: number; size?: number }): Promise<{ data: TuitionPaymentResponse[]; total: number }> {
    const response = await api.get('/v1/tuition-payments', {
      params: { page: params?.page || 0, size: params?.size || 20 },
    });
    const pageData = response.data?.data?.content || response.data?.data || [];
    const total = response.data?.data?.totalElements || 0;
    return { data: Array.isArray(pageData) ? pageData : [], total };
  },

  /**
   * Récupérer un paiement par ID
   */
  async getPayment(id: string): Promise<TuitionPaymentResponse> {
    const response = await api.get(`/v1/tuition-payments/${id}`);
    return response.data.data;
  },

  /**
   * Paiements par inscription
   */
  async getByEnrollment(enrollmentId: string, params?: { page?: number; size?: number }): Promise<{ data: TuitionPaymentResponse[]; total: number }> {
    const response = await api.get(`/v1/tuition-payments/enrollment/${enrollmentId}`, {
      params: { page: params?.page || 0, size: params?.size || 20 },
    });
    const pageData = response.data?.data?.content || response.data?.data || [];
    const total = response.data?.data?.totalElements || 0;
    return { data: Array.isArray(pageData) ? pageData : [], total };
  },

  /**
   * Paiements par étudiant
   */
  async getByStudent(studentId: string, params?: { page?: number; size?: number }): Promise<{ data: TuitionPaymentResponse[]; total: number }> {
    const response = await api.get(`/v1/tuition-payments/student/${studentId}`, {
      params: { page: params?.page || 0, size: params?.size || 20 },
    });
    const pageData = response.data?.data?.content || response.data?.data || [];
    const total = response.data?.data?.totalElements || 0;
    return { data: Array.isArray(pageData) ? pageData : [], total };
  },

  /**
   * Paiements par programme
   */
  async getByProgram(programId: string, params?: { page?: number; size?: number }): Promise<{ data: TuitionPaymentResponse[]; total: number }> {
    const response = await api.get(`/v1/tuition-payments/program/${programId}`, {
      params: { page: params?.page || 0, size: params?.size || 20 },
    });
    const pageData = response.data?.data?.content || response.data?.data || [];
    const total = response.data?.data?.totalElements || 0;
    return { data: Array.isArray(pageData) ? pageData : [], total };
  },

  /**
   * Résumé des paiements pour un programme
   */
  async getProgramSummary(programId: string): Promise<{ totalPaid: number; byStatus: Record<string, number> }> {
    const response = await api.get(`/v1/tuition-payments/program/${programId}/summary`);
    return response.data?.data || { totalPaid: 0, byStatus: {} };
  },
};

export default tuitionPaymentService;
export type { TuitionPaymentResponse };

// Expense Service - Tornadoes Job Finance Module
// Gestion des dépenses via l'API backend

import api from './api';
import type { Expense, ExpenseStatus } from '@/types';

// Types backend
interface ExpenseResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  amount: string | number;
  currency: string;
  expenseDate: string;
  status: string;
  submittedByName: string;
  approvedByName?: string;
  departmentId?: string;
  receiptReference?: string;
  createdAt: string;
}

interface ExpenseSummaryResponse {
  totalPending: string | number;
  totalApproved: string | number;
  totalPaid: string | number;
  totalRejected: string | number;
  totalAmount: string | number;
  pendingCount: number;
  approvedCount: number;
  paidCount: number;
  rejectedCount: number;
  totalCount: number;
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
const mapStatus = (backendStatus: string): ExpenseStatus => {
  switch (backendStatus) {
    case 'PENDING':
      return 'en_attente';
    case 'APPROVED':
      return 'approuve';
    case 'PAID':
      return 'paye';
    case 'REJECTED':
      return 'rejete';
    default:
      return 'en_attente';
  }
};

// Mapper le status frontend vers backend
const mapStatusToBackend = (frontendStatus: ExpenseStatus): string => {
  switch (frontendStatus) {
    case 'en_attente':
      return 'PENDING';
    case 'approuve':
      return 'APPROVED';
    case 'paye':
      return 'PAID';
    case 'rejete':
      return 'REJECTED';
    default:
      return 'PENDING';
  }
};

// Mapper la catégorie
const mapCategoryToFrontend = (backendCategory: string): string => {
  const categories: Record<string, string> = {
    SALARY: 'Salaires',
    RENT: 'Loyer',
    UTILITIES: 'Services',
    SUPPLIES: 'Fournitures',
    TRAVEL: 'Déplacement',
    MARKETING: 'Marketing',
    EQUIPMENT: 'Équipement',
    TRAINING: 'Formation',
    OTHER: 'Autre',
  };
  return categories[backendCategory] || backendCategory;
};

const mapCategoryToBackend = (frontendCategory: string): string => {
  const categories: Record<string, string> = {
    'Salaires': 'SALARY',
    'Loyer': 'RENT',
    'Services': 'UTILITIES',
    'Fournitures': 'SUPPLIES',
    'Déplacement': 'TRAVEL',
    'Marketing': 'MARKETING',
    'Équipement': 'EQUIPMENT',
    'Formation': 'TRAINING',
    'Autre': 'OTHER',
  };
  return categories[frontendCategory] || frontendCategory.toUpperCase();
};

// Mapper la réponse backend vers le format frontend
const mapExpense = (response: ExpenseResponse): Expense => ({
  id: response.id,
  title: response.title,
  description: response.description,
  category: mapCategoryToFrontend(response.category),
  amount: typeof response.amount === 'number' ? response.amount : parseFloat(String(response.amount)),
  currency: response.currency,
  expenseDate: new Date(response.expenseDate),
  status: mapStatus(response.status),
  submittedByName: response.submittedByName,
  approvedByName: response.approvedByName,
  departmentId: response.departmentId,
  receiptReference: response.receiptReference,
  createdAt: new Date(response.createdAt),
});

const expenseService = {
  /**
   * Récupérer la liste des dépenses
   */
  async getExpenses(params?: {
    page?: number;
    pageSize?: number;
    category?: string;
    status?: ExpenseStatus;
  }): Promise<{ data: Expense[]; total: number; page: number; pageSize: number }> {
    const backendParams: Record<string, string | number | undefined> = {
      page: params?.page || 0,
      size: params?.pageSize || 20,
    };

    if (params?.category) {
      backendParams.category = mapCategoryToBackend(params.category);
    }
    if (params?.status) {
      backendParams.status = mapStatusToBackend(params.status);
    }

    const response = await api.get<PageResponse<ExpenseResponse>>('/v1/expenses', { params: backendParams });
    const pageData = response.data as unknown as PageResponse<ExpenseResponse>;

    return {
      data: pageData.content.map(mapExpense),
      total: pageData.totalElements,
      page: pageData.page,
      pageSize: pageData.size,
    };
  },

  /**
   * Récupérer une dépense par ID
   */
  async getExpense(id: string): Promise<Expense> {
    const response = await api.get<ExpenseResponse>(`/v1/expenses/${id}`);
    return mapExpense(response.data as unknown as ExpenseResponse);
  },

  /**
   * Créer une nouvelle dépense
   */
  async createExpense(data: {
    title: string;
    description?: string;
    category: string;
    amount: number;
    currency?: string;
    expenseDate?: string;
    departmentId?: string;
    receiptReference?: string;
  }): Promise<Expense> {
    const response = await api.post<ExpenseResponse>('/v1/expenses', {
      title: data.title,
      description: data.description,
      category: mapCategoryToBackend(data.category),
      amount: data.amount,
      currency: data.currency || 'XOF',
      expenseDate: data.expenseDate || new Date().toISOString().split('T')[0],
      departmentId: data.departmentId,
      receiptReference: data.receiptReference,
    });
    return mapExpense(response.data as unknown as ExpenseResponse);
  },

  /**
   * Mettre à jour une dépense
   */
  async updateExpense(id: string, data: {
    title?: string;
    description?: string;
    category?: string;
    amount?: number;
    currency?: string;
    expenseDate?: string;
    departmentId?: string;
    receiptReference?: string;
  }): Promise<Expense> {
    const updateData: Record<string, unknown> = {};
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category !== undefined) updateData.category = mapCategoryToBackend(data.category);
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.currency !== undefined) updateData.currency = data.currency;
    if (data.expenseDate !== undefined) updateData.expenseDate = data.expenseDate;
    if (data.departmentId !== undefined) updateData.departmentId = data.departmentId;
    if (data.receiptReference !== undefined) updateData.receiptReference = data.receiptReference;

    const response = await api.put<ExpenseResponse>(`/v1/expenses/${id}`, updateData);
    return mapExpense(response.data as unknown as ExpenseResponse);
  },

  /**
   * Supprimer une dépense
   */
  async deleteExpense(id: string): Promise<void> {
    await api.delete(`/v1/expenses/${id}`);
  },

  /**
   * Approuver une dépense
   */
  async approveExpense(id: string): Promise<Expense> {
    const response = await api.post<ExpenseResponse>(`/v1/expenses/${id}/approve`);
    return mapExpense(response.data as unknown as ExpenseResponse);
  },

  /**
   * Rejeter une dépense
   */
  async rejectExpense(id: string): Promise<Expense> {
    const response = await api.post<ExpenseResponse>(`/v1/expenses/${id}/reject`);
    return mapExpense(response.data as unknown as ExpenseResponse);
  },

  /**
   * Récupérer le résumé des dépenses
   */
  async getExpenseSummary(): Promise<ExpenseSummaryResponse> {
    const response = await api.get<ExpenseSummaryResponse>('/v1/expenses/summary');
    return {
      totalPending: typeof response.data.totalPending === 'number' ? response.data.totalPending : parseFloat(String(response.data.totalPending)),
      totalApproved: typeof response.data.totalApproved === 'number' ? response.data.totalApproved : parseFloat(String(response.data.totalApproved)),
      totalPaid: typeof response.data.totalPaid === 'number' ? response.data.totalPaid : parseFloat(String(response.data.totalPaid)),
      totalRejected: typeof response.data.totalRejected === 'number' ? response.data.totalRejected : parseFloat(String(response.data.totalRejected)),
      totalAmount: typeof response.data.totalAmount === 'number' ? response.data.totalAmount : parseFloat(String(response.data.totalAmount)),
      pendingCount: response.data.pendingCount,
      approvedCount: response.data.approvedCount,
      paidCount: response.data.paidCount,
      rejectedCount: response.data.rejectedCount,
      totalCount: response.data.totalCount,
    };
  },
};

export default expenseService;


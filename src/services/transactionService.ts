// Transaction Service - Treasury Module
// Manage income/expense transactions via backend API

import api from './api';

export interface TransactionResponse {
  id: string;
  reference: string;
  description: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  currency: string;
  category: string;
  transactionDate: string;
  createdByName: string;
  notes?: string;
  createdAt: string;
}

export interface TreasurySummaryResponse {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  incomeCount: number;
  expenseCount: number;
  recentTransactions: TransactionResponse[];
  incomeByCategory: Record<string, number>;
  expensesByCategory: Record<string, number>;
  monthlyTrend: { month: string; income: number; expenses: number }[];
}

export interface CreateTransactionRequest {
  description: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  currency: string;
  category: string;
  transactionDate: string;
  notes?: string;
}

interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

const transactionService = {
  /**
   * Get all transactions with pagination
   */
  async getTransactions(params?: {
    page?: number;
    pageSize?: number;
    type?: 'INCOME' | 'EXPENSE';
    category?: string;
  }): Promise<{ data: TransactionResponse[]; total: number }> {
    const backendParams: Record<string, string | number | undefined> = {
      page: params?.page || 0,
      size: params?.pageSize || 20,
    };

    if (params?.type) {
      backendParams.type = params.type;
    }
    if (params?.category) {
      backendParams.category = params.category;
    }

    const response = await api.get<PageResponse<TransactionResponse>>('/v1/transactions', { params: backendParams });
    const pageData = response.data as unknown as PageResponse<TransactionResponse>;

    return {
      data: pageData.content,
      total: pageData.totalElements,
    };
  },

  /**
   * Get single transaction by ID
   */
  async getTransaction(id: string): Promise<TransactionResponse> {
    const response = await api.get<TransactionResponse>(`/v1/transactions/${id}`);
    return response.data as unknown as TransactionResponse;
  },

  /**
   * Create a new transaction
   */
  async createTransaction(data: CreateTransactionRequest): Promise<TransactionResponse> {
    const response = await api.post<TransactionResponse>('/v1/transactions', {
      description: data.description,
      type: data.type,
      amount: data.amount,
      currency: data.currency || 'XOF',
      category: data.category,
      transactionDate: data.transactionDate,
      notes: data.notes,
    });
    return response.data as unknown as TransactionResponse;
  },

  /**
   * Delete a transaction
   */
  async deleteTransaction(id: string): Promise<void> {
    await api.delete(`/v1/transactions/${id}`);
  },

  /**
   * Get treasury summary dashboard
   */
  async getTreasurySummary(): Promise<TreasurySummaryResponse> {
    const response = await api.get<TreasurySummaryResponse>('/v1/transactions/treasury-summary');
    return response.data as unknown as TreasurySummaryResponse;
  },
};

export default transactionService;

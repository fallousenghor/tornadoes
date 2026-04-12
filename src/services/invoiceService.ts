// Invoice Service - Tornadoes Job Finance Module
// Gestion des factures via l'API backend

import api from './api';
import type { Invoice, InvoiceStatus } from '@/types';

// Types backend
interface InvoiceResponse {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  issuedByName: string;
  issueDate: string;
  dueDate: string;
  status: string;
  currency: string;
  subtotal: string | number;
  taxRate: string | number;
  taxAmount: string | number;
  total: string | number;
  notes?: string;
  items: InvoiceItemResponse[];
  createdAt: string;
}

interface InvoiceItemResponse {
  id: string;
  description: string;
  quantity: number;
  unitPrice: string | number;
  lineTotal: string | number;
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
const mapStatus = (backendStatus: string): InvoiceStatus => {
  switch (backendStatus) {
    case 'PAID':
      return 'paye';
    case 'DRAFT':
    case 'SENT':
    case 'PENDING':
      return 'en_attente';
    case 'PARTIAL':
      return 'partiel';
    case 'CANCELLED':
      return 'en_attente';
    default:
      return 'en_attente';
  }
};

// Mapper le status frontend vers backend
const mapStatusToBackend = (frontendStatus: InvoiceStatus): string => {
  switch (frontendStatus) {
    case 'paye':
      return 'PAID';
    case 'en_attente':
      return 'PENDING';
    case 'partiel':
      return 'PARTIAL';
    default:
      return 'PENDING';
  }
};

// Mapper la réponse backend vers le format frontend
const mapInvoice = (response: InvoiceResponse): Invoice => ({
  id: response.id,
  reference: response.invoiceNumber,
  clientId: response.id,
  clientName: response.clientName,
  amount: typeof response.total === 'number' ? response.total : parseFloat(String(response.total)),
  date: new Date(response.issueDate),
  dueDate: response.dueDate ? new Date(response.dueDate) : undefined,
  status: mapStatus(response.status),
  items: response.items.map(item => ({
    id: item.id,
    description: item.description,
    quantity: item.quantity,
    unitPrice: typeof item.unitPrice === 'number' ? item.unitPrice : parseFloat(String(item.unitPrice)),
    total: typeof item.lineTotal === 'number' ? item.lineTotal : parseFloat(String(item.lineTotal)),
  })),
});

const invoiceService = {
  /**
   * Récupérer la liste des factures
   */
  async getInvoices(params?: {
    page?: number;
    pageSize?: number;
    clientName?: string;
    status?: InvoiceStatus;
  }): Promise<{ data: Invoice[]; total: number; page: number; pageSize: number }> {
    const backendParams: Record<string, string | number | undefined> = {
      page: params?.page || 0,
      size: params?.pageSize || 20,
    };
    
    if (params?.clientName) {
      backendParams.clientName = params.clientName;
    }
    if (params?.status) {
      backendParams.status = mapStatusToBackend(params.status);
    }

    const response = await api.get<PageResponse<InvoiceResponse>>('/v1/invoices', { params: backendParams });
    const pageData = response.data as unknown as PageResponse<InvoiceResponse>;
    
    return {
      data: pageData.content.map(mapInvoice),
      total: pageData.totalElements,
      page: pageData.page,
      pageSize: pageData.size,
    };
  },

  /**
   * Récupérer une facture par ID
   */
  async getInvoice(id: string): Promise<Invoice> {
    const response = await api.get<InvoiceResponse>(`/v1/invoices/${id}`);
    return mapInvoice(response.data as unknown as InvoiceResponse);
  },

  /**
   * Créer une nouvelle facture
   */
  async createInvoice(data: {
    clientName: string;
    clientEmail?: string;
    clientAddress?: string;
    items: { description: string; quantity: number; unitPrice: number }[];
    dueDate?: string;
    issueDate?: string;
    currency?: string;
    taxRate?: number;
    notes?: string;
  }): Promise<Invoice> {
    const today = new Date().toISOString().split('T')[0];
    const response = await api.post<InvoiceResponse>('/v1/invoices', {
      clientName: data.clientName,
      ...(data.clientEmail ? { clientEmail: data.clientEmail } : {}),
      ...(data.clientAddress ? { clientAddress: data.clientAddress } : {}),
      items: data.items,
      dueDate: data.dueDate || today,
      issueDate: data.issueDate || today,
      currency: data.currency || 'XOF',
      taxRate: data.taxRate ?? 0,
      notes: data.notes,
    });
    return mapInvoice(response.data as unknown as InvoiceResponse);
  },

  /**
   * Envoyer une facture au client
   */
  async sendInvoice(id: string): Promise<Invoice> {
    const response = await api.post<InvoiceResponse>(`/v1/invoices/${id}/send`);
    return mapInvoice(response.data as unknown as InvoiceResponse);
  },

  /**
   * Annuler une facture
   */
  async cancelInvoice(id: string): Promise<Invoice> {
    const response = await api.post<InvoiceResponse>(`/v1/invoices/${id}/cancel`);
    return mapInvoice(response.data as unknown as InvoiceResponse);
  },

  /**
   * Traiter un paiement
   */
  async processPayment(id: string, data: {
    amount: number;
    paymentMethod: string;
    reference?: string;
  }): Promise<Invoice> {
    // Convert paymentMethod to uppercase enum format expected by backend
    const paymentMethodUpper = data.paymentMethod.toUpperCase();

    // Use today's date as paymentDate (required by backend)
    const today = new Date().toISOString().split('T')[0];

    const paymentRequest = {
      amount: Number(data.amount),
      paymentMethod: paymentMethodUpper,
      paymentDate: today,
      reference: data.reference || undefined,
      notes: undefined,
    };

    console.log('Sending payment request:', paymentRequest);

    const response = await api.post<InvoiceResponse>(`/v1/invoices/${id}/payments`, paymentRequest);
    return mapInvoice(response.data as unknown as InvoiceResponse);
  },

  /**
   * Récupérer le résumé financier
   */
  async getFinancialSummary() {
    const response = await api.get('/v1/invoices/summary');
    return response.data;
  },

  /**
   * Mettre à jour une facture
   */
  async updateInvoice(id: string, data: {
    clientName?: string;
    clientEmail?: string;
    clientAddress?: string;
    issueDate?: string;
    dueDate?: string;
    notes?: string;
    taxRate?: number;
    items?: { description: string; quantity: number; unitPrice: number }[];
  }): Promise<Invoice> {
    const response = await api.put<InvoiceResponse>(`/v1/invoices/${id}`, data);
    return mapInvoice(response.data as unknown as InvoiceResponse);
  },

  /**
   * Supprimer une facture
   */
  async deleteInvoice(id: string): Promise<void> {
    await api.delete(`/v1/invoices/${id}`);
  },
};

export default invoiceService;


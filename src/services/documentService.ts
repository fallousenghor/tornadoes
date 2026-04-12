// Document Service - Tornadoes Job Document Management Module
// Gestion des documents via l'API backend

import api from './api';

// ==================== Backend Types ====================

// Types enum backend
export type DocumentType = 
  | 'CONTRACT' 
  | 'CNSS' 
  | 'ID' 
  | 'DIPLOMA' 
  | 'INVOICE' 
  | 'REPORT' 
  | 'POLICY' 
  | 'OTHER';

export type DocumentCategory = 
  | 'RH' 
  | 'FINANCE' 
  | 'JURIDIQUE' 
  | 'TECHNIQUE' 
  | 'COMMERCIAL' 
  | 'GENERAL';

export type DocumentStatus = 
  | 'DRAFT' 
  | 'PENDING_SIGNATURE' 
  | 'SIGNED' 
  | 'EXPIRED';

// Type frontend (user-friendly)
export type DocumentStatusFr = 'brouillon' | 'en_attente' | 'signe' | 'expire';

// Backend response interface
interface DocumentResponse {
  id: string;
  name: string;
  description?: string;
  type: DocumentType;
  category: DocumentCategory;
  status: DocumentStatus;
  version: number;
  signatureRequired: boolean;
  fileUrl?: string;
  uploadedBy?: string;
  uploadedAt: string;
  updatedAt: string;
  departmentId?: string;
  employeeId?: string;
  signedBy: string[];
  expiresAt?: string;
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

// ==================== Frontend Document Type ====================

export interface Document {
  id: string;
  name: string;
  description?: string;
  type: DocumentType;
  category: DocumentCategory;
  version: number;
  status: DocumentStatus;
  uploadedBy: string;
  uploadedAt: Date;
  updatedAt: Date;
  signatureRequired: boolean;
  signedBy: string[];
  departmentId?: string;
  employeeId?: string;
  expiresAt?: Date;
  fileUrl?: string;
}

// ==================== Stats ====================

export interface DocumentStats {
  total: number;
  pending: number;
  signed: number;
  expired: number;
  draft: number;
}

// ==================== Mappers ====================

// Mapper le type backend vers frontend
const mapDocumentType = (type: DocumentType): string => {
  const typeMap: Record<DocumentType, string> = {
    CONTRACT: 'Contrat',
    CNSS: 'CNSS',
    ID: 'Pièce identité',
    DIPLOMA: 'Diplôme',
    INVOICE: 'Facture',
    REPORT: 'Rapport',
    POLICY: 'Politique',
    OTHER: 'Autre',
  };
  return typeMap[type] || type;
};

// Mapper la catégorie backend vers frontend
const mapDocumentCategory = (category: DocumentCategory): string => {
  const categoryMap: Record<DocumentCategory, string> = {
    RH: 'Ressources Humaines',
    FINANCE: 'Finance',
    JURIDIQUE: 'Juridique',
    TECHNIQUE: 'Technique',
    COMMERCIAL: 'Commercial',
    GENERAL: 'Général',
  };
  return categoryMap[category] || category;
};

// Mapper le status backend vers frontend
const mapDocumentStatus = (status: DocumentStatus): DocumentStatusFr => {
  const statusMap: Record<DocumentStatus, DocumentStatusFr> = {
    DRAFT: 'brouillon',
    PENDING_SIGNATURE: 'en_attente',
    SIGNED: 'signe',
    EXPIRED: 'expire',
  };
  return statusMap[status] || 'brouillon';
};

// Mapper la réponse backend vers le format frontend
const mapDocument = (response: DocumentResponse): Document => ({
  id: response.id,
  name: response.name,
  description: response.description,
  type: response.type,
  category: response.category,
  version: response.version,
  status: response.status,
  uploadedBy: response.uploadedBy || 'Inconnu',
  uploadedAt: new Date(response.uploadedAt),
  updatedAt: new Date(response.updatedAt),
  signatureRequired: response.signatureRequired,
  signedBy: response.signedBy || [],
  departmentId: response.departmentId,
  employeeId: response.employeeId,
  expiresAt: response.expiresAt ? new Date(response.expiresAt) : undefined,
  fileUrl: response.fileUrl,
});

// ==================== Service ====================

const documentService = {
  /**
   * Récupérer la liste des documents
   */
  async getDocuments(params?: {
    page?: number;
    size?: number;
    category?: DocumentCategory;
    status?: DocumentStatus;
    search?: string;
    sortBy?: string;
    sortDir?: 'ASC' | 'DESC';
  }): Promise<{ data: Document[]; total: number; page: number; pageSize: number }> {
    const backendParams: Record<string, string | number | undefined> = {
      page: params?.page || 0,
      size: params?.size || 10,
      sortBy: params?.sortBy || 'createdAt',
      sortDir: params?.sortDir || 'DESC',
    };
    
    if (params?.category) {
      backendParams.category = params.category;
    }
    if (params?.status) {
      backendParams.status = params.status;
    }
    if (params?.search) {
      backendParams.search = params.search;
    }

    const response = await api.get<PageResponse<DocumentResponse>>('/v1/documents', { 
      params: backendParams 
    });
    
    if (!response.data) {
      console.warn('Empty response data from getDocuments');
      return { data: [], total: 0, page: 0, pageSize: 10 };
    }

    const content = Array.isArray(response.data) ? response.data : (response.data.content || []);
    return {
      data: content.map(mapDocument),
      total: response.data.totalElements || 0,
      page: response.data.page || 0,
      pageSize: response.data.size || 10,
    };
  },

  /**
   * Récupérer un document par ID
   */
  async getDocument(id: string): Promise<Document> {
    const response = await api.get<DocumentResponse>(`/v1/documents/${id}`);
    return mapDocument(response.data);
  },

  /**
   * Créer un nouveau document
   */
  async createDocument(data: {
    name: string;
    description?: string;
    type: DocumentType;
    category: DocumentCategory;
    signatureRequired?: boolean;
    fileUrl?: string;
    uploadedBy?: string;
    departmentId?: string;
    employeeId?: string;
    expiresAt?: string;
  }): Promise<Document> {
    const response = await api.post<DocumentResponse>('/v1/documents', {
      name: data.name,
      description: data.description,
      type: data.type,
      category: data.category,
      signatureRequired: data.signatureRequired || false,
      fileUrl: data.fileUrl,
      uploadedBy: data.uploadedBy,
      departmentId: data.departmentId,
      employeeId: data.employeeId,
      expiresAt: data.expiresAt,
      status: 'DRAFT',
    });
    return mapDocument(response.data);
  },

  /**
   * Mettre à jour un document
   */
  async updateDocument(id: string, data: {
    name?: string;
    description?: string;
    type?: DocumentType;
    category?: DocumentCategory;
    status?: DocumentStatus;
    signatureRequired?: boolean;
    fileUrl?: string;
    departmentId?: string;
    employeeId?: string;
    expiresAt?: string;
    signedBy?: string[];
  }): Promise<Document> {
    const response = await api.put<DocumentResponse>(`/v1/documents/${id}`, data);
    return mapDocument(response.data);
  },

  /**
   * Supprimer un document
   */
  async deleteDocument(id: string): Promise<void> {
    await api.delete(`/v1/documents/${id}`);
  },

  /**
   * Ajouter une signature
   */
  async addSignature(id: string, signer: string): Promise<Document> {
    const response = await api.post<DocumentResponse>(
      `/v1/documents/${id}/signatures?signer=${encodeURIComponent(signer)}`
    );
    return mapDocument(response.data);
  },

  /**
   * Récupérer les statistiques des documents
   */
  async getDocumentStats(): Promise<DocumentStats> {
    try {
      const [draft, pending, signed, expired] = await Promise.all([
        api.get<number>('/v1/documents/stats/count', { 
          params: { status: 'DRAFT' } 
        }).then(r => r.data).catch(() => 0),
        api.get<number>('/v1/documents/stats/count', { 
          params: { status: 'PENDING_SIGNATURE' } 
        }).then(r => r.data).catch(() => 0),
        api.get<number>('/v1/documents/stats/count', { 
          params: { status: 'SIGNED' } 
        }).then(r => r.data).catch(() => 0),
        api.get<number>('/v1/documents/stats/count', { 
          params: { status: 'EXPIRED' } 
        }).then(r => r.data).catch(() => 0),
      ]);

      const total = draft + pending + signed + expired;
      
      return {
        total,
        draft,
        pending,
        signed,
        expired,
      };
    } catch (error) {
      console.error('Error fetching document stats:', error);
      return { total: 0, draft: 0, pending: 0, signed: 0, expired: 0 };
    }
  },

  /**
   * Compter les documents par statut
   */
  async countByStatus(status: DocumentStatus): Promise<number> {
    try {
      const response = await api.get<number>('/v1/documents/stats/count', {
        params: { status },
      });
      return response.data;
    } catch (error) {
      console.error(`Error counting documents by status ${status}:`, error);
      return 0;
    }
  },
};

export default documentService;

// Export helper functions for use in components
export const documentTypeLabels: Record<DocumentType, string> = {
  CONTRACT: 'Contrat',
  CNSS: 'CNSS',
  ID: 'Pièce identité',
  DIPLOMA: 'Diplôme',
  INVOICE: 'Facture',
  REPORT: 'Rapport',
  POLICY: 'Politique',
  OTHER: 'Autre',
};

export const documentCategoryLabels: Record<DocumentCategory, string> = {
  RH: 'Ressources Humaines',
  FINANCE: 'Finance',
  JURIDIQUE: 'Juridique',
  TECHNIQUE: 'Technique',
  COMMERCIAL: 'Commercial',
  GENERAL: 'Général',
};

export const documentStatusLabels: Record<DocumentStatus, DocumentStatusFr> = {
  DRAFT: 'brouillon',
  PENDING_SIGNATURE: 'en_attente',
  SIGNED: 'signe',
  EXPIRED: 'expire',
};


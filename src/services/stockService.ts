// Stock/Asset Service - Tornadoes Job Inventory Module
// Gestion du stock et des équipements via l'API backend

import api from './api';
import type { StockItem, StockCategory } from '@/types';

// Types backend
interface AssetResponse {
  id: string;
  assetCode: string;
  name: string;
  description?: string;
  category: string;
  status: string;
  conditionState: string;
  purchaseDate?: string;
  purchasePrice?: string | number;
  serialNumber?: string;
  brand?: string;
  model?: string;
  location?: string;
  departmentId?: string;
  imageUrl?: string;
  documentUrl?: string;
  assignedToName?: string;
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

// Mapper la catégorie backend vers frontend
const mapCategory = (backendCategory: string): StockCategory => {
  switch (backendCategory) {
    case 'COMPUTER':
      return 'informatique';
    case 'FURNITURE':
      return 'mobilier';
    case 'EQUIPMENT':
      return 'equipements';
    case 'VEHICLE':
      return 'equipements';
    case 'PHONE':
      return 'equipements';
    case 'PRINTER':
      return 'equipements';
    case 'SERVER':
      return 'equipements';
    default:
      return 'equipements';
  }
};

// Mapper la catégorie frontend vers backend
const mapCategoryToBackend = (frontendCategory: StockCategory): string => {
  switch (frontendCategory) {
    case 'informatique':
      return 'COMPUTER';
    case 'mobilier':
      return 'FURNITURE';
    case 'equipements':
      return 'EQUIPMENT';
    default:
      return 'EQUIPMENT';
  }
};

// Mapper la réponse backend vers le format frontend
const mapAsset = (response: AssetResponse): StockItem => ({
  id: response.id,
  name: response.name,
  category: mapCategory(response.category),
  quantity: 1, // Par défaut 1 pour un actif
  available: response.status === 'AVAILABLE' ? 1 : 0,
  assigned: response.status === 'ASSIGNED' ? 1 : 0,
  minQuantity: 1,
  unitPrice: typeof response.purchasePrice === 'number' 
    ? response.purchasePrice 
    : response.purchasePrice 
      ? parseFloat(String(response.purchasePrice)) 
      : undefined,
  location: response.location,
});

// Summary pour les graphiques
export interface StockSummary {
  totalItems: number;
  available: number;
  assigned: number;
  maintenance: number;
}

export interface StockCategoryData {
  name: string;
  value: number;
}

const stockService = {
  /**
   * Récupérer la liste des actifs/équipements
   */
  async getAssets(params?: {
    page?: number;
    pageSize?: number;
    category?: StockCategory;
    status?: string;
  }): Promise<{ data: StockItem[]; total: number; page: number; pageSize: number }> {
    const backendParams: Record<string, string | number | undefined> = {
      page: params?.page || 0,
      size: params?.pageSize || 100,
    };
    
    if (params?.category) {
      backendParams.category = mapCategoryToBackend(params.category);
    }
    if (params?.status) {
      backendParams.status = params.status;
    }

    const response = await api.get<PageResponse<AssetResponse>>('/v1/assets', { params: backendParams });
    const pageData = response.data as unknown as PageResponse<AssetResponse>;
    
    return {
      data: pageData.content.map(mapAsset),
      total: pageData.totalElements,
      page: pageData.page,
      pageSize: pageData.size,
    };
  },

  /**
   * Récupérer un actif par ID
   */
  async getAsset(id: string): Promise<StockItem> {
    const response = await api.get<AssetResponse>(`/v1/assets/${id}`);
    return mapAsset(response.data as unknown as AssetResponse);
  },

  /**
   * Créer un nouvel actif
   */
  async createAsset(data: {
    name: string;
    description?: string;
    category: StockCategory;
    serialNumber?: string;
    brand?: string;
    model?: string;
    location?: string;
    purchaseDate?: string;
    purchasePrice?: number;
  }): Promise<StockItem> {
    const response = await api.post<AssetResponse>('/v1/assets', {
      name: data.name,
      description: data.description,
      category: mapCategoryToBackend(data.category),
      serialNumber: data.serialNumber,
      brand: data.brand,
      model: data.model,
      location: data.location,
      purchaseDate: data.purchaseDate,
      purchasePrice: data.purchasePrice,
    });
    return mapAsset(response.data as unknown as AssetResponse);
  },

  /**
   * Assigner un actif à un employé
   */
  async assignAsset(assetId: string, employeeId: string): Promise<StockItem> {
    const response = await api.post<AssetResponse>(`/v1/assets/${assetId}/assign`, {
      employeeId,
    });
    return mapAsset(response.data as unknown as AssetResponse);
  },

  /**
   * Retourner un actif
   */
  async returnAsset(assetId: string): Promise<StockItem> {
    const response = await api.post<AssetResponse>(`/v1/assets/${assetId}/return`);
    return mapAsset(response.data as unknown as AssetResponse);
  },

  /**
   * Récupérer le résumé du stock pour les graphiques
   */
  async getStockSummary(): Promise<StockSummary> {
    const { data } = await this.getAssets({ pageSize: 1000 });
    
    return {
      totalItems: data.length,
      available: data.filter(i => i.available > 0).reduce((acc, i) => acc + i.available, 0),
      assigned: data.filter(i => i.assigned > 0).reduce((acc, i) => acc + i.assigned, 0),
      maintenance: data.filter(i => i.quantity - i.available - i.assigned > 0).reduce((acc, i) => acc + (i.quantity - i.available - i.assigned), 0),
    };
  },

  /**
   * Récupérer les données par catégorie pour les graphiques
   */
  async getStockByCategory(): Promise<StockCategoryData[]> {
    const { data } = await this.getAssets({ pageSize: 1000 });
    
    const categories: Record<string, number> = {};
    data.forEach(item => {
      const cat = item.category || 'equipements';
      categories[cat] = (categories[cat] || 0) + (item.quantity || 1);
    });
    
    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
    }));
  },
};

export default stockService;


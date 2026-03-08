// Roles Service - Tornadoes Job System Module
// Gestion des rôles et permissions via l'API backend

import api from './api';

// Types backend
interface RoleResponse {
  id: string;
  name: string;
  description: string;
  color: string;
  userCount: number;
  permissions: string[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PermissionResponse {
  id: string;
  module: string;
  actions: string[];
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

const rolesService = {
  /**
   * Récupérer tous les rôles
   */
  async getRoles(): Promise<RoleResponse[]> {
    try {
      const response = await api.get<PageResponse<RoleResponse>>('/v1/roles');
      return response.data.content;
    } catch (error) {
      console.error('Error fetching roles:', error);
      return [];
    }
  },

  /**
   * Récupérer un rôle par ID
   */
  async getRole(id: string): Promise<RoleResponse | null> {
    try {
      const response = await api.get<RoleResponse>(`/v1/roles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching role:', error);
      return null;
    }
  },

  /**
   * Créer un nouveau rôle
   */
  async createRole(data: {
    name: string;
    description: string;
    color: string;
    permissions: string[];
    isDefault?: boolean;
  }): Promise<RoleResponse | null> {
    try {
      const response = await api.post<RoleResponse>('/v1/roles', data);
      return response.data;
    } catch (error) {
      console.error('Error creating role:', error);
      return null;
    }
  },

  /**
   * Mettre à jour un rôle
   */
  async updateRole(id: string, data: {
    name?: string;
    description?: string;
    color?: string;
    permissions?: string[];
    isDefault?: boolean;
  }): Promise<RoleResponse | null> {
    try {
      const response = await api.put<RoleResponse>(`/v1/roles/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating role:', error);
      return null;
    }
  },

  /**
   * Supprimer un rôle
   */
  async deleteRole(id: string): Promise<boolean> {
    try {
      await api.delete(`/v1/roles/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting role:', error);
      return false;
    }
  },

  /**
   * Récupérer toutes les permissions
   */
  async getPermissions(): Promise<PermissionResponse[]> {
    try {
      const response = await api.get<PermissionResponse[]>('/v1/permissions');
      return response.data;
    } catch (error) {
      console.error('Error fetching permissions:', error);
      return [];
    }
  },

  /**
   * Récupérer les statistiques des rôles
   */
  async getRoleStats(): Promise<{
    totalRoles: number;
    totalUsers: number;
    adminUsers: number;
    customRoles: number;
  }> {
    try {
      const response = await api.get('/v1/roles/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching role stats:', error);
      return { totalRoles: 0, totalUsers: 0, adminUsers: 0, customRoles: 0 };
    }
  },

  /**
   * Assigner un rôle à un utilisateur
   */
  async assignRole(userId: string, roleId: string): Promise<boolean> {
    try {
      await api.post('/v1/roles/assign', { userId, roleId });
      return true;
    } catch (error) {
      console.error('Error assigning role:', error);
      return false;
    }
  },
};

export default rolesService;


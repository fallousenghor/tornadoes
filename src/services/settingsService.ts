// Settings Service - Tornadoes Job System Module
// Gestion des paramètres via l'API backend

import api from './api';

// Types backend
interface CompanyInfoResponse {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
  logo?: string;
}

interface NotificationSettingsResponse {
  emailAlerts: boolean;
  pushNotifications: boolean;
  weeklyReport: boolean;
  securityAlerts: boolean;
  attendanceAlerts: boolean;
  invoiceReminders: boolean;
}

interface SecuritySettingsResponse {
  twoFactor: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  ipWhitelist: boolean;
  loginAlerts: boolean;
  allowedIps?: string[];
}

interface RegionalSettingsResponse {
  language: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  timeFormat: string;
}

const settingsService = {
  /**
   * Récupérer les informations de l'entreprise
   */
  async getCompanyInfo(): Promise<CompanyInfoResponse | null> {
    try {
      const response = await api.get<CompanyInfoResponse>('/v1/settings/company');
      return response.data;
    } catch (error) {
      console.error('Error fetching company info:', error);
      return null;
    }
  },

  /**
   * Mettre à jour les informations de l'entreprise
   */
  async updateCompanyInfo(data: Partial<CompanyInfoResponse>): Promise<CompanyInfoResponse | null> {
    try {
      const response = await api.put<CompanyInfoResponse>('/v1/settings/company', data);
      return response.data;
    } catch (error) {
      console.error('Error updating company info:', error);
      return null;
    }
  },

  /**
   * Récupérer les paramètres de notification
   */
  async getNotificationSettings(): Promise<NotificationSettingsResponse | null> {
    try {
      const response = await api.get<NotificationSettingsResponse>('/v1/settings/notifications');
      return response.data;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      return null;
    }
  },

  /**
   * Mettre à jour les paramètres de notification
   */
  async updateNotificationSettings(data: Partial<NotificationSettingsResponse>): Promise<NotificationSettingsResponse | null> {
    try {
      const response = await api.put<NotificationSettingsResponse>('/v1/settings/notifications', data);
      return response.data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      return null;
    }
  },

  /**
   * Récupérer les paramètres de sécurité
   */
  async getSecuritySettings(): Promise<SecuritySettingsResponse | null> {
    try {
      const response = await api.get<SecuritySettingsResponse>('/v1/settings/security');
      return response.data;
    } catch (error) {
      console.error('Error fetching security settings:', error);
      return null;
    }
  },

  /**
   * Mettre à jour les paramètres de sécurité
   */
  async updateSecuritySettings(data: Partial<SecuritySettingsResponse>): Promise<SecuritySettingsResponse | null> {
    try {
      const response = await api.put<SecuritySettingsResponse>('/v1/settings/security', data);
      return response.data;
    } catch (error) {
      console.error('Error updating security settings:', error);
      return null;
    }
  },

  /**
   * Récupérer les paramètres régionaux
   */
  async getRegionalSettings(): Promise<RegionalSettingsResponse | null> {
    try {
      const response = await api.get<RegionalSettingsResponse>('/v1/settings/regional');
      return response.data;
    } catch (error) {
      console.error('Error fetching regional settings:', error);
      return null;
    }
  },

  /**
   * Mettre à jour les paramètres régionaux
   */
  async updateRegionalSettings(data: Partial<RegionalSettingsResponse>): Promise<RegionalSettingsResponse | null> {
    try {
      const response = await api.put<RegionalSettingsResponse>('/v1/settings/regional', data);
      return response.data;
    } catch (error) {
      console.error('Error updating regional settings:', error);
      return null;
    }
  },
};

export default settingsService;


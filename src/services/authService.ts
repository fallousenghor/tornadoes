// Service d'authentification - Tornadoes Job

import api from './api';
import type { AuthResponse, LoginRequest } from '@/types/auth';

export const authService = {
  /**
   * Connexion utilisateur
   */
  async login(username: string, password: string): Promise<AuthResponse> {
    const request: LoginRequest = { username, password };
    const response = await api.post<AuthResponse>('/v1/auth/login', request);
    // Response is already unwrapped by interceptor
    return response.data;
  },

  /**
   * Rafraîchir le token d'accès
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await api.post<{ accessToken: string; refreshToken: string }>(
      '/v1/auth/refresh',
      { refreshToken }
    );
    // Response is already unwrapped by interceptor
    return response.data;
  },

  /**
   * Déconnexion utilisateur
   */
  async logout(refreshToken: string): Promise<void> {
    await api.post('/v1/auth/logout', { refreshToken });
  },

  /**
   * Stocker les tokens
   */
  saveTokens(authResponse: AuthResponse): void {
    localStorage.setItem('accessToken', authResponse.accessToken);
    localStorage.setItem('refreshToken', authResponse.refreshToken);
    localStorage.setItem('tokenExpiresAt', String(Date.now() + authResponse.accessTokenExpiresIn));
  },

  /**
   * Récupérer le token d'accès
   */
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  },

  /**
   * Récupérer le refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  },

  /**
   * Vérifier si le token est expiré
   */
  isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem('tokenExpiresAt');
    if (!expiresAt) return true;
    return Date.now() > parseInt(expiresAt, 10);
  },

  /**
   * Supprimer les tokens
   */
  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiresAt');
  },
};

export default authService;


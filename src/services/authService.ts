// Service d'authentification - Tornadoes Job ERP
// Connecté au backend Spring Boot - /api/v1/auth

import api from './api';
import type { AuthResponse, LoginRequest } from '@/types/auth';

export const authService = {
  /**
   * Connexion utilisateur
   * POST /api/v1/auth/login
   */
  async login(username: string, password: string): Promise<AuthResponse> {
    const request: LoginRequest = { username, password };
    const response = await api.post<AuthResponse>('/v1/auth/login', request);
    return response.data;
  },

  /**
   * Inscription utilisateur
   * POST /api/v1/auth/register
   */
  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/v1/auth/register', {
      username,
      email,
      password,
    });
    return response.data;
  },

  /**
   * Rafraîchir le token d'accès
   * POST /api/v1/auth/refresh
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await api.post<{ accessToken: string; refreshToken: string }>(
      '/v1/auth/refresh',
      { refreshToken }
    );
    return response.data;
  },

  /**
   * Déconnexion utilisateur
   * POST /api/v1/auth/logout
   */
  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await api.post('/v1/auth/logout', { refreshToken });
    }
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


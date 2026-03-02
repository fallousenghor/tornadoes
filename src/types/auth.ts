// Types d'authentification pour le backend Tornadoes Job

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  userId: string;
  username: string;
  email: string;
  fullName: string;
  permissions: string[];
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  permissions: string[];
  avatar?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: number | null;
}


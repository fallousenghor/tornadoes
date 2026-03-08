// Zustand Store - AEVUM Enterprise ERP
// Global state management following single responsibility

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { NavSection } from '@/types';
import { authService } from '@/services/authService';
import type { AuthResponse } from '@/types/auth';

interface AppState {
  // Authentication state
  isAuthenticated: boolean;
  currentUser: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  } | null;
  // Loading state for hydration
  isHydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  // Sidebar state
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  
  // Navigation state
  activeNav: string;
  setActiveNav: (id: string) => void;
  collapsedSections: Record<string, boolean>;
  toggleSection: (label: string) => void;
  
  // View state (DG, RH, Finance)
  activeView: string;
  setActiveView: (view: string) => void;
  
  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Navigation sections
  navSections: NavSection[];
  setNavSections: (sections: NavSection[]) => void;
}

// Mock users for authentication (fallback for demo)
const mockUsers = [
  { email: 'dg@nexus-erp.sn', password: 'admin123', name: 'Directeur Général', role: 'DG' },
  { email: 'rh@nexus-erp.sn', password: 'rh123', name: 'Responsable RH', role: 'RH' },
  { email: 'finance@nexus-erp.sn', password: 'finance123', name: 'Directeur Financier', role: 'Finance' },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Authentication
      isAuthenticated: false,
      currentUser: null,
      isHydrated: false,
      
      setHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),
      
      login: async (email: string, password: string) => {
        try {
          // Attempt to login via backend API
          const authResponse: AuthResponse = await authService.login(email, password);
          
          // Store tokens
          authService.saveTokens(authResponse);
          
          // Map permissions to role for the app
          let role = 'DG';
          if (authResponse.permissions.includes('RH_ACCESS')) {
            role = 'RH';
          } else if (authResponse.permissions.includes('FINANCE_ACCESS')) {
            role = 'Finance';
          }
          
          set({ 
            isAuthenticated: true, 
            currentUser: { 
              name: authResponse.fullName, 
              email: authResponse.email, 
              role: role
            },
            activeView: role
          });
          return true;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        }
      },
      
      logout: () => {
        // Clear tokens
        authService.clearTokens();
        set({ 
          isAuthenticated: false, 
          currentUser: null,
          activeNav: 'dashboard'
        });
      },
      
      // Sidebar - expanded by default
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      
      // Navigation
      activeNav: 'dashboard',
      setActiveNav: (id) => set({ activeNav: id }),
      collapsedSections: {
        'PRINCIPAL': true,
        'RH & ORG': true,
        'FINANCE': true,
        'OPÉRATIONS': true,
        'FORMATION': true,
        'SYSTÈME': true,
      },
      toggleSection: (label) => set((state) => ({
        collapsedSections: { 
          ...state.collapsedSections, 
          [label]: !state.collapsedSections[label] 
        }
      })),
      
      // View
      activeView: 'DG',
      setActiveView: (view) => set({ activeView: view }),
      
      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      // Navigation sections - will be set from mock data
      navSections: [],
      setNavSections: (sections) => set({ navSections: sections }),
    }),
    {
      name: 'erp-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated, 
        currentUser: state.currentUser,
        activeView: state.activeView,
        isSidebarOpen: state.isSidebarOpen,
      }),
      onRehydrateStorage: () => (state) => {
        // Mark hydration as complete
        state?.setHydrated(true);
      },
    }
  )
);

export default useAppStore;


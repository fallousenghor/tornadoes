// Zustand Store - AEVUM Enterprise ERP
// Global state management following single responsibility

import { create } from 'zustand';
import type { NavSection } from '@/types';

interface AppState {
  // Authentication state
  isAuthenticated: boolean;
  currentUser: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  } | null;
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

// Mock users for authentication
const mockUsers = [
  { email: 'dg@nexus-erp.sn', password: 'admin123', name: 'Directeur Général', role: 'DG' },
  { email: 'rh@nexus-erp.sn', password: 'rh123', name: 'Responsable RH', role: 'RH' },
  { email: 'finance@nexus-erp.sn', password: 'finance123', name: 'Directeur Financier', role: 'Finance' },
];

export const useAppStore = create<AppState>((set) => ({
  // Authentication
  isAuthenticated: false,
  currentUser: null,
  
  login: async (email: string, password: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      set({ 
        isAuthenticated: true, 
        currentUser: { 
          name: user.name, 
          email: user.email, 
          role: user.role 
        },
        activeView: user.role === 'DG' ? 'DG' : user.role === 'RH' ? 'RH' : 'Finance'
      });
      return true;
    }
    return false;
  },
  
  logout: () => set({ 
    isAuthenticated: false, 
    currentUser: null,
    activeNav: 'dashboard'
  }),
  
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
}));

export default useAppStore;


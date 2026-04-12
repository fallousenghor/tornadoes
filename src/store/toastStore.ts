// Toast Store - AEVUM Enterprise ERP
// Professional Toast Notification System with Zustand

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, updates: Partial<Toast>) => void;
  success: (title: string, message?: string, duration?: number) => string;
  error: (title: string, message?: string, duration?: number) => string;
  warning: (title: string, message?: string, duration?: number) => string;
  info: (title: string, message?: string, duration?: number) => string;
  clearToasts: () => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: (toast: Omit<Toast, 'id'>) => {
    const id = uuidv4();
    const newToast: Toast = {
      id,
      duration: 5000,
      ...toast,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-remove after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, toast.duration || 5000);
    }

    return id;
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  updateToast: (id: string, updates: Partial<Toast>) => {
    set((state) => ({
      toasts: state.toasts.map((toast) =>
        toast.id === id ? { ...toast, ...updates } : toast
      ),
    }));
  },

  success: (title: string, message?: string, duration?: number) =>
    get().addToast({ type: 'success', title, message, duration }),

  error: (title: string, message?: string, duration?: number) =>
    get().addToast({ type: 'error', title, message, duration }),

  warning: (title: string, message?: string, duration?: number) =>
    get().addToast({ type: 'warning', title, message, duration }),

  info: (title: string, message?: string, duration?: number) =>
    get().addToast({ type: 'info', title, message, duration }),

  clearToasts: () => set({ toasts: [] }),
}));

// Hook wrapper for easier usage
export const useToast = () => {
  const store = useToastStore();
  
  return {
    toasts: store.toasts,
    showToast: store.addToast,
    dismissToast: store.removeToast,
    success: store.success,
    error: store.error,
    warning: store.warning,
    info: store.info,
    clear: store.clearToasts,
  };
};

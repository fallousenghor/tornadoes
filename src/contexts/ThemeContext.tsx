// Theme Context - AEVUM Enterprise ERP
// Light/Dark Mode Theme System

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Theme type
export type ThemeMode = 'light' | 'dark';

// Theme Colors Interface
export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryLighter: string;
  primaryMuted: string;
  primaryMutedBg: string;
  secondary: string;
  secondaryMuted: string;
  success: string;
  successLight: string;
  successMuted: string;
  successBg: string;
  warning: string;
  warningLight: string;
  warningMuted: string;
  warningBg: string;
  danger: string;
  dangerLight: string;
  dangerMuted: string;
  dangerBg: string;
  info: string;
  infoMuted: string;
  purple: string;
  purpleMuted: string;
  bg: string;
  bgSecondary: string;
  bgTertiary: string;
  card: string;
  cardHover: string;
  surface: string;
  input: string;
  inputBg: string;
  header: string;
  text: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textLight: string;
  textInverse: string;
  textInverseMuted: string;
  border: string;
  borderLight: string;
  borderDark: string;
  focus: string;
  focusRing: string;
  accent: string;
  accentLight: string;
  accentMuted: string;
  gold: string;
  green: string;
  greenMuted: string;
  red: string;
  redMuted: string;
  teal: string;
  orange: string;
  orangeMuted: string;
  textDim: string;
  textDark: string;
  textDark2: string;
  textMutedLegacy: string;
  hover: string;
  hoverLight: string;
  active: string;
  sidebarGradient: string;
  sidebarGradientSubtle: string;
  sidebarBg: string;
  sidebarText: string;
  sidebarTextMuted: string;
  sidebarBorder: string;
  shadow: string;
  shadowLight: string;
  shadowMedium: string;
  shadowHeavy: string;
}

// Light Theme - Corporate Professional
export const lightColors: ThemeColors = {
  primary: '#1E3A8A',
  primaryLight: '#2563EB',
  primaryLighter: '#3B82F6',
  primaryMuted: 'rgba(30, 58, 138, 0.1)',
  primaryMutedBg: 'rgba(30, 58, 138, 0.08)',
  secondary: '#2563EB',
  secondaryMuted: 'rgba(37, 99, 235, 0.1)',
  success: '#16A34A',
  successLight: '#22C55E',
  successMuted: 'rgba(22, 163, 74, 0.1)',
  successBg: 'rgba(22, 163, 74, 0.08)',
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  warningMuted: 'rgba(245, 158, 11, 0.1)',
  warningBg: 'rgba(245, 158, 11, 0.08)',
  danger: '#DC2626',
  dangerLight: '#EF4444',
  dangerMuted: 'rgba(220, 38, 38, 0.1)',
  dangerBg: 'rgba(220, 38, 38, 0.08)',
  info: '#0EA5E9',
  infoMuted: 'rgba(14, 165, 233, 0.1)',
  purple: '#8B5CF6',
  purpleMuted: 'rgba(139, 92, 246, 0.1)',
  bg: '#F9FAFB',
  bgSecondary: '#F3F4F6',
  bgTertiary: '#E5E7EB',
  card: '#FFFFFF',
  cardHover: '#F9FAFB',
  surface: '#FFFFFF',
  input: '#FFFFFF',
  inputBg: '#F9FAFB',
  header: '#FFFFFF',
  text: '#1F2937',
  textPrimary: '#1F2937',
  textSecondary: '#4B5563',
  textMuted: '#6B7280',
  textLight: '#9CA3AF',
  textInverse: '#FFFFFF',
  textInverseMuted: 'rgba(255, 255, 255, 0.8)',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderDark: '#D1D5DB',
  focus: '#2563EB',
  focusRing: 'rgba(37, 99, 235, 0.4)',
  accent: '#1E3A8A',
  accentLight: '#2563EB',
  accentMuted: 'rgba(30, 58, 138, 0.1)',
  gold: '#D97706',
  green: '#16A34A',
  greenMuted: 'rgba(22, 163, 74, 0.1)',
  red: '#DC2626',
  redMuted: 'rgba(220, 38, 38, 0.1)',
  teal: '#0D9488',
  orange: '#F97316',
  orangeMuted: 'rgba(249, 115, 22, 0.1)',
  textDim: '#9CA3AF',
  textDark: '#374151',
  textDark2: '#4B5563',
  textMutedLegacy: '#6B7280',
  hover: 'rgba(30, 58, 138, 0.05)',
  hoverLight: 'rgba(30, 58, 138, 0.03)',
  active: 'rgba(30, 58, 138, 0.1)',
  sidebarGradient: 'linear-gradient(180deg, #1E3A8A 0%, #1E40AF 50%, #1D4ED8 100%)',
  sidebarGradientSubtle: 'linear-gradient(180deg, #1E3A8A 0%, #1E3A8A 100%)',
  sidebarBg: '#1E3A8A',
  sidebarText: '#FFFFFF',
  sidebarTextMuted: 'rgba(255, 255, 255, 0.7)',
  sidebarBorder: 'rgba(255, 255, 255, 0.1)',
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowLight: 'rgba(0, 0, 0, 0.05)',
  shadowMedium: 'rgba(0, 0, 0, 0.1)',
  shadowHeavy: 'rgba(0, 0, 0, 0.15)',
};

// Dark Theme - Professional Dark Mode
export const darkColors: ThemeColors = {
  primary: '#3B82F6',
  primaryLight: '#60A5FA',
  primaryLighter: '#93C5FD',
  primaryMuted: 'rgba(59, 130, 246, 0.15)',
  primaryMutedBg: 'rgba(59, 130, 246, 0.1)',
  secondary: '#3B82F6',
  secondaryMuted: 'rgba(59, 130, 246, 0.15)',
  success: '#22C55E',
  successLight: '#4ADE80',
  successMuted: 'rgba(34, 197, 94, 0.15)',
  successBg: 'rgba(34, 197, 94, 0.1)',
  warning: '#FBBF24',
  warningLight: '#FCD34D',
  warningMuted: 'rgba(251, 191, 36, 0.15)',
  warningBg: 'rgba(251, 191, 36, 0.1)',
  danger: '#EF4444',
  dangerLight: '#F87171',
  dangerMuted: 'rgba(239, 68, 68, 0.15)',
  dangerBg: 'rgba(239, 68, 68, 0.1)',
  info: '#38BDF8',
  infoMuted: 'rgba(56, 189, 248, 0.15)',
  purple: '#A78BFA',
  purpleMuted: 'rgba(167, 139, 250, 0.15)',
  bg: '#0F172A',
  bgSecondary: '#1E293B',
  bgTertiary: '#334155',
  card: '#1E293B',
  cardHover: '#334155',
  surface: '#1E293B',
  input: '#1E293B',
  inputBg: '#1E293B',
  header: '#1E293B',
  text: '#F1F5F9',
  textPrimary: '#F1F5F9',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  textLight: '#64748B',
  textInverse: '#0F172A',
  textInverseMuted: 'rgba(15, 23, 42, 0.8)',
  border: '#334155',
  borderLight: '#1E293B',
  borderDark: '#475569',
  focus: '#3B82F6',
  focusRing: 'rgba(59, 130, 246, 0.3)',
  accent: '#3B82F6',
  accentLight: '#60A5FA',
  accentMuted: 'rgba(59, 130, 246, 0.15)',
  gold: '#FBBF24',
  green: '#22C55E',
  greenMuted: 'rgba(34, 197, 94, 0.15)',
  red: '#EF4444',
  redMuted: 'rgba(239, 68, 68, 0.15)',
  teal: '#14B8A6',
  orange: '#FB923C',
  orangeMuted: 'rgba(251, 146, 60, 0.15)',
  textDim: '#64748B',
  textDark: '#94A3B8',
  textDark2: '#CBD5E1',
  textMutedLegacy: '#94A3B8',
  hover: 'rgba(59, 130, 246, 0.1)',
  hoverLight: 'rgba(59, 130, 246, 0.05)',
  active: 'rgba(59, 130, 246, 0.15)',
  sidebarGradient: 'linear-gradient(180deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
  sidebarGradientSubtle: 'linear-gradient(180deg, #0F172A 0%, #0F172A 100%)',
  sidebarBg: '#0F172A',
  sidebarText: '#F1F5F9',
  sidebarTextMuted: 'rgba(241, 245, 249, 0.7)',
  sidebarBorder: 'rgba(255, 255, 255, 0.08)',
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowLight: 'rgba(0, 0, 0, 0.2)',
  shadowMedium: 'rgba(0, 0, 0, 0.3)',
  shadowHeavy: 'rgba(0, 0, 0, 0.4)',
};

// Theme Context
interface ThemeContextType {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme Provider Component
interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultMode = 'light' 
}) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme-mode') as ThemeMode;
    if (saved) return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return defaultMode;
  });

  const colors = mode === 'light' ? lightColors : darkColors;

  const toggleTheme = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
    const root = document.documentElement;
    
    // Set color variables
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
    });
    
    // Set typography variables
    root.style.setProperty('--font-family', "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif");
    root.style.setProperty('--font-family-display', "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif");
    root.style.setProperty('--font-family-mono', "'JetBrains Mono', 'Fira Code', 'Consolas', monospace");
    root.style.setProperty('--font-size-xs', '11px');
    root.style.setProperty('--font-size-sm', '12px');
    root.style.setProperty('--font-size-base', '13px');
    root.style.setProperty('--font-size-md', '14px');
    root.style.setProperty('--font-size-lg', '15px');
    root.style.setProperty('--font-size-xl', '16px');
    root.style.setProperty('--font-size-xxl', '18px');
    root.style.setProperty('--font-size-xxxl', '20px');
    root.style.setProperty('--font-size-title', '24px');
    root.style.setProperty('--font-size-hero', '32px');
    root.style.setProperty('--font-weight-light', '300');
    root.style.setProperty('--font-weight-regular', '400');
    root.style.setProperty('--font-weight-medium', '500');
    root.style.setProperty('--font-weight-semibold', '600');
    root.style.setProperty('--font-weight-bold', '700');
    root.style.setProperty('--line-height-tight', '1.2');
    root.style.setProperty('--line-height-snug', '1.3');
    root.style.setProperty('--line-height-normal', '1.4');
    root.style.setProperty('--line-height-relaxed', '1.5');
    root.style.setProperty('--line-height-loose', '1.6');
    root.style.setProperty('--letter-spacing-tighter', '-0.02em');
    root.style.setProperty('--letter-spacing-tight', '-0.01em');
    root.style.setProperty('--letter-spacing-normal', '0');
    root.style.setProperty('--letter-spacing-wide', '0.01em');
    root.style.setProperty('--letter-spacing-wider', '0.025em');
    root.style.setProperty('--letter-spacing-widest', '0.05em');
    
    document.body.setAttribute('data-theme', mode);
  }, [mode, colors]);

  return (
    <ThemeContext.Provider value={{ mode, colors, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Export themes
export { lightColors as lightTheme, darkColors as darkTheme };


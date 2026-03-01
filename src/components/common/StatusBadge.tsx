// StatusBadge - AEVUM Enterprise ERP
// Reusable status badge component - Corporate Professional Theme

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
  className?: string;
}

// Helper function to get theme-aware colors
const getThemeColors = (mode: 'light' | 'dark') => ({
  success: mode === 'dark' ? '#22C55E' : '#16A34A',
  warning: mode === 'dark' ? '#FBBF24' : '#F59E0B',
  danger: mode === 'dark' ? '#EF4444' : '#DC2626',
  primary: mode === 'dark' ? '#3B82F6' : '#1E3A8A',
  info: mode === 'dark' ? '#38BDF8' : '#0EA5E9',
  purple: mode === 'dark' ? '#A78BFA' : '#8B5CF6',
  textMuted: mode === 'dark' ? '#94A3B8' : '#6B7280',
});

// Predefined status color configurations - Corporate palette
export const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  // Employee/Staff Status
  'Actif': { bg: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', label: 'Actif' },
  'Congé': { bg: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', label: 'Congé' },
  'Inactif': { bg: 'rgba(107, 114, 128, 0.1)', color: '#6B7280', label: 'Inactif' },
  'Suspendu': { bg: 'rgba(220, 38, 38, 0.1)', color: '#DC2626', label: 'Suspendu' },
  
  // Contract Types
  'CDI': { bg: 'rgba(30, 58, 138, 0.1)', color: '#1E3A8A', label: 'CDI' },
  'CDD': { bg: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', label: 'CDD' },
  'Freelance': { bg: 'rgba(14, 165, 233, 0.1)', color: '#0EA5E9', label: 'Freelance' },
  'Stage': { bg: 'rgba(217, 119, 6, 0.1)', color: '#D97706', label: 'Stage' },
  
  // Student Status
  'inscrit': { bg: 'rgba(30, 58, 138, 0.1)', color: '#1E3A8A', label: 'Inscrit' },
  'actif': { bg: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', label: 'Actif' },
  'attente': { bg: 'rgba(217, 119, 6, 0.1)', color: '#D97706', label: 'En attente' },
  'diplome': { bg: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', label: 'Diplômé' },
  'abandon': { bg: 'rgba(220, 38, 38, 0.1)', color: '#DC2626', label: 'Abandon' },
  
  // Document Status
  'draft': { bg: 'rgba(30, 58, 138, 0.1)', color: '#1E3A8A', label: 'Brouillon' },
  'pending_signature': { bg: 'rgba(217, 119, 6, 0.1)', color: '#D97706', label: 'En attente signature' },
  'signed': { bg: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', label: 'Signé' },
  'expired': { bg: 'rgba(220, 38, 38, 0.1)', color: '#DC2626', label: 'Expiré' },
  
  // Project Status
  'demarrage': { bg: 'rgba(30, 58, 138, 0.1)', color: '#1E3A8A', label: 'Démarrage' },
  'en_cours': { bg: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', label: 'En cours' },
  'finalisation': { bg: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', label: 'Finalisation' },
  'termine': { bg: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', label: 'Terminé' },
  
  // Project Priority
  'basse': { bg: 'rgba(30, 58, 138, 0.1)', color: '#1E3A8A', label: 'Basse' },
  'moyenne': { bg: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', label: 'Moyenne' },
  'haute': { bg: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', label: 'Haute' },
  'critique': { bg: 'rgba(220, 38, 38, 0.1)', color: '#DC2626', label: 'Critique' },
  
  // Leave Status
  'pending': { bg: 'rgba(217, 119, 6, 0.1)', color: '#D97706', label: 'En attente' },
  'approved': { bg: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', label: 'Approuvé' },
  'rejected': { bg: 'rgba(220, 38, 38, 0.1)', color: '#DC2626', label: 'Rejeté' },
  'cancelled': { bg: 'rgba(107, 114, 128, 0.1)', color: '#6B7280', label: 'Annulé' },
  
  // Invoice Status
  'paye': { bg: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', label: 'Payé' },
  'en_attente': { bg: 'rgba(217, 119, 6, 0.1)', color: '#D97706', label: 'En attente' },
  'partiel': { bg: 'rgba(30, 58, 138, 0.1)', color: '#1E3A8A', label: 'Partiel' },
  
  // Stock Status
  'OK': { bg: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', label: 'OK' },
  'Attention': { bg: 'rgba(217, 119, 6, 0.1)', color: '#D97706', label: 'Attention' },
  'Critique': { bg: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', label: 'Critique' },
  'Rupture': { bg: 'rgba(220, 38, 38, 0.1)', color: '#DC2626', label: 'Rupture' },
  
  // Teacher Status
  'inactif': { bg: 'rgba(30, 58, 138, 0.1)', color: '#1E3A8A', label: 'Inactif' },
  'conge': { bg: 'rgba(217, 119, 6, 0.1)', color: '#D97706', label: 'Congé' },
  
  // Assignment Status
  'assigned': { bg: 'rgba(30, 58, 138, 0.1)', color: '#1E3A8A', label: 'Assigné' },
  'returned': { bg: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', label: 'Retourné' },
  'maintenance': { bg: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', label: 'Maintenance' },
  'active': { bg: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', label: 'Actif' },
  
  // Maintenance
  'preventive': { bg: 'rgba(30, 58, 138, 0.1)', color: '#1E3A8A', label: 'Préventive' },
  'corrective': { bg: 'rgba(220, 38, 38, 0.1)', color: '#DC2626', label: 'Corrective' },
  
  // Task Status
  'todo': { bg: 'rgba(30, 58, 138, 0.1)', color: '#1E3A8A', label: 'À faire' },
  'in_progress': { bg: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', label: 'En cours' },
  'review': { bg: 'rgba(217, 119, 6, 0.1)', color: '#D97706', label: 'En révision' },
  'done': { bg: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', label: 'Terminé' },
  
  // Grade ranges
  'excellent': { bg: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', label: 'Excellent' },
  'tres_bien': { bg: 'rgba(30, 58, 138, 0.1)', color: '#1E3A8A', label: 'Très Bien' },
  'bien': { bg: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', label: 'Bien' },
  'passable': { bg: 'rgba(217, 119, 6, 0.1)', color: '#D97706', label: 'Passable' },
  'insuffisant': { bg: 'rgba(220, 38, 38, 0.1)', color: '#DC2626', label: 'Insuffisant' },
};

// Variant-based colors for custom statuses
const variantColors = {
  default: { bg: 'rgba(30, 58, 138, 0.1)', color: '#1E3A8A' },
  success: { bg: 'rgba(22, 163, 74, 0.1)', color: '#16A34A' },
  warning: { bg: 'rgba(217, 119, 6, 0.1)', color: '#D97706' },
  danger: { bg: 'rgba(220, 38, 38, 0.1)', color: '#DC2626' },
  info: { bg: 'rgba(14, 165, 233, 0.1)', color: '#0EA5E9' },
  primary: { bg: 'rgba(30, 58, 138, 0.1)', color: '#1E3A8A' },
};

// Size configurations
const sizeStyles = {
  sm: { padding: '2px 8px', fontSize: 10, borderRadius: 4 },
  md: { padding: '4px 10px', fontSize: 11, borderRadius: 6 },
  lg: { padding: '6px 14px', fontSize: 12, borderRadius: 8 },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  variant = 'default',
  size = 'md',
  style,
  className 
}) => {
  const { mode } = useTheme();
  const themeColors = getThemeColors(mode);
  
  // Get config from predefined statuses or use variant
  const baseConfig = statusConfig[status] ? { ...statusConfig[status] } : { ...variantColors[variant], label: status };
  const sizeStyle = sizeStyles[size];
  
  // Adjust colors for dark mode
  const getDarkModeConfig = () => {
    const config = { ...baseConfig };
    if (statusConfig[status]) {
      // Map predefined colors to dark mode equivalents
      if (config.color === '#16A34A') config.color = themeColors.success;
      else if (config.color === '#F59E0B') config.color = themeColors.warning;
      else if (config.color === '#DC2626') config.color = themeColors.danger;
      else if (config.color === '#1E3A8A') config.color = themeColors.primary;
      else if (config.color === '#8B5CF6') config.color = themeColors.purple;
      else if (config.color === '#0EA5E9') config.color = themeColors.info;
      else if (config.color === '#6B7280') config.color = themeColors.textMuted;
    } else {
      // Variant colors
      if (variant === 'success') config.color = themeColors.success;
      else if (variant === 'warning') config.color = themeColors.warning;
      else if (variant === 'danger') config.color = themeColors.danger;
      else if (variant === 'info') config.color = themeColors.info;
      else if (variant === 'primary') config.color = themeColors.primary;
    }
    return config;
  };
  
  const config = mode === 'dark' ? getDarkModeConfig() : baseConfig;
  
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: sizeStyle.padding,
        borderRadius: sizeStyle.borderRadius,
        fontSize: sizeStyle.fontSize,
        fontWeight: 500,
        background: config.bg,
        color: config.color,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.03em',
        ...style,
      }}
    >
      {config.label || status}
    </span>
  );
};

// Helper function to get status config for custom use
export const getStatusConfig = (status: string): { bg: string; color: string; label: string } => {
  return statusConfig[status] || { ...variantColors.default, label: status };
};

// Helper function to get color by status
export const getStatusColor = (status: string): string => {
  return statusConfig[status]?.color || variantColors.default.color;
};

export default StatusBadge;


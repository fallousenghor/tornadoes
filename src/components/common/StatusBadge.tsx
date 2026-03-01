// StatusBadge - AEVUM Enterprise ERP
// Corporate Professional Status Badge Component

import React from 'react';
import { Colors, BorderRadius } from '../../constants/theme';

export interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
  className?: string;
}

// Predefined status color configurations - Corporate Professional Palette
export const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  // ===========================================
  // EMPLOYEE/STAFF STATUS
  // ===========================================
  'Actif': { 
    bg: 'rgba(22, 163, 74, 0.1)', 
    color: '#16A34A', 
    label: 'Actif' 
  },
  'Congé': { 
    bg: 'rgba(245, 158, 11, 0.1)', 
    color: '#D97706', 
    label: 'Congé' 
  },
  'Inactif': { 
    bg: 'rgba(107, 114, 128, 0.1)', 
    color: '#6B7280', 
    label: 'Inactif' 
  },
  'Suspendu': { 
    bg: 'rgba(220, 38, 38, 0.1)', 
    color: '#DC2626', 
    label: 'Suspendu' 
  },
  
  // ===========================================
  // CONTRACT TYPES
  // ===========================================
  'CDI': { 
    bg: 'rgba(30, 58, 138, 0.1)', 
    color: '#1E3A8A', 
    label: 'CDI' 
  },
  'CDD': { 
    bg: 'rgba(139, 92, 246, 0.1)', 
    color: '#8B5CF6', 
    label: 'CDD' 
  },
  'Freelance': { 
    bg: 'rgba(14, 165, 233, 0.1)', 
    color: '#0EA5E9', 
    label: 'Freelance' 
  },
  'Stage': { 
    bg: 'rgba(217, 119, 6, 0.1)', 
    color: '#D97706', 
    label: 'Stage' 
  },
  
  // ===========================================
  // STUDENT STATUS
  // ===========================================
  'inscrit': { 
    bg: 'rgba(30, 58, 138, 0.1)', 
    color: '#1E3A8A', 
    label: 'Inscrit' 
  },
  'actif': { 
    bg: 'rgba(22, 163, 74, 0.1)', 
    color: '#16A34A', 
    label: 'Actif' 
  },
  'attente': { 
    bg: 'rgba(217, 119, 6, 0.1)', 
    color: '#D97706', 
    label: 'En attente' 
  },
  'diplome': { 
    bg: 'rgba(139, 92, 246, 0.1)', 
    color: '#8B5CF6', 
    label: 'Diplômé' 
  },
  'abandon': { 
    bg: 'rgba(220, 38, 38, 0.1)', 
    color: '#DC2626', 
    label: 'Abandon' 
  },
  
  // ===========================================
  // DOCUMENT STATUS
  // ===========================================
  'draft': { 
    bg: 'rgba(107, 114, 128, 0.1)', 
    color: '#6B7280', 
    label: 'Brouillon' 
  },
  'pending_signature': { 
    bg: 'rgba(217, 119, 6, 0.1)', 
    color: '#D97706', 
    label: 'En attente signature' 
  },
  'signed': { 
    bg: 'rgba(22, 163, 74, 0.1)', 
    color: '#16A34A', 
    label: 'Signé' 
  },
  'expired': { 
    bg: 'rgba(220, 38, 38, 0.1)', 
    color: '#DC2626', 
    label: 'Expiré' 
  },
  
  // ===========================================
  // PROJECT STATUS
  // ===========================================
  'demarrage': { 
    bg: 'rgba(30, 58, 138, 0.1)', 
    color: '#1E3A8A', 
    label: 'Démarrage' 
  },
  'en_cours': { 
    bg: 'rgba(22, 163, 74, 0.1)', 
    color: '#16A34A', 
    label: 'En cours' 
  },
  'finalisation': { 
    bg: 'rgba(139, 92, 246, 0.1)', 
    color: '#8B5CF6', 
    label: 'Finalisation' 
  },
  'termine': { 
    bg: 'rgba(22, 163, 74, 0.1)', 
    color: '#16A34A', 
    label: 'Terminé' 
  },
  
  // ===========================================
  // PROJECT PRIORITY
  // ===========================================
  'basse': { 
    bg: 'rgba(107, 114, 128, 0.1)', 
    color: '#6B7280', 
    label: 'Basse' 
  },
  'moyenne': { 
    bg: 'rgba(30, 58, 138, 0.1)', 
    color: '#1E3A8A', 
    label: 'Moyenne' 
  },
  'haute': { 
    bg: 'rgba(217, 119, 6, 0.1)', 
    color: '#D97706', 
    label: 'Haute' 
  },
  'critique': { 
    bg: 'rgba(220, 38, 38, 0.1)', 
    color: '#DC2626', 
    label: 'Critique' 
  },
  
  // ===========================================
  // LEAVE STATUS
  // ===========================================
  'pending': { 
    bg: 'rgba(217, 119, 6, 0.1)', 
    color: '#D97706', 
    label: 'En attente' 
  },
  'approved': { 
    bg: 'rgba(22, 163, 74, 0.1)', 
    color: '#16A34A', 
    label: 'Approuvé' 
  },
  'rejected': { 
    bg: 'rgba(220, 38, 38, 0.1)', 
    color: '#DC2626', 
    label: 'Rejeté' 
  },
  'cancelled': { 
    bg: 'rgba(107, 114, 128, 0.1)', 
    color: '#6B7280', 
    label: 'Annulé' 
  },
  
  // ===========================================
  // INVOICE STATUS
  // ===========================================
  'paye': { 
    bg: 'rgba(22, 163, 74, 0.1)', 
    color: '#16A34A', 
    label: 'Payé' 
  },
  'en_attente': { 
    bg: 'rgba(217, 119, 6, 0.1)', 
    color: '#D97706', 
    label: 'En attente' 
  },
  'partiel': { 
    bg: 'rgba(30, 58, 138, 0.1)', 
    color: '#1E3A8A', 
    label: 'Partiel' 
  },
  
  // ===========================================
  // STOCK STATUS
  // ===========================================
  'OK': { 
    bg: 'rgba(22, 163, 74, 0.1)', 
    color: '#16A34A', 
    label: 'OK' 
  },
  'Attention': { 
    bg: 'rgba(217, 119, 6, 0.1)', 
    color: '#D97706', 
    label: 'Attention' 
  },
  'Critique': { 
    bg: 'rgba(220, 38, 38, 0.1)', 
    color: '#DC2626', 
    label: 'Critique' 
  },
  'Rupture': { 
    bg: 'rgba(220, 38, 38, 0.1)', 
    color: '#DC2626', 
    label: 'Rupture' 
  },
  
  // ===========================================
  // TEACHER STATUS
  // ===========================================
  'inactif': { 
    bg: 'rgba(107, 114, 128, 0.1)', 
    color: '#6B7280', 
    label: 'Inactif' 
  },
  'conge': { 
    bg: 'rgba(217, 119, 6, 0.1)', 
    color: '#D97706', 
    label: 'Congé' 
  },
  
  // ===========================================
  // ASSIGNMENT STATUS
  // ===========================================
  'assigned': { 
    bg: 'rgba(30, 58, 138, 0.1)', 
    color: '#1E3A8A', 
    label: 'Assigné' 
  },
  'returned': { 
    bg: 'rgba(22, 163, 74, 0.1)', 
    color: '#16A34A', 
    label: 'Retourné' 
  },
  'maintenance': { 
    bg: 'rgba(217, 119, 6, 0.1)', 
    color: '#D97706', 
    label: 'Maintenance' 
  },
  'active': { 
    bg: 'rgba(22, 163, 74, 0.1)', 
    color: '#16A34A', 
    label: 'Actif' 
  },
  
  // ===========================================
  // MAINTENANCE
  // ===========================================
  'preventive': { 
    bg: 'rgba(30, 58, 138, 0.1)', 
    color: '#1E3A8A', 
    label: 'Préventive' 
  },
  'corrective': { 
    bg: 'rgba(220, 38, 38, 0.1)', 
    color: '#DC2626', 
    label: 'Corrective' 
  },
  
  // ===========================================
  // TASK STATUS
  // ===========================================
  'todo': { 
    bg: 'rgba(107, 114, 128, 0.1)', 
    color: '#6B7280', 
    label: 'À faire' 
  },
  'in_progress': { 
    bg: 'rgba(30, 58, 138, 0.1)', 
    color: '#1E3A8A', 
    label: 'En cours' 
  },
  'review': { 
    bg: 'rgba(139, 92, 246, 0.1)', 
    color: '#8B5CF6', 
    label: 'En révision' 
  },
  'done': { 
    bg: 'rgba(22, 163, 74, 0.1)', 
    color: '#16A34A', 
    label: 'Terminé' 
  },
  
  // ===========================================
  // GRADE RANGES
  // ===========================================
  'excellent': { 
    bg: 'rgba(22, 163, 74, 0.1)', 
    color: '#16A34A', 
    label: 'Excellent' 
  },
  'tres_bien': { 
    bg: 'rgba(30, 58, 138, 0.1)', 
    color: '#1E3A8A', 
    label: 'Très Bien' 
  },
  'bien': { 
    bg: 'rgba(139, 92, 246, 0.1)', 
    color: '#8B5CF6', 
    label: 'Bien' 
  },
  'passable': { 
    bg: 'rgba(217, 119, 6, 0.1)', 
    color: '#D97706', 
    label: 'Passable' 
  },
  'insuffisant': { 
    bg: 'rgba(220, 38, 38, 0.1)', 
    color: '#DC2626', 
    label: 'Insuffisant' 
  },
};

// Variant-based colors for custom statuses - Corporate Palette
const variantColors = {
  default: { 
    bg: 'rgba(30, 58, 138, 0.1)', 
    color: '#1E3A8A' 
  },
  success: { 
    bg: 'rgba(22, 163, 74, 0.1)', 
    color: '#16A34A' 
  },
  warning: { 
    bg: 'rgba(217, 119, 6, 0.1)', 
    color: '#D97706' 
  },
  danger: { 
    bg: 'rgba(220, 38, 38, 0.1)', 
    color: '#DC2626' 
  },
  info: { 
    bg: 'rgba(14, 165, 233, 0.1)', 
    color: '#0EA5E9' 
  },
  primary: { 
    bg: 'rgba(30, 58, 138, 0.1)', 
    color: '#1E3A8A' 
  },
};

// Size configurations - Professional sizing
const sizeStyles = {
  sm: { 
    padding: '3px 8px', 
    fontSize: 10, 
    borderRadius: 4 
  },
  md: { 
    padding: '4px 10px', 
    fontSize: 11, 
    borderRadius: 6 
  },
  lg: { 
    padding: '6px 14px', 
    fontSize: 12, 
    borderRadius: 8 
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  variant = 'default',
  size = 'md',
  style,
  className 
}) => {
  // Get config from predefined statuses or use variant
  const config = statusConfig[status] 
    ? { ...statusConfig[status] } 
    : { ...variantColors[variant], label: status };
  
  const sizeStyle = sizeStyles[size];
  
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: sizeStyle.padding,
        borderRadius: sizeStyle.borderRadius,
        fontSize: sizeStyle.fontSize,
        fontWeight: 600,
        background: config.bg,
        color: config.color,
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
        fontFamily: "'DM Sans', sans-serif",
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


// StatusBadge - AEVUM Enterprise ERP
// Reusable status badge component - DRY Principle

import React from 'react';

export interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
  className?: string;
}

// Predefined status color configurations
export const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  // Employee/Staff Status
  'Actif': { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'Actif' },
  'Congé': { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', label: 'Congé' },
  'Inactif': { bg: 'rgba(160, 174, 192, 0.15)', color: '#a0aeb0', label: 'Inactif' },
  'Suspendu': { bg: 'rgba(224, 80, 80, 0.15)', color: '#e05050', label: 'Suspendu' },
  
  // Contract Types
  'CDI': { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff', label: 'CDI' },
  'CDD': { bg: 'rgba(167, 139, 250, 0.15)', color: '#a78bfa', label: 'CDD' },
  'Freelance': { bg: 'rgba(45, 212, 191, 0.15)', color: '#2dd4bf', label: 'Freelance' },
  'Stage': { bg: 'rgba(201, 168, 76, 0.15)', color: '#c9a84c', label: 'Stage' },
  
  // Student Status
  'inscrit': { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff', label: 'Inscrit' },
  'actif': { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'Actif' },
  'attente': { bg: 'rgba(201, 168, 76, 0.15)', color: '#c9a84c', label: 'En attente' },
  'diplome': { bg: 'rgba(167, 139, 250, 0.15)', color: '#a78bfa', label: 'Diplômé' },
  'abandon': { bg: 'rgba(224, 80, 80, 0.15)', color: '#e05050', label: 'Abandon' },
  
  // Document Status
  'draft': { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff', label: 'Brouillon' },
  'pending_signature': { bg: 'rgba(201, 168, 76, 0.15)', color: '#c9a84c', label: 'En attente signature' },
  'signed': { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'Signé' },
  'expired': { bg: 'rgba(224, 80, 80, 0.15)', color: '#e05050', label: 'Expiré' },
  
  // Project Status
  'demarrage': { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff', label: 'Démarrage' },
  'en_cours': { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'En cours' },
  'finalisation': { bg: 'rgba(201, 168, 76, 0.15)', color: '#c9a84c', label: 'Finalisation' },
  'termine': { bg: 'rgba(167, 139, 250, 0.15)', color: '#a78bfa', label: 'Terminé' },
  
  // Project Priority
  'basse': { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff', label: 'Basse' },
  'moyenne': { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'Moyenne' },
  'haute': { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', label: 'Haute' },
  'critique': { bg: 'rgba(224, 80, 80, 0.15)', color: '#e05050', label: 'Critique' },
  
  // Leave Status
  'pending': { bg: 'rgba(201, 168, 76, 0.15)', color: '#c9a84c', label: 'En attente' },
  'approved': { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'Approuvé' },
  'rejected': { bg: 'rgba(224, 80, 80, 0.15)', color: '#e05050', label: 'Rejeté' },
  'cancelled': { bg: 'rgba(160, 174, 192, 0.15)', color: '#a0aeb0', label: 'Annulé' },
  
  // Invoice Status
  'paye': { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'Payé' },
  'en_attente': { bg: 'rgba(201, 168, 76, 0.15)', color: '#c9a84c', label: 'En attente' },
  'partiel': { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff', label: 'Partiel' },
  
  // Stock Status
  'OK': { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'OK' },
  'Attention': { bg: 'rgba(201, 168, 76, 0.15)', color: '#c9a84c', label: 'Attention' },
  'Critique': { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', label: 'Critique' },
  'Rupture': { bg: 'rgba(224, 80, 80, 0.15)', color: '#e05050', label: 'Rupture' },
  
  // Teacher Status
  'inactif': { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff', label: 'Inactif' },
  'conge': { bg: 'rgba(201, 168, 76, 0.15)', color: '#c9a84c', label: 'Congé' },
  
  // Assignment Status
  'assigned': { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff', label: 'Assigné' },
  'returned': { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'Retourné' },
  'maintenance': { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', label: 'Maintenance' },
  'active': { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'Actif' },
  
  // Maintenance
  'preventive': { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff', label: 'Préventive' },
  'corrective': { bg: 'rgba(224, 80, 80, 0.15)', color: '#e05050', label: 'Corrective' },
  
  // Task Status
  'todo': { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff', label: 'À faire' },
  'in_progress': { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'En cours' },
  'review': { bg: 'rgba(201, 168, 76, 0.15)', color: '#c9a84c', label: 'En révision' },
  'done': { bg: 'rgba(167, 139, 250, 0.15)', color: '#a78bfa', label: 'Terminé' },
  
  // Grade ranges
  'excellent': { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'Excellent' },
  'tres_bien': { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff', label: 'Très Bien' },
  'bien': { bg: 'rgba(167, 139, 250, 0.15)', color: '#a78bfa', label: 'Bien' },
  'passable': { bg: 'rgba(201, 168, 76, 0.15)', color: '#c9a84c', label: 'Passable' },
  'insuffisant': { bg: 'rgba(224, 80, 80, 0.15)', color: '#e05050', label: 'Insuffisant' },
};

// Variant-based colors for custom statuses
const variantColors = {
  default: { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff' },
  success: { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e' },
  warning: { bg: 'rgba(201, 168, 76, 0.15)', color: '#c9a84c' },
  danger: { bg: 'rgba(224, 80, 80, 0.15)', color: '#e05050' },
  info: { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff' },
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
  // Get config from predefined statuses or use variant
  const config = statusConfig[status] ? { ...statusConfig[status] } : { ...variantColors[variant], label: status };
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
        fontWeight: 500,
        background: config.bg,
        color: config.color,
        textTransform: 'uppercase',
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


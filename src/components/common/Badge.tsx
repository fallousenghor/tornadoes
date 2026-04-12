// Badge Component - AEVUM Enterprise ERP
// Corporate Professional Theme - B2B SaaS Design System

import React from 'react';
import { BorderRadius, Spacing, FontSizes, FontWeights, Transitions } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

export interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  type?: 'status' | 'contract' | 'priority' | 'custom';
  variant?: 'solid' | 'soft' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  color,
  type = 'custom',
  variant = 'soft',
  size = 'md',
  className = '',
  style,
  icon,
  onClick,
}) => {
  const { colors } = useTheme();

  const getBadgeColor = (): string => {
    if (color) return color;
    if (type === 'status' && typeof children === 'string') {
      return getStatusColor(children);
    }
    if (type === 'contract' && typeof children === 'string') {
      return getContractColor(children);
    }
    if (type === 'priority' && typeof children === 'string') {
      return getPriorityColor(children);
    }
    return colors.primary;
  };

  const badgeColor = getBadgeColor();

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'solid':
        return {
          background: badgeColor,
          color: '#FFFFFF',
        };
      case 'outline':
        return {
          background: 'transparent',
          color: badgeColor,
          border: `1px solid ${badgeColor}`,
        };
      case 'soft':
      default:
        return {
          background: `${badgeColor}15`,
          color: badgeColor,
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return {
          fontSize: FontSizes.xs,
          padding: `${Spacing.xs}px ${Spacing.sm}px`,
          gap: Spacing.xs,
        };
      case 'md':
      default:
        return {
          fontSize: FontSizes.sm,
          padding: `${Spacing.xs + 2}px ${Spacing.sm + 2}px`,
          gap: Spacing.sm,
        };
    }
  };

  const baseStyle: React.CSSProperties = {
    ...getVariantStyles(),
    ...getSizeStyles(),
    fontWeight: FontWeights.semibold,
    borderRadius: BorderRadius.full,
    fontFamily: "'DM Sans', sans-serif",
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    transition: Transitions.fast,
    cursor: onClick ? 'pointer' : 'default',
    letterSpacing: '0.01em',
    ...style,
  };

  return (
    <span className={className} style={baseStyle} onClick={onClick}>
      {icon && <span style={{ marginRight: 4 }}>{icon}</span>}
      {children}
    </span>
  );
};

// Stat Badge - Shows percentage change
export interface StatBadgeProps {
  value: number;
  className?: string;
  showIcon?: boolean;
}

export const StatBadge: React.FC<StatBadgeProps> = ({ value, className = '', showIcon = true }) => {
  const { colors } = useTheme();
  const isPositive = value >= 0;
  const color = isPositive ? colors.success : colors.danger;
  const bg = `${color}15`;

  const style: React.CSSProperties = {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    padding: `${Spacing.xs - 2}px ${Spacing.sm}px`,
    borderRadius: BorderRadius.sm,
    fontFamily: "'DM Sans', sans-serif",
    background: bg,
    color: color,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
  };

  return (
    <span className={className} style={style}>
      {showIcon && <span>{isPositive ? '↑' : '↓'}</span>}
      {Math.abs(value)}%
    </span>
  );
};

// Helper functions for status colors
const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    // Employee status
    'Actif': '#16A34A',
    'Congé': '#F59E0B',
    'Inactif': '#6B7280',
    'Suspendu': '#DC2626',
    'Démission': '#6B7280',
    'Licencié': '#DC2626',
    
    // Invoice status
    'Payé': '#16A34A',
    'En attente': '#F59E0B',
    'Partiel': '#1E3A8A',
    'Annulé': '#6B7280',
    'Retard': '#DC2626',

    // Project status
    'Démarrage': '#1E3A8A',
    'En cours': '#16A34A',
    'Finalisation': '#8B5CF6',
    'Terminé': '#16A34A',
    'En pause': '#F59E0B',
    
    // Leave status
    'approved': '#16A34A',
    'pending': '#F59E0B',
    'rejected': '#DC2626',
    
    // Priority
    'Haute': '#DC2626',
    'Critique': '#DC2626',
    'Urgente': '#F59E0B',
    'Moyenne': '#1E3A8A',
    'Basse': '#6B7280',
    
    // Document status
    'Signé': '#16A34A',
    'En signature': '#F59E0B',
    'Brouillon': '#6B7280',
    'Expiré': '#DC2626',
    
    // Payment status
    'Reçu': '#16A34A',
    'Traité': '#16A34A',
    'Échoué': '#DC2626',
  };
  return statusColors[status] || '#1E3A8A';
};

const getContractColor = (contract: string): string => {
  const colors: Record<string, string> = {
    'CDI': '#16A34A',
    'CDD': '#8B5CF6',
    'Freelance': '#0EA5E9',
    'Stage': '#D97706',
    'Apprentissage': '#0D9488',
    'Intérim': '#F97316',
  };
  return colors[contract] || '#1E3A8A';
};

const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    'Critique': '#DC2626',
    'Haute': '#DC2626',
    'Urgente': '#F59E0B',
    'Moyenne': '#1E3A8A',
    'Normale': '#1E3A8A',
    'Basse': '#6B7280',
  };
  return colors[priority] || '#1E3A8A';
};

export default Badge;


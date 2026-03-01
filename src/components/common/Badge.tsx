// Badge Component - AEVUM Enterprise ERP
// Corporate Professional Theme - B2B SaaS Design System

import React from 'react';
import { BorderRadius, Spacing, FontSizes } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  type?: 'status' | 'contract' | 'custom';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  color,
  type = 'custom',
  className = '' 
}) => {
  const { mode } = useTheme();
  
  const getBadgeColor = (): string => {
    if (color) return color;
    if (type === 'status' && typeof children === 'string') {
      return getStatusColor(children);
    }
    if (type === 'contract' && typeof children === 'string') {
      return getContractColor(children);
    }
    return mode === 'dark' ? '#3B82F6' : '#1E3A8A';
  };

  const badgeColor = getBadgeColor();

  const style: React.CSSProperties = {
    fontSize: FontSizes.xs,
    fontWeight: 600,
    padding: `${Spacing.xs + 2}px ${Spacing.sm}px`,
    borderRadius: BorderRadius.full,
    fontFamily: "'DM Sans', sans-serif",
    background: `${badgeColor}15`,
    color: badgeColor,
    display: 'inline-flex',
    alignItems: 'center',
    gap: Spacing.xs,
  };

  return (
    <span className={className} style={style}>
      {children}
    </span>
  );
};

// Stat Badge - Shows percentage change
interface StatBadgeProps {
  value: number;
  className?: string;
}

export const StatBadge: React.FC<StatBadgeProps> = ({ value, className = '' }) => {
  const { colors, mode } = useTheme();
  const isPositive = value > 0;
  const color = isPositive ? colors.success : colors.danger;
  const bg = isPositive ? `${colors.success}15` : `${colors.danger}15`;

  const style: React.CSSProperties = {
    fontSize: FontSizes.xs,
    fontWeight: 700,
    padding: '2px 6px',
    borderRadius: BorderRadius.sm,
    fontFamily: "'DM Sans', sans-serif",
    background: bg,
    color: color,
  };

  return (
    <span className={className} style={style}>
      {isPositive ? '▲' : '▼'} {Math.abs(value)}%
    </span>
  );
};

// Helper functions for status colors
const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    'Actif': '#16A34A',
    'Congé': '#F59E0B',
    'Inactif': '#6B7280',
    'Suspendu': '#DC2626',
    'Payé': '#16A34A',
    'En attente': '#F59E0B',
    'Partiel': '#1E3A8A',
    'Démarrage': '#1E3A8A',
    'En cours': '#16A34A',
    'Finalisation': '#8B5CF6',
    'Terminé': '#16A34A',
    'approved': '#16A34A',
    'pending': '#F59E0B',
    'rejected': '#DC2626',
    'Haute': '#DC2626',
    'Critique': '#DC2626',
    'Urgente': '#F59E0B',
    'Moyenne': '#1E3A8A',
    'Basse': '#6B7280',
  };
  return statusColors[status] || '#1E3A8A';
};

const getContractColor = (contract: string): string => {
  const colors: Record<string, string> = {
    'CDI': '#16A34A',
    'CDD': '#8B5CF6',
    'Freelance': '#0EA5E9',
    'Stage': '#D97706',
  };
  return colors[contract] || '#1E3A8A';
};

export default Badge;


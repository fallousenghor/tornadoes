// Badge Component - AEVUM Enterprise ERP
// Corporate Professional Badge Component

import React from 'react';
import { Colors, BorderRadius, Spacing, FontSizes } from '../../constants/theme';
import { getStatusColor } from '../../utils';

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
  const getBadgeColor = (): string => {
    if (color) return color;
    if (type === 'status' && typeof children === 'string') {
      return getStatusColor(children);
    }
    if (type === 'contract' && typeof children === 'string') {
      const contractColors: Record<string, string> = {
        'CDI': '#16A34A',
        'CDD': '#8B5CF6',
        'Freelance': '#0EA5E9',
        'Stage': '#D97706',
      };
      return contractColors[children] || Colors.primary;
    }
    return Colors.primary;
  };

  const badgeColor = getBadgeColor();

  const style: React.CSSProperties = {
    fontSize: FontSizes.xs,
    fontWeight: 600,
    padding: `${Spacing.xs + 2}px ${Spacing.sm + 2}px`,
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
  const isPositive = value > 0;
  const color = isPositive ? Colors.success : Colors.danger;
  const bg = isPositive ? Colors.successMuted : Colors.dangerMuted;

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

export default Badge;

